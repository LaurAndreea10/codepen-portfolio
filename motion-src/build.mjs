// Builds the portfolio motion layer into ../assets/motion/ (served by GitHub Pages, no CDN needed).
//   npm install && npm run build
import * as esbuild from 'esbuild';
import { rmSync } from 'node:fs';

const watch = process.argv.includes('--watch');

const options = {
  entryPoints: { 'portfolio-motion': 'src/core.js' },
  outdir: '../assets/motion',
  bundle: true,
  splitting: true, // React Bits islands load as a separate, idle-time chunk
  format: 'esm',
  minify: true,
  target: ['es2020', 'safari15'],
  jsx: 'automatic',
  loader: { '.js': 'jsx' },
  chunkNames: 'chunks/[name]-[hash]',
  legalComments: 'linked',
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'info'
};

rmSync('../assets/motion', { recursive: true, force: true }); // no stale hashed chunks

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
