import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { gzipSync } from "node:zlib";
const root = process.cwd(),
  port = Number(process.env.LHCI_SERVER_PORT || 8765),
  cache = new Map();
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".mjs": "text/javascript",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
};
const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (path.endsWith("/")) path += "index.html";
    const file = resolve(root, "." + path);
    if (!file.startsWith(root + "/")) {
      res.writeHead(403).end();
      return;
    }
    const zipped =
        /\b(?:html|css|js|mjs|json|svg|webmanifest)$/.test(
          extname(file).slice(1),
        ) && /gzip/.test(req.headers["accept-encoding"] || ""),
      key = file + (zipped ? ":gzip" : "");
    let body = cache.get(key);
    if (!body) {
      body = await readFile(file);
      if (zipped) body = gzipSync(body);
      cache.set(key, body);
    }
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] || "application/octet-stream",
      "Content-Length": body.length,
      Vary: "Accept-Encoding",
      ...(zipped ? { "Content-Encoding": "gzip" } : {}),
    });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Listening on http://127.0.0.1:${port}`),
);
