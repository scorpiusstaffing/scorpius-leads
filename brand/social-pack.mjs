/**
 * Social media pack generator — Scorpius Leads
 * Deep emerald background + cream wordmark + red accent.
 * Subtle dot-grid pattern echoes the website hero. Content on the right
 * (LinkedIn profile-pic safe). Modern B2B / sales-ops tone, distinct from
 * the cream editorial pack used by Scorpius Staffing and Argushaus.
 */
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const EMERALD      = '#0F3D2E';
const EMERALD_DEEP = '#082819';
const EMERALD_SOFT = '#1F5942';
const CREAM        = '#E8EDE9';
const RED          = '#C8362A';
const MUTED        = '#5A6B62';

const TAGLINE     = 'BOOKED CALLS WITH YOUR ICP';
const DIRECTORY   = 'EUROPE    ·    NORTH AMERICA    ·    ASIA    ·    AUSTRALIA';
const HEADER_TAG  = 'B2B OUTBOUND / PIPELINE OPS';

// Use the light-cream wordmark variant since the background is dark emerald
const wordmarkSvg = fs.readFileSync(path.join(__dirname, 'scorpius-leads-wordmark-light.svg'), 'utf8');
const m = wordmarkSvg.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/);
const [, vb, innerOriginal] = m;
const [, , vw, vh] = vb.split(' ').map(Number);

/* Banner — emerald gradient + dot-grid, wordmark center-right */
function banner({ width, height, wordmarkW, centerX, taglineSize, headerSize, showDirectory = true, showFooter = true, showHeader = true }) {
  const scale = wordmarkW / vw;
  const wordmarkH = vh * scale;
  const tagSize = taglineSize || Math.max(14, Math.round(width / 80));
  const hdrSize = headerSize  || Math.max(11, Math.round(width / 130));
  const ftrSize = Math.max(10, Math.round(width / 140));

  const wmX = centerX - wordmarkW / 2;
  const wmY = (height - wordmarkH) / 2 - tagSize * 0.4;
  const tagY = wmY + wordmarkH + tagSize * 2.0;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${EMERALD_DEEP}"/>
      <stop offset="60%" stop-color="${EMERALD}"/>
      <stop offset="100%" stop-color="${EMERALD}"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${CREAM}" opacity="0.10"/>
    </pattern>
  </defs>`;
  svg += `<rect width="${width}" height="${height}" fill="url(#bg)"/>`;
  svg += `<rect width="${width}" height="${height}" fill="url(#dots)"/>`;

  // Wordmark (cream version on dark)
  svg += `<g transform="translate(${wmX}, ${wmY}) scale(${scale})">${innerOriginal}</g>`;

  // Tagline (Space Grotesk-styled caps via Inter fallback in SVG text)
  svg += `<text x="${centerX}" y="${tagY}" font-family="Space Grotesk, Inter, sans-serif" font-size="${tagSize}" font-weight="600" fill="${CREAM}" opacity="0.7" letter-spacing="5" text-anchor="middle">${TAGLINE}</text>`;

  // Top-right header
  if (showHeader) {
    const hdrX = width - Math.round(width * 0.025);
    const hdrY = Math.round(height * 0.22);
    svg += `<text x="${hdrX}" y="${hdrY}" font-family="JetBrains Mono, Menlo, monospace" font-size="${hdrSize}" font-weight="500" fill="${CREAM}" letter-spacing="2.5" opacity="0.7" text-anchor="end">${HEADER_TAG}</text>`;
  }

  // Bottom directory (markets)
  if (showDirectory) {
    const dirY = height - Math.round(height * 0.13);
    const dirSize = Math.max(11, Math.round(width / 140));
    svg += `<text x="${centerX}" y="${dirY}" font-family="JetBrains Mono, Menlo, monospace" font-size="${dirSize}" font-weight="500" fill="${CREAM}" opacity="0.6" letter-spacing="2" text-anchor="middle">${DIRECTORY}</text>`;
  }

  // Footer (URL)
  if (showFooter) {
    const ftrX = width - Math.round(width * 0.025);
    const ftrY = height - Math.round(height * 0.13);
    svg += `<text x="${ftrX}" y="${ftrY}" font-family="JetBrains Mono, Menlo, monospace" font-size="${ftrSize}" font-weight="400" fill="${CREAM}" opacity="0.5" letter-spacing="1.5" text-anchor="end">SCORPIUSLEADS.COM</text>`;
  }

  svg += '</svg>';
  return svg;
}

/* Centered formats (IG, YouTube) */
function centered({ width, height, wordmarkW, taglineSize }) {
  const scale = wordmarkW / vw;
  const wordmarkH = vh * scale;
  const tagSize = taglineSize || Math.max(18, Math.round(width / 60));
  const subS    = Math.max(12, Math.round(width / 90));

  const wmX = (width - wordmarkW) / 2;
  const wmY = (height - wordmarkH) / 2 - tagSize * 0.4;
  const tagY = wmY + wordmarkH + tagSize * 1.8;
  const dirY = tagY + subS * 2.4;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${EMERALD_DEEP}"/>
      <stop offset="100%" stop-color="${EMERALD}"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${CREAM}" opacity="0.10"/>
    </pattern>
  </defs>`;
  svg += `<rect width="${width}" height="${height}" fill="url(#bg)"/>`;
  svg += `<rect width="${width}" height="${height}" fill="url(#dots)"/>`;

  // Top centered header
  const hdrSize = Math.max(11, Math.round(width / 90));
  svg += `<text x="${width/2}" y="${Math.round(height * 0.10)}" font-family="JetBrains Mono, Menlo, monospace" font-size="${hdrSize}" font-weight="500" fill="${CREAM}" letter-spacing="3" text-anchor="middle" opacity="0.7">${HEADER_TAG}</text>`;

  svg += `<g transform="translate(${wmX}, ${wmY}) scale(${scale})">${innerOriginal}</g>`;

  svg += `<text x="${width/2}" y="${tagY}" font-family="Space Grotesk, Inter, sans-serif" font-size="${tagSize}" font-weight="600" fill="${CREAM}" opacity="0.78" letter-spacing="5" text-anchor="middle">${TAGLINE}</text>`;

  svg += `<text x="${width/2}" y="${dirY}" font-family="JetBrains Mono, Menlo, monospace" font-size="${subS}" font-weight="500" fill="${CREAM}" opacity="0.6" letter-spacing="2" text-anchor="middle">${DIRECTORY}</text>`;

  const ftrSize = Math.max(10, Math.round(width / 100));
  svg += `<text x="${width/2}" y="${height - Math.round(height * 0.07)}" font-family="JetBrains Mono, Menlo, monospace" font-size="${ftrSize}" font-weight="400" fill="${CREAM}" opacity="0.5" letter-spacing="2" text-anchor="middle">SCORPIUSLEADS.COM</text>`;

  svg += '</svg>';
  return svg;
}

/* Email signature — transparent, emerald wordmark, dark text */
function emailSig({ width, height }) {
  // For email sig we use the ORIGINAL (emerald) wordmark, not the cream variant
  const original = fs.readFileSync(path.join(__dirname, 'scorpius-leads-wordmark.svg'), 'utf8');
  const m2 = original.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/);
  const innerEmerald = m2[2];
  const [, , vw2, vh2] = m2[1].split(' ').map(Number);

  const wordmarkW = 360;
  const scale = wordmarkW / vw2;
  const wordmarkH = vh2 * scale;
  const tagSize = 13;
  const blockH = wordmarkH + tagSize + 12;
  const blockTop = (height - blockH) / 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<g transform="translate(0, ${blockTop}) scale(${scale})">${innerEmerald}</g>`;
  svg += `<text x="0" y="${blockTop + wordmarkH + 16}" font-family="Space Grotesk, Inter, sans-serif" font-size="${tagSize}" font-weight="600" fill="${MUTED}" letter-spacing="3">${TAGLINE}</text>`;
  svg += '</svg>';
  return svg;
}

function render(svg, outPath) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'original' } });
  fs.writeFileSync(path.join(__dirname, outPath), resvg.render().asPng());
  console.log(`✓ ${outPath}`);
}

const outDir = 'png/social';
fs.mkdirSync(path.join(__dirname, outDir), { recursive: true });

render(banner({ width: 1584, height: 396, wordmarkW: 520, centerX: 1100 }), `${outDir}/linkedin-banner-1584x396.png`);
render(banner({ width: 1584, height: 396, wordmarkW: 520, centerX: 1100, showDirectory: false, showFooter: false }), `${outDir}/linkedin-personal-banner-1584x396.png`);
render(banner({ width: 1500, height: 500, wordmarkW: 540, centerX: 1050 }), `${outDir}/x-header-1500x500.png`);
render(centered({ width: 1080, height: 1080, wordmarkW: 720 }), `${outDir}/instagram-post-1080x1080.png`);
render(centered({ width: 1080, height: 1920, wordmarkW: 760 }), `${outDir}/instagram-story-1080x1920.png`);
render(centered({ width: 2560, height: 1440, wordmarkW: 1000 }), `${outDir}/youtube-banner-2560x1440.png`);
render(emailSig({ width: 600, height: 150 }), `${outDir}/email-signature-transparent.png`);

console.log('\n✓ Scorpius Leads social pack done.');
