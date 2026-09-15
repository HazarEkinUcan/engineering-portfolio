/**
 * Diagrammtexte, Deutsch.
 *
 * Quelldatei ist `en.ts`; diese Datei wird dagegen typisiert.
 *
 * Batch 2 ist übersetzt: die Diagramme des Writing Robot (Erzeugungspipeline,
 * Zustandsautomat der Stiftbewegung, mechanische Nachgiebigkeit) und die von
 * Prosodic VR (persönliche Kalibrierung, Systemarchitektur, Qualitätsprüfungen).
 *
 * Zahlen, Einheiten und technische Bezeichner stehen nicht hier: Geschwindigkeiten,
 * Höhen, Frequenzen, FINE, CNT10, TRAVEL, PEN_DOWN, /PROG und der Rest liegen in
 * den Komponenten. Ein Diagramm zu übersetzen kann keinen Wert darin ändern.
 */
import type { DiagramStrings } from './en';

const de: DiagramStrings = {
  pipeline: {
    label: 'Diagramm: vom Text zum Bewegungsprogramm',
    caption:
      'Eine Python-Datei ohne Fremdbibliotheken erzeugt aus Text ein FANUC-Bewegungsprogramm. Die Koordinaten werden vor dem Export geprüft. Liegt eine außerhalb des Papierbereichs, bricht das Programm ab, bevor sie den Roboter erreicht. Pro Durchlauf entstehen drei Dateien. Die SVG-Vorschau dient dazu, die Bahn vor dem Einsatz zu prüfen.',
    outputsLabel: 'Ausgaben',
    stages: [
      { key: 'Eingabe', title: 'Text', note: 'A-Z, a-z, 0-9, türkische Buchstaben, Satzzeichen' },
      {
        key: 'Schrift',
        title: 'Polylinien je Strich',
        note: 'Einheitsbox, y=0 Versalhöhe, y=1 Grundlinie',
      },
      {
        key: 'Layout',
        title: 'Striche in Millimetern',
        note: 'Textposition, Abstände, Zeilenumbrüche',
      },
      {
        key: 'Auto-Fit',
        title: 'Größte Höhe, die passt',
        note: 'Binärsuche, Abbruch unter 3 mm',
      },
      {
        key: 'Punkte',
        title: 'Geordnete Roboterpunkte',
        note: 'TRAVEL · PEN_DOWN · DRAW · PEN_UP',
      },
      {
        key: 'Prüfung',
        title: 'Prüfung des Arbeitsbereichs',
        note: 'bei Grenzverletzung Fehler statt Koordinatenkorrektur',
      },
    ],
    outputNotes: [
      'wird geprüft, bevor irgendetwas den Roboter erreicht',
      'Punktliste mit Bewegungsart und Geschwindigkeit',
      '/PROG /ATTR /APPL /MN /POS /END',
    ],
  },

  penMotion: {
    label: 'Diagramm: Zustandsautomat der Stiftbewegung',
    caption:
      'Jeder Strich durchläuft dieselben vier Zustände. Die Punkte, an denen der Stift aufsetzt und abhebt, werden mit FINE-Terminierung ausgegeben, denn dort muss die Spitze die vorgegebene Position exakt erreichen. Die Eckpunkte dazwischen nutzen CNT10, damit die Steuerung die Ecken verschleift und die Linie sauber bleibt. Sichere Höhe, Schreibhöhe und beide Geschwindigkeiten sind die Voreinstellungen des Generators.',
    plotAlt:
      'Höhenprofil: Fahrt auf sicherer Höhe, Absenken, Zeichnen entlang der Oberfläche, dann wieder Anheben auf sichere Höhe.',
    safe: 'sicher',
    paper: 'Papier',
    states: [
      { name: 'Fahrt', desc: 'Über den ersten Punkt des nächsten Strichs fahren' },
      { name: 'Stift ab', desc: 'Auf die Schreibebene absenken' },
      { name: 'Zeichnen', desc: 'Die Eckpunkte des Strichs nacheinander anfahren' },
      { name: 'Stift hoch', desc: 'Vor dem nächsten Strich vom Papier abheben' },
    ],
  },

  compliance: {
    label: 'Diagramm: mechanische Nachgiebigkeit',
    caption:
      'Bei einem starren Halter hängt die Kontaktkraft davon ab, wie weit die Spitze in die Oberfläche hineingefahren wird. Bei zu wenig Zustellung verschwindet die Linie, bei zu viel steigt die Belastung schnell. Eine Feder im Halter gleicht dieselben Höhenabweichungen aus und begrenzt dadurch die Änderung der Kontaktkraft. Kleine Kalibrierfehler und Unebenheiten fallen dann weniger ins Gewicht. Die Kurven zeigen den Mechanismus. Es wurde keine Kraft gemessen.',
    rigidTitle: 'Starrer Halter',
    rigidAlt:
      'Bei einem starren Halter steigt die Kontaktkraft schon bei kleinen Höhenfehlern stark an. Zwischen fehlender Linie und zu hoher Belastung liegt nur ein schmaler Bereich.',
    rigidLegend:
      'Nur in einem schmalen Bereich der Höhenabweichung entsteht eine saubere Linie. Außerhalb setzt die Linie aus oder der Stift drückt zu stark auf.',
    sprungTitle: 'Gefederter Halter',
    sprungAlt:
      'Mit einer Feder im Halter bleibt die Kontaktkraft auch bei deutlich größeren Höhenabweichungen im brauchbaren Bereich.',
    sprungLegend:
      'Die Feder fängt dieselbe Schwankung ab, das brauchbare Band wird also breit genug, dass der Kalibrierfehler nicht mehr entscheidend ist.',
    axisForce: 'Kontaktkraft',
    axisError: 'Höhenfehler',
  },

  calibration: {
    label: 'Diagramm: persönliche Kalibrierung',
    caption:
      'Die ruhige Baseline und die deutlich dringlicher gesprochene Upperline bilden die persönliche Skala. Der Score beschreibt die Veränderung zwischen diesen Referenzen statt einen absoluten Pegel. Die beiden Personen oben haben unterschiedliche Tonhöhen und erhalten dennoch denselben Score. Die dritte Achse zeigt einen negativen Abstand: Liegt die Upperline bei einem Merkmal unter der Baseline, läuft die Skala in die andere Richtung. Die Werte dienen nur dazu, das Verfahren zu erklären. Es sind keine Messungen.',
    baseline: 'Baseline',
    upperline: 'Upperline',
    speakerA: 'Sprecher A',
    speakerANote: 'lauter, höhere Stimmlage',
    speakerB: 'Sprecher B',
    speakerBNote: 'leiser, tiefere Stimmlage',
    signed: 'Abstand mit Vorzeichen',
    signedNote: 'bei Dringlichkeit langsamer',
  },

  calibrationMini: {
    speakerA: 'Sprecher A',
    speakerB: 'Sprecher B',
    legend: 'Baseline → Upperline · gleicher Score, andere Stimmen',
  },

  architecture: {
    label: 'Diagramm: Systemarchitektur',
    caption:
      'Zwei Schichten und eine Brücke. Die VR-Seite kümmert sich um Interaktion und Anzeige, die gesamte Analyse bleibt in Python. Damit müssen Audiobibliotheken nicht in C# nachgebaut werden und es gibt genau eine maßgebliche Umsetzung der Messung. Die Analyseschritte werden bei jeder Aufnahme nacheinander ausgeführt.',
    vrLayer: 'VR-Schicht',
    headsetNote: 'Quest Link · Controller-Taste',
    sceneName: 'Unity-Szene',
    sceneNote: 'Interaktion und Ergebnispanel',
    engineLayer: 'Python-Analyse-Engine',
    engineFoot: 'Läuft auch ohne angeschlossenes Headset',
    stages: [
      'Aufnahme 16 kHz mono',
      'Transkription · Faster-Whisper',
      'Prosodische Merkmale extrahieren',
      'Qualitätsprüfungen',
      'Persönliche Kalibrierung',
      'Score 0-100',
    ],
  },

  qualityGate: {
    label: 'Diagramm: Scoring und Qualitätsprüfungen',
    caption:
      'Vor der Score-Berechnung stehen vier Prüfungen. Für jede ist festgelegt, was bei einem Problem passiert. Das System gibt lieber kein Ergebnis aus als eine Zahl ohne belastbare Grundlage. Ein Merkmal auszuschließen, eine Kalibrierung abzulehnen oder eine Referenzaufnahme zu wiederholen ist dabei normal.',
    passLabel: 'Wenn alle Prüfungen bestanden sind',
    gates: [
      {
        check: 'Aufnahme brauchbar?',
        detail: 'Clipping bei Spitze ≥ 0.99, zu leise unter 0.02, stimmhafte Frames unter 20%',
        exit: 'Warnen und die Aufnahme erneut anfordern',
      },
      {
        check: 'Kalibriersatz gesprochen?',
        detail: 'Transkript wird mit dem erwarteten Satz verglichen',
        exit: 'Referenzaufnahme wiederholen',
      },
      {
        check: 'Unterscheidet sich das Merkmal genug?',
        detail: 'Baseline und Upperline müssen sich um die Mindestspanne des Merkmals unterscheiden',
        exit: 'Das Merkmal aus dem Scoring nehmen',
      },
      {
        check: 'Bleibt genug vom Profil übrig?',
        detail: 'Mindestens zwei Merkmale mit einem Gesamtgewicht von mindestens 0.40',
        exit: 'Die Kalibrierung ablehnen',
      },
    ],
    scoring: [
      'Veränderung innerhalb des persönlichen Bereichs, mit der bei dieser Person gemessenen Richtung',
      'Bewegung entgegen dieser Richtung trägt null bei',
      'Ein einzelnes Merkmal ist bei 1.25 gedeckelt und kann so nicht dominieren',
      'Gewichtet, dann auf 0-100 begrenzt',
    ],
  },
};

export default de;
