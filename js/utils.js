/* utils.js — small helpers: DOM, randomness, text matching, sound, haptics, confetti. */

const $ = (selector) => document.querySelector(selector);
const rnd = (list) => list[Math.floor(Math.random() * list.length)];
const shuffle = (list) => [...list].sort(() => Math.random() - 0.5);

/** Makes typed answers forgiving: ignores case, punctuation and curly apostrophes. */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[.?!,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* ---------- sound & haptics (both can be switched off in settings) ---------- */

let audioContext;

function beep(frequency, seconds = 0.12, wave = "sine") {
  if (!state.settings.sound) return;
  try {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = wave;
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.07;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + seconds);
    oscillator.stop(audioContext.currentTime + seconds);
  } catch (error) {
    /* audio not available */
  }
}

function haptic(pattern) {
  if (!state.settings.haptics) return;
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (error) {
    /* ignore */
  }
}

function sfxGood() {
  beep(660);
  setTimeout(() => beep(880), 90);
  haptic(20);
}

function sfxBad() {
  beep(170, 0.25, "sawtooth");
  haptic([40, 40]);
}

/* ---------- celebration ---------- */

function confetti() {
  const canvas = document.createElement("canvas");
  canvas.className = "confetti";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -Math.random() * canvas.height * 0.6,
    speed: 2 + Math.random() * 4,
    size: 4 + Math.random() * 5,
    wobble: Math.random() * 6,
    color: `hsl(${Math.random() * 360},90%,60%)`,
  }));

  let frame = 0;
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.y += p.speed;
      p.wobble += 0.1;
      p.x += Math.sin(p.wobble);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size * 1.6);
    });
    if (++frame < 160) requestAnimationFrame(draw);
    else canvas.remove();
  })();
}