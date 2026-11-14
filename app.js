// Wildwood — a private, single-user study reader.
// Course content lives in content.js and texts/. Progress, notes and logs live in Supabase,
// in tables that only the owner's account can read or write.
import { APP, SOURCES, BOOKS, LINKSETS, GUIDES, PLAN, GAPS, SHELF, ORDER, allItems, getItem, countable } from './content.js';

const CFG = {
  url: 'https://tmzlclbpscxrgzpnryma.supabase.co',
  key: 'sb_publishable_29BxUoeaIRaSbAGNV_DFgw_wXTPsJPl', // publishable key; safe in public code
  owner: 'bc1e7dd2-e0fd-48fd-bdb0-218237bd0e11',
};
const sb = window.supabase.createClient(CFG.url, CFG.key, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'wildwood-auth' },
});

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage full or unavailable */ } };

// ---------- Appearance (kept on the device, mirrored to the account) ----------
const ui = Object.assign({ size: 19, night: false }, lsGet('wildwood:ui', {}));
const sizeLabel = () => `Text size ${Math.round((ui.size / 19) * 100)}%${ui.size <= 14 ? ' (smallest)' : ui.size >= 30 ? ' (largest)' : ''}`;
function applyUi() {
  document.documentElement.classList.toggle('night', !!ui.night);
  document.documentElement.style.setProperty('--read-size', ui.size + 'px');
  // the rest of the app scales with the same setting, within a range that keeps the layout usable
  document.documentElement.style.fontSize = Math.round(Math.min(135, Math.max(88, (ui.size / 19) * 100))) + '%';
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = ui.night ? '#0b0b0b' : '#ffffff';
  lsSet('wildwood:ui', ui);
}
applyUi();

// ---------- Store ----------
const KINDS = {
  reflection: { label: 'Reflections', one: 'reflection' },
  practicum: { label: 'Practicum log', one: 'lesson' },
  arts: { label: 'Arts practice', one: 'session' },
  observation: { label: 'Observation and mentoring', one: 'entry' },
};
const store = {
  uid: null, progress: {}, notes: {}, journal: [], bookmarks: [], state: {}, outbox: [], syncing: false, lastError: '',
  key() { return 'wildwood:data:' + this.uid; },
  loadLocal() {
    const d = lsGet(this.key(), null);
    if (d) Object.assign(this, { progress: d.progress || {}, notes: d.notes || {}, journal: d.journal || [], bookmarks: d.bookmarks || [], state: d.state || {}, outbox: d.outbox || [] });
  },
  saveLocal() { lsSet(this.key(), { progress: this.progress, notes: this.notes, journal: this.journal, bookmarks: this.bookmarks, state: this.state, outbox: this.outbox }); },
  queue(op) {
    if (op.k) this.outbox = this.outbox.filter((o) => o.k !== op.k);
    this.outbox.push(op); this.saveLocal(); this.flush();
  },
  async flush() {
    if (this.syncing || !this.uid) return; this.syncing = true; paintSync();
    try {
      while (this.outbox.length) {
        const op = this.outbox[0]; let res;
        if (op.op === 'upsert') res = await sb.from(op.t).upsert(op.row, { onConflict: op.c });
        else res = await sb.from(op.t).delete().match(op.match);
        if (res.error) throw res.error;
        this.outbox.shift(); this.saveLocal();
      }
      this.lastError = '';
    } catch (e) { this.lastError = e.message || String(e); }
    this.syncing = false; paintSync();
  },
  async pull() {
    await this.flush();
    if (this.outbox.length) return false; // keep unsent local changes; do not overwrite them
    const [p, n, j, b, s] = await Promise.all([
      sb.from('wte_progress').select('item_id,status'),
      sb.from('wte_notes').select('item_id,body'),
      sb.from('wte_journal').select('*').order('entry_date', { ascending: false }).order('created_at', { ascending: false }),
      sb.from('wte_bookmarks').select('*').order('created_at', { ascending: false }),
      sb.from('wte_state').select('data').maybeSingle(),
    ]);
    const err = [p, n, j, b, s].find((r) => r.error);
    if (err) { this.lastError = err.error.message; paintSync(); return false; }
    this.progress = Object.fromEntries(p.data.map((r) => [r.item_id, r.status]));
    this.notes = Object.fromEntries(n.data.filter((r) => r.body).map((r) => [r.item_id, r.body]));
    this.journal = j.data; this.bookmarks = b.data; this.state = (s.data && s.data.data) || {};
    if (this.state.ui) { Object.assign(ui, this.state.ui); applyUi(); }
    this.lastError = ''; this.saveLocal(); paintSync(); return true;
  },
  status(id) { return this.progress[id] || 'not_started'; },
  setProgress(id, status) {
    this.progress[id] = status;
    this.queue({ k: 'p:' + id, t: 'wte_progress', op: 'upsert', c: 'user_id,item_id', row: { user_id: this.uid, item_id: id, status, updated_at: new Date().toISOString() } });
  },
  setNote(id, body) {
    if (body) this.notes[id] = body; else delete this.notes[id];
    this.queue({ k: 'n:' + id, t: 'wte_notes', op: 'upsert', c: 'user_id,item_id', row: { user_id: this.uid, item_id: id, body, updated_at: new Date().toISOString() } });
  },
  saveEntry(e) {
    const now = new Date().toISOString();
    const row = { id: e.id || uuid(), user_id: this.uid, kind: e.kind, entry_date: e.entry_date || today(), title: e.title || '', body: e.body || '', meta: e.meta || {}, created_at: e.created_at || now, updated_at: now };
    this.journal = [row, ...this.journal.filter((x) => x.id !== row.id)].sort((a, b) => (b.entry_date + b.created_at).localeCompare(a.entry_date + a.created_at));
    this.queue({ k: 'j:' + row.id, t: 'wte_journal', op: 'upsert', c: 'id', row });
    return row;
  },
  deleteEntry(id) {
    this.journal = this.journal.filter((x) => x.id !== id);
    this.outbox = this.outbox.filter((o) => o.k !== 'j:' + id);
    this.queue({ t: 'wte_journal', op: 'delete', match: { id } });
  },
  addBookmark(book_id, chapter, pos, label) {
    const row = { id: uuid(), user_id: this.uid, book_id, chapter, pos, label, created_at: new Date().toISOString() };
    this.bookmarks = [row, ...this.bookmarks];
    this.queue({ k: 'b:' + row.id, t: 'wte_bookmarks', op: 'upsert', c: 'id', row });
    return row;
  },
  deleteBookmark(id) {
    this.bookmarks = this.bookmarks.filter((x) => x.id !== id);
    this.outbox = this.outbox.filter((o) => o.k !== 'b:' + id);
    this.queue({ t: 'wte_bookmarks', op: 'delete', match: { id } });
  },
  _st: null,
  setState(patch, soon = false) {
    Object.assign(this.state, patch); this.saveLocal();
    clearTimeout(this._st);
    this._st = setTimeout(() => this.queue({ k: 'state', t: 'wte_state', op: 'upsert', c: 'user_id', row: { user_id: this.uid, data: this.state, updated_at: new Date().toISOString() } }), soon ? 50 : 2500);
  },
};
window.addEventListener('online', () => store.flush());
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && store._st) { clearTimeout(store._st); store.setState({}, true); } });

function paintSync() {
  const el = $('#sync'); if (!el) return;
  el.textContent = store.outbox.length ? (navigator.onLine === false ? 'Offline — saved on this device' : store.syncing ? 'Saving…' : 'Not yet synced') : '';
  el.title = store.lastError || '';
}

// ---------- Progress maths ----------
const ITEMS = allItems();
function tally(items) {
  const c = items.filter(countable); const done = c.filter((i) => store.status(i.id) === 'done').length;
  const prog = c.filter((i) => store.status(i.id) === 'in_progress').length;
  return { total: c.length, done, prog, pct: c.length ? Math.round((done / c.length) * 100) : 0 };
}
const itemsOf = { year: (y) => ITEMS.filter((i) => i.year.id === y.id), course: (c) => ITEMS.filter((i) => i.course.id === c.id), unit: (u) => ITEMS.filter((i) => i.unit.id === u.id) };
const meter = (t) => `<div class="meter" role="img" aria-label="${t.pct}% done"><i style="width:${t.pct}%"></i></div>`;

const KIND_LABEL = { read: 'Full text in the app', link: 'Link', guide: 'Guide', practice: 'Practice log' };
function tierBadge(it) {
  if (it.type === 'guide') return '<span class="tier tg">Written by Claude</span>';
  if (it.type === 'read') return BOOKS[it.book].tier === 'shelf' ? '<span class="tier">Full text · wider reading</span>' : '<span class="tier">Tier 1 · full text · public domain</span>';
  if (it.type === 'link') return '<span class="tier t2">Tier 2 · link only</span>';
  return '<span class="tier t2">Your own practice</span>';
}

// ---------- Shell ----------
function shell(title, body, tab, back) {
  return `<header class="top"><div class="bar">
      ${back ? `<a class="iconbtn" href="${back}" aria-label="Back">←</a>` : ''}
      <h1>${esc(title)}</h1><span class="sync" id="sync"></span></div></header>
    <main class="wrap">${body}</main>
    <nav class="tabs" aria-label="Sections"><div class="row">
      ${[['#/', 'Home', 'home'], ['#/plan/y1', 'Plan', 'plan'], ['#/library', 'Library', 'library'], ['#/journal', 'Journal', 'journal'], ['#/about', 'About', 'about']]
        .map(([h, l, k]) => `<a href="${h}" ${tab === k ? 'aria-current="page"' : ''}>${l}</a>`).join('')}
    </div></nav>`;
}

// ---------- Views ----------
function continueTarget() {
  const last = store.state.last;
  if (last && last.book && BOOKS[last.book]) return { href: `#/read/${last.book}/${last.ch}${last.item ? '?i=' + last.item : ''}`, label: BOOKS[last.book].title, sub: 'Pick up reading where you stopped' };
  if (last && last.item && getItem(last.item)) return { href: '#/item/' + last.item, label: getItem(last.item).title, sub: 'The last item you opened' };
  const next = ITEMS.find((i) => countable(i) && store.status(i.id) !== 'done');
  return next ? { href: '#/item/' + next.id, label: next.title, sub: `${next.year.title} · ${next.course.title}` } : null;
}
function viewHome() {
  const all = tally(ITEMS); const c = continueTarget();
  return shell(APP.name, `
    <p class="eyebrow">Overall</p>
    <div class="card"><div class="row"><h3>${all.pct}% complete</h3><span class="pct">${all.done} of ${all.total} done${all.prog ? ` · ${all.prog} in progress` : ''}</span></div>${meter(all)}</div>
    ${c ? `<a class="btn primary block" id="continue" href="${c.href}">Continue where I left off</a><p class="small muted">${esc(c.sub)}: ${esc(c.label)}</p>` : '<p>Everything in the plan is marked done.</p>'}
    <p class="eyebrow">Three-year plan</p>
    ${PLAN.map((y) => { const t = tally(itemsOf.year(y)); return `<a class="card" href="#/plan/${y.id}"><div class="row"><h3>${esc(y.title)}</h3><span class="pct">${t.pct}%</span></div><div class="small muted">${esc(y.focus)}</div>${meter(t)}</a>`; }).join('')}
    <p class="eyebrow">Your writing</p>
    <div class="rowbtns"><a class="btn quiet" href="#/journal/reflection">Reflections</a><a class="btn quiet" href="#/journal/practicum">Practicum log</a></div>
    <div class="rowbtns"><a class="btn quiet" href="#/notes">Notes on items</a><a class="btn quiet" href="#/library">Library</a></div>
    <div class="box"><p>This is a private reading plan modeled on the published curricula of teacher-training programs. It is not a teacher training, is not accredited, and gives no certificate.</p></div>
  `, 'home');
}

function itemRow(it) {
  const st = store.status(it.id);
  return `<li><a href="#/item/${it.id}"><span class="t">${esc(it.title)}${it.optional ? ' <span class="muted small">(optional)</span>' : ''}</span><span class="k">${KIND_LABEL[it.type]}${store.notes[it.id] ? ' · has notes' : ''}</span></a>
    ${it.type === 'guide' ? '<span class="status" aria-hidden="true"><span class="dot none"></span></span>' : `<button class="status" data-act="cycle" data-id="${it.id}" aria-label="Status: ${st.replace('_', ' ')}. Tap to change."><span class="dot ${st}"></span></button>`}</li>`;
}
function viewPlan(yid) {
  const y = PLAN.find((p) => p.id === yid) || PLAN[0]; const ty = tally(itemsOf.year(y));
  const open = lsGet('wildwood:open', {});
  return shell('Plan', `
    <div class="seg" role="group" aria-label="Year">${PLAN.map((p) => `<button data-act="go" data-href="#/plan/${p.id}" aria-pressed="${p.id === y.id}">${esc(p.title)}</button>`).join('')}</div>
    <h2>${esc(y.title)}</h2><p class="muted">${esc(y.focus)}</p>
    <div class="row" style="display:flex;justify-content:space-between"><span class="small muted">${esc(y.model)}</span><span class="pct">${ty.pct}%</span></div>${meter(ty)}
    <p class="small muted" style="margin-top:1rem">Tap a circle to change status: empty is not started, half is in progress, filled is done.</p>
    ${y.courses.map((c) => { const tc = tally(itemsOf.course(c)); return `<details class="course" data-id="${c.id}" ${open[c.id] ? 'open' : ''}>
      <summary><span>${esc(c.title)}</span><span class="pct" data-pct="${c.id}">${tc.pct}%</span></summary>
      ${c.units.map((u) => { const tu = tally(itemsOf.unit(u)); return `<div class="unit"><div class="uh"><span>${esc(u.title)}</span><span class="pct" data-pct="${u.id}">${tu.pct}%</span></div><ul class="items">${u.items.map(itemRow).join('')}</ul></div>`; }).join('')}
    </details>`; }).join('')}
  `, 'plan');
}

function sourceLine(key, text) { const s = SOURCES[key]; return `<li>${esc(text)} <a href="${s.url}" target="_blank" rel="noopener">Source: ${esc(s.label)}</a></li>`; }
function guideHtml(key, part) {
  const g = GUIDES[key]; if (!g) return '';
  const look = Array.isArray(g.look) ? g.look : (g.look[part] || Object.values(g.look).flat());
  return `<section class="guide">
    <p><span class="tier tg">Written by Claude</span> <span class="small muted">A short guide, not Steiner’s words and not a program’s teaching.</span></p>
    <p>${esc(g.what)}</p>
    <h3>Where this sits in a real training</h3><ul>${g.place.map(([k, t]) => sourceLine(k, t)).join('')}</ul>
    <h3>What to look for</h3><ul>${look.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
    <p class="small muted">${esc(g.from)}</p>
    ${g.unsourced ? `<div class="box"><p><strong>Unsourced.</strong> ${g.unsourced.map(esc).join(' ')}</p></div>` : ''}
    <h3>Questions for your notes</h3><ul>${g.questions.map((q) => `<li>${esc(q)}</li>`).join('')}</ul>
  </section>`;
}
function bookFacts(b) {
  return `<p class="muted">${esc(b.author)}</p>${b.facts ? `<p>${esc(b.facts)}</p>` : ''}
    <div class="box"><p><strong>Public-domain check.</strong> ${esc(b.verify)}</p>${b.note ? `<p>${esc(b.note)}</p>` : ''}
    ${b.tier === 'shelf' ? '<p><strong>Not a Waldorf source.</strong> This book is wider reading and is not assigned by any Waldorf program I found.</p>' : ''}
    ${b.illustrated ? `<p>The original is illustrated and the pictures are not in this app. <a href="${b.url}" target="_blank" rel="noopener">See the illustrated edition at Project Gutenberg.</a></p>` : `<p><a href="${b.url}" target="_blank" rel="noopener">Source record at Project Gutenberg</a></p>`}</div>`;
}
function statusSeg(id) {
  const st = store.status(id);
  return `<div class="seg" role="group" aria-label="Status">${[['not_started', 'Not started'], ['in_progress', 'In progress'], ['done', 'Done']].map(([v, l]) => `<button data-act="status" data-id="${id}" data-v="${v}" aria-pressed="${st === v}">${l}</button>`).join('')}</div>`;
}
function viewItem(id) {
  const it = getItem(id); if (!it) return shell('Not found', '<p>That item is not in the plan.</p>', 'plan', '#/plan/y1');
  const back = it.shelf ? '#/library' : `#/plan/${it.year.id}`;
  let body = `<p class="eyebrow">${it.shelf ? 'Wider reading' : esc(`${it.year.title} · ${it.course.title} · ${it.unit.title}`)}</p><h2>${esc(it.title)}</h2>${it.type === 'guide' ? '' : `<p>${tierBadge(it)}</p>`}`;
  if (it.type === 'read') {
    const b = BOOKS[it.book]; const pos = store.state.pos && store.state.pos[it.book];
    const from = it.from ?? 0; const inRange = pos && pos.ch >= from && (it.to == null || pos.ch <= it.to);
    body += `${it.title !== b.title ? `<p>From <em>${esc(b.title)}</em></p>` : ''}${bookFacts(b)}
      <a class="btn primary block" id="open-reader" href="#/read/${it.book}/${inRange ? pos.ch : from}?i=${it.id}">${inRange ? 'Continue reading' : 'Open in the reader'}</a>`;
  } else if (it.type === 'link') {
    const s = it.set && LINKSETS[it.set];
    if (s) body += `<p class="muted">${esc(s.author)} · ${esc(s.ga)}</p><p>${esc(s.facts)}</p><div class="box"><p><strong>Link only.</strong> This text is not copied into the app. It opens on the Rudolf Steiner Archive, which hosts it to read free of charge.</p><p>${esc(s.checked)}</p></div>`;
    else body += `<div class="box"><p><strong>Link only.</strong> ${it.unchecked ? 'I could not open this site with my tools, so this link goes to its front page.' : ''}</p></div>`;
    body += `<a class="btn primary block" id="open-link" data-act="openlink" data-id="${it.id}" href="${it.url}" target="_blank" rel="noopener">Open the reading ↗</a>`;
    if (s && s.index !== it.url) body += `<p class="small"><a href="${s.index}" target="_blank" rel="noopener">Contents page for the whole book ↗</a></p>`;
    if (it.guide) body += guideHtml(it.guide);
  } else if (it.type === 'guide') {
    body += guideHtml(it.guide, it.part);
  } else if (it.type === 'practice') {
    const n = store.journal.filter((e) => e.kind === it.log).length;
    body += guideHtml(it.guide);
    body += `<div class="rowbtns"><a class="btn primary" href="#/journal/${it.log}/new">Add ${esc(KINDS[it.log].one)}</a><a class="btn" href="#/journal/${it.log}">${esc(KINDS[it.log].label)} (${n})</a></div>`;
    if (it.shelf) body += `<p class="small muted">Related wider reading (not Waldorf sources): ${it.shelf.map((b) => `<a href="#/item/shelf-${b}">${esc(BOOKS[b].title)}</a>`).join('; ')}</p>`;
  }
  if (it.type !== 'guide') body += `<h3>Status</h3>${statusSeg(it.id)}`;
  body += `<label for="note">My notes on this item</label><textarea id="note" data-id="${it.id}" placeholder="Write here. Notes save as you type.">${esc(store.notes[it.id] || '')}</textarea><div class="saved" id="saved"></div>`;
  return shell(it.shelf ? 'Library' : it.course.title, body, it.shelf ? 'library' : 'plan', back);
}

function viewLibrary() {
  const t1 = ORDER.tier1.map((id) => BOOKS[id]); const sh = ORDER.shelf.map((id) => BOOKS[id]);
  const row = (b) => { const it = SHELF.find((s) => s.book === b.id); const p = store.state.pos && store.state.pos[b.id];
    return `<div class="lib"><h3>${esc(b.title)}</h3><div class="muted small">${esc(b.author)}</div><p class="small">${esc(b.verify)}</p>
      <div class="rowbtns"><a class="btn quiet" href="#/read/${b.id}/${p ? p.ch : 0}${it ? '?i=' + it.id : ''}">${p ? 'Continue' : 'Read'}</a>${it ? `<a class="btn quiet" href="#/item/${it.id}">Notes and status</a>` : ''}</div></div>`; };
  return shell('Library', `
    <h2>Tier 1 · full text, public domain</h2><p class="muted small">Each text was checked before it was included. The check is written under each title.</p>${t1.map(row).join('')}
    <h2>Tier 2 · link only</h2><p class="muted small">Read on the Rudolf Steiner Archive. Nothing from these is copied into the app.</p>
    ${Object.values(LINKSETS).map((s) => `<div class="lib"><h3>${esc(s.title)}</h3><div class="muted small">${esc(s.author)} · ${esc(s.ga)}</div><p class="small">${esc(s.facts)} ${esc(s.checked)}</p><p class="small"><a href="${s.index}" target="_blank" rel="noopener">Open contents ↗</a></p></div>`).join('')}
    <h2>Wider reading · full text</h2><div class="box"><p><strong>Not Waldorf sources.</strong> These older public-domain books on childhood, storytelling, drawing and handwork are here because they are useful and free. No Waldorf program I found assigns them, and they do not count toward the plan’s percentages.</p></div>${sh.map(row).join('')}
  `, 'library');
}

function viewJournal(kind) {
  kind = KINDS[kind] ? kind : 'reflection'; const list = store.journal.filter((e) => e.kind === kind);
  const metaLine = (e) => { const m = e.meta || {}; const bits = []; if (m.who) bits.push(esc(m.who)); if (m.subject) bits.push(esc(m.subject)); if (m.minutes) bits.push(esc(m.minutes) + ' min'); if (m.art) bits.push(esc(m.art)); if (m.where) bits.push(esc(m.where)); return bits.join(' · '); };
  return shell('Journal', `
    <div class="seg" role="group" aria-label="Journal section" style="flex-wrap:wrap">${Object.entries(KINDS).map(([k, v]) => `<button data-act="go" data-href="#/journal/${k}" aria-pressed="${k === kind}">${esc(v.label.split(' ')[0])}</button>`).join('')}</div>
    <h2>${esc(KINDS[kind].label)}</h2>
    <a class="btn primary block" id="new-entry" href="#/journal/${kind}/new">Add ${esc(KINDS[kind].one)}</a>
    ${list.length ? list.map((e) => `<article class="entry"><div class="small muted">${esc(e.entry_date)}${metaLine(e) ? ' · ' + metaLine(e) : ''}</div><h3>${esc(e.title || '(untitled)')}</h3>
      ${e.kind === 'practicum' && e.meta ? ['plan', 'happened', 'change'].filter((k) => e.meta[k]).map((k) => `<div class="small muted">${{ plan: 'What I planned', happened: 'What happened', change: 'What I would change' }[k]}</div><div class="body">${esc(e.meta[k])}</div>`).join('') : ''}
      ${e.body ? `<div class="body">${esc(e.body)}</div>` : ''}<a class="small" href="#/journal/edit/${e.id}">Edit</a></article>`).join('') : '<p class="muted">Nothing here yet.</p>'}
    <hr><p class="small"><a href="#/notes">Notes on items</a></p>
  `, 'journal');
}
function viewEntry(kind, id) {
  const e = id ? store.journal.find((x) => x.id === id) : { kind, entry_date: today(), title: '', body: '', meta: {} };
  if (!e) return shell('Journal', '<p>That entry was not found.</p>', 'journal', '#/journal');
  const m = e.meta || {}; const k = e.kind;
  const extra = k === 'practicum' ? `
      <label for="f-who">Children and ages</label><input type="text" id="f-who" value="${esc(m.who || '')}">
      <label for="f-subject">Subject or block</label><input type="text" id="f-subject" value="${esc(m.subject || '')}">
      <label for="f-plan">What I planned</label><textarea id="f-plan">${esc(m.plan || '')}</textarea>
      <label for="f-happened">What happened</label><textarea id="f-happened">${esc(m.happened || '')}</textarea>
      <label for="f-change">What I would change</label><textarea id="f-change">${esc(m.change || '')}</textarea>`
    : k === 'arts' ? `
      <label for="f-art">Art</label><select id="f-art">${['Painting', 'Drawing and form drawing', 'Handwork', 'Singing and recorder', 'Speech and storytelling', 'Movement and games', 'Other'].map((a) => `<option ${m.art === a ? 'selected' : ''}>${a}</option>`).join('')}</select>
      <label for="f-minutes">Minutes</label><input type="number" id="f-minutes" inputmode="numeric" min="0" value="${esc(m.minutes || '')}">
      <label for="f-who">Teacher or workshop, if any</label><input type="text" id="f-who" value="${esc(m.who || '')}">`
    : k === 'observation' ? `
      <label for="f-where">Where</label><input type="text" id="f-where" value="${esc(m.where || '')}">
      <label for="f-who">Who (teacher, mentor or child)</label><input type="text" id="f-who" value="${esc(m.who || '')}">` : '';
  return shell(id ? 'Edit' : 'New ' + KINDS[k].one, `
    <form id="entry-form" data-kind="${k}" data-id="${esc(e.id || '')}" data-created="${esc(e.created_at || '')}">
      <label for="f-date">Date</label><input type="date" id="f-date" value="${esc(e.entry_date)}" required>
      <label for="f-title">Title</label><input type="text" id="f-title" value="${esc(e.title)}" maxlength="200">
      ${extra}
      <label for="f-body">${k === 'practicum' ? 'Anything else' : 'Notes'}</label><textarea id="f-body">${esc(e.body)}</textarea>
      <div class="rowbtns"><button class="btn primary" type="submit">Save</button><a class="btn" href="#/journal/${k}">Cancel</a></div>
      ${id ? `<button class="btn quiet block" type="button" data-act="del-entry" data-id="${id}" data-kind="${k}">Delete this entry</button>` : ''}
    </form>`, 'journal', '#/journal/' + k);
}
function viewNotes() {
  const ids = Object.keys(store.notes).filter((id) => getItem(id));
  return shell('Notes on items', ids.length ? ids.map((id) => { const it = getItem(id); return `<article class="entry"><h3><a href="#/item/${id}">${esc(it.title)}</a></h3><div class="body">${esc(store.notes[id])}</div></article>`; }).join('') : '<p class="muted">No notes yet. Every item in the plan has a notes field.</p>', 'journal', '#/journal');
}
function viewAbout(email) {
  return shell('About', `
    <h2>What this is</h2>
    <p>${esc(APP.name)} is a private reading plan and journal for one person. Its outline is modeled on what teacher-training programs for Waldorf schools publish about their own courses and reading. It is not such a program.</p>
    <h2>How content is labeled</h2>
    <p><span class="tier">Tier 1</span> Full text inside the app. Only texts checked as public domain in the USA; the check is written beside each one.</p>
    <p><span class="tier t2">Tier 2</span> Link only. Nothing is copied or paraphrased at length.</p>
    <p><span class="tier tg">Written by Claude</span> Short guides by an AI. They say what a text is, where real programs place it, and what to look for, and they name a source for each point. They are not teaching.</p>
    <h2>Known gaps</h2><ul>${GAPS.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
    <h2>Sources for the plan</h2><ul>${Object.values(SOURCES).map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul>
    <h2>Reading settings</h2>
    <div class="rowbtns"><button class="btn" data-act="size" data-d="-1">Smaller text</button><button class="btn" data-act="size" data-d="1">Larger text</button></div>
    <p class="small muted" data-size-label aria-live="polite">${sizeLabel()}</p>
    <p class="reader" style="padding:0;margin:.5rem 0 1rem">This is how text looks in the reader at this size.</p>
    <button class="btn block" data-act="night">${ui.night ? 'Switch to day mode' : 'Switch to night mode'}</button>
    <h2>Your data</h2>
    <p class="small muted">Progress, notes and logs are stored in your own database, in tables only your account can read. Signed in as ${esc(email || '')}.</p>
    <div class="rowbtns"><button class="btn" data-act="export">Download my data</button><button class="btn" data-act="signout">Sign out</button></div>
  `, 'about');
}

// ---------- Reader ----------
const bookCache = new Map();
async function loadBook(id) {
  if (bookCache.has(id)) return bookCache.get(id);
  const r = await fetch(`texts/${id}.json`); if (!r.ok) throw new Error('Could not load this text.');
  const d = await r.json(); bookCache.set(id, d); return d;
}
let reader = null; // { book, ch, item }
async function viewReader(bookId, ch, itemId) {
  const b = BOOKS[bookId]; if (!b) return shell('Not found', '<p>That text is not in the library.</p>', 'library', '#/library');
  let data; try { data = await loadBook(bookId); } catch (e) { return shell(b.title, `<div class="err">${esc(e.message)} Check your connection and try again.</div>`, 'library', '#/library'); }
  const n = data.chapters.length; ch = Math.min(Math.max(0, ch | 0), n - 1);
  const it = itemId && getItem(itemId); const from = it && it.from != null ? it.from : 0; const to = it && it.to != null ? Math.min(it.to, n - 1) : n - 1;
  const q = itemId ? '?i=' + itemId : ''; const c = data.chapters[ch];
  reader = { book: bookId, ch, item: itemId || null, n };
  if (it && store.status(it.id) === 'not_started') store.setProgress(it.id, 'in_progress');
  const marked = store.bookmarks.some((m) => m.book_id === bookId && m.chapter === ch);
  const atEnd = it && ch >= to;
  return `<header class="top"><div class="bar">
      <a class="iconbtn" href="${it ? '#/item/' + it.id : '#/library'}" aria-label="Back">←</a>
      <h1>${esc(b.title)}</h1><span class="sync" id="sync"></span>
      <button class="iconbtn" data-act="toc" aria-label="Contents and bookmarks">☰</button>
      <button class="iconbtn ${marked ? 'on' : ''}" data-act="bookmark" aria-label="Bookmark this place" aria-pressed="${marked}">⚑</button>
      <button class="iconbtn" data-act="look" aria-label="Text size and night mode">Aa</button>
    </div></header>
    <article class="reader" id="reader" lang="en"><h2>${esc(c.t)}</h2>${c.h}
      <div class="endcard">
        ${atEnd ? `<p>End of this reading.</p>${store.status(it.id) === 'done' ? '<p class="muted">Marked done.</p>' : `<button class="btn primary block" data-act="finish" data-id="${it.id}">Mark this reading done</button>`}<p><a href="#/item/${it.id}">Back to the item and my notes</a></p>`
          : ch < n - 1 ? `<a class="btn primary block" href="#/read/${bookId}/${ch + 1}${q}">Next: ${esc(data.chapters[ch + 1].t)}</a>` : '<p>End of the book.</p>'}
        <p class="small muted">${esc(b.title)} · ${esc(b.author)}. Public-domain text; source: Project Gutenberg eBook #${b.pg}.</p>
      </div>
    </article>
    <div class="rnav"><div class="row">
      ${ch > 0 ? `<a class="btn quiet" href="#/read/${bookId}/${ch - 1}${q}" aria-label="Previous section">←</a>` : '<span class="btn quiet" style="visibility:hidden">←</span>'}
      <span class="where">Section ${ch + 1} of ${n}${it && it.to != null && !it.shelf ? ` · this reading: ${Math.max(0, ch - from) + 1} of ${to - from + 1}` : ''}</span>
      ${ch < n - 1 ? `<a class="btn quiet" href="#/read/${bookId}/${ch + 1}${q}" aria-label="Next section">→</a>` : '<span class="btn quiet" style="visibility:hidden">→</span>'}
    </div></div>`;
}
function scrollFrac() { const h = document.documentElement.scrollHeight - window.innerHeight; return h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0; }
function restoreScroll(f) { const h = document.documentElement.scrollHeight - window.innerHeight; window.scrollTo(0, Math.round(h * f)); }
let scrollT = null;
window.addEventListener('scroll', () => {
  if (!reader) return; clearTimeout(scrollT);
  scrollT = setTimeout(() => { if (!reader) return; const pos = { ...(store.state.pos || {}) }; pos[reader.book] = { ch: reader.ch, f: +scrollFrac().toFixed(4) }; store.setState({ pos, last: { book: reader.book, ch: reader.ch, item: reader.item } }); }, 400);
}, { passive: true });

function openLook() {
  const el = document.createElement('div'); el.className = 'sheet'; el.id = 'sheet'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Text size and night mode');
  el.innerHTML = `<div class="sh"><h2>Reading settings</h2><button class="iconbtn" data-act="close-sheet" aria-label="Close">✕</button></div>
    <div class="body"><p class="eyebrow" data-size-label>${sizeLabel()}</p>
      <div class="rowbtns"><button class="btn" data-act="size" data-d="-1" aria-label="Smaller text">A−</button><button class="btn" data-act="size" data-d="1" aria-label="Larger text">A+</button></div>
      <p class="reader" style="padding:0;margin:1rem 0" id="look-sample">The quick brown fox reads under the trees.</p>
      <p class="eyebrow">Light</p>
      <div class="seg" role="group"><button data-act="night" data-v="0" aria-pressed="${!ui.night}">Day</button><button data-act="night" data-v="1" aria-pressed="${!!ui.night}">Night</button></div>
      <button class="btn primary block" data-act="close-sheet">Done</button></div>`;
  $('#sheet')?.remove(); document.body.appendChild(el);
}
async function openSheet(tab = 'toc') {
  const data = await loadBook(reader.book); const q = reader.item ? '?i=' + reader.item : '';
  const marks = store.bookmarks.filter((m) => m.book_id === reader.book);
  const el = document.createElement('div'); el.className = 'sheet'; el.id = 'sheet'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Contents and bookmarks');
  el.innerHTML = `<div class="sh"><h2>${esc(BOOKS[reader.book].title)}</h2><button class="iconbtn" data-act="close-sheet" aria-label="Close">✕</button></div>
    <div class="body">
      <div class="seg" role="group"><button data-act="sheet-tab" data-tab="toc" aria-pressed="${tab === 'toc'}">Contents</button><button data-act="sheet-tab" data-tab="marks" aria-pressed="${tab === 'marks'}">Bookmarks (${marks.length})</button></div>
      ${tab === 'toc' ? `${data.chapters.length > 12 ? '<input type="search" id="toc-filter" placeholder="Find a section" aria-label="Find a section">' : ''}
        <ul class="toc" id="toc">${data.chapters.map((c, i) => `<li class="${i === reader.ch ? 'cur' : ''}" data-t="${esc(c.t.toLowerCase())}"><button class="go" data-act="go" data-href="#/read/${reader.book}/${i}${q}">${esc(c.t)}</button></li>`).join('')}</ul>`
        : marks.length ? `<ul class="toc">${marks.map((m) => `<li><button class="go" data-act="goto-mark" data-id="${m.id}">${esc(m.label || data.chapters[m.chapter]?.t || 'Bookmark')}<br><span class="small muted">${Math.round(m.pos * 100)}% through the section · ${esc((m.created_at || '').slice(0, 10))}</span></button><button class="iconbtn" data-act="del-mark" data-id="${m.id}" aria-label="Delete bookmark">✕</button></li>`).join('')}</ul>`
          : '<p class="muted">No bookmarks in this book yet. Tap the flag while reading to add one.</p>'}
    </div>`;
  $('#sheet')?.remove(); document.body.appendChild(el);
  const cur = el.querySelector('.cur'); if (cur) cur.scrollIntoView({ block: 'center' });
}

// ---------- Router ----------
let session = null; let signinMsg = '';
async function render() {
  const app = $('#app');
  if (!session) { reader = null; app.innerHTML = viewSignIn(signinMsg); return; }
  const [path, query = ''] = location.hash.replace(/^#\/?/, '').split('?'); const seg = path.split('/').filter(Boolean); const qs = new URLSearchParams(query);
  $('#sheet')?.remove();
  let html; let after = null; const wasReader = !!reader; reader = null;
  if (!seg.length) html = viewHome();
  else if (seg[0] === 'plan') html = viewPlan(seg[1]);
  else if (seg[0] === 'item') { html = viewItem(seg[1]); if (getItem(seg[1])) store.setState({ last: { item: seg[1] } }); }
  else if (seg[0] === 'library') html = viewLibrary();
  else if (seg[0] === 'notes') html = viewNotes();
  else if (seg[0] === 'about') html = viewAbout(session.user.email);
  else if (seg[0] === 'journal') html = seg[1] === 'edit' ? viewEntry(null, seg[2]) : seg[2] === 'new' ? viewEntry(KINDS[seg[1]] ? seg[1] : 'reflection') : viewJournal(seg[1]);
  else if (seg[0] === 'read') {
    const ch = +seg[2] || 0; html = await viewReader(seg[1], ch, qs.get('i'));
    const p = store.state.pos && store.state.pos[seg[1]]; const mark = qs.get('m') && store.bookmarks.find((m) => m.id === qs.get('m'));
    const f = mark ? mark.pos : (p && p.ch === ch && !wasReader ? p.f : 0);
    after = () => { requestAnimationFrame(() => restoreScroll(f)); if (reader) store.setState({ last: { book: reader.book, ch: reader.ch, item: reader.item }, pos: { ...(store.state.pos || {}), [reader.book]: { ch: reader.ch, f } } }); };
  } else html = shell('Not found', '<p>That page does not exist.</p><p><a href="#/">Home</a></p>', '');
  app.innerHTML = html; paintSync();
  if (after) after(); else window.scrollTo(0, 0);
}
function viewSignIn(msg = '') {
  return `<main class="signin"><h1>${esc(APP.name)}</h1><p class="muted">${esc(APP.tagline)}</p>
    <form id="signin-form" autocomplete="on">
      <label for="email">Email</label><input type="email" id="email" name="email" autocomplete="username" required inputmode="email" autocapitalize="none" spellcheck="false">
      <label for="password">Password</label><input type="password" id="password" name="password" autocomplete="current-password" required>
      <div id="signin-msg">${msg ? `<div class="err">${esc(msg)}</div>` : ''}</div>
      <p><button class="btn primary block" type="submit" id="signin-btn">Sign in</button></p>
    </form><p class="small muted">Private. There is no sign-up.</p></main>`;
}
async function onSession(s) {
  if (s && s.user.id !== CFG.owner) { signinMsg = 'This app is for one account only.'; session = null; store.uid = null; await sb.auth.signOut(); render(); return; }
  if (s) signinMsg = '';
  const changed = (s && s.user.id) !== (session && session.user.id); session = s;
  if (!s) { store.uid = null; render(); return; }
  if (changed) { store.uid = s.user.id; store.loadLocal(); await render(); store.pull().then((ok) => { if (ok && !document.activeElement?.matches('textarea,input')) render(); }); }
}

// ---------- Events ----------
function refreshPcts() {
  const all = Object.fromEntries([...PLAN.flatMap((y) => y.courses.map((c) => [c.id, tally(itemsOf.course(c)).pct])), ...PLAN.flatMap((y) => y.courses.flatMap((c) => c.units.map((u) => [u.id, tally(itemsOf.unit(u)).pct])))]);
  document.querySelectorAll('[data-pct]').forEach((el) => { el.textContent = all[el.dataset.pct] + '%'; });
}
document.addEventListener('click', async (ev) => {
  const t = ev.target.closest('[data-act]'); if (!t) return; const act = t.dataset.act;
  if (act === 'go') { location.hash = t.dataset.href; }
  else if (act === 'cycle') {
    const order = ['not_started', 'in_progress', 'done']; const next = order[(order.indexOf(store.status(t.dataset.id)) + 1) % 3];
    store.setProgress(t.dataset.id, next); t.querySelector('.dot').className = 'dot ' + next; t.setAttribute('aria-label', `Status: ${next.replace('_', ' ')}. Tap to change.`); refreshPcts();
  } else if (act === 'status') { store.setProgress(t.dataset.id, t.dataset.v); t.parentElement.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === t)); }
  else if (act === 'openlink') { if (store.status(t.dataset.id) === 'not_started') { store.setProgress(t.dataset.id, 'in_progress'); document.querySelectorAll('[data-act=status]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === 'in_progress')); } }
  else if (act === 'finish') { store.setProgress(t.dataset.id, 'done'); location.hash = '#/item/' + t.dataset.id; }
  else if (act === 'size') { ui.size = Math.min(30, Math.max(14, ui.size + (+t.dataset.d) * 1.5)); applyUi(); store.setState({ ui: { ...ui } }); document.querySelectorAll('[data-size-label]').forEach((el) => { el.textContent = sizeLabel(); }); }
  else if (act === 'night') { ui.night = t.dataset.v != null ? t.dataset.v === '1' : !ui.night; applyUi(); store.setState({ ui: { ...ui } }); if ($('#sheet')) openLook(); else if (!reader) render(); }
  else if (act === 'look') openLook();
  else if (act === 'toc') openSheet('toc');
  else if (act === 'sheet-tab') openSheet(t.dataset.tab);
  else if (act === 'close-sheet') $('#sheet')?.remove();
  else if (act === 'bookmark') {
    const data = await loadBook(reader.book); const f = +scrollFrac().toFixed(4);
    store.addBookmark(reader.book, reader.ch, f, data.chapters[reader.ch].t); t.classList.add('on'); t.setAttribute('aria-pressed', 'true');
    const s = $('#sync'); if (s) { s.textContent = 'Bookmarked'; setTimeout(paintSync, 1500); }
  } else if (act === 'goto-mark') { const m = store.bookmarks.find((x) => x.id === t.dataset.id); if (m) { const h = `#/read/${m.book_id}/${m.chapter}?${reader.item ? 'i=' + reader.item + '&' : ''}m=${m.id}`; if (location.hash === h) { $('#sheet')?.remove(); restoreScroll(m.pos); } else location.hash = h; } }
  else if (act === 'del-mark') { store.deleteBookmark(t.dataset.id); openSheet('marks'); const still = store.bookmarks.some((m) => m.book_id === reader.book && m.chapter === reader.ch); const b = document.querySelector('[data-act=bookmark]'); if (b) { b.classList.toggle('on', still); b.setAttribute('aria-pressed', still); } }
  else if (act === 'del-entry') { if (t.dataset.armed) { store.deleteEntry(t.dataset.id); location.hash = '#/journal/' + t.dataset.kind; } else { t.dataset.armed = '1'; t.textContent = 'Tap again to delete for good'; } }
  else if (act === 'signout') { await store.flush(); await sb.auth.signOut(); }
  else if (act === 'export') {
    const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), progress: store.progress, notes: store.notes, journal: store.journal, bookmarks: store.bookmarks }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `wildwood-data-${today()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }
});
document.addEventListener('toggle', (ev) => { const d = ev.target; if (d.matches && d.matches('details.course')) { const o = lsGet('wildwood:open', {}); o[d.dataset.id] = d.open; lsSet('wildwood:open', o); } }, true);
let noteT = null;
document.addEventListener('input', (ev) => {
  const t = ev.target;
  if (t.id === 'note') { const s = $('#saved'); if (s) s.textContent = 'Saving…'; clearTimeout(noteT); noteT = setTimeout(() => { store.setNote(t.dataset.id, t.value); const s2 = $('#saved'); if (s2) s2.textContent = 'Saved'; }, 700); }
  else if (t.id === 'toc-filter') { const v = t.value.trim().toLowerCase(); document.querySelectorAll('#toc li').forEach((li) => { li.hidden = !!v && !li.dataset.t.includes(v); }); }
});
// make sure a half-typed note is not lost when leaving the page
function flushNote() { const t = $('#note'); if (t && noteT) { clearTimeout(noteT); noteT = null; store.setNote(t.dataset.id, t.value); } }
window.addEventListener('hashchange', () => { flushNote(); render(); });
window.addEventListener('pagehide', flushNote);
document.addEventListener('submit', async (ev) => {
  ev.preventDefault(); const f = ev.target;
  if (f.id === 'signin-form') {
    const btn = $('#signin-btn'); btn.disabled = true; btn.textContent = 'Signing in…';
    const { error } = await sb.auth.signInWithPassword({ email: $('#email').value.trim(), password: $('#password').value });
    if (error) { $('#signin-msg').innerHTML = `<div class="err">${esc(/invalid/i.test(error.message) ? 'That email and password did not match.' : error.message)}</div>`; btn.disabled = false; btn.textContent = 'Sign in'; }
  } else if (f.id === 'entry-form') {
    const v = (id) => { const el = $('#' + id); return el ? el.value.trim() : undefined; }; const meta = {};
    for (const k of ['who', 'subject', 'plan', 'happened', 'change', 'art', 'minutes', 'where']) { const x = v('f-' + k); if (x) meta[k] = x; }
    store.saveEntry({ id: f.dataset.id || undefined, created_at: f.dataset.created || undefined, kind: f.dataset.kind, entry_date: v('f-date') || today(), title: v('f-title'), body: v('f-body'), meta });
    location.hash = '#/journal/' + f.dataset.kind;
  }
});

// ---------- Start ----------
sb.auth.onAuthStateChange((_e, s) => { setTimeout(() => onSession(s), 0); });
sb.auth.getSession().then(({ data }) => { if (!data.session) onSession(null); });
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
