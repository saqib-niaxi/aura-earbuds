// Renders the 1200×630 link-preview image (public/og.png) shown when the URL is shared.
// Usage: npm run og
import sharp from 'sharp'

const W = 1200
const H = 630

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glowA" cx="0.78" cy="0.62" r="0.55">
      <stop offset="0" stop-color="#7C5CFF" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#7C5CFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.92" cy="0.95" r="0.45">
      <stop offset="0" stop-color="#00E0FF" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#00E0FF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="text" x1="0" x2="1">
      <stop offset="0" stop-color="#B4A4FF"/>
      <stop offset="0.35" stop-color="#7C5CFF"/>
      <stop offset="1" stop-color="#00E0FF"/>
    </linearGradient>
    <radialGradient id="bud" cx="0.32" cy="0.28" r="0.8">
      <stop offset="0" stop-color="#6A6A82"/>
      <stop offset="0.5" stop-color="#1C1C25"/>
      <stop offset="1" stop-color="#060609"/>
    </radialGradient>
    <linearGradient id="stem" x1="0" x2="1">
      <stop offset="0" stop-color="#060609"/>
      <stop offset="0.4" stop-color="#55556A"/>
      <stop offset="0.7" stop-color="#1C1C25"/>
      <stop offset="1" stop-color="#060609"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#0A0A0F"/>
  <rect width="${W}" height="${H}" fill="url(#glowA)"/>
  <rect width="${W}" height="${H}" fill="url(#glowB)"/>

  <circle cx="930" cy="330" r="190" fill="none" stroke="#7C5CFF" stroke-opacity="0.7" stroke-width="2"/>
  <circle cx="930" cy="330" r="150" fill="none" stroke="#FFFFFF" stroke-opacity="0.08"/>
  <g transform="translate(800 205) rotate(-20)">
    <rect x="58" y="80" width="40" height="170" rx="20" fill="url(#stem)"/>
    <circle cx="70" cy="60" r="58" fill="url(#bud)"/>
    <ellipse cx="14" cy="76" rx="26" ry="22" fill="#26262F"/>
  </g>
  <g transform="translate(1085 215) scale(-1 1) rotate(-14)">
    <rect x="58" y="80" width="40" height="170" rx="20" fill="url(#stem)"/>
    <circle cx="70" cy="60" r="58" fill="url(#bud)"/>
    <ellipse cx="14" cy="76" rx="26" ry="22" fill="#26262F"/>
  </g>

  <text x="72" y="104" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="30" letter-spacing="10" fill="#FFFFFF">AURA</text>
  <text x="72" y="300" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="84" letter-spacing="-3" fill="#FFFFFF">Hear what</text>
  <text x="72" y="390" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="84" letter-spacing="-3" fill="#FFFFFF">silence</text>
  <text x="72" y="480" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="84" letter-spacing="-3" fill="url(#text)">sounds like.</text>
  <text x="72" y="560" font-family="Consolas, monospace" font-size="20" letter-spacing="3" fill="#FFFFFF" fill-opacity="0.6">CONCEPT LAUNCH PAGE · DESIGNED &amp; BUILT BY SAQIB NIAZI</text>
</svg>`

const info = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png')
console.log(`public/og.png  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} kB`)
