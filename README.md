# ⌨️ Typing Speed Test

A minimal, browser-based typing speed test built with vanilla HTML, CSS, and JavaScript.

## Features

- Real-time WPM (words per minute) calculation
- Live accuracy tracking
- Character-by-character feedback (correct / incorrect)
- Blinking cursor indicator
- Random sample text selection
- Paste prevention to ensure fair testing
- Dark mode UI

## How to Use

1. Open `index.html` in your browser.
2. Type the displayed text as quickly and accurately as possible.
3. View your WPM and accuracy in real time at the top.
4. Click **New Test** to try again.

## Files

- `index.html` — Page structure
- `style.css` — Styling and animations
- `script.js` — Typing logic, timer, and scoring

## Calculation

- **WPM** = (correct characters ÷ 5) ÷ elapsed minutes
- **Accuracy** = (correct characters ÷ total typed) × 100

## License

MIT
