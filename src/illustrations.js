/* Spot illustrations, drawn in the brand palette.
   Every colour comes from a CSS class (see "Illustrations" in site.css), so the drawings follow light and dark mode.
   k = ink line · s = surface shape with ink outline · p = paper fill · g = green · m = soft green · t = turmeric · bg = backdrop blob */
'use strict';

const svg = (label, body, vb = '0 0 480 380') =>
  `<svg class="il" viewBox="${vb}" role="img" aria-label="${label}">${body}</svg>`;

const BLOB = '<path class="bg" d="M84 214c-8-92 66-166 166-170 98-4 158 62 152 156-6 96-74 152-166 148-90-4-144-46-152-134z"/>';

// A gear outline as a single path: teeth alternate between inner and outer radius.
function gear(cx, cy, r, teeth, depth, cls) {
  const pts = [];
  const step = (Math.PI * 2) / (teeth * 4);
  for (let i = 0; i < teeth * 4; i++) {
    const rad = i % 4 === 1 || i % 4 === 2 ? r + depth : r;
    const a = i * step - Math.PI / 2;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return `<path class="${cls}" d="M${pts.join('L')}Z"/><circle class="p k" cx="${cx}" cy="${cy}" r="${(r * 0.36).toFixed(1)}"/>`;
}

const lines = (x, y, widths, gap = 16, cls = ['g', 't', 'k2', 'g', 'k2']) =>
  widths.map((w, i) => `<rect class="${cls[i % cls.length]}" x="${x}" y="${y + i * gap}" width="${w}" height="7" rx="3.5"/>`).join('');

const ART = {
  students: () => svg('A laptop with code, a graduation cap, a gear and a chart: learning across IT, engineering and business', `${BLOB}
    <rect class="s" x="136" y="118" width="208" height="138" rx="12"/>
    <rect class="p" x="150" y="132" width="180" height="108" rx="6"/>
    ${lines(166, 150, [70, 112, 54, 96, 40])}
    <path class="s" d="M112 262h256l-16 20H128z"/>
    <path class="g k" d="M118 92l54-24 54 24-54 24z"/>
    <path class="k" d="M146 104v20c14 10 38 10 52 0v-20" fill="none"/>
    <path class="k" d="M226 92v26" fill="none"/><circle class="t" cx="226" cy="122" r="6"/>
    <rect class="s" x="334" y="78" width="104" height="88" rx="14"/>
    ${gear(386, 122, 22, 8, 7, 'g k')}
    <rect class="s" x="44" y="222" width="104" height="84" rx="14"/>
    <rect class="m k" x="64" y="270" width="16" height="20" rx="3"/><rect class="g k" x="88" y="254" width="16" height="36" rx="3"/><rect class="t k" x="112" y="238" width="16" height="52" rx="3"/>
    <circle class="t" cx="420" cy="230" r="8"/><circle class="m" cx="70" cy="120" r="12"/>`),

  colleges: () => svg('A college building and a factory joined by a bridge', `${BLOB}
    <path class="k" d="M36 300h408" fill="none"/>
    <path class="s" d="M56 178l84-44 84 44z"/>
    <rect class="s" x="68" y="178" width="144" height="102"/>
    <path class="k" d="M92 196v72M124 196v72M156 196v72M188 196v72" fill="none"/>
    <rect class="s" x="58" y="280" width="164" height="20"/>
    <circle class="t" cx="140" cy="160" r="7"/>
    <path class="s" d="M276 300V196l42 26v-26l42 26v-26l42 26v78z"/>
    <rect class="s" x="384" y="142" width="22" height="62"/>
    <circle class="m" cx="400" cy="122" r="12"/><circle class="m" cx="418" cy="98" r="9"/>
    <rect class="g" x="300" y="240" width="26" height="26" rx="4"/><rect class="g" x="344" y="240" width="26" height="26" rx="4"/>
    <path class="road" d="M144 132C176 52 300 52 330 168" fill="none"/>
    <circle class="t k" cx="236" cy="72" r="11"/>`),

  industry: () => svg('A factory and a candidate profile under review, with a star', `${BLOB}
    <path class="k" d="M30 300h420" fill="none"/>
    <path class="s" d="M44 300V200l46 28v-28l46 28v-28l46 28v72z"/>
    <rect class="s" x="156" y="140" width="22" height="64"/>
    <circle class="m" cx="170" cy="118" r="12"/>
    <rect class="g" x="66" y="248" width="24" height="24" rx="4"/><rect class="g" x="110" y="248" width="24" height="24" rx="4"/>
    <rect class="s" x="236" y="76" width="168" height="208" rx="14"/>
    <circle class="m k" cx="280" cy="124" r="22"/>
    <rect class="k2" x="314" y="110" width="66" height="8" rx="4"/><rect class="g" x="314" y="128" width="44" height="8" rx="4"/>
    ${lines(258, 170, [124, 96, 112, 70], 18, ['k2', 'k2', 'g', 'k2'])}
    <rect class="m" x="258" y="248" width="56" height="18" rx="9"/><rect class="m" x="320" y="248" width="44" height="18" rx="9"/>
    <circle class="t k" cx="404" cy="80" r="26"/>
    <path class="k" d="M391 81l9 9 17-18" fill="none"/>`),

  mentors: () => svg('Two people talking across a table, with speech bubbles about code and a completed task', `${BLOB}
    <circle class="m k" cx="148" cy="178" r="30"/>
    <path class="g k" d="M92 286c0-44 24-70 56-70s56 26 56 70z"/>
    <circle class="t k" cx="332" cy="178" r="30"/>
    <path class="s" d="M276 286c0-44 24-70 56-70s56 26 56 70z"/>
    <rect class="s" x="60" y="282" width="360" height="16" rx="6"/>
    <path class="s" d="M56 64h132a14 14 0 0 1 14 14v52a14 14 0 0 1-14 14h-96l-22 20v-20h-14a14 14 0 0 1-14-14V78a14 14 0 0 1 14-14z"/>
    <text class="code" x="122" y="116" text-anchor="middle">&lt;/&gt;</text>
    <path class="s" d="M292 52h128a14 14 0 0 1 14 14v50a14 14 0 0 1-14 14h-14v20l-22-20h-92a14 14 0 0 1-14-14V66a14 14 0 0 1 14-14z"/>
    <path class="gk" d="M334 92l14 14 26-28" fill="none"/>`),

  it: () => svg('A code editor window with brackets and a cloud', `${BLOB}
    <rect class="s" x="92" y="92" width="276" height="190" rx="14"/>
    <path class="k" d="M92 124h276" fill="none"/>
    <circle class="t" cx="114" cy="108" r="5"/><circle class="g" cx="132" cy="108" r="5"/><circle class="m" cx="150" cy="108" r="5"/>
    ${lines(118, 146, [90, 150, 120, 70, 136, 100], 20)}
    <text class="brace" x="310" y="236" text-anchor="middle">{ }</text>
    <path class="m k" d="M330 98a26 26 0 0 1 50-8 22 22 0 0 1 22 36h-78a20 20 0 0 1 6-28z"/>
    <circle class="t" cx="72" cy="270" r="9"/><path class="k" d="M72 270h24v-22" fill="none"/>`),

  engineering: () => svg('Two gears in front of an engineering drawing', `${BLOB}
    <rect class="s" x="88" y="70" width="250" height="196" rx="10"/>
    <path class="k2l" d="M88 110h250M88 150h250M88 190h250M88 230h250M128 70v196M168 70v196M208 70v196M248 70v196M288 70v196" fill="none"/>
    <path class="k" d="M120 236l60-110 60 110z" fill="none"/>
    ${gear(300, 236, 52, 10, 14, 'g k')}
    ${gear(392, 166, 30, 8, 10, 't k')}
    <rect class="s" x="54" y="286" width="150" height="20" rx="4"/>
    <path class="k" d="M74 286v-8M94 286v-12M114 286v-8M134 286v-12M154 286v-8M174 286v-12" fill="none"/>`),

  business: () => svg('A rising bar chart, a pie chart and a growth arrow', `${BLOB}
    <rect class="s" x="76" y="82" width="230" height="208" rx="14"/>
    <rect class="m k" x="104" y="216" width="32" height="50" rx="4"/>
    <rect class="g k" x="150" y="182" width="32" height="84" rx="4"/>
    <rect class="g k" x="196" y="146" width="32" height="120" rx="4"/>
    <rect class="t k" x="242" y="112" width="32" height="154" rx="4"/>
    <path class="road2" d="M110 200l52-36 44-20 56-40" fill="none"/>
    <path class="k" d="M248 98l18 6-6 18" fill="none"/>
    <circle class="s" cx="364" cy="230" r="58"/>
    <path class="t k" d="M364 230V172a58 58 0 0 1 56 44z"/>
    <path class="g k" d="M364 230l56-14a58 58 0 0 1-22 60z"/>`),

  healthcare: () => svg('A clipboard with a care plan, a stethoscope and a heart', `${BLOB}
    <rect class="s" x="118" y="74" width="196" height="232" rx="14"/>
    <rect class="g k" x="176" y="60" width="80" height="30" rx="8"/>
    <rect class="p" x="138" y="108" width="156" height="178" rx="6"/>
    <path class="g k" d="M200 122h32v22h22v32h-22v22h-32v-22h-22v-32h22z"/>
    ${lines(156, 232, [118, 92, 108], 16, ['k2', 'g', 'k2'])}
    <path class="k" d="M352 96v60a42 42 0 0 1-84 0V96" fill="none"/>
    <circle class="s" cx="268" cy="92" r="6"/><circle class="s" cx="352" cy="92" r="6"/>
    <path class="k" d="M310 198v40a40 40 0 0 0 80 0v-14" fill="none"/>
    <circle class="t k" cx="390" cy="210" r="16"/>
    <path class="m k" d="M86 222c-18-14-30-26-30-42a17 17 0 0 1 30-11 17 17 0 0 1 30 11c0 16-12 28-30 42z"/>
    <circle class="t" cx="418" cy="292" r="8"/><circle class="m" cx="72" cy="300" r="12"/>`),

  abroad: () => svg('A globe with a flight path, a passport and a language card', `${BLOB}
    <circle class="s" cx="232" cy="200" r="104"/>
    <path class="k2l" d="M128 200h208M232 96c-44 40-44 168 0 208M232 96c44 40 44 168 0 208M150 140h164M150 260h164" fill="none"/>
    <path class="m" d="M178 136c18-8 40-6 52 8s4 30-14 34-30 18-22 36-18 26-34 10-14-56 18-88z"/>
    <path class="m" d="M262 222c16-6 36 2 40 18s-10 34-28 34-30-14-26-30 2-18 14-22z"/>
    <path class="road" d="M92 268C120 120 300 40 396 132" fill="none"/>
    <path class="g k" d="M384 116l26 6-14 22-6-10-12-4z"/>
    <rect class="s" x="320" y="214" width="96" height="124" rx="10"/>
    <circle class="g k" cx="368" cy="262" r="20"/>
    <rect class="t" x="340" y="300" width="56" height="8" rx="4"/><rect class="k2" x="348" y="316" width="40" height="7" rx="3.5"/>
    <rect class="s" x="36" y="78" width="136" height="64" rx="12"/>
    <text class="lvl" x="104" y="119" text-anchor="middle">A1 → B2</text>`)
};

module.exports = ART;
