#!/bin/bash
# encode-demos.sh — comprimă clipuri demo la <1MB fiecare (când este posibil)
# Usage: ./encode-demos.sh

set -e

declare -a clips=(
  "alpis-fusion-raw.mp4:alpis-fusion-demo"
  "clientflow-raw.mp4:clientflow-demo"
  "impact-path-raw.mp4:impact-path-demo"
)

mkdir -p output

for pair in "${clips[@]}"; do
  input="${pair%%:*}"
  output="${pair##*:}"

  if [[ ! -f "$input" ]]; then
    echo "⚠ Skipping $input (not found)"
    continue
  fi

  echo ""
  echo "🎬 Processing: $input → $output.{mp4,webm}"

  ffmpeg -y -i "$input" \
    -c:v libx264 -crf 30 -preset slow \
    -vf "scale=1280:-2,fps=24" \
    -an -movflags +faststart \
    -pix_fmt yuv420p \
    "output/${output}.mp4"

  ffmpeg -y -i "$input" \
    -c:v libvpx-vp9 -crf 36 -b:v 0 \
    -vf "scale=1280:-2,fps=24" \
    -an \
    "output/${output}.webm"

  ffmpeg -y -i "$input" \
    -ss 00:00:00.5 -vframes 1 \
    -vf "scale=1280:-2" \
    -q:v 3 \
    "output/${output}-poster.jpg"

  ffmpeg -y -i "output/${output}-poster.jpg" \
    -c:v libwebp -quality 80 \
    "output/${output}-poster.webp"

  rm "output/${output}-poster.jpg"

  mp4_size=$(du -h "output/${output}.mp4" | cut -f1)
  webm_size=$(du -h "output/${output}.webm" | cut -f1)
  poster_size=$(du -h "output/${output}-poster.webp" | cut -f1)

  echo "  ✓ MP4:    $mp4_size"
  echo "  ✓ WebM:   $webm_size"
  echo "  ✓ Poster: $poster_size"

  mp4_bytes=$(stat -c%s "output/${output}.mp4" 2>/dev/null || stat -f%z "output/${output}.mp4")
  if [[ $mp4_bytes -gt 1048576 ]]; then
    echo "  ⚠ MP4 peste 1MB — crește CRF (31-33) sau scurtează clipul"
  fi
done

echo ""
echo "✅ Done. Fișiere finale în ./output/"
echo ""
echo "Copiază-le în repo la: assets/"
