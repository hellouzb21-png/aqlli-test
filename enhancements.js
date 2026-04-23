// Enhancements: landing page, daily challenge, achievements, waitlist, analytics
// Hooks into window.AQLLI (set by app.js) for integration

(() => {
  'use strict';

  // ─────────── Simple event analytics (privacy-safe) ───────────
  // Stores anonymous event log in localStorage. No external tracking.
  const EVT_KEY = 'aqlli_events';
  function track(name, props) {
    try {
      const events = JSON.parse(localStorage.getItem(EVT_KEY) || '[]');
      events.push({ t: Date.now(), n: name, p: props || {} });
      if (events.length > 500) events.splice(0, events.length - 500);
      localStorage.setItem(EVT_KEY, JSON.stringify(events));
    } catch {}
  }
  window.AQLLI_TRACK = track;

  // ─────────── Daily challenge ───────────
  // Deterministic selection — same question for everyone on a given day
  window.getDailyChallenge = function() {
    const bank = window.QUESTION_BANK;
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const idx = seed % bank.length;
    return { ...bank[idx], bankIdx: idx, isDaily: true };
  };

  window.hasCompletedDaily = function() {
    const today = new Date().toDateString();
    const last = localStorage.getItem('aqlli_daily_date');
    return last === today;
  };

  window.markDailyComplete = function(wasCorrect) {
    const today = new Date().toDateString();
    localStorage.setItem('aqlli_daily_date', today);
    localStorage.setItem('aqlli_daily_last_correct', wasCorrect ? '1' : '0');
    track('daily_complete', { correct: wasCorrect });
  };

  // ─────────── Waitlist / referral ───────────
  window.saveWaitlistEmail = function(email, source) {
    if (!email || !email.includes('@')) return false;
    try {
      const list = JSON.parse(localStorage.getItem('aqlli_waitlist') || '[]');
      if (list.some(e => e.email === email)) return false;
      list.push({ email, source: source || 'home', date: new Date().toISOString() });
      localStorage.setItem('aqlli_waitlist', JSON.stringify(list));
      track('waitlist_signup', { source });
      return true;
    } catch { return false; }
  };

  // Parse referral code from URL
  window.getReferralCode = function() {
    const params = new URLSearchParams(location.search);
    return params.get('r') || params.get('ref') || null;
  };

  // Generate referral link
  window.getMyReferralLink = function() {
    let myId = localStorage.getItem('aqlli_my_ref');
    if (!myId) {
      myId = Math.random().toString(36).substring(2, 10);
      localStorage.setItem('aqlli_my_ref', myId);
    }
    return `${location.origin}${location.pathname}?r=${myId}`;
  };

  // Track incoming referrals
  (() => {
    const ref = window.getReferralCode();
    if (ref && !sessionStorage.getItem('aqlli_ref_tracked')) {
      track('referral_visit', { ref });
      sessionStorage.setItem('aqlli_ref_tracked', '1');
    }
  })();

  // ─────────── Page load tracking ───────────
  track('page_view', {
    ref: document.referrer || 'direct',
    lang: navigator.language,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  // ─────────── Export dev helper ───────────
  const prev = window.exportData;
  window.exportData = () => {
    const data = prev ? prev() : {};
    data.events = JSON.parse(localStorage.getItem(EVT_KEY) || '[]');
    data.waitlist = JSON.parse(localStorage.getItem('aqlli_waitlist') || '[]');
    console.log('Events:', data.events);
    console.log('Waitlist:', data.waitlist);
    return data;
  };
})();
