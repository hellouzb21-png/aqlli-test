// AQLLI-TEST — Main application
// Features: quiz engine, topic selection, timer, spaced repetition, XP, streaks,
// share card, i18n, stats, CSV export, dark mode, PWA, sounds, toasts.

(() => {
  'use strict';

  // ─────────── State ───────────
  const state = {
    route: 'home',           // home | quiz | result | stats | settings | review
    settings: loadSettings(),
    session: null,           // current quiz session
    lastResult: null,
    stats: loadStats()
  };

  const STORAGE_KEYS = {
    settings: 'aqlli_settings',
    stats: 'aqlli_stats',
    attempts: 'aqlli_attempts',
    feedback: 'aqlli_feedback',
    mistakes: 'aqlli_mistakes',
    achievements: 'aqlli_achievements',
    hasPlayed: 'aqlli_has_played'
  };

  // ─────────── Persistence ───────────
  function loadSettings() {
    const def = {
      lang: 'uz',
      theme: 'auto',
      sound: true,
      timerPerQ: 0,    // 0 = off, otherwise seconds
      topics: [],      // empty = all
      difficulty: 0,   // 0 = mixed, 1/2/3 = specific
      questionCount: 5
    };
    try {
      return { ...def, ...JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}') };
    } catch { return def; }
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
  }

  function loadStats() {
    const def = {
      totalAttempts: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      bestScore: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastDate: null,
      xp: 0,
      topicStats: {}  // {topicId: {correct, total}}
    };
    try {
      return { ...def, ...JSON.parse(localStorage.getItem(STORAGE_KEYS.stats) || '{}') };
    } catch { return def; }
  }

  function saveStats() {
    localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(state.stats));
  }

  function t(key) {
    return (window.I18N[state.settings.lang] || window.I18N.uz)[key] || key;
  }

  // ─────────── Theme ───────────
  function applyTheme() {
    const theme = state.settings.theme;
    let actual = theme;
    if (theme === 'auto') {
      actual = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', actual);
  }

  // ─────────── Audio (WebAudio, no files) ───────────
  let audioCtx = null;
  function beep(freq, duration = 100, volume = 0.1) {
    if (!state.settings.sound) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration / 1000);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration / 1000);
    } catch {}
  }
  const SFX = {
    correct: () => { beep(523, 80); setTimeout(() => beep(784, 120), 80); },
    wrong:   () => { beep(200, 200, 0.08); },
    click:   () => { beep(400, 30, 0.05); },
    complete:() => { beep(523, 80); setTimeout(() => beep(659, 80), 80); setTimeout(() => beep(784, 150), 160); }
  };

  function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  // ─────────── DOM helpers (safe) ───────────
  function el(tag, opts) {
    const node = document.createElement(tag);
    if (!opts) return node;
    if (opts.text != null) node.textContent = opts.text;
    if (opts.cls) node.className = opts.cls;
    if (opts.id) node.id = opts.id;
    if (opts.style) node.setAttribute('style', opts.style);
    if (opts.onclick) node.addEventListener('click', opts.onclick);
    if (opts.oninput) node.addEventListener('input', opts.oninput);
    if (opts.onchange) node.addEventListener('change', opts.onchange);
    if (opts.html && typeof opts.html === 'string') {
      // only used for sanitized, trusted text + emoji
      const frag = document.createDocumentFragment();
      opts.html.split(/(<br>)/).forEach(part => {
        if (part === '<br>') frag.appendChild(document.createElement('br'));
        else if (part) frag.appendChild(document.createTextNode(part));
      });
      node.appendChild(frag);
    }
    if (opts.attrs) {
      for (const k in opts.attrs) node.setAttribute(k, opts.attrs[k]);
    }
    if (opts.children) {
      for (const child of opts.children) if (child) node.appendChild(child);
    }
    return node;
  }

  function clearApp() {
    const app = document.getElementById('app');
    while (app.firstChild) app.removeChild(app.firstChild);
    return app;
  }

  // ─────────── Toast ───────────
  let toastTimer = null;
  function toast(msg) {
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
  }

  // ─────────── XP popup ───────────
  function showXPPopup(x, y, xp) {
    const p = document.createElement('div');
    p.className = 'xp-popup';
    p.textContent = `+${xp} XP`;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }

  // ─────────── Top bar ───────────
  function buildTopBar({ showHome = true } = {}) {
    const bar = el('div', { cls: 'top-bar' });
    const left = el('div', { cls: 'top-bar-left' });
    left.appendChild(el('span', { cls: 'logo', text: t('appTitle') }));
    bar.appendChild(left);

    const right = el('div', { cls: 'top-bar-right' });
    if (showHome && state.route !== 'home') {
      right.appendChild(el('button', {
        cls: 'icon-btn', attrs: { title: t('homeBtn'), 'aria-label': t('homeBtn') },
        text: '\u2190', onclick: () => navigate('home')
      }));
    }
    right.appendChild(el('button', {
      cls: 'icon-btn', attrs: { title: t('achievementsTitle'), 'aria-label': t('achievementsTitle') },
      text: '\ud83c\udfc6', onclick: () => navigate('achievements')
    }));
    right.appendChild(el('button', {
      cls: 'icon-btn', attrs: { title: t('statsBtn'), 'aria-label': t('statsBtn') },
      text: '\ud83d\udcca', onclick: () => navigate('stats')
    }));
    right.appendChild(el('button', {
      cls: 'icon-btn', attrs: { title: t('settingsBtn'), 'aria-label': t('settingsBtn') },
      text: '\u2699\ufe0f', onclick: () => navigate('settings')
    }));
    bar.appendChild(right);
    return bar;
  }

  // ─────────── Navigation ───────────
  function navigate(route, extra) {
    state.route = route;
    if (extra) Object.assign(state, extra);
    render();
  }

  function render() {
    const app = clearApp();
    app.appendChild(buildTopBar());

    // First-time visitor: landing page
    const hasPlayed = localStorage.getItem(STORAGE_KEYS.hasPlayed) === '1';
    if (state.route === 'home' && !hasPlayed && state.stats.totalAttempts === 0) {
      renderLanding(app);
      return;
    }

    switch (state.route) {
      case 'home': renderHome(app); break;
      case 'quiz': renderQuiz(app); break;
      case 'result': renderResult(app); break;
      case 'stats': renderStats(app); break;
      case 'settings': renderSettings(app); break;
      case 'achievements': renderAchievements(app); break;
      default: renderHome(app);
    }
  }

  // ─────────── LANDING PAGE (first-time visitors) ───────────
  function renderLanding(app) {
    // Hero
    const hero = el('div', { style: 'text-align: center; padding: 20px 0 12px;' });
    hero.appendChild(el('div', {
      style: 'font-size: 60px; margin-bottom: 8px;',
      text: '\ud83e\udde0'
    }));
    hero.appendChild(el('h1', {
      style: 'font-size: 32px; margin-bottom: 8px;',
      text: t('landingHero')
    }));
    hero.appendChild(el('p', {
      cls: 'subtitle',
      style: 'font-size: 16px; margin-bottom: 18px;',
      text: t('landingSub')
    }));
    app.appendChild(hero);

    // Social proof chips
    const chips = el('div', { cls: 'streak-banner' });
    chips.appendChild(makeChip('\ud83d\udcda', `${window.QUESTION_BANK.length}+ ${t('questions')}`));
    chips.appendChild(makeChip('\ud83c\udf10', `${Object.keys(window.TOPICS).length} ${t('topicsShort')}`));
    chips.appendChild(makeChip('\ud83c\udd93', t('free')));
    app.appendChild(chips);

    // Features grid
    const features = el('div', { style: 'margin: 20px 0;' });
    const feats = [
      ['\u26a1', t('feat1Title'), t('feat1Desc')],
      ['\ud83d\udd25', t('feat2Title'), t('feat2Desc')],
      ['\ud83c\udfaf', t('feat3Title'), t('feat3Desc')],
      ['\ud83d\udcca', t('feat4Title'), t('feat4Desc')]
    ];
    feats.forEach(([emoji, title, desc]) => {
      const row = el('div', { style: 'display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border);' });
      row.appendChild(el('div', { style: 'font-size: 24px; flex: 0 0 32px;', text: emoji }));
      const txt = el('div');
      txt.appendChild(el('div', { style: 'font-weight: 700; font-size: 14px; margin-bottom: 2px;', text: title }));
      txt.appendChild(el('div', { style: 'font-size: 13px; color: var(--text-dim);', text: desc }));
      row.appendChild(txt);
      features.appendChild(row);
    });
    app.appendChild(features);

    // CTA
    app.appendChild(el('button', {
      cls: 'btn',
      text: '\u25b6 ' + t('ctaStart'),
      style: 'font-size: 16px; padding: 18px;',
      onclick: () => {
        localStorage.setItem(STORAGE_KEYS.hasPlayed, '1');
        if (window.AQLLI_TRACK) window.AQLLI_TRACK('landing_cta_click');
        render();
      }
    }));

    // Waitlist (soft ask)
    app.appendChild(el('div', { cls: 'tiny', style: 'text-align: center; margin-top: 12px;', text: t('noSignup') }));
  }

  // ─────────── Achievements ───────────
  function loadAchievements() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.achievements) || '[]'); }
    catch { return []; }
  }
  function saveAchievements(ids) {
    localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(ids));
  }

  function renderAchievements(app) {
    app.appendChild(el('h1', { text: '\ud83c\udfc6 ' + t('achievementsTitle') }));
    app.appendChild(el('p', { cls: 'subtitle', text: t('achievementsSub') }));

    const unlocked = new Set(loadAchievements());
    const grid = el('div', { style: 'display: flex; flex-direction: column; gap: 10px;' });
    (window.ACHIEVEMENTS || []).forEach(a => {
      const isUnlocked = unlocked.has(a.id);
      const row = el('div', {
        style: `display: flex; gap: 12px; padding: 14px; background: var(--card-alt); border-radius: 12px; ${isUnlocked ? '' : 'opacity: 0.45;'}`
      });
      row.appendChild(el('div', { style: 'font-size: 36px;', text: a.icon }));
      const txt = el('div', { style: 'flex: 1;' });
      txt.appendChild(el('div', {
        style: 'font-weight: 700; font-size: 14px;',
        text: a.name[state.settings.lang] || a.name.uz
      }));
      txt.appendChild(el('div', {
        style: 'font-size: 12px; color: var(--text-dim);',
        text: a.desc[state.settings.lang] || a.desc.uz
      }));
      row.appendChild(txt);
      if (isUnlocked) row.appendChild(el('div', { style: 'color: var(--success); font-weight: 700;', text: '\u2713' }));
      grid.appendChild(row);
    });
    app.appendChild(grid);

    const progress = el('div', { style: 'margin-top: 20px; text-align: center; color: var(--text-dim); font-size: 13px;' });
    progress.textContent = `${unlocked.size} / ${(window.ACHIEVEMENTS || []).length}`;
    app.appendChild(progress);
  }

  function checkAndNotifyAchievements() {
    if (!window.checkAchievements) return;
    const previous = loadAchievements();
    const { unlocked, newlyUnlocked } = window.checkAchievements({
      ...state.stats,
      fastestCompletion: state.fastestCompletion
    }, previous);
    saveAchievements(unlocked);
    newlyUnlocked.forEach((a, i) => {
      setTimeout(() => {
        toast(`${a.icon} ${a.name[state.settings.lang] || a.name.uz}`);
        SFX.complete();
        if (window.AQLLI_TRACK) window.AQLLI_TRACK('achievement_unlock', { id: a.id });
      }, i * 1500);
    });
  }

  // ─────────── HOME: topic & difficulty selection ───────────
  function renderHome(app) {
    app.appendChild(el('h1', { text: t('appTagline') }));

    // PWA install banner (if available)
    if (window._deferredInstallPrompt) {
      const banner = el('div', { cls: 'install-banner' });
      banner.appendChild(el('span', { text: '\ud83d\udce5 ' + t('installApp') }));
      banner.appendChild(el('button', {
        text: 'Install',
        onclick: async () => {
          window._deferredInstallPrompt.prompt();
          const res = await window._deferredInstallPrompt.userChoice;
          if (res.outcome === 'accepted') toast(t('installed'));
          window._deferredInstallPrompt = null;
          render();
        }
      }));
      app.appendChild(banner);
    }

    // XP / Level / Streak summary
    if (state.stats.totalAttempts > 0) {
      const level = Math.floor(state.stats.xp / 100) + 1;
      const levelXp = state.stats.xp % 100;

      const row = el('div', { cls: 'streak-banner' });
      row.appendChild(makeChip('\u2b50', `${t('level')} ${level}`));
      row.appendChild(makeChip('\u26a1', `${state.stats.xp} ${t('xpTotal')}`));
      if (state.stats.currentStreak > 0) {
        row.appendChild(makeChip('\ud83d\udd25', `${state.stats.currentStreak}`));
      }
      app.appendChild(row);

      const bar = el('div', { cls: 'xp-bar' });
      bar.appendChild(el('div', { cls: 'xp-fill', style: `width: ${levelXp}%` }));
      app.appendChild(bar);
      const lbl = el('div', { cls: 'xp-label' });
      lbl.appendChild(el('span', { text: `${levelXp}/100 XP` }));
      lbl.appendChild(el('span', { text: `${t('level')} ${level + 1}` }));
      app.appendChild(lbl);
    }

    // Topics
    app.appendChild(el('h2', { text: t('topicsTitle'), style: 'margin-top: 20px;' }));
    const grid = el('div', { cls: 'topic-grid' });
    const selected = new Set(state.settings.topics);

    // "All" tile
    const allTile = el('button', {
      cls: 'topic-tile' + (selected.size === 0 ? ' selected' : ''),
      onclick: () => {
        state.settings.topics = [];
        saveSettings();
        render();
        SFX.click();
      }
    });
    allTile.appendChild(el('span', { cls: 'emoji', text: '\ud83c\udf1f' }));
    allTile.appendChild(el('span', { text: t('allTopics') }));
    grid.appendChild(allTile);

    for (const id in window.TOPICS) {
      const topic = window.TOPICS[id];
      const isSel = selected.has(id);
      const tile = el('button', {
        cls: 'topic-tile' + (isSel ? ' selected' : ''),
        onclick: () => {
          if (selected.has(id)) selected.delete(id);
          else selected.add(id);
          state.settings.topics = [...selected];
          saveSettings();
          render();
          SFX.click();
        }
      });
      tile.appendChild(el('span', { cls: 'emoji', text: topic.emoji }));
      tile.appendChild(el('span', { text: topic[state.settings.lang] || topic.uz }));
      grid.appendChild(tile);
    }
    app.appendChild(grid);

    // Difficulty
    app.appendChild(el('h2', { text: t('difficultyTitle') }));
    const diffRow = el('div', { cls: 'diff-row' });
    const diffs = [
      { v: 0, label: t('diffMixed') },
      { v: 1, label: t('diffEasy') },
      { v: 2, label: t('diffMedium') },
      { v: 3, label: t('diffHard') }
    ];
    diffs.forEach(d => {
      diffRow.appendChild(el('button', {
        cls: 'diff-chip' + (state.settings.difficulty === d.v ? ' selected' : ''),
        text: d.label,
        onclick: () => {
          state.settings.difficulty = d.v;
          saveSettings();
          render();
          SFX.click();
        }
      }));
    });
    app.appendChild(diffRow);

    // Question count
    app.appendChild(el('h2', { text: t('questionCount') }));
    const qrow = el('div', { cls: 'q-count-row' });
    const countLbl = el('span', { cls: 'val', text: String(state.settings.questionCount) });
    const slider = el('input', {
      attrs: { type: 'range', min: '3', max: '20', value: String(state.settings.questionCount) },
      oninput: (e) => {
        state.settings.questionCount = +e.target.value;
        countLbl.textContent = e.target.value;
      },
      onchange: () => { saveSettings(); SFX.click(); }
    });
    qrow.appendChild(slider);
    qrow.appendChild(countLbl);
    app.appendChild(qrow);

    // Daily challenge
    if (window.getDailyChallenge && !window.hasCompletedDaily()) {
      app.appendChild(el('button', {
        cls: 'btn',
        style: 'background: linear-gradient(90deg, #ff9966, #ff5e62);',
        text: `\ud83c\udf1f ${t('dailyChallenge')}`,
        onclick: () => startDailyChallenge()
      }));
    } else if (window.hasCompletedDaily()) {
      app.appendChild(el('div', {
        style: 'padding: 12px; text-align: center; background: var(--card-alt); border-radius: 10px; font-size: 13px; color: var(--text-dim);',
        text: '\u2705 ' + t('dailyDone')
      }));
    }

    // Review mistakes
    const mistakes = loadMistakes();
    if (mistakes.length > 0) {
      app.appendChild(el('button', {
        cls: 'btn ghost',
        text: `\ud83d\udcda ${t('reviewTitle')} (${mistakes.length})`,
        onclick: () => startReview()
      }));
    }

    // Start button
    app.appendChild(el('button', {
      cls: 'btn',
      text: `\u25b6 ${t('startBtn')}`,
      onclick: () => startQuiz()
    }));

    // Referral link
    app.appendChild(el('button', {
      cls: 'btn ghost',
      text: `\ud83d\udd17 ${t('inviteFriends')}`,
      onclick: () => shareReferral()
    }));
  }

  function startDailyChallenge() {
    SFX.click();
    const q = window.getDailyChallenge();
    state.session = {
      questions: [q],
      idx: 0,
      answers: [],
      startedAt: Date.now(),
      qStartedAt: Date.now(),
      isDaily: true
    };
    navigate('quiz');
    if (window.AQLLI_TRACK) window.AQLLI_TRACK('daily_start');
  }

  function shareReferral() {
    SFX.click();
    const link = window.getMyReferralLink ? window.getMyReferralLink() : location.href;
    const text = `${t('appTitle')} \u2014 ${t('landingSub')}\n\n${link}`;
    if (navigator.share) {
      navigator.share({ title: t('appTitle'), text, url: link }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => toast(t('linkCopied')));
    } else {
      prompt('Copy link:', link);
    }
    if (window.AQLLI_TRACK) window.AQLLI_TRACK('referral_share');
  }

  function makeChip(emoji, text) {
    const chip = el('div', { cls: 'stat-chip' });
    chip.appendChild(el('span', { text: emoji }));
    chip.appendChild(el('span', { cls: 'val', text: text }));
    return chip;
  }

  // ─────────── Quiz session ───────────
  function pickQuestions() {
    let pool = window.QUESTION_BANK.slice();
    const topics = state.settings.topics;
    const diff = state.settings.difficulty;

    if (topics.length > 0) pool = pool.filter(q => topics.includes(q.topic));
    if (diff > 0) pool = pool.filter(q => q.difficulty === diff);
    if (pool.length === 0) pool = window.QUESTION_BANK.slice();

    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Add mistakes (spaced repetition — up to 20% from mistakes)
    const mistakes = loadMistakes();
    const n = Math.min(state.settings.questionCount, pool.length);
    const mistakesCount = Math.min(Math.ceil(n * 0.3), mistakes.length);
    const fresh = pool.slice(0, n - mistakesCount);
    const reviewed = mistakes.slice(0, mistakesCount).map(m => window.QUESTION_BANK[m.idx]).filter(Boolean);
    const questions = [...fresh, ...reviewed];

    // Re-shuffle
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    return questions.map(q => ({
      ...q,
      bankIdx: window.QUESTION_BANK.indexOf(q)
    }));
  }

  function startQuiz() {
    SFX.click();
    const questions = pickQuestions();
    if (questions.length === 0) {
      toast('Savollar topilmadi');
      return;
    }
    state.session = {
      questions,
      idx: 0,
      answers: [],
      startedAt: Date.now(),
      qStartedAt: Date.now(),
      timerInterval: null
    };
    navigate('quiz');
  }

  function startReview() {
    SFX.click();
    const mistakes = loadMistakes();
    const questions = mistakes.map(m => ({
      ...window.QUESTION_BANK[m.idx],
      bankIdx: m.idx
    })).filter(q => q.q);
    if (questions.length === 0) {
      toast(t('noMistakes'));
      return;
    }
    state.session = {
      questions,
      idx: 0,
      answers: [],
      startedAt: Date.now(),
      qStartedAt: Date.now(),
      timerInterval: null,
      isReview: true
    };
    navigate('quiz');
  }

  // ─────────── QUIZ VIEW ───────────
  function renderQuiz(app) {
    const s = state.session;
    if (!s) return navigate('home');
    const q = s.questions[s.idx];
    const totalN = s.questions.length;
    const pct = (s.idx / totalN) * 100;

    // Progress
    const bar = el('div', { cls: 'progress-bar' });
    bar.appendChild(el('div', { cls: 'progress-fill', style: `width: ${pct}%` }));
    app.appendChild(bar);

    const topicInfo = window.TOPICS[q.topic];
    const diffDot = '\u2b24'.repeat(q.difficulty) + '\u25cb'.repeat(3 - q.difficulty);
    app.appendChild(el('p', {
      cls: 'subtitle',
      text: `${s.idx + 1} / ${totalN} \u2022 ${topicInfo.emoji} ${topicInfo[state.settings.lang] || topicInfo.uz} \u2022 ${diffDot}`
    }));

    // Timer
    if (state.settings.timerPerQ > 0) {
      const trow = el('div', { cls: 'timer-row' });
      trow.appendChild(el('span', { text: '\u23f1\ufe0f', id: 'timer-icon' }));
      trow.appendChild(el('span', { id: 'timer-text', text: `${state.settings.timerPerQ}${t('seconds')[0]}` }));
      app.appendChild(trow);
      const tbar = el('div', { cls: 'timer-bar' });
      tbar.appendChild(el('div', { cls: 'timer-fill', id: 'timer-fill', style: 'width: 100%' }));
      app.appendChild(tbar);
      startTimer();
    }

    // Question
    app.appendChild(el('div', { cls: 'question', text: q.q }));

    // Options
    const opts = el('div', { cls: 'options' });
    q.opts.forEach((text, i) => {
      opts.appendChild(el('button', {
        cls: 'option',
        text: text,
        attrs: { 'data-idx': String(i) },
        onclick: (e) => selectAnswer(i, e)
      }));
    });
    app.appendChild(opts);

    app.appendChild(el('div', { cls: 'feedback', id: 'feedback' }));

    // Skip
    if (!s.isReview) {
      app.appendChild(el('button', {
        cls: 'btn ghost',
        text: t('skipBtn'),
        onclick: () => skipQuestion()
      }));
    }

    s.qStartedAt = Date.now();
  }

  function startTimer() {
    const s = state.session;
    const total = state.settings.timerPerQ * 1000;
    if (s.timerInterval) clearInterval(s.timerInterval);
    const start = Date.now();
    s.timerInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remain = Math.max(0, total - elapsed);
      const pct = (remain / total) * 100;
      const fill = document.getElementById('timer-fill');
      const txt = document.getElementById('timer-text');
      if (fill) {
        fill.style.width = pct + '%';
        fill.classList.remove('warn', 'danger');
        if (pct < 30) fill.classList.add('danger');
        else if (pct < 60) fill.classList.add('warn');
      }
      if (txt) txt.textContent = Math.ceil(remain / 1000) + 's';
      if (remain <= 0) {
        clearInterval(s.timerInterval);
        timeUp();
      }
    }, 100);
  }

  function timeUp() {
    toast(t('timeUp'));
    // Mark as wrong with no selection
    selectAnswer(-1, null);
  }

  function selectAnswer(idx, event) {
    const s = state.session;
    if (!s || s.locked) return;
    s.locked = true;
    if (s.timerInterval) clearInterval(s.timerInterval);

    const q = s.questions[s.idx];
    const correct = idx === q.correct;
    const timeMs = Date.now() - s.qStartedAt;

    s.answers.push({
      bankIdx: q.bankIdx,
      topic: q.topic,
      difficulty: q.difficulty,
      correct,
      selectedIdx: idx,
      correctIdx: q.correct,
      timeMs,
      question: q.q
    });

    // Mark mistake for spaced repetition
    if (!correct) recordMistake(q.bankIdx);
    else clearMistake(q.bankIdx);

    // Visual feedback
    document.querySelectorAll('.option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correct) btn.classList.add('correct');
      else if (i === idx) btn.classList.add('wrong');
    });

    // Audio + haptic
    if (correct) { SFX.correct(); vibrate([50]); }
    else { SFX.wrong(); vibrate([100, 50, 100]); }

    // XP popup for correct
    if (correct && event) {
      const xp = 10 + (q.difficulty - 1) * 5;
      const rect = event.target.getBoundingClientRect();
      showXPPopup(rect.left + rect.width / 2, rect.top, xp);
    }

    // Feedback banner
    const fb = document.getElementById('feedback');
    fb.className = `feedback show ${correct ? 'correct' : 'wrong'}`;
    while (fb.firstChild) fb.removeChild(fb.firstChild);
    fb.appendChild(el('strong', {
      text: correct ? ('\u2713 ' + t('correct')) : ('\u2717 ' + t('wrong'))
    }));
    fb.appendChild(document.createElement('br'));
    fb.appendChild(document.createTextNode(q.explain));

    setTimeout(() => {
      s.locked = false;
      s.idx++;
      if (s.idx >= s.questions.length) {
        if (s.isDaily && window.markDailyComplete) window.markDailyComplete(correct);
        finishQuiz();
      } else render();
    }, 2200);
  }

  function skipQuestion() {
    selectAnswer(-1, null);
  }

  function finishQuiz() {
    const s = state.session;
    const correct = s.answers.filter(a => a.correct).length;
    const total = s.questions.length;
    const pct = Math.round((correct / total) * 100);
    const duration = Math.round((Date.now() - s.startedAt) / 1000);

    // Compute XP earned
    const xpEarned = s.answers.reduce((sum, a) => {
      if (a.correct) return sum + 10 + (a.difficulty - 1) * 5;
      return sum;
    }, 0);

    // Update stats
    state.stats.totalAttempts++;
    state.stats.totalCorrect += correct;
    state.stats.totalQuestions += total;
    state.stats.bestScore = Math.max(state.stats.bestScore, pct);
    state.stats.xp += xpEarned;

    // Streak (daily)
    const today = new Date().toDateString();
    if (state.stats.lastDate === today) {
      // same day — don't advance
    } else if (state.stats.lastDate) {
      const last = new Date(state.stats.lastDate);
      const diff = Math.floor((new Date(today) - last) / (1000 * 60 * 60 * 24));
      if (diff === 1) state.stats.currentStreak++;
      else state.stats.currentStreak = 1;
    } else {
      state.stats.currentStreak = 1;
    }
    state.stats.lastDate = today;
    state.stats.longestStreak = Math.max(state.stats.longestStreak, state.stats.currentStreak);

    // Topic stats
    s.answers.forEach(a => {
      if (!state.stats.topicStats[a.topic]) state.stats.topicStats[a.topic] = { correct: 0, total: 0 };
      state.stats.topicStats[a.topic].total++;
      if (a.correct) state.stats.topicStats[a.topic].correct++;
    });

    saveStats();

    // Save attempt record (anonymous history)
    const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.attempts) || '[]');
    attempts.push({
      date: new Date().toISOString(),
      score: pct,
      correct, total, duration, xpEarned,
      topics: [...new Set(s.answers.map(a => a.topic))],
      answers: s.answers
    });
    // Keep last 100
    if (attempts.length > 100) attempts.splice(0, attempts.length - 100);
    localStorage.setItem(STORAGE_KEYS.attempts, JSON.stringify(attempts));

    state.lastResult = { correct, total, pct, duration, xpEarned, answers: s.answers };
    state.fastestCompletion = Math.min(state.fastestCompletion || Infinity, duration);

    if (window.AQLLI_TRACK) {
      window.AQLLI_TRACK('quiz_complete', { score: pct, correct, total, duration, topics: [...new Set(s.answers.map(a => a.topic))] });
    }

    SFX.complete();
    navigate('result');
    setTimeout(checkAndNotifyAchievements, 400);
  }

  // ─────────── RESULT VIEW ───────────
  function renderResult(app) {
    const r = state.lastResult;
    if (!r) return navigate('home');

    const weak = [...new Set(r.answers.filter(a => !a.correct).map(a => a.topic))];

    const wrap = el('div', { cls: 'results' });
    wrap.appendChild(el('h1', { text: t('resultsTitle') }));

    const circle = el('div', { cls: 'score-circle', style: `--pct: ${r.pct}%` });
    const inner = el('div', { cls: 'score-inner' });
    inner.appendChild(el('div', { cls: 'score-num', text: r.pct + '%' }));
    inner.appendChild(el('div', { cls: 'score-label', text: `${r.correct} / ${r.total} ${t('correctCount')}` }));
    circle.appendChild(inner);
    wrap.appendChild(circle);

    // XP chip
    const chipRow = el('div', { cls: 'streak-banner' });
    chipRow.appendChild(makeChip('\u26a1', `+${r.xpEarned} ${t('xpGained')}`));
    chipRow.appendChild(makeChip('\u23f1\ufe0f', `${r.duration}s`));
    wrap.appendChild(chipRow);

    // Weak areas
    if (weak.length > 0) {
      const wa = el('div', { cls: 'weak-area' });
      wa.appendChild(el('strong', { text: '\u26a0\ufe0f ' + t('weakAreas') }));
      const names = weak.map(tid => (window.TOPICS[tid][state.settings.lang] || window.TOPICS[tid].uz));
      wa.appendChild(document.createTextNode(names.join(', ')));
      wa.appendChild(el('p', { style: 'margin-top: 6px; font-size: 13px;', text: t('studyAgain') }));
      wrap.appendChild(wa);
    } else {
      const wa = el('div', { cls: 'weak-area success' });
      wa.appendChild(el('strong', { text: '\ud83c\udf89 ' + t('allCorrect') }));
      wrap.appendChild(wa);
    }

    // Action row
    const row = el('div', { cls: 'btn-row' });
    row.appendChild(el('button', {
      cls: 'btn',
      text: '\ud83d\udcf7 ' + t('shareBtn'),
      onclick: () => shareResult()
    }));
    row.appendChild(el('button', {
      cls: 'btn secondary',
      text: t('restartBtn'),
      onclick: () => { SFX.click(); navigate('home'); }
    }));
    wrap.appendChild(row);

    // Feedback form
    const fbForm = el('div', { cls: 'feedback-form' });
    fbForm.appendChild(el('label', {
      attrs: { for: 'fb-input' },
      text: t('feedbackLabel')
    }));
    const ta = el('textarea', {
      id: 'fb-input',
      attrs: { placeholder: t('feedbackPlaceholder') }
    });
    fbForm.appendChild(ta);
    fbForm.appendChild(el('button', {
      cls: 'btn',
      text: t('sendBtn'),
      onclick: () => {
        const val = ta.value.trim();
        if (!val) { toast('Iltimos fikr yozing'); return; }
        const fbs = JSON.parse(localStorage.getItem(STORAGE_KEYS.feedback) || '[]');
        fbs.push({ date: new Date().toISOString(), text: val, score: r.pct });
        localStorage.setItem(STORAGE_KEYS.feedback, JSON.stringify(fbs));
        toast('\u2713 Rahmat!');
        ta.value = '';
      }
    }));
    wrap.appendChild(fbForm);

    app.appendChild(wrap);
  }

  // ─────────── Share card (canvas) ───────────
  function shareResult() {
    const r = state.lastResult;
    if (!r) return;
    SFX.click();

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, '#667eea');
    grad.addColorStop(1, '#764ba2');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Title
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = 'bold 80px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('AQLLI-TEST', 540, 180);

    // Score circle
    ctx.beginPath();
    ctx.arc(540, 500, 180, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(540, 500, 180, -Math.PI / 2, -Math.PI / 2 + (r.pct / 100) * Math.PI * 2);
    ctx.lineWidth = 24;
    ctx.strokeStyle = 'white';
    ctx.stroke();

    // Score %
    ctx.font = 'bold 160px sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText(r.pct + '%', 540, 540);

    // X/Y
    ctx.font = '44px sans-serif';
    ctx.fillText(`${r.correct} ${t('shareOf')} ${r.total}`, 540, 620);

    // Tagline
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(t('shareText'), 540, 820);
    ctx.font = 'bold 56px sans-serif';
    ctx.fillText(r.pct + '% ' + t('shareScore'), 540, 890);

    // Watermark
    ctx.font = '32px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('aqlli-test.app', 540, 990);

    canvas.toBlob(async (blob) => {
      const url = URL.createObjectURL(blob);

      // Try Web Share API first
      if (navigator.canShare) {
        try {
          const file = new File([blob], 'aqlli-test-result.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'AQLLI-TEST' });
            URL.revokeObjectURL(url);
            return;
          }
        } catch {}
      }

      // Fallback: download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aqlli-test-result.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
      toast(t('downloadCard'));
    });
  }

  // ─────────── STATS VIEW ───────────
  function renderStats(app) {
    const s = state.stats;
    app.appendChild(el('h1', { text: t('statsTitle') }));

    if (s.totalAttempts === 0) {
      app.appendChild(el('p', { cls: 'subtitle', text: t('noData') }));
      app.appendChild(el('button', {
        cls: 'btn', text: t('startBtn'),
        onclick: () => navigate('home')
      }));
      return;
    }

    const avg = Math.round((s.totalCorrect / s.totalQuestions) * 100);
    const level = Math.floor(s.xp / 100) + 1;

    const grid = el('div', { cls: 'stats-grid' });
    grid.appendChild(makeStatCard(String(s.totalAttempts), t('totalAttempts')));
    grid.appendChild(makeStatCard(avg + '%', t('avgScore')));
    grid.appendChild(makeStatCard(s.bestScore + '%', t('bestScore')));
    grid.appendChild(makeStatCard(`\ud83d\udd25 ${s.currentStreak}`, t('currentStreak')));
    grid.appendChild(makeStatCard(String(s.longestStreak), t('longestStreak')));
    grid.appendChild(makeStatCard(`${level} \u2b50`, t('level')));
    app.appendChild(grid);

    // Per-topic accuracy
    if (Object.keys(s.topicStats).length > 0) {
      app.appendChild(el('h2', { text: 'Per topic' }));
      const ts = el('div', { cls: 'topic-stats' });
      for (const tid in s.topicStats) {
        const st = s.topicStats[tid];
        const pct = Math.round((st.correct / st.total) * 100);
        const topic = window.TOPICS[tid];
        const row = el('div', { cls: 'topic-stat-row' });
        row.appendChild(el('span', { cls: 'name', text: `${topic.emoji} ${topic[state.settings.lang] || topic.uz}` }));
        const bar = el('div', { cls: 'progress-bar' });
        bar.appendChild(el('div', { cls: 'progress-fill', style: `width: ${pct}%` }));
        row.appendChild(bar);
        row.appendChild(el('span', { cls: 'pct', text: pct + '%' }));
        ts.appendChild(row);
      }
      app.appendChild(ts);
    }

    // Export + Clear
    const row = el('div', { cls: 'btn-row' });
    row.appendChild(el('button', {
      cls: 'btn secondary',
      text: '\ud83d\udcc4 ' + t('exportCSV'),
      onclick: () => exportCSV()
    }));
    row.appendChild(el('button', {
      cls: 'btn danger',
      text: '\ud83d\uddd1\ufe0f ' + t('clearData'),
      onclick: () => {
        if (confirm(t('confirmClear'))) {
          Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
          state.stats = loadStats();
          state.settings = loadSettings();
          toast('\u2713');
          navigate('home');
        }
      }
    }));
    app.appendChild(row);
  }

  function makeStatCard(val, lbl) {
    const c = el('div', { cls: 'stat-card' });
    c.appendChild(el('div', { cls: 'stat-val', text: val }));
    c.appendChild(el('div', { cls: 'stat-lbl', text: lbl }));
    return c;
  }

  function exportCSV() {
    const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.attempts) || '[]');
    const header = 'date,score,correct,total,duration,topics\n';
    const rows = attempts.map(a =>
      `${a.date},${a.score},${a.correct},${a.total},${a.duration},${(a.topics || []).join(';')}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aqlli-test-attempts.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
    SFX.click();
  }

  // ─────────── SETTINGS VIEW ───────────
  function renderSettings(app) {
    app.appendChild(el('h1', { text: t('settingsTitle') }));

    // Theme
    const themeRow = el('div', { cls: 'setting-row' });
    themeRow.appendChild(el('label', { text: t('themeLabel') }));
    const themes = el('div', { cls: 'seg-btns' });
    [
      ['light', t('themeLight')],
      ['dark', t('themeDark')],
      ['auto', t('themeAuto')]
    ].forEach(([v, lbl]) => {
      themes.appendChild(el('button', {
        cls: state.settings.theme === v ? 'active' : '',
        text: lbl,
        onclick: () => {
          state.settings.theme = v;
          saveSettings();
          applyTheme();
          render();
          SFX.click();
        }
      }));
    });
    themeRow.appendChild(themes);
    app.appendChild(themeRow);

    // Language
    const langRow = el('div', { cls: 'setting-row' });
    langRow.appendChild(el('label', { text: t('languageLabel') }));
    const langs = el('div', { cls: 'seg-btns' });
    [['uz', 'UZ'], ['ru', 'RU'], ['en', 'EN']].forEach(([v, lbl]) => {
      langs.appendChild(el('button', {
        cls: state.settings.lang === v ? 'active' : '',
        text: lbl,
        onclick: () => {
          state.settings.lang = v;
          saveSettings();
          render();
          SFX.click();
        }
      }));
    });
    langRow.appendChild(langs);
    app.appendChild(langRow);

    // Sound
    const soundRow = el('div', { cls: 'setting-row' });
    soundRow.appendChild(el('label', { text: t('soundLabel') }));
    const sw = el('div', {
      cls: 'switch' + (state.settings.sound ? ' on' : ''),
      onclick: () => {
        state.settings.sound = !state.settings.sound;
        saveSettings();
        if (state.settings.sound) SFX.correct();
        render();
      }
    });
    soundRow.appendChild(sw);
    app.appendChild(soundRow);

    // Timer per Q
    const timerRow = el('div', { cls: 'setting-row' });
    timerRow.appendChild(el('label', { text: t('timerPerQ') }));
    const timers = el('div', { cls: 'seg-btns' });
    [[0, t('timerOff')], [10, '10'], [20, '20'], [30, '30']].forEach(([v, lbl]) => {
      timers.appendChild(el('button', {
        cls: state.settings.timerPerQ === v ? 'active' : '',
        text: lbl,
        onclick: () => {
          state.settings.timerPerQ = v;
          saveSettings();
          render();
          SFX.click();
        }
      }));
    });
    timerRow.appendChild(timers);
    app.appendChild(timerRow);
  }

  // ─────────── Mistakes (spaced repetition) ───────────
  function loadMistakes() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.mistakes) || '[]'); }
    catch { return []; }
  }
  function recordMistake(idx) {
    const m = loadMistakes();
    const existing = m.find(x => x.idx === idx);
    if (existing) existing.count++;
    else m.push({ idx, count: 1, date: Date.now() });
    localStorage.setItem(STORAGE_KEYS.mistakes, JSON.stringify(m));
  }
  function clearMistake(idx) {
    const m = loadMistakes().filter(x => x.idx !== idx);
    localStorage.setItem(STORAGE_KEYS.mistakes, JSON.stringify(m));
  }

  // ─────────── PWA install prompt ───────────
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window._deferredInstallPrompt = e;
    if (state.route === 'home') render();
  });

  // ─────────── Service worker ───────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

  // ─────────── Theme change listener ───────────
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (state.settings.theme === 'auto') applyTheme();
  });

  // ─────────── Dev helper ───────────
  window.exportData = () => {
    const a = JSON.parse(localStorage.getItem(STORAGE_KEYS.attempts) || '[]');
    const f = JSON.parse(localStorage.getItem(STORAGE_KEYS.feedback) || '[]');
    console.log('Attempts:', a);
    console.log('Feedback:', f);
    console.log('Stats:', state.stats);
    return { attempts: a, feedback: f, stats: state.stats };
  };

  // ─────────── Init ───────────
  applyTheme();
  render();
})();
