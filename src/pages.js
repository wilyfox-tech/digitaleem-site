/* Every page on digitaleem.co. Each entry: path, title, description, body(ctx). */
'use strict';

module.exports = function ({ C, P, D, programs, domains, AUD, SITE, esc, ART }) {
  const pages = [];
  const add = (p) => pages.push(p);

  /* ---------- Shared content ---------- */
  const STAGES = [
    { name: 'Education', if: 'You are studying and want to make the most of the years before you graduate.',
      do: 'Start building practical skills alongside your course, and talk to people who work in your field.',
      next: [['training', 'Training', 'Learn a skill from the foundations'], ['workshops', 'Workshops', 'Try a field in one focused session'], ['mentoring', 'Mentoring', 'Ask someone who does the work']] },
    { name: 'Skill development', if: 'You know your subject in theory, but have not used it on practical problems.',
      do: 'Take structured training in your field, with labs and a project in every program.',
      next: [['training', 'Training', 'Live sessions, labs and a project'], ['@domains', 'Explore domains', 'IT, engineering, business and healthcare']] },
    { name: 'Practical application', if: 'You have the knowledge, but nothing you have built or solved to show for it.',
      do: 'Work on a real problem, with a mentor, and finish with work that has been evaluated.',
      next: [['projects', 'Projects', 'From a problem brief to evaluated work']] },
    { name: 'Experience', if: 'You have done projects and now need time inside a real workplace.',
      do: 'Get an internship at a partner company, or industrial training at a plant or site.',
      next: [['internships', 'Internships', 'Real responsibility at partner companies'], ['industrial-training', 'Industrial training', 'Time inside plants and factories']] },
    { name: 'Assessment', if: 'You want to know honestly where you stand before you apply.',
      do: 'Take aptitude, technical and communication assessments, and get your project work evaluated.',
      next: [['interview-prep', 'Interview & career prep', 'Assessments with clear feedback'], ['projects', 'Projects', 'Have your work evaluated by a professional']] },
    { name: 'Career preparation', if: 'You will apply soon and want to walk into interviews ready.',
      do: 'Get your resume reviewed, practise mock interviews and learn to explain your projects well.',
      next: [['interview-prep', 'Interview & career prep', 'Mock interviews and resume review'], ['mentoring', 'Mentoring', 'Career conversations with professionals']] },
    { name: 'Employment', if: 'You are ready to work and looking for the right opening.',
      do: 'Apply for internships and jobs listed by companies that work with Digitaleem.',
      next: [['@opps', 'Opportunities', 'Open internships and jobs'], ['interview-prep', 'Interview prep', 'One last practice before the real one']] }
  ];


  const NURSE_FAQ = [
    ['Do I need to speak German before I start?', 'No. Most nurses start from the first word. We teach German from A1 up to the B1 or B2 level that the route needs.'],
    ['Who can apply?', 'Nurses with a B.Sc Nursing, Post Basic B.Sc, M.Sc Nursing or GNM, registered with a State Nursing Council. Experience helps, and many employers prefer it. Send an enquiry and we will tell you honestly whether the route fits you now.'],
    ['How long does the whole route take?', 'It depends mostly on how quickly you reach the German level you need. Language learning is usually the longest step. After your first call we give you a realistic plan with each step in order.'],
    ['Do I pay a placement fee?', 'No. Digitaleem does not charge nurses a placement fee. Recruitment costs are paid by the employer.'],
    ['Who pays for the German course?', 'That depends on the employer and the route. We explain every cost, and who covers it, before you commit to anything.'],
    ['What is recognition?', 'Germany checks that your nursing qualification matches its own standard. This is called recognition (Anerkennung). If parts are missing, you complete an adaptation period or a knowledge exam in Germany, and you can work as a nursing assistant meanwhile.'],
    ['Is Germany the only country?', 'Germany is our first route abroad. We will add other countries only when we can prepare people for them properly.']
  ];

  const stageLink = (ctx, slug) => slug === '@domains' ? ctx.l('/domains/') : slug === '@opps' ? ctx.l('/opportunities/') : ctx.l('/programs/' + slug + '/');

  const starter = (ctx, id = 'start') => `<div class="starter" data-starter>
    <ul class="stage-list" role="tablist" aria-label="Where are you starting?" aria-orientation="vertical">
      ${STAGES.map((s, i) => `<li role="presentation"><button type="button" role="tab" id="${id}-tab-${i + 1}" aria-controls="${id}-panel-${i + 1}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="num">${i + 1}</span>${esc(s.name)}</button></li>`).join('')}
    </ul>
    ${STAGES.map((s, i) => `<div class="stage-panel" role="tabpanel" id="${id}-panel-${i + 1}" aria-labelledby="${id}-tab-${i + 1}"${i ? ' hidden' : ''}>
      <p class="eyebrow">Stage ${i + 1} of 7 · ${esc(s.name)}</p>
      <p class="if">${esc(s.if)}</p>
      <h3>${esc(s.do)}</h3>
      <div class="next">${s.next.map(([slug, t, sub]) => `<a href="${stageLink(ctx, slug)}"><span>${esc(t)}<small>${esc(sub)}</small></span></a>`).join('')}</div>
    </div>`).join('')}
  </div>`;

  // The journey drawn as the Digitaleem "D": up through learning (ink), round into work (green).
  const journeySVG = (ctx, startHash = '#start') => {
    const cx = 250, cy = 250, r = 190;
    const pt = (deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
    const nodes = [
      { xy: [90, 300], lx: 116, ly: 306, anchor: 'start' },
      { xy: [90, 165], lx: 116, ly: 171, anchor: 'start' },
      { xy: pt(-58), lx: pt(-58)[0] + 22, ly: pt(-58)[1] - 8, anchor: 'start' },
      { xy: pt(-14), lx: pt(-14)[0] + 24, ly: pt(-14)[1] + 6, anchor: 'start' },
      { xy: pt(30), lx: pt(30)[0] + 24, ly: pt(30)[1] + 10, anchor: 'start', work: true },
      { xy: pt(68), lx: pt(68)[0] + 6, ly: pt(68)[1] + 52, anchor: 'start', work: true },
      { xy: [205, 440], lx: 205, ly: 488, anchor: 'middle', work: true }
    ];
    return `<div class="journey-vis"><svg viewBox="0 0 640 520" role="img" aria-labelledby="jv-t"><title id="jv-t">The seven stages from education to employment, drawn as the Digitaleem D</title>
      <path class="jl-base" d="M90 370V60h160a190 190 0 0 1 190 190" fill="none" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="jl-work" d="M440 250a190 190 0 0 1-190 190h-60" fill="none" stroke-width="22" stroke-linecap="round"/>
      <circle class="jl-start" cx="90" cy="445" r="20"/>
      <text x="90" y="490" class="n" text-anchor="middle">You start</text><text x="90" y="506" class="n" text-anchor="middle">here</text>
      ${nodes.map((n, i) => `<a href="${startHash.replace('start', 'stage-' + (i + 1))}" aria-label="Stage ${i + 1}: ${esc(STAGES[i].name)}"><circle class="jl-node${n.work ? ' work' : ''}" cx="${n.xy[0].toFixed(1)}" cy="${n.xy[1].toFixed(1)}" r="9"/>
        <text class="n" x="${n.lx.toFixed(1)}" y="${(n.ly - 17).toFixed(1)}" text-anchor="${n.anchor}">0${i + 1}</text><text x="${n.lx.toFixed(1)}" y="${n.ly.toFixed(1)}" text-anchor="${n.anchor}">${esc(STAGES[i].name)}</text></a>`).join('')}
    </svg></div>`;
  };

  const ecosystem = () => {
    const box = (x, y, t, sub) => `<g class="node"><rect x="${x}" y="${y}" width="210" height="84" rx="14"/><text x="${x + 20}" y="${y + 36}">${t}</text><text class="sub" x="${x + 20}" y="${y + 60}">${sub}</text></g>`;
    return `<div class="eco"><svg viewBox="0 0 860 470" role="img" aria-labelledby="eco-t"><title id="eco-t">Students, colleges, industry and professionals, each connected through Digitaleem</title>
      <path class="link" d="M220 112 L390 205"/><path class="link" d="M640 112 L470 205"/><path class="link" d="M640 358 L470 265"/><path class="link" d="M220 358 L390 265"/>
      <path class="link" d="M225 70 H635"/><path class="link" d="M225 400 H635"/><path class="link" d="M115 112 V358"/><path class="link" d="M745 112 V358"/>
      <g class="hub"><circle cx="430" cy="235" r="66"/><text x="430" y="242" text-anchor="middle">Digitaleem</text></g>
      ${box(10, 28, 'Students', 'Learn, build, gain experience')}
      ${box(640, 28, 'Colleges', 'Universities, polytechnics, ITIs')}
      ${box(640, 358, 'Industry', 'Companies, plants, hospitals')}
      ${box(10, 358, 'Professionals', 'Trainers, mentors, experts')}
      <text class="flow" x="430" y="60" text-anchor="middle">study at</text>
      <text class="flow" x="430" y="426" text-anchor="middle">bring practitioners</text>
      <text class="flow" x="126" y="240">mentor</text><text class="flow" x="754" y="240">partner</text>
      <text class="flow" x="250" y="150">training, projects,</text><text class="flow" x="250" y="166">internships, prep</text>
      <text class="flow" x="610" y="150" text-anchor="end">workshops, programs,</text><text class="flow" x="610" y="166" text-anchor="end">visits, placements</text>
      <text class="flow" x="610" y="318" text-anchor="end">talent, problem statements,</text><text class="flow" x="610" y="334" text-anchor="end">workforce training</text>
      <text class="flow" x="250" y="318">teaching, mentoring,</text><text class="flow" x="250" y="334">evaluation</text>
    </svg>
    <ul class="eco-list grid">
      <li class="card"><h3>Students</h3><p>Get training, projects, internships and interview prep through Digitaleem.</p></li>
      <li class="card"><h3>Colleges</h3><p>Bring workshops, industry programs, visits and placement prep to campus.</p></li>
      <li class="card"><h3>Industry</h3><p>Find talent, share problem statements and train your workforce.</p></li>
      <li class="card"><h3>Professionals</h3><p>Teach, mentor and evaluate the next generation in your field.</p></li>
    </ul></div>`;
  };

  const forWhoBlock = (ctx, p) => `<div class="grid ${Object.keys(p.forWho).length > 2 ? (Object.keys(p.forWho).length === 4 ? 'g4' : 'g3') : 'g2'}">${Object.entries(p.forWho).map(([k, v]) => `<a class="card door" href="${ctx.l(AUD[k].path)}">${C.icon(AUD[k].icon)}<span class="who">For ${AUD[k].name.toLowerCase()}</span><p>${esc(v)}</p><span class="more">${AUD[k].name} page</span></a>`).join('')}</div>`;

  const ticker = () => {
    const pick = (d, idx) => idx.map((i) => [d.slug, d.fields[i]]).filter((x) => x[1]);
    const mix = (...ls) => { const out = []; for (let i = 0; i < Math.max(...ls.map((x) => x.length)); i++) ls.forEach((x) => x[i] && out.push(x[i])); return out; };
    const row1 = mix(pick(D.it, [0, 3, 5, 7, 8, 11, 13]), pick(D.engineering, [0, 1, 4, 11, 13, 14, 15]), pick(D.business, [0, 2, 4, 6]), pick(D.healthcare, [0, 1, 4, 10]));
    const row2 = mix(pick(D.engineering, [2, 3, 6, 9, 10, 12, 16]), pick(D.it, [1, 2, 4, 6, 9, 10, 14]), pick(D.business, [1, 3, 5, 7, 8]), pick(D.healthcare, [2, 3, 5, 7]));
    const track = (items) => { const h = items.map(([d, t]) => `<span class="d-${d}">${esc(t)}</span>`).join(''); return `<div class="ticker-track">${h}${h}</div>`; };
    return `<div class="ticker" aria-hidden="true"><div class="ticker-row">${track(row1)}</div><div class="ticker-row rev">${track(row2)}</div>
      <div class="ticker-key"><span><i style="background:var(--green)"></i>IT &amp; Digital</span><span><i style="background:var(--turmeric)"></i>Engineering &amp; Industrial</span><span><i style="background:var(--ink-2)"></i>Business &amp; Management</span><span><i style="background:var(--band-accent)"></i>Healthcare &amp; Nursing</span></div></div>`;
  };

  const record = () => `<figure class="record" aria-label="An example of a student's record of work">
    <div class="rec-head"><span class="avatar" aria-hidden="true">ES</span><div><strong>Example student</strong><span>B.Tech Mechanical · 4th year</span></div><span class="badge">Example</span></div>
    <div class="rec-row"><span class="rec-k">Project</span><div><strong>Cutting changeover time on a CNC line</strong><span>Brief from a manufacturing company · team of 3</span><div class="meter" aria-hidden="true"><i style="--v:85%"></i></div><small>Evaluated by an industry mentor · 8.5 / 10</small></div></div>
    <div class="rec-row"><span class="rec-k">Internship</span><div><strong>Production intern</strong><span>8 weeks · on-site</span></div></div>
    <div class="rec-row"><span class="rec-k">Assessments</span><div class="rec-chips"><span>Technical 82%</span><span>Aptitude 76%</span><span>Communication 71%</span></div></div>
    <blockquote>“Clear root-cause analysis. Next, practise presenting the cost impact to a plant manager.”<cite>Mentor feedback</cite></blockquote>
    <figcaption>An illustration of the evidence a student builds. The name and numbers are made up.</figcaption>
  </figure>`;


  const abroadBand = (ctx) => `<section class="section band"><div class="wrap art-split">
  <figure>${ART.abroad()}</figure>
  <div class="stack" style="gap:1.25rem">
    <p class="eyebrow">Careers abroad</p>
    <h2>Some careers start in <span class="hl">another country.</span></h2>
    <p class="lead">Germany needs nurses, and Indian nurses are well placed to fill those roles. Digitaleem prepares you for the whole route: the language, recognition of your degree, interviews with employers and the move itself.</p>
    <div class="btn-row">${C.btn(ctx.l('/careers-abroad/nursing-germany/'), 'Nursing careers in Germany')}${C.btn(ctx.l('/programs/language/'), 'Language for work', 'ghost')}</div>
  </div>
</div></section>`;

  /* ================= HOME ================= */
  add({
    path: '/', title: 'Digitaleem',
    description: 'Digitaleem connects students, colleges, industry and professionals across the gap between education and employment. Training, projects, internships, interview prep and careers abroad, in IT, engineering, business and healthcare.',
    jsonld: { '@context': 'https://schema.org', '@type': 'Organization', name: 'Digitaleem', url: SITE.url, logo: SITE.url + '/assets/img/favicon.svg', areaServed: 'India', email: SITE.email || undefined },
    body: (ctx) => `
<section class="hero"><div class="wrap hero-grid">
  <div class="hero-copy">
    <p class="eyebrow">Education to employment</p>
    <h1>Learn it. Apply it. <span class="hl">Prove it.</span> Get hired.</h1>
    <p class="lead">Digitaleem connects students, colleges, industry and professionals so that learning turns into work. Training, real projects, internships, interview preparation and careers abroad, in IT, engineering, business and healthcare.</p>
    <div class="btn-row"><a class="btn btn-primary" href="#start"><span class="arrow">Find where to start</span></a><a class="btn btn-ghost" href="${ctx.l('/contact/')}">Talk to us</a></div>
  </div>
  ${journeySVG(ctx)}
</div></section>
${ticker()}

<section class="section band"><div class="wrap split">
  <div class="stack" style="gap:1.25rem">
    <p class="eyebrow">The gap</p>
    <p class="statement">A degree says what you studied. Employers want to see <span class="hl">what you can do.</span></p>
    <p class="lead">Between finishing a course and doing well at work there is a long stretch that most students cross alone. Digitaleem works in that stretch.</p>
  </div>
  <ul class="gap-list">
    <li><span class="have">Students understand the theory</span><span class="missing">have not solved practical problems</span></li>
    <li><span class="have">They hold certificates</span><span class="missing">have no meaningful projects</span></li>
    <li><span class="have">They complete internships</span><span class="missing">gain little real experience</span></li>
    <li><span class="have">They reach final year</span><span class="missing">have barely met anyone from their industry</span></li>
    <li><span class="have">They know the subject</span><span class="missing">struggle to show it in an interview</span></li>
  </ul>
</div></section>

<section class="section" id="start"><div class="wrap">
  ${C.head('Where are you starting?', 'Everyone starts from a different place.', 'Pick the stage that sounds most like you. You can join Digitaleem at any of them, and move on when you are ready.')}
  ${starter(ctx)}
</div></section>

<section class="section section-sunk"><div class="wrap">
  ${C.head('Who it is for', 'Four groups, one connected system.', 'Students cannot get experience without industry, industry cannot find talent without colleges, and colleges need professionals to teach what the workplace expects. Digitaleem works with all four.')}
  <div class="grid g4">
    <a class="card door" href="${ctx.l('/students/')}">${C.icon('cap')}<span class="who">Students</span><h3>Build proof of what you can do.</h3><ul><li>Skills and training</li><li>Real projects</li><li>Internships</li><li>Interview prep</li></ul><span class="more">For students</span></a>
    <a class="card door" href="${ctx.l('/colleges/')}">${C.icon('building')}<span class="who">Colleges & institutions</span><h3>Bring industry to your campus.</h3><ul><li>Workshops</li><li>Industrial training</li><li>Live projects</li><li>Placement prep</li></ul><span class="more">For colleges</span></a>
    <a class="card door" href="${ctx.l('/industry/')}">${C.icon('gear')}<span class="who">Industry & employers</span><h3>Meet talent before you hire.</h3><ul><li>Hire interns and graduates</li><li>Train your team</li><li>Share problem statements</li><li>Work with colleges</li></ul><span class="more">For industry</span></a>
    <a class="card door" href="${ctx.l('/mentors/')}">${C.icon('chat')}<span class="who">Professionals</span><h3>Pass on what you know.</h3><ul><li>Teach and train</li><li>Mentor students</li><li>Evaluate projects</li><li>Run mock interviews</li></ul><span class="more">For mentors</span></a>
  </div>
</div></section>

<section class="section"><div class="wrap">
  ${C.head('Programs', 'Nine ways to close the gap.', 'Each program is a different kind of step, from a single workshop to German for a job abroad or a long-term college-industry partnership.', 'split')}
  <div class="grid g3">${programs.map((p) => C.programCard(ctx, p)).join('')}</div>
</div></section>

<section class="section section-sunk"><div class="wrap">
  ${C.head('Domains', 'Four fields of work. <span class="hl">Not just IT.</span>', 'Most career platforms stop at software. Digitaleem also works with engineering, manufacturing and technical trades, with business and management, and with nurses, because that is where so much of the work is.')}
  <div class="grid g2">${domains.map((d) => C.domainCard(ctx, d)).join('')}</div>
</div></section>

${abroadBand(ctx)}

<section class="section"><div class="wrap">
  ${C.head('How it fits together', 'Everyone gains when the four groups talk earlier.', 'Industry usually meets students at the end of a degree. Through Digitaleem, companies set problems, mentor, host visits and evaluate work while students are still learning.')}
  ${ecosystem()}
  <p class="mt-2"><a class="textlink" href="${ctx.l('/about/how-it-works/')}">How Digitaleem works</a></p>
</div></section>

<section class="section section-sunk"><div class="wrap split" style="align-items:center">
  <div class="stack" style="gap:1.25rem">
    <p class="eyebrow">Evidence, not just certificates</p>
    <h2>Leave with work you can show an employer.</h2>
    <p class="lead">Every Digitaleem program ends with something concrete: a project that was evaluated, feedback from a mentor, an internship you can talk about, an assessment that shows your level.</p>
    ${C.checks(['<strong>Projects</strong> built against a real brief, reviewed and evaluated', '<strong>Mentor feedback</strong> from professionals in your field', '<strong>Internships and industrial training</strong> in real workplaces', '<strong>Assessments</strong> and interview practice with people who hire'])}
  </div>
  ${record()}
</div></section>

<section class="section"><div class="wrap art-split">
  <figure>${ART.colleges()}</figure>
  <div class="stack" style="gap:1.25rem">
    <p class="eyebrow">Who we work with</p>
    <h2>Built for the places that teach, and the places that hire.</h2>
    ${C.tags(['Universities', 'Engineering colleges', 'Management institutes', 'Nursing colleges', 'Polytechnics', 'ITIs', 'Skill institutes', 'Startups', 'MSMEs', 'Manufacturers', 'Construction companies', 'Hospitals', 'Employers abroad', 'Large enterprises'])}
    <p class="muted">Programs run online from launch, so you can join wherever you study or work. Offline centres will open in stages.</p>
  </div>
</div></section>

${C.cta(ctx, 'Tell us where you are. We will help with the next step.', 'Whether you are a student, a college, a company or a professional, one short form gets you to the right person.', ctx.l('/contact/'), 'Talk to us')}
`
  });

  /* ================= STUDENTS ================= */
  add({
    path: '/students/', title: 'For students',
    description: 'Training, real projects, internships, interview preparation and careers abroad for students and graduates in IT, engineering, business and healthcare. Start at the stage that fits you.',
    body: (ctx) => `
${C.pageHero(ctx, [['Students']], 'For students & graduates', 'Your degree is the start. <span class="hl">Here is what comes next.</span>', 'Employers hire people who can show what they can do. Digitaleem helps you build that proof: skills, projects, real work experience and the confidence to explain it all in an interview.', C.btn(C.formLink(ctx, 'student'), 'Tell us where you are') + C.btn('#stage-1', 'Find your stage', 'ghost'), ART.students())}

<section class="section"><div class="wrap">
  ${C.head('Where are you starting?', 'Start where you are, not at the beginning.', 'Some students need foundations. Others already have skills and need a project, an internship or interview practice. Pick your stage.')}
  ${starter(ctx, 'stage')}
</div></section>

<section class="section section-sunk"><div class="wrap split" style="align-items:center">
  <div class="stack" style="gap:1.25rem"><p class="eyebrow">What you leave with</p><h2>Proof of ability, not just attendance.</h2><p class="lead">When an interviewer asks what you have done, you will have real answers.</p>
  ${C.checks(['<strong>Practical skills</strong> in your field, learned with real tools', '<strong>Projects</strong> you built against a brief, with an evaluation', '<strong>Workplace experience</strong> from internships and industrial training', '<strong>Feedback</strong> from mentors who work in your industry', '<strong>Interview practice</strong> with professionals, and specific feedback'])}</div>
  ${record()}
</div></section>

<section class="section"><div class="wrap">
  ${C.head('Programs for students', 'Pick the step you need.', '')}
  <div class="grid g3">${['training', 'projects', 'internships', 'industrial-training', 'interview-prep', 'language'].map((s) => C.programCard(ctx, P[s])).join('')}</div>
</div></section>

<section class="section section-sunk"><div class="wrap">
  ${C.head('Your field', 'Whatever you are studying.', 'B.Tech, diploma, ITI, MBA, BBA, B.Com, BCA, B.Sc or B.Sc Nursing: there is a path for your field.')}
  <div class="grid g2">${domains.map((d) => C.domainCard(ctx, d)).join('')}</div>
</div></section>

<section class="section"><div class="wrap">
  ${C.head('How to start', 'Four steps, no payment online.', '')}
  ${C.stepsH([['Tell us where you are', 'Fill in a short form about your course, your field and what you need.'], ['We call you', 'Someone from our team calls to understand your goals.'], ['You get a plan', 'We recommend the programs that fit, with fees and dates.'], ['You start', 'Programs run online, so you can join from wherever you are.']])}
</div></section>

<section class="section section-sunk"><div class="wrap">
  ${C.head('Questions', 'What students ask us.', '')}
  ${C.faq([
    ['Who can join?', 'Students in any year of a degree, diploma or ITI course, recent graduates, qualified nurses, and early-career professionals who want to move into a new field.'],
    ['Is Digitaleem only for IT students?', 'No. We work with engineering, polytechnic and ITI students in core branches, with business and management students and with nurses, as well as IT.'],
    ['Can you help me work abroad?', `Yes, starting with nursing in Germany. See <a href="${ctx.l('/careers-abroad/nursing-germany/')}">nursing careers in Germany</a> and <a href="${ctx.l('/programs/language/')}">Language for work</a>.`],
    ['Do you guarantee a job?', 'No one can honestly guarantee a job. What we do is help you build skills, projects and experience that employers look for, prepare you for interviews, and connect you with companies that are hiring.'],
    ['How much does it cost?', 'It depends on the program. We share fees on the call after your enquiry. There is no payment on this website.'],
    ['Are programs online or offline?', 'Programs run online at launch. Internships and industrial training take place where the host company works. Offline centres will open in stages.']
  ])}
</div></section>

${C.cta(ctx, 'Tell us where you are starting.', 'Answer a few questions and we will call you with a plan that fits.', C.formLink(ctx, 'student'), 'Start your enquiry')}
`
  });

  /* ================= COLLEGES ================= */
  const INTERVENTIONS = [['Student training', 'training'], ['Technical workshops', 'workshops'], ['Non-technical workshops', 'workshops'], ['Industry and expert sessions', 'college-industry'], ['Industrial visits', 'industrial-training'], ['Industrial training', 'industrial-training'], ['Internships', 'internships'], ['Live and industry projects', 'projects'], ['Skill assessments', 'interview-prep'], ['Placement and interview prep', 'interview-prep'], ['Employer interaction', 'college-industry'], ['Industry collaboration', 'college-industry']];
  add({
    path: '/colleges/', title: 'For colleges and institutions',
    description: 'Workshops, industrial training, live projects, internships and placement preparation for universities, engineering and management colleges, polytechnics and ITIs.',
    body: (ctx) => `
${C.pageHero(ctx, [['Colleges']], 'For colleges & institutions', 'Bring industry into your <span class="hl">campus</span>, every semester.', 'Your students learn the syllabus. Digitaleem adds what the workplace expects: practitioners in the classroom, real projects, time in industry and preparation for placements.', C.btn(C.formLink(ctx, 'college'), 'Request a proposal'), ART.colleges())}

<section class="section"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">Who we work with</p><h2>Every kind of institution that prepares people for work.</h2></div>
  ${C.tags(['Universities', 'Engineering colleges', 'Management institutes', 'Nursing colleges', 'Degree colleges', 'Polytechnics', 'ITIs', 'Skill development institutes'])}
</div></section>

<section class="section section-sunk"><div class="wrap">
  ${C.head('Engagement models', 'Start small or plan for years.', 'An engagement can be one activity or a long-term partnership with many parts. Most colleges start with one and grow.')}
  <div class="grid g3">
    <div class="card"><span class="eyebrow">Single activity</span><h3>One workshop, session or visit</h3><p>A focused intervention for one batch or department. A good way to see how we work.</p></div>
    <div class="card"><span class="eyebrow">Semester program</span><h3>A plan for one semester</h3><p>Training, a project and an assessment, scheduled around your academic calendar.</p></div>
    <div class="card"><span class="eyebrow">Partnership</span><h3>A multi-year relationship</h3><p>Industry sessions, projects, visits, internships and placement prep, planned year by year.</p></div>
  </div>
</div></section>

<section class="section"><div class="wrap">
  ${C.head('What we can arrange', 'Choose what your students need.', '')}
  <div class="grid g4">${INTERVENTIONS.map(([t, slug]) => `<a class="card" href="${ctx.l('/programs/' + slug + '/')}"><h3>${esc(t)}</h3><span class="more">${esc(P[slug].name)}</span></a>`).join('')}</div>
</div></section>

<section class="section section-sunk"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">How we work with you</p><h2>From first call to outcome report.</h2><p class="lead">Digitaleem coordinates the trainers, companies and schedules, so your team does not have to.</p></div>
  ${C.steps([['Understand', 'We meet your principal, HoD or placement officer to understand your students, branches and goals.'], ['Propose', 'You get a written proposal with activities, dates, people and costs.'], ['Deliver', 'We run the activities and keep you informed.'], ['Report', 'You receive participation, assessment and project results for your records.']])}
</div></section>

<section class="section"><div class="wrap">
  ${C.head('Questions', 'What colleges ask us.', '')}
  ${C.faq([
    ['Can you align activities with our syllabus?', 'Yes. Tell us the branch, semester and subjects, and we plan workshops and projects around them.'],
    ['Do you work with polytechnics and ITIs?', 'Yes. Technical trades and diploma-level engineering are a core part of what we do.'],
    ['Do sessions happen on campus?', 'Sessions run online at launch. Industrial visits and internships take place at partner companies. On-campus formats will be added as we grow.'],
    ['Will we receive reports?', 'Yes. Every engagement ends with a report on participation, assessments and project results.']
  ])}
</div></section>

${C.cta(ctx, 'Plan something for your students.', 'Tell us about your institution, and we will send a proposal.', C.formLink(ctx, 'college'), 'Request a proposal')}
`
  });

  /* ================= INDUSTRY ================= */
  add({
    path: '/industry/', title: 'For industry and employers',
    description: 'Hire prepared interns and graduates, train your workforce, and work with colleges through problem statements, internships, visits and mentoring.',
    body: (ctx) => `
${C.pageHero(ctx, [['Industry']], 'For industry & employers', 'Meet your next hires <span class="hl">before</span> you hire them.', 'Companies usually meet graduates at the very end of their education. Through Digitaleem you can shape skills earlier, see candidates at work on real problems, and train your own team.', C.btn(C.formLink(ctx, 'hire'), 'Post a requirement') + C.btn(C.formLink(ctx, 'collaborate'), 'Share a problem statement', 'ghost'), ART.industry())}

<section class="section"><div class="wrap">
  ${C.head('Ways to work with us', 'Hire, train, collaborate or recruit nurses.', '')}
  <div class="grid g4">
    <a class="card door" href="${ctx.l('/industry/hire/')}">${C.icon('briefcase')}<h3>Hire talent</h3><p>Interns, apprentices, trainees and entry-level hires whose training, projects and assessments you can see.</p><span class="more">Hire talent</span></a>
    <a class="card door" href="${ctx.l('/industry/workforce-training/')}">${C.icon('book')}<h3>Train your workforce</h3><p>Technical, digital and professional training for your team, designed around your work.</p><span class="more">Workforce training</span></a>
    <a class="card door" href="${ctx.l('/industry/collaborate/')}">${C.icon('link')}<h3>Collaborate with colleges</h3><p>Share problem statements, host interns and visits, mentor students and evaluate projects.</p><span class="more">Collaborate</span></a>
    <a class="card door" href="${ctx.l('/careers-abroad/nursing-germany/')}#employers">${C.icon('heart')}<h3>Recruit nurses</h3><p>For hospitals and care homes in Germany: nurses from India, prepared in language and practice.</p><span class="more">For employers abroad</span></a>
  </div>
</div></section>

<section class="section band"><div class="wrap split">
  <div class="stack" style="gap:1.25rem"><p class="eyebrow">Why get involved early</p><p class="statement">The best way to judge a candidate is to <span class="hl">see their work.</span></p></div>
  <ul class="gap-list">
    <li><span class="have">A resume lists skills</span><span class="missing">a project shows them</span></li>
    <li><span class="have">An interview takes an hour</span><span class="missing">an internship takes weeks</span></li>
    <li><span class="have">Graduates learn the syllabus</span><span class="missing">your problem statements teach your work</span></li>
  </ul>
</div></section>

<section class="section"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">Who we work with</p><h2>Companies of every size and sector.</h2><p class="lead">From two-person startups to large plants and hospitals, in India and abroad.</p></div>
  ${C.tags(['Startups', 'Technology companies', 'MSMEs', 'Manufacturing', 'Construction', 'Industrial organisations', 'Engineering services', 'Hospitals and care homes', 'Service businesses', 'Large enterprises'])}
</div></section>

${C.cta(ctx, 'Tell us what your business needs.', 'Hiring, training or working with colleges: one form gets you to the right person.', C.formLink(ctx, 'hire'), 'Talk to us')}
`
  });

  add({
    path: '/industry/hire/', title: 'Hire talent',
    description: 'Hire interns, apprentices, trainees and graduates whose projects, training and assessments you can see before you interview.',
    body: (ctx) => `
${C.pageHero(ctx, [['Industry', '/industry/'], ['Hire talent']], 'Hire talent', 'Hire people whose work you have <span class="hl">already seen.</span>', 'Tell us the role. We shortlist candidates who have trained, built projects and been assessed in that field, so your interviews start from evidence.', C.btn(C.formLink(ctx, 'hire'), 'Post a requirement'))}
<section class="section"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">Roles</p><h2>Entry-level roles across IT, engineering and business.</h2></div>
  ${C.checks(['Internships', 'Apprenticeships', 'Trainee and graduate engineer trainee positions', 'Entry-level jobs', 'Roles specific to your industry'])}
</div></section>
<section class="section section-sunk"><div class="wrap">
  ${C.head('How hiring works', 'From requirement to offer.', '')}
  ${C.stepsH([['Share the requirement', 'Roles, skills, number of openings, location and timeline.'], ['We shortlist', 'Candidates whose training, projects and assessments match the role.'], ['You interview', 'You see each candidate’s work before you meet them.'], ['You hire', 'You make the offer, on your terms.']])}
  <p class="mt-2 muted">With your permission, we also list the opening on <a href="${ctx.l('/opportunities/')}">Digitaleem Opportunities</a>, so students can apply directly.</p>
</div></section>
<section class="section"><div class="wrap">
  ${C.head('Before you hire', 'Want candidates trained for your role?', 'If the skills you need are hard to find, we can train a group of candidates for you first, or set a project that tests exactly what the role demands.')}
  <div class="btn-row">${C.btn(ctx.l('/industry/workforce-training/'), 'Workforce training', 'ghost')}${C.btn(ctx.l('/programs/projects/'), 'Industry projects', 'ghost')}</div>
</div></section>
${C.cta(ctx, 'Post a hiring requirement.', 'It takes about three minutes. We will call you to confirm the details.', C.formLink(ctx, 'hire'), 'Post a requirement')}
`
  });

  add({
    path: '/industry/workforce-training/', title: 'Workforce training',
    description: 'Technical, digital and professional training for your team, from AI and automation to PLC, quality and management.',
    body: (ctx) => `
${C.pageHero(ctx, [['Industry', '/industry/'], ['Workforce training']], 'Workforce training', 'Train your team for the <span class="hl">work you are doing next.</span>', 'New machines, new software and new ways of working all need new skills. Digitaleem designs training for your team around your processes, delivered by trainers from your industry.', C.btn(C.formLink(ctx, 'workforce'), 'Request a training proposal'))}
<section class="section"><div class="wrap">
  ${C.head('Training areas', 'Technical, digital and professional.', '')}
  <div class="grid g3">
    <div class="card">${C.icon('code')}<h3>Digital and technology</h3>${C.tags(['Digital transformation', 'AI and automation', 'Data and analytics', 'Business software', 'Cybersecurity awareness'])}</div>
    <div class="card">${C.icon('wrench')}<h3>Technical and industrial</h3>${C.tags(['PLC and industrial automation', 'CAD/CAM and CNC', 'Maintenance', 'Quality', 'Safety practices'])}</div>
    <div class="card">${C.icon('chart')}<h3>Management and professional</h3>${C.tags(['Team leadership', 'Operations', 'Sales and marketing', 'Communication', 'Workplace skills'])}</div>
  </div>
</div></section>
<section class="section section-sunk"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">How it works</p><h2>Designed around your team.</h2></div>
  ${C.steps([['Assess', 'We learn what your team does now and what it needs to do next.'], ['Design', 'A training plan with topics, trainers, schedule and cost.'], ['Train', 'Live sessions with practical exercises based on your work.'], ['Measure', 'An assessment at the end shows what changed.']])}
</div></section>
${C.cta(ctx, 'Plan training for your team.', 'Tell us the team size, the skills and the outcome you want.', C.formLink(ctx, 'workforce'), 'Request a proposal')}
`
  });

  add({
    path: '/industry/collaborate/', title: 'Collaborate with colleges',
    description: 'Share problem statements, host interns and industrial visits, mentor students and evaluate projects with colleges.',
    body: (ctx) => `
${C.pageHero(ctx, [['Industry', '/industry/'], ['Collaborate']], 'Collaborate with colleges', 'Help shape the graduates <span class="hl">you will hire.</span>', 'Give students a real problem, a day inside your plant or an hour of your expertise. Digitaleem finds the right colleges and students and handles the coordination.', C.btn(C.formLink(ctx, 'collaborate'), 'Share a problem statement'))}
<section class="section"><div class="wrap">
  ${C.head('Ways to take part', 'Pick what suits your time.', '')}
  <div class="grid g3">
    ${[['Share a problem statement', 'Students work on a real problem from your business, with a mentor, and present the results.', 'projects'], ['Host interns', 'Take on interns who have been prepared for the work.', 'internships'], ['Host an industrial visit', 'Show students how your plant or site runs.', 'industrial-training'], ['Mentor students', 'Guide students in your field through regular conversations.', 'mentoring'], ['Evaluate projects', 'Review finished student projects against the brief.', 'projects'], ['Run a guest session', 'Teach a session at a college on a topic you know well.', 'workshops'], ['Build a joint program', 'Design a long-term program with a college.', 'college-industry']].map(([h, p, s]) => `<a class="card" href="${ctx.l('/programs/' + s + '/')}"><h3>${h}</h3><p>${p}</p><span class="more">${esc(P[s].name)}</span></a>`).join('')}
  </div>
</div></section>
<section class="section section-sunk"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">What you get</p><h2>Early access to talent, and fresh work on your problems.</h2></div>
  ${C.checks(['See students at work before recruitment begins', 'Fresh analysis and ideas on real business problems', 'A pipeline of interns already familiar with your work', 'A visible role in developing skills in your region'])}
</div></section>
${C.cta(ctx, 'Tell us how you would like to take part.', 'We will match you with the right colleges and students.', C.formLink(ctx, 'collaborate'), 'Start a collaboration')}
`
  });

  /* ================= MENTORS ================= */
  add({
    path: '/mentors/', title: 'For mentors and trainers',
    description: 'Working professionals and subject experts: teach, run workshops, mentor students, evaluate projects and conduct mock interviews with Digitaleem.',
    body: (ctx) => `
${C.pageHero(ctx, [['Mentors']], 'For mentors & trainers', 'You know how the work is really done. <span class="hl">Pass it on.</span>', 'Students learn the syllabus in college. They learn how a job is actually done from people who do it. Digitaleem connects working professionals and subject experts with students who need them.', C.btn(ctx.l('/mentors/apply/'), 'Apply to mentor'), ART.mentors())}
<section class="section"><div class="wrap">
  ${C.head('Ways to contribute', 'Give as much time as you can.', 'Choose one or several. You decide how many hours a month.')}
  <div class="grid g4">
    ${[['Teaching and training', 'Lead sessions in a training program.'], ['Workshops', 'Run a focused hands-on session.'], ['Mentoring', 'Guide students through skills and career choices.'], ['Project supervision', 'Help a project team when they are stuck.'], ['Project evaluation', 'Assess finished projects against the brief.'], ['Mock interviews', 'Interview students the way a real panel would.'], ['Industry sessions', 'Explain how your industry works today.'], ['Curriculum input', 'Tell us what students should learn next.']].map(([h, p]) => `<div class="card"><h3>${h}</h3><p>${p}</p></div>`).join('')}
  </div>
</div></section>
<section class="section section-sunk"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">Who we look for</p><h2>People who do the work, in any field we cover.</h2><p class="lead">Software engineers and plant managers, data analysts and quality heads, marketers, HR leaders and senior nurses.</p></div>
  ${C.checks(['At least two years of working experience in your field', 'Willing to give students honest, specific feedback', 'Able to give a few hours a month, online'])}
</div></section>
<section class="section"><div class="wrap">
  ${C.head('How it works', 'From application to first session.', '')}
  ${C.stepsH([['Apply', 'Tell us about your experience and how you would like to help.'], ['Talk to us', 'A short call to agree what you will do and when.'], ['Get matched', 'We match you with students, projects or sessions in your field.'], ['Start', 'Your first session, with support from our team.']])}
</div></section>
<section class="section section-sunk"><div class="wrap">
  ${C.head('Questions', 'What mentors ask us.', '')}
  ${C.faq([['How much time does it take?', 'You choose. Some mentors give two hours a month, others run full training programs.'], ['Is it paid?', 'That depends on the role. We agree the terms with you before you start.'], ['Do I need teaching experience?', 'No. You need to know your field and be willing to explain it. We help with the rest.']])}
</div></section>
${C.cta(ctx, 'Share what you know.', 'The application takes about four minutes.', ctx.l('/mentors/apply/'), 'Apply to mentor')}
`
  });

  add({
    path: '/mentors/apply/', title: 'Apply to mentor or train',
    description: 'Apply to mentor, train, evaluate projects or conduct mock interviews with Digitaleem.',
    body: (ctx) => `
${C.pageHero(ctx, [['Mentors', '/mentors/'], ['Apply']], 'Mentors & trainers', 'Apply to mentor or train.', 'Tell us about your experience and how you would like to help students in your field.')}
<section class="section"><div class="wrap form-shell">
  <div data-form="mentor" data-no-head></div>
  <aside class="aside-card"><div class="card"><h3>What happens next</h3><p>We review your application and contact you to talk about what you would like to do and when.</p></div>
  <div class="card"><h3>Not sure yet?</h3><p>Read about the <a href="${ctx.l('/mentors/')}">ways to contribute</a>.</p></div></aside>
</div></section>
`
  });

  /* ================= PROGRAMS ================= */
  add({
    path: '/programs/', title: 'Programs',
    description: 'Training, workshops, projects, internships, industrial training, interview prep, mentoring and college-industry programs from Digitaleem.',
    body: (ctx) => `
${C.pageHero(ctx, [['Programs']], 'Programs', 'Every step between education and employment.', 'Nine kinds of program, for students, colleges, companies and professionals. Filter by who you are and the field you work in.')}
<section class="section"><div class="wrap" data-filter-group>
  <div class="filters"><span class="label">For</span>${[['all', 'Everyone'], ['students', 'Students'], ['colleges', 'Colleges'], ['industry', 'Industry'], ['mentors', 'Mentors']].map(([v, t], i) => `<button type="button" class="chip" data-filter="audience" data-value="${v}" aria-pressed="${i === 0}">${t}</button>`).join('')}</div>
  <div class="filters"><span class="label">Field</span>${[['all', 'All fields'], ...domains.map((d) => [d.slug, d.name])].map(([v, t], i) => `<button type="button" class="chip" data-filter="domain" data-value="${v}" aria-pressed="${i === 0}">${esc(t)}</button>`).join('')}</div>
  <div class="grid g3">${programs.map((p) => C.programCard(ctx, p)).join('')}</div>
  <p class="empty mt-1" data-none hidden>No program matches both filters. Try another combination.</p>
</div></section>
<section class="section section-sunk"><div class="wrap">
  ${C.head('Not sure which?', 'Start from your stage instead.', 'Tell us where you are and we will recommend the right program.')}
  <div class="btn-row">${C.btn(ctx.l('/#start'), 'Find where to start', 'ghost')}${C.btn(ctx.l('/contact/'), 'Talk to us')}</div>
</div></section>
`
  });

  for (const p of programs) {
    const domainLinks = (ctx) => `<div class="grid ${p.domains.length === 4 ? 'g2' : 'g3'}">${p.domains.map((d) => C.domainCard(ctx, D[d])).join('')}</div>`;
    const prefill = p.formPreset ? 'need~' + p.formPreset : (p.form === 'student' ? 'need~' + p.slug : '');
    add({
      path: `/programs/${p.slug}/`, title: p.name,
      description: `${p.short} ${p.intro.split('. ')[0]}.`,
      body: (ctx) => `
${C.pageHero(ctx, [['Programs', '/programs/'], [p.name]], p.name, p.title, p.intro, C.btn(C.formLink(ctx, p.form, prefill), p.form === 'college' ? 'Request a proposal' : p.form === 'interview' ? 'Book interview prep' : 'Enquire now'))}

<section class="section"><div class="wrap">
  ${C.head('Who it is for', 'How it works for you.', '')}
  ${forWhoBlock(ctx, p)}
</div></section>

${p.steps ? `<section class="section section-sunk"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">How it works</p><h2>${p.steps.length} steps, start to finish.</h2>${p.formats ? `<p class="note">${esc(p.formats)}</p>` : ''}</div>
  ${C.steps(p.steps)}
</div></section>` : ''}

${p.includes ? `<section class="section"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">What is included</p><h2>${p.slug === 'college-industry' ? 'What a program can include.' : 'What you get.'}</h2></div>
  ${C.checks(p.includes.map(esc), p.includes.length > 7 ? 'cols-2' : '')}
</div></section>` : ''}

${p.groups ? `<section class="section"><div class="wrap"><div class="grid g2">${p.groups.map(([h, items]) => `<div class="card"><h3>${h}</h3>${C.checks(items.map(esc))}</div>`).join('')}</div></div></section>` : ''}

${p.types ? `<section class="section"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">${p.slug === 'industrial-training' ? 'What you will see' : 'Types'}</p><h2>${p.slug === 'projects' ? 'Every kind of project.' : p.slug === 'internships' ? 'Internships in every field.' : 'Exposure to how industry runs.'}</h2></div>
  ${C.tags(p.types)}
</div></section>` : ''}

${p.examples ? `<section class="section section-sunk"><div class="wrap">
  ${C.head('Examples', 'The kind of problems you could work on.', '')}
  <div class="grid g3">${domains.filter((d) => p.examples.some((e) => e[0] === d.slug)).map((d) => `<div class="card"><span class="eyebrow">${esc(d.name)}</span>${C.checks(p.examples.filter((e) => e[0] === d.slug).map((e) => esc(e[1])))}</div>`).join('')}</div>
</div></section>` : ''}

${p.listing ? `<section class="section"><div class="wrap"><div class="cta-band" style="background:var(--surface);color:var(--ink);border:1px solid var(--line)"><div><h2>See open internships</h2><p class="muted">Internships from partner companies are listed under Opportunities.</p></div><div class="btn-row">${C.btn(ctx.l('/opportunities/internships/'), 'Browse internships', 'ghost')}</div></div></div></section>` : ''}

<section class="section${p.examples ? '' : ' section-sunk'}"><div class="wrap">
  ${C.head('Fields', 'Available in these domains.', '')}
  ${domainLinks(ctx)}
</div></section>

${p.faqs ? `<section class="section"><div class="wrap">${C.head('Questions', 'Common questions.', '')}${C.faq(p.faqs.map(([q, a]) => [q, esc(a)]))}</div></section>` : ''}

${C.cta(ctx, p.form === 'college' ? 'Plan this for your students.' : 'Ready to take this step?', 'Send a short enquiry and our team will contact you with details, dates and fees.', C.formLink(ctx, p.form, prefill), 'Enquire now')}
`
    });
  }

  /* ================= DOMAINS ================= */
  add({
    path: '/domains/', title: 'Domains',
    description: 'Digitaleem works across IT and digital, engineering and industrial, business and management, and healthcare and nursing.',
    body: (ctx) => `
${C.pageHero(ctx, [['Domains']], 'Domains', 'Four fields of work, <span class="hl">side by side.</span>', 'Work spans software companies, factories, construction sites, hospitals and businesses of every kind. Digitaleem covers all of them.')}
<section class="section"><div class="wrap"><div class="grid g2">${domains.map((d) => C.domainCard(ctx, d)).join('')}</div></div></section>
${C.cta(ctx, 'Not sure which field is right for you?', 'Talk to us. A short conversation often makes the choice clearer.', C.formLink(ctx, 'student', 'domain~unsure'), 'Talk to us')}
`
  });

  for (const d of domains) {
    add({
      path: `/domains/${d.slug}/`, title: d.name,
      description: `${d.name} at Digitaleem: ${d.fields.slice(0, 8).join(', ')} and more. Training, projects, internships and interview prep.`,
      body: (ctx) => `
${C.pageHero(ctx, [['Domains', '/domains/'], [d.name]], d.name, d.title, d.intro, d.abroad ? C.btn(C.formLink(ctx, 'nursing'), 'Check if you are eligible') + C.btn(ctx.l(d.abroad), 'Nursing in Germany', 'ghost') : C.btn(C.formLink(ctx, 'student', 'domain~' + d.slug), 'Enquire about ' + d.name), ART[d.slug]())}
<section class="section"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">Fields</p><h2>${d.fields.length} fields, and growing.</h2><p class="muted">Specialisation pages for each field are on the way. Ask us about any of them now.</p></div>
  ${C.tags(d.fields)}
</div></section>
<section class="section section-sunk"><div class="wrap">
  ${C.head('Programs', 'What you can do in ' + esc(d.name) + '.', '')}
  <div class="grid ${d.programs.length === 4 ? 'g4' : 'g3'}">${d.programs.map((s) => C.programCard(ctx, P[s])).join('')}</div>
</div></section>
${d.abroad ? `<section class="section"><div class="wrap"><div class="cta-band" style="background:var(--surface);color:var(--ink);border:1px solid var(--line)"><div><h2>Nursing careers in Germany</h2><p class="muted">Language, recognition of your degree, interviews with employers and the move, prepared step by step.</p></div><div class="btn-row">${C.btn(ctx.l(d.abroad), 'See the route')}</div></div></div></section>` : ''}
<section class="section"><div class="wrap grid g2">
  <div class="card"><span class="eyebrow">Example projects</span><h3>Real problems you could solve</h3>${C.checks(d.projects.map(esc))}</div>
  <div class="card"><span class="eyebrow">Where it leads</span><h3>Entry-level roles in this field</h3>${C.checks(d.roles.map(esc))}</div>
</div></section>
${C.cta(ctx, `Start in ${esc(d.name)}.`, 'Tell us your course and level, and we will suggest where to begin.', d.abroad ? C.formLink(ctx, 'nursing') : C.formLink(ctx, 'student', 'domain~' + d.slug), 'Enquire now')}
`
    });
  }

  /* ================= OPPORTUNITIES ================= */
  const oppsTabs = (ctx, cur) => `<nav class="tabs" aria-label="Opportunity types">${[['All', '/opportunities/'], ['Internships', '/opportunities/internships/'], ['Jobs', '/opportunities/jobs/'], ['Project briefs', '/opportunities/projects/']].map(([t, h]) => `<a href="${ctx.l(h)}"${h === cur ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav>`;
  const oppsBlock = (ctx, type, label) => `<div data-opps="${type}" data-listing-href="${ctx.l('/opportunities/listing/')}">
    <div class="filters" data-opps-filters hidden>
      <label class="vh" for="f-domain">Field</label><select id="f-domain" data-opps-filter="domain" style="width:auto"><option value="all">All fields</option>${domains.map((d) => `<option value="${d.slug}">${esc(d.name)}</option>`).join('')}</select>
      <label class="vh" for="f-region">Where</label><select id="f-region" data-opps-filter="region" style="width:auto"><option value="all">India and abroad</option><option value="india">India</option><option value="abroad">Abroad</option></select>
      <label class="vh" for="f-mode">Work mode</label><select id="f-mode" data-opps-filter="mode" style="width:auto"><option value="all">On-site, remote or hybrid</option><option>On-site</option><option>Remote</option><option>Hybrid</option></select>
      <span class="muted" data-opps-count></span>
    </div>
    <ul class="grid" data-opps-list style="list-style:none"></ul>
    <div class="empty" data-opps-empty>
      <span class="badge">No open ${label} right now</span>
      <h3>New openings are added as partner companies confirm them.</h3>
      <p class="muted">Tell us what you are looking for and we will contact you when something fits.</p>
      <div class="btn-row">${C.btn(C.formLink(ctx, 'student', type === 'internship' ? 'need~internship' : ''), 'Tell us what you need')}${C.btn(C.formLink(ctx, 'hire'), 'List an opening', 'ghost')}</div>
    </div>
  </div>`;
  const oppPages = [['all', '/opportunities/', 'Opportunities', 'Internships, jobs and project briefs.', 'openings', 'Real openings from companies that work with Digitaleem. Each one connects back to the training, projects and preparation that get you ready for it.'],
    ['internship', '/opportunities/internships/', 'Internships', 'Open internships.', 'internships', 'Internships from partner companies across IT, engineering, business and healthcare.'],
    ['job', '/opportunities/jobs/', 'Jobs', 'Open jobs.', 'jobs', 'Entry-level jobs, trainee and apprenticeship positions and nursing roles from partner employers in India and abroad.'],
    ['project', '/opportunities/projects/', 'Project briefs', 'Open project briefs.', 'project briefs', 'Real problems from companies, open for students and teams to work on with a mentor.']];
  for (const [type, path, title, h1, label, lead] of oppPages) {
    add({
      path, title, description: lead,
      body: (ctx) => `
${C.pageHero(ctx, path === '/opportunities/' ? [['Opportunities']] : [['Opportunities', '/opportunities/'], [title]], 'Opportunities', h1, lead)}
<section class="section"><div class="wrap">${oppsTabs(ctx, path)}${oppsBlock(ctx, type, label)}</div></section>
<section class="section section-sunk"><div class="wrap grid g2">
  <div class="card"><span class="eyebrow">Not ready to apply yet?</span><h3>Get ready first.</h3><p>A project, an internship or interview practice can make you a much stronger candidate.</p><a class="more" href="${ctx.l('/students/')}">Find your stage</a></div>
  <div class="card"><span class="eyebrow">Hiring?</span><h3>List your opening on Digitaleem.</h3><p>Reach students and graduates who have trained and built projects in your field.</p><a class="more" href="${ctx.l('/industry/hire/')}">Hire talent</a></div>
</div></section>
`
    });
  }
  add({
    path: '/opportunities/listing/', title: 'Opening', noindex: true,
    description: 'An internship, job or project brief listed on Digitaleem.',
    body: (ctx) => `
<section class="page-hero"><div class="wrap" data-opp-detail>
  <nav class="crumbs" aria-label="Breadcrumb"><a href="${ctx.l('/')}">Home</a><span aria-hidden="true">/</span><a href="${ctx.l('/opportunities/')}">Opportunities</a></nav>
  <div data-opp-found hidden class="stack"><span class="badge" data-opp-type style="justify-self:start"></span><h1 data-opp-title></h1></div>
  <div data-opp-missing class="stack"><h1>This opening is no longer listed.</h1><p class="lead">It may have been filled or closed. See what is open now.</p><div class="btn-row">${C.btn(ctx.l('/opportunities/'), 'See all opportunities')}</div></div>
</div></section>
<section class="section" data-opp-found hidden><div class="wrap form-shell">
  <div class="stack" style="gap:1.25rem;min-width:0"><div class="prose" data-opp-body></div><div><h2 style="font-size:var(--step-2);margin-bottom:1rem">Apply</h2><div data-opp-form data-no-head></div></div></div>
  <aside class="aside-card"><div class="card"><h3>At a glance</h3><dl class="kv" data-opp-kv></dl></div></aside>
</div></section>
`
  });

  /* ================= CAREERS ABROAD ================= */
  const NURSE_STEPS = [
    ['Check eligibility', 'We review your qualification, registration and experience, and tell you honestly whether the route fits you now.'],
    ['Learn German', 'Live classes from A1 to B1 or B2, the level German employers and authorities ask for, with exam preparation.'],
    ['Add medical German', 'Handovers, documentation, care plans and conversations with patients and their families.'],
    ['Get your degree recognised', 'We help you prepare the documents for recognition of your nursing qualification in Germany (Anerkennung).'],
    ['Meet employers', 'Interview preparation, then interviews with hospitals and care homes in Germany.'],
    ['Prepare to move', 'Guidance on your visa, travel and first weeks, so you arrive knowing what to expect.'],
    ['Start work', 'You begin work. If recognition asks for an adaptation period or a knowledge exam, we help you prepare for it.']
  ];

  add({
    path: '/careers-abroad/', title: 'Careers abroad',
    description: 'Careers abroad with Digitaleem, starting with nursing in Germany: language, recognition, interviews and the move, prepared step by step.',
    body: (ctx) => `
${C.pageHero(ctx, [['Careers abroad']], 'Careers abroad', 'Some careers start in <span class="hl">another country.</span>', 'Working abroad takes more than a job offer. You need the language, a recognised qualification, an employer who will support you, and a clear picture of what the move involves. Digitaleem prepares you for each of them.', C.btn(ctx.l('/careers-abroad/nursing-germany/'), 'Nursing careers in Germany'), ART.abroad())}
<section class="section"><div class="wrap">
  ${C.head('Routes', 'Where you can go with Digitaleem.', 'We add a route only when we can prepare people for it properly.')}
  <div class="grid g2">
    <a class="card art-card" href="${ctx.l('/careers-abroad/nursing-germany/')}"><div class="card-art" aria-hidden="true">${ART.healthcare()}</div><span class="badge" style="justify-self:start">Open now</span><h3>Nursing in Germany</h3><p>For B.Sc Nursing and GNM nurses. German to B1 or B2, recognition of your degree, interviews with German employers and the move.</p><span class="more">See the route</span></a>
    <div class="card"><span class="eyebrow">More routes</span><h3>Planned, not promised.</h3><p>Germany also needs electricians, technicians, engineers and IT professionals. We will open routes for them when partner employers are in place. Tell us if you are interested and we will keep you informed.</p><a class="more" href="${C.formLink(ctx, 'language')}">Register your interest</a></div>
  </div>
</div></section>
<section class="section section-sunk"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">The same journey</p><h2>Seven stages, with a longer bridge.</h2><p class="lead">A career abroad follows the same path as any Digitaleem journey, from learning to work. The difference is the bridge in the middle: language, recognition and the move.</p></div>
  ${C.steps(NURSE_STEPS.slice(1, 6))}
</div></section>
${C.cta(ctx, 'Start with a conversation.', 'Tell us your qualification and where you want to work. We will tell you honestly what the route involves.', C.formLink(ctx, 'nursing'), 'Talk to us')}
`
  });

  add({
    path: '/careers-abroad/nursing-germany/', title: 'Nursing careers in Germany',
    description: 'For Indian nurses: German from A1 to B2, recognition of your nursing degree, interviews with German hospitals and care homes, and preparation for the move. No placement fees for nurses.',
    body: (ctx) => `
${C.pageHero(ctx, [['Careers abroad', '/careers-abroad/'], ['Nursing in Germany']], 'Nursing careers in Germany', 'Your nursing career, <span class="hl">in Germany.</span>', 'Hospitals and care homes in Germany need qualified nurses, and they hire from India. Digitaleem prepares you for every step: the language, recognition of your degree, interviews with employers and the move itself.', C.btn(C.formLink(ctx, 'nursing'), 'Check if you are eligible') + C.btn('#route', 'See the route', 'ghost'), ART.healthcare())}

<section class="section"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">Who it is for</p><h2>Qualified nurses ready for a new country.</h2><p class="lead">You do not need any German to start. You do need your qualification, your registration and the commitment to learn.</p></div>
  ${C.checks(['<strong>B.Sc Nursing, Post Basic B.Sc, M.Sc Nursing or GNM</strong>', '<strong>Registered</strong> with a State Nursing Council', '<strong>Clinical experience</strong> helps, and many employers prefer it', '<strong>Ready to learn German</strong> to B1 or B2 level', '<strong>Ready to relocate</strong> and build a career in Germany'])}
</div></section>

<section class="section section-sunk" id="route"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">The route</p><h2>Seven steps, from your first German word to your first shift.</h2><p class="note">Language classes run online. Exams are taken at authorised centres, and interviews are held online with employers in Germany.</p></div>
  ${C.steps(NURSE_STEPS)}
</div></section>

<section class="section band"><div class="wrap split">
  <div class="stack" style="gap:1.25rem"><p class="eyebrow">Fair recruitment</p><p class="statement">You should never have to <span class="hl">pay for a job.</span></p></div>
  <ul class="gap-list plain">
    <li><span class="have">Placement fees</span><span class="missing">none for nurses</span></li>
    <li><span class="have">Recruitment costs</span><span class="missing">paid by the employer</span></li>
    <li><span class="have">Your contract</span><span class="missing">shown to you before you commit</span></li>
    <li><span class="have">Our advice</span><span class="missing">honest, even when the answer is not yet</span></li>
  </ul>
</div></section>

<section class="section"><div class="wrap">
  ${C.head('How we prepare you', 'Programs on this route.', '')}
  <div class="grid g4">${['language', 'training', 'interview-prep', 'mentoring'].map((s) => C.programCard(ctx, P[s])).join('')}</div>
</div></section>

<section class="section section-sunk" id="employers"><div class="wrap split" style="align-items:center">
  <div class="stack" style="gap:1.25rem"><p class="eyebrow">For employers in Germany</p><h2>Nurses who arrive ready to work.</h2>
    <p class="lead">Hospitals, care homes and home care services: tell us the roles you need to fill. We prepare candidates in German, medical German and the way care works in Germany, and we stay with them through recognition.</p>
    <div class="btn-row">${C.btn(C.formLink(ctx, 'intlhire'), 'Recruit nurses from India')}</div></div>
  ${C.checks(['<strong>Language</strong> to the level you set, with medical German', '<strong>Clinical background</strong> checked before you interview', '<strong>Interviews</strong> arranged online, on your schedule', '<strong>Documents</strong> prepared for recognition', '<strong>Ethical recruitment</strong>, with no fees charged to nurses'])}
</div></section>

<section class="section"><div class="wrap">
  ${C.head('Questions', 'What nurses ask us.', '')}
  ${C.faq(NURSE_FAQ)}
</div></section>

${C.cta(ctx, 'Check if the route fits you.', 'It takes about three minutes. We will call you and explain each step.', C.formLink(ctx, 'nursing'), 'Check eligibility')}
`
  });

  /* ================= ABOUT ================= */
  add({
    path: '/about/', title: 'About',
    description: 'Digitaleem works in the space between education and employment, connecting students, colleges, industry and professionals.',
    body: (ctx) => `
${C.pageHero(ctx, [['About']], 'About Digitaleem', 'We work in the space between <span class="hl">education and employment.</span>', 'Digitaleem exists because finishing a course and being ready for work are not the same thing. We connect the people who can close that gap: students, colleges, industry and professionals.')}
<section class="section"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">The name</p><h2>Digital + taleem.</h2></div>
  <div class="stack" style="gap:1rem"><p class="lead"><em>Taleem</em> means education. We chose the name because education is where every career starts. Our job is to make sure it does not stop there.</p><p class="muted">The Digitaleem mark is a D drawn as a journey. It starts at a single point, the learner, rises through education and curves round into work.</p></div>
</div></section>
<section class="section section-sunk"><div class="wrap">
  ${C.head('What we are, and are not', 'More than a course platform or a job board.', '')}
  <div class="grid g2">
    <div class="card"><h3>We are</h3>${C.checks(['A bridge between colleges and industry', 'A place to build practical skills and real work', 'A source of internships, industrial training and jobs', 'A route to careers abroad, starting with nursing in Germany', 'A way for professionals to help the next generation', 'Equally at home in IT, engineering, business and healthcare'])}</div>
    <div class="card"><h3>We are not</h3>${C.checks(['Just an online course platform', 'Just an internship or job listing site', 'A conventional coaching or training institute', 'Limited to IT', 'A promise of a job without the work to earn one'])}</div>
  </div>
</div></section>
<section class="section"><div class="wrap">
  ${C.head('What we believe', 'Four principles behind everything we do.', '')}
  <div class="grid g4">
    <div class="card"><h3>Practice over theory</h3><p>Every program includes applying what you learn to a real problem.</p></div>
    <div class="card"><h3>Evidence over claims</h3><p>Projects, evaluations and feedback say more than a list of skills.</p></div>
    <div class="card"><h3>Industry early</h3><p>Students should meet their industry long before the placement drive.</p></div>
    <div class="card"><h3>Every starting point counts</h3><p>Students join at different stages, and each one deserves the right next step.</p></div>
  </div>
</div></section>
<section class="section section-sunk"><div class="wrap split">
  <div class="stack" style="gap:1rem"><p class="eyebrow">How we reach people</p><h2>Online from day one.</h2></div>
  <div class="stack" style="gap:1rem"><p class="lead">Programs run online from launch, so students, colleges and companies can work with us wherever they are. Offline centres will open in stages.</p>
  <div class="btn-row">${C.btn(ctx.l('/about/how-it-works/'), 'How it works', 'ghost')}${C.btn(ctx.l('/about/team/'), 'Meet the team', 'ghost')}</div></div>
</div></section>
${C.cta(ctx, 'Work with us.', 'Students, colleges, companies and professionals: tell us what you need.', ctx.l('/contact/'), 'Talk to us')}
`
  });

  add({
    path: '/about/how-it-works/', title: 'How it works',
    description: 'How Digitaleem connects students, colleges, industry and professionals, and the seven stages from education to employment.',
    body: (ctx) => `
${C.pageHero(ctx, [['About', '/about/'], ['How it works']], 'How it works', 'One system with four kinds of people in it.', 'Students, colleges, industry and professionals each need something the others have. Digitaleem coordinates the connections.')}
<section class="section"><div class="wrap">${ecosystem()}</div></section>
<section class="section section-sunk"><div class="wrap">
  ${C.head('Two directions', 'Connections run both ways.', '')}
  <div class="grid g2">
    <div class="card"><span class="eyebrow">College → Digitaleem → Industry</span><h3>When a college asks</h3>${C.checks(['A college requests specialised training', 'Students visit industrial facilities', 'Students complete industrial training', 'Colleges and companies build joint programs'])}</div>
    <div class="card"><span class="eyebrow">Industry → Digitaleem → College & students</span><h3>When a company asks</h3>${C.checks(['Professionals conduct college sessions', 'Companies provide project problems and internships', 'Professionals evaluate student projects', 'Employers meet potential candidates'])}</div>
  </div>
</div></section>
<section class="section"><div class="wrap">
  ${C.head('The student journey', 'Seven stages, many ways in.', 'The journey is not a straight line. A student might need foundations, a project, an internship or only interview practice. Each stage has a matching program.')}
  <div class="split" style="align-items:center">${journeySVG(ctx, ctx.l('/students/') + '#start')}<ol class="steps">${STAGES.map((s) => `<li><div><h3>${esc(s.name)}</h3><p>${esc(s.do)}</p></div></li>`).join('')}</ol></div>
</div></section>
${C.cta(ctx, 'Find your place in it.', 'Tell us who you are and what you need.', ctx.l('/contact/'), 'Talk to us')}
`
  });

  add({
    path: '/about/team/', title: 'Team',
    description: 'The people building Digitaleem.',
    body: (ctx) => `
${C.pageHero(ctx, [['About', '/about/'], ['Team']], 'Team', 'The people behind Digitaleem.', 'Digitaleem is built by people who have worked in education and in industry, and want the two to meet sooner.')}
<section class="section"><div class="wrap">
  <div class="empty"><span class="badge">Coming soon</span><h3>Team profiles will appear here shortly.</h3><p class="muted">Until then, the quickest way to meet us is to get in touch.</p>${C.btn(ctx.l('/contact/'), 'Talk to us')}</div>
</div></section>
<section class="section section-sunk"><div class="wrap grid g2">
  <div class="card"><span class="eyebrow">Mentors & trainers</span><h3>Join our network of professionals.</h3><p>Teach, mentor and evaluate students in your field.</p><a class="more" href="${ctx.l('/mentors/')}">For mentors</a></div>
  <div class="card"><span class="eyebrow">Partners</span><h3>Colleges and companies.</h3><p>Work with us to prepare students for the workplace.</p><a class="more" href="${ctx.l('/colleges/')}">For colleges</a></div>
</div></section>
`
  });

  /* ================= CONTACT ================= */
  add({
    path: '/contact/', title: 'Talk to us',
    description: 'Tell Digitaleem who you are and what you need. Students, colleges, companies and professionals each get a short form for their enquiry.',
    body: (ctx) => `
${C.pageHero(ctx, [['Contact']], 'Talk to us', 'Tell us who you are and what you need.', 'Pick the options that fit. You will get a short form with only the questions that matter for your enquiry, and someone from our team will contact you.')}
<section class="section"><div class="wrap form-shell">
  <div class="stack" style="gap:0;min-width:0">
    <form class="picker" data-picker data-opps-href="${ctx.l('/opportunities/')}" onsubmit="return false">
      <fieldset class="field"><legend>I am</legend><div class="choices">
        ${[['students', 'A student or graduate'], ['colleges', 'From a college or institution'], ['industry', 'From a company'], ['mentors', 'A professional or trainer']].map(([v, t], i) => `<label><input type="radio" name="aud" id="aud-${i}" value="${v}"${i === 0 ? ' checked' : ''}> ${t}</label>`).join('')}
      </div></fieldset>
      <fieldset class="field" data-need><legend>I need</legend><div class="choices" data-need-choices></div></fieldset>
    </form>
    <div data-picker-form></div>
  </div>
  <aside class="aside-card">
    <div class="card"><h3>What happens next</h3><p>Someone from our team contacts you by phone, WhatsApp or email to talk about the next step.</p></div>
    ${SITE.email || SITE.phone ? `<div class="card"><h3>Prefer to write?</h3>${SITE.email ? `<p>Email <strong style="color:var(--ink)">${esc(SITE.email)}</strong></p>` : ''}${SITE.phone ? `<p>Call or WhatsApp <strong style="color:var(--ink)">${esc(SITE.phone)}</strong></p>` : ''}</div>` : ''}
    <div class="card"><h3>Common questions</h3><p>Fees, formats and who can join are answered in the <a href="${ctx.l('/faq/')}">FAQ</a>.</p></div>
  </aside>
</div></section>
`
  });

  /* ================= FAQ ================= */
  add({
    path: '/faq/', title: 'FAQ',
    description: 'Answers to common questions about Digitaleem programs, fees, formats, internships and working with us.',
    body: (ctx) => `
${C.pageHero(ctx, [['FAQ']], 'FAQ', 'Questions people ask us.', '')}
<section class="section"><div class="wrap stack" style="gap:3rem">
  <div class="stack" style="gap:1.25rem"><h2 style="font-size:var(--step-2)">About Digitaleem</h2>${C.faq([
    ['What is Digitaleem?', 'Digitaleem works in the space between education and employment. We connect students, colleges, companies and professionals through training, projects, internships, industrial training, interview preparation and mentoring.'],
    ['Can I join from anywhere?', 'Yes. Programs run online at launch, so you can join wherever you are. Offline centres will open in stages.'],
    ['Is it only for IT?', 'No. We cover IT and digital fields, engineering and industrial fields including technical trades, business and management, and healthcare and nursing.']
  ])}</div>
  <div class="stack" style="gap:1.25rem"><h2 style="font-size:var(--step-2)">Programs and fees</h2>${C.faq([
    ['Are programs online or offline?', 'Programs run online at launch. Internships and industrial training take place where the host company works. Offline centres will open in stages.'],
    ['How much do programs cost?', 'Fees depend on the program and its length. We share them with you after your enquiry. There is no payment on this website.'],
    ['How do I enrol?', 'Send an enquiry from any program page or the contact page. Our team will call you, recommend the right program and explain how to join.'],
    ['Do you guarantee placement?', 'No. We help you build skills, projects and experience that employers look for, prepare you for interviews and connect you with companies that are hiring. The job is yours to win.']
  ])}</div>
  <div class="stack" style="gap:1.25rem"><h2 style="font-size:var(--step-2)">Internships and jobs</h2>${C.faq([
    ['Are the listed openings real?', 'Yes. Every opening on Digitaleem comes from a company we work with. Listings are removed once they are filled or closed.'],
        ['How can my company list an opening?', `Use the <a href="${ctx.l('/industry/hire/')}">hire talent</a> form, and tick the option to list it on Digitaleem.`]
  ].map(([q, a]) => [q, a]))}</div>
  <div class="stack" style="gap:1.25rem"><h2 style="font-size:var(--step-2)">Careers abroad</h2>${C.faq(NURSE_FAQ.slice(0, 4))}<p><a class="textlink" href="${ctx.l('/careers-abroad/nursing-germany/')}">Nursing careers in Germany</a></p></div>
  <div class="stack" style="gap:1.25rem"><h2 style="font-size:var(--step-2)">Colleges, companies and mentors</h2>${C.faq([
    ['Can a college start with a single workshop?', 'Yes. Many colleges start with one activity and build a longer program later.'],
    ['Can we design training around our own processes?', 'Yes. Workforce training is designed around your team, your tools and the outcome you want.'],
    ['How do I become a mentor?', `Apply on the <a href="${ctx.l('/mentors/apply/')}">mentor application</a> page, and we will contact you to talk it through.`]
  ])}</div>
</div></section>
${C.cta(ctx, 'Did not find your answer?', 'Ask us directly.', ctx.l('/contact/'), 'Talk to us')}
`
  });

  /* ================= LEGAL ================= */
  const legal = (ctx, h1, updated, html) => `${C.pageHero(ctx, [[h1]], '', h1, 'Last updated ' + updated + '.')}<section class="section"><div class="wrap"><div class="prose">${html}</div></div></section>`;
  const contactLine = SITE.email ? `email us at <strong>${esc(SITE.email)}</strong>` : 'contact us through the contact page';
  add({
    path: '/privacy/', title: 'Privacy policy', description: 'How Digitaleem collects, uses and protects your personal data.',
    body: (ctx) => legal(ctx, 'Privacy policy', '5 October 2026', `
<p>This policy explains what personal data Digitaleem collects through digitaleem.co, why we collect it and how we protect it. We process personal data in line with India’s Digital Personal Data Protection Act, 2023.</p>
<h2>What we collect</h2><ul><li>Details you give us in enquiry and application forms: your name, phone number, email address, institution or company, course, and the answers to the questions on the form.</li><li>Links you share with us, such as a resume, portfolio or LinkedIn profile.</li><li>Basic technical data your browser sends when you visit the site, such as pages viewed and device type.</li></ul>
<h2>Why we use it</h2><ul><li>To respond to your enquiry and recommend the right program or service.</li><li>To share your application with a company, only for an opening you applied to.</li><li>To match students, colleges, companies and mentors when you have asked us to.</li><li>To improve the website.</li></ul>
<h2>Who we share it with</h2><p>We do not sell your data. We share it only with the company, college or mentor involved in what you asked for, and with service providers who help us run the website and handle forms, under agreements that protect your data.</p>
<h2>How long we keep it</h2><p>We keep enquiry and application data for as long as we need it to serve you, and then delete it, unless the law requires us to keep it longer.</p>
<h2>Your rights</h2><p>You can ask to see, correct or delete the personal data we hold about you, or withdraw your consent to being contacted. To do so, ${contactLine}.</p>
<h2>Changes</h2><p>We will update this page if this policy changes.</p>`)
  });
  add({
    path: '/terms/', title: 'Terms of use', description: 'Terms for using the Digitaleem website.',
    body: (ctx) => legal(ctx, 'Terms of use', '5 October 2026', `
<p>By using digitaleem.co you agree to these terms.</p>
<h2>Using the site</h2><p>You may use this site to learn about Digitaleem and to send enquiries and applications. Information you submit must be accurate and must be your own.</p>
<h2>Programs and enrolment</h2><p>Program descriptions on this site are for information. Fees, dates and conditions for any program are confirmed with you in writing before you join. No payment is taken on this website.</p>
<h2>Opportunities</h2><p>Internships, jobs and project briefs are provided by the companies that list them. We check listings before publishing them, but the hiring decision and the terms of any offer belong to the company. Digitaleem does not guarantee selection or employment.</p>
<h2>Content</h2><p>The text, design, logo and other content on this site belong to Digitaleem and may not be copied for commercial use without permission.</p>
<h2>Liability</h2><p>We work to keep this site accurate and available, but we cannot guarantee that it is free of errors or interruptions.</p>
<h2>Law</h2><p>These terms are governed by the laws of India.</p>
<h2>Contact</h2><p>For questions about these terms, ${contactLine}.</p>`)
  });
  add({
    path: '/refund-policy/', title: 'Refund and cancellation policy', description: 'Digitaleem refund and cancellation policy.',
    body: (ctx) => legal(ctx, 'Refund and cancellation policy', '5 October 2026', `
<p>Digitaleem does not take payments on this website. Enquiries and applications are free.</p>
<h2>Paid programs</h2><p>When you join a paid program, we confirm the fee, the schedule and the refund and cancellation terms for that program in writing before you pay.</p>
<h2>If we cancel</h2><p>If Digitaleem cancels or reschedules a program you have paid for and you cannot attend the new dates, we refund the fee for the part you have not received.</p>
<h2>Questions</h2><p>For anything about a payment or refund, ${contactLine}.</p>`)
  });

  /* ================= 404 ================= */
  add({
    path: '/404', title: 'Page not found', description: 'This page does not exist.',
    body: (ctx) => `
<section class="section"><div class="wrap stack" style="gap:1.25rem;justify-items:start">
  <p class="eyebrow">404</p><h1>This page is not on the map.</h1><p class="lead">The link may be old or mistyped. These will get you back on the path.</p>
  <div class="btn-row">${C.btn(ctx.l('/'), 'Home')}${C.btn(ctx.l('/programs/'), 'Programs', 'ghost')}${C.btn(ctx.l('/contact/'), 'Talk to us', 'ghost')}</div>
</div></section>`
  });

  return pages;
};
