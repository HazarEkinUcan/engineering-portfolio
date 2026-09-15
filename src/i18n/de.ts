/**
 * Deutsche Oberflächen- und Fließtexte.
 *
 * Die Quelldatei ist `en.ts`. Diese Datei wird dagegen typisiert, ein Schlüssel,
 * den es im Englischen gibt und hier nicht, ist also ein Compilerfehler. So kann
 * auf einer deutschen Seite kein englischer Text stillschweigend durchrutschen.
 *
 * Batch 1 ist übersetzt: Oberfläche, Navigation, Startseite, Über mich, Kontakt,
 * 404 und die Metadaten dieser Seiten. Die Fallstudien und die Diagrammtexte
 * folgen in späteren Batches und liegen in `src/content/projects/de/`,
 * `src/content/ongoing/de/` und `src/i18n/diagrams/de.ts`.
 *
 * Projektnamen sind Eigennamen und werden nicht übersetzt: Writing Robot,
 * Prosodic VR, İzmir Water, F1 Race Prediction, Low Cost Industrial Robot Arm,
 * Local-First Engineering Assistant. Dasselbe gilt für die Studiengangsnamen,
 * das sind die offiziellen Bezeichnungen der Universitäten.
 */
import type { UIStrings } from './en';

const de: UIStrings = {
  nav: {
    work: 'Projekte',
    ongoing: 'In Arbeit',
    about: 'Über mich',
    contact: 'Kontakt',
    language: 'Sprache',
    primaryLabel: 'Hauptnavigation',
    footerLabel: 'Fußzeile',
    menu: 'Menü',
    skipToContent: 'Zum Inhalt springen',
    appearance: 'Darstellung',
    toggleTheme: 'Farbschema wechseln',
  },

  menus: {
    projectsLabel: 'Projekte',
    ongoingLabel: 'Projekte in Arbeit',
    languageLabel: 'Sprachen',
    viewAllWork: 'Alle Projekte ansehen',
    viewOngoing: 'Projekte in Arbeit ansehen',
    noProjects: 'Noch keine Projekte.',
    noOngoing: 'Keine Projekte in Arbeit.',
  },

  evidence: {
    video: 'Demo-Video',
    code: 'Quellcode',
    output: 'Erzeugte Ausgabe',
    architecture: 'Architektur',
    data: 'Sitzungsdaten',
    dataset: 'Öffentlicher Datensatz',
    'system-design': 'Systementwurf',
  },

  site: {
    title: 'Hazar Ekin Uçan · Robotik und Intelligente Systeme',
    description:
      'Bachelorstudent für Robotik und Intelligente Systeme. Ich schreibe Software, die echte Maschinen bewegt, und teste sie dann an der Maschine. Fallstudien aus der industriellen Robotik und der Sprachanalyse.',
    positioning: 'Ich studiere Robotics & Intelligent Systems und baue meine Kenntnisse in Software, Mechanik und physischen Systemen aus.',
    status:
      'B.Sc. Robotics & Intelligent Systems · Constructor University Bremen · Voraussichtlich 2027',
  },

  home: {
    seeTheWork: 'Projekte ansehen',
    aboutMe: 'Über mich',
    markNote:
      'Die Schreibbahn hier wurde mit demselben Programm erzeugt, das ich für einen echten FANUC-Roboter verwendet habe. Durchgezogene Linien zeigen, wo der Stift auf dem Papier schreibt. Gestrichelte Linien zeigen die Wege mit angehobenem Stift. In der Werkstatt hat der Roboter diese Bewegungsfolge mit einem echten Stift ausgeführt und den Text auf Papier geschrieben.',
    markLink: 'Das Projekt Writing Robot ansehen',
    sectionWork: '01 · Ausgewählte Projekte',
    sectionOngoing: '02 · Projekte in Arbeit',
    sectionHow: '03 · Wie ich arbeite',
    sectionCapabilities: '04 · Fähigkeiten',
    sectionBackground: '05 · Werdegang',
    ongoingDeck:
      'An diesen Projekten arbeite ich gerade. Bisher ist keines fertiggestellt oder vermessen. Die angegebenen Ziele beschreiben, was ich erreichen möchte.',
    fullCapabilities: 'Alle Fähigkeiten',
    fullBackground: 'Vollständiger Werdegang',
    principles: [
      {
        title: 'Ich teste an der echten Maschine',
        body: 'Eine Simulation aufzubauen und eine echte Anlage in Betrieb zu nehmen sind unterschiedliche Aufgaben. Ich plane die Zelle in RoboGuide und löse anschließend die Probleme, die am realen Aufbau auftreten.',
        label: 'Writing Robot: eine Feder im Greifer',
      },
      {
        title: 'Ich versuche, Probleme an der richtigen Stelle zu lösen',
        body: 'Beim Writing Robot wurde die Linie ungleichmäßig, sobald der Stift das Papier berührte. Genaueres Kalibrieren in der Software hätte das nicht gelöst. Deshalb habe ich eine Feder in den Stifthalter eingebaut, die kleine Abweichungen mechanisch ausgleicht.',
        label: 'Writing Robot: eine Feder im Greifer',
      },
      {
        title: 'Ich nenne nur Zahlen, die ich belegen kann',
        body: 'Ein System sollte lieber kein Ergebnis liefern als eine Zahl ohne belastbare Grundlage. Wenn ein Merkmal keine brauchbare Information liefert, gehört es nicht in die Auswertung.',
        label: 'Prosodic VR: irreführende Scores vermeiden',
      },
    ],
  },

  about: {
    metaTitle: 'Über mich · Hazar Ekin Uçan',
    metaDescription:
      'Bachelorstudent für Robotik und Intelligente Systeme an der Constructor University Bremen. Interessiert an Robotik, Fahrzeug- und Luftfahrttechnik sowie an physischen Systemen.',
    heading: 'Über mich',
    sectionCapabilities: '01 · Fähigkeiten',
    sectionBackground: '02 · Ausbildung und Erfahrung',
    lede: 'Am meisten interessiert mich der Punkt, an dem Software auf eine Maschine trifft, die tatsächlich etwas kaputt machen kann.',
    paragraphs: [
      'Robotik interessiert mich besonders, wenn sie einen konkreten Nutzen hat. Sie sollte den Menschen, die sie einsetzen, etwas erleichtern oder eine Aufgabe besser lösen. Aus diesem Gedanken entstehen viele meiner Projektideen. Manchmal geht es um ein größeres technisches Problem, manchmal einfach um etwas, das meinen Alltag leichter machen würde.',
      'In den letzten Jahren hat mich außerdem die Fahrzeugtechnik immer mehr interessiert. Moderne Autos bringen vieles auf einmal zusammen, das mir Spaß macht: Mechanik, Elektronik und Software. Elektrofahrzeugtechnik, Fahrzeugsysteme und autonomes Fahren sind Bereiche, die ich deutlich besser verstehen will und an denen ich gern arbeiten würde.',
      'Die Luft- und Raumfahrt interessiert mich aus einem ähnlichen Grund. Dort kommen Mechanik, Aerodynamik, Thermodynamik und Physik zusammen. Mit diesen Themen beschäftige ich mich gern. Physik war schon in der Schule eines meiner wichtigsten Fächer, und die Neugier darauf ist geblieben.',
      'In der Mechanik habe ich noch viel zu lernen. Im Praktikum konnte ich deutlich mehr praktische Erfahrung an realen Anlagen sammeln. Meine neuen Projekte wähle ich bewusst so, dass ich darauf aufbauen kann. Ich möchte sicherer in CAD, Konstruktion und Fertigung werden und die Details verstehen, die erst beim Bau und Betrieb einer Maschine auffallen.',
      'Ich möchte mich nicht auf einen Bereich beschränken. Mein Ziel ist, sowohl mit Software als auch mit Hardware sicher arbeiten zu können. Dafür suche ich weiter nach Projekten, bei denen ich merke, was ich noch lernen muss.',
    ],
  },

  project: {
    backToWork: 'Ausgewählte Projekte',
    myRole: 'Meine Rolle',
    metaRole: 'Rolle',
    metaContext: 'Kontext',
    metaPeriod: 'Zeitraum',
    metaStack: 'Stack',
    glanceLabel: 'Auf einen Blick',
    glanceWhat: 'Was es ist',
    glanceBuilt: 'Was ich gebaut habe',
    limitsHeading: 'Wo die Grenzen liegen',
    evidencePrefix: 'Belege auf dieser Seite:',
    nextLabel: 'Weiter',
    nextNavLabel: 'Nächstes Projekt',
  },

  ongoing: {
    backToOngoing: 'Projekte in Arbeit',
    statusChip: 'In Arbeit',
    lastUpdated: 'Zuletzt aktualisiert:',
    targetsHeading: 'Technische Zielwerte',
    statusHeading: 'Aktueller Stand',
    statusDeck: 'So weit ist das Projekt im {date}.',
    metaContext: 'Kontext',
    metaStarted: 'Begonnen',
    metaFocus: 'Schwerpunkt',
    metaStatus: 'Status',
    metaStatusValue: 'In Arbeit',
    followTheBuild: 'Projektfortschritt verfolgen',
    conceptToFollow: 'Konzeptbild folgt',
  },

  card: {
    readCaseStudy: 'Fallstudie lesen',
  },

  contact: {
    heading:
      'Offen für Gespräche über Robotik, Automatisierung und Software für physische Systeme.',
    copy: 'Kopieren',
    copied: 'Kopiert',
    copiedStatus: 'E-Mail-Adresse kopiert',
    copyFailed: 'Kopieren hat nicht geklappt. Adresse bitte von Hand markieren.',
  },

  footer: {
    colophon: 'Erstellt mit Astro. Schrift: IBM Plex.',
    lastUpdated: 'Zuletzt aktualisiert',
  },

  skills: [
    {
      title: 'Robotik und industrielle Automatisierung',
      note: '',
      items: [
        'Programmierung in FANUC TP und LS',
        'Bedienung über das Teach Pendant: Jogging, Tool- und User-Frames, Register und Positionsregister, digitale E/A, Bewegungsbefehle',
        'Zellenaufbau und Zyklussimulation in FANUC RoboGuide',
        'Mastering und Kalibrierung von Robotern',
        'Fehlersuche bei Steuerungsalarmen',
        'Pneumatische und Vakuum-Endeffektoren',
        'Montage von Palettiergreifern nach SolidWorks-Zeichnungen',
        'Aufbau und Verdrahtung von Schaltschränken',
        'Grundkenntnisse in SPS, Relais und Antrieben',
      ],
      evidenceLabel: 'Writing Robot: das Programm erzeugen',
    },
    {
      title: 'Software',
      note: '',
      items: ['Python', 'C / C++', 'MATLAB', 'FastAPI', 'Git und GitHub', 'Kommandozeilen-Werkzeuge'],
      evidenceLabel: 'Prosodic VR: zwei Referenzaufnahmen',
    },
    {
      title: 'Signale, Sprache und Daten',
      note: '',
      items: [
        'Praat / parselmouth',
        'librosa',
        'Faster-Whisper',
        'NumPy',
        'pandas',
        'matplotlib',
        'Merkmalsextraktion',
        'Zeitreihen- und Signalanalyse',
      ],
      evidenceLabel: 'Prosodic VR: was gemessen wird',
    },
    {
      title: 'Maschinelles Lernen',
      note: 'Aus Lehrveranstaltungen und eigener Arbeit.',
      items: [
        'scikit-learn',
        'Überwachtes Lernen',
        'Random Forests',
        'Gradient Boosting',
        'SVMs',
        'Modellauswahl und Hyperparameter-Tuning',
        'Kreuzvalidierung und Fehleranalyse',
      ],
      evidenceLabel: '',
    },
  ],

  honest: [
    {
      title: 'Erste Einblicke',
      body: 'Siemens TIA Portal, SIMATIC STEP 7 und SIMATIC Automation Tool. Ich habe mit einem Elektroingenieur zusammengearbeitet und gelernt, wofür die einzelnen Werkzeuge da sind. Meine Kenntnisse in der Siemens-Programmierung gehen nicht über diese Grundlagen hinaus.',
    },
    {
      title: 'SolidWorks',
      body: 'Meine Erfahrung liegt im Lesen von Zeichnungen und in der Montage danach. So habe ich zwei Palettiergreifer gebaut. Teile für die Fertigung habe ich nicht selbst modelliert.',
    },
    {
      title: 'Was ich nicht gemacht habe',
      body: 'Während des Praktikums habe ich keine formalen Reichweiten- oder Kollisionsuntersuchungen gemacht und die Kinematik nicht von Hand gelöst. Das übernimmt die Steuerung. Als ich die Bedeutung dieser Berechnungen verstanden hatte, wurden mir auch die Frames und Werkzeugdefinitionen klarer.',
    },
  ],

  timeline: [
    {
      period: '2024 bis 2027 (voraussichtlich)',
      title: 'B.Sc. Robotics & Intelligent Systems',
      org: 'Constructor University Bremen',
      place: 'Bremen, Deutschland',
      detail:
        'Relevante Lehrveranstaltungen: eingebettete Systeme, Regelungstechnik, Programmierung in C/C++, lineare Algebra, maschinelles Lernen, autonome Systeme, Automatisierung und datengetriebene Modellbildung.',
      bullets: [],
      linkLabel: '',
    },
    {
      period: '1. Juni bis 24. Juli 2026',
      title: 'Praktikant, Robotik',
      org: 'Neksus Endüstriyel Otomasyon',
      place: 'Abteilung Programmierung und Automatisierungssysteme, İzmir, Türkei',
      detail:
        'Mitarbeit an zwei Palettieranlagen und ein eigenes Roboterprojekt, jeweils von den Einzelteilen bis zur betriebsbereiten Zelle.',
      bullets: [
        'FANUC-TP-Programme erstellt und bearbeitet und Roboter über das Teach Pendant bedient.',
        'Roboterzellen in RoboGuide aufgebaut, importierte CAD-Modelle positioniert und Zyklen simuliert.',
        'Mastering, Kalibrierung und Alarmbehebung unter Anleitung durchgeführt.',
        'Zwei Palettiergreifer nach SolidWorks-Zeichnungen montiert und pneumatische sowie Vakuumkomponenten eingebaut.',
        'Industrielle Schaltschränke aufgebaut und verdrahtet.',
      ],
      linkLabel: 'und den Writing Robot gebaut',
    },
    {
      period: 'Juli bis September 2025',
      title: 'Freiwilliger Praktikant, Maschinelles Lernen',
      org: 'Celal Bayar University (XRlab)',
      place: 'Manisa, Türkei',
      detail: '',
      bullets: [],
      linkLabel: '',
    },
    {
      period: '2023 bis 2024',
      title: 'B.Sc. Mechanical Engineering',
      org: 'Yaşar University',
      place: 'İzmir, Türkei · Vollstipendium · Wechsel an die Constructor University',
      detail: '',
      bullets: [],
      linkLabel: '',
    },
  ],

  languages: 'Türkisch (Muttersprache) · Englisch (C1) · Deutsch (A2-B1) · Französisch (A1-A2)',

  notFound: {
    metaTitle: 'Seite nicht gefunden · Hazar Ekin Uçan',
    metaDescription: 'Diese Seite gibt es nicht.',
    code: '404',
    heading: 'Diese Seite gibt es nicht.',
    body: 'Vielleicht ist der Link veraltet, oder unter dieser Adresse gab es nie eine Seite.',
    action: 'Zurück zu den Projekten',
  },
};

export default de;
