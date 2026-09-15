#!/usr/bin/env bash
#
# encode-media.sh — build the website's image and video derivatives.
#
# Reads from ../source material/ (READ ONLY, never written to) and writes
# only into website/src/assets/ and website/public/video/.
#
# Every crop below is deliberate. Two reasons a crop exists:
#   editorial  — phone photos are full of irrelevant workshop background
#   privacy    — a named individual, a company logo, a drawing title block
#                or a LAN address must not be legible in the published image
#
# Re-run after changing a crop. Safe to run repeatedly.
#
#   bash scripts/encode-media.sh

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB="$(dirname "$HERE")"
SRC="$(dirname "$WEB")/source material"
IMG="$WEB/src/assets/projects/writing-robot"
VID="$WEB/public/video"

mkdir -p "$IMG" "$VID"

P1="$SRC/Fanuc Writer Project"
INT="$SRC/internship"

# JPEG masters at 2400px max. astro:assets takes it from here and emits
# AVIF/WebP at the widths actually displayed.
master() { convert "$1" -resize '2400x2400>' -quality 92 -strip "$2"; }

echo "→ stills"

# The written result. The source photograph rests on a Neksus production
# drawing whose title block carries a named draughtsman, part codes and dates.
# The crop keeps the handwriting and removes the title block entirely.
convert "$P1/WhatsApp Image 2026-08-21 at 15.04.00.jpeg" \
  -crop 1095x450+11+541 +repage -quality 92 -strip "$IMG/written-result.jpg"

# RoboGuide: the generated path loaded into the cell, all four lines visible.
# Cropped to the application window — no desktop, no taskbar, no room.
convert "$P1/IMG_0540.png" -crop 3024x1740+0+730 +repage -resize '2400x2400>' \
  -quality 92 -strip "$IMG/roboguide-cell.jpg"

# RoboGuide beside the teach-pendant program list, where the generator's own
# stroke comments and the CNT10 / FINE termination types are legible.
# Cropped above the status bar, which showed a LAN address.
convert "$P1/IMG_0531.png" -crop 3024x1600+0+277 +repage -resize '2400x2400>' \
  -quality 92 -strip "$IMG/roboguide-program.jpg"

# Workshop context. The photo was taken looking upward, so an earlier crop that
# stopped short of the machines gave most of the frame to roof structure. This
# one starts at y 900 and runs to 3200, which reaches the gantry, the vacuum
# tooling, the shelving and the floor — the working environment rather than the
# ceiling.
#
# The company wordmark is visible twice in this crop, on the gantry and on the
# orange base plate. It is centred, so no horizontal crop removes it. Hazar
# reviewed this exact framing and approved publishing it, which supersedes the
# earlier crop's exclusion of the logo on unconfirmed-consent grounds.
convert "$INT/IMG_0599.png" -crop 2644x2300+380+900 +repage -resize '2400x2400>' \
  -quality 92 -strip "$IMG/workshop-cell.jpg"

# The generator's own SVG preview for the phrase that was written, as rendered
# during the project. Used beside the photograph as planned-path vs result.
convert "$P1/FC3525BC-6A83-47D2-8C43-E75A78EFB851.png" \
  -bordercolor white -border 24 -quality 92 -strip "$IMG/generated-preview.jpg"

echo "→ video"

DEMO_SRC="$P1/WhatsApp Video 2026-08-21 at 15.02.42.mp4"

# Source is 464x832 portrait at 60 fps, 3 min 31 s. Never upscaled.
# Window chosen where the pen is in continuous contact and the framing is
# steady. Audio is workshop noise and carries no information, so both
# derivatives are silent and the caption says so.
LOOP_START=101; LOOP_LEN=7
DEMO_START=100; DEMO_LEN=26

ffmpeg -v error -ss $LOOP_START -t $LOOP_LEN -i "$DEMO_SRC" -an \
  -vf "fps=30,scale=464:-2" \
  -c:v libx264 -profile:v high -crf 26 -preset slow -pix_fmt yuv420p \
  -movflags +faststart -y "$VID/writing-loop.mp4"

ffmpeg -v error -ss $LOOP_START -t $LOOP_LEN -i "$DEMO_SRC" -an \
  -vf "fps=30,scale=464:-2" -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 \
  -y "$VID/writing-loop.webm"

ffmpeg -v error -ss $DEMO_START -t $DEMO_LEN -i "$DEMO_SRC" -an \
  -vf "fps=30,scale=464:-2" \
  -c:v libx264 -profile:v high -crf 24 -preset slow -pix_fmt yuv420p \
  -movflags +faststart -y "$VID/writing-demo.mp4"

ffmpeg -v error -ss $LOOP_START -i "$DEMO_SRC" -frames:v 1 \
  -vf "scale=464:-2" -q:v 3 -y "$VID/writing-poster.jpg"

echo "→ done"
ls -la "$IMG" "$VID"

# ---------------------------------------------------------------------------
# Project 3 — İzmir water
# ---------------------------------------------------------------------------

IZM="$WEB/src/assets/projects/izmir-water"
P3="$SRC/İzmir Water Amount"
mkdir -p "$IZM"

echo "→ izmir water"

# The one approved photograph: presenting the internship work, his own slide on
# the screen behind him. Cropped away from the left and lower edges, where
# other people are partly in frame — their consent is not on record.
# Two framings of the same photograph because they are used on different pages:
# a 16:10 card crop (the homepage card covers to 16:10 and would otherwise cut
# the screen out) and a taller crop for the case-study hero.
convert "$P3/5a3ed57f-bc5c-4385-8d35-6b16206e96d8.png" \
  -crop 774x484+150+690 +repage -quality 92 -strip "$IZM/presentation-card.jpg"

convert "$P3/5a3ed57f-bc5c-4385-8d35-6b16206e96d8.png" \
  -crop 774x860+150+640 +repage -quality 92 -strip "$IZM/presentation.jpg"

# ---------------------------------------------------------------------------
# Project 4 — F1 race prediction
# ---------------------------------------------------------------------------

F1="$WEB/src/assets/projects/f1-prediction"
P4="$SRC/F1 score Guesser/media"
mkdir -p "$F1"

echo "→ f1 prediction"

# Stills from the two screen recordings of the running Streamlit app.
#
# Every crop starts at +116+180 and stops short of the window bottom. That is a
# privacy crop, not an editorial one: the full recording shows the browser tab
# bar, a bookmark bar, a VPN indicator, a sidebar of personal app icons and the
# titles of unrelated tabs. None of that belongs on a public page. The bottom is
# trimmed to drop the macOS screen-capture toolbar.
REC_A="$P4/Screen Recording 2026-09-10 at 22.30.08.mov"
REC_B="$P4/Screen Recording 2026-09-10 at 22.35.30.mov"
SHOT="crop=2464:1500:116:180"

still() { ffmpeg -v error -ss "$2" -i "$1" -frames:v 1 -vf "$SHOT" -q:v 2 "$3" -y; }

# The application as it opens: the training and prediction seasons it derived
# from the data, the Grand Prix selector, and the start of the grid.
still "$REC_B" 54.0 "$F1/app-overview.jpg"

# A grid entered by hand, one driver per starting position.
still "$REC_B" 6.0 "$F1/grid-entry.jpg"

# The predicted finishing order the model returns for that grid.
still "$REC_B" 30.0 "$F1/predicted-order.jpg"

# The feature table behind the prediction: the four rolling form features, the
# ranking score, and statusId — empty at prediction time, which is the honest
# caveat the case study states.
still "$REC_B" 44.0 "$F1/feature-debug.jpg"

# ---------------------------------------------------------------------------
# Visual asset package v3
#
# reference/portfolio-visuals/ is READ ONLY. Everything below copies out of
# it; nothing is written back. Charts and diagrams ship as the package's own
# SVGs — they are vector, they are small, and each family has a light and a
# dark file because their backgrounds are opaque. Photographs and generated
# concepts are re-encoded as JPEG masters; astro:assets takes it from there.
# ---------------------------------------------------------------------------

V3="$(dirname "$WEB")/reference/portfolio-visuals/assets"

if [ -d "$V3" ]; then
  echo "→ visual package v3"

  IZM="$WEB/src/assets/projects/izmir-water"
  F1D="$WEB/src/assets/projects/f1-prediction"
  PRO="$WEB/src/assets/projects/prosodic-vr"
  mkdir -p "$IZM" "$F1D" "$PRO"

  # İzmir — Tahtalı Dam. CC BY-SA 4.0, Andyduffraine / Wikimedia Commons.
  # Copied at its native 800x531: the source has nothing larger and upscaling
  # it would be inventing detail. Used at column width, never full bleed.
  convert "$V3/izmir/tahtali-dam.jpg" -quality 92 -strip "$IZM/tahtali-dam.jpg"

  # İzmir — generated rainfall concept, captioned as an illustration.
  convert "$V3/izmir/reservoir-rainfall-concept.png" -resize '1600x1600>' \
    -quality 88 -strip "$IZM/rainfall-concept.jpg"

  cp "$V3/izmir/reservoir-rainfall-timeline-light.svg" "$IZM/timeline-light.svg"
  cp "$V3/izmir/reservoir-rainfall-timeline-dark.svg"  "$IZM/timeline-dark.svg"
  cp "$V3/izmir/forecasting-pipeline-light.svg"        "$IZM/pipeline-light.svg"
  cp "$V3/izmir/forecasting-pipeline-dark.svg"         "$IZM/pipeline-dark.svg"
  cp "$V3/izmir/reported-model-comparison-light.svg"   "$IZM/model-comparison-light.svg"
  cp "$V3/izmir/reported-model-comparison-dark.svg"    "$IZM/model-comparison-dark.svg"

  # F1 — Jerry Wei / Unsplash, retained unchanged apart from re-encoding.
  convert "$V3/f1/approved-motion-blur.jpg" -resize '2400x2400>' \
    -quality 90 -strip "$F1D/racing-motion-blur.jpg"

  cp "$V3/f1/dataset-coverage-light.svg"            "$F1D/dataset-coverage-light.svg"
  cp "$V3/f1/dataset-coverage-dark.svg"             "$F1D/dataset-coverage-dark.svg"
  cp "$V3/f1/learning-to-rank-pipeline-light.svg"   "$F1D/ranking-pipeline-light.svg"
  cp "$V3/f1/learning-to-rank-pipeline-dark.svg"    "$F1D/ranking-pipeline-dark.svg"
  cp "$V3/f1/temporal-feature-logic-light.svg"      "$F1D/temporal-features-light.svg"
  cp "$V3/f1/temporal-feature-logic-dark.svg"       "$F1D/temporal-features-dark.svg"

  # Prosodic — the square Quest/Unity collage, kept square. Cropping it to a
  # wide card would remove the headset panel, which is the evidence.
  convert "$V3/prosodic/quest-unity-project-collage.png" -resize '1600x1600>' \
    -quality 88 -strip "$PRO/quest-unity-collage.jpg"

  cp "$V3/prosodic/recorded-speech-features-light.svg" "$PRO/speech-features-light.svg"
  cp "$V3/prosodic/recorded-speech-features-dark.svg"  "$PRO/speech-features-dark.svg"

  # ---- homepage card covers -------------------------------------------------
  # The card frame covers to 16:10, so each cover is cropped to that ratio here
  # rather than letting object-fit decide what to lose.

  # İzmir: the dam at 16:10. The source is only 800px wide and there is no
  # larger one, so the crop takes the full width and trims the sky.
  convert "$V3/izmir/tahtali-dam.jpg" -crop 800x500+0+18 +repage \
    -quality 92 -strip "$IZM/tahtali-card.jpg"

  # Prosodic: the approved VR concept illustration, 3:2 in the package, trimmed
  # to the card's 16:10 by taking the 64px off the top — empty wall, where the
  # bottom carries the waveform and the frame is already tight under it. It is a
  # generated concept and is labelled as one on the card; the real Quest/Unity
  # photograph stays inside the case study as the project's evidence.
  convert "$V3/prosodic/03-prosodic-vr-concept.png" -crop 1536x960+0+64 +repage \
    -quality 88 -strip "$PRO/vr-concept-card.jpg"
fi

# ---------------------------------------------------------------------------
# Ongoing — Low Cost Industrial Robot Arm concept
#
# The v2 concept, copied verbatim: a square RGBA render on a transparent ground,
# selected by hand as the intended image. It is NOT cropped to the card's 16:10 —
# the arm fills its own square frame, so covering to a wide box would cut the
# wrist off one end and the base off the other. Card and page both render it with
# object-fit: contain, letting the transparent ground show whichever theme
# surface sits behind it.
#
# Taken byte-for-byte rather than re-encoded, so what ships is exactly the file
# that was chosen. astro:assets emits the optimised webp/avif for delivery.
# ---------------------------------------------------------------------------
ARM_SRC="$V3/ongoing/low-cost-industrial-robot-arm-concept-v2.png"
ARM_OUT="$WEB/src/assets/projects/low-cost-robot-arm"

if [ -f "$ARM_SRC" ]; then
  mkdir -p "$ARM_OUT"
  cp "$ARM_SRC" "$ARM_OUT/arm-concept.png"
fi

# ---------------------------------------------------------------------------
# Ongoing — Local-First Engineering Assistant concept
#
# The master is 1586 x 992 with the subject rendered on pure black and NO alpha
# channel. The site needs alpha: the page background has to show through in both
# themes, and a flattened black rectangle on the light theme is exactly what this
# asset must not be.
#
# The subject is an additive glow on black, so the alpha is recoverable rather
# than guessed. Black means "nothing here", so the per-pixel maximum channel IS
# the coverage; dividing the colour through by it un-premultiplies back to the
# straight alpha a browser composites with. Roughly 59% of the frame comes out
# fully transparent, and on a dark surface the result is indistinguishable from
# the master.
#
# PNG, never JPEG — JPEG has no alpha, and flattening is the bug this step
# exists to avoid.
# ---------------------------------------------------------------------------
LFA_SRC="$V3/ongoing/local-first-engineering-assistant-concept.png"
LFA_OUT="$WEB/src/assets/projects/local-first-assistant"

if [ -f "$LFA_SRC" ]; then
  mkdir -p "$LFA_OUT"
  python3 - "$LFA_SRC" "$LFA_OUT/assistant-concept.png" <<'PYEOF'
import sys
from PIL import Image
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
a = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255.0
alpha = a.max(axis=2)
rgb = np.clip(a / np.maximum(alpha, 1e-4)[..., None], 0.0, 1.0)
out = np.concatenate([rgb, alpha[..., None]], axis=2)
Image.fromarray((out * 255).round().astype(np.uint8), "RGBA").save(dst, optimize=True)
PYEOF
fi
