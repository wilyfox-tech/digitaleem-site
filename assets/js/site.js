/* Digitaleem site behaviour: navigation, starting-point selector, filters, listings and enquiry forms. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  // Read before any listing renders its application form.
  var CONFIG = window.DGT_CONFIG || {};
  var FORMS = window.DGT_FORMS || {};
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- Navigation ---------- */
  var toggle = $('.menu-toggle'), drawer = $('#drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = drawer.hidden;
      drawer.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }
  $$('.has-menu').forEach(function (item) {
    var btn = $('button', item), menu = $('.mega', item);
    var set = function (open) { menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(menu.hidden); });
    document.addEventListener('click', function (e) { if (!item.contains(e.target)) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); } });
  });

  /* ---------- Starting-point selector ---------- */
  $$('[data-starter]').forEach(function (root) {
    var tabs = $$('[role="tab"]', root);
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        $('#' + t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
    var pick = function () {
      var m = (location.hash || '').match(/^#stage-(\d)$/);
      if (m && tabs[m[1] - 1]) select(tabs[m[1] - 1]);
    };
    pick(); window.addEventListener('hashchange', pick);
  });

  /* ---------- Program hub filters ---------- */
  $$('[data-filter-group]').forEach(function (root) {
    var items = $$('[data-item]', root), state = {};
    $$('[data-filter]', root).forEach(function (chip) {
      chip.addEventListener('click', function () {
        var key = chip.getAttribute('data-filter'), val = chip.getAttribute('data-value');
        $$('[data-filter="' + key + '"]', root).forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        state[key] = val;
        var shown = 0;
        items.forEach(function (it) {
          var ok = Object.keys(state).every(function (k) { return state[k] === 'all' || (it.getAttribute('data-' + k) || '').split(' ').indexOf(state[k]) > -1; });
          it.hidden = !ok; if (ok) shown++;
        });
        var none = $('[data-none]', root); if (none) none.hidden = shown > 0;
      });
    });
  });

  /* ---------- Opportunities ---------- */
  var OPPS = window.DGT_OPPORTUNITIES || [];
  var TYPE = { internship: 'Internship', job: 'Job', project: 'Project brief' };
  var DOM = { it: 'IT & Digital', engineering: 'Engineering & Industrial', business: 'Business & Management', healthcare: 'Healthcare & Nursing' };
  var regionOf = function (o) { return o.country && !/^india$/i.test(o.country) ? 'abroad' : 'india'; };
  var fmtDate = function (d) { try { return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return d; } };

  var list = $('[data-opps]');
  if (list) {
    var type = list.getAttribute('data-opps'), href = list.getAttribute('data-listing-href');
    var all = OPPS.filter(function (o) { return type === 'all' || o.type === type; })
      .sort(function (a, b) { return (b.posted || '').localeCompare(a.posted || ''); });
    var domainFilter = 'all', modeFilter = 'all', regionFilter = 'all';
    var render = function () {
      var rows = all.filter(function (o) { return (domainFilter === 'all' || o.domain === domainFilter) && (modeFilter === 'all' || o.mode === modeFilter) && (regionFilter === 'all' || regionOf(o) === regionFilter); });
      var out = $('[data-opps-list]', list), empty = $('[data-opps-empty]', list), filters = $('[data-opps-filters]', list);
      filters.hidden = all.length === 0; empty.hidden = rows.length > 0;
      out.innerHTML = rows.map(function (o) {
        return '<li class="card listing"><div class="stack" style="gap:.5rem;min-width:0">' +
          '<div class="meta"><span class="badge">' + esc(TYPE[o.type] || o.type) + '</span><span>' + esc(DOM[o.domain] || '') + '</span></div>' +
          '<h3><a href="' + esc(href) + '#' + esc(o.id) + '">' + esc(o.title) + '</a></h3>' +
          '<div class="meta"><span>' + esc(o.company) + '</span><span>' + esc(o.location) + (o.country && regionOf(o) === 'abroad' ? ', ' + esc(o.country) : '') + (o.mode ? ' · ' + esc(o.mode) : '') + '</span>' +
          (o.duration ? '<span>' + esc(o.duration) + '</span>' : '') + (o.pay ? '<span>' + esc(o.pay) + '</span>' : '') + '</div>' +
          (o.summary ? '<p>' + esc(o.summary) + '</p>' : '') + '</div>' +
          '<a class="btn btn-ghost" href="' + esc(href) + '#' + esc(o.id) + '">View and apply</a></li>';
      }).join('');
      var count = $('[data-opps-count]', list); if (count) count.textContent = rows.length + (rows.length === 1 ? ' opening' : ' openings');
    };
    $$('[data-opps-filter]', list).forEach(function (sel) {
      sel.addEventListener('change', function () {
        var f = sel.getAttribute('data-opps-filter');
        if (f === 'domain') domainFilter = sel.value; else if (f === 'region') regionFilter = sel.value; else modeFilter = sel.value;
        render();
      });
    });
    render();
  }

  var detail = $('[data-opp-detail]');
  if (detail) {
    var show = function () {
      var id = decodeURIComponent((location.hash || '').slice(1));
      var o = OPPS.filter(function (x) { return x.id === id; })[0];
      $$('[data-opp-missing]').forEach(function (el) { el.hidden = !!o; });
      $$('[data-opp-found]').forEach(function (el) { el.hidden = !o; });
      if (!o) return;
      document.title = o.title + ' at ' + o.company + ' · Digitaleem';
      $('[data-opp-title]').textContent = o.title;
      $('[data-opp-type]').textContent = TYPE[o.type] || o.type;
      var kv = [['Company', o.company], ['Location', o.location + (o.country && regionOf(o) === 'abroad' ? ', ' + o.country : '') + (o.mode ? ' · ' + o.mode : '')], ['Field', DOM[o.domain]], ['Duration', o.duration], ['Pay', o.pay], ['Posted', o.posted && fmtDate(o.posted)], ['Apply by', o.closes && fmtDate(o.closes)]];
      $('[data-opp-kv]').innerHTML = kv.filter(function (r) { return r[1]; }).map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
      var body = '';
      if (o.summary) body += '<p class="lead">' + esc(o.summary) + '</p>';
      if (o.responsibilities && o.responsibilities.length) body += '<h2>What you will do</h2><ul class="list-check">' + o.responsibilities.map(function (x) { return '<li><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>';
      if (o.requirements && o.requirements.length) body += '<h2>What you need</h2><ul class="list-check">' + o.requirements.map(function (x) { return '<li><span>' + esc(x) + '</span></li>'; }).join('') + '</ul>';
      if (o.about) body += '<h2>About ' + esc(o.company) + '</h2><p class="muted">' + esc(o.about) + '</p>';
      $('[data-opp-body]').innerHTML = body;
      var mount = $('[data-opp-form]');
      mount.setAttribute('data-context', o.id + ' | ' + o.title + ' | ' + o.company);
      renderForm(mount, 'apply', {}, true);
    };
    show(); window.addEventListener('hashchange', show);
  }

  /* ---------- Enquiry forms ---------- */

  function readPrefill() {
    var p = {};
    try { new URLSearchParams(location.search).forEach(function (v, k) { p[k] = v; }); } catch (e) { /* ignore */ }
    var h = (location.hash || '').slice(1);
    if (h) {
      h.split('.').forEach(function (tok, i) {
        var kv = tok.split('~');
        if (kv.length === 2) p[kv[0]] = kv[1]; else if (i === 0 && tok) p.form = tok;
      });
    }
    return p;
  }

  function fieldHTML(f, uid) {
    var id = uid + '-' + f.id, req = f.required ? ' required' : '';
    var label = esc(f.label) + (f.optional ? ' <span class="opt">(optional)</span>' : '');
    var hint = f.hint ? '<span class="hint" id="' + id + '-hint">' + esc(f.hint) + '</span>' : '';
    var desc = f.hint ? ' aria-describedby="' + id + '-hint"' : '';
    var show = f.showIf ? ' data-show-id="' + f.showIf.id + '" data-show-in="' + f.showIf.in.join(' ') + '"' : '';
    var cls = 'field' + (f.half ? ' half' : '');
    if (f.type === 'radio' || f.type === 'checks') {
      var t = f.type === 'radio' ? 'radio' : 'checkbox';
      return '<fieldset class="' + cls + '"' + show + ' data-field="' + f.id + '"' + (f.required ? ' data-required' : '') + '><legend>' + label + '</legend>' + hint +
        '<div class="choices">' + f.options.map(function (o, i) {
          return '<label><input type="' + t + '" name="' + f.id + '" value="' + esc(o[0]) + '" id="' + id + '-' + i + '"> ' + esc(o[1]) + '</label>';
        }).join('') + '</div></fieldset>';
    }
    var control;
    if (f.type === 'select') {
      control = '<select id="' + id + '" name="' + f.id + '"' + req + desc + '><option value="">Choose one</option>' +
        f.options.map(function (o) { return '<option value="' + esc(o[0]) + '">' + esc(o[1]) + '</option>'; }).join('') + '</select>';
    } else if (f.type === 'textarea') {
      control = '<textarea id="' + id + '" name="' + f.id + '"' + req + desc + '></textarea>';
    } else {
      var extra = f.type === 'tel' ? ' inputmode="tel" pattern="[0-9+ ()-]{10,16}"' : '';
      if (f.min != null) extra += ' min="' + f.min + '"';
      if (f.autocomplete) extra += ' autocomplete="' + f.autocomplete + '"';
      control = '<input type="' + f.type + '" id="' + id + '" name="' + f.id + '"' + req + desc + extra + '>';
    }
    return '<div class="' + cls + '"' + show + ' data-field="' + f.id + '"><label for="' + id + '">' + label + '</label>' + hint + control + '</div>';
  }

  function groupRows(html) {
    // Pair consecutive half-width fields into two-column rows.
    var out = [], buf = [];
    html.forEach(function (h) {
      if (h.indexOf('field half') > -1) { buf.push(h); if (buf.length === 2) { out.push('<div class="field-row">' + buf.join('') + '</div>'); buf = []; } }
      else { if (buf.length) { out.push(buf[0]); buf = []; } out.push(h); }
    });
    if (buf.length) out.push(buf[0]);
    return out.join('');
  }

  var formCount = 0;
  function renderForm(mount, key, prefill, hideHead) {
    var def = FORMS[key]; if (!def) return;
    var uid = 'f' + (++formCount);
    var contact = def.contact === 'org' ? window.DGT_ORG_CONTACT : window.DGT_CONTACT;
    var fields = def.fields.concat(contact);
    var head = hideHead ? '' : '<h2>' + esc(def.title) + '</h2><p class="muted">' + esc(def.intro) + '</p>';
    mount.innerHTML = '<div class="form-card">' + head +
      '<form class="enquiry" novalidate data-key="' + key + '">' + groupRows(fields.map(function (f) { return fieldHTML(f, uid); })) +
      '<div class="vh" aria-hidden="true"><label>Leave this empty <input type="text" name="_hp" tabindex="-1" autocomplete="off"></label></div>' +
      '<label class="consent"><input type="checkbox" name="consent" id="' + uid + '-consent" required> <span>I agree that Digitaleem may contact me about this enquiry by phone, WhatsApp or email, as described in the privacy policy.</span></label>' +
      '<div class="err" data-form-error hidden></div>' +
      '<div><button class="btn btn-primary" type="submit">Send enquiry</button></div></form></div>';
    var form = $('form', mount);

    // Prefill
    Object.keys(prefill || {}).forEach(function (k) {
      var v = prefill[k];
      $$('[name="' + k + '"]', form).forEach(function (el) {
        if (el.type === 'radio' || el.type === 'checkbox') { if (el.value === v) el.checked = true; }
        else if (el.tagName === 'SELECT') { if ($('option[value="' + v + '"]', el)) el.value = v; }
        else el.value = v;
      });
    });

    var values = function (name) { return $$('[name="' + name + '"]', form).filter(function (el) { return (el.type !== 'radio' && el.type !== 'checkbox') || el.checked; }).map(function (el) { return el.value; }).filter(Boolean); };
    var applyConditions = function () {
      $$('[data-show-id]', form).forEach(function (el) {
        var want = el.getAttribute('data-show-in').split(' '), have = values(el.getAttribute('data-show-id'));
        var on = have.some(function (v) { return want.indexOf(v) > -1; });
        el.hidden = !on;
        $$('input,select,textarea', el).forEach(function (c) { c.disabled = !on; });
      });
    };
    form.addEventListener('change', applyConditions);
    applyConditions();

    var clearErr = function (wrap) { wrap.classList.remove('invalid'); var e = $('.err', wrap); if (e) e.remove(); };
    var setErr = function (wrap, msg) { clearErr(wrap); wrap.classList.add('invalid'); var e = document.createElement('span'); e.className = 'err'; e.textContent = msg; wrap.appendChild(e); };
    form.addEventListener('input', function (e) { var w = e.target.closest('.field'); if (w) clearErr(w); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      $$('.field', form).forEach(function (w) {
        if (w.hidden) return;
        clearErr(w);
        var name = w.getAttribute('data-field');
        if (w.tagName === 'FIELDSET') {
          if (w.hasAttribute('data-required') && values(name).length === 0) {
          var multi = !!$('input[type="checkbox"]', w);
          setErr(w, multi ? 'Choose at least one option.' : 'Choose one option.'); firstBad = firstBad || w;
        }
          return;
        }
        var c = $('input,select,textarea', w); if (!c) return;
        var v = (c.value || '').trim();
        if (c.required && !v) { setErr(w, c.tagName === 'SELECT' ? 'Choose an option.' : 'Fill this in.'); firstBad = firstBad || w; return; }
        if (v && c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setErr(w, 'Enter an email address like name@example.com.'); firstBad = firstBad || w; }
        if (v && c.type === 'tel' && v.replace(/\D/g, '').length < 10) { setErr(w, 'Enter a 10-digit mobile number.'); firstBad = firstBad || w; }
        if (v && c.type === 'url' && !/^https?:\/\/\S+\.\S+/.test(v)) { setErr(w, 'Enter a full link starting with https://'); firstBad = firstBad || w; }
      });
      var consent = $('[name="consent"]', form), formErr = $('[data-form-error]', form);
      formErr.hidden = true;
      if (!firstBad && !consent.checked) { formErr.textContent = 'Tick the box to agree to be contacted, so we can reply to you.'; formErr.hidden = false; return; }
      if (firstBad) { var f = $('input,select,textarea', firstBad); if (f) f.focus(); return; }

      var hp = $('[name="_hp"]', form);
      var data = { form: key, page: location.pathname, submittedAt: new Date().toISOString(), _hp: hp ? hp.value : '' };
      var ctx = mount.getAttribute('data-context'); if (ctx) data.context = ctx;
      var readable = [];
      fields.forEach(function (f) {
        var v = values(f.id); if (!v.length) return;
        data[f.id] = f.type === 'checks' ? v : v[0];
        var text = v.map(function (x) { var o = (f.options || []).filter(function (op) { return String(op[0]) === x; })[0]; return o ? o[1] : x; });
        readable.push([f.label, text.join(', ')]);
      });
      data._title = def.title; data._readable = readable;
      Object.keys(CONFIG.formExtra || {}).forEach(function (k) { data[k] = CONFIG.formExtra[k]; });

      var btn = $('button[type="submit"]', form);
      var done = function (preview) {
        var who = (data.name || '').split(' ')[0];
        mount.innerHTML = '<div class="form-card form-done" tabindex="-1"><div class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>' +
          '<h2>Thank you' + (who ? ', ' + esc(who) : '') + '.</h2><p class="muted">We have your enquiry. Someone from Digitaleem will contact you on ' + esc(data.phone || 'the number you gave') + ' or by email to talk about the next step.</p>' +
          (preview ? '<p class="note">Preview mode: this enquiry was not sent anywhere. Set a form endpoint to receive enquiries.</p>' : '') + '</div>';
        $('.form-done', mount).focus();
      };
      if (!CONFIG.formEndpoint) { done(true); return; }
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(false); })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Send enquiry';
          formErr.textContent = 'Your enquiry could not be sent. Check your connection and try again.'; formErr.hidden = false;
        });
    });
  }

  // Standalone form mounts
  $$('[data-form]').forEach(function (m) {
    var pre = readPrefill(); delete pre.form;
    var fixed = m.getAttribute('data-prefill');
    if (fixed) fixed.split('.').forEach(function (t) { var kv = t.split('~'); if (kv.length === 2 && !pre[kv[0]]) pre[kv[0]] = kv[1]; });
    renderForm(m, m.getAttribute('data-form'), pre, m.hasAttribute('data-no-head'));
  });

  // Contact page picker
  var picker = $('[data-picker]');
  if (picker) {
    var NEEDS = {
      students: [['student', 'Skills, projects or an internship'], ['interview', 'Interview and career prep'], ['nursing', 'Nursing career in Germany'], ['language', 'Learn German for work'], ['opps', 'Apply for an opening']],
      colleges: [['college', 'A program for our students']],
      industry: [['hire', 'Hire interns or employees'], ['workforce', 'Train my team'], ['collaborate', 'Work with colleges and students'], ['intlhire', 'Recruit nurses from India']],
      mentors: [['mentor', 'Mentor, train or evaluate']]
    };
    var mount = $('[data-picker-form]'), needWrap = $('[data-need]'), needChoices = $('[data-need-choices]');
    var oppsHref = picker.getAttribute('data-opps-href');
    var showForm = function (key, pre) {
      if (key === 'opps') { mount.innerHTML = '<div class="form-card"><h2>Browse open internships and jobs</h2><p class="muted">Each listing has its own application form.</p><p class="mt-1"><a class="btn btn-primary" href="' + esc(oppsHref) + '">See opportunities</a></p></div>'; return; }
      renderForm(mount, key, pre || {});
    };
    var setAudience = function (aud, needKey, pre) {
      $$('[name="aud"]', picker).forEach(function (r) { r.checked = r.value === aud; });
      var opts = NEEDS[aud] || [];
      needWrap.hidden = opts.length < 2;
      needChoices.innerHTML = opts.map(function (o, i) { return '<label><input type="radio" name="need-pick" id="need-' + i + '" value="' + o[0] + '"> ' + esc(o[1]) + '</label>'; }).join('');
      var key = needKey && opts.some(function (o) { return o[0] === needKey; }) ? needKey : opts[0][0];
      $$('[name="need-pick"]', picker).forEach(function (r) { r.checked = r.value === key; });
      showForm(key, pre);
    };
    picker.addEventListener('change', function (e) {
      if (e.target.name === 'aud') setAudience(e.target.value);
      if (e.target.name === 'need-pick') showForm(e.target.value);
    });
    var pre = readPrefill(), fk = pre.form; delete pre.form;
    var audOf = { student: 'students', interview: 'students', nursing: 'students', language: 'students', college: 'colleges', hire: 'industry', workforce: 'industry', collaborate: 'industry', intlhire: 'industry', mentor: 'mentors' };
    var aud = pre.aud || audOf[fk] || 'students'; delete pre.aud;
    setAudience(aud, fk, pre);
  }

  // Footer year
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
