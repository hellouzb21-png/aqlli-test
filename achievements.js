// Achievement system — unlock badges for milestones
window.ACHIEVEMENTS = [
  { id: 'first_step',   icon: '\ud83d\udc76', name: { uz: 'Birinchi qadam', ru: 'Первый шаг', en: 'First step' },
    desc: { uz: 'Birinchi testni yakunladingiz', ru: 'Завершили первый тест', en: 'Completed your first quiz' },
    check: s => s.totalAttempts >= 1 },
  { id: 'perfect_score', icon: '\ud83d\udcaf', name: { uz: 'Mukammallik', ru: 'Совершенство', en: 'Perfection' },
    desc: { uz: '100% natija oldingiz', ru: 'Набрали 100%', en: 'Scored 100%' },
    check: s => s.bestScore === 100 },
  { id: 'streak_3',     icon: '\ud83d\udd25', name: { uz: '3 kunlik streak', ru: '3 дня подряд', en: '3-day streak' },
    desc: { uz: '3 kun ketma-ket o\'qidingiz', ru: '3 дня подряд занимались', en: '3 days in a row' },
    check: s => s.longestStreak >= 3 },
  { id: 'streak_7',     icon: '\u2b50', name: { uz: '7 kun — hafta', ru: 'Неделя', en: 'Full week' },
    desc: { uz: 'Butun hafta davomida', ru: 'Целая неделя', en: '7-day streak' },
    check: s => s.longestStreak >= 7 },
  { id: 'xp_100',       icon: '\u26a1', name: { uz: '100 XP', ru: '100 XP', en: '100 XP' },
    desc: { uz: 'Birinchi 100 XP', ru: 'Первые 100 XP', en: 'First 100 XP' },
    check: s => s.xp >= 100 },
  { id: 'xp_500',       icon: '\ud83c\udfc6', name: { uz: 'Tajribali', ru: 'Опытный', en: 'Experienced' },
    desc: { uz: '500 XP to\'pladingiz', ru: 'Набрали 500 XP', en: '500 XP earned' },
    check: s => s.xp >= 500 },
  { id: 'xp_1000',      icon: '\ud83d\udc51', name: { uz: 'Usta', ru: 'Мастер', en: 'Master' },
    desc: { uz: '1000 XP — zo\'r!', ru: '1000 XP — отлично!', en: '1000 XP earned!' },
    check: s => s.xp >= 1000 },
  { id: 'ten_attempts', icon: '\ud83c\udfaf', name: { uz: 'Qat\'iyat', ru: 'Настойчивость', en: 'Persistence' },
    desc: { uz: '10 ta test yakunladingiz', ru: 'Завершили 10 тестов', en: '10 quizzes completed' },
    check: s => s.totalAttempts >= 10 },
  { id: 'polyglot',     icon: '\ud83c\udf0d', name: { uz: 'Poliglot', ru: 'Полиглот', en: 'Polyglot' },
    desc: { uz: 'Barcha 10 mavzuni sinadingiz', ru: 'Все 10 тем', en: 'Tried all 10 topics' },
    check: s => Object.keys(s.topicStats || {}).length >= 10 },
  { id: 'speedster',    icon: '\u26a1', name: { uz: 'Tezkor', ru: 'Быстрый', en: 'Speedster' },
    desc: { uz: 'Test 30 sek. dan tez', ru: 'Тест быстрее 30 сек', en: 'Quiz under 30s' },
    check: s => s.fastestCompletion && s.fastestCompletion < 30 }
];

// Check which achievements are newly unlocked vs previously known
window.checkAchievements = function(stats, previouslyUnlocked) {
  const unlocked = [];
  const now = [];
  window.ACHIEVEMENTS.forEach(a => {
    if (a.check(stats)) {
      unlocked.push(a.id);
      if (!previouslyUnlocked.includes(a.id)) now.push(a);
    }
  });
  return { unlocked, newlyUnlocked: now };
};
