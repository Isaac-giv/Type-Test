// ---- SAMPLE TEXTS ----
const TEXTS = [
  "The quick brown fox jumps over the lazy dog near the riverbank.",
  "Typing speed tests measure how fast you can type words per minute.",
  "Practice every day to improve your muscle memory and accuracy.",
  "Coding is fun and creative. Build projects that solve real problems.",
  "The sun set behind the mountains, painting the sky in orange and pink."
];

// ---- STATE ----
let currentText = '';
let typedChars = [];         // array of { char, status: 'correct'|'incorrect'|'pending' }
let startTime = null;
let timerInterval = null;
let isFinished = false;

const displayEl = document.getElementById('textDisplay');
const inputEl = document.getElementById('input-area');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');

// ---- HELPERS ----
function pickRandomText() {
  return TEXTS[Math.floor(Math.random() * TEXTS.length)];
}

function renderDisplay() {
  let html = '';
  let hasCurrent = false;
  for (let i = 0; i < typedChars.length; i++) {
    const { char, status } = typedChars[i];
    let cls = 'char';
    if (status === 'correct') cls += ' correct';
    else if (status === 'incorrect') cls += ' incorrect';
    if (status === 'pending' && !hasCurrent) {
      cls += ' current';
      hasCurrent = true;
    }
    html += `<span class="${cls}">${char}</span>`;
  }
  if (!hasCurrent) {
    html = html.replace(/current/g, '');
  }
  displayEl.innerHTML = html || '<span style="color:#64748b;">Click "New Test" to start</span>';
}

function updateStats() {
  if (!startTime) {
    wpmEl.textContent = '0';
    accuracyEl.textContent = '100';
    return;
  }
  const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
  const correctCount = typedChars.filter(c => c.status === 'correct').length;
  const wrongCount = typedChars.filter(c => c.status === 'incorrect').length;
  const typedSoFar = correctCount + wrongCount;

  const wpm = elapsed > 0 ? Math.round((correctCount / 5) / elapsed) : 0;
  const accuracy = typedSoFar > 0 ? Math.round((correctCount / typedSoFar) * 100) : 100;

  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy;
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startTimerIfNeeded() {
  if (startTime === null) {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      timerEl.textContent = seconds;
      updateStats();
    }, 200);
  }
}

function finishTest() {
  if (isFinished) return;
  isFinished = true;
  stopTimer();
  inputEl.disabled = true;
  updateStats();
  const total = typedChars.length;
  const correct = typedChars.filter(c => c.status === 'correct').length;
  const wpm = wpmEl.textContent;
  messageEl.textContent = `✅ Done! ${correct}/${total} correct · ${wpm} WPM. Hit "New Test" to try again.`;
}

// ---- CORE LOGIC ----
function handleTyping(e) {
  if (isFinished) return;
  const inputValue = e.target.value;
  const inputLen = inputValue.length;

  const newTyped = [];
  const maxLen = Math.min(inputLen, currentText.length);
  for (let i = 0; i < maxLen; i++) {
    const typedChar = inputValue[i];
    const originalChar = currentText[i];
    const status = typedChar === originalChar ? 'correct' : 'incorrect';
    newTyped.push({ char: originalChar, status });
  }
  if (inputLen < currentText.length) {
    for (let i = inputLen; i < currentText.length; i++) {
      newTyped.push({ char: currentText[i], status: 'pending' });
    }
  }
  typedChars = newTyped;

  if (inputLen > 0 && startTime === null) {
    startTimerIfNeeded();
  }

  renderDisplay();
  updateStats();

  if (inputLen === currentText.length) {
    finishTest();
  }

  e.target.setSelectionRange(inputLen, inputLen);
}

// ---- RESET ----
function resetTest() {
  stopTimer();
  startTime = null;
  isFinished = false;
  inputEl.disabled = false;
  inputEl.value = '';
  currentText = pickRandomText();
  typedChars = currentText.split('').map(ch => ({ char: ch, status: 'pending' }));
  renderDisplay();
  timerEl.textContent = '0';
  wpmEl.textContent = '0';
  accuracyEl.textContent = '100';
  messageEl.textContent = '';
  inputEl.focus();
}

// ---- INIT ----
resetTest();

// Event listeners
inputEl.addEventListener('input', handleTyping);
resetBtn.addEventListener('click', resetTest);
inputEl.addEventListener('paste', (e) => e.preventDefault());
window.addEventListener('load', () => inputEl.focus());