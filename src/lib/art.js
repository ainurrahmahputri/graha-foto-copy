/* Ilustrasi SVG (dibuat dengan kode). Dipakai lewat komponen <Art />. */
const lines = (x, y, w, n, gap = 7, c = "#bdb9ac", h = 2.4) => Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y + i * gap}" width="${i === n - 1 ? w * .6 : w - (i % 2) * 6}" height="${h}" rx="${h / 2}" fill="${c}"/>`).join("");
export const ART = {
  printer: `<svg viewBox="0 0 300 240"><g class="prn">
<ellipse cx="150" cy="224" rx="126" ry="9" fill="#000" opacity=".5" filter="url(#blur5)"/>
<rect x="54" y="214" width="26" height="8" rx="3" fill="#0d1311"/><rect x="220" y="214" width="26" height="8" rx="3" fill="#0d1311"/>
<rect x="26" y="92" width="248" height="124" rx="16" fill="url(#gBody)"/>
<path d="M26 190H274V200a16 16 0 0 1-16 16H42a16 16 0 0 1-16-16Z" fill="#000" opacity=".07"/>
<path d="M44 58H256a8 8 0 0 1 7.7 5.8L276 98H24L36.3 63.8A8 8 0 0 1 44 58Z" fill="url(#gTop)"/>
<path d="M58 67H242L254 92H46Z" fill="url(#gGlass)"/>
<path d="M62 70H150L141 90H52Z" fill="#fff" opacity=".12"/>
<rect x="24" y="95" width="252" height="6" rx="3" fill="#c3bfb1"/>
<rect x="40" y="112" width="40" height="3" rx="1.5" fill="#17724f"/><rect x="40" y="120" width="26" height="3" rx="1.5" fill="#c9c5b8"/>
<rect x="184" y="108" width="74" height="32" rx="8" fill="url(#gDark)"/>
<rect x="190" y="114" width="32" height="20" rx="3" fill="url(#gGreen)"/>
<rect x="194" y="118" width="22" height="2.4" rx="1.2" fill="#0e3a29" opacity=".7"/><rect x="194" y="123" width="16" height="2.4" rx="1.2" fill="#0e3a29" opacity=".5"/><rect x="194" y="128" width="19" height="2.4" rx="1.2" fill="#0e3a29" opacity=".5"/>
<circle class="led" cx="234" cy="119" r="3.2" fill="#5fd3a1"/><circle cx="245" cy="119" r="3.2" fill="#fff" opacity=".3"/>
<rect x="230" y="127" width="24" height="7" rx="3.5" fill="#17724f"/>
<rect x="50" y="146" width="200" height="14" rx="7" fill="#0b1210"/>
<path d="M82 154H218L228 202H72Z" fill="url(#gPaper)"/>
<rect x="88" y="165" width="124" height="3" rx="1.5" fill="#1c2b25" opacity=".75"/>
<rect x="86" y="173" width="128" height="2.4" rx="1.2" fill="#bdb9ac"/><rect x="85" y="180" width="126" height="2.4" rx="1.2" fill="#bdb9ac"/><rect x="84" y="187" width="130" height="2.4" rx="1.2" fill="#bdb9ac"/><rect x="83" y="194" width="80" height="2.4" rx="1.2" fill="#bdb9ac"/>
<path d="M82 154H218L219.5 162H80.5Z" fill="#000" opacity=".22"/>
<path d="M52 146.5H248" stroke="#fff" stroke-opacity=".3"/><path d="M28 93H272" stroke="#fff" stroke-opacity=".85"/>
<g clip-path="url(#slotClip)"><g class="sheetOut"><path d="M84 152H216L226 204H74Z" fill="#fff" stroke="#d3cfc2" stroke-width=".8"/><rect x="92" y="166" width="116" height="3" rx="1.5" fill="#1c2b25" opacity=".75"/>${lines(90,174,120,5,8)}</g></g>
</g></svg>`,
  stack: `<svg viewBox="0 0 140 120">
<ellipse cx="72" cy="104" rx="58" ry="7" fill="#000" opacity=".45" filter="url(#blur5)"/>
<path d="M18 62L58 80V96L18 78Z" fill="#d6d2c4"/><path d="M58 80L124 60V76L58 96Z" fill="#bcb7a8"/>
<path d="M18 62L84 42L124 60L58 80Z" fill="url(#gPaper)"/>
<path d="M18 62L58 80" stroke="#fff" stroke-opacity=".6"/>
<g stroke="#9c9789" stroke-width=".8" opacity=".7"><path d="M18 66L58 84"/><path d="M18 70L58 88"/><path d="M58 84L124 64"/><path d="M58 88L124 68"/></g>
<path d="M44 62L76 52" stroke="#1c2b25" stroke-width="2.4" stroke-linecap="round" opacity=".7"/><path d="M48 68L88 56" stroke="#bdb9ac" stroke-width="2" stroke-linecap="round"/><path d="M54 73L84 64" stroke="#bdb9ac" stroke-width="2" stroke-linecap="round"/>
<path d="M104 40V62a6 6 0 0 0 12 0V44a3.5 3.5 0 0 0-7 0V60" stroke="#7f8c85" stroke-width="2.4" fill="none" stroke-linecap="round"/>
</svg>`,
  bw: `<svg viewBox="0 0 120 100">
<ellipse cx="60" cy="92" rx="38" ry="5" fill="#000" opacity=".4" filter="url(#blur5)"/>
<g transform="rotate(-9 60 52)"><rect x="30" y="12" width="56" height="74" rx="3" fill="#cfcbbd"/></g>
<g transform="rotate(5 60 52)"><rect x="33" y="10" width="56" height="74" rx="3" fill="#e5e1d4"/></g>
<rect x="32" y="8" width="56" height="76" rx="3" fill="url(#gPaper)"/>
<rect x="39" y="17" width="30" height="4" rx="2" fill="#1c2b25" opacity=".8"/>${lines(39, 28, 42, 6, 8)}
</svg>`,
  color: `<svg viewBox="0 0 120 100">
<ellipse cx="60" cy="92" rx="38" ry="5" fill="#000" opacity=".4" filter="url(#blur5)"/>
<g transform="rotate(7 60 52)"><rect x="32" y="10" width="56" height="74" rx="3" fill="#dcd8ca"/></g>
<rect x="30" y="8" width="58" height="76" rx="3" fill="url(#gPaper)"/>
<g style="mix-blend-mode:multiply"><circle cx="52" cy="34" r="14" fill="#25b6cc"/><circle cx="66" cy="34" r="14" fill="#e0457f"/><circle cx="59" cy="46" r="14" fill="#f0c929"/></g>
<rect x="38" y="64" width="40" height="3" rx="1.5" fill="#bdb9ac"/><rect x="38" y="71" width="28" height="3" rx="1.5" fill="#bdb9ac"/>
</svg>`,
  bind: `<svg viewBox="0 0 120 100">
<ellipse cx="62" cy="92" rx="38" ry="5" fill="#000" opacity=".4" filter="url(#blur5)"/>
<g transform="rotate(4 62 50)"><rect x="34" y="8" width="62" height="80" rx="5" fill="url(#gGold)"/>
<rect x="46" y="24" width="40" height="26" rx="2.5" fill="#f6f0dc"/><rect x="51" y="30" width="22" height="3" rx="1.5" fill="#1c2b25" opacity=".75"/><rect x="51" y="37" width="30" height="2.4" rx="1.2" fill="#bdb9ac"/><rect x="51" y="43" width="18" height="2.4" rx="1.2" fill="#bdb9ac"/>
${Array.from({ length: 8 }, (_, i) => `<rect x="26" y="${14 + i * 9.4}" width="22" height="4.4" rx="2.2" fill="#262620"/><rect x="27" y="${14.6 + i * 9.4}" width="20" height="1.2" rx=".6" fill="#6b6b5e"/>`).join("")}</g>
</svg>`,
  bag: `<svg viewBox="0 0 120 110">
<ellipse cx="60" cy="100" rx="40" ry="6" fill="#000" opacity=".25" filter="url(#blur5)"/>
<g transform="rotate(-6 50 30)"><rect x="34" y="6" width="38" height="46" rx="2" fill="url(#gPaper)"/><rect x="40" y="14" width="22" height="3" rx="1.5" fill="#1c2b25" opacity=".7"/>${lines(40, 22, 26, 4, 7)}</g>
<g transform="rotate(8 72 30)"><rect x="56" y="10" width="38" height="44" rx="2" fill="#efece1"/>${lines(62, 20, 26, 4, 7)}</g>
<path d="M24 46H96L102 98a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4Z" fill="#cdb27f"/>
<path d="M24 46H96L97 54H23Z" fill="#b99a64"/>
<path d="M60 46V102" stroke="#000" stroke-opacity=".06" stroke-width="22"/>
<rect x="38" y="68" width="44" height="18" rx="9" fill="#17231e"/><text x="60" y="80.6" text-anchor="middle" font-family="Cormorant Garamond,serif" font-style="italic" font-size="12" fill="#cfe8dc">Graha</text>
<path d="M40 46C40 26 80 26 80 46" stroke="#8c7447" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".0"/>
</svg>`,
  arm: `<svg viewBox="0 0 112 44">
<path d="M104 46L58 16" stroke="#0b1210" stroke-width="3.6" stroke-linecap="round"/>
<path d="M112 14H10" stroke="#0b1210" stroke-width="5.4" stroke-linecap="round"/>
<path d="M104 12.4H12" stroke="#4a5b53" stroke-width="1.2" opacity=".85"/>
<circle cx="10" cy="14" r="4.2" fill="#0b1210"/><circle cx="10" cy="13" r="1.4" fill="#4a5b53"/>
<circle cx="98" cy="14" r="3" fill="#2a3a33"/>
</svg>`,
  send: `<svg viewBox="0 0 150 110">
<circle cx="64" cy="62" r="44" fill="#e3eee8"/>
<path d="M18 110C18 86 36 76 62 76S106 86 106 110Z" fill="#0f5a40"/>
<path d="M50 76L62 90L74 76Z" fill="#e8f1ec"/>
<path d="M44 80C42 92 42 100 42 110" stroke="#12231c" stroke-width="6" fill="none"/>
<rect x="55" y="62" width="14" height="16" rx="5" fill="#c58b5e"/>
<circle cx="62" cy="48" r="17" fill="#c58b5e"/>
<path d="M44 47C42 30 52 24 62 24C73 24 81 31 79 47C75 39 69 36 62 36C55 36 49 39 44 47Z" fill="#1b1714"/>
<circle cx="56" cy="50" r="1.4" fill="#1b1714"/><circle cx="68" cy="50" r="1.4" fill="#1b1714"/>
<path d="M57 57Q62 60 67 57" stroke="#7a4a2c" stroke-width="1.4" fill="none" stroke-linecap="round"/>
<path d="M98 98C106 92 106 80 96 74" stroke="#0f5a40" stroke-width="12" fill="none" stroke-linecap="round"/>
<g transform="rotate(14 91 69)"><rect x="84" y="56" width="15" height="26" rx="3" fill="#1a2620"/><rect x="86" y="59" width="11" height="20" rx="2" fill="#d6ebe1"/></g>
<circle cx="94" cy="82" r="6" fill="#c58b5e"/>
<path class="dash" d="M100 54C110 40 118 36 128 34" stroke="#0f5a40" stroke-width="1.4" stroke-dasharray="3 3" fill="none" stroke-linecap="round"/>
<g class="fly"><g transform="rotate(8 130 28)"><rect x="120" y="12" width="24" height="30" rx="2" fill="#fff" stroke="#b8c8bf"/><rect x="124" y="17" width="12" height="2.4" rx="1.2" fill="#12231c" opacity=".75"/><rect x="124" y="23" width="16" height="2" rx="1" fill="#b8c8bf"/><rect x="124" y="28" width="16" height="2" rx="1" fill="#b8c8bf"/><rect x="124" y="33" width="10" height="2" rx="1" fill="#b8c8bf"/></g></g>
</svg>`,
  pick: `<svg viewBox="0 0 150 110">
<circle cx="56" cy="62" r="44" fill="#e3eee8"/>
<path d="M14 110C14 88 30 78 54 78S94 88 94 110Z" fill="#0f5a40"/>
<path d="M30 54C30 30 42 22 54 22S78 30 78 54C78 68 72 76 66 80L42 80C36 76 30 68 30 54Z" fill="#e9dfcf"/>
<ellipse cx="54" cy="52" rx="13" ry="15" fill="#cf9a6e"/>
<circle cx="49" cy="52" r="1.3" fill="#1b1714"/><circle cx="59" cy="52" r="1.3" fill="#1b1714"/>
<path d="M50 59Q54 62 58 59" stroke="#8a5330" stroke-width="1.3" fill="none" stroke-linecap="round"/>
<path d="M32 70C36 82 46 86 54 86C62 86 72 82 76 70L78 80C72 88 64 92 54 92C44 92 36 88 30 80Z" fill="#e9dfcf"/>
<rect x="38" y="90" width="34" height="22" rx="2" fill="#fff" stroke="#b8c8bf"/>
<rect x="42" y="95" width="16" height="2.4" rx="1.2" fill="#12231c" opacity=".7"/><rect x="42" y="101" width="24" height="2" rx="1" fill="#b8c8bf"/><rect x="42" y="106" width="20" height="2" rx="1" fill="#b8c8bf"/>
<circle cx="38" cy="98" r="5" fill="#cf9a6e"/><circle cx="72" cy="98" r="5" fill="#cf9a6e"/>
<g class="bagp"><path d="M114 76L112 52H138L140 78Z" fill="#d3b98a"/><path d="M118 52C118 42 132 42 132 52" stroke="#a88d5d" stroke-width="2" fill="none"/><rect x="118" y="60" width="16" height="8" rx="1.5" fill="#0f5a40"/></g>
<rect x="96" y="80" width="54" height="30" fill="#8a5c36"/><rect x="96" y="80" width="54" height="30" fill="#000" filter="url(#woodGrain)"/><rect x="94" y="76" width="56" height="6" fill="#c4915c"/>
</svg>`,
  get scene() { return `<svg viewBox="0 0 390 318" preserveAspectRatio="xMidYMax slice">
<rect width="390" height="318" fill="#dfe9e3"/>
<rect width="390" height="318" fill="#000" filter="url(#plaster)" opacity=".5"/>
<path d="M236 0H320L248 250H160Z" fill="#fff" opacity=".28"/>
<rect x="0" y="250" width="390" height="70" fill="#8a5c36"/>
<rect x="0" y="250" width="390" height="70" fill="#000" filter="url(#woodGrain)"/>
<rect x="0" y="246" width="390" height="8" fill="#c4915c"/>
<rect x="0" y="254" width="390" height="2" fill="#000" opacity=".2"/>
<ellipse cx="120" cy="252" rx="112" ry="6" fill="#000" opacity=".28" filter="url(#blur5)"/>
<ellipse cx="312" cy="252" rx="48" ry="5" fill="#000" opacity=".25" filter="url(#blur5)"/>
<svg x="10" y="72" width="240" height="192" viewBox="0 0 300 240">${ART.printer.replace(/^<svg[^>]*>|<\/svg>$/g,"")}</svg>
<svg x="262" y="175" width="101" height="86" viewBox="0 0 140 120">${ART.stack.replace(/^<svg[^>]*>|<\/svg>$/g,"")}</svg>
</svg>`; }
};
export const signSVG = open => {
  const paint = open ? "#0d5a40" : "#efe6cf", stripe = open ? "#cdbb86" : "#8c6d2c", word = open ? "OPEN" : "CLOSE", wc = open ? "#f4ead0" : "#8e3b2c", tc = open ? "#e3efe8" : "#3a3326";
  const cord = (x2) => `<path d="M120 12L${x2} 62" stroke="#6d5328" stroke-width="3.6" stroke-linecap="round"/><path d="M120 12L${x2} 62" stroke="#dcc489" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="1.4 3.3"/>`;
  return `<svg viewBox="0 0 240 190">${cord(30)}${cord(210)}
<circle cx="120" cy="9" r="6.5" fill="none" stroke="#b08a3a" stroke-width="2.6"/>
<rect x="6" y="54" width="228" height="130" rx="12" fill="#74502f"/>
<rect x="6" y="54" width="228" height="130" rx="12" fill="#000" filter="url(#woodGrain)"/>
<rect x="6.5" y="54.5" width="227" height="129" rx="11.5" fill="none" stroke="#b58a58" stroke-opacity=".55"/>
<rect x="20" y="70" width="200" height="102" rx="6" fill="${paint}"/>
<rect x="20" y="70" width="200" height="102" rx="6" fill="#000" filter="url(#wear)" opacity="${open ? .55 : .35}"/>
<rect x="26" y="76" width="188" height="90" rx="3" fill="none" stroke="${stripe}" stroke-width="1.3" opacity=".85"/>
<text class="shopTxt" x="120" y="96" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-style="italic" font-size="14" fill="${tc}">Graha Foto Copy</text>
<text x="120" y="141" text-anchor="middle" font-family="Oswald,Impact,sans-serif" font-weight="600" font-size="${open ? 47 : 41}" letter-spacing="4" fill="${wc}" filter="url(#rough)">${word}</text>
<text class="hrs" x="120" y="158" text-anchor="middle" font-family="Poppins,sans-serif" font-size="9.5" fill="${tc}" opacity=".9"></text>
<circle cx="30" cy="62" r="3.6" fill="#24170b"/><circle cx="30" cy="62" r="5.2" fill="none" stroke="#b08a3a" stroke-width="1.6"/>
<circle cx="210" cy="62" r="3.6" fill="#24170b"/><circle cx="210" cy="62" r="5.2" fill="none" stroke="#b08a3a" stroke-width="1.6"/></svg>`;
};
