#!/usr/bin/env node
/* Digitaleem static site builder. No dependencies.
   node src/build.js            → dist/     (production: clean URLs like /students/)
   node src/build.js preview    → preview/  (links point at index.html files, for previews that do not resolve folders)
   node src/build.js wp         → wordpress/digitaleem/ (the WordPress theme, with every page as importable content) */
'use strict';
const fs = require('fs');
const path = require('path');

const MODE = ['preview', 'wp'].includes(process.argv[2]) ? process.argv[2] : 'dist';
const SRC = __dirname;
const OUT = MODE === 'wp' ? path.join(SRC, '..', 'wordpress', 'digitaleem') : path.join(SRC, '..', MODE);
const SITE = require('./data/site');
const THEME_VERSION = '1.0.0';
const programs = require('./data/programs');
const domains = require('./data/domains');
const ART = require('./illustrations');
const WORDMARK = fs.readFileSync(path.join(SRC, 'data', 'wordmark-path.txt'), 'utf8').trim();

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const P = Object.fromEntries(programs.map((p) => [p.slug, p]));
const D = Object.fromEntries(domains.map((d) => [d.slug, d]));

/* ---------- Links ---------- */
function makeCtx(pagePath) {
  const depth = (pagePath === '/' || pagePath === '/404') ? 0 : pagePath.split('/').filter(Boolean).length;
  const prefix = depth ? '../'.repeat(depth) : './';
  const l = (to) => {
    if (/^(https?:|mailto:|tel:|#)/.test(to)) return to;
    let [p, hash] = to.split('#');
    p = p.replace(/^\//, '');
    if (MODE === 'preview' && (p === '' || p.endsWith('/'))) p += 'index.html';
    let out = (p === '' ? prefix : prefix + p);
    if (MODE === 'preview' && out.startsWith('./') && p) out = out.slice(2);
    return out + (hash ? '#' + hash : '');
  };
  const a = (asset) => (depth ? prefix : '') + asset;
  // In WordPress every link is root-relative; the theme rewrites them to the site address when it renders.
  if (MODE === 'wp') return { path: pagePath, l: (to) => (/^(https?:|mailto:|tel:|#)/.test(to) ? to : '/' + to.replace(/^\//, '')), a: (asset) => '/' + asset };
  // 404.html is served at any path, so its links must be absolute.
  if (pagePath === '/404' && MODE === 'dist') return { path: pagePath, l: (to) => (/^(https?:|mailto:|tel:|#)/.test(to) ? to : to), a: (asset) => '/' + asset };
  return { path: pagePath, l, a };
}

/* ---------- Icons (24px stroke) ---------- */
const ICONS = {
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  factory: '<path d="M3 21V10l6 4V10l6 4V5h5v16z"/><path d="M7 17h2M12 17h2"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 5.5 5"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/>',
  building: '<path d="M3 21h18M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6M9 11h.01M15 11h.01"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3l7.5-7.5"/><path d="M14.5 6.5L17 4"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18"/>'
};
const icon = (n) => `<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ''}</svg></span>`;
const DOMAIN_ICON = { it: 'code', engineering: 'wrench', business: 'chart', healthcare: 'heart' };
const AUD = {
  students: { name: 'Students', path: '/students/', icon: 'cap' },
  colleges: { name: 'Colleges', path: '/colleges/', icon: 'building' },
  industry: { name: 'Industry', path: '/industry/', icon: 'gear' },
  mentors: { name: 'Mentors', path: '/mentors/', icon: 'chat' }
};

/* ---------- Logo ---------- */
const logoSVG = (label = 'Digitaleem home') => `<svg viewBox="8 7 342 58" role="img" aria-label="${label}"><path class="lt" d="M15 41V15h13a17 17 0 0 1 17 17" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path class="lb" d="M45 32a17 17 0 0 1-17 17h-3" fill="none" stroke-width="8" stroke-linecap="round"/><circle class="ld" cx="15" cy="51" r="4.2"/><g class="lw" transform="translate(62 52.5) scale(0.05734)"><path d="${WORDMARK}"/></g></svg>`;

/* ---------- Components ---------- */
const C = {
  icon,
  btn: (href, text, kind = 'primary') => `<a class="btn btn-${kind}" href="${href}"><span class="arrow">${esc(text)}</span></a>`,
  checks: (items, cls = '') => `<ul class="list-check ${cls}">${items.map((i) => `<li><span>${i}</span></li>`).join('')}</ul>`,
  tags: (items) => `<ul class="tags">${items.map((i) => `<li class="tag">${esc(i)}</li>`).join('')}</ul>`,
  steps: (items) => `<ol class="steps">${items.map(([h, p]) => `<li><div><h3>${esc(h)}</h3><p>${esc(p)}</p></div></li>`).join('')}</ol>`,
  stepsH: (items) => `<ol class="steps-h" style="--n:${items.length}">${items.map(([h, p]) => `<li><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('')}</ol>`,
  faq: (items) => `<div class="faq">${items.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${a}</p></div></details>`).join('')}</div>`,
  head: (eyebrow, h2, lead, cls = '') => `<div class="section-head ${cls}">${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h2>${h2}</h2>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`,
  cta: (ctx, h, p, href, label) => `<section class="section-tight"><div class="wrap"><div class="cta-band"><div><h2>${h}</h2><p>${p}</p></div><div class="btn-row"><a class="btn btn-primary" href="${href}"><span class="arrow">${esc(label)}</span></a></div></div></div></section>`,
  programCard: (ctx, p) => `<a class="card" href="${ctx.l('/programs/' + p.slug + '/')}" data-item data-audience="${p.audiences.join(' ')}" data-domain="${p.domains.join(' ')}">${icon(p.icon)}<h3>${esc(p.name)}</h3><p>${esc(p.short)}</p><span class="more">Learn more</span></a>`,
  domainCard: (ctx, d) => `<a class="card art-card" href="${ctx.l('/domains/' + d.slug + '/')}"><div class="card-art" aria-hidden="true">${ART[d.slug]()}</div><h3>${esc(d.name)}</h3><p>${esc(d.short)}</p>${C.tags(d.fields.slice(0, 6))}<span class="more">See all ${d.fields.length} fields</span></a>`,
  pageHero: (ctx, crumbs, eyebrow, h1, lead, actions = '', art = '') => {
    const copy = `${crumbs.length ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="${ctx.l('/')}">Home</a>${crumbs.map(([t, h]) => `<span aria-hidden="true">/</span>${h ? `<a href="${ctx.l(h)}">${esc(t)}</a>` : `<span>${esc(t)}</span>`}`).join('')}</nav>` : ''}${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${actions ? `<div class="btn-row">${actions}</div>` : ''}`;
    return art
      ? `<section class="page-hero has-art"><div class="wrap"><div class="ph-copy">${copy}</div><div class="ph-art">${art}</div></div></section>`
      : `<section class="page-hero"><div class="wrap">${copy}</div></section>`;
  },
  formLink: (ctx, form, extra = '') => ctx.l('/contact/#' + form + (extra ? '.' + extra : ''))
};

/* ---------- Layout ---------- */
function header(ctx, active) {
  const nav = [['Students', '/students/'], ['Colleges', '/colleges/'], ['Industry', '/industry/'], ['Mentors', '/mentors/']];
  const cur = (p) => (active && active.startsWith(p) ? ' aria-current="page"' : '');
  const mega = `<div class="mega" hidden>
      <div><h4>By offering</h4><ul>${programs.map((p) => `<li><a href="${ctx.l('/programs/' + p.slug + '/')}">${esc(p.name)}<small>${esc(p.short)}</small></a></li>`).join('')}</ul></div>
      <div><h4>By domain</h4><ul>${domains.map((d) => `<li><a href="${ctx.l('/domains/' + d.slug + '/')}">${esc(d.name)}<small>${esc(d.short)}</small></a></li>`).join('')}</ul>
      <h4 class="mt-1">Careers abroad</h4><ul><li><a href="${ctx.l('/careers-abroad/nursing-germany/')}">Nursing in Germany<small>Language, recognition, interviews and the move.</small></a></li></ul>
      <a class="all" href="${ctx.l('/programs/')}">All programs →</a></div></div>`;
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap">
  <a class="logo" href="${ctx.l('/')}">${logoSVG()}</a>
  <nav class="nav" aria-label="Main">
    ${nav.map(([t, h]) => `<a href="${ctx.l(h)}"${cur(h)}>${t}</a>`).join('')}
    <div class="has-menu"><button type="button" aria-expanded="false"${active && (active.startsWith('/programs') || active.startsWith('/domains')) ? ' aria-current="page"' : ''}>Programs</button>${mega}</div>
    <a href="${ctx.l('/opportunities/')}"${cur('/opportunities')}>Opportunities</a>
    <a href="${ctx.l('/about/')}"${cur('/about')}>About</a>
    <a class="btn btn-primary" href="${ctx.l('/contact/')}">Talk to us</a>
  </nav>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="drawer">Menu</button>
</div>
<div class="drawer" id="drawer" hidden><div class="wrap">
  <span class="group">For you</span>
  ${nav.map(([t, h]) => `<a href="${ctx.l(h)}">${t}</a>`).join('')}
  <span class="group">Programs</span>
  ${programs.map((p) => `<a class="sub" href="${ctx.l('/programs/' + p.slug + '/')}">${esc(p.name)}</a>`).join('')}
  <span class="group">Domains</span>
  ${domains.map((d) => `<a class="sub" href="${ctx.l('/domains/' + d.slug + '/')}">${esc(d.name)}</a>`).join('')}
  <span class="group">Careers abroad</span>
  <a class="sub" href="${ctx.l('/careers-abroad/nursing-germany/')}">Nursing in Germany</a>
  <span class="group">Digitaleem</span>
  <a href="${ctx.l('/opportunities/')}">Opportunities</a><a href="${ctx.l('/about/')}">About</a>
  <a class="btn btn-primary" href="${ctx.l('/contact/')}">Talk to us</a>
</div></div></header>`;
}

function footer(ctx) {
  const col = (h, links) => `<div><h4>${h}</h4><ul>${links.map(([t, href]) => `<li><a href="${ctx.l(href)}">${esc(t)}</a></li>`).join('')}</ul></div>`;
  const contact = [];
  if (SITE.email) contact.push(`<span>${esc(SITE.email)}</span>`);
  if (SITE.phone) contact.push(`<span>${esc(SITE.phone)}</span>`);
  const social = SITE.socials.length ? `<ul class="tags">${SITE.socials.map(([n, u]) => `<li><a class="tag" href="${esc(u)}" rel="noopener">${esc(n)}</a></li>`).join('')}</ul>` : '';
  return `<footer class="site-footer"><div class="ikat" aria-hidden="true"></div><div class="wrap">
  <div class="footer-top">
    <div class="footer-brand"><a class="logo" href="${ctx.l('/')}">${logoSVG('Digitaleem')}</a>
      <p>From learning to work, in India and abroad. Digitaleem connects students, colleges, industry and professionals.</p>
      ${contact.length ? `<div class="footer-contact">${contact.join('')}</div>` : ''}${social}</div>
    ${col('For you', [['Students', '/students/'], ['Colleges & institutions', '/colleges/'], ['Industry & employers', '/industry/'], ['Mentors & trainers', '/mentors/']])}
    ${col('Programs', programs.map((p) => [p.name, '/programs/' + p.slug + '/']))}
    ${col('Domains', [...domains.map((d) => [d.name, '/domains/' + d.slug + '/']), ['All domains', '/domains/'], ['Careers abroad', '/careers-abroad/']])}
    ${col('Digitaleem', [['About', '/about/'], ['How it works', '/about/how-it-works/'], ['Team', '/about/team/'], ['Opportunities', '/opportunities/'], ['FAQ', '/faq/'], ['Contact', '/contact/']])}
  </div>
  <div class="footer-bottom"><span>© <span data-year>2026</span> Digitaleem. digitaleem.co</span>
    <span><a href="${ctx.l('/privacy/')}">Privacy</a> · <a href="${ctx.l('/terms/')}">Terms</a> · <a href="${ctx.l('/refund-policy/')}">Refund &amp; cancellation</a></span></div>
</div></footer>`;
}

const FONTS = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap';

function layout(ctx, page) {
  const title = page.title === 'Digitaleem' ? page.title : `${page.title} · Digitaleem`;
  const canonical = SITE.url + (page.path === '/404' ? '/' : page.path);
  const scripts = ['assets/js/config.js', 'assets/js/forms.js', 'assets/data/opportunities.js', 'assets/js/site.js'];
  const headInner = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Digitaleem">
<meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${SITE.url}/assets/img/og-image.png">
<meta name="theme-color" content="#111A33">
<link rel="icon" href="${ctx.a('assets/img/favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${ctx.a('assets/css/site.css')}">${page.jsonld ? `\n<script type="application/ld+json">${JSON.stringify(page.jsonld)}</script>` : ''}`;
  const bodyInner = `${header(ctx, page.path)}
<main id="main">
${page.body}
</main>
${footer(ctx)}
${scripts.map((s) => `<script src="${ctx.a(s)}"></script>`).join('\n')}`;
  // The preview host wraps its entry page in its own document, so the home page is emitted as a fragment there.
  if (MODE === 'preview' && page.path === '/') {
    return `<title>Digitaleem</title>\n<link rel="stylesheet" href="${FONTS}">\n<link rel="stylesheet" href="assets/css/site.css">\n${bodyInner}\n`;
  }
  return `<!doctype html>
<html lang="en-IN">
<head>
${headInner}
</head>
<body>
${bodyInner}
</body>
</html>
`;
}

/* ---------- Build ---------- */
function rmrf(p) { if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true }); }
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) {
    const s = path.join(from, f), d = path.join(to, f);
    if (fs.statSync(s).isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

const pages = require('./pages')({ C, P, D, programs, domains, AUD, SITE, esc, logoSVG, ART });
rmrf(OUT);
if (MODE === 'wp') buildTheme(); else buildStatic();

function buildStatic() {
  copyDir(path.join(SRC, 'assets'), path.join(OUT, 'assets'));
  const urls = [];
  for (const page of pages) {
    const ctx = makeCtx(page.path);
    const html = layout(ctx, { ...page, body: page.body(ctx) });
    const file = page.path === '/404' ? path.join(OUT, '404.html') : path.join(OUT, page.path, 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    if (page.path !== '/404' && !page.noindex) urls.push(page.path);
  }
  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE.url}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
  console.log(`Built ${pages.length} pages into ${path.relative(process.cwd(), OUT) || OUT} (${MODE})`);
}

/* The WordPress theme: hand-written PHP from src/wp, plus the header, footer and every page generated from the same source as the static site. */
function buildTheme() {
  copyDir(path.join(SRC, 'wp'), OUT);
  for (const dir of ['css', 'js', 'img']) copyDir(path.join(SRC, 'assets', dir), path.join(OUT, 'assets', dir));
  fs.rmSync(path.join(OUT, 'assets', 'js', 'config.js'), { force: true });
  const ctx = makeCtx('/');
  const parts = path.join(OUT, 'parts');
  fs.mkdirSync(parts, { recursive: true });
  fs.writeFileSync(path.join(parts, 'header.html'), header(ctx, null));
  // Contact details in the footer come from Settings > Digitaleem, so the generated block is replaced by a marker.
  fs.writeFileSync(path.join(parts, 'footer.html'), footer(ctx).replace(/<div class="footer-contact">[\s\S]*?<\/div>/, '').replace('</p>\n      ', '</p>\n      <!--dgt:contact-->'));
  const content = [];
  for (const page of pages) {
    const body = page.body(makeCtx(page.path)).trim();
    if (page.path === '/404') { fs.writeFileSync(path.join(parts, '404.html'), body); continue; }
    const segs = page.path.split('/').filter(Boolean);
    content.push({
      path: page.path,
      slug: segs.length ? segs[segs.length - 1] : 'home',
      parent: segs.length > 1 ? '/' + segs.slice(0, -1).join('/') + '/' : '',
      title: page.title === 'Digitaleem' ? 'Home' : page.title,
      description: page.description,
      noindex: !!page.noindex,
      jsonld: page.jsonld || null,
      content: body
    });
  }
  fs.mkdirSync(path.join(OUT, 'content'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'content', 'pages.json'), JSON.stringify(content));
  const style = fs.readFileSync(path.join(OUT, 'style.css'), 'utf8').replace('{{VERSION}}', THEME_VERSION);
  fs.writeFileSync(path.join(OUT, 'style.css'), style);
  console.log(`Built the WordPress theme with ${content.length} pages into ${path.relative(process.cwd(), OUT)}`);
}
