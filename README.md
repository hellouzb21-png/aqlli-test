# 🧠 AQLLI-TEST

> **Live:** https://hellouzb21-png.github.io/aqlli-test/
> **Repo:** https://github.com/hellouzb21-png/aqlli-test

Daily coding quizzes for students. 96+ questions across Algorithms, SQL, Git, C, Python, JavaScript, Web, OS, OOP, and Testing. Free, no signup, works offline after first visit.

## Features

| Category | Feature |
|---|---|
| 📚 Content | **96 questions** · 10 topics · 3 difficulty levels |
| 🎯 Flexibility | Topic filter · difficulty · 3–20 questions/quiz |
| 🌟 Daily | Curated daily challenge (same for everyone that day) |
| 🧠 Learning | Spaced repetition — wrong answers auto-re-queue |
| 🏆 Gamification | XP, levels, streaks, **10 unlockable achievements** |
| ⏱️ Focus | Optional per-question timer (10/20/30s) |
| 🌗 Theming | Light / Dark / Auto (system-matched) |
| 🌐 i18n | **Uzbek / Russian / English**, persisted |
| 📊 Analytics | Stats dashboard · per-topic accuracy · attempt history |
| 📷 Viral | Shareable 1080×1080 PNG result card · referral links |
| 💾 Export | CSV export of all attempts |
| 🔊 Polish | Web Audio sounds · haptic feedback · animations |
| 📲 PWA | Installable · offline-capable · mobile-optimized |
| 🔍 SEO | OG tags · Twitter Cards · JSON-LD structured data |
| ♿ A11y | ARIA labels · focus rings · `prefers-reduced-motion` |
| 🔒 Privacy | Zero external tracking · all data in localStorage |

## File structure

```
aqlli-test/
├── index.html          ← Shell with SEO + OG meta
├── styles.css          ← Design tokens + light/dark
├── app.js              ← Router, state, 7 views, game logic
├── questions.js        ← 96 questions × 10 topics × 3 levels
├── i18n.js             ← uz/ru/en translations
├── achievements.js     ← 10-badge unlock system
├── enhancements.js     ← Daily challenge, referrals, analytics
├── manifest.json       ← PWA manifest
├── sw.js               ← Service worker (offline)
├── icon-{192,512}.png  ← PWA icons
└── og-image.jpg        ← 1200×630 social share card
```

## Deploy your own fork

### GitHub Pages (already deployed)
```bash
gh repo fork hellouzb21-png/aqlli-test
gh api -X POST repos/:owner/aqlli-test/pages -f 'source[branch]=main' -f 'source[path]=/'
# Live at https://<you>.github.io/aqlli-test/
```

### Netlify (30s)
1. https://app.netlify.com/drop
2. Drop this folder
3. Live at `xxx.netlify.app`

### Vercel
```bash
npx vercel --prod
```

## Custom domain (optional)

Add `CNAME` file:
```bash
echo "aqlli-test.app" > CNAME
git add CNAME && git commit -m "Add custom domain" && git push
```

Then in your DNS provider: CNAME `www` → `hellouzb21-png.github.io`

## Adding questions

Edit `questions.js`:

```js
{
  q: "Your question?",
  opts: ["A", "B", "C", "D"],
  correct: 1,          // 0-indexed
  topic: "algo",       // must match TOPICS key
  difficulty: 2,       // 1=easy, 2=medium, 3=hard
  explain: "Why it's correct."
}
```

To add a new topic, extend `TOPICS`:
```js
rust: { uz: "Rust", ru: "Rust", en: "Rust", emoji: "🦀" }
```

## Collecting research data

In browser console on any device that visited the site:

```javascript
exportData()
// → { attempts, feedback, stats, events, waitlist }
```

Or in-app: Stats → "CSV yuklab olish".

## Architecture highlights

- **Zero build step** — pure HTML/CSS/JS
- **Zero dependencies** — loads in < 1s on 3G
- **Zero external trackers** — all analytics stay in browser
- **~55 KB JS + 15 KB CSS** uncompressed
- **XSS-safe** — all dynamic content via `textContent` / `createElement`
- **Offline-first** — service worker caches all assets
- **Installable** — shows add-to-home banner automatically

## Launch checklist

- [x] Deployed to GitHub Pages
- [x] SEO meta tags (OG, Twitter, JSON-LD)
- [x] PWA manifest with icons
- [x] Service worker for offline
- [x] 3 languages
- [x] Privacy-safe analytics
- [x] Referral links
- [ ] Submit to Product Hunt
- [ ] Share in Telegram (students, School 21)
- [ ] Add custom domain
- [ ] Set up Cloudflare analytics (optional)
- [ ] Launch on Twitter/X with OG image

## License

MIT
