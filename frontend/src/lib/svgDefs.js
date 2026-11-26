/* Gradien dan filter SVG yang dipakai bersama oleh semua ilustrasi. */
export const SVG_DEFS = `
  <linearGradient id="gBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8f5ec"/><stop offset="1" stop-color="#dcd8cb"/></linearGradient>
  <linearGradient id="gTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9e5d9"/></linearGradient>
  <linearGradient id="gGlass"><stop offset="0" stop-color="#22352d"/><stop offset="1" stop-color="#22352d"/></linearGradient>
  <linearGradient id="gDark"><stop offset="0" stop-color="#1b2a23"/><stop offset="1" stop-color="#1b2a23"/></linearGradient>
  <linearGradient id="gGreen"><stop offset="0" stop-color="#3fbf8a"/><stop offset="1" stop-color="#3fbf8a"/></linearGradient>
  <linearGradient id="gPaper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f1efe8"/></linearGradient>
  <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b7a56"/><stop offset="1" stop-color="#0f5a40"/></linearGradient>
  <clipPath id="slotClip"><rect x="56" y="154" width="190" height="92"/></clipPath>
  <filter id="blur5" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 -.25"/></filter>
  <filter id="woodGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".014 .38" numOctaves="3" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 .13  0 0 0 0 .08  0 0 0 0 .04  0 0 0 1.5 -.5"/><feComposite in2="SourceAlpha" operator="in"/></filter>
  <filter id="wear" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="11"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 .97  0 0 0 0 .86  0 0 0 2.4 -1.35"/><feComposite in2="SourceAlpha" operator="in"/></filter>
  <filter id="plaster" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="5"/><feColorMatrix type="matrix" values="0 0 0 0 .25  0 0 0 0 .35  0 0 0 0 .3  0 0 0 .55 -.2"/></filter>
  <filter id="rough" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="3" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="1.8" xChannelSelector="R" yChannelSelector="G"/></filter>
`;
