/**
 * Diagram copy, in English.
 *
 * A separate dictionary from `src/i18n/en.ts` because it belongs to the case
 * studies rather than to the site furniture, and because it is large enough
 * that mixing the two would make both harder to read. It is generated into
 * `tr.ts` and `de.ts` beside it by the same tool, and typed the same way.
 *
 * What is NOT here, deliberately: numbers, units and protocol tokens. Speeds,
 * heights, frequencies, `FINE`, `CNT10`, `/health` and the rest are data, not
 * copy. They are composed in the components, so translating a diagram cannot
 * change a figure in it.
 */
const diagrams = {
  pipeline: {
    label: 'Diagram: generation pipeline',
    caption:
      'One dependency-free Python file turns a string into a FANUC motion program. Validation sits before the exporters, so a coordinate outside the paper envelope stops the run rather than reaching the robot. Three files come out of every run; the SVG exists so the path can be read before the program is used.',
    outputsLabel: 'Outputs',
    stages: [
      { key: 'Input', title: 'Text', note: 'A-Z, a-z, 0-9, Turkish letters, punctuation' },
      { key: 'Font', title: 'Stroke polylines', note: 'unit box, y=0 cap height, y=1 baseline' },
      { key: 'Layout', title: 'Millimetre strokes', note: 'cursor walk, spacing, line breaks' },
      {
        key: 'Auto-fit',
        title: 'Largest height that fits',
        note: 'binary search, refuses below 3 mm',
      },
      { key: 'Points', title: 'Ordered robot points', note: 'TRAVEL · PEN_DOWN · DRAW · PEN_UP' },
      { key: 'Check', title: 'Envelope validation', note: 'out of bounds raises, never clamps' },
    ],
    outputNotes: [
      'checked before anything reaches the robot',
      'point list with motion type and speed',
      '/PROG /ATTR /APPL /MN /POS /END',
    ],
  },

  penMotion: {
    label: 'Diagram: pen motion state machine',
    caption:
      "Every stroke runs the same four states. Pen-down and pen-up are emitted with FINE termination, because those are the two points where the tip has to arrive exactly; the vertices in between use CNT10 so the controller blends the corners and the line stays smooth. Safe height, draw height and both speeds are the generator's defaults.",
    plotAlt:
      'Height profile: travel at safe height, descend, draw along the surface, then lift back to safe height.',
    safe: 'safe',
    paper: 'paper',
    states: [
      { name: 'Travel', desc: "Move above the next stroke's first point" },
      { name: 'Pen down', desc: 'Descend to the writing plane' },
      { name: 'Draw', desc: 'Every vertex of the stroke, in order' },
      { name: 'Pen up', desc: 'Lift clear before the next stroke' },
    ],
  },

  compliance: {
    label: 'Diagram: mechanical compliance',
    caption:
      'With a rigid holder, contact force is governed by how far the tip is commanded into the surface: a little too little and the line disappears, a little too much and the load climbs fast. A spring in the holder flattens that relationship across the same band of height error, so small calibration and flatness variations stop mattering. The shapes show the mechanism; no force was measured.',
    rigidTitle: 'Rigid holder',
    rigidAlt:
      'With a rigid holder, contact force rises steeply with height error, passing quickly from no mark to excessive load.',
    rigidLegend:
      'A narrow band of height error produces a usable line. Either side of it the pen skips or the load rises.',
    sprungTitle: 'Sprung holder',
    sprungAlt:
      'With a spring in the holder, contact force stays within a usable band across a much wider range of height error.',
    sprungLegend:
      'The spring absorbs the same variation, so the usable band is wide enough that calibration error stops being decisive.',
    axisForce: 'Contact force',
    axisError: 'Height error',
  },

  calibration: {
    label: 'Diagram: personal calibration',
    caption:
      "Each speaker's own calm baseline and high-urgency upperline become the ends of their own scale, so the score reports movement along a personal range rather than an absolute level. The two speakers above sit at different absolute pitches and reach the same score. The third axis shows the signed case: where a speaker's upperline falls below their baseline for a feature, the scale simply runs the other way. Values shown are unit labels for the method, not measurements.",
    baseline: 'Baseline',
    upperline: 'Upperline',
    speakerA: 'Speaker A',
    speakerANote: 'louder, higher pitched',
    speakerB: 'Speaker B',
    speakerBNote: 'quieter, lower pitched',
    signed: 'Signed gap',
    signedNote: 'slower under urgency',
  },

  calibrationMini: {
    speakerA: 'Speaker A',
    speakerB: 'Speaker B',
    legend: 'baseline → upperline · same score, different voices',
  },

  architecture: {
    label: 'Diagram: system architecture',
    caption:
      'Two layers and one bridge. The VR side handles interaction and display; every piece of analysis stays in Python, which avoids reimplementing audio libraries in C# and keeps one authoritative implementation of the measurement. The stages inside the engine run in order on each recording.',
    vrLayer: 'VR layer',
    headsetNote: 'Quest Link · controller button',
    sceneName: 'Unity scene',
    sceneNote: 'interaction and result panel',
    engineLayer: 'Python analysis engine',
    engineFoot: 'Runs on its own, with no headset attached',
    stages: [
      'Record 16 kHz mono',
      'Transcribe · Faster-Whisper',
      'Extract prosodic features',
      'Quality checks',
      'Personal calibration',
      'Score 0-100',
    ],
  },

  qualityGate: {
    label: 'Diagram: scoring and quality gates',
    caption:
      'Four gates stand between a recording and a score, and each has an explicit exit. The system returns nothing before it returns a number it cannot justify. A dropped feature, a rejected calibration and a repeated anchor are all normal outcomes.',
    passLabel: 'If every gate passes',
    gates: [
      {
        check: 'Recording usable?',
        detail: 'Clipping at peak ≥ 0.99, too quiet below 0.02, voiced frames under 20%',
        exit: 'Warn and ask for the recording again',
      },
      {
        check: 'Calibration phrase spoken?',
        detail: 'Transcript compared against the expected sentence',
        exit: 'Repeat the anchor',
      },
      {
        check: 'Did this feature separate?',
        detail: 'Baseline and upperline must differ by the feature’s minimum gap',
        exit: 'Drop the feature from scoring',
      },
      {
        check: 'Enough of the profile left?',
        detail: 'At least two surviving features and 0.40 combined weight',
        exit: 'Reject the calibration',
      },
    ],
    scoring: [
      'Progress along each personal gap, signed so the direction is the speaker’s own',
      'Movement opposite to that direction contributes zero',
      'A single feature is capped at 1.25 so it cannot dominate',
      'Weighted, then clamped to 0-100',
    ],
  },
} as const;

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

export type DiagramStrings = Widen<typeof diagrams>;

export default diagrams;
