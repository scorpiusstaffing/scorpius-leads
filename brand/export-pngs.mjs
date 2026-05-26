/**
 * Scorpius Leads PNG exports — Space Grotesk all-caps wordmark
 */
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const exportsList = [
  { src: 'scorpius-leads-stacked-on-white.svg',    out: 'png/scorpius-leads-stacked-400.png', width: 400 },
  { src: 'scorpius-leads-stacked-on-white.svg',    out: 'png/scorpius-leads-stacked-1080.png', width: 1080 },
  { src: 'scorpius-leads-stacked-on-emerald.svg',  out: 'png/scorpius-leads-stacked-emerald-1080.png', width: 1080 },
  { src: 'scorpius-leads-stacked.svg',             out: 'png/scorpius-leads-stacked-transparent-1080.png', width: 1080 },
  { src: 'scorpius-leads-wordmark.svg',            out: 'png/scorpius-leads-wordmark-2000.png', width: 2000 },
  { src: 'scorpius-leads-wordmark-on-white.svg',   out: 'png/scorpius-leads-wordmark-on-white-2000.png', width: 2000 },
  { src: 'scorpius-leads-wordmark-on-emerald.svg', out: 'png/scorpius-leads-wordmark-on-emerald-2000.png', width: 2000 },
  { src: 'scorpius-leads-wordmark-light.svg',      out: 'png/scorpius-leads-wordmark-light-2000.png', width: 2000 },
  { src: 'scorpius-leads-favicon.svg',             out: 'png/favicon-32.png', width: 32 },
  { src: 'scorpius-leads-favicon.svg',             out: 'png/favicon-180.png', width: 180 },
];

function buildOgSvg() {
  const wordmark = fs.readFileSync(path.join(__dirname, 'scorpius-leads-wordmark.svg'), 'utf8');
  const m = wordmark.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/);
  const [, vb, inner] = m;
  const [, , vw, vh] = vb.split(' ').map(Number);
  const lightInner = inner
    .replace(/fill="#0F3D2E"/g, 'fill="#E8EDE9"')
    .replace(/fill="#082819"/g, 'fill="#E8EDE9"');

  const targetW = 980;
  const scale = targetW / vw;
  const scaledH = vh * scale;
  const offsetX = (1200 - targetW) / 2;
  const offsetY = (630 - scaledH) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#082819"/>
  <g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">${lightInner}</g>
  <text x="80" y="565" font-family="Space Grotesk, Inter, sans-serif" font-size="22" font-weight="500" fill="#E8EDE9" opacity="0.55" letter-spacing="4">B2B OUTBOUND · BOOKED CALLS WITH YOUR ICP</text>
</svg>`;
}

fs.mkdirSync(path.join(__dirname, 'png'), { recursive: true });

for (const e of exportsList) {
  const svg = fs.readFileSync(path.join(__dirname, e.src));
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: e.width }, background: 'rgba(0,0,0,0)' });
  fs.writeFileSync(path.join(__dirname, e.out), resvg.render().asPng());
  console.log(`✓ ${e.out}  ${e.width}px`);
}

{
  const og = buildOgSvg();
  fs.writeFileSync(path.join(__dirname, 'scorpius-leads-og.svg'), og);
  const resvg = new Resvg(og, { fitTo: { mode: 'original' } });
  fs.writeFileSync(path.join(__dirname, 'png/scorpius-leads-og-1200x630.png'), resvg.render().asPng());
  console.log('✓ png/scorpius-leads-og-1200x630.png');
}

console.log('\nDone.');
