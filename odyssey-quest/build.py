"""Build the self-contained offline edition. No build dependencies."""
from pathlib import Path
import base64,re
root=Path(__file__).resolve().parent
html=(root/'index.html').read_text()
html=html.replace('<body>','<body data-standalone="true">')
html=html.replace('<link rel="manifest" href="manifest.webmanifest">','')
css=(root/'style.css').read_text()
for font in (root/'fonts').glob('*.woff2'):
    css=css.replace("url('fonts/"+font.name+"')","url('data:font/woff2;base64,"+base64.b64encode(font.read_bytes()).decode()+"')")
html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+css+'</style>')
icon='data:image/svg+xml;base64,'+base64.b64encode((root/'icon.svg').read_bytes()).decode()
html=html.replace('href="icon.svg"','href="'+icon+'"').replace('src="icon.svg"','src="'+icon+'"')
for file in ['data.js','i18n.js','engine.js','app.js','expedition.js']:
    html=html.replace('<script src="'+file+'"></script>','<script>'+ (root/file).read_text().replace('</script','<\\/script')+'</script>')
for file in ['README.md','CHANGELOG.md','PRIVACY.md','versions/v1.0.0.html','versions/v2.0.1.html']:
    mime='text/html' if file.endswith('.html') else 'text/plain'
    uri='data:'+mime+';base64,'+base64.b64encode((root/file).read_bytes()).decode()
    html=html.replace('href="'+file+'"','download="'+Path(file).name+'" href="'+uri+'"')
license_text=(root/'fonts/OFL-LICENSE.txt').read_text().replace('&','&amp;').replace('<','&lt;')
html=html.replace('</main>','<details class="panel"><summary>Licențe / Licenses</summary><pre>'+license_text+'</pre></details></main>')
(root/'standalone.html').write_text(html)
print('Standalone edition:',len(html.encode()),'bytes')
