/**
 * Scorpius Leads logo builder — Space Grotesk Bold, ALL CAPS, tight tracking
 * Different typographic register from Scorpius Staffing (Fraunces serif title case)
 * and Argushaus (Switzer sans title case). Modern SaaS / sales-ops energy.
 * Same red dot ties it to the Scorpius Search family.
 */
import opentype from 'opentype.js';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const EMERALD      = '#0F3D2E';
const EMERALD_DEEP = '#082819';
const CREAM        = '#E8EDE9';
const WHITE        = '#FFFFFF';
const RED          = '#C8362A';

const font = opentype.parse(fs.readFileSync(path.join(__dirname, 'raw/space-grotesk-700.ttf')).buffer);

// Render each glyph at origin (0,0) and emit a transform per glyph.
// opentype.js's getPath at non-zero x has occasional NaN bugs at specific
// cursor values; this avoids them entirely.
function makePath(text, fontSize, x = 0, y = 0, letterSpacing = 0) {
  const glyphs = font.stringToGlyphs(text);
  const scale = (1 / font.unitsPerEm) * fontSize;
  let cursor = x;
  const parts = [];
  for (let i = 0; i < glyphs.length; i++) {
    const g = glyphs[i];
    const p = g.getPath(0, y, fontSize);
    const data = p.toPathData(3);
    if (data) parts.push({ d: data, tx: cursor });
    cursor += g.advanceWidth * scale + letterSpacing;
  }
  return { paths: parts, advanceTo: cursor };
}

/* Render an array of glyph paths into individual <path> SVG elements
 * (avoids resvg-js bug that drops glyphs when many paths are concatenated
 * into a single d attribute). */
function pathsToSvg(paths, fill) {
  return paths.map(p => `<g transform="translate(${p.tx}, 0)"><path d="${p.d}" fill="${fill}"/></g>`).join('');
}

/* HORIZONTAL — "SCORPIUS LEADS." all caps, tight */
function buildWordmark({ fontSize = 100 }) {
  const ls = -fontSize * 0.012;        // tight tracking
  const baseline = fontSize * 0.78;
  const main = makePath('SCORPIUS LEADS', fontSize, 0, baseline, ls);
  const dot  = makePath('.', fontSize, main.advanceTo + fontSize * 0.02, baseline, ls);
  return {
    mainPaths: main.paths,
    dotPaths:  dot.paths,
    totalWidth: dot.advanceTo,
    totalHeight: fontSize
  };
}

/* STACKED — "SCORPIUS / LEADS." two lines, same caps treatment */
function buildStacked({ fontSize = 100 }) {
  const ls = -fontSize * 0.018;
  const lineGap = fontSize * 0.08;
  const baseline1 = fontSize * 0.78;
  const baseline2 = baseline1 + fontSize + lineGap;
  const line1 = makePath('SCORPIUS', fontSize, 0, baseline1, ls);
  const line2Text = makePath('LEADS', fontSize, 0, baseline2, ls);
  const dot      = makePath('.', fontSize, line2Text.advanceTo + fontSize * 0.02, baseline2, ls);
  const maxW = Math.max(line1.advanceTo, dot.advanceTo);
  const totalH = fontSize + lineGap + fontSize;
  return {
    line1Paths: line1.paths,
    line2Paths: line2Text.paths,
    dotPaths:   dot.paths,
    maxWidth: maxW,
    totalHeight: totalH
  };
}

function wrapSvg({ width, height, viewBox, bg, content }) {
  const bgRect = bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">
${bgRect}
${content}
</svg>
`;
}

const out = __dirname;

/* ============================================================
   HORIZONTAL WORDMARK
   ============================================================ */
{
  const fs0 = 100;
  const w = buildWordmark({ fontSize: fs0 });
  const pad = fs0 * 0.25;
  const W = w.totalWidth + pad * 2;
  const H = fs0 + pad * 2;
  fs.writeFileSync(path.join(out, 'scorpius-leads-wordmark.svg'),
    wrapSvg({ width: W, height: H, viewBox: `0 0 ${W} ${H}`,
      content: `<g transform="translate(${pad}, ${pad})">${pathsToSvg(w.mainPaths, EMERALD)}${pathsToSvg(w.dotPaths, RED)}</g>` }));
}
{
  const fs0 = 100;
  const w = buildWordmark({ fontSize: fs0 });
  const pad = fs0 * 0.5;
  const W = w.totalWidth + pad * 2;
  const H = fs0 + pad * 2;
  fs.writeFileSync(path.join(out, 'scorpius-leads-wordmark-on-white.svg'),
    wrapSvg({ width: W, height: H, viewBox: `0 0 ${W} ${H}`, bg: WHITE,
      content: `<g transform="translate(${pad}, ${pad})">${pathsToSvg(w.mainPaths, EMERALD)}${pathsToSvg(w.dotPaths, RED)}</g>` }));
}
{
  const fs0 = 100;
  const w = buildWordmark({ fontSize: fs0 });
  const pad = fs0 * 0.25;
  const W = w.totalWidth + pad * 2;
  const H = fs0 + pad * 2;
  fs.writeFileSync(path.join(out, 'scorpius-leads-wordmark-light.svg'),
    wrapSvg({ width: W, height: H, viewBox: `0 0 ${W} ${H}`,
      content: `<g transform="translate(${pad}, ${pad})">${pathsToSvg(w.mainPaths, CREAM)}${pathsToSvg(w.dotPaths, RED)}</g>` }));
}
{
  const fs0 = 100;
  const w = buildWordmark({ fontSize: fs0 });
  const pad = fs0 * 0.5;
  const W = w.totalWidth + pad * 2;
  const H = fs0 + pad * 2;
  fs.writeFileSync(path.join(out, 'scorpius-leads-wordmark-on-emerald.svg'),
    wrapSvg({ width: W, height: H, viewBox: `0 0 ${W} ${H}`, bg: EMERALD_DEEP,
      content: `<g transform="translate(${pad}, ${pad})">${pathsToSvg(w.mainPaths, CREAM)}${pathsToSvg(w.dotPaths, RED)}</g>` }));
}

/* ============================================================
   STACKED WORDMARK (square format)
   ============================================================ */
{
  const fs0 = 130;
  const s = buildStacked({ fontSize: fs0 });
  const side = Math.max(s.maxWidth, s.totalHeight) + fs0 * 0.5;
  const xOffset = (side - s.maxWidth) / 2;
  const yOffset = (side - s.totalHeight) / 2;
  fs.writeFileSync(path.join(out, 'scorpius-leads-stacked.svg'),
    wrapSvg({ width: side, height: side, viewBox: `0 0 ${side} ${side}`,
      content: `<g transform="translate(${xOffset}, ${yOffset})">${pathsToSvg(s.line1Paths, EMERALD)}${pathsToSvg(s.line2Paths, EMERALD)}${pathsToSvg(s.dotPaths, RED)}</g>` }));
}
{
  const fs0 = 130;
  const s = buildStacked({ fontSize: fs0 });
  const side = Math.max(s.maxWidth, s.totalHeight) + fs0 * 0.8;
  const xOffset = (side - s.maxWidth) / 2;
  const yOffset = (side - s.totalHeight) / 2;
  fs.writeFileSync(path.join(out, 'scorpius-leads-stacked-on-white.svg'),
    wrapSvg({ width: side, height: side, viewBox: `0 0 ${side} ${side}`, bg: WHITE,
      content: `<g transform="translate(${xOffset}, ${yOffset})">${pathsToSvg(s.line1Paths, EMERALD)}${pathsToSvg(s.line2Paths, EMERALD)}${pathsToSvg(s.dotPaths, RED)}</g>` }));
}
{
  const fs0 = 130;
  const s = buildStacked({ fontSize: fs0 });
  const side = Math.max(s.maxWidth, s.totalHeight) + fs0 * 0.8;
  const xOffset = (side - s.maxWidth) / 2;
  const yOffset = (side - s.totalHeight) / 2;
  fs.writeFileSync(path.join(out, 'scorpius-leads-stacked-on-emerald.svg'),
    wrapSvg({ width: side, height: side, viewBox: `0 0 ${side} ${side}`, bg: EMERALD_DEEP,
      content: `<g transform="translate(${xOffset}, ${yOffset})">${pathsToSvg(s.line1Paths, CREAM)}${pathsToSvg(s.line2Paths, CREAM)}${pathsToSvg(s.dotPaths, RED)}</g>` }));
}

/* ============================================================
   FAVICON — "SL" all caps + red dot
   ============================================================ */
{
  const fs0 = 22;
  const baseline = fs0 * 0.78;
  const mainP = makePath('SL', fs0, 0, baseline, -fs0 * 0.02);
  const dotP  = makePath('.', fs0, mainP.advanceTo, baseline, 0);
  const side = 32;
  const xOffset = (side - dotP.advanceTo) / 2;
  const yOffset = (side - fs0) / 2 + 1;
  fs.writeFileSync(path.join(out, 'scorpius-leads-favicon.svg'),
    wrapSvg({ width: side, height: side, viewBox: `0 0 ${side} ${side}`, bg: EMERALD_DEEP,
      content: `<g transform="translate(${xOffset}, ${yOffset})">${pathsToSvg(mainP.paths, CREAM)}${pathsToSvg(dotP.paths, RED)}</g>` }));
}

console.log('Scorpius Leads brand SVGs generated (Space Grotesk Bold all-caps):');
fs.readdirSync(out).filter(f => f.endsWith('.svg')).forEach(f => console.log('  ' + f));
