/**
 * Drawn machines for the demo and the README: a front-loading washer and a tumble dryer, plain SVG.
 * No photos of a real home are used anywhere in this repository.
 */
export const dataUri = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const body = (accent, door, panel) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200">
  <defs>
    <linearGradient id="b" x1="0" x2="1"><stop offset="0" stop-color="#f4f5f7"/><stop offset=".55" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe2e7"/></linearGradient>
    <radialGradient id="g" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="${door[0]}"/><stop offset="1" stop-color="${door[1]}"/></radialGradient>
  </defs>
  <rect x="8" y="6" width="144" height="186" rx="12" fill="url(#b)" stroke="#c9cdd4" stroke-width="2"/>
  <rect x="8" y="6" width="144" height="38" rx="12" fill="#eceef1"/>
  <rect x="8" y="34" width="144" height="10" fill="#eceef1"/>
  <line x1="8" y1="44" x2="152" y2="44" stroke="#c9cdd4" stroke-width="1.5"/>
  <rect x="18" y="16" width="34" height="16" rx="3" fill="#cfd5dd"/>
  ${panel}
  <circle cx="122" cy="25" r="10" fill="#d7dbe1" stroke="#b8bec7" stroke-width="2"/>
  <circle cx="122" cy="25" r="3" fill="${accent}"/>
  <circle cx="80" cy="114" r="52" fill="#e3e6ea" stroke="#b8bec7" stroke-width="3"/>
  <circle cx="80" cy="114" r="42" fill="url(#g)" stroke="#9aa2ad" stroke-width="3"/>
  <path d="M52 96 a36 36 0 0 1 30 -18" stroke="rgba(255,255,255,.65)" stroke-width="6" fill="none" stroke-linecap="round"/>
  <rect x="128" y="104" width="8" height="22" rx="4" fill="#c2c8d0"/>
  <rect x="20" y="182" width="20" height="8" rx="2" fill="#b8bec7"/><rect x="120" y="182" width="20" height="8" rx="2" fill="#b8bec7"/>
</svg>`;

export const washer = () => body("#3b82f6", ["#a9d4f5", "#3f6f9a"],
  `<rect x="60" y="18" width="46" height="12" rx="3" fill="#1f2937"/><text x="83" y="27.5" font-family="monospace" font-size="8" fill="#60a5fa" text-anchor="middle">0:38</text>`);
export const dryer = () => body("#f97316", ["#d9dde3", "#6b7280"],
  `<rect x="60" y="18" width="46" height="12" rx="3" fill="#1f2937"/><text x="83" y="27.5" font-family="monospace" font-size="8" fill="#fb923c" text-anchor="middle">1:14</text>`);
