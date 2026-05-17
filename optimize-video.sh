#!/usr/bin/env bash
# optimize-video.sh — convert și optimize video demo pentru web
# Usage: ./optimize-video.sh alpis-fusion-demo-raw.mp4
# Output: alpis-fusion-demo.mp4 + alpis-fusion-demo.webm

set -e

INPUT="${1:-alpis-fusion-demo-raw.mp4}"
BASENAME="alpis-fusion-demo"

if [ ! -f "$INPUT" ]; then
  echo "❌ Fișier inexistent: $INPUT"
  echo "Usage: ./optimize-video.sh <input.mp4>"
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "❌ FFmpeg nu e instalat. Pe Windows: winget install ffmpeg"
  exit 1
fi

echo "🎬 Procesez $INPUT..."
echo ""

# MP4 optimizat (universal)
echo "1/2 → MP4 H.264 (compatibilitate universală)..."
ffmpeg -y -i "$INPUT" \
  -vcodec libx264 -crf 28 -preset slow \
  -vf "scale=1280:-2,fps=24" \
  -an -movflags +faststart \
  "${BASENAME}.mp4"

# WebM mai mic (modern)
echo ""
echo "2/2 → WebM VP9 (mai mic, browsere moderne)..."
ffmpeg -y -i "$INPUT" \
  -c:v libvpx-vp9 -crf 35 -b:v 0 \
  -vf "scale=1280:-2,fps=24" \
  -an \
  "${BASENAME}.webm"

echo ""
echo "✅ Gata!"
echo ""
echo "Dimensiuni finale:"
ls -lh "${BASENAME}.mp4" "${BASENAME}.webm" 2>/dev/null | awk '{print "  "$NF" — "$5}'
echo ""
echo "📁 Mută fișierele în repo: codepen-portfolio/media/"
