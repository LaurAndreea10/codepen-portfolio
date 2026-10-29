// Turns every insights/*.html article into a Markdown file ready to paste into
// dev.to or Hashnode, with canonical_url pointing back to the portfolio, so the
// original keeps the search ranking and the copies bring readers to the site.
//
// Run: node scripts/export-insights.mjs  →  docs/cross-post/<slug>.md
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const SITE = "https://laurandreea10.github.io/codepen-portfolio/";
const OUT = "docs/cross-post";
mkdirSync(OUT, { recursive: true });

const decode = (s) => s
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));

const absolute = (href, page) => /^(https?:|mailto:)/.test(href) ? href : new URL(href, SITE + "insights/" + page).href;

function inline(html, page) {
  return decode(html
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => `[${text}](${absolute(href, page)})`)
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, "**$2**")
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, "_$2_")
    .replace(/<code>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<br\s*\/?>/gi, "  \n")
    .replace(/<[^>]+>/g, ""))
    .replace(/[ \t]+/g, " ").trim();
}

function toMarkdown(body, page) {
  const blocks = [];
  const re = /<div class="insight-callout">([\s\S]*?)<\/div>|<h([23])[^>]*>([\s\S]*?)<\/h\2>|<p[^>]*>([\s\S]*?)<\/p>|<(ul|ol)[^>]*>([\s\S]*?)<\/\5>|<pre[^>]*>([\s\S]*?)<\/pre>/gi;
  for (const m of body.matchAll(re)) {
    if (m[1] !== undefined) blocks.push("> " + inline(m[1], page));
    else if (m[2]) blocks.push(`${"#".repeat(Number(m[2]))} ${inline(m[3], page)}`);
    else if (m[4] !== undefined) { const t = inline(m[4], page); if (t) blocks.push(t); }
    else if (m[5]) {
      const items = [...m[6].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((li, i) => `${m[5] === "ol" ? `${i + 1}.` : "-"} ${inline(li[1], page)}`);
      blocks.push(items.join("\n"));
    } else if (m[7] !== undefined) blocks.push("```\n" + decode(m[7].replace(/<[^>]+>/g, "")).trim() + "\n```");
  }
  return blocks.join("\n\n");
}

const pick = (html, re) => decode((html.match(re)?.[1] || "").replace(/<[^>]+>/g, "")).trim();
const yaml = (s) => JSON.stringify(s);

const files = readdirSync("insights").filter((f) => f.endsWith(".html")).sort();
for (const file of files) {
  const html = readFileSync(`insights/${file}`, "utf8");
  const title = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const description = pick(html, /<meta name="description" content="([^"]*)"/i);
  const tag = pick(html, /<span class="insight-tag">([\s\S]*?)<\/span>/i);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] || `${SITE}insights/${file}`;
  const start = html.indexOf('<div class="insight-body">');
  const end = html.indexOf('<div class="insight-footer">');
  if (!title || start < 0 || end < 0) { console.warn(`Skipped ${file}: unexpected layout`); continue; }
  const body = toMarkdown(html.slice(start, end), file);

  // dev.to accepts up to 4 lowercase alphanumeric tags.
  const tags = ["webdev", "frontend", tag.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, ""), "learning"]
    .filter((t, i, all) => t && all.indexOf(t) === i).slice(0, 4);

  const md = `---
title: ${yaml(title)}
published: false
description: ${yaml(description)}
tags: ${tags.join(", ")}
canonical_url: ${canonical}
---

${body}

---

_Publicat inițial pe [portofoliul meu](${canonical}), unde găsești și proiectele despre care scriu._
`;
  const slug = file.replace(/\.html$/, "");
  writeFileSync(`${OUT}/${slug}.md`, md);
  console.log(`${OUT}/${slug}.md`);
}
