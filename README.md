# AQLLI-TEST — Production-Ready MVP

Offline-first, installable, multilingual quiz platform for students.
**46 questions** across **8 topics**, **3 difficulty levels**, **3 languages**.

## Features

| Category | Feature |
|---|---|
| 📚 Content | 46 questions, 8 topics (Algorithms, SQL, Git, C, Web, OS, OOP, Testing) |
| 🎯 Flexibility | Topic filter, difficulty selector, adjustable question count (3-20) |
| 🧠 Learning | Spaced repetition — wrong answers automatically re-queue |
| 🏆 Gamification | XP per correct answer, level system, daily streaks |
| ⏱️ Focus | Optional per-question timer (10/20/30s) |
| 🌗 Theming | Light / Dark / Auto (system-matched) |
| 🌐 i18n | Uzbek / Russian / English, persisted |
| 📊 Analytics | Stats dashboard, per-topic accuracy, attempt history |
| 📷 Viral | Shareable result card (1080×1080 PNG) via Web Share API |
| 💾 Export | CSV export of all attempts |
| 🔊 Polish | Web Audio sound effects + haptic feedback on mobile |
| 📲 PWA | Installable, offline-capable via service worker |
| ♿ A11y | Keyboard nav, ARIA labels, reduced-motion support |
| 🔒 Security | XSS-safe DOM construction (no innerHTML from dynamic data) |

## File structure

```
AQLLI-TEST-mvp/
├── index.html        ← Entry point (shell only)
├── styles.css        ← Tokens + light/dark theme + all UI
├── app.js            ← State management, routing, views, game logic
├── questions.js      ← Question bank + topic metadata
├── i18n.js           ← uz/ru/en translations
├── manifest.json     ← PWA manifest
├── sw.js             ← Service worker (offline cache)
├── icon-192.png      ← PWA icon
└── icon-512.png      ← PWA icon
```

## Local development

```bash
cd ~/Documents/AQLLI-TEST-mvp
python3 -m http.server 8765
# Open http://localhost:8765
```

Service worker + `beforeinstallprompt` require HTTP (not file://).

## Deploy — choose one

### Netlify (easiest, 30s)
1. https://app.netlify.com/drop
2. Drop the `AQLLI-TEST-mvp` folder
3. Done — you get `xxx.netlify.app`

### Vercel
```bash
cd ~/Documents/AQLLI-TEST-mvp && npx vercel --prod
```

### GitHub Pages
```bash
cd ~/Documents/AQLLI-TEST-mvp
git init && git add . && git commit -m "initial"
gh repo create aqlli-test --public --source=. --push
gh api -X POST repos/:owner/aqlli-test/pages -f source='{"branch":"main","path":"/"}'
```

## Outreach template

Send this to 10 School 21 students:

```
Salom! Kichik test qildim talabalar uchun.
5 savol, 3 daqiqa. O'zingizni sinab ko'ring:
[YOUR URL]

Oxirida fikr yozsangiz — keyingi versiyani shularga qarab qilaman.
```

## Collecting research data

After users play, open browser console on their device (or yours if tested on your own URL):

```javascript
exportData()
// → { attempts: [...], feedback: [...], stats: {...} }
```

Or via in-app: Stats → "CSV yuklab olish" downloads all attempts.

## Adding questions

Edit `questions.js`:

```js
{
  q: "Your question text?",
  opts: ["A", "B", "C", "D"],
  correct: 1,              // 0-indexed
  topic: "algo",           // must match TOPICS key
  difficulty: 2,           // 1=easy, 2=medium, 3=hard
  explain: "Why this is the correct answer."
}
```

## Validation framework

The 1-week plan from `AQLLI-TEST-validation/`:

| Day | Task |
|---|---|
| Mon | Deploy + share URL with 5 students |
| Tue–Fri | Monitor `exportData()` daily, add questions students request |
| Sat | Review all feedback, cluster common requests |
| Sun | Decide: YASHIL (build more) / SARIQ (pivot) / QIZIL (stop) |

**Green flag:** 5+ attempts, avg session > 2 min, 3+ feedback with specific requests
**Yellow flag:** < 3 completions, generic feedback ("nice")
**Red flag:** 0-1 completions, no feedback

## Tech stack

- **Zero dependencies** — pure HTML/CSS/JS
- **~41 KB total** (uncompressed)
- **Works offline** once installed as PWA
- **Runs on any phone** — iOS, Android, desktop
- **Loads in < 1s** on 3G

## License

MIT — use freely for validation, customize as you need.
