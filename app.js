/* ============================================================================
   Escape room workstation - game logic.
   All content/answers live in config.js. You shouldn't need to edit this file.
   ============================================================================ */
(() => {
  'use strict';

  const C = window.ESCAPE_CONFIG;
  const KEY = 'wayfairEscapeRoom.v1';
  const TASKS = ['plexiglass', 'coffee', 'stamps'];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  const norm = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  /* ------------------------------------------------------------------ state */
  const defaults = () => ({
    gatePassed: false,
    startedAt: null,
    endedAt: null,
    penaltySec: 0,
    penaltyBy: { plexiglass: 0, coffee: 0, stamps: 0, final: 0 },
    solved: { plexiglass: false, coffee: false, stamps: false, final: false },
    hints: { plexiglass: 0, coffee: 0, stamps: 0, final: 0 },
    special: { coffee: false },
    notes: { plexiglass: '', coffee: '', stamps: '', bonus: '', free: '' }
  });

  function merge(base, extra) {
    if (!extra || typeof extra !== 'object') return base;
    for (const k of Object.keys(base)) {
      if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) merge(base[k], extra[k]);
      else if (extra[k] !== undefined) base[k] = extra[k];
    }
    return base;
  }
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return merge(defaults(), JSON.parse(raw));
    } catch (e) { /* ignore */ }
    return defaults();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }

  /* Game-master reset:  index.html?reset  (or press Ctrl+Alt+R) */
  if (/[?&]reset\b/.test(location.search)) {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    history.replaceState(null, '', location.pathname);
  }
  let S = load();

  /* ------------------------------------------------------------------ time */
  const fmt = (sec) => {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    const mm = String(m).padStart(2, '0'), ss = String(s).padStart(2, '0');
    return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  };
  const elapsed = () => {
    if (!S.startedAt) return 0;
    const end = S.endedAt || Date.now();
    return (end - S.startedAt) / 1000 + S.penaltySec;
  };
  function tick() {
    $('#tray-time').textContent = fmt(elapsed());
    $('#tray-pen').textContent = S.penaltySec ? `(+${fmt(S.penaltySec)} hints)` : '';
  }

  /* ----------------------------------------------------------------- icons */
  const ICONS = {
    folder: (s) => `<svg width="${s}" height="${s}" viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M2 7h11l2 3h15v18H2z" fill="#d8b43c" stroke="#000"/><path d="M2 12h28v16H2z" fill="#f7e27a" stroke="#000"/></svg>`,
    txt: (s) => `<svg width="${s}" height="${s}" viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M7 3h13l6 6v20H7z" fill="#fff" stroke="#000"/><path d="M20 3v6h6" fill="#ddd" stroke="#000"/><path d="M10 14h12M10 18h12M10 22h12M10 26h8" stroke="#555"/></svg>`,
    trash: (s) => `<svg width="${s}" height="${s}" viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M8 9h16l-2 20H10z" fill="#cfd8dc" stroke="#000"/><path d="M6 6h20v3H6z" fill="#9aa5ab" stroke="#000"/><path d="M13 5h6v1h-6z" fill="#000"/><path d="M12 13v13M16 13v13M20 13v13" stroke="#6b7479"/></svg>`,
    mail: (s) => `<svg width="${s}" height="${s}" viewBox="0 0 32 32" shape-rendering="crispEdges"><rect x="3" y="8" width="26" height="17" fill="#fff" stroke="#000"/><path d="M3 8l13 10L29 8" fill="none" stroke="#000"/></svg>`,
    badge: (s) => `<svg width="${s}" height="${s}" viewBox="0 0 32 32" shape-rendering="crispEdges"><path d="M12 1l4 7 4-7" fill="none" stroke="#c22" stroke-width="2"/><rect x="7" y="8" width="18" height="22" fill="#fff" stroke="#000"/><rect x="10" y="11" width="7" height="8" fill="#6aa7e0" stroke="#000"/><path d="M10 23h12M10 26h8" stroke="#555"/></svg>`
  };
  const icon = (name, size = 32) => (ICONS[name] || ICONS.txt)(size);

  /* ------------------------------------------------------------------ apps */
  const APPS = {
    readme:      { title: () => C.readme.windowTitle, icon: 'txt', label: 'READ_ME_FIRST.txt', w: 520, render: renderReadme },
    notes:       { title: () => C.notes.windowTitle, icon: 'txt', label: 'My_Notes.txt', w: 480, render: renderNotes },
    plexiglass:  { title: () => C.plexiglass.windowTitle, icon: 'folder', label: () => C.plexiglass.folderName, w: 640, render: (b) => renderPuzzle('plexiglass', b, () => C.plexiglass.html) },
    coffee:      { title: () => C.coffee.windowTitle, icon: 'folder', label: () => C.coffee.folderName, w: 640, render: (b) => renderPuzzle('coffee', b, receiptHTML) },
    stamps:      { title: () => C.stamps.windowTitle, icon: 'folder', label: () => C.stamps.folderName, w: 640, render: (b) => renderPuzzle('stamps', b, stampsHTML) },
    hr:          { title: () => C.bonus.windowTitle, icon: 'mail', label: () => C.bonus.iconLabel, w: 460, render: renderHR },
    clockout:    { title: () => C.final.windowTitle, icon: 'badge', label: () => C.final.iconLabel, w: 480, render: (b) => renderPuzzle('final', b, () => `<div class="paper">${C.final.introHtml}</div>`, true) },
    trash:       { title: () => C.trash.windowTitle, icon: 'trash', label: 'Recycle Bin', w: 360, render: renderTrash }
  };
  const label = (a) => (typeof a.label === 'function' ? a.label() : a.label);

  const allTasksDone = () => TASKS.every((k) => S.solved[k]);
  function desktopApps() {
    const list = [...TASKS, 'notes', 'readme'];
    if (allTasksDone()) list.push('hr', 'clockout');
    list.push('trash');
    return list;
  }

  function renderIcons(newIds = []) {
    const box = $('#icons');
    box.innerHTML = '';
    for (const id of desktopApps()) {
      const a = APPS[id];
      const b = el(`<button class="icon" data-id="${id}" type="button">${icon(a.icon, 32)}<span class="label">${label(a)}</span></button>`);
      if (S.solved[id === 'clockout' ? 'final' : id]) b.classList.add('done');
      if (newIds.includes(id)) b.classList.add('newbie');
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      b.addEventListener('click', (e) => {
        $$('.icon').forEach((i) => i.classList.remove('sel'));
        b.classList.add('sel');
        b.classList.remove('newbie');
        if (coarse || e.detail === 0) openApp(id);
      });
      b.addEventListener('dblclick', () => openApp(id));
      box.appendChild(b);
    }
  }

  /* ------------------------------------------------------- window manager */
  const wins = {};
  let zTop = 10, cascade = 0;

  function openApp(id) {
    closeStartMenu();
    if (wins[id]) { focusWin(id); return; }
    const app = APPS[id];
    const w = el(`
      <div class="win" data-id="${id}" style="width:${app.w || 560}px">
        <div class="titlebar">
          <span class="ticon">${icon(app.icon, 16)}</span>
          <span class="ttitle">${app.title()}</span>
          <span class="tbtns">
            <button class="tbtn" data-act="min" type="button" aria-label="Minimize">_</button>
            <button class="tbtn" data-act="max" type="button" aria-label="Maximize">&#9633;</button>
            <button class="tbtn" data-act="close" type="button" aria-label="Close">&#10005;</button>
          </span>
        </div>
        <div class="win-body"></div>
      </div>`);
    $('#windows').appendChild(w);
    wins[id] = { el: w, btn: null };   // must exist before render (puzzle footers look it up)
    app.render($('.win-body', w), w);

    const off = (cascade++ % 6) * 26;
    const left = Math.max(4, Math.min(110 + off, innerWidth - w.offsetWidth - 6));
    const top = Math.max(4, Math.min(14 + off, innerHeight - 40 - w.offsetHeight));
    w.style.left = left + 'px';
    w.style.top = top + 'px';

    const btn = el(`<button class="task-btn" type="button">${icon(app.icon, 16)}<span>${app.title().replace(/ - .*/, '')}</span></button>`);
    btn.addEventListener('click', () => {
      if (w.hidden) focusWin(id);
      else if (btn.classList.contains('active')) minWin(id);
      else focusWin(id);
    });
    $('#task-buttons').appendChild(btn);

    wins[id].btn = btn;
    w.addEventListener('pointerdown', () => focusWin(id), true);
    $('.tbtns', w).addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'min') minWin(id);
      if (act === 'max') w.classList.toggle('max');
      if (act === 'close') closeWin(id);
    });
    drag(w, $('.titlebar', w));
    $('.titlebar', w).addEventListener('dblclick', (e) => { if (!e.target.closest('button')) w.classList.toggle('max'); });
    focusWin(id);
  }

  function focusWin(id) {
    const w = wins[id];
    if (!w) return;
    w.el.hidden = false;
    w.el.style.zIndex = ++zTop;
    for (const k of Object.keys(wins)) {
      wins[k].el.classList.toggle('inactive', k !== id);
      wins[k].btn.classList.toggle('active', k === id);
    }
  }
  function minWin(id) {
    const w = wins[id];
    w.el.hidden = true;
    w.btn.classList.remove('active');
  }
  function closeWin(id) {
    const w = wins[id];
    if (!w) return;
    w.el.remove();
    w.btn.remove();
    delete wins[id];
  }
  function drag(win, handle) {
    handle.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button') || win.classList.contains('max')) return;
      const r = win.getBoundingClientRect();
      const dx = e.clientX - r.left, dy = e.clientY - r.top;
      handle.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const x = Math.min(Math.max(ev.clientX - dx, 80 - r.width), innerWidth - 80);
        const y = Math.min(Math.max(ev.clientY - dy, 0), innerHeight - 70);
        win.style.left = x + 'px';
        win.style.top = y + 'px';
      };
      const up = () => {
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
        handle.removeEventListener('pointercancel', up);
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
      handle.addEventListener('pointercancel', up);
    });
  }

  /* ----------------------------------------------------------- start menu */
  function buildStartMenu() {
    const m = $('#start-menu');
    m.innerHTML = '';
    for (const id of desktopApps()) {
      const a = APPS[id];
      const b = el(`<button class="menu-item" type="button">${icon(a.icon, 20)}<span>${label(a)}</span></button>`);
      b.addEventListener('click', () => openApp(id));
      m.appendChild(b);
    }
    m.appendChild(el('<div class="menu-sep"></div>'));
    const sd = el('<button class="menu-item" type="button"><span style="width:20px;text-align:center">&#9211;</span><span>Shut Down...</span></button>');
    sd.addEventListener('click', () => {
      closeStartMenu();
      dialog({ title: C.shutdown.title, message: C.shutdown.text, buttons: [{ label: 'OK', value: true, primary: true }] });
    });
    m.appendChild(sd);
  }
  function closeStartMenu() { $('#start-menu').hidden = true; }
  $('#start-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const m = $('#start-menu');
    if (m.hidden) { buildStartMenu(); m.hidden = false; } else m.hidden = true;
  });
  document.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('#start-menu') && !e.target.closest('#start-btn')) closeStartMenu();
    if (!e.target.closest('.icon')) $$('.icon').forEach((i) => i.classList.remove('sel'));
  });

  /* ---------------------------------------------------------- dialogs etc */
  function dialog({ title, message, buttons }) {
    return new Promise((resolve) => {
      const bg = el(`
        <div class="modal-bg">
          <div class="win" role="dialog" aria-modal="true">
            <div class="titlebar"><span class="ttitle">${title}</span></div>
            <div class="win-body">
              <div class="modal-msg"><div class="mi warn">!</div><div>${message}</div></div>
              <div class="btn-row"></div>
            </div>
          </div>
        </div>`);
      const row = $('.btn-row', bg);
      let first = null;
      const done = (v) => { document.removeEventListener('keydown', onKey, true); bg.remove(); resolve(v); };
      const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); done(false); } };
      for (const b of buttons) {
        const btn = el(`<button class="btn" type="button">${b.label}</button>`);
        btn.addEventListener('click', () => done(b.value));
        row.appendChild(btn);
        if (b.primary || !first) first = btn;
      }
      document.addEventListener('keydown', onKey, true);
      $('#modal-root').appendChild(bg);
      first.focus();
    });
  }
  const confirmHint = (msg) => dialog({
    title: 'Use a hint?',
    message: `${msg}<br><br>Using a hint adds <b>${fmt(C.hintPenaltySeconds)}</b> to your time.`,
    buttons: [{ label: 'Use Hint', value: true }, { label: 'Cancel', value: false, primary: true }]
  });

  function toast(title, text) {
    const t = el(`<div class="toast"><b>${title}</b>${text || ''}</div>`);
    $('#toasts').appendChild(t);
    setTimeout(() => t.remove(), 5200);
  }

  /* ---------------------------------------------------------- simple apps */
  function renderReadme(body) {
    body.innerHTML = `<div class="paper memo">${C.intro.html}</div>`;
  }
  function renderTrash(body) {
    body.innerHTML = `<div class="trash-body">${icon('trash', 48)}<p>${C.trash.text}</p></div>`;
  }
  function renderHR(body) {
    body.innerHTML = `<div class="paper">${C.bonus.html}</div>`;
  }
  function renderNotes(body) {
    const rows = ['plexiglass', 'coffee', 'stamps', 'bonus'].map((k) => `
      <tr>
        <td><label for="n-${k}">${C.notes.labels[k]}</label></td>
        <td><input id="n-${k}" class="field letter" data-note="${k}" maxlength="1" autocomplete="off" spellcheck="false"></td>
      </tr>`).join('');
    body.innerHTML = `
      <p style="margin:0">${C.notes.intro}</p>
      <table class="notes-table">${rows}</table>
      <textarea class="notes-area" data-note="free" placeholder="${C.notes.freePlaceholder}" spellcheck="false"></textarea>`;
    $$('[data-note]', body).forEach((inp) => {
      inp.value = S.notes[inp.dataset.note] || '';
      inp.addEventListener('input', () => {
        if (inp.tagName === 'INPUT') inp.value = inp.value.toUpperCase();
        S.notes[inp.dataset.note] = inp.value;
        save();
      });
    });
  }

  /* -------------------------------------------------------- puzzle windows */
  function receiptHTML() {
    const r = C.coffee.receipt;
    const lines = r.orders.map((o) => `<p class="line"><b>${o.name.toUpperCase()}</b><span>${o.drink}</span><span>${o.addIn}</span></p>`).join('');
    return `
      <div class="receipt">
        <div class="center"><div class="shop">${r.shop}</div><div>${r.sub}</div></div>
        <hr>
        <div class="center">${r.orderNo}<br>${r.timeLine}</div>
        <hr>
        ${lines}
        <hr>
        <div class="center">${r.footer.join('<br>')}</div>
      </div>`;
  }

  function stampsHTML() {
    const s = C.stamps;
    /* VIDEO SWAP: if config.js has stamps.videoSrc set (e.g. "assets/ritual.mp4")
       the video is shown here instead of the pamphlet. See the instructions in
       config.js. */
    const content = s.videoSrc
      ? `<div class="video-wrap"><video controls preload="metadata" ${s.videoPoster ? `poster="${s.videoPoster}"` : ''} src="${s.videoSrc}"></video></div>`
      : s.pamphletHtml;
    return content;
  }

  function cfgFor(key) { return key === 'final' ? C.final : C[key]; }

  function renderPuzzle(key, body, bodyFn, noFolder) {
    const cfg = cfgFor(key);
    const inner = noFolder
      ? `<div>${bodyFn()}</div>`
      : `<div class="folder"><div class="folder-tab">${cfg.tab}</div><div class="folder-body">${bodyFn()}</div></div>`;
    body.innerHTML = `${inner}<div class="puzzle-foot"></div>`;
    renderFoot(key);
  }

  function renderFoot(key) {
    const winId = key === 'final' ? 'clockout' : key;
    const w = wins[winId];
    if (!w) return;
    const foot = $('.puzzle-foot', w.el);
    const cfg = cfgFor(key);
    foot.innerHTML = S.solved[key] ? solvedHTML(key) : answerHTML(key) + hintsHTML(key);
    if (S.solved[key]) return;

    const form = $('form.answer', foot);
    form.addEventListener('submit', (e) => { e.preventDefault(); submitAnswer(key, form); });

    if (key === 'final') {
      const boxes = $$('.code-boxes input', form);
      boxes.forEach((b, i) => {
        b.addEventListener('input', () => {
          b.value = b.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
          if (b.value && boxes[i + 1]) boxes[i + 1].focus();
        });
        b.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !b.value && boxes[i - 1]) boxes[i - 1].focus();
        });
      });
    } else {
      $('input', form).addEventListener('input', (e) => {
        if (key !== 'stamps') e.target.value = e.target.value.toUpperCase().slice(0, 1);
      });
    }

    $$('[data-hint]', foot).forEach((btn) => {
      btn.addEventListener('click', async () => {
        const special = btn.dataset.hint === 'special';
        const ok = await confirmHint(special ? cfg.specialHint.confirm : 'You are about to reveal the next hint.');
        if (ok) useHint(key, special);
      });
    });
  }

  function answerHTML(key) {
    const cfg = cfgFor(key);
    if (key === 'final') {
      const n = finalCode().length;
      const boxes = Array.from({ length: n }, (_, i) => `<input class="field letter" maxlength="1" autocomplete="off" spellcheck="false" aria-label="Letter ${i + 1}">`).join('');
      return `
        <form class="answer" autocomplete="off">
          <div class="code-boxes">${boxes}</div>
          <div class="msg" aria-live="polite" style="text-align:center"></div>
          <div class="btn-row" style="flex:1 1 100%"><button class="btn" type="submit">${cfg.submitText}</button></div>
        </form>`;
    }
    if (key === 'stamps') {
      return `
        <div class="locked-file">${icon('txt', 28)}<div><b>${cfg.lockedFileName}</b><br><span class="small">&#128274; Locked</span></div></div>
        <form class="answer" autocomplete="off">
          <label for="pw-input">${cfg.passwordLabel}</label>
          <input id="pw-input" class="field pw" autocomplete="off" autocapitalize="characters" spellcheck="false">
          <button class="btn" type="submit">${cfg.submitText}</button>
          <div class="msg" aria-live="polite"></div>
        </form>`;
    }
    return `
      <form class="answer" autocomplete="off">
        <label for="ans-${key}">${cfg.answerLabel}</label>
        <input id="ans-${key}" class="field letter" maxlength="1" autocomplete="off" spellcheck="false">
        <button class="btn" type="submit">${cfg.submitText}</button>
        <div class="msg" aria-live="polite"></div>
      </form>`;
  }

  function hintsHTML(key) {
    const cfg = cfgFor(key);
    const used = S.hints[key];
    const total = cfg.hints.length;
    const items = cfg.hints.slice(0, used).map((h, i) => `<li><b>Hint ${i + 1}:</b> ${h}</li>`);
    if (cfg.specialHint && S.special[key]) items.push(`<li><b>Backup supply:</b> ${cfg.specialHint.text}</li>`);

    const bar = [];
    if (used < total) bar.push(`<button class="btn" type="button" data-hint="next">&#128161; Hint (+${fmt(C.hintPenaltySeconds)})</button>`);
    else bar.push('<span class="small">No more hints available.</span>');
    if (cfg.specialHint && !S.special[key]) bar.push(`<button class="btn" type="button" data-hint="special">${cfg.specialHint.label} (+${fmt(C.hintPenaltySeconds)})</button>`);

    return `
      <div class="hints">
        <div class="hint-bar">${bar.join('')}</div>
        ${items.length ? `<ul class="hint-list">${items.join('')}</ul>` : ''}
      </div>`;
  }

  function solvedHTML(key) {
    const cfg = cfgFor(key);
    if (key === 'final') {
      const by = [['Q3 Transparency', 'plexiglass'], ['Break Room Orders', 'coffee'], ['Onboarding Ritual', 'stamps'], ['Final Code', 'final']]
        .map(([n, k]) => `${n}: ${S.hints[k]} hint${S.hints[k] === 1 ? '' : 's'}${S.special[k] ? ' + backup supply' : ''}`);
      return `
        <div class="done">
          <div class="stamp">CLOCKED OUT</div>
          <div class="paper">${cfg.successHtml}</div>
          <p style="margin-top:10px">Final time: <b>${fmt(elapsed())}</b></p>
          <p class="small">Includes ${fmt(S.penaltySec)} in hint penalties.</p>
          <p class="small">${by.join(' &middot; ')}</p>
        </div>`;
    }
    if (key === 'stamps') {
      return `
        <div class="done">
          <div class="stamp">TASK COMPLETE</div>
          <div class="paper" style="text-align:left">
            <p><b>${cfg.lockedFileName}</b> &mdash; <i>unlocked</i></p>
            <p>${cfg.unlockedText}</p>
            <p style="text-align:center"><span class="bigletter">${C.letters.stamps}</span></p>
          </div>
          <p class="logline" style="margin-top:10px">${cfg.orderClue}</p>
          <p class="small">Don't forget to write it down in My_Notes.txt.</p>
        </div>`;
    }
    return `
      <div class="done">
        <div class="stamp">TASK COMPLETE</div>
        <p>${cfg.successText}</p>
        <p>Letter on file: <span class="bigletter">${C.letters[key]}</span></p>
        <p class="logline">${cfg.orderClue}</p>
        <p class="small">Don't forget to write it down in My_Notes.txt.</p>
      </div>`;
  }

  /* The code that goes into the bike lock, built from letters + order. */
  function finalCode() { return C.order.map((k) => C.letters[k]).join('').toUpperCase(); }

  function submitAnswer(key, form) {
    const cfg = cfgFor(key);
    const msg = $('.msg', form);
    let ok = false;
    if (key === 'final') {
      ok = norm($$('.code-boxes input', form).map((i) => i.value).join('')) === norm(finalCode());
    } else if (key === 'stamps') {
      ok = norm($('input', form).value) === norm(C.stamps.password);
    } else {
      ok = norm($('input', form).value) === norm(C.letters[key]);
    }
    if (!ok) {
      msg.textContent = cfg.wrongText;
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      return;
    }
    S.solved[key] = true;
    if (key === 'final') S.endedAt = Date.now();
    save();
    renderFoot(key);
    tick();
    if (key === 'final') {
      toast('Clocked out', `Final time ${fmt(elapsed())}`);
    } else {
      toast('Task logged', 'Nice work. Write your letter down in My_Notes.txt.');
      if (allTasksDone()) unlockEnding();
      else renderIcons();
    }
  }

  function unlockEnding() {
    renderIcons(['hr', 'clockout']);
    setTimeout(() => toast(C.bonus.toast, 'Check your desktop. Also: Clock_Out.exe is now available.'), 900);
  }

  function useHint(key, special) {
    const cfg = cfgFor(key);
    if (special) {
      if (S.special[key]) return;
      S.special[key] = true;
    } else {
      if (S.hints[key] >= cfg.hints.length) return;
      S.hints[key] += 1;
    }
    S.penaltySec += C.hintPenaltySeconds;
    S.penaltyBy[key] += C.hintPenaltySeconds;
    save();
    renderFoot(key);
    tick();
    toast('Time added', `+${fmt(C.hintPenaltySeconds)} for using a hint.`);
  }

  /* ----------------------------------------------------------------- gate */
  function initGate() {
    const gate = $('#gate');
    const I = C.intro;
    $('#gate-title').textContent = I.windowTitle;
    $('#gate-memo').innerHTML = I.html;
    $('#gate-continue').textContent = I.continueButton;
    $('#gate-relocate-title').textContent = I.relocateTitle;
    $('#gate-relocate').innerHTML = I.relocateHtml;
    const confirmBtn = $('#gate-confirm');
    confirmBtn.textContent = I.confirmButton;
    gate.hidden = false;

    $('#gate-continue').addEventListener('click', () => {
      $('#gate-step1').hidden = true;
      $('#gate-step2').hidden = false;
      const total = Math.max(0, C.gateCountdownSeconds);
      const end = Date.now() + total * 1000;
      const count = $('#gate-count'), bar = $('#gate-bar');
      const t = setInterval(() => {
        const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
        const pct = total ? Math.min(100, ((total - left) / total) * 100) : 100;
        bar.style.width = pct + '%';
        if (left > 0) {
          count.textContent = `${I.confirmWaiting} ${fmt(left)}`;
        } else {
          clearInterval(t);
          count.textContent = '';
          confirmBtn.disabled = false;
          confirmBtn.focus();
        }
      }, 250);
    });

    confirmBtn.addEventListener('click', () => {
      S.gatePassed = true;
      S.startedAt = Date.now();
      save();
      gate.hidden = true;
      startDesktop(true);
    });
  }

  function startDesktop(fresh) {
    renderIcons();
    tick();
    if (fresh) toast('Shift started', 'The clock is running. Good luck, intern.');
  }

  /* ------------------------------------------------------------- game master */
  document.addEventListener('keydown', async (e) => {
    if (e.ctrlKey && e.altKey && (e.key === 'r' || e.key === 'R')) {
      e.preventDefault();
      const ok = await dialog({
        title: 'Reset game',
        message: 'Reset the whole game for the next team? This clears all progress, hints and the stopwatch.',
        buttons: [{ label: 'Reset', value: true }, { label: 'Cancel', value: false, primary: true }]
      });
      if (ok) { try { localStorage.removeItem(KEY); } catch (err) { /* ignore */ } location.reload(); }
    }
  });

  /* ------------------------------------------------------------------ boot */
  setInterval(tick, 250);
  if (S.gatePassed) startDesktop(false);
  else { tick(); initGate(); }
})();
