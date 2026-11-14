// Wildwood — course plan, library and short guides.
// Everything here is public: public-domain texts, links, and short guides labeled as written by Claude.
// No personal data lives in this file.

export const APP = {
  name: 'Wildwood',
  tagline: 'A private study reader',
};

// Where the plan comes from. Every guide points back to one of these.
export const SOURCES = {
  wisc: {
    label: 'Waldorf Institute of Southern California, course catalog (2020 state filing)',
    url: 'https://bppe.ca.gov/webapplications/annualReports/2020/document/60a4f6d5-872e-4ce1-b754-78253c72968d',
  },
  awsna: {
    label: 'AWSNA, content areas of member teacher-education institutes',
    url: 'https://waldorfeducation.org/waldorf-careers',
  },
  sunbridge: {
    label: 'Sunbridge Institute, Elementary Curriculum (course titles)',
    url: 'https://www.sunbridge.edu/elementary-curriculum',
  },
  cfa: {
    label: 'Center for Anthroposophy, Explorations program reading note',
    url: 'https://centerforanthroposophy.org/programs/explorations-online-copy/',
  },
  antioch: {
    label: 'Antioch University, Certificate in Waldorf Education (prerequisite reading)',
    url: 'https://www.antioch.edu/academics/education/certificates/waldorf-certificate/',
  },
  archive: {
    label: 'Rudolf Steiner Archive, contents pages',
    url: 'https://rsarchive.org/',
  },
  marks: {
    label: 'AWSNA Guidelines for Service Mark Use (April 2026)',
    url: 'https://www.waldorfeducation.org/wp-content/uploads/2026/04/AWSNA-Guidelines-for-Service-Mark-Use-26-03.pdf',
  },
  riwe: {
    label: 'Research Institute for Waldorf Education',
    url: 'https://waldorfresearchinstitute.org',
  },
};

const PG = (n) => `https://www.gutenberg.org/ebooks/${n}`;
const pd = (n, file, extra = '') =>
  `Project Gutenberg eBook #${n}, released there as public domain in the USA. ${file} ` +
  `Text taken from the GitHub mirror of Project Gutenberg with the Gutenberg licence pages removed.${extra ? ' ' + extra : ''}`;

// ---------- Library ----------
// tier 1 = full text in the app (verified public domain in the USA)
// tier 2 = link only
// shelf = wider reading, full text, not part of any Waldorf program
export const BOOKS = {
  '55586': {
    title: 'The Education of Children from the Standpoint of Theosophy',
    author: 'Rudolf Steiner', tier: 1, pg: 55586,
    facts: 'Essay first published in German in 1907. This English edition: The Rajput Press, Chicago, 1911; “translated by W. B.”; editor Max Gysi.',
    verify: pd(55586, 'Title page in the file: Rajput Press, Chicago, 1911, copyright 1911 by Weller Van Hook; “translated by W. B.”; edited by Max Gysi.'),
    note: 'This is the older translation and uses the word “theosophy” where later editions say “anthroposophy” or “spiritual science”.',
  },
  '55761': {
    title: 'The Philosophy of Spiritual Activity',
    author: 'Rudolf Steiner', tier: 1, pg: 55761,
    facts: 'The book better known as The Philosophy of Freedom (German 1894, revised 1918), together with Truth and Science.',
    verify: pd(55761, 'Title page in the file: authorized translation by Professor and Mrs. R. F. Alfred Hoernlé, edited by Harry Collison, G. P. Putnam’s Sons, London and New York. The file gives no year on the title page; the editor’s note to this second edition refers to Steiner’s 1918 revision.'),
  },
  '30718': {
    title: 'An Outline of Occult Science',
    author: 'Rudolf Steiner', tier: 1, pg: 30718,
    facts: 'German original 1910. Later English editions are titled An Outline of Esoteric Science.',
    verify: pd(30718, 'Title page in the file: authorized translation from the fourth edition, Anthroposophic Press, New York, 1922. No translator is named in the file.'),
  },
  '39986': {
    title: 'The Way of Initiation',
    author: 'Rudolf Steiner', tier: 1, pg: 39986,
    facts: 'An early English version of the first half of the book later published as Knowledge of the Higher Worlds and Its Attainment (per the Rudolf Steiner Archive).',
    verify: pd(39986, 'Title page in the file: translated from the German by Max Gysi, with biographical notes by Edouard Schuré; first Americanized edition, Macoy Publishing and Masonic Supply Co., New York, copyright 1910.'),
  },
  '5314': {
    title: 'Household Tales',
    author: 'Jacob and Wilhelm Grimm', tier: 1, pg: 5314,
    facts: 'All 200 tales and the ten children’s legends.',
    verify: pd(5314, 'The file states it is based on the 1884 translation “Household Tales” by Margaret Hunt.'),
  },
  '21': {
    title: 'Aesop’s Fables',
    author: 'Aesop', tier: 1, pg: 21,
    facts: 'About three hundred fables, grouped here in sets of twenty.',
    verify: pd(21, 'The file names the translator as George Fyler Townsend. It does not state a publication year.'),
  },
  '24737': {
    title: 'The Children of Odin: The Book of Northern Myths',
    author: 'Padraic Colum', tier: 1, pg: 24737,
    facts: 'A retelling of the Norse myths and the Volsung story, written in English.',
    verify: pd(24737, 'The file was made from a later reprint whose notice reads: copyright Macmillan 1920, renewed 1948. A US work published in 1920 left copyright at the end of 1995.', 'The reprint’s modern jacket text and the illustrations are not included here.'),
  },
  '677': {
    title: 'The Heroes, or Greek Fairy Tales for My Children',
    author: 'Charles Kingsley', tier: 1, pg: 677,
    facts: 'Perseus, the Argonauts and Theseus, written in English.',
    verify: pd(677, 'The file states it was transcribed from the 1889 Macmillan and Co. edition; the preface is dated Advent 1855.'),
  },

  // ----- Wider reading shelf (not part of any Waldorf program) -----
  '5427': {
    title: 'Emile', author: 'Jean-Jacques Rousseau', tier: 'shelf', pg: 5427,
    verify: pd(5427, 'The file names the translator as Barbara Foxley. It does not state a publication year.'),
  },
  '71087': {
    title: 'Home Education (Home Education Series, vol. 1)', author: 'Charlotte M. Mason', tier: 'shelf', pg: 71087,
    verify: pd(71087, 'Title page in the file: fifth edition, revised and enlarged, Kegan Paul, Trench, Trübner & Co., London, 1906.'),
  },
  '31097': {
    title: 'Froebel’s Gifts', author: 'Kate Douglas Wiggin and Nora Archibald Smith', tier: 'shelf', pg: 31097, illustrated: true,
    verify: pd(31097, 'Title page in the file: Houghton, Mifflin and Company, Boston and New York, 1895.'),
  },
  '16434': {
    title: 'Autobiography of Friedrich Froebel', author: 'Friedrich Froebel', tier: 'shelf', pg: 16434,
    verify: pd(16434, 'Title page in the file: translated and annotated by Emilie Michaelis and H. Keatley Moore; C. W. Bardeen, Syracuse, N.Y., 1889.'),
  },
  '35677': {
    title: 'Education in the Home, the Kindergarten, and the Primary School', author: 'Elizabeth P. Peabody', tier: 'shelf', pg: 35677,
    verify: pd(35677, 'Title page in the file: Swan Sonnenschein, Lowrey & Co., London, 1887.'),
  },
  '5835': {
    title: 'The Story Hour: A Book for the Home and the Kindergarten', author: 'Kate Douglas Wiggin and Nora A. Smith', tier: 'shelf', pg: 5835,
    verify: pd(5835, 'The file does not state a publication year.'),
  },
  '24912': {
    title: 'Finger Plays for Nursery and Kindergarten', author: 'Emilie Poulsson', tier: 'shelf', pg: 24912, illustrated: true,
    verify: pd(24912, 'Title page in the file: D. Lothrop Company, Boston, 1893; the e-book was made from a 1971 Dover reprint of that edition.', 'The pictures of the hand positions and the music are not reproduced here; the gestures are described in brackets.'),
  },
  '474': {
    title: 'How to Tell Stories to Children, and Some Stories to Tell', author: 'Sara Cone Bryant', tier: 'shelf', pg: 474,
    verify: pd(474, 'Title page in the file: George G. Harrap & Co., London, 1918 printing.'),
  },
  '473': {
    title: 'Stories to Tell to Children', author: 'Sara Cone Bryant', tier: 'shelf', pg: 473,
    verify: pd(473, 'The file does not state a publication year on its title page.'),
  },
  '58107': {
    title: 'For the Story Teller: Story Telling and Stories to Tell', author: 'Carolyn Sherwin Bailey', tier: 'shelf', pg: 58107,
    verify: pd(58107, 'Title page in the file: Milton Bradley Company, Springfield, Mass., 1913.'),
  },
  '30325': {
    title: 'The Elements of Drawing', author: 'John Ruskin', tier: 'shelf', pg: 30325, illustrated: true,
    verify: pd(30325, 'The file states the first edition was published in 1857.'),
  },
  '20776': {
    title: 'Encyclopedia of Needlework', author: 'Thérèse de Dillmont', tier: 'shelf', pg: 20776, illustrated: true,
    verify: pd(20776, 'English edition; the file does not state a publication year.'),
  },
  '52396': {
    title: 'The Mary Frances Knitting and Crocheting Book', author: 'Jane Eayre Fryer', tier: 'shelf', pg: 52396, illustrated: true,
    verify: pd(52396, 'Title page in the file: The John C. Winston Co., Philadelphia, copyright 1918.'),
  },
  '6798': {
    title: 'Aesthetical and Philosophical Essays (including the Letters on the Aesthetical Education of Man)', author: 'Friedrich Schiller', tier: 'shelf', pg: 6798,
    verify: pd(6798, 'The file names no translator and no publication year.'),
  },
  '50572': {
    title: 'Goethe’s Theory of Colours', author: 'Johann Wolfgang von Goethe', tier: 'shelf', pg: 50572, illustrated: true,
    verify: pd(50572, 'Title page in the file: translated with notes by Charles Lock Eastlake; John Murray, London, 1840.'),
  },
};
for (const [id, b] of Object.entries(BOOKS)) { b.id = id; b.url = PG(b.pg); }
// Books that have a plain-English rendering in texts/<id>.json (field 'p').
export const PLAIN = ['55586', '39986'];
// Display order (object keys that look like numbers do not keep their written order).
export const ORDER = {
  tier1: ['55586', '55761', '39986', '30718', '5314', '21', '24737', '677'],
  shelf: ['5427', '71087', '6798', '50572', '16434', '31097', '35677', '5835', '24912', '474', '473', '58107', '30325', '20776', '52396'],
};

// ---------- Tier 2: links (checked 12 November 2026) ----------
const SM = 'https://rsarchive.org/Lectures/GA293/English/RSP1966/';
const PC = 'https://rsarchive.org/Lectures/GA294/English/RSPC1937/';
const DT = 'https://rsarchive.org/Lectures/GA295/English/AP1997/';
const TH = 'https://rsarchive.org/Books/GA009/English/RSP1965/';

export const LINKSETS = {
  studyOfMan: {
    title: 'The Study of Man', author: 'Rudolf Steiner', ga: 'GA 293',
    facts: 'Fourteen lectures, Stuttgart, 21 August to 5 September 1919. Translated by Daphne Harwood and Helen Fox; first English edition 1947, revised 1966. Newer editions are titled The Foundations of Human Experience.',
    index: SM + 'index.html',
    checked: 'Contents page opened and every lecture address read from it.',
  },
  practical: {
    title: 'Practical Course for Teachers', author: 'Rudolf Steiner', ga: 'GA 294',
    facts: 'Fourteen lectures and concluding remarks, Stuttgart, 21 August to 6 September 1919. Translation authorized by Harry Collison (1937 edition). Newer editions are titled Practical Advice to Teachers.',
    index: PC,
    checked: 'Contents page opened and every lecture address read from it.',
  },
  discussions: {
    title: 'Discussions with Teachers', author: 'Rudolf Steiner', ga: 'GA 295',
    facts: 'Fifteen seminar discussions and three lectures on the curriculum, Stuttgart, 21 August to 6 September 1919. Translated by Helen Fox and Katherine E. Creeger (1997 edition).',
    index: DT,
    checked: 'Contents page opened and every address read from it.',
  },
  kingdom: {
    title: 'The Kingdom of Childhood', author: 'Rudolf Steiner', ga: 'GA 311',
    facts: 'Seven lectures and answers to questions, Torquay, 12 to 20 August 1924. Translated by Helen Fox.',
    index: 'https://rsarchive.org/Lectures/GA311/English/AP1982/',
    checked: 'Address taken from the Archive’s own index of GA 311. I could not open the contents page itself, so individual lectures are not linked.',
  },
  theosophy: {
    title: 'Theosophy', author: 'Rudolf Steiner', ga: 'GA 9',
    facts: 'Written 1904. This edition translated by M. Cotterell and A. P. Shepherd (1965).',
    index: TH + 'GA009_index.html',
    checked: 'Contents page opened and every chapter address read from it.',
  },
  balance: {
    title: 'Balance in Teaching (first four lectures)', author: 'Rudolf Steiner', ga: 'GA 302a',
    facts: 'Four lectures to the Stuttgart teachers, 15 to 22 September 1920. The Archive hosts them under the title Meditatively Acquired Knowledge of Man.',
    index: 'https://rsarchive.org/Lectures/GA302a/',
    checked: 'Contents page opened and every lecture address read from it.',
  },
  deeper: {
    title: 'Deeper Insights into Education', author: 'Rudolf Steiner', ga: 'GA 302a',
    facts: 'Three lectures to the Stuttgart teachers, 15 and 16 October 1923, translated by René M. Querido. Current print editions of Balance in Teaching include them as its second part.',
    index: 'https://rsarchive.org/Lectures/GA302a/',
    checked: 'Contents page opened and every lecture address read from it.',
  },
};

// ---------- Short guides ----------
// Each guide is labeled in the app as written by Claude. "from" names where each point comes from.
// "unsourced" lists anything that rests only on Claude's general knowledge.
const G = {
  essay: {
    what: 'Steiner’s 1907 essay on child development, written twelve years before the first school opened. It is short enough to read in two sittings.',
    place: [['archive', 'The 1937 edition of Practical Course for Teachers lists this essay first among Steiner’s educational works and notes it was written about ten years before the school was founded. The catalog this plan follows does not name it; placing it first is my choice.']],
    look: [
      'The essay describes four members of the human being (physical, etheric or vital, astral, and the “I”) and builds its account of childhood on them. Read this part slowly; the later lectures assume it.',
      'It speaks of “three births”: physical birth, then the change of teeth at about seven, then puberty.',
      'For the years before the change of teeth it names two words, imitation and example. Look for the passage on the knotted-cloth doll and on toys.',
      'For the years between the change of teeth and puberty the words in this translation are “hero-worship” and “authority”, with teaching through images and parables.',
      'Independent judgment is placed after puberty.',
    ],
    from: 'Each point above is taken from the text of the essay as it appears in this app.',
    questions: [
      'Which claims here can you check against your own children, and which do you have to take on Steiner’s word?',
      'What does the essay ask of the adult, as distinct from what it says about the child?',
      'Where does the 1911 wording (“theosophy”, “hero-worship”) change how the passage reads to you?',
    ],
  },
  philosophy: {
    what: 'Steiner’s main philosophical book, on whether human thinking and action can be free. It is demanding and makes no reference to schools.',
    place: [['wisc', 'The Southern California program pairs this book (as Intuitive Thinking as a Spiritual Path: A Philosophy of Freedom) with its first year.'], ['cfa', 'The Center for Anthroposophy names it among Steiner’s “basic books”.']],
    look: [
      'The book has two halves, titled in this edition “The Theory of Freedom” (chapters I–VII) and “The Reality of Freedom” (chapters VIII–XIV).',
      'Chapter III is on thought as the instrument of knowledge; chapter IX is “The Idea of Freedom”; chapter XII is “Moral Imagination”.',
      'This edition marks Steiner’s 1918 additions at the ends of chapters, so you can see what he changed.',
      '“Truth and Science”, his earlier thesis, is bound in after chapter XV and is optional.',
    ],
    from: 'The structure and chapter titles are taken from this edition’s own contents.',
    questions: [
      'In your own words, what does the book mean by a free deed?',
      'Why might a teacher training start with a book about thinking instead of a book about children?',
      'Which chapter would you need to read twice?',
    ],
  },
  studyOfMan: {
    what: 'The morning lecture course Steiner gave to the first teachers in August and September 1919. Programs treat it as the central text.',
    place: [['wisc', 'The Southern California program reads it across all three years, about a third each year. This plan follows that split.']],
    look: {
      1: [
        'Lecture I: life before birth, and how breathing and sleep bear on the young child.',
        'Lecture II: mental picturing and will.',
        'Lectures IV and V: will, and the place of feeling between thinking and willing.',
      ],
      2: [
        'Lecture VI: waking, dreaming and sleeping set beside thinking, feeling and willing.',
        'Lecture VIII: memory, and the twelve senses.',
        'Lecture IX: the three seven-year stages, and the roles of judgment and concepts in teaching.',
      ],
      3: [
        'Lectures X and XI: head, chest and limbs, and how teaching reaches the child in stages.',
        'Lecture XIII: purposeful movement and sleep.',
        'Lecture XIV: speech, grammar and imaginative teaching.',
      ],
    },
    from: 'The topics are the Rudolf Steiner Archive’s own one-line summaries of each lecture, reworded.',
    questions: [
      'What is one thing in these lectures you could observe for yourself in a child this week?',
      'Which statements are about how to teach, and which are about what a human being is?',
      'What did you not understand? Write the question down exactly.',
    ],
  },
  practical: {
    what: 'The second course of the same fortnight in 1919, given each day after The Study of Man. It turns to method: how to begin writing, reading, arithmetic, languages, geography.',
    place: [['wisc', 'The Southern California program lists it (as Practical Advice to Teachers) in its grades 1–3 and grades 4–5 years.']],
    look: {
      1: [
        'Lecture I: artistic activity, arithmetic, reading and writing.',
        'Lecture IV: the first school lesson; drawing and painting; beginning language teaching.',
        'Lecture V: writing and reading.',
        'Lecture VI: the rhythm of life and rhythmical repetition in teaching.',
        'Lecture VII: teaching in the ninth year; the animal kingdom.',
      ],
      2: [
        'Lecture VIII: education after the twelfth year; history and physics.',
        'Lecture X: arranging the lessons up to the fourteenth year.',
        'Lecture XI: teaching geography.',
        'Lecture XIII: drawing up the timetable.',
        'Lecture XIV: moral educative principles and their transition to practice.',
      ],
    },
    from: 'The topics are the lecture titles as printed on the Archive’s contents page for this edition.',
    questions: [
      'Which lecture speaks most directly to the age of your own children right now?',
      'What would you need to practise yourself before you could teach what this lecture describes?',
      'Where does Steiner give a reason, and where does he give only an instruction?',
    ],
  },
  discussions: {
    what: 'The afternoon seminar of the same fortnight. The teachers bring attempts and questions, and Steiner responds. It closes with three lectures that lay out the curriculum.',
    place: [['wisc', 'The Southern California program lists it in its grades 1–3 and grades 4–5 years.']],
    look: {
      1: [
        'Discussions I–III: the four temperaments, and storytelling and drawing for each.',
        'Discussion IV: arithmetic, geometry and behaviour.',
        'Discussion V: the speech exercises begin.',
        'Discussion VI: preparing children for poems and stories.',
      ],
      2: [
        'Discussions IX–XI: botany and how to teach plants.',
        'Discussion XII: maps and geography.',
        'Discussions XIII–XIV: algebra.',
        'The three lectures on the curriculum (6 September): the subjects year by year. These are the original source for “what is taught when”.',
      ],
    },
    from: 'The topics are the Archive’s one-line summaries of each discussion, reworded.',
    questions: [
      'What does the back-and-forth format show you that a lecture would not?',
      'Compare the curriculum lectures with what you have read elsewhere about each grade. What matches and what differs?',
      'Which temperament description do you recognise at home, and how sure are you?',
    ],
  },
  kingdom: {
    what: 'Seven lectures Steiner gave in England in August 1924 to a small group preparing to open a school. Later, shorter and plainer than the 1919 courses.',
    place: [['antioch', 'Antioch lists it as prerequisite reading for its certificate.']],
    look: [
      'Read it straight through once before taking notes; it was given as one connected set of talks.',
      'Notice which examples are for the youngest children and which are for the grades.',
    ],
    from: 'The date, place and audience are from the Archive’s catalogue entry. I could not open this book’s contents page, so I have not listed topics by lecture.',
    questions: [
      'What here repeats the 1907 essay, and what is new seventeen years later?',
      'Which single example would you like to try, and what would you need first?',
    ],
  },
  wayOfInitiation: {
    what: 'Steiner’s book on inner development: exercises in reverence, inner quiet and observation. Programs read it for the teacher’s own self-education.',
    place: [['cfa', 'The Center for Anthroposophy names it (as How to Know Higher Worlds) among the basic books its foundation reading draws on.'], ['awsna', 'Inner development has no content area of its own in AWSNA’s list; Sunbridge lists a course called “Inner Development”.']],
    look: [
      'Chapter II is titled “How to Attain Knowledge of the Higher Worlds”; chapters III and IV are “The Path of Discipleship” and “Probation”.',
      'Chapters V and VI are “Enlightenment” and “Initiation”; chapters VII and VIII turn to the education of the soul and the conditions asked of the student.',
      'The long opening piece by Edouard Schuré is a biographical sketch by another writer. It is optional.',
    ],
    from: 'Chapter titles are from this edition’s own contents.',
    questions: [
      'Which exercise could you try for a week without changing anything else in your day?',
      'What does the book claim will result, and how would you know?',
      'What in this book are you not willing to take on, and why?',
    ],
  },
  theosophy: {
    what: 'Steiner’s 1904 account of body, soul and spirit, of reincarnation and destiny, and of the worlds he describes beyond the senses.',
    place: [['wisc', 'The Southern California program pairs this book with its second year.']],
    look: [
      'Chapter 1, “The Nature of Man”, has four parts: the corporeal being, the soul-being, the spiritual being, and body, soul and spirit together.',
      'Chapter 2 is “Re-embodiment of the Spirit and Destiny”.',
      'Chapter 4, “The Path of Knowledge”, overlaps with The Way of Initiation.',
    ],
    from: 'Chapter titles are from the Archive’s contents page for the 1965 edition.',
    questions: [
      'Which parts of this picture does Waldorf teaching practice seem to depend on, and which could you set aside?',
      'How does chapter 1 compare with the four members described in the 1907 essay?',
    ],
  },
  occult: {
    what: 'Steiner’s largest single book: the nature of the human being, sleep and death, a long account of the evolution of the world, and a chapter on the path of knowledge.',
    place: [['wisc', 'The Southern California program pairs this book (as An Outline of Esoteric Science) with its third year.']],
    look: [
      'Chapter II, “The Nature of Man”, restates what the 1907 essay and Theosophy describe.',
      'Chapter IV, “The Evolution of the World and Man”, is by far the longest; here it is split into six parts.',
      'Chapter V, “Knowledge of the Higher Worlds”, is the counterpart to The Way of Initiation.',
    ],
    from: 'Chapter titles and lengths are from this edition as it appears in the app.',
    questions: [
      'What would change in how you teach if you held chapter IV to be true? What if you did not?',
      'Where does Steiner say how he knows what he describes?',
    ],
  },
  balance: {
    what: 'Four lectures to the working teachers a year after the school opened. They assume the 1919 courses.',
    place: [['wisc', 'The Southern California program lists Balance in Teaching in its grades 6–8 year.']],
    look: [
      'Lecture 1 concerns the inner attitude of the teacher.',
      'Lecture 2 is titled “The Three Fundamental Forces in Education”.',
      'Lecture 4 gives the book its name: bringing the physical and spiritual nature of the growing child into balance.',
    ],
    from: 'Lecture titles are from the Archive’s contents page for GA 302a.',
    questions: [
      'What has changed in Steiner’s tone now that the teachers have a year of practice behind them?',
      'Which idea from The Study of Man do these lectures lean on most?',
    ],
  },
  deeper: {
    what: 'Three lectures from October 1923 on the teacher’s own inner life and its effect on children’s health.',
    place: [['wisc', 'Current editions of Balance in Teaching, which the Southern California program assigns in its third year, include these lectures as part two.']],
    look: [
      'Lecture 1 is “Gymnast, Rhetorician, Professor: A Living Synthesis”.',
      'Lecture 2 is “Forces Leading to Health and Illness in Education”.',
      'Lecture 3 is on knowledge of the human being as the source of imagination in the teacher.',
    ],
    from: 'Lecture titles are from the Archive’s contents page for GA 302a.',
    questions: [
      'What does the first lecture’s threefold picture ask you to develop in yourself?',
      'Which of your own habits as a teacher at home does this make you look at?',
    ],
  },
  grimm: {
    what: 'The complete Grimm collection in Margaret Hunt’s translation, for reading and for learning tales to tell.',
    place: [['archive', 'Steiner’s own grade-by-grade story list is in Discussions with Teachers and its curriculum lectures; read those for the source.']],
    look: [
      'Choose a handful of tales and learn them well enough to tell without the book.',
      'The ten “children’s legends” are at the end, after tale 200.',
    ],
    from: 'The contents are from the text itself.',
    unsourced: ['That fairy tales belong to grade 1 is how Waldorf schools commonly describe their curriculum. I have not matched that statement to a page in the lectures; check it against the curriculum lectures.'],
    questions: [
      'Which tale stayed with you after one reading, and what is the picture at its centre?',
      'What happens when you tell a tale twice, a few days apart, to the same child?',
    ],
  },
  aesop: {
    what: 'Townsend’s translation of the fables, short enough to learn by heart.',
    place: [['archive', 'See the curriculum lectures in Discussions with Teachers for Steiner’s own story list.']],
    look: ['Each fable ends with a stated moral in this edition. Try telling one with the moral left unsaid.'],
    from: 'From the text itself.',
    unsourced: ['That fables belong to grade 2 is how Waldorf schools commonly describe their curriculum. I have not matched it to a page in the lectures.'],
    questions: ['Which fables would suit which of your children, and why those?'],
  },
  odin: {
    what: 'Padraic Colum’s 1920 retelling of the Norse myths, ending with Sigurd and the Twilight of the Gods.',
    place: [['wisc', 'The Southern California program’s second year focuses on grades 4 and 5.']],
    look: ['The book is in four parts: The Dwellers in Asgard, Odin the Wanderer, The Witch’s Heart, and The Sword of the Volsungs and the Twilight of the Gods.'],
    from: 'From the book’s own contents.',
    unsourced: ['That Norse myths belong to grade 4 is how Waldorf schools commonly describe their curriculum today. Steiner’s 1919 list reads differently; compare it in the curriculum lectures.'],
    questions: ['What is different in mood between these stories and the Grimm tales?'],
  },
  heroes: {
    what: 'Charles Kingsley’s retelling of Perseus, the Argonauts and Theseus, written for his own children.',
    place: [['wisc', 'The Southern California program’s second year focuses on grades 4 and 5.']],
    look: ['Three stories, each divided into parts. Kingsley’s preface speaks directly to children and is worth reading first.'],
    from: 'From the book’s own contents.',
    unsourced: ['That Greek myths belong to grade 5 is how Waldorf schools commonly describe their curriculum today. I have not matched it to a page in the lectures.'],
    questions: ['Which of the three heroes would you tell first, and to whom?'],
  },
  owl: {
    what: 'The Online Waldorf Library is run by the Research Institute for Waldorf Education and offers articles, journals and e-books by working teachers free of charge.',
    place: [['riwe', 'The Research Institute states that these materials are available without charge at the Online Waldorf Library.']],
    look: ['Search by grade or subject and pick two or three pieces. Save each address in your notes for this item so your reading list builds up here.'],
    from: 'The description is from the Research Institute’s own site. I could not open the library itself with my tools, so I have not chosen articles for you. That is a gap in this plan.',
    questions: ['What did a working teacher’s account show you that the lectures did not?'],
  },
  arts: {
    what: 'The arts are learned by doing them, ideally with a teacher. This item is a place to keep track of practice, not a lesson.',
    place: [['wisc', 'In the Southern California catalog, art and handwork, music and movement, and drama and speech together make up 340 of 1,020 hours.'], ['sunbridge', 'Sunbridge’s elementary program lists Fine Arts, Sculpture, Teaching Music, Speech Arts, Handwork, Spacial Dynamics, Eurythmy, Chorus and Recorder, and Circle Work.']],
    look: ['Log each session in Journal → Arts practice: what you did, for how long, and what you noticed.', 'A workshop or a lesson with an experienced teacher counts for more than reading. Log those too.'],
    from: 'The hours and course titles are from the two programs’ published pages. Nothing here teaches the art itself.',
    questions: ['What did your hands learn today that you could not have read?'],
  },
  observation: {
    what: 'Training programs place students in classrooms to watch experienced teachers before they teach.',
    place: [['wisc', 'The Southern California catalog counts 60 hours of observation and 90 of practice teaching, with most observation in the first year.'], ['awsna', 'AWSNA lists “Practical Experiences in the Classroom (Observation, Student Teaching, Mentored Teaching)” as one of five content areas.']],
    look: ['Log each visit, conversation or period of watching a child in Journal → Observation and mentoring.', 'An app cannot stand in for a classroom or a mentor. If you can arrange even one observation day at a school, log it here.'],
    from: 'Hours and wording are from the two published sources.',
    questions: ['What did you see that you did not expect?'],
  },
  practicum: {
    what: 'Practice teaching is where a training tests everything else. At home that means lessons with your own children, written up afterwards.',
    place: [['wisc', 'The Southern California catalog begins practice teaching in the second year and gives it the largest share in the third.']],
    look: ['After each lesson, add an entry in Journal → Practicum log: what you planned, what happened, what you would change.', 'In a program a mentor reads these with you. If you find a mentor, note their comments in the same entry.'],
    from: 'The year-by-year weighting is from the catalog.',
    questions: ['What did the children show you that you had not planned for?'],
  },
  project: {
    what: 'Programs commonly end with an independent project on one part of the curriculum, presented to others.',
    place: [['wisc', 'The Southern California catalog has a strand called “Community, Presentations and Independent Projects” in every year.']],
    look: ['Choose one subject or block you have taught, and write up what you learned from sources and from practice.'],
    from: 'The strand title is from the catalog.',
    questions: ['Who could you show this to who would tell you honestly where it is thin?'],
  },
};

// ---------- Plan ----------
const read = (id, book, title, from, to, extra = {}) => ({ id, type: 'read', book, title, from, to, ...extra });
const link = (id, set, title, url, extra = {}) => ({ id, type: 'link', set, title, url, ...extra });
const guide = (id, g, title, part) => ({ id, type: 'guide', guide: g, title, part });
const practice = (id, g, title, log, extra = {}) => ({ id, type: 'practice', guide: g, title, log, ...extra });

const smLectures = [
  ['I', '19190821a01'], ['II', '19190822a01'], ['III', '19190823a01'], ['IV', '19190825a01'], ['V', '19190826a01'],
  ['VI', '19190827a01'], ['VII', '19190828a01'], ['VIII', '19190829a01'], ['IX', '19190830a01'], ['X', '19190901a01'],
  ['XI', '19190902a01'], ['XII', '19190903a01'], ['XIII', '19190904a01'], ['XIV', '19190905a01'],
];
const sm = (a, b) => smLectures.slice(a, b).map(([n, f]) => link(`sm-${n.toLowerCase()}`, 'studyOfMan', `The Study of Man, Lecture ${n}`, `${SM}${f}.html`));

const pcLectures = [
  ['I', 'Introduction: artistic activity, arithmetic, reading and writing', '19190821n01'],
  ['II', 'On language', '19190822n01'],
  ['III', 'On the plastically formative arts, music and poetry', '19190823n01'],
  ['IV', 'The first school lesson', '19190825n01'],
  ['V', 'Writing and reading; spelling', '19190826n01'],
  ['VI', 'On the rhythm of life and rhythmical repetition in teaching', '19190827n01'],
  ['VII', 'The teaching in the ninth year; the animal kingdom', '19190828n01'],
  ['VIII', 'Education after the twelfth year; history; physics', '19190829n01'],
  ['IX', 'On the teaching of languages', '19190830n01'],
  ['X', 'Arranging the lesson up to the fourteenth year', '19190901n01'],
  ['XI', 'On the teaching of geography', '19190902n01'],
  ['XII', 'How to connect school with practical life', '19190903n01'],
  ['XIII', 'On drawing up the timetable', '19190904n01'],
  ['XIV', 'Moral educative principles and their transition to practice', '19190905n01'],
  ['Concluding remarks', '', '19190906n01'],
];
const pc = (a, b) => pcLectures.slice(a, b).map(([n, t, f]) =>
  link(`pc-${n.toLowerCase().replace(/\s+/g, '-')}`, 'practical', t ? `Practical Course, Lecture ${n}: ${t}` : `Practical Course: ${n}`, `${PC}${f}.html`));

const dtItems = [
  ['I', '19190821d01'], ['II', '19190822d02'], ['III', '19190823d03'], ['IV', '19190825d04'], ['V', '19190826d05'],
  ['VI', '19190827d06'], ['VII', '19190828d07'], ['VIII', '19190829d08'], ['IX', '19190830d09'], ['X', '19190901d10'],
  ['XI', '19190902d11'], ['XII', '19190903d12'], ['XIII', '19190904d13'], ['XIV', '19190905d14'],
];
const dt = (a, b) => dtItems.slice(a, b).map(([n, f]) => link(`dt-${n.toLowerCase()}`, 'discussions', `Discussions with Teachers, Discussion ${n}`, `${DT}${f}.html`));

const owl = (id, title) => ({ id, type: 'link', guide: 'owl', title, url: 'https://www.waldorflibrary.org', unchecked: true });
const artsItems = (y) => [
  guide(`y${y}-arts-guide`, 'arts', 'About this strand'),
  practice(`y${y}-art-painting`, 'arts', 'Painting practice', 'arts', { shelf: ['50572'] }),
  practice(`y${y}-art-drawing`, 'arts', 'Drawing and form drawing practice', 'arts', { shelf: ['30325'] }),
  practice(`y${y}-art-handwork`, 'arts', 'Handwork practice', 'arts', { shelf: ['20776', '52396'] }),
  practice(`y${y}-art-music`, 'arts', 'Singing and recorder practice', 'arts'),
  practice(`y${y}-art-speech`, 'arts', 'Speech and storytelling practice', 'arts', { shelf: ['474', '473', '58107'] }),
  practice(`y${y}-art-movement`, 'arts', 'Movement, circle work and games', 'arts', { shelf: ['24912'] }),
];

export const PLAN = [
  {
    id: 'y1', title: 'Year 1', focus: 'Foundations, with the curriculum of grades 1–3',
    model: 'Modeled on the first year of the Southern California program’s published sequence.',
    courses: [
      { id: 'y1-found', title: 'Foundation studies', units: [
        { id: 'y1-essay', title: 'The Education of Children (1907)', items: [
          guide('y1-essay-guide', 'essay', 'Short guide'),
          read('y1-essay-1', '55586', 'The Education of Children, part 1', 0, 0),
          read('y1-essay-2', '55586', 'The Education of Children, part 2', 1, 1),
        ] },
        { id: 'y1-phil', title: 'The Philosophy of Spiritual Activity', items: [
          guide('y1-phil-guide', 'philosophy', 'Short guide'),
          read('y1-phil-1', '55761', 'Prefaces and chapters I–III', 0, 5),
          read('y1-phil-2', '55761', 'Chapters IV–VII', 6, 9),
          read('y1-phil-3', '55761', 'Chapters VIII–XI', 10, 13),
          read('y1-phil-4', '55761', 'Chapters XII–XV', 14, 17),
          read('y1-phil-5', '55761', 'Truth and Science, and the appendices', 18, 30, { optional: true }),
        ] },
      ] },
      { id: 'y1-sm', title: 'The Study of Man', units: [
        { id: 'y1-sm-u', title: 'Lectures I–V', items: [guide('y1-sm-guide', 'studyOfMan', 'Short guide', 1), ...sm(0, 5)] },
      ] },
      { id: 'y1-art', title: 'The art of teaching', units: [
        { id: 'y1-pc', title: 'Practical Course for Teachers, lectures I–VII', items: [guide('y1-pc-guide', 'practical', 'Short guide', 1), ...pc(0, 7)] },
        { id: 'y1-dt', title: 'Discussions with Teachers, discussions I–VII', items: [guide('y1-dt-guide', 'discussions', 'Short guide', 1), ...dt(0, 7)] },
        { id: 'y1-kc', title: 'The Kingdom of Childhood', items: [
          guide('y1-kc-guide', 'kingdom', 'Short guide'),
          link('y1-kc', 'kingdom', 'The Kingdom of Childhood, seven lectures', LINKSETS.kingdom.index),
        ] },
      ] },
      { id: 'y1-cur', title: 'Curriculum and stories, grades 1–3', units: [
        { id: 'y1-curlec', title: 'Steiner’s lectures on the curriculum', items: [
          link('dt-cur-1', 'discussions', 'First Lecture on the Curriculum', `${DT}19190906d16.html`),
          link('dt-cur-2', 'discussions', 'Second Lecture on the Curriculum', `${DT}19190906d17.html`),
          link('dt-cur-3', 'discussions', 'Discussion XV and Third Lecture on the Curriculum', `${DT}19190906d15.html`),
        ] },
        { id: 'y1-grimm', title: 'Fairy tales', items: [guide('y1-grimm-guide', 'grimm', 'Short guide'), read('y1-grimm', '5314', 'Household Tales (Grimm)', 0, 209)] },
        { id: 'y1-aesop', title: 'Fables', items: [guide('y1-aesop-guide', 'aesop', 'Short guide'), read('y1-aesop', '21', 'Aesop’s Fables', 0, 15)] },
        { id: 'y1-owl', title: 'Teachers’ articles, grades 1–3', items: [guide('y1-owl-guide', 'owl', 'About this item'), owl('y1-owl-link', 'Online Waldorf Library: choose articles for grades 1–3')] },
      ] },
      { id: 'y1-ec', title: 'Early childhood', units: [
        { id: 'y1-ec-u', title: 'Teachers’ articles on early childhood', items: [owl('y1-ec-link', 'Online Waldorf Library: choose articles on the first seven years')] },
      ] },
      { id: 'y1-inner', title: 'Inner development', units: [
        { id: 'y1-woi', title: 'The Way of Initiation, chapters I–IV', items: [
          guide('y1-woi-guide', 'wayOfInitiation', 'Short guide'),
          read('y1-woi-0', '39986', 'Notes and the sketch of Steiner by Edouard Schuré', 0, 2, { optional: true }),
          read('y1-woi-1', '39986', 'Chapters I and II', 3, 4),
          read('y1-woi-2', '39986', 'Chapters III and IV', 5, 6),
        ] },
      ] },
      { id: 'y1-arts', title: 'The arts', units: [{ id: 'y1-arts-u', title: 'Practice log', items: artsItems(1) }] },
      { id: 'y1-obs', title: 'Observation and practice', units: [
        { id: 'y1-obs-u', title: 'Observation', items: [
          guide('y1-obs-guide', 'observation', 'About this strand'),
          practice('y1-obs-log', 'observation', 'Keep an observation log this year', 'observation'),
        ] },
      ] },
    ],
  },
  {
    id: 'y2', title: 'Year 2', focus: 'The human being, with the curriculum of grades 4–5',
    model: 'Modeled on the second year of the Southern California program’s published sequence.',
    courses: [
      { id: 'y2-found', title: 'Foundation studies', units: [
        { id: 'y2-theo', title: 'Theosophy', items: [
          guide('y2-theo-guide', 'theosophy', 'Short guide'),
          link('y2-theo-0', 'theosophy', 'Theosophy: prefaces and introduction', `${TH}GA009_intro.html`),
          link('y2-theo-1', 'theosophy', 'Theosophy, chapter 1: The Nature of Man', `${TH}GA009_c01.html`),
          link('y2-theo-2', 'theosophy', 'Theosophy, chapter 2: Re-embodiment of the Spirit and Destiny', `${TH}GA009_c02.html`),
          link('y2-theo-3', 'theosophy', 'Theosophy, chapter 3: The Three Worlds', `${TH}GA009_c03.html`),
          link('y2-theo-4', 'theosophy', 'Theosophy, chapter 4: The Path of Knowledge', `${TH}GA009_c04.html`),
        ] },
      ] },
      { id: 'y2-sm', title: 'The Study of Man', units: [
        { id: 'y2-sm-u', title: 'Lectures VI–X', items: [guide('y2-sm-guide', 'studyOfMan', 'Short guide', 2), ...sm(5, 10)] },
      ] },
      { id: 'y2-art', title: 'The art of teaching', units: [
        { id: 'y2-pc', title: 'Practical Course for Teachers, lectures VIII–XIV', items: [guide('y2-pc-guide', 'practical', 'Short guide', 2), ...pc(7, 15)] },
        { id: 'y2-dt', title: 'Discussions with Teachers, discussions VIII–XIV', items: [
          guide('y2-dt-guide', 'discussions', 'Short guide', 2), ...dt(7, 14),
          link('dt-closing', 'discussions', 'Discussions with Teachers: Closing Words', `${DT}19190907d19.html`),
        ] },
      ] },
      { id: 'y2-cur', title: 'Curriculum and stories, grades 4–5', units: [
        { id: 'y2-odin', title: 'Norse myths', items: [guide('y2-odin-guide', 'odin', 'Short guide'), read('y2-odin', '24737', 'The Children of Odin', 0, 34)] },
        { id: 'y2-heroes', title: 'Greek hero tales', items: [guide('y2-heroes-guide', 'heroes', 'Short guide'), read('y2-heroes', '677', 'The Heroes', 0, 15)] },
        { id: 'y2-owl', title: 'Teachers’ articles, grades 4–5', items: [owl('y2-owl-link', 'Online Waldorf Library: choose articles for grades 4–5')] },
      ] },
      { id: 'y2-ec', title: 'Early childhood', units: [
        { id: 'y2-ec-u', title: 'Teachers’ articles on early childhood', items: [owl('y2-ec-link', 'Online Waldorf Library: choose articles on play and the kindergarten')] },
      ] },
      { id: 'y2-inner', title: 'Inner development', units: [
        { id: 'y2-woi', title: 'The Way of Initiation, chapters V–VIII', items: [
          read('y2-woi-1', '39986', 'Chapters V and VI', 7, 8),
          read('y2-woi-2', '39986', 'Chapters VII and VIII', 9, 10),
        ] },
      ] },
      { id: 'y2-arts', title: 'The arts', units: [{ id: 'y2-arts-u', title: 'Practice log', items: artsItems(2) }] },
      { id: 'y2-prac', title: 'Observation and practice', units: [
        { id: 'y2-prac-u', title: 'Practice teaching begins', items: [
          guide('y2-prac-guide', 'practicum', 'About this strand'),
          practice('y2-obs-log', 'observation', 'Continue the observation log', 'observation'),
          practice('y2-prac-log', 'practicum', 'Keep a practicum log of lessons you teach', 'practicum'),
        ] },
      ] },
    ],
  },
  {
    id: 'y3', title: 'Year 3', focus: 'Deepening, with the curriculum of grades 6–8',
    model: 'Modeled on the third year of the Southern California program’s published sequence.',
    courses: [
      { id: 'y3-found', title: 'Foundation studies', units: [
        { id: 'y3-occ', title: 'An Outline of Occult Science', items: [
          guide('y3-occ-guide', 'occult', 'Short guide'),
          read('y3-occ-1', '30718', 'Prefaces and chapters I–II', 0, 3),
          read('y3-occ-2', '30718', 'Chapter III: Sleep and Death', 4, 5),
          read('y3-occ-3', '30718', 'Chapter IV: The Evolution of the World and Man', 6, 11),
          read('y3-occ-4', '30718', 'Chapter V: Knowledge of the Higher Worlds', 12, 15),
          read('y3-occ-5', '30718', 'Chapters VI–VII and footnotes', 16, 18),
        ] },
      ] },
      { id: 'y3-sm', title: 'The Study of Man', units: [
        { id: 'y3-sm-u', title: 'Lectures XI–XIV', items: [guide('y3-sm-guide', 'studyOfMan', 'Short guide', 3), ...sm(10, 14)] },
      ] },
      { id: 'y3-art', title: 'The art of teaching', units: [
        { id: 'y3-bal', title: 'Balance in Teaching', items: [
          guide('y3-bal-guide', 'balance', 'Short guide'),
          link('y3-bal-1', 'balance', 'Lecture 1: The Pedagogy of the West and of Central Europe: The Inner Attitude of the Teacher', 'https://rsarchive.org/Lectures/MediMan/19200915a02.html'),
          link('y3-bal-2', 'balance', 'Lecture 2: The Three Fundamental Forces in Education', 'https://rsarchive.org/Lectures/MediMan/19200916p02.html'),
          link('y3-bal-3', 'balance', 'Lecture 3: Spiritual Knowledge of Man as the Fount of Educational Art', 'https://rsarchive.org/Lectures/MediMan/19200921p01.html'),
          link('y3-bal-4', 'balance', 'Lecture 4: Bringing into Balance the Physical and Spiritual Nature of the Developing Human Being', 'https://rsarchive.org/Lectures/MediMan/19200922p01.html'),
        ] },
      ] },
      { id: 'y3-cur', title: 'Curriculum, grades 6–8', units: [
        { id: 'y3-owl', title: 'Teachers’ articles, grades 6–8', items: [owl('y3-owl-link', 'Online Waldorf Library: choose articles for grades 6–8')] },
      ] },
      { id: 'y3-ec', title: 'Early childhood', units: [
        { id: 'y3-ec-u', title: 'Teachers’ articles on early childhood', items: [owl('y3-ec-link', 'Online Waldorf Library: choose articles on readiness for school')] },
      ] },
      { id: 'y3-inner', title: 'Inner development', units: [
        { id: 'y3-deep', title: 'Deeper Insights into Education', items: [
          guide('y3-deep-guide', 'deeper', 'Short guide'),
          link('y3-deep-1', 'deeper', 'Gymnast, Rhetorician, Professor: A Living Synthesis', 'https://rsarchive.org/Lectures/GA302a/English/AP1983/19231015v01.html'),
          link('y3-deep-2', 'deeper', 'Forces Leading to Health and Illness in Education', 'https://rsarchive.org/Lectures/GA302a/English/AP1983/19231016a01.html'),
          link('y3-deep-3', 'deeper', 'A Comprehensive Knowledge of Man as the Source of Imagination in the Teacher', 'https://rsarchive.org/Lectures/GA302a/English/AP1983/19231016p01.html'),
        ] },
      ] },
      { id: 'y3-arts', title: 'The arts', units: [{ id: 'y3-arts-u', title: 'Practice log', items: artsItems(3) }] },
      { id: 'y3-prac', title: 'Observation and practice', units: [
        { id: 'y3-prac-u', title: 'Practice teaching and project', items: [
          practice('y3-prac-log', 'practicum', 'Continue the practicum log', 'practicum'),
          guide('y3-proj-guide', 'project', 'About the independent project'),
          practice('y3-project', 'project', 'Independent project', 'reflection'),
        ] },
      ] },
    ],
  },
];

export const GUIDES = G;

// Gaps stated plainly, shown on the About page.
export const GAPS = [
  'The reading order follows one published program sequence (Southern California, from a 2020 state filing). Other programs order things differently.',
  'I could not open the Online Waldorf Library with my tools, so those items point to the library’s front page and ask you to choose.',
  'I could not open the contents page of The Kingdom of Childhood, so it has one link to the whole book.',
  'The grade placements of story material (fairy tales, fables, Norse and Greek myths) are marked “unsourced” where I could not tie them to a page in the lectures.',
  'The arts, observation and practice teaching are logs only. They are what a training gives in person and an app cannot.',
  'This is not a Waldorf teacher training, is not accredited, and gives no certificate. It has no connection with AWSNA or WECAN.',
];

// ---------- Derived helpers ----------
export function allItems() {
  const out = [];
  for (const y of PLAN) for (const c of y.courses) for (const u of c.units) for (const it of u.items) out.push({ ...it, year: y, course: c, unit: u });
  return out;
}
const _index = new Map();
for (const it of allItems()) {
  if (_index.has(it.id)) throw new Error('duplicate item id ' + it.id);
  _index.set(it.id, it);
}
// shelf items are trackable but do not count toward plan percentages
export const SHELF = ORDER.shelf.map((id) => BOOKS[id]).map((b) => ({ id: 'shelf-' + b.id, type: 'read', book: b.id, title: b.title, shelf: true }));
for (const s of SHELF) _index.set(s.id, s);
export const getItem = (id) => _index.get(id);
export const countable = (it) => it.type !== 'guide' && !it.optional;
