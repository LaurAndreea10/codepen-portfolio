'use strict';
/* Gimnaziu Space — logica aplicației. Totul rulează local, fără server și fără conturi. */
(() => {
  const D = window.GS_DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ───────────── Stocare sigură ───────────── */
  const KEY = 'gimnaziu-space:v1';
  const SKEY = 'gimnaziu-space:settings';
  const store = {
    get(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } }
  };
  const fresh = () => window.GS_PROGRESS.fresh();
  const validate = (s) => window.GS_PROGRESS.normalize(s) || fresh();
  let S = validate(store.get(KEY));
  let SET = Object.assign({ lang: 'ro', theme: 'system', size: '1', font: '', contrast: false, motion: '', spacing: false, sound: true, grade: 0 }, store.get(SKEY, {}));
  const save = () => store.set(KEY, S);
  const saveSet = () => store.set(SKEY, SET);

  /* ───────────── i18n ───────────── */
  const T = {
    ro: {
      skip: 'Sari la conținut', menu: 'Meniu', settings: 'Setări de accesibilitate', settingsTitle: 'Setări de accesibilitate', close: 'Închide',
      navLearn: 'Învață', navPractice: 'Exersează', navYou: 'Tu', navNote: 'Nu este material didactic oficial.',
      'nav.acasa': 'Acasă', 'nav.clase': 'Pe clase', 'nav.formule': 'Formule', 'nav.formuleShort': 'Formule', 'nav.memorator': 'Memoratoare', 'nav.memoShort': 'Memo',
      'nav.glosar': 'Glosar', 'nav.coach': 'AI Coach', 'nav.cartonase': 'Cartonașe', 'nav.quiz': 'Quiz', 'nav.simulare': 'Simulare EN', 'nav.focus': 'Focus & plan', 'nav.progres': 'Progres', 'nav.despre': 'Despre & surse', 'nav.arhiva': 'Subiecte & bareme', 'nav.instrumente': 'Instrumente', 'nav.feedback': 'Testare & feedback', 'nav.compare': 'Compară', 'nav.pisa': 'PISA · aplică',
      'disc.title': 'Important:', 'disc.body': 'aplicație de recapitulare creată independent. Nu este material didactic oficial și nu înlocuiește manualele, profesorul sau documentele Ministerului Educației.',
      'set.theme': 'Temă', 'set.system': 'Ca sistemul', 'set.light': 'Luminoasă', 'set.dark': 'Întunecată', 'set.size': 'Mărimea textului',
      'set.font': 'Font ușor de citit (Lexend)', 'set.spacing': 'Spațiere mai mare între rânduri', 'set.contrast': 'Contrast ridicat', 'set.motion': 'Reduce animațiile', 'set.sound': 'Sunet la final de Pomodoro',
      'set.hint': 'Setările se salvează doar în acest browser.',
      themeTo: { light: 'Comută pe tema întunecată', dark: 'Comută pe tema luminoasă' },
      grade: 'Clasa', grades: 'Clasele', all: 'Toate', subject: 'Materia', search: 'Caută', results: (n) => n === 1 ? '1 rezultat' : `${n} rezultate`,
      gradeN: (g) => `clasa a ${['', '', '', '', '', 'V', 'VI', 'VII', 'VIII'][g]}-a`, gradeShort: (g) => ['', '', '', '', '', 'V', 'VI', 'VII', 'VIII'][g],
      start: 'Începe', next: 'Următoarea', finish: 'Termină', back: 'Înapoi', retry: 'Încă o dată', reset: 'Resetează',
      // Acasă
      homeEyebrow: 'Recapitulare · clasele V–VIII · Evaluarea Națională',
      homeTitle: 'Tot ce trebuie <em>reamintit</em>, într-un singur caiet.',
      homeLede: 'Formule, memoratoare, cartonașe, quiz-uri cu explicații și simulări în stilul Evaluării Naționale. Progresul tău rămâne doar în browser și pornește de la zero.',
      pickGrade: 'În ce clasă ești?', pickGradeHint: 'Filtrele pornesc de la clasa aleasă; o poți schimba oricând.',
      countTitle: 'Până la examen', countDraft: 'Calendar EN VIII 2027 în proiect (MEC, august 2026) — verifică pe edu.ro.',
      countSim: 'zile până la simulare (16 mar. 2027)', countRom: 'zile până la proba de română (22 iun. 2027)', countMat: 'zile până la proba de matematică (24 iun. 2027)', countPast: 'a trecut',
      tabDemo: 'Demo de prezentare', tabMine: 'Experiența mea',
      demoFlag: 'DATE DE EXEMPLU', demoText: 'Valorile de aici sunt inventate, ca să vezi cum arată aplicația după câteva săptămâni de folosire.',
      mineEmpty: 'Încă nu ai progres. Începe cu un quiz scurt sau câteva cartonașe — totul se actualizează automat.',
      st: { xp: 'XP', streak: 'zile la rând', quizzes: 'quiz-uri', acc: 'acuratețe', cards: 'cartonașe repetate', known: 'formule știute', memos: 'memoratoare citite', pomos: 'sesiuni de focus' },
      coachTitle: 'Coach local', coachNote: 'Sugestii calculate în browser, din activitatea ta. Nu trimite date nicăieri. AI Coach oferă explicații orientative.',
      quick: 'Pornire rapidă', quickQuiz: 'Quiz de 5 întrebări', quickCards: 'Repetă cartonașe', quickFormulas: 'Formulele clasei mele', quickSim: 'Simulare EN',
      subjectsTitle: 'Materii',
      coach: {
        start: 'Începe cu un quiz de 5 întrebări din clasa ta — vei vedea imediat unde stai.',
        due: (n) => `Ai ${n} cartonașe de repetat azi. Durează câteva minute.`,
        weak: (s, p) => `${s} are acuratețea cea mai mică (${p}%). Recitește memoratorul, apoi refă un quiz.`,
        strong: (s, p) => `La ${s} stai bine (${p}%). Treci la întrebări din clasa următoare.`,
        sim: (n) => `Mai sunt ${n} zile până la simulare. O simulare pe săptămână e un ritm bun.`,
        streak: 'Ai învățat azi. Păstrează seria și mâine, chiar și 10 minute.',
        nostreak: 'Nu ai învățat încă azi. Un Pomodoro de 25 de minute ajunge ca să nu rupi seria.',
        pomo: 'Încearcă un Pomodoro: 25 de minute de lucru, apoi 5 de pauză.'
      },
      // Clase
      claseTitle: 'Pe clase', claseLede: 'Alege clasa și vezi ce ai de recapitulat la fiecare materie.',
      nForm: (n) => n === 1 ? '1 formulă' : `${n} formule`, nMemo: (n) => n === 1 ? '1 memorator' : `${n} memoratoare`, nQuiz: (n) => n === 1 ? '1 întrebare' : `${n} întrebări`, nTime: (n) => n === 1 ? '1 reper' : `${n} repere`,
      openFormulas: 'Formule', openMemos: 'Memorator', openQuiz: 'Quiz', enBadge: 'Probă la EN',
      // Formule
      formTitle: 'Formule', formLede: 'Formulele de matematică, fizică și chimie din gimnaziu. Marchează ce știi deja și adaugă la favorite ce vrei să repeți.',
      known: 'Știu', fav: 'Favorit', copy: 'Copiază', copied: 'Formula a fost copiată', onlyFav: 'Doar favorite', onlyUnknown: 'Doar ce nu știu',
      noResults: 'Nu am găsit nimic. Schimbă filtrele sau căutarea.',
      // Memorator
      memoTitle: 'Memoratoare', memoLede: 'Fișe scurte pentru recapitulare: gramatică, figuri de stil, ortografie, reguli de matematică, științe, istorie, geografie și engleză.',
      markRead: 'Marchează ca citit', read: 'Citit', print: 'Printează memoratoarele afișate', timelineTitle: 'Repere cronologice',
      // Glosar
      glosTitle: 'Glosar', glosLede: 'Termeni de bază explicați pe scurt.',
      // Cartonașe
      cardsTitle: 'Cartonașe', cardsLede: 'Repetare spațiată în 5 cutii: ce știi revine mai rar, ce greșești revine mâine.',
      deck: 'Pachet', deckType: { all: 'Tot', f: 'Formule', m: 'Memorator', t: 'Date istorice', g: 'Glosar' },
      due: 'de repetat', newC: 'noi', box: (b) => `Cutia ${b}`,
      startCards: 'Începe sesiunea', front: 'Întrebare', backFace: 'Răspuns', flip: 'Întoarce (Spațiu)', iKnow: 'Știu', again: 'Mai repet',
      cardOf: (i, n) => `Cartonașul ${i} din ${n}`, sessionDone: 'Sesiune terminată', sessionStats: (k, a) => `${k} știute · ${a} de repetat`,
      noCards: 'Nu ai cartonașe de repetat acum în acest pachet. Revino mâine sau alege alt pachet.',
      cardsHint: 'Scurtături: Spațiu — întoarce, 1 — mai repet, 2 — știu.',
      // Quiz
      quizTitle: 'Quiz', quizLede: 'Întrebări cu variante și explicații. Răspunsurile se amestecă de fiecare dată.',
      howMany: 'Câte întrebări', question: (i, n) => `Întrebarea ${i} din ${n}`,
      correct: 'Corect!', wrong: 'Greșit.', rightWas: 'Răspunsul corect:', score: 'Scor', review: 'Ce trebuie reluat',
      allRight: 'Toate răspunsurile sunt corecte. Bravo!', notEnough: 'Nu sunt destule întrebări pentru filtrele alese; am folosit toate întrebările disponibile.',
      noQuestions: 'Nu există întrebări pentru această combinație.',
      // Simulare
      simTitle: 'Simulare Evaluare Națională', simLede: 'Exerciții în stilul probelor de la clasa a VIII-a. Scorul este orientativ și nu reprezintă o notă oficială.',
      simMat: 'Matematică', simRom: 'Limba română', duration: 'Durată', noTimer: 'Fără cronometru', minutes: (m) => `${m} min`,
      simMatDesc: '12 itemi cu variante (Subiectele I–II) + 3 probleme cu rezolvare completă (Subiectul III), notate după un barem orientativ.',
      simRomDesc: 'Un text scris pentru aplicație, 6 itemi de înțelegere și limbă, plus o compunere argumentativă evaluată cu o listă de verificare.',
      simStructure: 'Structura reală (2 ore, 3 subiecte) se verifică pe subiecte.edu.ro.',
      simStart: 'Începe simularea', simSubmit: 'Predă lucrarea', simConfirm: 'Sigur predai lucrarea? Nu vei mai putea schimba răspunsurile.',
      partI: 'Subiectele I–II · itemi cu variante (5 p fiecare)', partIII: 'Subiectul III · probleme (10 p fiecare)',
      solveOnPaper: 'Rezolvă pe hârtie, apoi, după predare, compară cu pașii din barem și bifează ce ai obținut.',
      writeHere: 'Scrie compunerea aici', words: (n) => `${n} cuvinte`, readText: 'Citește textul', partRom1: 'Subiectul I · înțelegerea textului (5 p fiecare)', partRom2: 'Subiectul II · compunere (60 p)',
      selfCheck: 'Autoevaluare după barem orientativ', stepPts: (p) => `${p} p`, oficiu: '10 p din oficiu',
      simResult: 'Rezultat orientativ', estGrade: 'Notă estimativă', saveResult: 'Salvează rezultatul', saved: 'Rezultat salvat în progres',
      timeUp: 'Timpul a expirat. Lucrarea a fost predată automat.', timeLeft: 'Timp rămas',
      officialLink: 'Subiecte și bareme oficiale', simHistory: 'Simulările tale',
      // Focus
      focusTitle: 'Focus & plan', focusLede: 'Pomodoro pentru sesiuni scurte și un plan de 7 zile pe care îl bifezi.',
      pFocus: 'Focus 25′', pShort: 'Pauză 5′', pLong: 'Pauză 15′', pStart: 'Pornește', pPause: 'Pauză', pReset: 'Resetează', pDone: 'Sesiune terminată! Ia o pauză.', pBreakDone: 'Pauza s-a terminat.',
      sessionsToday: 'Sesiuni de focus în total', planTitle: 'Plan de 7 zile',
      plan: ['Alege clasa și fă un quiz de 5 întrebări', 'Citește 2 memoratoare la română', '20 de cartonașe cu formule', 'Un Pomodoro la materia cea mai slabă', 'Quiz de 10 întrebări la matematică', 'Recitește greșelile și glosarul', 'O simulare completă (română sau matematică)'],
      tips: ['Pune telefonul departe și oprește notificările.', 'Scrie 1–3 obiective înainte să pornești cronometrul.', 'Repetă la 1, 3 și 7 zile — cartonașele fac asta automat.', 'După 4 sesiuni, ia o pauză lungă.'],
      day: (n) => `Ziua ${n}`,
      // Progres
      progTitle: 'Progresul tău', progLede: 'Statistici calculate local, din activitatea ta în această aplicație.',
      activity: 'Activitate în ultimele 28 de zile', accBySubj: 'Acuratețe pe materii', badges: 'Insigne', noSims: 'Nu ai încă simulări salvate.',
      thDate: 'Data', thType: 'Proba', thScore: 'Punctaj', thGrade: 'Notă est.',
      data: 'Datele tale', exportBtn: 'Exportă (JSON)', importBtn: 'Importă', resetBtn: 'Șterge tot progresul', resetConfirm: 'Sigur ștergi tot progresul? Acțiunea nu se poate anula.',
      resetDone: 'Progresul a fost șters', importDone: 'Progres importat', importBad: 'Fișierul nu este un export valid Gimnaziu Space', importStorage: 'Importul nu a putut fi salvat. Progresul curent a rămas neschimbat.',
      privacy: 'Nimic nu pleacă din browserul tău: nu există conturi, server sau analytics.',
      badgeNew: (b) => `Insignă nouă: ${b}`, xpGain: (n) => `+${n} XP`, level: (n) => `Nivelul ${n}`,
      // Despre
      aboutTitle: 'Despre & surse', aboutLede: 'Ce este și ce nu este Gimnaziu Space.',
      aboutWhat: 'Ce este', aboutWhatBody: 'Un proiect personal de front-end: o aplicație de recapitulare pentru clasele V–VIII, construită pe același principiu ca BAC Space — conținut scurt, exercițiu imediat, progres salvat local, accesibilitate și două limbi.',
      aboutNot: 'Ce nu este', aboutNotBody: 'Nu este material didactic, nu este avizat de Ministerul Educației și nu înlocuiește manualele, programa școlară, profesorul sau subiectele oficiale. Formulele și explicațiile sunt rezumate pentru recapitulare; pot exista simplificări. Dacă ceva diferă de ce ați învățat la clasă, are prioritate profesorul și manualul.',
      aboutA11y: 'Accesibilitate', aboutA11yBody: 'Navigare completă din tastatură, link de salt la conținut, temă luminoasă/întunecată, contrast ridicat, mărirea textului, font Lexend, spațiere mai mare, reducerea animațiilor, ținte de atingere de minimum 44 px, formule citite corect de cititoarele de ecran și mod de culori forțate.',
      aboutPrivacy: 'Confidențialitate', aboutPrivacyBody: 'Progresul și setările se salvează doar în localStorage, în browserul tău. Le poți exporta sau șterge oricând din pagina Progres.',
      aboutLinks: 'Surse oficiale', aboutCal: 'Datele examenului 2027 provin din calendarul publicat în proiect de Ministerul Educației (august 2026) și pot fi modificate. Verifică întotdeauna edu.ro.',
      aboutAuthor: 'Realizat de Laura Andreea · proiect din portofoliul CodePen, în dezvoltare.'
    },
    en: {
      skip: 'Skip to content', menu: 'Menu', settings: 'Accessibility settings', settingsTitle: 'Accessibility settings', close: 'Close',
      navLearn: 'Learn', navPractice: 'Practise', navYou: 'You', navNote: 'Not official teaching material.',
      'nav.acasa': 'Home', 'nav.clase': 'By grade', 'nav.formule': 'Formulas', 'nav.formuleShort': 'Formulas', 'nav.memorator': 'Study sheets', 'nav.memoShort': 'Sheets',
      'nav.glosar': 'Glossary', 'nav.coach': 'AI Coach', 'nav.cartonase': 'Flashcards', 'nav.quiz': 'Quiz', 'nav.simulare': 'Mock exam', 'nav.focus': 'Focus & plan', 'nav.progres': 'Progress', 'nav.despre': 'About & sources', 'nav.arhiva': 'Papers & schemes', 'nav.instrumente': 'Toolkit', 'nav.feedback': 'Testing & feedback', 'nav.compare': 'Compare', 'nav.pisa': 'PISA · practice',
      'disc.title': 'Important:', 'disc.body': 'an independently made revision app. It is not official teaching material and does not replace textbooks, teachers or Ministry of Education documents.',
      'set.theme': 'Theme', 'set.system': 'System', 'set.light': 'Light', 'set.dark': 'Dark', 'set.size': 'Text size',
      'set.font': 'Easy-to-read font (Lexend)', 'set.spacing': 'Wider line spacing', 'set.contrast': 'High contrast', 'set.motion': 'Reduce motion', 'set.sound': 'Sound when a Pomodoro ends',
      'set.hint': 'Settings are saved in this browser only.',
      themeTo: { light: 'Switch to dark theme', dark: 'Switch to light theme' },
      grade: 'Grade', grades: 'Grades', all: 'All', subject: 'Subject', search: 'Search', results: (n) => n === 1 ? '1 result' : `${n} results`,
      gradeN: (g) => `grade ${g}`, gradeShort: (g) => String(g),
      start: 'Start', next: 'Next', finish: 'Finish', back: 'Back', retry: 'Again', reset: 'Reset',
      homeEyebrow: 'Revision · grades 5–8 · National Evaluation',
      homeTitle: 'Everything you need to <em>remember</em>, in one notebook.',
      homeLede: 'Formulas, study sheets, flashcards, quizzes with explanations and mock exams in the style of Romania’s grade-8 National Evaluation. Your progress stays in your browser and starts from zero.',
      pickGrade: 'Which grade are you in?', pickGradeHint: 'Filters start from the chosen grade; you can change it anytime.',
      countTitle: 'Until the exam', countDraft: 'The 2027 grade-8 exam calendar is a draft (Ministry, August 2026) — check edu.ro.',
      countSim: 'days to the mock exam (16 Mar 2027)', countRom: 'days to the Romanian paper (22 Jun 2027)', countMat: 'days to the maths paper (24 Jun 2027)', countPast: 'passed',
      tabDemo: 'Showcase demo', tabMine: 'My experience',
      demoFlag: 'SAMPLE DATA', demoText: 'These values are made up, to show what the app looks like after a few weeks of use.',
      mineEmpty: 'No progress yet. Start with a short quiz or a few flashcards — everything updates automatically.',
      st: { xp: 'XP', streak: 'day streak', quizzes: 'quizzes', acc: 'accuracy', cards: 'cards reviewed', known: 'formulas known', memos: 'sheets read', pomos: 'focus sessions' },
      coachTitle: 'Local coach', coachNote: 'Suggestions computed in your browser from your activity. No data is sent anywhere and no AI is used.',
      quick: 'Quick start', quickQuiz: '5-question quiz', quickCards: 'Review flashcards', quickFormulas: 'My grade’s formulas', quickSim: 'Mock exam',
      subjectsTitle: 'Subjects',
      coach: {
        start: 'Start with a 5-question quiz for your grade — you’ll see right away where you stand.',
        due: (n) => `You have ${n} flashcards due today. It takes a few minutes.`,
        weak: (s, p) => `${s} has your lowest accuracy (${p}%). Re-read the sheet, then retake a quiz.`,
        strong: (s, p) => `You’re doing well in ${s} (${p}%). Try questions from the next grade.`,
        sim: (n) => `${n} days until the mock exam. One mock a week is a good pace.`,
        streak: 'You studied today. Keep the streak tomorrow, even for 10 minutes.',
        nostreak: 'You haven’t studied yet today. One 25-minute Pomodoro keeps the streak alive.',
        pomo: 'Try a Pomodoro: 25 minutes of work, then a 5-minute break.'
      },
      claseTitle: 'By grade', claseLede: 'Pick a grade and see what to revise in each subject.',
      nForm: (n) => n === 1 ? '1 formula' : `${n} formulas`, nMemo: (n) => n === 1 ? '1 sheet' : `${n} sheets`, nQuiz: (n) => n === 1 ? '1 question' : `${n} questions`, nTime: (n) => n === 1 ? '1 date' : `${n} dates`,
      openFormulas: 'Formulas', openMemos: 'Sheets', openQuiz: 'Quiz', enBadge: 'Exam subject',
      formTitle: 'Formulas', formLede: 'Middle-school maths, physics and chemistry formulas. Mark what you already know and star what you want to review.',
      known: 'I know it', fav: 'Star', copy: 'Copy', copied: 'Formula copied', onlyFav: 'Starred only', onlyUnknown: 'Only what I don’t know',
      noResults: 'Nothing found. Change the filters or the search.',
      memoTitle: 'Study sheets', memoLede: 'Short revision sheets: grammar, figures of speech, spelling, maths rules, science, history, geography and English.',
      markRead: 'Mark as read', read: 'Read', print: 'Print the sheets shown', timelineTitle: 'Key dates',
      glosTitle: 'Glossary', glosLede: 'Basic terms explained briefly.',
      cardsTitle: 'Flashcards', cardsLede: 'Spaced repetition in 5 boxes: what you know comes back less often, what you miss comes back tomorrow.',
      deck: 'Deck', deckType: { all: 'Everything', f: 'Formulas', m: 'Sheets', t: 'History dates', g: 'Glossary' },
      due: 'due', newC: 'new', box: (b) => `Box ${b}`,
      startCards: 'Start session', front: 'Question', backFace: 'Answer', flip: 'Flip (Space)', iKnow: 'I know it', again: 'Again',
      cardOf: (i, n) => `Card ${i} of ${n}`, sessionDone: 'Session complete', sessionStats: (k, a) => `${k} known · ${a} to review`,
      noCards: 'No cards due right now in this deck. Come back tomorrow or pick another deck.',
      cardsHint: 'Shortcuts: Space — flip, 1 — again, 2 — I know it.',
      quizTitle: 'Quiz', quizLede: 'Multiple-choice questions with explanations. Options are shuffled every time.',
      howMany: 'How many questions', question: (i, n) => `Question ${i} of ${n}`,
      correct: 'Correct!', wrong: 'Not quite.', rightWas: 'Correct answer:', score: 'Score', review: 'What to revisit',
      allRight: 'Every answer is correct. Well done!', notEnough: 'Not enough questions for these filters; all available questions were used.',
      noQuestions: 'There are no questions for this combination.',
      simTitle: 'National Evaluation mock exam', simLede: 'Practice in the style of the grade-8 papers. The score is an estimate, not an official grade.',
      simMat: 'Mathematics', simRom: 'Romanian', duration: 'Duration', noTimer: 'No timer', minutes: (m) => `${m} min`,
      simMatDesc: '12 multiple-choice items (Parts I–II) + 3 full-solution problems (Part III), scored with a guide marking scheme.',
      simRomDesc: 'A text written for this app, 6 reading and language items, plus an argumentative essay assessed with a checklist.',
      simStructure: 'Always check the real structure (2 hours, 3 parts) on subiecte.edu.ro.',
      simStart: 'Start mock exam', simSubmit: 'Hand in', simConfirm: 'Hand in your paper? You won’t be able to change your answers.',
      partI: 'Parts I–II · multiple-choice items (5 pts each)', partIII: 'Part III · problems (10 pts each)',
      solveOnPaper: 'Solve on paper; after handing in, compare with the marking steps and tick what you got.',
      writeHere: 'Write your essay here', words: (n) => `${n} words`, readText: 'Read the text', partRom1: 'Part I · reading (5 pts each)', partRom2: 'Part II · writing (60 pts)',
      selfCheck: 'Self-assessment with the guide marking scheme', stepPts: (p) => `${p} pts`, oficiu: '10 pts given by default',
      simResult: 'Estimated result', estGrade: 'Estimated grade', saveResult: 'Save result', saved: 'Result saved to progress',
      timeUp: 'Time is up. Your paper was handed in automatically.', timeLeft: 'Time left',
      officialLink: 'Official papers and marking schemes', simHistory: 'Your mock exams',
      focusTitle: 'Focus & plan', focusLede: 'A Pomodoro timer for short sessions and a 7-day plan you can tick off.',
      pFocus: 'Focus 25′', pShort: 'Break 5′', pLong: 'Break 15′', pStart: 'Start', pPause: 'Pause', pReset: 'Reset', pDone: 'Session complete! Take a break.', pBreakDone: 'Break is over.',
      sessionsToday: 'Focus sessions in total', planTitle: '7-day plan',
      plan: ['Pick your grade and take a 5-question quiz', 'Read 2 Romanian study sheets', '20 formula flashcards', 'One Pomodoro on your weakest subject', 'A 10-question maths quiz', 'Re-read mistakes and the glossary', 'A full mock exam (Romanian or maths)'],
      tips: ['Put your phone away and silence notifications.', 'Write 1–3 goals before starting the timer.', 'Review after 1, 3 and 7 days — flashcards do this for you.', 'After 4 sessions, take a long break.'],
      day: (n) => `Day ${n}`,
      progTitle: 'Your progress', progLede: 'Statistics computed locally from your activity in this app.',
      activity: 'Activity in the last 28 days', accBySubj: 'Accuracy by subject', badges: 'Badges', noSims: 'No saved mock exams yet.',
      thDate: 'Date', thType: 'Paper', thScore: 'Points', thGrade: 'Est. grade',
      data: 'Your data', exportBtn: 'Export (JSON)', importBtn: 'Import', resetBtn: 'Delete all progress', resetConfirm: 'Delete all progress? This cannot be undone.',
      resetDone: 'Progress deleted', importDone: 'Progress imported', importBad: 'This file isn’t a valid Gimnaziu Space export', importStorage: 'The import could not be saved. Your current progress is unchanged.',
      privacy: 'Nothing leaves your browser: there are no accounts, servers or analytics.',
      badgeNew: (b) => `New badge: ${b}`, xpGain: (n) => `+${n} XP`, level: (n) => `Level ${n}`,
      aboutTitle: 'About & sources', aboutLede: 'What Gimnaziu Space is, and what it isn’t.',
      aboutWhat: 'What it is', aboutWhatBody: 'A personal front-end project: a revision app for grades 5–8, built on the same principle as BAC Space — short content, immediate practice, progress saved locally, accessibility and two languages.',
      aboutNot: 'What it isn’t', aboutNotBody: 'It is not teaching material, it is not endorsed by the Ministry of Education and it does not replace textbooks, the curriculum, teachers or official exam papers. Formulas and explanations are summaries for revision and may simplify. If something differs from what you learned in class, your teacher and textbook come first.',
      aboutA11y: 'Accessibility', aboutA11yBody: 'Full keyboard navigation, skip link, light/dark theme, high contrast, larger text, Lexend font, wider spacing, reduced motion, touch targets of at least 44 px, formulas read correctly by screen readers and forced-colours support.',
      aboutPrivacy: 'Privacy', aboutPrivacyBody: 'Progress and settings are saved only in localStorage in your browser. You can export or delete them anytime from the Progress page.',
      aboutLinks: 'Official sources', aboutCal: 'The 2027 exam dates come from the draft calendar published by the Ministry of Education (August 2026) and may change. Always check edu.ro.',
      aboutAuthor: 'Made by Laura Andreea · a CodePen portfolio project, in development.'
    }
  };
  const t = (k) => { const v = T[SET.lang][k]; return v === undefined ? (T.ro[k] ?? k) : v; };
  const pick = (o) => (o && typeof o === 'object' && 'ro' in o) ? (o[SET.lang] ?? o.ro) : o;
  const subj = (id) => D.SUBJECTS.find((s) => s.id === id);
  const subjName = (id) => pick(subj(id));

  /* ───────────── Formule: mini-parser ───────────── */
  function parseMath(src) {
    let i = 0;
    function seq(stops) {
      const out = []; let buf = '';
      const flush = () => { if (buf) { out.push({ k: 'txt', v: buf }); buf = ''; } };
      while (i < src.length) {
        const c = src[i];
        if (stops.includes(c)) break;
        if (c === '[' && src.indexOf('|', i) > i) {
          flush(); i++; const n = seq('|'); i++; const d = seq(']'); i++; out.push({ k: 'fr', n, d });
        } else if (c === '√' && src[i + 1] === '{') {
          flush(); i += 2; const v = seq('}'); i++; out.push({ k: 'sq', v });
        } else if ((c === '^' || c === '_') && i + 1 < src.length) {
          flush(); i++;
          let v;
          if (src[i] === '{') { i++; v = seq('}'); i++; } else { v = [{ k: 'txt', v: src[i] }]; i++; }
          out.push({ k: c === '^' ? 'sup' : 'sub', v });
        } else { buf += c; i++; }
      }
      flush(); return out;
    }
    return seq('');
  }
  const html = (nodes) => nodes.map((n) => {
    if (n.k === 'txt') return esc(n.v);
    if (n.k === 'fr') return `<span class="fr"><span class="fr-n">${html(n.n)}</span><span class="fr-d">${html(n.d)}</span></span>`;
    if (n.k === 'sq') return `<span class="sq">√<span class="sq-in">${html(n.v)}</span></span>`;
    return `<${n.k}>${html(n.v)}</${n.k}>`;
  }).join('');
  const SPEAK = {
    ro: { '·': ' ori ', '×': ' ori ', ':': ' împărțit la ', '=': ' egal ', '−': ' minus ', '+': ' plus ', '±': ' plus sau minus ', 'π': 'pi', 'Δ': 'delta ', '⇔': ' echivalent cu ', '⇒': ' rezultă ', '≈': ' aproximativ ', '°': ' grade', '≤': ' mai mic sau egal cu ', '≥': ' mai mare sau egal cu ', '<': ' mai mic decât ', '>': ' mai mare decât ', '≠': ' diferit de ', 'ρ': 'ro', 'η': 'eta', 'λ': 'lambda', '∠': 'unghiul ', '%': ' la sută', '…': ' și așa mai departe ' },
    en: { '·': ' times ', '×': ' times ', ':': ' divided by ', '=': ' equals ', '−': ' minus ', '+': ' plus ', '±': ' plus or minus ', 'π': 'pi', 'Δ': 'delta ', '⇔': ' if and only if ', '⇒': ' gives ', '≈': ' approximately ', '°': ' degrees', '≤': ' at most ', '≥': ' at least ', '<': ' less than ', '>': ' greater than ', '≠': ' not equal to ', 'ρ': 'rho', 'η': 'eta', 'λ': 'lambda', '∠': 'angle ', '%': ' percent', '…': ' and so on ' }
  };
  function speak(nodes, lang) {
    const m = SPEAK[lang];
    const w = lang === 'en'
      ? { over: ' over ', root: 'square root of ', sq: ' squared', cube: ' cubed', pow: ' to the power ', sub: ' sub ', open: ' ( ', close: ' ) ' }
      : { over: ' supra ', root: 'radical din ', sq: ' la pătrat', cube: ' la cub', pow: ' la puterea ', sub: ' indice ', open: ' ( ', close: ' ) ' };
    return nodes.map((n) => {
      if (n.k === 'txt') {
        const abs = lang === 'en' ? 'absolute value of ' : 'modulul lui ';
        const v = n.v.replace(/\|(\w)\|/g, (_, x) => ` ${abs}${x} `)
          // „RG”, „Llh”, „ab” sunt produse de litere: le citim separat, nu ca pe un cuvânt
          .replace(/[A-Za-zπ]+/g, (w) => (w.length <= 5 && w !== 'Pa' && (/[A-Zπ][A-Za-zπ]|[a-zπ][A-Zπ]/.test(w) || ['ab', 'ac', 'ax', 'bc', 'lh', 'Ll'].includes(w))) ? w.split('').join(' ') : w);
        return [...v].map((c) => m[c] ?? c).join('');
      }
      if (n.k === 'fr') return w.open + speak(n.n, lang) + w.over + speak(n.d, lang) + w.close;
      if (n.k === 'sq') return w.root + w.open + speak(n.v, lang) + w.close;
      if (n.k === 'sup') { const s = speak(n.v, lang).trim(); return (s === '2' ? w.sq : s === '3' ? w.cube : w.pow + s) + ' '; }
      return w.sub + speak(n.v, lang) + ' ';
    }).join('').replace(/\s+/g, ' ').trim();
  }
  const mathCache = new Map();
  function renderMath(src, cls = 'f-math') {
    if (!mathCache.has(src)) mathCache.set(src, parseMath(src));
    const nodes = mathCache.get(src);
    return `<span class="${cls}"><span aria-hidden="true">${html(nodes)}</span><span class="sr">${esc(speak(nodes, SET.lang))}</span></span>`;
  }
  const plainMath = (src) => src.replace(/\[([^|\]]*)\|([^\]]*)\]/g, '($1)/($2)').replace(/√\{([^}]*)\}/g, '√($1)').replace(/\^\{([^}]*)\}/g, '^($1)').replace(/_\{([^}]*)\}/g, '_$1');

  /* ───────────── Util ───────────── */
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const inGrade = (g, sel) => !sel || (Array.isArray(g) ? g.includes(sel) : g === sel);
  const norm = (s) => String(s).toLocaleLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const reportQuestionUrl = (q) => { const p = new URLSearchParams({ item: `${q.s}-${q.g}`, subject: q.s, grade: q.g, q: pick(q.q) }); return `#feedback?${p}`; };
  function competency(q) {
    if (q.topic && typeof q.topic === 'string') return { id: q.topic, ro: q.topicLabel || q.topic, en: q.topicLabelEn || q.topicLabel || q.topic };
    const text = norm(`${pick(q.q)} ${pick(q.x)}`);
    const has = (...terms) => terms.some((w) => text.includes(norm(w)));
    const topics = {
      mat: [
        ['number', 'Numere și operații', 'Numbers and operations', ['restul', 'divide', 'diviz', 'putere', 'exponent', 'multiplu', 'frac', 'procent', 'mean', 'remainder', 'power']],
        ['algebra', 'Algebră și ecuații', 'Algebra and equations', ['ecuati', 'ecuaț', 'necunosc', 'x este', 'proport', 'raport', 'equation', 'unknown']],
        ['geometry', 'Geometrie și măsurare', 'Geometry and measurement', ['unghi', 'triunghi', 'dreptunghi', 'arie', 'perimetru', 'cerc', 'cm', 'cm²', 'geometr', 'angle', 'triangle', 'area', 'perimeter']],
        ['data', 'Date și probabilitate', 'Data and probability', ['probabil', 'media aritmetic', 'grafic', 'diagram', 'average', 'die', 'zar']]
      ],
      rom: [
        ['reading', 'Înțelegerea textului', 'Reading comprehension', ['textul', 'fragment', 'autorul', 'ideea principal', 'personaj', 'citat', 'text', 'character', 'main idea']],
        ['grammar', 'Gramatică', 'Grammar', ['substantiv', 'verb', 'adjectiv', 'pronume', 'predicat', 'subiectul', 'parte de vorbire', 'gramatic', 'noun', 'verb', 'adjective']],
        ['writing', 'Comunicare și redactare', 'Writing and communication', ['scrie', 'formuleaz', 'enunț', 'propozi', 'punctua', 'ortograf', 'write', 'sentence']]
      ],
      fiz: [['physics', 'Fenomene și mărimi fizice', 'Physical quantities and phenomena', ['vitez', 'distan', 'timp', 'forț', 'energie', 'electric', 'temperatur', 'density', 'speed', 'force']]],
      chi: [['chemistry', 'Substanțe și reacții', 'Substances and reactions', ['atom', 'molecul', 'element', 'substan', 'reacț', 'solution', 'chemical']]],
      bio: [['biology', 'Organisme și viață', 'Organisms and life', ['celul', 'plant', 'animal', 'organism', 'sistem', 'ecosistem', 'body', 'photosynthesis']]],
      ist: [['history', 'Cronologie și evenimente', 'Chronology and events', ['anul', 'secol', 'domn', 'război', 'eveniment', 'cauz', 'consecin', 'century', 'event']]],
      geo: [['geography', 'Hărți și geografie', 'Maps and geography', ['hart', 'continent', 'clim', 'popula', 'relief', 'râu', 'ocean', 'map', 'country']]],
      eng: [['english', 'Vocabular și gramatică', 'Vocabulary and grammar', ['choose', 'complete', 'verb', 'tense', 'word', 'sentence', 'vocabular', 'grammar']]]
    };
    const options = topics[q.s] || [];
    const match = options.find(([, , , terms]) => has(...terms));
    const fallback = { mat: ['math-mixed', 'Calcul și raționament', 'Calculation and reasoning'], rom: ['romanian-mixed', 'Limbă și text', 'Language and text'], fiz: ['physics-mixed', 'Noțiuni de fizică', 'Physics concepts'], chi: ['chemistry-mixed', 'Noțiuni de chimie', 'Chemistry concepts'], bio: ['biology-mixed', 'Noțiuni de biologie', 'Biology concepts'], ist: ['history-mixed', 'Noțiuni de istorie', 'History concepts'], geo: ['geography-mixed', 'Noțiuni de geografie', 'Geography concepts'], eng: ['english-mixed', 'Limba engleză', 'English language'] }[q.s] || ['general', 'Competență generală', 'General skills'];
    return match ? { id: match[0], ro: match[1], en: match[2] } : { id: fallback[0], ro: fallback[1], en: fallback[2] };
  }
  const fmtDate = (iso) => new Date(iso).toLocaleDateString(SET.lang === 'en' ? 'en-GB' : 'ro-RO', { day: 'numeric', month: 'short', year: 'numeric' });
  const daysUntil = (iso) => Math.ceil((new Date(iso + 'T09:00:00') - new Date()) / 86400000);

  function streak() {
    let n = 0; const d = new Date();
    if (!S.days[dayKey(d)]) d.setDate(d.getDate() - 1);
    while (S.days[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  const level = () => 1 + Math.floor(S.xp / 150);
  const accuracy = (s) => { const q = s ? S.quiz[s] : Object.values(S.quiz).reduce((a, b) => ({ ok: a.ok + b.ok, bad: a.bad + b.bad }), { ok: 0, bad: 0 }); if (!q) return null; const n = q.ok + q.bad; return n ? Math.round(q.ok / n * 100) : null; };
  const difficulty = (q) => {
    const txt = norm(`${pick(q.q)} ${pick(q.x)}`);
    if (/ecuat|ecuaț|radical|proport|piramid|neutraliz|echilibrat|argumentativ|scale|scar[aă]/.test(txt)) return 'challenge';
    if (q.g >= 7 || /procent|fract|triunghi|energia|densitat|fotosintez|predicat|present simple/.test(txt)) return 'medium';
    return 'easy';
  };
  const diffLabel = (key) => ({ easy: tx('Mai accesibil', 'Gentle start'), medium: tx('Nivel mediu', 'Medium'), challenge: tx('Provocare', 'Challenge') }[key]);
  const say = (text) => { if (!('speechSynthesis' in window)) { toast(tx('Citirea vocală nu este disponibilă în acest browser.', 'Speech is unavailable in this browser.')); return; } speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(String(text)); u.lang = SET.lang === 'en' ? 'en-GB' : 'ro-RO'; speechSynthesis.speak(u); };
  const guide = { el: null, on: false };
  function setReadingGuide(on) { guide.on = on; if (on && !guide.el) { guide.el = document.createElement('div'); guide.el.className = 'read-guide'; guide.el.setAttribute('aria-hidden', 'true'); document.body.append(guide.el); } if (guide.el) guide.el.hidden = !on; $('#reading-guide-btn')?.setAttribute('aria-pressed', String(on)); }
  function printWorksheet(questions) {
    const w = window.open('', '_blank'); if (!w) { toast(tx('Permite fereastra de printare pentru a crea fișa.', 'Allow the print window to create the worksheet.')); return; }
    const lang = SET.lang; const title = tx('Fișă de lucru · Gimnaziu Space', 'Practice worksheet · Gimnaziu Space');
    w.document.write(`<!doctype html><html lang="${lang}"><meta charset="utf-8"><title>${title}</title><style>body{font:16px system-ui;max-width:850px;margin:2rem auto;color:#111}h1{font-size:24px}li{margin:1.2rem 0;break-inside:avoid}.answer{margin:.3rem 0 .3rem 1.2rem}.space{height:2.6rem;border-bottom:1px solid #bbb;margin:.5rem 0}</style><h1>${title}</h1><p>${tx('Nume: ____________________  Data: __________', 'Name: ____________________  Date: __________')}</p><ol>${questions.map(q => `<li><strong>${esc(pick(q.q))}</strong>${q.o.map((o,i)=>`<div class="answer">${'ABCD'[i]}. ${esc(pick(o))}</div>`).join('')}<div class="space"></div></li>`).join('')}</ol><script>window.onload=()=>window.print()<\/script></html>`); w.document.close();
  }
  function recordMistake(q, oi) {
    const mistake = { id: q.s + '|' + pick(q.q), s: q.s, g: q.g, topic: competency(q).id, q: q.q, chosen: q.o[oi], correct: q.o[q.a], x: q.x, stage: 0, nextReview: Date.now() + 86400000, when: new Date().toISOString() };
    S.mistakes = [...(S.mistakes || [])].filter((m) => m && m.id !== mistake.id).concat(mistake).slice(-50);
    save();
  }


  function gain(xp, silent) {
    S.xp += xp; const k = today(); S.days[k] = (S.days[k] || 0) + xp;
    checkBadges(); save();
    if (!silent && xp) toast(t('xpGain')(xp));
  }
  function checkBadges() {
    const subjAnswered = Object.keys(S.quiz).filter((k) => (S.quiz[k].ok + S.quiz[k].bad) > 0).length;
    const st = streak();
    const rules = {
      'first-quiz': S.quizzes >= 1, perfect: S.perfect >= 1, 'cards-20': S.reviews >= 20, 'cards-100': S.reviews >= 100,
      'formulas-10': Object.keys(S.known).length >= 10, 'memo-5': Object.keys(S.memoRead).length >= 5, 'pomo-1': S.pomos >= 1, 'pomo-10': S.pomos >= 10,
      'sim-1': S.sims.length >= 1, 'streak-3': st >= 3, 'streak-7': st >= 7, 'all-subj': subjAnswered >= D.SUBJECTS.length
    };
    for (const b of D.BADGES) if (rules[b.id] && !S.badges[b.id]) { S.badges[b.id] = today(); setTimeout(() => toast(t('badgeNew')(pick(b.t))), 900); }
  }

  let toastTimer;
  function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2400); }
  const announce = (msg) => { const a = $('#announcer'); a.textContent = ''; setTimeout(() => { a.textContent = msg; }, 30); };

  /* ───────────── Setări ───────────── */
  function applySettings() {
    const d = document.documentElement;
    d.lang = SET.lang;
    if (SET.theme === 'light' || SET.theme === 'dark') d.dataset.theme = SET.theme; else delete d.dataset.theme;
    SET.contrast ? (d.dataset.contrast = 'high') : delete d.dataset.contrast;
    SET.font === 'lexend' ? (d.dataset.font = 'lexend') : delete d.dataset.font;
    SET.motion === 'reduce' ? (d.dataset.motion = 'reduce') : delete d.dataset.motion;
    SET.spacing ? (d.dataset.spacing = 'wide') : delete d.dataset.spacing;
    d.style.setProperty('--scale', SET.size || '1');
    $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $$('[data-set-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setLang === SET.lang)));
    $$('[data-set-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setTheme === SET.theme)));
    $$('[data-set-size]').forEach((b) => { b.setAttribute('aria-pressed', String(b.dataset.setSize === String(SET.size || '1'))); b.setAttribute('aria-label', `${t('set.size')} ${Math.round(Number(b.dataset.setSize) * 100)}%`); });
    $('#set-font').checked = SET.font === 'lexend';
    $('#set-spacing').checked = !!SET.spacing;
    $('#set-contrast').checked = !!SET.contrast;
    $('#set-motion').checked = SET.motion === 'reduce';
    $('#set-sound').checked = SET.sound !== false;
    const dark = isDark();
    $('#theme-label').textContent = t('themeTo')[dark ? 'dark' : 'light'];
    $('#theme-btn').setAttribute('aria-pressed', String(dark));
    $('.sidenav').setAttribute('aria-label', SET.lang === 'en' ? 'Sections' : 'Secțiuni');
    $('.tabbar').setAttribute('aria-label', SET.lang === 'en' ? 'Quick navigation' : 'Navigare rapidă');
  }
  const isDark = () => SET.theme === 'dark' || (SET.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);

  /* ───────────── Router ───────────── */
  const VIEWS = {};
  let current = '';
  let cleanup = null;
  function route(focus = true) {
    const [name, qs] = (location.hash.slice(1) || 'acasa').split('?');
    const view = VIEWS[name] ? name : 'acasa';
    const params = new URLSearchParams(qs || '');
    if (cleanup) { cleanup(); cleanup = null; }
    current = view;
    $$('[data-nav]').forEach((a) => a.dataset.nav === view ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    // element nou la fiecare rută, ca ascultătorii vechi să dispară odată cu vechea vedere
    const old = $('#view');
    const el = document.createElement('div');
    el.id = 'view';
    old.replaceWith(el);
    VIEWS[view](el, params);
    const h1 = $('h1', el);
    document.title = `${h1 ? h1.textContent : 'Gimnaziu Space'} · Gimnaziu Space`;
    closeNav();
    if (focus && h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  }
  const head = (eyebrow, title, lede) => `<header class="view-head">${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<h1>${title}</h1>${lede ? `<p class="lede">${lede}</p>` : ''}</header>`;

  /* Filtre reutilizabile */
  function subjPills(selected, list, attr = 's') {
    return `<div class="filter-row" role="group" aria-label="${t('subject')}"><span class="lbl" aria-hidden="true">${t('subject')}</span>
      <button type="button" class="pill" data-${attr}="" aria-pressed="${!selected}">${t('all')}</button>
      ${list.map((s) => `<button type="button" class="pill" data-${attr}="${s.id}" aria-pressed="${selected === s.id}"><span class="subj-dot" style="--h:${s.hue}" aria-hidden="true"></span>${esc(pick(s))}</button>`).join('')}</div>`;
  }
  function gradePills(selected, grades = [5, 6, 7, 8]) {
    return `<div class="filter-row" role="group" aria-label="${t('grade')}"><span class="lbl" aria-hidden="true">${t('grade')}</span>
      <button type="button" class="pill" data-g="" aria-pressed="${!selected}">${t('all')}</button>
      ${grades.map((g) => `<button type="button" class="pill" data-g="${g}" aria-pressed="${selected === g}" aria-label="${t('gradeN')(g)}">${t('gradeShort')(g)}</button>`).join('')}</div>`;
  }
  const gradeChips = (g) => (Array.isArray(g) ? g : [g]).map((x) => `<span class="chip">${t('gradeN')(x)}</span>`).join(' ');
  const subjChip = (id) => { const s = subj(id); return `<span class="chip subj-chip" style="--h:${s.hue}"><span class="subj-dot" style="--h:${s.hue}" aria-hidden="true"></span>${esc(pick(s))}</span>`; };

  /* ───────────── Acasă ───────────── */
  const DEMO = { xp: 820, streak: 6, quizzes: 14, acc: 81, cards: 236, known: 31, memos: 9, pomos: 17 };
  let homeTab = 'mine';
  VIEWS.acasa = (el) => {
    const g = SET.grade;
    const counts = [['sim', 'countSim'], ['rom', 'countRom'], ['mat', 'countMat']].map(([k, label]) => {
      const n = daysUntil(D.EXAM_DATES[k]);
      return `<div class="count-item"><b>${n >= 0 ? n : '—'}</b><span>${n >= 0 ? t(label) : t('countPast')}</span></div>`;
    }).join('');
    el.innerHTML = `
      <div class="hero">
        <div class="card">
          <p class="eyebrow">${t('homeEyebrow')}</p>
          <h1>${t('homeTitle')}</h1>
          <p class="lede">${t('homeLede')}</p>
          <h2 class="small" style="font-family:var(--font);margin-top:1rem" id="pick-lbl">${t('pickGrade')}</h2>
          <div class="grade-pick" role="group" aria-labelledby="pick-lbl">
            ${[5, 6, 7, 8].map((x) => `<button type="button" data-grade="${x}" aria-pressed="${g === x}">${t('gradeShort')(x)}<small>${SET.lang === 'en' ? 'grade' : 'clasa'}</small></button>`).join('')}
          </div>
          <p class="hint" style="margin-top:.5rem">${t('pickGradeHint')}</p>
        </div>
        <div class="card count-card">
          <h2>${t('countTitle')}</h2>
          ${counts}
          <p class="hint">${t('countDraft')}</p>
        </div>
      </div>
      <section aria-labelledby="exp-h">
        <h2 id="exp-h" class="sr">${t('tabMine')}</h2>
        <div class="tabs" role="tablist">
          <button type="button" role="tab" id="tab-mine" aria-controls="panel-exp" aria-selected="${homeTab === 'mine'}" data-tab="mine">${t('tabMine')}</button>
          <button type="button" role="tab" id="tab-demo" aria-controls="panel-exp" aria-selected="${homeTab === 'demo'}" data-tab="demo">${t('tabDemo')}</button>
        </div>
        <div id="panel-exp" role="tabpanel" aria-labelledby="tab-${homeTab}"></div>
      </section>
      <section aria-labelledby="quick-h">
        <h2 id="quick-h">${t('quick')}</h2>
        <div class="row">
          <a class="btn primary" href="#diagnostic?s=mat${g ? `&g=${g}` : ''}">${tx('Diagnostic inițial', 'Start diagnostic')}</a>
          <a class="btn" href="#quiz?n=5${g ? `&g=${g}` : ''}&go=1">${t('quickQuiz')}</a>
          <a class="btn" href="#cartonase">${t('quickCards')}</a>
          <a class="btn" href="#formule${g ? `?g=${g}` : ''}">${t('quickFormulas')}</a>
          <a class="btn" href="#simulare">${t('quickSim')}</a>
        </div>
      </section>
      <section aria-labelledby="subj-h">
        <h2 id="subj-h">${t('subjectsTitle')}</h2>
        <div class="grid g4">
          ${D.SUBJECTS.filter((s) => !g || s.grades.includes(g)).map((s) => `
            <a class="card subj-tile" style="--h:${s.hue}" href="#clase?s=${s.id}${g ? `&g=${g}` : ''}">
              <span class="big" aria-hidden="true">${s.icon}</span>
              <strong>${esc(pick(s))}</strong>
              <span class="small muted">${s.grades.map((x) => t('gradeShort')(x)).join(' · ')}${s.en8 ? ` · ${t('enBadge')}` : ''}</span>
            </a>`).join('')}
        </div>
      </section>`;
    const panel = $('#panel-exp', el);
    const paint = () => {
      const isDemo = homeTab === 'demo';
      const v = isDemo ? DEMO : { xp: S.xp, streak: streak(), quizzes: S.quizzes, acc: accuracy(), cards: S.reviews, known: Object.keys(S.known).length, memos: Object.keys(S.memoRead).length, pomos: S.pomos };
      const st = t('st');
      const empty = !isDemo && !S.xp;
      panel.setAttribute('aria-labelledby', `tab-${homeTab}`);
      panel.innerHTML = `
        ${isDemo ? `<span class="demo-flag">${t('demoFlag')}</span><p class="muted">${t('demoText')}</p>` : ''}
        ${empty ? `<p class="muted">${t('mineEmpty')}</p>` : ''}
        <div class="grid g4">
          ${[['xp', v.xp], ['streak', v.streak], ['quizzes', v.quizzes], ['acc', v.acc == null ? '—' : v.acc + '%'], ['cards', v.cards], ['known', v.known], ['memos', v.memos], ['pomos', v.pomos]]
            .map(([k, n]) => `<div class="stat"><b>${n}</b><span>${st[k]}</span></div>`).join('')}
        </div>
        ${isDemo ? '' : `<p class="small muted" style="margin-top:.6rem">${t('level')(level())} · ${S.xp} XP</p>`}
        <div class="card coach" style="margin-top:1rem">
          <h3>${t('coachTitle')}</h3>
          <ul>${coachTips(isDemo).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          <p class="hint">${t('coachNote')}</p>
        </div>`;
      $$('[data-tab]', el).forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === homeTab)));
    };
    paint();
    el.addEventListener('click', (e) => {
      const tb = e.target.closest('[data-tab]');
      if (tb) { homeTab = tb.dataset.tab; paint(); tb.focus(); }
      const gb = e.target.closest('[data-grade]');
      if (gb) { const x = Number(gb.dataset.grade); SET.grade = SET.grade === x ? 0 : x; saveSet(); route(false); $(`[data-grade="${x}"]`)?.focus(); }
    });
    $('.tabs', el).addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      homeTab = homeTab === 'mine' ? 'demo' : 'mine'; paint(); $(`[data-tab="${homeTab}"]`, el).focus();
    });
  };
  function coachTips(demo) {
    const c = t('coach');
    if (demo) return [c.due(12), c.weak(subjName('fiz'), 58), c.sim(Math.max(0, daysUntil(D.EXAM_DATES.sim)))];
    const tips = [];
    const due = buildDeck('all', '', 0).filter((x) => isDue(x.id) && S.cards[x.id]).length;
    if (!S.xp) tips.push(c.start);
    if (due) tips.push(c.due(due));
    const accs = Object.keys(S.quiz).filter((k) => S.quiz[k].ok + S.quiz[k].bad >= 3).map((k) => [k, accuracy(k)]).sort((a, b) => a[1] - b[1]);
    if (accs.length && accs[0][1] < 75) tips.push(c.weak(subjName(accs[0][0]), accs[0][1]));
    else if (accs.length) tips.push(c.strong(subjName(accs[accs.length - 1][0]), accs[accs.length - 1][1]));
    if (S.xp) tips.push(S.days[today()] ? c.streak : c.nostreak);
    const ds = daysUntil(D.EXAM_DATES.sim);
    if (ds > 0 && tips.length < 4) tips.push(c.sim(ds));
    if (!S.pomos && tips.length < 4) tips.push(c.pomo);
    return tips.slice(0, 4);
  }

  /* ───────────── Pe clase ───────────── */
  VIEWS.clase = (el, p) => {
    let g = Number(p.get('g')) || SET.grade || 8;
    const focusS = p.get('s');
    const paint = () => {
      const list = D.SUBJECTS.filter((s) => s.grades.includes(g));
      el.innerHTML = head(t('gradeN')(g), t('claseTitle'), t('claseLede')) + `
        <div class="grade-pick" role="group" aria-label="${t('grade')}" style="max-width:520px;margin-bottom:1.5rem">
          ${[5, 6, 7, 8].map((x) => `<button type="button" data-cg="${x}" aria-pressed="${g === x}">${t('gradeShort')(x)}<small>${SET.lang === 'en' ? 'grade' : 'clasa'}</small></button>`).join('')}
        </div>
        <div class="grid g2">
          ${list.map((s) => {
            const nf = D.FORMULAS.filter((f) => f.s === s.id && inGrade(f.g, g)).length;
            const nm = D.MEMOS.filter((m) => m.s === s.id && inGrade(m.g, g)).length;
            const nq = D.QUIZ.filter((q) => q.s === s.id && q.g === g).length;
            const nt = s.id === 'ist' ? D.TIMELINE.filter((x) => x.g === g).length : 0;
            return `<article class="card stack" id="c-${s.id}" style="--h:${s.hue}">
              <div class="row"><span class="subj-tile"><span class="big" aria-hidden="true">${s.icon}</span></span><h2 style="margin:0">${esc(pick(s))}</h2>${s.en8 && g === 8 ? `<span class="chip">${t('enBadge')}</span>` : ''}</div>
              <p class="small muted">${[nf && t('nForm')(nf), nm && t('nMemo')(nm), nt && t('nTime')(nt), nq && t('nQuiz')(nq)].filter(Boolean).join(' · ')}</p>
              <div class="row">
                ${nf ? `<a class="btn sm" href="#formule?s=${s.id}&g=${g}">${t('openFormulas')}</a>` : ''}
                ${nm || nt ? `<a class="btn sm" href="#memorator?s=${s.id}&g=${g}">${t('openMemos')}</a>` : ''}
                ${nq ? `<a class="btn sm primary" href="#quiz?s=${s.id}&g=${g}&n=${Math.min(10, nq)}&go=1">${t('openQuiz')}</a>` : ''}
              </div>
            </article>`;
          }).join('')}
        </div>`;
    };
    paint();
    if (focusS) requestAnimationFrame(() => $(`#c-${focusS}`, el)?.scrollIntoView({ block: 'center' }));
    el.addEventListener('click', (e) => { const b = e.target.closest('[data-cg]'); if (b) { g = Number(b.dataset.cg); paint(); $(`[data-cg="${g}"]`, el).focus(); } });
  };

  /* ───────────── Formule ───────────── */
  VIEWS.formule = (el, p) => {
    const st = { s: p.get('s') || '', g: Number(p.get('g')) || 0, q: '', fav: false, unknown: false };
    const subs = D.SUBJECTS.filter((s) => D.FORMULAS.some((f) => f.s === s.id));
    el.innerHTML = head('∑', t('formTitle'), t('formLede')) + `
      <div class="filters">
        <label class="sr" for="f-search">${t('search')}</label>
        <input id="f-search" class="search" type="search" placeholder="${t('search')}… (Pitagora, densitate, moli)" autocomplete="off">
        <div id="f-subj"></div><div id="f-grade"></div>
        <div class="filter-row"><button type="button" class="pill" id="f-fav" aria-pressed="false">★ ${t('onlyFav')}</button><button type="button" class="pill" id="f-unk" aria-pressed="false">${t('onlyUnknown')}</button></div>
      </div>
      <p class="count" id="f-count" aria-live="polite"></p>
      <div class="grid g2" id="f-list"></div>`;
    const list = $('#f-list', el);
    const paintFilters = () => { $('#f-subj', el).innerHTML = subjPills(st.s, subs); $('#f-grade', el).innerHTML = gradePills(st.g); };
    const paint = () => {
      const q = norm(st.q);
      const items = D.FORMULAS.filter((f) => (!st.s || f.s === st.s) && inGrade(f.g, st.g) && (!st.fav || S.fav[f.id]) && (!st.unknown || !S.known[f.id]) &&
        (!q || norm(pick(f.t) + ' ' + pick(f.m) + ' ' + (f.n ? pick(f.n) : '')).includes(q)));
      $('#f-count', el).textContent = t('results')(items.length);
      list.innerHTML = items.length ? items.map((f) => `
        <article class="card f-card">
          <div class="row">${subjChip(f.s)} ${gradeChips(f.g)}</div>
          <h3>${esc(pick(f.t))}</h3>
          ${renderMath(pick(f.m))}
          ${f.n ? `<p class="f-note">${renderMath(pick(f.n), 'f-inline')}</p>` : ''}
          <div class="f-actions">
            <button type="button" class="btn sm toggle" data-known="${f.id}" aria-pressed="${!!S.known[f.id]}">✓ ${t('known')}</button>
            <button type="button" class="btn sm toggle star" data-fav="${f.id}" aria-pressed="${!!S.fav[f.id]}" aria-label="${t('fav')}: ${esc(pick(f.t))}">★</button>
            <button type="button" class="btn sm ghost" data-copy="${f.id}">${t('copy')}</button>
          </div>
        </article>`).join('') : `<p class="muted">${t('noResults')}</p>`;
    };
    paintFilters(); paint();
    $('#f-search', el).addEventListener('input', (e) => { st.q = e.target.value; paint(); });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-s')) { st.s = b.dataset.s; paintFilters(); paint(); $(`[data-s="${st.s}"]`, el).focus(); }
      else if (b.hasAttribute('data-g')) { st.g = Number(b.dataset.g) || 0; paintFilters(); paint(); $(`[data-g="${b.dataset.g}"]`, el).focus(); }
      else if (b.id === 'f-fav') { st.fav = !st.fav; b.setAttribute('aria-pressed', String(st.fav)); paint(); }
      else if (b.id === 'f-unk') { st.unknown = !st.unknown; b.setAttribute('aria-pressed', String(st.unknown)); paint(); }
      else if (b.dataset.known) {
        const id = b.dataset.known; const on = !S.known[id];
        if (on) { S.known[id] = 1; gain(2); } else { delete S.known[id]; save(); }
        b.setAttribute('aria-pressed', String(on));
      } else if (b.dataset.fav) {
        const id = b.dataset.fav; const on = !S.fav[id];
        on ? (S.fav[id] = 1) : delete S.fav[id]; save(); b.setAttribute('aria-pressed', String(on));
      } else if (b.dataset.copy) {
        const f = D.FORMULAS.find((x) => x.id === b.dataset.copy);
        const text = `${pick(f.t)}: ${plainMath(pick(f.m))}`;
        (navigator.clipboard?.writeText(text) || Promise.reject()).then(() => toast(t('copied'))).catch(() => toast(text));
      }
    });
  };

  /* ───────────── Memoratoare ───────────── */
  VIEWS.memorator = (el, p) => {
    const st = { s: p.get('s') || '', g: Number(p.get('g')) || 0, q: '' };
    el.innerHTML = head('▤', t('memoTitle'), t('memoLede')) + `
      <div class="filters">
        <label class="sr" for="m-search">${t('search')}</label>
        <input id="m-search" class="search" type="search" placeholder="${t('search')}… (metafora, s-a, Burebista)" autocomplete="off">
        <div id="m-subj"></div><div id="m-grade"></div>
        <div class="row no-print"><button type="button" class="btn sm" id="m-print">⎙ ${t('print')}</button></div>
      </div>
      <p class="count" id="m-count" aria-live="polite"></p>
      <div class="stack" id="m-list"></div>`;
    const paintFilters = () => { $('#m-subj', el).innerHTML = subjPills(st.s, D.SUBJECTS); $('#m-grade', el).innerHTML = gradePills(st.g); };
    const paint = () => {
      const q = norm(st.q);
      const memos = D.MEMOS.filter((m) => (!st.s || m.s === st.s) && inGrade(m.g, st.g)).map((m) => {
        if (!q) return [m, m.i];
        const hit = norm(pick(m.t)).includes(q);
        const items = m.i.filter(([a, b]) => hit || norm(pick(a) + ' ' + pick(b)).includes(q));
        return [m, items];
      }).filter(([, items]) => items.length);
      const tl = (!st.s || st.s === 'ist') ? D.TIMELINE.filter((x) => (!st.g || x.g === st.g) && (!q || norm(x.y + ' ' + pick(x.e)).includes(q))) : [];
      $('#m-count', el).textContent = t('results')(memos.length + (tl.length ? 1 : 0));
      $('#m-list', el).innerHTML = memos.map(([m, items]) => `
        <details class="card memo" ${q || memos.length <= 2 ? 'open' : ''} data-memo="${m.id}">
          <summary><span class="subj-dot" style="--h:${subj(m.s).hue}" aria-hidden="true"></span><h3>${esc(pick(m.t))}</h3>${S.memoRead[m.id] ? `<span class="chip">✓ ${t('read')}</span>` : ''}</summary>
          <div class="row" style="padding:0 1.2rem .5rem">${subjChip(m.s)} ${gradeChips(m.g)}</div>
          <dl>${items.map(([a, b]) => `<dt>${esc(pick(a))}</dt><dd>${esc(pick(b))}</dd>`).join('')}</dl>
          <div class="memo-foot"><button type="button" class="btn sm toggle" data-read="${m.id}" aria-pressed="${!!S.memoRead[m.id]}">✓ ${S.memoRead[m.id] ? t('read') : t('markRead')}</button></div>
        </details>`).join('') + (tl.length ? `
        <details class="card memo" open>
          <summary><span class="subj-dot" style="--h:${subj('ist').hue}" aria-hidden="true"></span><h3>${t('timelineTitle')}</h3></summary>
          <ol class="timeline">${tl.map((x) => `<li><span class="yr">${esc(x.y)}</span><span>${esc(pick(x.e))} <span class="chip">${t('gradeShort')(x.g)}</span></span></li>`).join('')}</ol>
        </details>` : '') || `<p class="muted">${t('noResults')}</p>`;
    };
    paintFilters(); paint();
    $('#m-search', el).addEventListener('input', (e) => { st.q = e.target.value; paint(); });
    el.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-s')) { st.s = b.dataset.s; paintFilters(); paint(); $(`[data-s="${st.s}"]`, el).focus(); }
      else if (b.hasAttribute('data-g')) { st.g = Number(b.dataset.g) || 0; paintFilters(); paint(); $(`[data-g="${b.dataset.g}"]`, el).focus(); }
      else if (b.id === 'm-print') { $$('details.memo', el).forEach((d) => { d.open = true; }); window.print(); }
      else if (b.dataset.read) {
        const id = b.dataset.read; const on = !S.memoRead[id];
        if (on) { S.memoRead[id] = 1; gain(3); } else { delete S.memoRead[id]; save(); }
        b.setAttribute('aria-pressed', String(on)); b.textContent = `✓ ${on ? t('read') : t('markRead')}`;
      }
    });
  };

  /* ───────────── Glosar ───────────── */
  VIEWS.glosar = (el, p) => {
    const st = { s: p.get('s') || '', q: '' };
    const subs = D.SUBJECTS.filter((s) => D.GLOSSARY.some((x) => x.s === s.id));
    el.innerHTML = head('Aa', t('glosTitle'), t('glosLede')) + `
      <div class="filters"><label class="sr" for="g-search">${t('search')}</label><input id="g-search" class="search" type="search" placeholder="${t('search')}…" autocomplete="off"><div id="g-subj"></div></div>
      <p class="count" id="g-count" aria-live="polite"></p><dl class="grid g2" id="g-list" style="margin:0"></dl>`;
    const paint = () => {
      $('#g-subj', el).innerHTML = subjPills(st.s, subs);
      const q = norm(st.q);
      const items = D.GLOSSARY.filter((x) => (!st.s || x.s === st.s) && (!q || norm(pick(x.t) + ' ' + pick(x.d)).includes(q)))
        .sort((a, b) => pick(a.t).localeCompare(pick(b.t), SET.lang));
      $('#g-count', el).textContent = t('results')(items.length);
      $('#g-list', el).innerHTML = items.map((x) => `<div class="card"><dt><strong>${esc(pick(x.t))}</strong> <span class="subj-dot" style="--h:${subj(x.s).hue}" aria-hidden="true"></span><span class="sr">${esc(subjName(x.s))}</span></dt><dd style="margin:.35rem 0 0">${esc(pick(x.d))}</dd></div>`).join('') || `<p class="muted">${t('noResults')}</p>`;
    };
    paint();
    $('#g-search', el).addEventListener('input', (e) => { st.q = e.target.value; paint(); });
    el.addEventListener('click', (e) => { const b = e.target.closest('[data-s]'); if (b) { st.s = b.dataset.s; paint(); $(`[data-s="${st.s}"]`, el).focus(); } });
  };

  /* ───────────── Cartonașe (Leitner) ───────────── */
  const INTERVAL = [0, 1, 3, 7, 14, 30]; // zile pentru cutiile 1–5
  function buildDeck(type, s, g) {
    const out = [];
    if (type === 'all' || type === 'f') D.FORMULAS.forEach((f) => (!s || f.s === s) && inGrade(f.g, g) && out.push({ id: 'f:' + f.id, s: f.s, front: () => esc(pick(f.t)), back: () => renderMath(pick(f.m)) + (f.n ? `<p class="f-note" style="margin-top:.5rem">${renderMath(pick(f.n), 'f-inline')}</p>` : '') }));
    if (type === 'all' || type === 'm') D.MEMOS.forEach((m) => (!s || m.s === s) && inGrade(m.g, g) && m.i.forEach(([a, b], i) => out.push({ id: `m:${m.id}:${i}`, s: m.s, front: () => `<span class="small muted" style="display:block;font-weight:400">${esc(pick(m.t))}</span>${esc(pick(a))}`, back: () => esc(pick(b)) })));
    if ((type === 'all' || type === 't') && (!s || s === 'ist')) D.TIMELINE.forEach((x, i) => (!g || x.g === g) && out.push({ id: 't:' + i, s: 'ist', front: () => esc(pick(x.e)), back: () => `<span class="result-big">${esc(x.y)}</span>` }));
    if (type === 'all' || type === 'g') D.GLOSSARY.forEach((x, i) => (!s || x.s === s) && out.push({ id: 'g:' + i, s: x.s, front: () => esc(pick(x.t)), back: () => esc(pick(x.d)) }));
    return out;
  }
  const isDue = (id) => { const c = S.cards[id]; return !c || c.due <= Date.now(); };
  VIEWS.cartonase = (el, p) => {
    const st = { type: p.get('t') || 'all', s: p.get('s') || '', g: Number(p.get('g')) || SET.grade || 0 };
    let session = null;
    const setup = () => {
      const deck = buildDeck(st.type, st.s, st.g);
      const dueOld = deck.filter((x) => S.cards[x.id] && isDue(x.id)).length;
      const fresh = deck.filter((x) => !S.cards[x.id]).length;
      const boxes = [1, 2, 3, 4, 5].map((b) => deck.filter((x) => S.cards[x.id]?.b === b).length);
      el.innerHTML = head('❖', t('cardsTitle'), t('cardsLede')) + `
        <div class="filters">
          <div class="filter-row" role="group" aria-label="${t('deck')}"><span class="lbl" aria-hidden="true">${t('deck')}</span>
            ${Object.entries(t('deckType')).map(([k, v]) => `<button type="button" class="pill" data-type="${k}" aria-pressed="${st.type === k}">${v}</button>`).join('')}</div>
          ${subjPills(st.s, D.SUBJECTS)}
          ${gradePills(st.g)}
        </div>
        <div class="card stack" style="max-width:640px">
          <div class="grid g3">
            <div class="stat"><b>${dueOld}</b><span>${t('due')}</span></div>
            <div class="stat"><b>${fresh}</b><span>${t('newC')}</span></div>
            <div class="stat"><b>${deck.length}</b><span>${t('deck')}</span></div>
          </div>
          <div class="boxes" aria-label="Leitner">${boxes.map((n, i) => `<span class="box-pill">${t('box')(i + 1)}: <b>${n}</b></span>`).join('')}</div>
          <div class="row"><button type="button" class="btn primary" id="c-start" ${dueOld + fresh ? '' : 'disabled'}>${t('startCards')}</button></div>
          ${dueOld + fresh ? '' : `<p class="muted">${t('noCards')}</p>`}
          <p class="hint">${t('cardsHint')}</p>
        </div>`;
    };
    const play = () => {
      const c = session.list[session.i];
      if (!c) return done();
      el.innerHTML = head('❖', t('cardsTitle')) + `
        <div class="flash-wrap stack">
          <div class="row"><span class="small muted" aria-live="polite">${t('cardOf')(session.i + 1, session.list.length)}</span><span class="spacer"></span>${subjChip(c.s)}</div>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${session.list.length}" aria-valuenow="${session.i}" aria-label="${t('cardOf')(session.i + 1, session.list.length)}"><i style="width:${session.i / session.list.length * 100}%"></i></div>
          <button type="button" class="flash" id="flash" aria-describedby="flash-hint">
            <span class="face-label">${session.flipped ? t('backFace') : t('front')}</span>
            <span class="face ${session.flipped ? 'back' : ''}" aria-live="polite">${session.flipped ? c.back() : c.front()}</span>
          </button>
          <p class="hint" id="flash-hint">${t('cardsHint')}</p>
          <div class="row" style="justify-content:center">
            ${session.flipped ? `<button type="button" class="btn" data-ans="0">1 · ${t('again')}</button><button type="button" class="btn primary" data-ans="1">2 · ${t('iKnow')}</button>` : `<button type="button" class="btn primary" id="flip-btn">${t('flip')}</button>`}
            <button type="button" class="btn ghost" id="c-stop">${t('back')}</button>
          </div>
        </div>`;
    };
    const answer = (ok) => {
      const c = session.list[session.i];
      const cur = S.cards[c.id]?.b || 0;
      const b = ok ? Math.min(5, Math.max(1, cur) + 1) : 1;
      S.cards[c.id] = { b, due: Date.now() + (ok ? INTERVAL[b] : 0.5) * 86400000 };
      S.reviews++; ok ? session.k++ : session.a++;
      gain(1, true);
      session.i++; session.flipped = false; play();
      $('#flash', el)?.focus();
    };
    const done = () => {
      el.innerHTML = head('❖', t('sessionDone')) + `<div class="card stack" style="max-width:520px"><p class="result-big">${session.k}/${session.list.length}</p><p>${t('sessionStats')(session.k, session.a)}</p><div class="row"><button type="button" class="btn primary" id="c-again">${t('retry')}</button></div></div>`;
      toast(t('xpGain')(session.list.length));
      session = null; $('h1', el).setAttribute('tabindex', '-1'); $('h1', el).focus();
    };
    setup();
    el.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.type) { st.type = b.dataset.type; setup(); $(`[data-type="${st.type}"]`, el).focus(); }
      else if (b.hasAttribute('data-s')) { st.s = b.dataset.s; st.topic=''; setup(); $(`[data-s="${st.s}"]`, el).focus(); }
      else if (b.hasAttribute('data-g')) { st.g = Number(b.dataset.g) || 0; st.topic=''; setup(); $(`[data-g="${b.dataset.g}"]`, el).focus(); }
      else if (b.id === 'c-start') {
        const deck = buildDeck(st.type, st.s, st.g);
        const due = shuffle(deck.filter((x) => S.cards[x.id] && isDue(x.id)));
        const fresh = shuffle(deck.filter((x) => !S.cards[x.id]));
        session = { list: [...due, ...fresh].slice(0, 20), i: 0, flipped: false, k: 0, a: 0 };
        play(); $('#flash', el).focus();
      } else if (b.id === 'flash' || b.id === 'flip-btn') { session.flipped = !session.flipped; play(); $('#flash', el).focus(); }
      else if (b.dataset.ans) answer(b.dataset.ans === '1');
      else if (b.id === 'c-stop' || b.id === 'c-again') { session = null; setup(); $('h1', el).focus(); }
    });
    const onKey = (e) => {
      if (!session || e.target.matches('input, textarea')) return;
      if (e.key === ' ' && !e.target.closest('button, a, input, textarea, select, label')) { e.preventDefault(); session.flipped = !session.flipped; play(); $('#flash', el).focus(); }
      else if (session.flipped && e.key === '1') answer(false);
      else if (session.flipped && e.key === '2') answer(true);
    };
    document.addEventListener('keydown', onKey);
    cleanup = () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('quiz-focus'); };
  };

  /* ───────────── Quiz ───────────── */
  function renderMastery(grade, subject) {
    const prefix = `${grade || 0}|${subject || 'all'}|`;
    const rows = Object.entries(S.mastery || {}).filter(([key]) => key.startsWith(prefix)).map(([, value]) => value).sort((a, b) => a.pct - b.pct);
    if (!rows.length) return `<section class="card stack"><h2>${tx('Harta competențelor', 'Skills map')}</h2><p class="muted">${tx('Încă nu ai un diagnostic pentru această selecție. După test, vei vedea aici ce ai stăpânit și ce merită repetat.', 'No diagnostic for this selection yet. After the test, this map will show what you know and what to revisit.')}</p></section>`;
    return `<section class="card stack"><div class="row"><h2 style="margin:0">${tx('Harta competențelor', 'Skills map')}</h2><span class="chip">${rows.length}</span></div><div class="skill-map">${rows.map((x) => { const level = x.total < 3 ? tx('Eșantion mic', 'Small sample') : x.pct >= 80 ? tx('Stăpânit', 'Mastered') : x.pct >= 55 ? tx('În lucru', 'In progress') : tx('De repetat', 'Revisit'); return `<div class="skill-row"><div class="row"><strong>${esc(SET.lang === 'en' ? x.en : x.ro)}</strong><span class="spacer"></span><span>${x.pct}% · ${level} (${x.ok}/${x.total})</span></div><div class="progress" role="img" aria-label="${esc(SET.lang === 'en' ? x.en : x.ro)}: ${x.pct}%"><i style="width:${x.pct}%"></i></div></div>`; }).join('')}</div><p class="small muted">${tx('Eșantioanele sub 3 întrebări sunt doar indicii, nu concluzii.', 'Samples under 3 questions are clues, not conclusions.')}</p><p class="small muted">${tx('Ultima actualizare', 'Last updated')}: ${fmtDate(rows[0].date)}</p></section>`;
  }
  function renderAllMastery() {
    const entries = Object.entries(S.mastery || {});
    if (!entries.length) return `<section class="card stack"><h2>${tx('Harta competențelor', 'Skills map')}</h2><p class="muted">${tx('Completează un diagnostic pentru a începe harta competențelor.', 'Complete a diagnostic to start your skills map.')}</p><a class="btn primary" href="#diagnostic">${tx('Începe diagnosticul', 'Start diagnostic')} →</a></section>`;
    const groups = new Map();
    entries.forEach(([key, value]) => { const [grade, subject] = key.split('|'); const id = `${grade}|${subject}`; if (!groups.has(id)) groups.set(id, { grade, subject, items: [] }); groups.get(id).items.push(value); });
    return `<section class="card stack"><h2>${tx('Harta competențelor', 'Skills map')}</h2>${[...groups.values()].map((g) => `<div class="skill-group"><h3>${g.subject === 'all' ? tx('Toate materiile', 'All subjects') : esc(subjName(g.subject))} · ${g.grade === '0' ? 'V–VIII' : `${tx('Clasa', 'Grade')} ${g.grade}`}</h3>${g.items.map((x) => `<div class="skill-row"><div class="row"><strong>${esc(SET.lang === 'en' ? x.en : x.ro)}</strong><span class="spacer"></span><span>${x.pct}% · ${x.total < 3 ? tx('eșantion mic', 'small sample') : ''} (${x.ok}/${x.total})</span></div><div class="progress" role="img" aria-label="${esc(SET.lang === 'en' ? x.en : x.ro)}: ${x.pct}%"><i style="width:${x.pct}%"></i></div></div>`).join('')}</div>`).join('')}<p class="small muted">${tx('Eșantioanele sub 3 întrebări sunt doar indicii, nu concluzii.', 'Samples under 3 questions are clues, not conclusions.')}</p></section>`;
  }

  VIEWS.diagnostic = (el, p) => {
    const st = { s: p.get('s') || '', g: Number(p.get('g')) || SET.grade || 0 };
    let run = null;
    const pool = () => D.QUIZ.filter((q) => (!st.s || q.s === st.s) && (!st.g || q.g === st.g));
    const setup = () => {
      const all = pool();
      el.innerHTML = head('◎', tx('Diagnostic și hartă de competențe', 'Diagnostic and skills map'), tx('Un test scurt identifică ce ai stăpânit și ce merită repetat. Rezultatul rămâne doar în acest browser.', 'A short test identifies what you know and what to revisit. Results stay in this browser.')) + `
        <section class="card stack"><div class="filters">${subjPills(st.s, D.SUBJECTS)}${gradePills(st.g)}</div>
          <p class="hint">${tx('Competențele sunt grupate orientativ după domeniile din programele școlare pentru gimnaziu; etichetele întrebărilor sunt clasificate automat și trebuie confirmate de profesor. Harta nu este evaluare oficială.', 'Skills are grouped indicatively by domains in the lower-secondary syllabi; question labels are assigned automatically and should be checked by a teacher. This is not an official assessment.')} <a href="https://www.edu.ro/Ordin_ministru_3393_2017" target="_blank" rel="noopener">${tx('Vezi programa Ministerului','See Ministry syllabus')} ↗</a></p>
          <p class="count">${all.length} ${tx('întrebări disponibile', 'questions available')} · ${Math.min(12, all.length)} ${tx('în diagnostic', 'in the diagnostic')}</p>
          <button class="btn primary" id="d-start" type="button" ${all.length ? '' : 'disabled'}>${tx('Începe diagnosticul', 'Start diagnostic')} →</button>
        </section>
        ${renderMastery(st.g, st.s)}
        ${S.diagnostics.length ? `<p class="small muted">${tx('Ultimul diagnostic', 'Latest diagnostic')}: ${fmtDate(S.diagnostics.at(-1).date)} · ${S.diagnostics.at(-1).correct}/${S.diagnostics.at(-1).total}</p>` : ''}`;
    };
    const start = () => {
      const all = pool();
      const groups = new Map();
      all.forEach((q) => { const id = competency(q).id; if (!groups.has(id)) groups.set(id, []); groups.get(id).push(q); });
      for (const [id, qs] of groups) groups.set(id, shuffle(qs));
      const questions = [];
      while (questions.length < Math.min(12, all.length)) {
        let added = false;
        for (const qs of groups.values()) if (qs.length && questions.length < Math.min(12, all.length)) { questions.push(qs.pop()); added = true; }
        if (!added) break;
      }
      run = { qs: questions.map((q) => ({ q, order: shuffle(q.o.map((_, i) => i)) })), i: 0, ok: 0, results: {} };
      ask();
    };
    const ask = () => {
      const { q, order } = run.qs[run.i];
      const comp = competency(q);
      el.innerHTML = head('◎', tx('Diagnostic', 'Diagnostic')) + `<div class="card q-card">
        <div class="row"><span class="small muted">${tx('Întrebarea', 'Question')} ${run.i + 1}/${run.qs.length}</span><span class="spacer"></span>${subjChip(q.s)}<span class="chip">${t('gradeN')(q.g)}</span></div>
        <p class="small muted">${esc(SET.lang === 'en' ? comp.en : comp.ro)}</p><div class="progress" aria-hidden="true"><i style="width:${run.i / run.qs.length * 100}%"></i></div>
        <p class="q-text" id="d-q">${esc(pick(q.q))}</p><div class="opts" role="group" aria-labelledby="d-q">${order.map((oi, k) => `<button type="button" class="opt" data-d-answer="${oi}"><span class="key" aria-hidden="true">${'ABCD'[k]}</span><span>${esc(pick(q.o[oi]))}</span></button>`).join('')}</div><div id="d-fb" aria-live="polite"></div></div>`;
      $('.opt', el)?.focus();
    };
    const choose = (oi) => {
      const { q } = run.qs[run.i]; const ok = oi === q.a; const c = competency(q);
      run.results[c.id] ||= { id: c.id, ro: c.ro, en: c.en, ok: 0, total: 0 };
      run.results[c.id].total++; if (ok) { run.ok++; run.results[c.id].ok++; }
      $$('.opt', el).forEach((b) => { b.disabled = true; const n = Number(b.dataset.dAnswer); if (n === q.a) b.classList.add('correct'); else if (n === oi) b.classList.add('wrong'); });
      $('#d-fb', el).innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}"><strong>${ok ? t('correct') : t('wrong')}</strong> ${ok ? '' : `${t('rightWas')} <strong>${esc(pick(q.o[q.a]))}</strong>. `}${esc(pick(q.x))}</div><div class="row" style="margin-top:1rem"><a class="btn" href="${reportQuestionUrl(q)}">${tx('Semnalează o problemă', 'Report a problem')}</a><button type="button" class="btn primary" id="d-next">${run.i === run.qs.length - 1 ? t('finish') : t('next')} →</button></div>`;
      $('#d-next', el).focus();
    };
    const finish = () => {
      const date = new Date().toISOString(); const subject = st.s || 'all'; const grade = st.g || SET.grade || 0;
      const record = { date, subject, grade, total: run.qs.length, correct: run.ok, skills: Object.values(run.results) };
      S.diagnostics = [...(S.diagnostics || []), record].slice(-30);
      S.mastery ||= {};
      record.skills.forEach((skill) => { S.mastery[`${grade}|${subject}|${skill.id}`] = { ...skill, pct: Math.round(skill.ok / skill.total * 100), date }; });
      save();
      const pct = Math.round(run.ok / run.qs.length * 100);
      const rows = record.skills.map((x) => { const score = Math.round(x.ok / x.total * 100); const label = x.total < 3 ? tx('Eșantion mic — repetă', 'Small sample — retry') : score >= 80 ? tx('Stăpânit', 'Mastered') : score >= 55 ? tx('În lucru', 'In progress') : tx('De repetat', 'Revisit'); return `<tr><th scope="row">${esc(SET.lang === 'en' ? x.en : x.ro)}</th><td>${x.ok}/${x.total}</td><td><span class="chip">${score}% · ${label}</span></td></tr>`; }).join('');
      el.innerHTML = head('◎', tx('Harta ta de recapitulare', 'Your revision map'), tx('Rezultatul este orientativ și bazat doar pe răspunsurile din acest diagnostic.', 'This result is indicative and based only on answers in this diagnostic.')) +
        `<section class="card stack"><p class="result-big">${run.ok}/${run.qs.length} <span class="muted" style="font-size:1.4rem">· ${pct}%</span></p><p>${tx('Clasa', 'Grade')} ${grade || 'V–VIII'} · ${subject === 'all' ? tx('Toate materiile', 'All subjects') : esc(subjName(subject))}</p>${S.sims.length ? `<p class="hint">${tx('Ultima simulare EN', 'Latest national assessment mock')}: ${S.sims.at(-1).p}/100 · ${fmtDate(S.sims.at(-1).d)} · ${S.sims.at(-1).k === 'mat' ? t('simMat') : t('simRom')}</p>` : ''}<div class="table-wrap"><table><thead><tr><th>${tx('Competență', 'Skill')}</th><th>${tx('Corecte', 'Correct')}</th><th>${tx('Nivel', 'Level')}</th></tr></thead><tbody>${rows}</tbody></table></div><h2>${tx('Ce urmează?', 'What next?')}</h2><p>${tx('Repetă mai întâi competențele marcate „De repetat”, apoi încearcă un quiz adaptiv.', 'Review skills marked “Revisit” first, then try an adaptive quiz.')}</p><div class="row"><a class="btn primary" href="#quiz?mode=adaptive${st.s ? `&s=${st.s}` : ''}${grade ? `&g=${grade}` : ''}&n=10&go=1">${tx('Exersează punctele slabe', 'Practice weak areas')} →</a><button type="button" class="btn" id="d-print">${tx('Printează raportul', 'Print report')}</button><button type="button" class="btn" id="d-again">${tx('Refă diagnosticul', 'Retake diagnostic')}</button><a class="btn" href="#progres">${tx('Vezi progresul', 'View progress')}</a></div><p class="hint">${tx('Sursă: întrebările și explicațiile incluse în Gimnaziu Space. Harta nu reprezintă o evaluare oficială.', 'Source: questions and explanations included in Gimnaziu Space. This map is not an official assessment.')}</p></section>`;
      $('#d-print', el).onclick = () => window.print(); $('#d-again', el).onclick = setup;
    };
    setup();
    el.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.s !== undefined) { st.s = b.dataset.s; setup(); }
      else if (b.dataset.g !== undefined) { st.g = Number(b.dataset.g) || 0; setup(); }
      else if (b.id === 'd-start') start();
      else if (b.dataset.dAnswer !== undefined) choose(Number(b.dataset.dAnswer));
      else if (b.id === 'd-next') { run.i++; run.i < run.qs.length ? ask() : finish(); }
    });
  };

  /* ───────────── Compare: rezultate puse față în față ───────────── */
  VIEWS.compare = (el, p) => {
    let kind = p.get('type') === 'pisa' ? 'pisa' : 'diagnostic';
    let left = -1, right = -1;
    const list = () => kind === 'pisa' ? (S.pisa || []) : (S.diagnostics || []);
    const score = (r) => Math.round(r.correct / r.total * 100);
    const render = () => {
      const records = list();
      const options = records.map((r, i) => `<option value="${i}">${fmtDate(kind === 'pisa' ? r.date : r.date)} · ${r.correct}/${r.total} · ${score(r)}%</option>`).reverse().join('');
      if (records.length >= 2) { if (left < 0 || right < 0) { left = records.length - 2; right = records.length - 1; } left = Math.min(left, records.length - 1); right = Math.min(right, records.length - 1); if (left === right) { left = left === 0 ? 1 : 0; } }
      const a = records[left], b = records[right];
      const labels = kind === 'pisa'
        ? tx('Două sesiuni PISA · aceleași tipuri de sarcini, itemi diferiți', 'Two PISA practice sessions · same task types, different items')
        : tx('Două diagnostice · compară scorul și competențele comune', 'Two diagnostics · compare scores and shared skills');
      let details = '';
      if (a && b && kind === 'diagnostic') {
        const aa = new Map(a.skills.map(x => [x.id, x]));
        const bb = new Map(b.skills.map(x => [x.id, x]));
        const rows = [...new Set([...aa.keys(), ...bb.keys()])].map(id => {
          const x = aa.get(id), y = bb.get(id); if (!x || !y) return '';
          const xp = Math.round(x.ok / x.total * 100), yp = Math.round(y.ok / y.total * 100), diff = yp - xp;
          return `<div class="compare-row"><div class="row"><strong>${esc(SET.lang === 'en' ? y.en : y.ro)}</strong><span class="spacer"></span><span class="mono">${xp}% → ${yp}% <b>${diff > 0 ? '+' : ''}${diff} pp</b></span></div><div class="progress" role="img" aria-label="${esc(SET.lang === 'en' ? y.en : y.ro)}: ${xp}% to ${yp}%"><i style="width:${yp}%"></i></div></div>`;
        }).filter(Boolean).join('');
        details = rows ? `<section class="card stack"><h2>${tx('Competențe comparabile', 'Comparable skills')}</h2>${rows}</section>` : `<p class="hint">${tx('Nu există competențe comune între aceste două diagnostice. Alege alte sesiuni pentru o comparație detaliată.', 'These diagnostics have no shared skills. Choose other sessions for a detailed comparison.')}</p>`;
      }
      el.innerHTML = head('⇄', tx('Compare · compară rezultatele', 'Compare · put results side by side'), tx('Vezi dacă ai avansat între două sesiuni salvate pe acest dispozitiv.', 'See how you progressed between two sessions saved on this device.')) + `
        <section class="card stack"><div class="filter-row" role="group" aria-label="${tx('Tipul sesiunii','Session type')}">
          <button class="pill" type="button" data-type="diagnostic" aria-pressed="${kind === 'diagnostic'}">${tx('Diagnostice','Diagnostics')}</button>
          <button class="pill" type="button" data-type="pisa" aria-pressed="${kind === 'pisa'}">PISA</button></div>
          <p class="muted">${labels}</p>
          ${records.length < 2 ? `<p class="hint">${tx('Ai nevoie de cel puțin două sesiuni salvate pentru comparație.','Save at least two sessions to compare results.')}</p><div class="row"><a class="btn primary" href="${kind === 'pisa' ? '#pisa' : '#diagnostic'}">${tx('Începe o sesiune','Start a session')} →</a><a class="btn" href="#progres">${tx('Vezi tot progresul','View all progress')}</a></div>` : `
          <div class="grid g2"><label class="stack"><span>${tx('Prima sesiune','First session')}</span><select class="search" id="compare-left">${options}</select></label><label class="stack"><span>${tx('A doua sesiune','Second session')}</span><select class="search" id="compare-right">${options}</select></label></div>
          <div class="grid g2">${[[a, tx('Prima','First')],[b, tx('A doua','Second')]].map(([r, label]) => `<article class="stat"><span>${label} · ${fmtDate(kind === 'pisa' ? r.date : r.date)}</span><b>${score(r)}%</b><span>${r.correct}/${r.total} ${tx('răspunsuri corecte','correct answers')}</span>${kind === 'diagnostic' ? `<span>${r.grade ? `${tx('Clasa','Grade')} ${r.grade} · ` : ''}${r.subject === 'all' ? tx('toate materiile','all subjects') : esc(subjName(r.subject))}</span>` : ''}</article>`).join('')}</div>
          <p class="compare-delta">${tx('Diferență','Change')}: <strong>${score(b) - score(a) > 0 ? '+' : ''}${score(b) - score(a)} ${tx('puncte procentuale','percentage points')}</strong></p>${details}`}
          <p class="small muted">${tx('Rezultatele sunt orientative, depind de întrebările fiecărei sesiuni și nu reprezintă o evaluare școlară.','Results are indicative, depend on each session’s questions and are not school grades.')}</p>
        </section>`;
      if (records.length >= 2) {
        $('#compare-left', el).value = String(left); $('#compare-right', el).value = String(right);
        $('#compare-left', el).onchange = e => { left = Number(e.target.value); if (left === right) right = left === 0 ? 1 : 0; render(); };
        $('#compare-right', el).onchange = e => { right = Number(e.target.value); if (right === left) left = right === 0 ? 1 : 0; render(); };
      }
    };
    el.addEventListener('click', e => { const b = e.target.closest('[data-type]'); if (b) { kind = b.dataset.type; left = -1; right = -1; render(); } });
    render();
  };

  /* ───────────── PISA-style practice ───────────── */
  VIEWS.pisa = (el) => {
    const items = [
      { domain: ['Lectură','Reading'], context: ['Programul bibliotecii','Library schedule'], stimulus: ['Biblioteca se închide la 18:00. Clubul de lectură începe la 16:35 și durează 50 de minute.','The library closes at 18:00. Book club starts at 16:35 and lasts 50 minutes.'], q: ['Cât timp rămâne între finalul clubului și închiderea bibliotecii?','How much time is left between the end of book club and closing?'], o: [['25 de minute','25 minutes'],['35 de minute','35 minutes'],['50 de minute','50 minutes'],['1 oră și 25 de minute','1 hour 25 minutes']], a: 1, x: ['Clubul se termină la 17:25; de la 17:25 la 18:00 sunt 35 de minute.','Book club ends at 17:25; from 17:25 to 18:00 is 35 minutes.'] },
      { domain: ['Matematică','Mathematics'], context: ['Alegerea bicicletei','Choosing a bike'], stimulus: ['Închirierea costă 8 lei taxă fixă plus 3 lei pentru fiecare oră. Ana are 20 de lei.','Rental costs 8 lei plus 3 lei per hour. Ana has 20 lei.'], q: ['Care este numărul maxim de ore întregi pentru care poate închiria bicicleta?','What is the maximum number of whole hours she can rent the bike?'], o: [['3 ore','3 hours'],['4 ore','4 hours'],['5 ore','5 hours'],['6 ore','6 hours']], a: 1, x: ['20 − 8 = 12 lei rămân pentru ore; 12 ÷ 3 = 4 ore.','20 − 8 = 12 lei remain for hours; 12 ÷ 3 = 4 hours.'] },
      { domain: ['Științe','Science'], context: ['Păstrarea apei reci','Keeping water cool'], stimulus: ['Trei pahare identice au apă la 20°C. Unul este învelit în hârtie, unul în folie cu bule, iar unul rămâne neacoperit.','Three identical cups contain water at 20°C. One is wrapped in paper, one in bubble wrap, and one is left uncovered.'], q: ['Ce măsurare ajută cel mai bine la aflarea materialului izolator?','Which measurement best helps identify the insulating material?'], o: [['Temperatura apei după același interval de timp','Water temperature after the same time interval'],['Volumul paharelor','The cups’ volume'],['Culoarea materialelor','The materials’ colour'],['Masa mesei','The table’s mass']], a: 0, x: ['Comparăm schimbarea temperaturii în condiții egale. Paharul care se încălzește cel mai puțin este cel mai bine izolat.','Compare temperature change under equal conditions. The cup that warms the least is best insulated.'] },
      { domain: ['Lectură și date','Reading data'], context: ['Sondaj despre transport','Transport survey'], stimulus: ['Într-un sondaj cu 40 de elevi: 18 vin pe jos, 12 cu autobuzul, 6 cu bicicleta și 4 cu mașina.','In a survey of 40 students: 18 walk, 12 take the bus, 6 cycle, and 4 come by car.'], q: ['Ce procent dintre elevi folosesc autobuzul?','What percentage of students take the bus?'], o: [['12%','12%'],['18%','18%'],['30%','30%'],['40%','40%']], a: 2, x: ['12 din 40 = 12 ÷ 40 = 0,3, adică 30%.','12 out of 40 = 12 ÷ 40 = 0.3, or 30%.'] },
      { domain: ['Matematică','Mathematics'], context: ['Planificarea unei grădini','Planning a garden'], stimulus: ['O grădină dreptunghiulară are 6 m lungime și 4 m lățime. O treime din suprafață va fi plantată cu flori.','A rectangular garden is 6 m long and 4 m wide. One third of its area will be planted with flowers.'], q: ['Ce suprafață va avea zona cu flori?','What will be the area of the flower bed?'], o: [['8 m²','8 m²'],['10 m²','10 m²'],['12 m²','12 m²'],['24 m²','24 m²']], a: 0, x: ['Aria grădinii este 6 × 4 = 24 m². O treime din 24 este 8 m².','The garden’s area is 6 × 4 = 24 m². One third of 24 is 8 m².'] },
      { domain: ['Științe și decizii','Science and decisions'], context: ['Economisirea energiei','Saving energy'], stimulus: ['Un bec LED de 8 W oferă lumină asemănătoare unui bec de 60 W. Ambele sunt aprinse 5 ore pe zi.','An 8 W LED gives similar light to a 60 W bulb. Both are on for 5 hours each day.'], q: ['Cu câtă energie mai puțin consumă LED-ul într-o zi?','How much less energy does the LED use in one day?'], o: [['0,26 kWh','0.26 kWh'],['0,30 kWh','0.30 kWh'],['0,52 kWh','0.52 kWh'],['2,60 kWh','2.60 kWh']], a: 0, x: ['Diferența este 60 − 8 = 52 W. În 5 ore: 52 × 5 = 260 Wh = 0,26 kWh.','The difference is 60 − 8 = 52 W. Over 5 hours: 52 × 5 = 260 Wh = 0.26 kWh.'] }
    ];
    let run = null;
    const tx2 = (x) => Array.isArray(x) ? x[SET.lang === 'en' ? 1 : 0] : x;
    const setup = () => { el.innerHTML = head('◉', 'PISA · ' + tx('aplică ce știi','apply what you know'), tx('Sarcini originale, inspirate de evaluarea competențelor în contexte reale: lectură, matematică și științe. Nu sunt itemi oficiali PISA.', 'Original tasks inspired by assessing skills in real contexts: reading, mathematics and science. They are not official PISA items.')) + `
      <section class="card stack"><div class="grid g3"><div class="stat"><b>6</b><span>${tx('sarcini practice','practice tasks')}</span></div><div class="stat"><b>3</b><span>${tx('domenii','domains')}</span></div><div class="stat"><b>∞</b><span>${tx('fără cronometru','no timer')}</span></div></div>
      <p>${tx('Citește situația, folosește datele relevante și alege răspunsul cel mai bine susținut. După fiecare răspuns primești explicația.', 'Read the situation, use the relevant information, and choose the best-supported answer. Each response includes an explanation.')}</p>
      <p class="hint">${tx('PISA evaluează elevi de 15 ani. Acest modul este exercițiu orientativ pentru gimnaziu, nu reproduce testul, scala sau punctajele oficiale.', 'PISA assesses 15-year-olds. This module is indicative practice for lower-secondary students; it does not reproduce the test, scale, or official scoring.')}</p>
      <button class="btn primary" type="button" id="pisa-start">${tx('Începe setul de exerciții','Start practice set')} →</button></section>
      ${(S.pisa || []).length ? `<section class="card"><h2>${tx('Sesiunile tale','Your sessions')}</h2><ul>${S.pisa.slice(-5).reverse().map(r=>`<li>${fmtDate(r.date)} · ${r.correct}/${r.total} · ${Math.round(r.correct/r.total*100)}%</li>`).join('')}</ul><a class="btn" href="#compare?type=pisa">⇄ ${tx('Compară rezultatele','Compare results')}</a></section>` : ''}
      <p class="small muted">${tx('Despre evaluarea PISA','About PISA assessment')}: <a href="https://www.oecd.org/pisa/" target="_blank" rel="noopener">OECD ↗</a></p>`; };
    const ask = () => {
      const q = run.order[run.i];
      el.innerHTML = head('◉', 'PISA · ' + tx('Sarcina', 'Task') + ' ' + (run.i + 1) + '/6') + `<section class="card stack"><div class="row"><span class="chip">${esc(tx2(q.domain))}</span><span class="spacer"></span><span class="small muted">${run.i + 1}/6</span></div><h2>${esc(tx2(q.context))}</h2><p class="hint">${esc(tx2(q.stimulus))}</p><p class="q-text" id="pisa-question">${esc(tx2(q.q))}</p><div class="opts" role="group" aria-labelledby="pisa-question">${q.o.map((o,i)=>`<button type="button" class="opt" data-pisa-answer="${i}"><span class="key" aria-hidden="true">${'ABCD'[i]}</span><span>${esc(tx2(o))}</span></button>`).join('')}</div><div id="pisa-feedback" aria-live="polite"></div></section>`;
      $('.opt',el)?.focus();
    };
    const finish = () => {
      const record = { date: new Date().toISOString(), total: run.order.length, correct: run.ok };
      S.pisa = [...(S.pisa || []), record].slice(-100); save();
      const pct = Math.round(record.correct / record.total * 100);
      el.innerHTML = head('◉', tx('Set PISA-style încheiat','PISA-style set complete'), tx('Scorul este orientativ; nu este o scală PISA și nu poate fi comparat cu rezultate oficiale.', 'This indicative score is not a PISA scale and cannot be compared with official results.')) + `<section class="card stack"><p class="result-big">${record.correct}/${record.total} <span class="muted" style="font-size:1.4rem">· ${pct}%</span></p><p>${pct >= 80 ? tx('Ai folosit bine informațiile și raționamentul.','You used information and reasoning well.') : tx('Revino la datele din fiecare situație și încearcă din nou.','Return to the information in each situation and try again.')}</p><div class="row"><button class="btn primary" type="button" id="pisa-again">${tx('Încearcă din nou','Try again')} →</button><a class="btn" href="#compare?type=pisa">⇄ ${tx('Compară sesiunile','Compare sessions')}</a><a class="btn" href="#progres">${tx('Vezi progresul','View progress')}</a></div></section>`;
      $('#pisa-again',el).onclick = setup;
    };
    const answer = (choice) => {
      const q = run.order[run.i], ok = choice === q.a; if (ok) run.ok++;
      $$('.opt',el).forEach(b=>{b.disabled=true;const i=Number(b.dataset.pisaAnswer);if(i===q.a)b.classList.add('correct');else if(i===choice)b.classList.add('wrong');});
      $('#pisa-feedback',el).innerHTML = `<div class="feedback ${ok?'ok':'bad'}"><strong>${ok?t('correct'):t('wrong')}</strong> ${esc(tx2(q.x))}</div><button class="btn primary" type="button" id="pisa-next">${run.i === 5 ? t('finish') : t('next')} →</button>`;
      $('#pisa-next',el).focus();
    };
    setup();
    el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.id==='pisa-start'){run={order:shuffle(items),i:0,ok:0};ask();}else if(b.dataset.pisaAnswer!==undefined)answer(Number(b.dataset.pisaAnswer));else if(b.id==='pisa-next'){run.i++;run.i<6?ask():finish();}});
  };

  VIEWS.quiz = (el, p) => {
    const st = { s: p.get('s') || '', g: Number(p.get('g')) || SET.grade || 0, n: Number(p.get('n')) || 10, topic: p.get('topic') || '', level: p.get('level') || 'all' };
    let mode = ['adaptive', 'errors'].includes(p.get('mode')) ? p.get('mode') : 'standard';
    let run = null;
    const pool = () => {
      let all = D.QUIZ.filter((q) => (!st.s || q.s === st.s) && (!st.g || q.g === st.g) && (!st.topic || competency(q).id === st.topic) && (st.level === 'all' || difficulty(q) === st.level));
      if (mode === 'errors') { const errors = new Set((S.mistakes || []).filter(m=>!m.nextReview||m.nextReview<=Date.now()).map((m) => m.id)); return all.filter((q) => errors.has(q.s + '|' + pick(q.q))); }
      if (mode !== 'adaptive') return all;
      const prefix = `${st.g || 0}|${st.s || 'all'}|`;
      const weak = new Set(Object.entries(S.mastery || {}).filter(([key, v]) => key.startsWith(prefix) && (v.pct < 80 || v.total < 3)).map(([key]) => key.split('|').slice(2).join('|')));
      (S.mistakes || []).slice(-40).forEach((m) => { if ((!st.s || m.s === st.s) && (!st.g || m.g === st.g)) weak.add(m.topic || competency(m).id); });
      const targeted = all.filter((q) => weak.has(competency(q).id));
      return targeted.length ? targeted : all;
    };
    const setup = () => {
      const n = pool().length;
      const topicIds = [...new Map(D.QUIZ.filter((q) => (!st.s || q.s === st.s) && (!st.g || q.g === st.g)).map((q) => { const c = competency(q); return [c.id, c]; })).values()];
      el.innerHTML = head('?', t('quizTitle'), t('quizLede')) + `
        <div class="filters">${subjPills(st.s, D.SUBJECTS)}${gradePills(st.g)}
          <label class="filter-row">${tx('Subiect', 'Topic')} <select id="q-topic" class="search"><option value="">${tx('Toate subiectele', 'All topics')}</option>${topicIds.map(c=>`<option value="${c.id}" ${st.topic===c.id?'selected':''}>${esc(SET.lang==='en'?c.en:c.ro)}</option>`).join('')}</select></label>
          <label class="filter-row">${tx('Dificultate orientativă', 'Indicative difficulty')} <select id="q-level" class="search">${[['all',tx('Toate nivelurile','All levels')],['easy',diffLabel('easy')],['medium',diffLabel('medium')],['challenge',diffLabel('challenge')]].map(([v,l])=>`<option value="${v}" ${st.level===v?'selected':''}>${l}</option>`).join('')}</select></label>
          <div class="filter-row" role="group" aria-label="${tx('Mod de exercițiu', 'Practice mode')}"><span class="lbl">${tx('Mod', 'Mode')}</span><button type="button" class="pill" data-mode="standard" aria-pressed="${mode === 'standard'}">${tx('Mixt', 'Mixed')}</button><button type="button" class="pill" data-mode="adaptive" aria-pressed="${mode === 'adaptive'}">${tx('Adaptiv', 'Adaptive')}</button><button type="button" class="pill" data-mode="errors" aria-pressed="${mode === 'errors'}">${tx('Greșelile mele', 'My mistakes')}</button></div>
          <div class="filter-row" role="group" aria-label="${t('howMany')}"><span class="lbl" aria-hidden="true">${t('howMany')}</span>
            ${[5, 10, 15].map((x) => `<button type="button" class="pill" data-n="${x}" aria-pressed="${st.n === x}">${x}</button>`).join('')}</div>
        </div>
        <p class="count">${t('nQuiz')(n)}${mode === 'adaptive' ? ` · ${tx('selectate după harta ta și greșelile recente', 'selected from your skills map and recent mistakes')}` : ''} · ${tx('dificultatea este estimată automat și poate fi ajustată', 'difficulty is estimated automatically and may be approximate')}</p>
        <div class="row"><button type="button" class="btn primary" id="q-start" ${n ? '' : 'disabled'}>${t('start')}</button><button type="button" class="btn" id="q-worksheet" ${n ? '' : 'disabled'}>${tx('Printează o fișă', 'Print a worksheet')}</button></div>
        ${n ? '' : `<p class="muted" style="margin-top:.75rem">${t('noQuestions')}</p>`}`;
    };
    const start = () => {
      const all = pool();
      run = { qs: shuffle(all).slice(0, st.n).map((q) => ({ q, order: shuffle(q.o.map((_, i) => i)) })), i: 0, ok: 0, wrong: [], answered: false, short: all.length < st.n, times: [], started: Date.now() };
      ask();
    };
    const ask = () => {
      const { q, order } = run.qs[run.i];
      run.questionStartedAt = Date.now();
      el.innerHTML = head('?', t('quizTitle')) + `
        <div class="card q-card">
          <div class="row" style="margin-bottom:.6rem"><span class="small muted">${t('question')(run.i + 1, run.qs.length)}</span><span class="spacer"></span>${subjChip(q.s)}<span class="chip">${t('gradeN')(q.g)}</span></div>
          <div class="progress" aria-hidden="true" style="margin-bottom:1rem"><i style="width:${run.i / run.qs.length * 100}%"></i></div>
          <p class="q-text" id="q-text">${esc(pick(q.q))} <button type="button" class="btn sm" id="q-speak" aria-label="${tx('Citește întrebarea cu voce tare','Read question aloud')}">🔊</button></p>
          <div class="opts" role="group" aria-labelledby="q-text">
            ${order.map((oi, k) => `<button type="button" class="opt" data-oi="${oi}"><span class="key" aria-hidden="true">${'ABCD'[k]}</span><span>${esc(pick(q.o[oi]))}</span></button>`).join('')}
          </div>
          <div class="row"><button type="button" class="btn sm" id="q-hint">${tx('Indiciu 1/3','Hint 1/3')}</button><button type="button" class="btn sm" id="q-focus" aria-pressed="${document.body.classList.contains('quiz-focus')}">${tx('Mod concentrare','Focus mode')}</button></div><div id="q-hints" aria-live="polite"></div>
          <div id="q-fb" aria-live="polite"></div>
        </div>`;
      $('.opt', el).focus();
    };
    const choose = (oi) => {
      if (run.answered) return;
      run.answered = true;
      const { q } = run.qs[run.i];
      run.times.push(Math.max(0, Math.round((Date.now() - run.questionStartedAt) / 1000)));
      const ok = oi === q.a;
      S.quiz[q.s] = S.quiz[q.s] || { ok: 0, bad: 0 };
      if (ok) {
        S.quiz[q.s].ok++; run.ok++;
        const reviewed=(S.mistakes||[]).find(m=>m.id===q.s+'|'+pick(q.q)); if(reviewed){reviewed.stage=Math.min(4,(reviewed.stage||0)+1);reviewed.nextReview=Date.now()+[86400000,3,7,14,30][reviewed.stage]*86400000;if(reviewed.stage>=4)S.mistakes=S.mistakes.filter(m=>m.id!==reviewed.id);}
      } else {
        S.quiz[q.s].bad++; run.wrong.push(q);
        recordMistake(q, oi);
      }
      gain(ok ? 5 : 0, true);
      $$('.opt', el).forEach((b) => {
        b.disabled = true; const v = Number(b.dataset.oi);
        if (v === q.a) { b.classList.add('correct'); b.insertAdjacentHTML('beforeend', `<span class="sr"> — ${t('correct')}</span>`); }
        else if (v === oi) b.classList.add('wrong');
      });
      const last = run.i === run.qs.length - 1;
      const avgTime = Math.round(run.times.reduce((a,b)=>a+b,0)/run.times.length);
      S.quizTime ||= {}; const timeRec = S.quizTime[q.s] || { seconds: 0, count: 0 }; timeRec.seconds += run.times.at(-1); timeRec.count++; S.quizTime[q.s] = timeRec; save();
      $('#q-fb', el).innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}"><strong>${ok ? t('correct') : t('wrong')}</strong> ${ok ? '' : `${t('rightWas')} <strong>${esc(pick(q.o[q.a]))}</strong>. `}${esc(pick(q.x))}<p class="small">${tx('Pașii:','Steps:')} 1) ${tx('identifică datele din enunț','identify the given information')} 2) ${tx('alege regula potrivită','choose the relevant rule')} 3) ${tx('calculează și verifică unitatea/răspunsul','calculate and check the unit/answer')} · ${avgTime}${tx(' sec/item',' sec/item')}</p></div>
        <div class="row" style="margin-top:1rem"><a class="btn" href="${reportQuestionUrl(q)}">${tx('Semnalează o problemă', 'Report a problem')}</a><button type="button" class="btn primary" id="q-next">${last ? t('finish') : t('next')} →</button></div>`;
      $('#q-next', el).focus();
    };
    const finish = () => {
      const n = run.qs.length;
      S.quizzes++; if (run.ok === n && n >= 5) S.perfect++;
      gain(10);
      const pct = Math.round(run.ok / n * 100);
      el.innerHTML = head('?', t('score')) + `
        <div class="card stack" style="max-width:720px">
          <p class="result-big">${run.ok}/${n} <span class="muted" style="font-size:1.4rem">· ${pct}%</span></p>
          ${run.short ? `<p class="hint">${t('notEnough')}</p>` : ''}
          ${run.wrong.length ? `<h2>${t('review')}</h2><ul>${run.wrong.map((q) => `<li><strong>${esc(pick(q.q))}</strong><br>${t('rightWas')} ${esc(pick(q.o[q.a]))}. <span class="muted">${esc(pick(q.x))}</span></li>`).join('')}</ul>` : `<p>${t('allRight')}</p>`}
          <p class="hint">${tx('Timp mediu pe întrebare','Average time per question')}: ${Math.round(run.times.reduce((a,b)=>a+b,0)/Math.max(1,run.times.length))} ${tx('secunde','seconds')} · ${tx('Timp total','Total time')}: ${Math.round((Date.now()-run.started)/60000)} ${tx('min','min')}</p>
          <div class="row"><button type="button" class="btn primary" id="q-again">${t('retry')}</button><button type="button" class="btn" id="q-errors" ${run.wrong.length?'':'disabled'}>${tx('Repetă greșelile','Retry mistakes')}</button><button type="button" class="btn" id="q-setup">${t('back')}</button></div>
        </div>`;
      $('h1', el).setAttribute('tabindex', '-1'); $('h1', el).focus();
      announce(`${t('score')}: ${run.ok} / ${n}`);
    };
    setup();
    if (p.get('go') && pool().length) start();
    el.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-s')) { st.s = b.dataset.s; st.topic=''; setup(); $(`[data-s="${st.s}"]`, el).focus(); }
      else if (b.hasAttribute('data-g')) { st.g = Number(b.dataset.g) || 0; st.topic=''; setup(); $(`[data-g="${b.dataset.g}"]`, el).focus(); }
      else if (b.dataset.mode) { mode = b.dataset.mode; setup(); $(`[data-mode="${mode}"]`, el).focus(); }
      else if (b.dataset.n) { st.n = Number(b.dataset.n); setup(); $(`[data-n="${st.n}"]`, el).focus(); }
      else if (b.id === 'q-worksheet') printWorksheet(pool().slice(0, 12));
      else if (b.id === 'q-errors') { mode='errors'; setup(); }
      else if (b.id === 'q-speak') say(pick(run.qs[run.i].q.q));
      else if (b.id === 'q-hint') { const q=run.qs[run.i].q; const box=$('#q-hints',el); const level=(Number(b.dataset.step)||0)+1; b.dataset.step=String(level); b.textContent=level>=3?tx('Explicația este mai jos','Explanation is below'):tx(`Indiciu ${level+1}/3`,`Hint ${level+1}/3`); const hints=[tx('Privește cuvintele-cheie sau mărimile cunoscute din enunț.','Look for key words or known quantities.'),tx('Amintește-ți regula/formula folosită la acest tip de exercițiu.','Recall the rule/formula used for this type of exercise.'),pick(q.x)]; box.innerHTML += `<p class="hint-tier">${esc(hints[level-1])}</p>`; }
      else if (b.id === 'q-focus') { const on=!document.body.classList.contains('quiz-focus'); document.body.classList.toggle('quiz-focus',on); b.setAttribute('aria-pressed',String(on)); }
      else if (b.id === 'q-start' || b.id === 'q-again') start();
      else if (b.id === 'q-setup') { run = null; setup(); $('h1', el).focus(); }
      else if (b.dataset.oi !== undefined && run) choose(Number(b.dataset.oi));
      else if (b.id === 'q-next') { run.i++; run.answered = false; run.i < run.qs.length ? ask() : finish(); }
    });
    el.addEventListener('change', (e) => { if (e.target.id === 'q-topic') { st.topic=e.target.value; setup(); $('#q-topic',el).focus(); } else if (e.target.id === 'q-level') { st.level=e.target.value; setup(); $('#q-level',el).focus(); } });
    const onKey = (e) => {
      if (!run || run.answered || e.target.matches('input, textarea, select')) return;
      const k = 'abcd'.indexOf(e.key.toLowerCase());
      if (k >= 0) { const b = $$('.opt', el)[k]; if (b) b.click(); }
    };
    document.addEventListener('keydown', onKey);
    cleanup = () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('quiz-focus'); };
  };

  /* ───────────── Simulare EN ───────────── */
  VIEWS.simulare = (el) => {
    let kind = 'mat', mins = 120, timer = null, endAt = 0, sim = null, profile = 'balanced';
    const setup = () => {
      el.innerHTML = head('✎', t('simTitle'), t('simLede')) + `
        <div class="grid g2">
          ${[['mat', t('simMat'), t('simMatDesc')], ['rom', t('simRom'), t('simRomDesc')]].map(([k, n, d]) => `
            <button type="button" class="card" data-kind="${k}" aria-pressed="${kind === k}" style="text-align:left;cursor:pointer;${kind === k ? 'outline:3px solid var(--accent)' : ''}">
              <span class="h2like">${n}</span><span class="muted" style="display:block;margin-top:.4rem">${d}</span></button>`).join('')}
        </div>
        <div class="filters" style="margin-top:1.25rem">
          <div class="filter-row" role="group" aria-label="${tx('Variantă de exercițiu','Practice set')}"><span class="lbl">${tx('Variantă','Variant')}</span>${[['balanced',kind==='mat'?tx('Echilibrată','Balanced'):tx('Set A','Set A')],['algebra',kind==='mat'?tx('Algebră','Algebra'):tx('Set B','Set B')],['geometry',kind==='mat'?tx('Geometrie','Geometry'):tx('Set C','Set C')]].map(([id,label])=>`<button type="button" class="pill" data-profile="${id}" aria-pressed="${profile===id}">${label}</button>`).join('')}</div>
          <div class="filter-row" role="group" aria-label="${t('duration')}"><span class="lbl" aria-hidden="true">${t('duration')}</span>
            ${[30, 60, 120].map((m) => `<button type="button" class="pill" data-min="${m}" aria-pressed="${mins === m}">${t('minutes')(m)}</button>`).join('')}
            <button type="button" class="pill" data-min="0" aria-pressed="${mins === 0}">${t('noTimer')}</button></div>
        </div>
        <p class="hint">${t('simStructure')} <a href="https://subiecte.edu.ro/" target="_blank" rel="noopener">${t('officialLink')} ↗</a></p>
        <button type="button" class="btn primary" id="s-start" style="margin-top:.75rem">${t('simStart')}</button>
        ${S.sims.length ? `<section style="margin-top:2rem"><h2>${t('simHistory')}</h2>${histTable()}</section>` : ''}`;
    };
    const tick = () => {
      const left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      const tm = $('#s-timer', el); if (!tm) return;
      tm.textContent = `${String(Math.floor(left / 3600))}:${String(Math.floor(left % 3600 / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
      tm.classList.toggle('low', left < 300);
      if (left === 300) announce(`${t('timeLeft')}: 5 min`);
      if (left <= 0) { clearInterval(timer); timer = null; submit(true); }
    };
    const begin = () => {
      if (kind === 'mat') {
        let pool = D.QUIZ.filter((q) => q.s === 'mat' && q.g >= 6);
        if (profile === 'algebra') { const focus=pool.filter(q=>competency(q).id==='algebra'); pool=shuffle(focus.concat(pool.filter(q=>!focus.includes(q)))); }
        else if (profile === 'geometry') { const focus=pool.filter(q=>competency(q).id==='geometry'); pool=shuffle(focus.concat(pool.filter(q=>!focus.includes(q)))); }
        else pool=shuffle(pool);
        sim = { kind, items: pool.slice(0, 12).map((q) => ({ q, order: shuffle([0, 1, 2, 3]) })), probs: D.SIM_MAT_PROBLEMS, startedAt: Date.now(), profile };
      } else {
        const prompts = profile === 'algebra' ? tx('Scrie un text argumentativ despre rolul exercițiului în învățare, cu două argumente și exemple.','Write an argumentative text about the role of practice in learning, with two arguments and examples.') : profile === 'geometry' ? tx('Descrie o experiență de învățare care ți-a schimbat perspectiva, folosind detalii concrete.','Describe a learning experience that changed your perspective, using specific details.') : pick(D.SIM_ROM_WRITE.task);
        sim = { kind, items: D.SIM_ROM.map((q) => ({ q, order: shuffle([0, 1, 2, 3]) })), startedAt: Date.now(), profile, writeTask: prompts };
      }
      const radios = (it, i) => `<div class="sim-q"><fieldset><legend>${i + 1}. ${esc(pick(it.q.q))}</legend>${it.order.map((oi, k) => `<label class="radio" data-qi="${i}" data-oi="${oi}"><input type="radio" name="q${i}" value="${oi}"><span><span class="mono">${'abcd'[k]})</span> ${esc(pick(it.q.o[oi]))}</span></label>`).join('')}</fieldset></div>`;
      el.innerHTML = head('✎', kind === 'mat' ? t('simMat') : t('simRom')) + `
        <div class="sim-sticky row">${mins ? `<span class="sr">${t('timeLeft')}</span><span class="timer" id="s-timer" role="timer">--:--:--</span>` : ''}<span class="spacer"></span><button type="button" class="btn primary" id="s-submit">${t('simSubmit')}</button></div>
        <form id="s-form" class="stack" onsubmit="return false">
          ${kind === 'mat' ? `
            <section class="card"><h2>${t('partI')}</h2>${sim.items.map(radios).join('')}</section>
            <section class="card"><h2>${t('partIII')}</h2><p class="hint">${t('solveOnPaper')}</p>
              ${sim.probs.map((pr, i) => `<div class="sim-q"><h3>${13 + i}.</h3><p class="problem">${esc(pick(pr.q))}</p></div>`).join('')}</section>` : `
            <section class="card"><h2>${t('readText')}</h2><div class="card sim-text">${esc(pick(D.SIM_ROM_TEXT))}</div></section>
            <section class="card"><h2>${t('partRom1')}</h2>${sim.items.map(radios).join('')}</section>
            <section class="card"><h2>${t('partRom2')}</h2><p>${esc(sim.writeTask)}</p><p class="small muted">${tx('Alege criteriile de autoevaluare după ce ai încheiat.','Use the self-check rubric after finishing.')}</p>
              <label class="sr" for="s-write">${t('writeHere')}</label><textarea id="s-write" class="write" placeholder="${t('writeHere')}…"></textarea>
              <p class="small muted" id="s-wc" aria-live="polite">${t('words')(0)}</p></section>`}
        </form>`;
      if (mins) { endAt = Date.now() + mins * 60000; tick(); timer = setInterval(tick, 1000); }
      $('#s-write', el)?.addEventListener('input', (e) => { const n = (e.target.value.trim().match(/\S+/g) || []).length; $('#s-wc', el).textContent = t('words')(n); });
    };
    const submit = (auto) => {
      if (!sim) return;
      if (!auto && !confirm(t('simConfirm'))) return;
      sim.submittedAt = Date.now();
      if (timer) { clearInterval(timer); timer = null; }
      const form = $('#s-form', el);
      let mcq = 0;
      sim.items.forEach((it, i) => {
        const v = form.querySelector(`input[name="q${i}"]:checked`);
        const chosen = v ? Number(v.value) : -1;
        if (chosen === it.q.a) mcq += 5;
        S.quiz[it.q.s] = S.quiz[it.q.s] || { ok: 0, bad: 0 };
        chosen === it.q.a ? S.quiz[it.q.s].ok++ : S.quiz[it.q.s].bad++;
        $$(`label[data-qi="${i}"]`, el).forEach((l) => { const oi = Number(l.dataset.oi); if (oi === it.q.a) l.classList.add('correct'); else if (oi === chosen) l.classList.add('wrong'); });
      });
      $$('input', form).forEach((x) => { x.disabled = true; });
      $('#s-write', el)?.setAttribute('readonly', '');
      sim.mcq = mcq;
      const words = sim.kind === 'rom' ? (($('#s-write', el).value.trim().match(/\S+/g) || []).length) : 0;
      const romW = [10, 10, 10, 8, 8, 7, 7];
      const checks = sim.kind === 'mat'
        ? sim.probs.map((pr, i) => `<div class="card"><h3>${13 + i}.</h3>${pr.steps.map((s, j) => `<label class="check"><input type="checkbox" data-pts="${[3, 3, 4][j]}"><span>${esc(pick(s))} <span class="chip">${t('stepPts')([3, 3, 4][j])}</span></span></label>`).join('')}</div>`).join('')
        : `<div class="card">${D.SIM_ROM_WRITE.rubric.map((r, j) => `<label class="check"><input type="checkbox" data-pts="${romW[j]}" ${j === 5 && words >= 150 ? 'checked' : ''}><span>${esc(pick(r))} <span class="chip">${t('stepPts')(romW[j])}</span></span></label>`).join('')}<p class="small muted">${t('words')(words)}</p></div>`;
      $('.sim-sticky', el).remove();
      form.insertAdjacentHTML('afterend', `
        <section class="card stack" id="s-result" style="margin-top:1.5rem">
          ${auto ? `<p class="feedback bad">${t('timeUp')}</p>` : ''}
          <h2 tabindex="-1" id="s-res-h">${t('simResult')}</h2>
          <h3>${t('selfCheck')}</h3>
          <div class="stack">${checks}</div>
          <p class="hint">+ ${t('oficiu')}</p>
          <div class="grid g3"><div class="stat"><b id="s-pts">0</b><span>/ 100 p</span></div><div class="stat"><b id="s-grade">0</b><span>${t('estGrade')}</span></div></div>
          <div class="row"><button type="button" class="btn primary" id="s-save">${t('saveResult')}</button><button type="button" class="btn" id="s-back">${t('back')}</button></div>
        </section>`);
      const recalc = () => {
        const extra = $$('#s-result input[type=checkbox]:checked', el).reduce((a, x) => a + Number(x.dataset.pts), 0);
        sim.total = Math.min(100, sim.mcq + extra + 10);
        $('#s-pts', el).textContent = sim.total;
        $('#s-grade', el).textContent = (sim.total / 10).toFixed(2).replace('.', SET.lang === 'en' ? '.' : ',');
      };
      $('#s-result', el).addEventListener('change', recalc); recalc();
      $('#s-res-h', el).focus();
      save();
    };
    setup();
    el.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.kind) { kind = b.dataset.kind; setup(); $(`[data-kind="${kind}"]`, el).focus(); }
      else if (b.dataset.profile) { profile=b.dataset.profile; setup(); $(`[data-profile="${profile}"]`,el).focus(); }
      else if (b.dataset.min !== undefined) { mins = Number(b.dataset.min); setup(); $(`[data-min="${mins}"]`, el).focus(); }
      else if (b.id === 's-start') begin();
      else if (b.id === 's-submit') submit(false);
      else if (b.id === 's-save') {
        S.sims.push({ d: new Date().toISOString(), k: sim.kind, p: sim.total, minutes: Math.max(1,Math.round(((sim.submittedAt||Date.now())-sim.startedAt)/60000)), profile: sim.profile });
        S.sims = S.sims.slice(-30); gain(40); toast(t('saved')); b.disabled = true;
      } else if (b.id === 's-back') { sim = null; setup(); $('h1', el).focus(); }
    });
    cleanup = () => { if (timer) clearInterval(timer); };
  };
  function histTable() {
    return `<table class="hist"><thead><tr><th scope="col">${t('thDate')}</th><th scope="col">${t('thType')}</th><th scope="col">${t('thScore')}</th><th scope="col">${t('thGrade')}</th></tr></thead><tbody>
      ${S.sims.slice().reverse().map((s) => `<tr><td>${fmtDate(s.d)}</td><td>${s.k === 'mat' ? t('simMat') : t('simRom')}</td><td>${s.p}</td><td>${(s.p / 10).toFixed(2)}</td></tr>`).join('')}</tbody></table>`;
  }

  /* ───────────── Focus & plan (Pomodoro) ───────────── */
  const POMO = { mode: 'focus', left: 25 * 60, total: 25 * 60, running: false, end: 0, id: null };
  const MODES = { focus: 25, short: 5, long: 15 };
  function beep() {
    if (SET.sound === false) return;
    try { const A = new (window.AudioContext || window.webkitAudioContext)(); [0, .25, .5].forEach((d) => { const o = A.createOscillator(); const g = A.createGain(); o.frequency.value = 660; g.gain.setValueAtTime(.0001, A.currentTime + d); g.gain.exponentialRampToValueAtTime(.2, A.currentTime + d + .02); g.gain.exponentialRampToValueAtTime(.0001, A.currentTime + d + .2); o.connect(g).connect(A.destination); o.start(A.currentTime + d); o.stop(A.currentTime + d + .22); }); } catch { /* fără sunet */ }
  }
  function pomoTick() {
    if (!POMO.running) return;
    POMO.left = Math.max(0, Math.round((POMO.end - Date.now()) / 1000));
    if (POMO.left <= 0) {
      POMO.running = false; clearInterval(POMO.id); POMO.id = null; beep();
      if (POMO.mode === 'focus') { S.pomos++; gain(15, true); announce(t('pDone')); toast(t('pDone')); }
      else { announce(t('pBreakDone')); toast(t('pBreakDone')); }
      POMO.left = POMO.total;
    }
    if (current === 'focus') paintPomo();
  }
  function paintPomo() {
    const el = $('#pomo'); if (!el) return;
    const m = String(Math.floor(POMO.left / 60)).padStart(2, '0'), s = String(POMO.left % 60).padStart(2, '0');
    $('.time', el).textContent = `${m}:${s}`;
    const C = 2 * Math.PI * 54;
    $('.fg', el).style.strokeDasharray = C; $('.fg', el).style.strokeDashoffset = C * (1 - POMO.left / POMO.total);
    $('#p-toggle').textContent = POMO.running ? t('pPause') : t('pStart');
    $('#p-count').textContent = S.pomos;
    $$('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === POMO.mode)));
  }
  VIEWS.focus = (el) => {
    const createAdaptivePlan = () => {
      const weak = Object.entries(S.mastery || {}).filter(([,v]) => v && v.total).sort((a,b)=>a[1].pct-b[1].pct).slice(0,3);
      const subjects = [...new Set(weak.map(([key])=>key.split('|')[1]).filter(Boolean))];
      const focus = subjects[0] || D.SUBJECTS.slice().sort((a,b)=>(accuracy(a.id) ?? 100)-(accuracy(b.id) ?? 100))[0]?.id || 'mat';
      const title = subjName(focus);
      S.adaptivePlan = [
        tx(`Diagnostic scurt la ${title}`,`Short diagnostic in ${title}`),
        tx(`Recitește o fișă la ${title}`,`Review one study sheet in ${title}`),
        tx('Repetă 10 cartonașe scadente','Review 10 due flashcards'),
        tx('Quiz adaptiv: 5 întrebări','Adaptive quiz: 5 questions'),
        tx('Pomodoro de 25 min la competența cea mai slabă','25-minute focus session on the weakest skill'),
        tx('Refă întrebările greșite','Retry the questions you missed'),
        tx('O simulare EN sau o fișă imprimată','A mock exam or a printed worksheet')
      ]; save();
    };
    const planItems = S.adaptivePlan || t('plan');
    el.innerHTML = head('◷', t('focusTitle'), t('focusLede')) + `
      <div class="grid g2">
        <section class="card pomo" id="pomo" aria-label="Pomodoro">
          <div class="seg" role="group" aria-label="Pomodoro">${Object.keys(MODES).map((k) => `<button type="button" data-mode="${k}" aria-pressed="false">${t(k === 'focus' ? 'pFocus' : k === 'short' ? 'pShort' : 'pLong')}</button>`).join('')}</div>
          <div class="ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="bg" cx="60" cy="60" r="54"/><circle class="fg" cx="60" cy="60" r="54"/></svg><span class="time" role="timer" aria-live="off">25:00</span></div>
          <div class="row" style="justify-content:center"><button type="button" class="btn primary" id="p-toggle">${t('pStart')}</button><button type="button" class="btn" id="p-reset">${t('pReset')}</button></div>
          <p class="small muted">${t('sessionsToday')}: <b id="p-count">${S.pomos}</b></p>
          <ul class="small muted" style="text-align:left">${t('tips').map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </section>
        <section class="card">
          <h2>${t('planTitle')}</h2>
          <p class="small muted">${tx('Plan adaptat după diagnostice și greșeli; generarea lui rămâne locală.','Plan adapts to diagnostics and mistakes; it is generated locally.')}</p>
          <ul class="plan">${planItems.map((x, i) => `<li><label class="check"><input type="checkbox" data-plan="${i}" ${S.plan[i] ? 'checked' : ''}><span><strong>${t('day')(i + 1)}:</strong> ${esc(x)}</span></label></li>`).join('')}</ul>
          <button type="button" class="btn" id="adaptive-plan">${tx('Regenerează planul adaptiv','Regenerate adaptive plan')}</button>
        </section>
      </div>`;
    paintPomo();
    el.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.mode) { POMO.running = false; clearInterval(POMO.id); POMO.id = null; POMO.mode = b.dataset.mode; POMO.total = POMO.left = MODES[POMO.mode] * 60; paintPomo(); }
      else if (b.id === 'adaptive-plan') { createAdaptivePlan(); route(false); }
      else if (b.id === 'p-toggle') {
        if (POMO.running) { POMO.running = false; clearInterval(POMO.id); POMO.id = null; }
        else { POMO.running = true; POMO.end = Date.now() + POMO.left * 1000; POMO.id = setInterval(pomoTick, 1000); }
        paintPomo();
      } else if (b.id === 'p-reset') { POMO.running = false; clearInterval(POMO.id); POMO.id = null; POMO.left = POMO.total; paintPomo(); }
    });
    el.addEventListener('change', (e) => {
      const c = e.target.closest('[data-plan]'); if (!c) return;
      const i = c.dataset.plan; if (c.checked) { S.plan[i] = today(); gain(5); } else { delete S.plan[i]; save(); }
    });
  };

  /* ───────────── Progres ───────────── */
  VIEWS.progres = (el) => {
    const days = []; const d = new Date(); d.setDate(d.getDate() - 27);
    for (let i = 0; i < 28; i++) { const k = dayKey(d); const v = S.days[k] || 0; days.push([k, v]); d.setDate(d.getDate() + 1); }
    const lvl = (v) => v === 0 ? 0 : v < 20 ? 1 : v < 60 ? 2 : 3;
    const st = t('st');
    el.innerHTML = head('▲', t('progTitle'), t('progLede')) + `
      <div class="grid g4">
        ${[['xp', S.xp], ['streak', streak()], ['quizzes', S.quizzes], ['acc', accuracy() == null ? '—' : accuracy() + '%'], ['cards', S.reviews], ['known', Object.keys(S.known).length], ['memos', Object.keys(S.memoRead).length], ['pomos', S.pomos]]
          .map(([k, n]) => `<div class="stat"><b>${n}</b><span>${st[k]}</span></div>`).join('')}
      </div>
      <p class="small muted" style="margin-top:.5rem">${t('level')(level())}</p>
      ${renderAllMastery()}
      <section class="card stack"><h2>${tx('Evoluția diagnosticelor','Diagnostic trend')}</h2>
        ${(S.diagnostics || []).length ? `<div class="trend-line" role="img" aria-label="${tx('Evoluția ultimelor diagnostice','Trend of recent diagnostics')}">${S.diagnostics.slice(-8).map(d=>`<i style="height:${Math.max(8,Math.round(d.correct/Math.max(1,d.total)*100))}%;"><span>${Math.round(d.correct/Math.max(1,d.total)*100)}%</span></i>`).join('')}</div><p class="small muted">${S.diagnostics.slice(-8).map(d=>`${fmtDate(d.date)} · ${d.correct}/${d.total}`).join('　')}</p>` : `<p class="muted">${tx('După două diagnostice, vei putea compara rezultatele în timp.','After two diagnostics, you can compare results over time.')}</p>`}</section>
      <section class="card"><h2>${t('activity')}</h2>
        <div class="heat" role="img" aria-label="${t('activity')}: ${days.filter((x) => x[1]).length}/28">${days.map(([k, v]) => `<i data-l="${lvl(v)}" title="${k}: ${v} XP"></i>`).join('')}</div>
      </section>
      <section class="card"><h2>${t('accBySubj')}</h2>
        <div class="bars">${D.SUBJECTS.map((s) => { const a = accuracy(s.id); const q = S.quiz[s.id]; return `<div class="bar-row" style="--h:${s.hue}"><span>${esc(pick(s))}</span><span class="bar" role="img" aria-label="${esc(pick(s))}: ${a == null ? '—' : a + '%'}"><i style="width:${a || 0}%"></i></span><span class="mono">${a == null ? '—' : a + '%'}${q ? ` <span class="sr">(${q.ok}/${q.ok + q.bad})</span>` : ''}</span></div>`; }).join('')}</div>
      </section>
      <section><h2>${t('badges')}</h2>
        <ul class="grid g3" style="list-style:none;padding:0;margin:0">${D.BADGES.map((b) => `<li class="card badge ${S.badges[b.id] ? 'on' : ''}"><span class="ico" aria-hidden="true">${S.badges[b.id] ? b.icon : '🔒'}</span><span><strong>${esc(pick(b.t))}</strong><br><span class="small muted">${esc(pick(b.d))}</span>${S.badges[b.id] ? `<span class="sr"> ✓</span>` : ''}</span></li>`).join('')}</ul>
      </section>
      <section class="card"><h2>${t('simHistory')}</h2>${S.sims.length ? histTable() : `<p class="muted">${t('noSims')}</p>`}</section>
      <section class="card stack"><h2>${t('data')}</h2><p class="muted">${t('privacy')}</p>
        <div class="row"><button type="button" class="btn" id="p-export">⤓ ${t('exportBtn')}</button>
          <button type="button" class="btn" id="guardian-report">${tx('Raport pentru familie/profesor','Family/teacher report')}</button>
          <button type="button" class="btn" id="p-import-btn">⤒ ${t('importBtn')}</button><input type="file" id="p-import" accept="application/json,.json" hidden>
          <button type="button" class="btn danger" id="p-reset">${t('resetBtn')}</button></div>
      </section>`;
    el.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.id === 'p-import-btn') $('#p-import', el).click();
      else if (b.id === 'guardian-report') {
        const subjectRows = D.SUBJECTS.map(s=>`<tr><td>${esc(pick(s))}</td><td>${accuracy(s.id)==null?'—':accuracy(s.id)+'%'}</td><td>${S.quiz[s.id]?.ok||0}/${(S.quiz[s.id]?.ok||0)+(S.quiz[s.id]?.bad||0)}</td><td>${S.quizTime?.[s.id]?.count?Math.round(S.quizTime[s.id].seconds/S.quizTime[s.id].count)+' '+tx('sec','sec'):'—'}</td></tr>`).join('');
        const html=`<!doctype html><html lang="${SET.lang}"><meta charset="utf-8"><title>${tx('Raport de progres','Progress report')}</title><style>body{font:16px system-ui;max-width:850px;margin:2rem auto;color:#142033}h1{color:#2346c7}table{border-collapse:collapse;width:100%}td,th{padding:.65rem;border-bottom:1px solid #ccd}small{color:#556}</style><h1>Gimnaziu Space · ${tx('Raport local','Local report')}</h1><p>${tx('Generat','Generated')}: ${new Date().toLocaleDateString(SET.lang==='en'?'en-GB':'ro-RO')}</p><p>${S.xp} XP · ${S.quizzes} ${tx('quiz-uri','quizzes')} · ${S.mistakes?.length||0} ${tx('greșeli în registru','logged mistakes')}</p><table><thead><tr><th>${tx('Materie','Subject')}</th><th>${tx('Acuratețe','Accuracy')}</th><th>${tx('Răspunsuri','Answers')}</th><th>${tx('Timp mediu/item','Avg. time/item')}</th></tr></thead><tbody>${subjectRows}</tbody></table><h2>${tx('Simulări recente','Recent mock exams')}</h2><ul>${(S.sims||[]).slice(-5).reverse().map(s=>`<li>${fmtDate(s.d)} · ${s.k==='mat'?t('simMat'):t('simRom')} · ${s.p}/100${s.minutes?` · ${s.minutes} ${tx('min','min')}`:''}</li>`).join('')||'<li>—</li>'}</ul><p><small>${tx('Raport orientativ, calculat local pe baza activității în aplicație. Nu este notă școlară. Exportul nu trimite date automat.','Indicative report, generated locally from app activity. It is not a school grade. Export does not send data automatically.')}</small></p></html>`;
        const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download=`gimnaziu-space-raport-${today()}.html`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
      }
      else if (b.id === 'p-export') {
        const backup = { app: 'Gimnaziu Space', format: 'gimnaziu-space-backup', version: 2, exportedAt: new Date().toISOString(), progress: S };
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `gimnaziu-space-${today()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      } else if (b.id === 'p-reset' && confirm(t('resetConfirm'))) { S = fresh(); save(); toast(t('resetDone')); route(); }
    });
    $('#p-import', el).addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try {
        if (f.size > 2_000_000) throw new Error('too-large');
        const raw = JSON.parse(await f.text());
        const imported = window.GS_PROGRESS.normalize(raw); if (!imported) throw new Error('invalid-backup');
        if (!store.set(KEY, imported)) { toast(t('importStorage')); return; }
        S = imported; toast(t('importDone')); route();
      } catch { toast(t('importBad')); }
      finally { e.target.value = ''; }
    });
  };

  /* ───────────── AI Coach & registrul greșelilor ───────────── */
  const tx = (ro, en) => SET.lang === 'ro' ? ro : en;
  function explainMistake(m) {
    const tips = {
      mat: tx('Scrie datele, alege formula, înlocuiește valorile și verifică unitatea. La ecuații, fă aceeași operație în ambele părți și verifică rezultatul prin înlocuire.',
        'Write the known data, choose the formula, substitute values and check the unit. For equations, do the same operation on both sides and verify by substitution.'),
      rom: tx('Citește cerința, caută dovada în text și răspunde în propoziții clare. Pentru gramatică, pune întrebarea potrivită și verifică rolul cuvântului în enunț.',
        'Read the task, find evidence in the text and answer in clear sentences. For grammar, ask the right question and check the word’s role in the sentence.'),
      fiz: tx('Notează mărimile și unitățile, scrie formula, transformă unitățile dacă este nevoie și verifică dacă rezultatul are sens fizic.',
        'Note the quantities and units, write the formula, convert units when needed and check whether the result makes physical sense.'),
      chim: tx('Identifică substanțele și mărimile cunoscute, scrie relația folosită și verifică simbolurile și unitățile înainte de calcul.',
        'Identify the substances and known quantities, write the relationship used and check symbols and units before calculating.'),
      ist: tx('Leagă evenimentul de cauză și consecință. Construiește o mini-cronologie și caută cuvintele care indică ordinea în timp.',
        'Connect the event to its cause and consequence. Build a mini-timeline and look for words that signal time order.'),
      geo: tx('Pornește de la legendă, orientare și scară. Identifică simbolul și relația dintre distanța de pe hartă și distanța reală.',
        'Start with the legend, orientation and scale. Identify the symbol and the relationship between map distance and real distance.'),
      eng: tx('Identifică subiectul, timpul și forma verbului. Verifică persoana și cuvintele-indiciu precum every day, yesterday sau tomorrow.',
        'Identify the subject, tense and verb form. Check the person and clue words such as every day, yesterday or tomorrow.')
    };
    return `<strong>${tx('Explicație pentru', 'Explanation for')} ${esc(subjName(m.s))}</strong><p>${esc(pick(m.x))}</p><p><strong>${tx('Pași de reparare', 'Repair steps')}</strong><br>${tips[m.s] || tips.mat}</p><p class="hint">${tx('Ai ales', 'You chose')}: ${esc(pick(m.chosen))} · ${tx('Corect', 'Correct')}: ${esc(pick(m.correct))}</p>`;
  }
  function coachAnswer(text) {
    const q = norm(text || '');
    if (!q.trim()) return tx('Scrie o întrebare concretă, de exemplu: „Cum calculez aria?” sau „De ce am greșit?”.', 'Write a concrete question, for example: “How do I calculate area?” or “Why was my answer wrong?”');
    if (q.includes('frac')) return tx('<strong>Fracții:</strong> numitorul arată în câte părți egale este împărțit întregul, iar numărătorul câte părți luăm. La adunare, caută un numitor comun înainte să aduni numărătorii.', '<strong>Fractions:</strong> the denominator shows how many equal parts make the whole, while the numerator shows how many parts we take. For addition, find a common denominator before adding numerators.');
    if (q.includes('procent') || q.includes('percent')) return tx('<strong>Procente:</strong> p% din N = (p × N) / 100. Exemplu: 25% din 80 = 20. Verifică prin estimare: 25% este un sfert.', '<strong>Percentages:</strong> p% of N = (p × N) / 100. Example: 25% of 80 = 20. Check by estimation: 25% is one quarter.');
    if (q.includes('arie') || q.includes('area')) return tx('<strong>Aria:</strong> identifică forma, adu dimensiunile la aceeași unitate, scrie formula și apoi înlocuiește valorile. Dreptunghi: A = L × l. Triunghi: A = (b × h) / 2.', '<strong>Area:</strong> identify the shape, use the same unit for dimensions, write the formula and then substitute values. Rectangle: A = L × l. Triangle: A = (b × h) / 2.');
    if (q.includes('ecua') || q.includes('equation')) return tx('<strong>Ecuații:</strong> izolează necunoscuta făcând aceeași operație în ambele membre. La final, înlocuiește valoarea găsită pentru verificare.', '<strong>Equations:</strong> isolate the unknown by doing the same operation on both sides. Finally, substitute the result to check it.');
    if (q.includes('idee') || q.includes('subiect') || q.includes('text') || q.includes('main idea')) return tx('<strong>Ideea principală:</strong> întreabă ce mesaj rămâne dacă elimini detaliile. Caută ideea repetată sau susținută de exemple și formuleaz-o în 1–2 propoziții.', '<strong>Main idea:</strong> ask what message remains if you remove details. Find the repeated idea or the one supported by examples and express it in 1–2 sentences.');
    if (q.includes('greș') || q.includes('gres') || q.includes('mistake') || q.includes('wrong')) {
      const last = (S.mistakes || []).slice(-1)[0];
      return last ? explainMistake(last) : tx('Nu există încă o greșeală înregistrată. Începe un quiz, iar explicația va apărea aici.', 'No mistake has been recorded yet. Start a quiz and the explanation will appear here.');
    }
    return tx('<strong>Metoda de învățare:</strong> împarte întrebarea în trei: ce știu, ce trebuie să aflu și ce regulă leagă cele două. Explică răspunsul cu propriile cuvinte și verifică-l printr-un exemplu simplu.', '<strong>Study method:</strong> split the question into three parts: what I know, what I need to find and what rule connects them. Explain the answer in your own words and check it with a simple example.');
  }
  VIEWS.coach = (el) => {
    const render = () => {
      const records = (S.mistakes || []).slice().reverse();
      el.innerHTML = head('✦', tx('AI Coach — întrebări și greșeli', 'AI Coach — questions and mistakes'), tx('Întreabă în cuvinte simple. Primești ghidare locală, orientativă, construită din explicațiile aplicației.', 'Ask in simple words. You get local, orientation guidance built from the app’s explanations.')) + `
        <section class="card stack">
          <h2>${tx('Ce vrei să înțelegi?', 'What do you want to understand?')}</h2>
          <p class="muted">${tx('Exemple: „Cum calculez aria?”, „Explică-mi procentele”, „De ce am greșit?”, „Ce este ideea principală?”', 'Examples: “How do I calculate area?”, “Explain percentages”, “Why was my answer wrong?”, “What is the main idea?”')}</p>
          <label class="sr" for="coach-q">${tx('Întrebarea ta', 'Your question')}</label>
          <textarea id="coach-q" class="write" rows="4" placeholder="${tx('Scrie întrebarea aici…', 'Write your question here…')}"></textarea>
          <div class="row"><button type="button" class="btn primary" id="coach-ask">✦ ${tx('Explică', 'Explain')}</button><button type="button" class="btn" id="coach-mistakes">${tx('Analizează greșelile mele', 'Analyse my mistakes')}</button></div>
          <div id="coach-answer" class="feedback" hidden aria-live="polite"></div>
          <p class="hint">${tx('AI Coach este local și orientativ; nu trimite întrebările la un serviciu extern, nu este profesor și nu înlocuiește materialul didactic sau baremul oficial.', 'AI Coach is local and for orientation; it does not send questions to an external service, is not a teacher and does not replace teaching material or official marking schemes.')}</p>
        </section>
        <section class="card stack">
          <div class="row"><h2 style="margin:0">${tx('Răspunsuri greșite salvate', 'Saved wrong answers')}</h2><span class="chip">${records.length}</span></div>
          ${records.length ? `<div class="stack">${records.map((m, i) => `<article class="mistake-card"><strong>${esc(subjName(m.s))} · ${esc(pick(m.q))}</strong><p class="small muted">${tx('Ai ales', 'You chose')}: ${esc(pick(m.chosen))} · ${tx('Corect', 'Correct')}: ${esc(pick(m.correct))}</p><div class="feedback">${explainMistake(m)}</div><button type="button" class="btn sm" data-mistake="${i}">${tx('Explică în AI Coach', 'Explain in AI Coach')} →</button></article>`).join('')}</div><button type="button" class="btn danger" id="coach-clear">${tx('Șterge registrul', 'Clear log')}</button>` : `<p class="muted">${tx('Încă nu ai greșeli salvate. După un quiz, fiecare răspuns greșit va apărea aici cu explicații.', 'No mistakes saved yet. After a quiz, every wrong answer will appear here with explanations.')}</p>`}
        </section>`;
      const answer = $('#coach-answer', el);
      const question = $('#coach-q', el);
      $('#coach-ask', el).onclick = () => { answer.hidden = false; answer.innerHTML = coachAnswer(question.value); };
      $('#coach-mistakes', el).onclick = () => { answer.hidden = false; answer.innerHTML = records.length ? explainMistake(records[0]) : coachAnswer('greșeli'); };
      $$('[data-mistake]', el).forEach((b) => { b.onclick = () => { answer.hidden = false; answer.innerHTML = explainMistake(records[Number(b.dataset.mistake)]); answer.scrollIntoView({ block: 'nearest' }); }; });
      $('#coach-clear', el)?.addEventListener('click', () => { S.mistakes = []; save(); route(); });
    };
    render();
  };

  /* ───────────── Arhivă oficială & instrumente gratuite ───────────── */
  VIEWS.arhiva = (el) => {
    const years = D.ARCHIVE || [];
    let selected = 'all';
    const paint = () => {
      const list = selected === 'all' ? years : years.filter((x) => String(x.year) === selected);
      el.innerHTML = head('▣', tx('Subiecte și bareme', 'Past papers and marking schemes'), tx('Lucrează singur, apoi verifică fiecare punct în sursa oficială. Linkurile sunt gratuite și duc către arhiva Ministerului.', 'Work independently, then check each point in the official source. The links are free and open the Ministry archive.')) + `
        <section class="card stack">
          <div class="filters"><label class="sr" for="archive-year">${tx('Alege anul', 'Choose year')}</label><select id="archive-year" class="search"><option value="all">${tx('Toți anii', 'All years')}</option>${years.map((x) => `<option value="${x.year}" ${selected === String(x.year) ? 'selected' : ''}>${x.year}</option>`).join('')}</select><span class="chip">${list.length} ${tx('ani disponibili', 'years available')}</span></div>
          <div class="grid g2">${list.map((x) => `<article class="card archive-card"><div class="row"><span class="big" aria-hidden="true">📄</span><div><h2 style="margin:0">${x.year}</h2><p class="small muted">${esc(pick(x.t))}</p></div></div><p>${esc(pick(x.d))}</p><p class="source-meta"><strong>${tx('Sursă oficială', 'Official source')}:</strong> ${esc(x.source || 'subiecte.edu.ro')} · ${tx('an selectat', 'selected year')}: ${x.year}. ${tx('Pagina oficială permite alegerea probei și a fișierului original.', 'The official archive lets you choose the subject and original file.')}</p><a class="btn primary" href="${x.u}" target="_blank" rel="noopener noreferrer">${tx('Deschide arhiva oficială', 'Open official archive')} ↗</a></article>`).join('')}</div>
          <p class="hint">${tx('Pentru clasele V–VII, aplicația oferă exerciții orientative; arhiva standardizată este relevantă în principal pentru Evaluarea Națională de la clasa a VIII-a.', 'For grades 5–7, the app provides orientation practice; the standardized archive is mainly relevant to the National Assessment in grade 8.')}</p>
        </section>`;
    };
    paint();
    $('#archive-year', el).addEventListener('change', (e) => { selected = e.target.value; paint(); $('#archive-year', el).focus(); });
  };

  VIEWS.instrumente = (el) => {
    const todayKey = today();
    const pool = D.QUIZ.filter((q) => !SET.grade || q.g === SET.grade);
    const hash = [...todayKey].reduce((n, c) => n + c.charCodeAt(0), 0);
    const daily = pool[hash % Math.max(1, pool.length)] || D.QUIZ[0];
    const challengeDone = S.challenge?.date === todayKey;
    const shareText = () => tx(`Am ${S.xp} XP în Gimnaziu Space, ${S.quizzes} quiz-uri și ${accuracy() ?? 0}% acuratețe.`, `I have ${S.xp} XP in Gimnaziu Space, ${S.quizzes} quizzes and ${accuracy() ?? 0}% accuracy.`);
    const downloadCertificate = () => {
      const title = tx('Certificat de progres', 'Progress certificate');
      const body = `<!doctype html><html lang="${SET.lang}"><meta charset="utf-8"><title>${title}</title><style>body{font-family:system-ui;padding:4rem;text-align:center;background:#0b1220;color:#eff5ff}main{max-width:700px;margin:auto;border:2px solid #69e2c3;border-radius:24px;padding:3rem}h1{color:#69e2c3}b{font-size:2.2rem}</style><main><p>Gimnaziu Space · ExamSpace V–VIII</p><h1>${title}</h1><p>${tx('Acest document reflectă progresul local din aplicație.', 'This document reflects local progress from the app.')}</p><p><b>${S.xp} XP</b></p><p>${S.quizzes} ${tx('quiz-uri', 'quizzes')} · ${S.reviews} ${tx('cartonașe repetate', 'cards reviewed')} · ${S.mistakes?.length || 0} ${tx('greșeli de revăzut', 'mistakes to review')}</p><p>${new Date().toLocaleDateString(SET.lang === 'en' ? 'en-GB' : 'ro-RO')}</p></main></html>`;
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/html' })); a.download = `gimnaziu-space-${todayKey}-progres.html`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    const copy = (value, ok) => navigator.clipboard?.writeText(value).then(() => toast(ok), () => toast(tx('Copiarea nu este disponibilă în acest browser.', 'Copy is not available in this browser.')));
    const paint = () => {
      el.innerHTML = head('✦', tx('Instrumente gratuite', 'Free toolkit'), tx('Provocări, partajare, printare, backup și certificate locale — fără cont și fără servicii plătite.', 'Challenges, sharing, printing, backup and local certificates — no account and no paid services.')) + `
        <div class="grid g2">
          <section class="card stack"><div class="row"><h2 style="margin:0">${tx('Provocarea zilei', 'Daily challenge')}</h2><span class="chip">${todayKey}</span></div><p class="muted">${tx('O întrebare scurtă aleasă automat din materia ta.', 'A short question selected automatically from your subject.')}</p><h3>${esc(pick(daily.q))}</h3><div class="stack">${daily.o.map((o, i) => `<button type="button" class="btn challenge-option" data-challenge="${i}" ${challengeDone ? 'disabled' : ''}>${String.fromCharCode(65 + i)} · ${esc(pick(o))}</button>`).join('')}</div><div id="challenge-feedback" aria-live="polite">${challengeDone ? `<p class="feedback ok">${tx('Provocarea de azi este finalizată.', 'Today’s challenge is complete.')}</p>` : ''}</div></section>
          <section class="card stack"><h2>${tx('Partajează și păstrează', 'Share and keep')}</h2><p class="muted">${tx('Funcții locale, fără cont și fără server.', 'Local features, with no account and no server.')}</p><div class="row"><button type="button" class="btn primary" id="share-progress">↗ ${tx('Partajează progresul', 'Share progress')}</button><button type="button" class="btn" id="copy-link">⧉ ${tx('Copiază linkul', 'Copy link')}</button><button type="button" class="btn" id="print-report">⎙ ${tx('Printează', 'Print')}</button></div><div class="row"><button type="button" class="btn" id="download-certificate">✦ ${tx('Descarcă certificatul', 'Download certificate')}</button><a class="btn" href="#progres">${tx('Vezi progresul', 'View progress')} →</a></div></section>
        </div>
        <section class="card stack"><h2>${tx('Scurtături de învățare', 'Study shortcuts')}</h2><div class="grid g3"><a class="card" href="#coach"><strong>✦ AI Coach</strong><span class="small muted">${tx('Întreabă și repară greșelile.', 'Ask and repair mistakes.')}</span></a><a class="card" href="#arhiva"><strong>▣ ${tx('Subiecte și bareme', 'Papers and schemes')}</strong><span class="small muted">${tx('Arhiva oficială pe ani.', 'Official archive by year.')}</span></a><a class="card" href="#progres"><strong>▲ ${tx('Backup local', 'Local backup')}</strong><span class="small muted">${tx('Exportă sau importă progresul.', 'Export or import progress.')}</span></a></div></section>`;
      $('#share-progress', el).onclick = async () => { const text = shareText(); if (navigator.share) { try { await navigator.share({ title: 'Gimnaziu Space', text, url: location.href }); } catch {} } else copy(`${text}\n${location.href}`, tx('Progresul a fost copiat.', 'Progress copied.')); };
      $('#copy-link', el).onclick = () => copy(location.href, tx('Linkul a fost copiat.', 'Link copied.'));
      $('#print-report', el).onclick = () => window.print();
      $('#download-certificate', el).onclick = downloadCertificate;
      $$('[data-challenge]', el).forEach((b) => { b.onclick = () => { const chosen = Number(b.dataset.challenge); const ok = chosen === daily.a; S.challenge = { date: todayKey, id: daily.s + '|' + pick(daily.q), chosen, correct: daily.a }; if (!ok) recordMistake(daily, chosen); gain(ok ? 10 : 2); paint(); $('#challenge-feedback', el)?.focus(); }; });
    };
    paint();
  };


  VIEWS.feedback = (el, p) => {
    const records = (S.feedback || []).slice().reverse();
    const option = (value, ro, en, selected) => '<option value="' + value + '"' + (selected ? ' selected' : '') + '>' + tx(ro, en) + '</option>';
    const paint = () => {
      const device = ['phone', 'tablet', 'desktop'];
      const grade = ['5', '6', '7', '8'];
      const task = [['quiz', 'Quiz', 'Quiz'], ['coach', 'AI Coach', 'AI Coach'], ['formulas', 'Formule', 'Formulas'], ['simulation', 'Simulare', 'Mock exam'], ['archive', 'Subiecte și bareme', 'Papers and schemes'], ['accessibility', 'Accesibilitate', 'Accessibility']];
      const categories = [['content', 'Conținut / răspuns greșit', 'Content / incorrect answer'], ['usability', 'Navigare sau utilizare', 'Navigation or usability'], ['accessibility', 'Accesibilitate / afișare', 'Accessibility / display'], ['idea', 'Idee de îmbunătățire', 'Improvement idea'], ['other', 'Altceva', 'Other']];
      el.innerHTML = head('✓', tx('Testare & feedback', 'Testing & feedback'), tx('Ajută la îmbunătățirea aplicației fără cont și fără colectare de date personale.', 'Help improve the app without an account and without collecting personal data.')) +
        '<section class="card stack">' +
          '<h2>' + tx('Sesiune scurtă de testare', 'Short testing session') + '</h2>' +
          '<p class="muted">' + tx('Alege o sarcină, lucrează 5–10 minute, apoi salvează observația. Datele rămân doar în acest browser.', 'Choose a task, work for 5–10 minutes, then save your observation. Data stays in this browser only.') + '</p>' +
          '<form id="feedback-form" class="stack">' +
            '<div class="grid g2">' +
              '<label class="stack"><span>' + tx('Dispozitiv', 'Device') + '</span><select id="fb-device" class="search">' + device.map((v) => option(v, v === 'phone' ? 'Telefon' : v === 'tablet' ? 'Tabletă' : 'Desktop', v[0].toUpperCase() + v.slice(1), false)).join('') + '</select></label>' +
              '<label class="stack"><span>' + tx('Clasa', 'Grade') + '</span><select id="fb-grade" class="search">' + grade.map((v) => option(v, 'Clasa a ' + v + '-a', 'Grade ' + v, false)).join('') + '</select></label>' +
              '<label class="stack"><span>' + tx('Ce ai testat?', 'What did you test?') + '</span><select id="fb-task" class="search">' + task.map((v) => option(v[0], v[1], v[2], false)).join('') + '</select></label>' +
              '<label class="stack"><span>' + tx('Categorie feedback', 'Feedback category') + '</span><select id="fb-category" class="search">' + categories.map((v) => option(v[0], v[1], v[2], false)).join('') + '</select></label>' +
              '<label class="stack"><span>' + tx('Cât de ușor a fost?', 'How easy was it?') + '</span><select id="fb-rating" class="search">' + [1, 2, 3, 4, 5].map((v) => option(String(v), String(v) + '/5', String(v) + '/5', v === 5)).join('') + '</select></label>' +
            '</div>' +
            '<label class="stack"><span>' + tx('Ce a fost neclar sau dificil?', 'What was unclear or difficult?') + '</span><textarea id="fb-note" class="write" rows="4" placeholder="' + tx('Scrie observația aici…', 'Write your observation here…') + '"></textarea></label>' +
            '<label class="check"><input type="checkbox" id="fb-access"> <span>' + tx('Am întâlnit o problemă de accesibilitate sau afișare.', 'I found an accessibility or display issue.') + '</span></label>' +
            '<div class="row"><button class="btn primary" type="submit">✓ ' + tx('Salvează feedbackul', 'Save feedback') + '</button><button class="btn" type="button" id="feedback-export">↓ ' + tx('Exportă observațiile', 'Export observations') + '</button></div>' +
          '</form>' +
          '<p class="hint">' + tx('Nu cere nume, email, cont sau date despre elev. Pentru feedback extern, exportă fișierul și trimite-l manual persoanei care coordonează testarea.', 'No name, email, account or student data is requested. For external feedback, export the file and send it manually to the person coordinating testing.') + '</p>' +
        '</section>' +
        '<section class="card stack">' +
          '<div class="row"><h2 style="margin:0">' + tx('Observații salvate local', 'Locally saved observations') + '</h2><span class="chip">' + records.length + '</span></div>' +
          (records.length ? '<div class="stack">' + records.map((r) => '<article class="feedback-card"><strong>' + esc(r.task) + ' · ' + esc(r.device) + ' · ' + esc(r.grade) + '</strong><p class="small muted">' + esc(r.category || '') + ' · ' + esc(new Date(r.when).toLocaleString(SET.lang === 'en' ? 'en-GB' : 'ro-RO')) + ' · ' + esc(r.rating) + '/5' + (r.accessibility ? ' · ' + tx('accesibilitate', 'accessibility') : '') + '</p><p>' + esc(r.note || tx('Fără observație scrisă.', 'No written observation.')) + '</p></article>').join('') + '</div><button class="btn danger" type="button" id="feedback-clear">' + tx('Șterge observațiile', 'Clear observations') + '</button>' : '<p class="muted">' + tx('Încă nu există observații. Începe cu o sesiune de 5 minute.', 'No observations yet. Start with a 5-minute session.') + '</p>') +
        '</section>';
      $('#feedback-form', el).addEventListener('submit', (event) => {
        event.preventDefault();
        const taskLabel = $('#fb-task', el).selectedOptions[0]?.textContent || '';
        const record = { device: $('#fb-device', el).value, grade: $('#fb-grade', el).value, task: taskLabel, category: $('#fb-category', el).selectedOptions[0]?.textContent || '', rating: $('#fb-rating', el).value, note: $('#fb-note', el).value.trim(), accessibility: $('#fb-access', el).checked, when: new Date().toISOString() };
        S.feedback = [...(S.feedback || []), record].slice(-50);
        save();
        toast(tx('Feedback salvat local.', 'Feedback saved locally.'));
        paint();
      });
      $('#feedback-export', el).onclick = () => {
        const blob = new Blob([JSON.stringify({ app: 'Gimnaziu Space', exportedAt: new Date().toISOString(), feedback: S.feedback || [] }, null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'gimnaziu-space-feedback.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      };
      $('#feedback-clear', el)?.addEventListener('click', () => { S.feedback = []; save(); paint(); });
    };
    paint();
    if (p?.get('item')) {
      $('#fb-task', el).value = 'quiz';
      if (p.get('grade')) $('#fb-grade', el).value = p.get('grade');
      $('#fb-note', el).value = `${tx('Problemă semnalată la întrebarea', 'Issue reported for question')}: “${p.get('q') || p.get('item')}” · ${p.get('subject') || ''} · ${tx('Descrie ce trebuie verificat.', 'Describe what should be checked.')}`;
      $('#fb-note', el).focus();
    }
  };

  /* ───────────── Despre ───────────── */
  VIEWS.despre = (el) => {
    el.innerHTML = head('i', t('aboutTitle'), t('aboutLede')) + `
      <div class="grid g2">
        <section class="card"><h2>${t('aboutWhat')}</h2><p>${t('aboutWhatBody')}</p></section>
        <section class="card" style="border:2px solid var(--bad)"><h2>${t('aboutNot')}</h2><p>${t('aboutNotBody')}</p></section>
        <section class="card"><h2>${t('aboutA11y')}</h2><p>${t('aboutA11yBody')}</p></section>
        <section class="card"><h2>${t('aboutPrivacy')}</h2><p>${t('aboutPrivacyBody')}</p></section>
      </div>
      <section class="card stack"><h2>${t('aboutLinks')}</h2>
        <ul>${D.OFFICIAL.map((o) => `<li><a href="${o.u}" target="_blank" rel="noopener">${esc(pick(o.t))} ↗</a></li>`).join('')}</ul>
        <p class="hint">${t('aboutCal')}</p>
      </section>
      <p class="small muted">${t('aboutAuthor')} · <a href="../portfolio.html">Portfolio</a> · <a href="https://laurandreea10.github.io/BACapp/" target="_blank" rel="noopener">BAC Space ↗</a></p>`;
  };

  /* ───────────── Navigație & evenimente globale ───────────── */
  function openNav() { $('#sidenav').classList.add('open'); $('#scrim').hidden = false; $('#menu-btn').setAttribute('aria-expanded', 'true'); $('#sidenav a').focus(); }
  function closeNav() { if (!$('#sidenav').classList.contains('open')) return; $('#sidenav').classList.remove('open'); $('#scrim').hidden = true; $('#menu-btn').setAttribute('aria-expanded', 'false'); }
  $('#menu-btn').addEventListener('click', () => $('#sidenav').classList.contains('open') ? closeNav() : openNav());
  $('#scrim').addEventListener('click', () => { closeNav(); $('#menu-btn').focus(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#sidenav').classList.contains('open')) { closeNav(); $('#menu-btn').focus(); } });

  document.addEventListener('click', (e) => {
    const l = e.target.closest('[data-set-lang]'); if (l) { SET.lang = l.dataset.setLang; saveSet(); mathCache.clear(); applySettings(); labelGuide(); route(false); l.focus(); }
    const th = e.target.closest('[data-set-theme]'); if (th) { SET.theme = th.dataset.setTheme; saveSet(); applySettings(); }
    const sz = e.target.closest('[data-set-size]'); if (sz) { SET.size = sz.dataset.setSize; saveSet(); applySettings(); }
  });
  $('#theme-btn').addEventListener('click', () => { SET.theme = isDark() ? 'light' : 'dark'; saveSet(); applySettings(); });
  $('#reading-guide-btn').addEventListener('click', () => setReadingGuide(!guide.on));
  const networkStatus = $('#network-status');
  const paintNetwork = (state) => { if (!networkStatus) return; const off=state==='offline'; networkStatus.dataset.state=state; networkStatus.textContent=off?tx('Offline · cache local','Offline · local cache'):tx('Online','Online'); networkStatus.title=off?tx('Aplicația folosește fișierele salvate pe acest dispozitiv.','The app is using files saved on this device.'):tx('Conținutul aplicației este accesibil online.','App content is available online.');networkStatus.setAttribute('aria-label',networkStatus.textContent); };
  window.addEventListener('online',()=>paintNetwork('online')); window.addEventListener('offline',()=>paintNetwork('offline')); paintNetwork(navigator.onLine?'online':'offline');
  const labelGuide=()=>{const label=guide.on?tx('Dezactivează ghidul de citire','Turn off reading guide'):tx('Activează ghidul de citire','Turn on reading guide');$('#reading-guide-btn').setAttribute('aria-label',label);$('#reading-guide-btn').title=label;};
  labelGuide();
  $('#reading-guide-btn').addEventListener('click',labelGuide);
  $('#settings-btn').addEventListener('click', () => $('#settings').showModal());
  $('#set-font').addEventListener('change', (e) => { SET.font = e.target.checked ? 'lexend' : ''; saveSet(); applySettings(); });
  $('#set-spacing').addEventListener('change', (e) => { SET.spacing = e.target.checked; saveSet(); applySettings(); });
  $('#set-contrast').addEventListener('change', (e) => { SET.contrast = e.target.checked; saveSet(); applySettings(); });
  $('#set-motion').addEventListener('change', (e) => { SET.motion = e.target.checked ? 'reduce' : ''; saveSet(); applySettings(); });
  $('#set-sound').addEventListener('change', (e) => { SET.sound = e.target.checked; saveSet(); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applySettings);
  window.addEventListener('hashchange', () => route());
  window.addEventListener('beforeprint', () => $$('details').forEach((d) => { d.open = true; }));

  applySettings();
  route(false);

  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').then(reg=>{ if(reg.waiting){networkStatus.textContent=tx('Actualizare disponibilă','Update ready');networkStatus.dataset.state='update';networkStatus.setAttribute('aria-label',networkStatus.textContent);} reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller){networkStatus.textContent=tx('Actualizare · reîncarcă pagina','Update · reload page');networkStatus.dataset.state='update';networkStatus.setAttribute('aria-label',networkStatus.textContent);networkStatus.title=tx('Versiunea nouă este descărcată. Reîncarcă pagina când ai terminat.','The new version is downloaded. Reload when you are ready.');}});}); }).catch(() => {});

  // expus pentru teste
  window.GS = { parseMath, speak, plainMath, buildDeck, state: () => S };
})();
