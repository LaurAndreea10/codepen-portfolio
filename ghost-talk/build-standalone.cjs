#!/usr/bin/env node
// Builds index.pen.html: one self-contained file (CSS + JS inlined) for CodePen or offline sharing.
// Usage: node ghost-talk/build-standalone.cjs   (or npm run build:standalone inside ghost-talk/)
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const read = f => fs.readFileSync(path.join(dir, f), 'utf8');
const safe = js => js.replace(/<\/script/gi, '<\\/script');

let html = read('index.html');
html = html
  .replace('<link rel="stylesheet" href="styles.css">', () => `<style>\n${read('styles.css')}\n</style>`)
  .replace('<link rel="manifest" href="manifest.webmanifest">\n', '')
  .replace('<link rel="icon" href="icon.svg" type="image/svg+xml">', () => `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(read('icon.svg').trim())}">`)
  .replace('<script src="engine.js" defer></script>', () => `<script>\n${safe(read('engine.js'))}\n</script>`)
  .replace('<script src="ghost.spec.js" defer></script>', () => `<script>\n${safe(read('ghost.spec.js'))}\n</script>`)
  .replace(/<script type="module">[\s\S]*?<\/script>/, () => {
    // One file has no ./ghosttalk.js to import, so the rule is inlined as a plain script (export keywords dropped).
    const rule = read('ghosttalk.js').replace(/^export /gm, '');
    return `<script>\n(function () {\n${safe(rule)}\nGhost.useRule(ghostTalkText);\nwindow.ghostTalk = ghostTalk;\nwindow.describeWord = describeWord;\n})();\n</script>`;
  })
  .replace('<script src="app.js" defer></script>', () => `<script>\n${safe(read('app.js'))}\n</script>`);

if (/src="(engine|app|ghost\.spec)\.js"|href="styles\.css"|type="module"/.test(html)) throw new Error('A file was not inlined.');
fs.writeFileSync(path.join(dir, 'index.pen.html'), html);
console.log(`index.pen.html written (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
