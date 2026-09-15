/**
 * English UI and editorial copy. This file is the source of truth: `tr.ts` and
 * `de.ts` are typed against it, so a key that exists here and is missing there
 * is a compile error rather than an English string leaking into a translated
 * page.
 *
 * Strings are grouped by where they appear. Project case-study prose lives in
 * the content collections, not here.
 */
const en = {
  nav: {
    work: 'Work',
    ongoing: 'Ongoing',
    about: 'About',
    contact: 'Contact',
    language: 'Language',
    primaryLabel: 'Primary',
    footerLabel: 'Footer',
    menu: 'Menu',
    skipToContent: 'Skip to content',
    appearance: 'Appearance',
    toggleTheme: 'Toggle color theme',
  },

  menus: {
    projectsLabel: 'Projects',
    ongoingLabel: 'Ongoing projects',
    languageLabel: 'Languages',
    viewAllWork: 'View all work',
    viewOngoing: 'View ongoing projects',
    noProjects: 'No projects yet.',
    noOngoing: 'No ongoing projects.',
  },

  evidence: {
    video: 'Demo video',
    code: 'Source code',
    output: 'Generated output',
    architecture: 'Architecture',
    data: 'Session data',
    dataset: 'Public dataset',
    'system-design': 'System design',
  },

  site: {
    title: 'Hazar Ekin Uçan · Robotics & Intelligent Systems',
    description:
      'Robotics and Intelligent Systems undergraduate. I write software that moves real machines, then test it on the machine. Case studies in industrial robotics and speech analysis.',
    positioning: 'Robotics & Intelligent Systems student, building skills across software, mechanics, and physical systems.',
    status:
      'B.Sc. Robotics & Intelligent Systems · Constructor University Bremen · Expected 2027',
  },

  home: {
    seeTheWork: 'See the work',
    aboutMe: 'About me',
    markNote:
      'The trajectory shown here comes from the same generator I used on a physical FANUC robot. Solid strokes are pen-down writing moves; the dashed lines are the pen travelling between them. In the workshop, the robot followed that same sequence with a real pen and wrote the text on paper.',
    markLink: 'See the Writing Robot project',
    sectionWork: '01 · Selected work',
    sectionOngoing: '02 · Ongoing projects',
    sectionHow: '03 · How I work',
    sectionCapabilities: '04 · Capabilities',
    sectionBackground: '05 · Background',
    ongoingDeck:
      'These are builds I am working on now. Nothing here has been completed or measured yet, and the targets are what the work is aimed at.',
    fullCapabilities: 'Full capabilities',
    fullBackground: 'Full background',
    principles: [
      {
        title: 'I test things on the real machine',
        body: 'Simulation and physical commissioning are different problems. I plan the cell in RoboGuide, then go and fix what the real setup breaks.',
        label: 'Writing robot: a spring in the gripper',
      },
      {
        title: 'I try to fix problems in the right place',
        body: 'The writing robot’s line was failing on contact. Tighter software calibration was not going to fix it, so I put a spring in the pen holder and let the tool absorb the error.',
        label: 'Writing robot: a spring in the gripper',
      },
      {
        title: 'I only report numbers I can back up',
        body: 'I would rather a system return nothing than return a number it cannot justify. If a feature carries no signal, dropping it is a normal outcome.',
        label: 'Prosodic VR: making the score refuse to lie',
      },
    ],
  },

  about: {
    metaTitle: 'About · Hazar Ekin Uçan',
    metaDescription:
      'Robotics and Intelligent Systems undergraduate at Constructor University Bremen. Interested in robotics, automotive and aerospace engineering, and physical systems.',
    heading: 'About',
    sectionCapabilities: '01 · Capabilities',
    sectionBackground: '02 · Education and experience',
    lede: 'I’m most interested in the point where software meets a machine that can actually break something.',
    paragraphs: [
      'Robotics interests me most when it has a clear reason to exist. It should make something easier, more useful, or better for the person using it. A lot of the projects I want to build start from that idea. Sometimes that means solving a bigger engineering problem; sometimes it simply means building something that would make my own everyday life easier.',
      'Over the last few years I’ve also become increasingly interested in automotive engineering. Modern cars bring together a lot of the things I enjoy at once: mechanics, electronics and software. Electric vehicle technology, vehicle systems and autonomous driving are all areas I want to understand much better and would be excited to work on.',
      'Aerospace interests me for a similar reason. It brings together mechanics, aerodynamics, thermodynamics and physics, subjects I genuinely enjoy learning about. Physics was one of the subjects I cared about most in high school, and that curiosity never really went away.',
      'Mechanically, I know I still have ground to cover. My internship gave me much more hands-on experience with physical systems, and the projects I’m starting now are deliberately pushing me further in that direction. I want to get better at CAD, mechanical design, fabrication and the details that only become obvious once something has to work in the real world.',
      'I don’t want to be limited to one side of engineering. I want to be comfortable moving between software and hardware, and to keep finding projects that expose the parts I still need to learn.',
    ],
  },

  project: {
    backToWork: 'Selected work',
    myRole: 'My role',
    metaRole: 'Role',
    metaContext: 'Context',
    metaPeriod: 'Period',
    metaStack: 'Stack',
    glanceLabel: 'At a glance',
    glanceWhat: 'What it is',
    glanceBuilt: 'What I built',
    limitsHeading: 'Where the limits are',
    evidencePrefix: 'Evidence on this page:',
    nextLabel: 'Next',
    nextNavLabel: 'Next project',
  },

  ongoing: {
    backToOngoing: 'Ongoing projects',
    statusChip: 'Ongoing',
    lastUpdated: 'Last updated:',
    targetsHeading: 'Engineering targets',
    statusHeading: 'Current status',
    statusDeck: 'Where the project actually is, as of {date}.',
    metaContext: 'Context',
    metaStarted: 'Started',
    metaFocus: 'Focus',
    metaStatus: 'Status',
    metaStatusValue: 'Ongoing',
    followTheBuild: 'Follow the build',
    conceptToFollow: 'Concept illustration to follow',
  },

  card: {
    readCaseStudy: 'Read the case study',
  },

  contact: {
    heading:
      'Open to conversations about robotics, automation and software for physical systems.',
    copy: 'Copy',
    copied: 'Copied',
    copiedStatus: 'Email address copied',
    copyFailed: 'Copying failed. Select the address instead.',
  },

  footer: {
    colophon: 'Built with Astro. Typeset in IBM Plex.',
    lastUpdated: 'Last updated',
  },

  /**
   * Capabilities. Paired by position with `skillMeta` in src/data/skills.ts,
   * which holds the parts that are not language: the evidence hrefs. A locale
   * supplies the words and nothing else, so a translation cannot retarget a
   * link by accident.
   */
  skills: [
    {
      title: 'Robotics and industrial automation',
      note: '',
      items: [
        'FANUC TP and LS programming',
        'Teach pendant operation: jogging, tool and user frames, registers and position registers, digital I/O, motion instructions',
        'FANUC RoboGuide cell building and cycle simulation',
        'Robot mastering and calibration',
        'Troubleshooting controller alarms',
        'Pneumatic and vacuum end-effectors',
        'Palletizing gripper assembly from SolidWorks plans',
        'Industrial control panel assembly and wiring',
        'PLC, relay and drive familiarity',
      ],
      evidenceLabel: 'Writing robot: generate the program',
    },
    {
      title: 'Software',
      note: '',
      items: ['Python', 'C / C++', 'MATLAB', 'FastAPI', 'Git and GitHub', 'Command-line tooling'],
      evidenceLabel: 'Prosodic VR: two anchors',
    },
    {
      title: 'Signal, speech and data',
      note: '',
      items: [
        'Praat / parselmouth',
        'librosa',
        'Faster-Whisper',
        'NumPy',
        'pandas',
        'matplotlib',
        'Feature extraction',
        'Time-series and signal analysis',
      ],
      evidenceLabel: 'Prosodic VR: what gets measured',
    },
    {
      title: 'Machine learning',
      note: 'Coursework and self-directed work.',
      items: [
        'scikit-learn',
        'Supervised learning',
        'Random forests',
        'Gradient boosting',
        'SVMs',
        'Model selection and hyperparameter tuning',
        'Cross-validation and error analysis',
      ],
      evidenceLabel: '',
    },
  ],

  /** Stated plainly rather than padded. site-plan.md §6. */
  honest: [
    {
      title: 'Introductory exposure',
      body: 'Siemens TIA Portal, SIMATIC STEP 7 and SIMATIC Automation Tool. I worked alongside an electrical engineer and learned what each tool is for. I did not become an advanced Siemens programmer.',
    },
    {
      title: 'SolidWorks',
      body: 'Reading and assembling from plans, not authoring. I built two palletizing grippers from drawings. I have not modelled production parts.',
    },
    {
      title: 'What I did not do',
      body: 'During the internship I did not carry out formal reach or collision studies, and I did not hand-solve kinematics. The controller does that. Knowing what those calculations represent is what made the frames and tool definitions make sense.',
    },
  ],

  /**
   * Education and experience, newest first. Paired by position with
   * `timelineMeta` in src/data/timeline.ts, which holds the entry kind and the
   * link target. Institution names and place names are proper nouns and are
   * carried here unchanged in every locale.
   */
  timeline: [
    {
      period: '2024 to 2027 (expected)',
      title: 'B.Sc. Robotics & Intelligent Systems',
      org: 'Constructor University Bremen',
      place: 'Bremen, Germany',
      detail:
        'Relevant coursework: embedded systems, control systems, programming in C/C++, linear algebra, machine learning, autonomous systems, automation and data-driven modelling.',
      bullets: [] as string[],
      linkLabel: '',
    },
    {
      period: '1 June to 24 July 2026',
      title: 'Robotics Engineer Intern',
      org: 'Neksus Endüstriyel Otomasyon',
      place: 'Programming and Automation Systems Dept., İzmir, Türkiye',
      detail:
        'Two palletizing systems and one individual robot project, across the whole path from raw parts to a running cell.',
      bullets: [
        'Created and edited FANUC TP programs and operated robots from the teach pendant.',
        'Built robotic cells in RoboGuide, positioned imported CAD and simulated cycles.',
        'Performed mastering, calibration and alarm troubleshooting under supervision.',
        'Assembled two palletizing grippers from SolidWorks plans and installed pneumatic and vacuum components.',
        'Assembled and wired industrial control panels.',
      ],
      linkLabel: 'and built the writing robot',
    },
    {
      period: 'July to September 2025',
      title: 'Voluntary Intern, Machine Learning',
      org: 'Celal Bayar University (XRlab)',
      place: 'Manisa, Türkiye',
      detail: '',
      bullets: [] as string[],
      linkLabel: '',
    },
    {
      period: '2023 to 2024',
      title: 'B.Sc. Mechanical Engineering',
      org: 'Yaşar University',
      place: 'İzmir, Türkiye · Full scholarship · Transferred to Constructor University',
      detail: '',
      bullets: [] as string[],
      linkLabel: '',
    },
  ],

  languages: 'Turkish (native) · English (C1) · German (A2-B1) · French (A1-A2)',

  notFound: {
    metaTitle: 'Page not found · Hazar Ekin Uçan',
    metaDescription: 'That page does not exist.',
    code: '404',
    heading: 'That page does not exist.',
    body: 'The link may be out of date, or the page may never have been there.',
    action: 'Back to the work',
  },
} as const;

/**
 * The shape every locale must provide. Literal types are widened to `string`,
 * so a translation file supplies its own words while still being checked for
 * every key the English file defines: a missing key is a compile error, and so
 * is a key that does not exist in English.
 *
 * Arrays stay readonly. Nothing renders a dictionary by mutating it, and a
 * readonly array accepts both the `as const` English tuples and the ordinary
 * array literals the translation files are written with.
 */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

export type UIStrings = Widen<typeof en>;

export default en;
