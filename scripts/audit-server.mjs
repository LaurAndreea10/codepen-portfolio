import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
export async function startAuditServer({ instrumentKygo = false } = {}) {
  const root = resolve(new URL('../', import.meta.url).pathname);
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json', '.css': 'text/css' };
  const server = createServer(async (req, res) => {
    try {
      let path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
      if (!path.startsWith(root + sep)) throw Error('path');
      if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
      let body = await readFile(path);
      // Test-only access to the private game closure; never written into the shipped HTML.
      if (instrumentKygo && path === resolve(root, 'kygo-world/index.html')) body = Buffer.from(body.toString().replace('\n})();\n</script>', '\nwindow.__kygoEval = code => eval(code);\n})();\n</script>'));
      res.writeHead(200, { 'Content-Type': mime[Object.keys(mime).find(ext => path.endsWith(ext))] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(body);
    } catch { res.writeHead(404); res.end('Not found'); }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  return { baseURL: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(r => server.close(r)) };
}
