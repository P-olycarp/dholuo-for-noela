/* views.js — builds the HTML for the top bar and each of the five tabs. */

const APP_VERSION = "2.4"; // shown in the footer so you can tell which copy you are looking at
const FALLBACK_TAB = "Journey";
let currentTab = FALLBACK_TAB;
let installPrompt = null; // set by app.js when the browser offers "install"
let swStatus = "checking"; // set by app.js: checking, installing, ready or failed
let swError = "";          // the reason, if the offline copy failed

const isStandalone = () => (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
const isLocalhost = () => ["localhost", "127.0.0.1"].includes(location.hostname);
const installDismissed = () => {
  try { return localStorage.getItem("dh-install-dismissed") === "1"; } catch (error) { return false; }
};

/** A banner on the home screen that offers installing (Android) or explains how (iPhone). */
function installBanner() {
  if (isStandalone() || installDismissed()) return "";
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (!installPrompt && !ios) return "";
  const body = installPrompt
    ? `<p>Add Dholuo to your home screen. It opens like a normal app and works offline.</p><button class="btn primary" data-action="install">Install app</button>`
    : `<p>Tap the Share button in Safari, then “Add to Home Screen”.</p>`;
  return `<div class="card action install-banner"><div class="action-icon">${icon("download", 22)}</div><div>
    <h3>Install on this phone</h3>${body}<button class="link-btn" data-action="dismiss-install">Not now</button></div></div>`;
}

/** Which icon sticker each unit uses (names live in js/icons.js). */
const UNIT_ICONS = {
  Numbers: "hash", Animals: "paw", Food: "bowl", Things: "basket", Days: "calendar", Nature: "waves", Body: "user",
  Actions: "arrow", Describing: "sparkle", Phrases: "chat", Plurals: "copy", More: "grid", Everyday: "heart",
};

const wordsIn = (category) => ALL.filter((word) => word.cat === category).length;

function topbarHtml() {
  const goal = Math.min(1, state.todayXp / DAILY_GOAL);
  const circumference = 2 * Math.PI * 10;
  return `<div class="topbar-inner">
    <span class="brand">Dholuo</span>
    <div class="chips">
      <span class="chip" aria-label="Day streak">${icon("flame", 16)}${state.streak}</span>
      <span class="chip" aria-label="Total XP">${icon("bolt", 16)}${state.xp}</span>
      <svg width="30" height="30" viewBox="0 0 26 26" role="img" aria-label="Daily goal">
        <circle cx="13" cy="13" r="10" fill="none" stroke="var(--line)" stroke-width="3.5"/>
        <circle cx="13" cy="13" r="10" fill="none" stroke="var(--primary)" stroke-width="3.5" stroke-linecap="round"
          stroke-dasharray="${circumference * goal} ${circumference}" transform="rotate(-90 13 13)"/>
      </svg>
    </div></div>`;
}

function journeyView() {
  const started = ALL.filter((word) => masteryOf(word.id) > 0).length;
  const mastered = ALL.filter((word) => masteryOf(word.id) >= MAX_MASTERY).length;
  const next = CATS.find(([key]) => categoryProgress(key) < 100) || CATS[0];

  const units = CATS.map(([key, title], i) => {
    const progress = categoryProgress(key);
    const sticker = icon(progress >= 100 ? "check" : UNIT_ICONS[key] || "grid", 24);
    return `<button class="unit ${progress >= 100 ? "done" : ""}" data-action="lesson" data-v="${key}">
      <span class="sticker" style="--h:${(205 + i * 27) % 360}">${sticker}</span>
      <span class="unit-main"><b>${title}</b><small>${wordsIn(key)} items · ${progress}% mastered</small>
        <span class="meter"><i style="width:${progress}%"></i></span></span>
      ${icon("chevron", 20)}
    </button>`;
  }).join("");

  return `<section class="banner">
      <div class="eyebrow">Welcome back</div>
      <h1>Noela</h1>
      <p>Next up: ${next[1]}</p>
      <button class="btn light" data-action="lesson" data-v="${next[0]}">Continue ${icon("play", 16)}</button>
      <div class="banner-note">${icon("heart", 14)} Made with love, from ${FROM}</div>
    </section>
    <div class="metrics">
      <div class="metric"><b>${started}</b><span>Words started</span></div>
      <div class="metric"><b>${mastered}</b><span>Mastered</span></div>
      <div class="metric"><b>${Math.min(state.todayXp, DAILY_GOAL)}/${DAILY_GOAL}</b><span>XP today</span></div>
    </div>
    ${installBanner()}
    <h2 class="section-title">Units</h2>
    <div class="units">${units}</div>`;
}

function practiceView() {
  return `<h2 class="section-title">Practice</h2>
    <div class="card action"><div class="action-icon">${icon("target", 22)}</div><div>
      <h3>Daily mix</h3><p>Six words from everything you've started, hardest first.</p>
      <button class="btn primary" data-action="mix">Start the mix</button></div></div>
    <div class="card action"><div class="action-icon">${icon("shuffle", 22)}</div><div>
      <h3>Surprise me</h3><p>Six random words from the whole dictionary.</p>
      <button class="btn" data-action="surprise">Start random lesson</button></div></div>
    <div class="card"><h3>In the app</h3><p><b>${ALL.length}</b> words and phrases, plus names, proverbs and grammar notes.</p></div>`;
}

function exploreView() {
  return `<h2 class="section-title">Explore</h2><div id="feed"></div><div id="feed-end" style="height:1px"></div>`;
}

function cultureView() {
  const cards = (items) => items.map(([title, text]) => `<div class="info-card"><b>${title}</b><p>${text}</p></div>`).join("");
  const proverbs = PROV.map(([luo, english]) => `<div class="card"><div class="quote">${luo}</div><p style="margin-top:6px">${english}</p></div>`).join("");
  const dialects = DIAL.map(([meaning, form, tag, other]) =>
    `<div class="item"><b>${form}</b>${tag ? `<span class="tag">${tag}</span>` : ""} <span class="muted">${meaning}</span><br><span class="muted">Also: ${other}</span></div>`).join("");
  return `<h2 class="section-title">Names with a story</h2><div class="row">${cards(NAMES)}</div>
    <h2 class="section-title">Proverbs</h2>${proverbs}
    <h2 class="section-title">How Luo works</h2><div class="row">${cards(TIPS)}</div>
    <h2 class="section-title">Regional forms</h2><div class="card">${dialects}</div>`;
}

function swLabel() {
  if (swStatus === "ready") return "Ready";
  if (swStatus === "failed") return "Failed";
  if (swStatus === "unsupported") return "Not supported";
  return isLocalhost() ? "Off while testing" : "Preparing…";
}

/** Shows exactly what this phone can do, so install problems are easy to explain. */
function installCheckPanel() {
  const ua = navigator.userAgent;
  const browser = /iphone|ipad|ipod/i.test(ua) ? "iPhone / iPad" : /android/i.test(ua) ? "Android" : "Computer";
  const row = (label, value, good) => `<div class="setting"><span>${label}</span><span class="${good ? "ok-text" : "muted"}">${value}</span></div>`;
  const detail = swError ? `<p style="margin:8px 0 0;font-size:.85rem">Reason: ${swError}</p>` : "";
  return `<div class="card"><h3>Install check</h3>
    ${row("Device", browser, true)}
    ${row("Secure (https)", location.protocol === "https:" ? "Yes" : "No", location.protocol === "https:")}
    ${row("Offline copy", swLabel(), swStatus === "ready")}
    ${row("Install prompt", installPrompt ? "Available" : "Not offered", !!installPrompt)}
    ${row("Opened as an app", isStandalone() ? "Yes" : "No", isStandalone())}
    ${detail}
    <button class="btn" style="margin-top:14px" data-action="reset-offline">Reset offline copy</button></div>`;
}

function installPanel() {
  if (isStandalone()) return "";
  if (installPrompt) {
    return `<div class="card action"><div class="action-icon">${icon("download", 22)}</div><div><h3>Install the app</h3>
      <p>Add Dholuo to your home screen so it opens like a normal app, even offline.</p>
      <button class="btn primary" data-action="install">Install</button></div></div>`;
  }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const tip = ios ? "Tap the Share button, then “Add to Home Screen”." : "Open the browser menu and choose “Install app” or “Add to Home screen”.";
  return `<div class="card action"><div class="action-icon">${icon("download", 22)}</div><div><h3>Install the app</h3><p>${tip}</p></div></div>`;
}

function settingsPanel() {
  const { sound, haptics, theme } = state.settings;
  const themes = ["auto", "light", "dark"]
    .map((t) => `<button class="${t === theme ? "on" : ""}" data-action="theme" data-v="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join("");
  return `<div class="card"><h3>Settings</h3>
    <div class="setting"><span>Sounds</span><button class="switch" role="switch" aria-checked="${sound}" aria-label="Sounds" data-action="toggle" data-v="sound"></button></div>
    <div class="setting"><span>Vibration</span><button class="switch" role="switch" aria-checked="${haptics}" aria-label="Vibration" data-action="toggle" data-v="haptics"></button></div>
    <div class="setting"><span>Theme</span><div class="seg">${themes}</div></div>
    <div class="setting"><span>Works offline</span><span class="${swStatus === "ready" ? "ok-text" : "muted"}">${swLabel()}</span></div></div>`;
}

let loveIndex = 0;

function youView() {
  return `<h2 class="section-title">For you</h2>
    <div class="note-card"><div class="eyebrow">${icon("heart", 14)} A letter</div>
      <p>Noela, I built this for you, one word at a time, because I love you and I'm proud of you for learning. There's no rush and no test that matters. Open it whenever you like, learn a little, and know I'm cheering for you.</p>
      <p style="margin-top:12px">With all my love,</p><div class="sig">${FROM}</div></div>
    <div class="card"><h3>Say it in Luo</h3>
      <div class="item"><b>Aheri</b><br><span class="muted">I love you</span></div>
      <div class="item"><b>Aheri ahinya</b><br><span class="muted">I love you very much</span></div>
      <p style="margin:10px 0 0;font-size:.85rem">From general knowledge, not the dictionary. Please check with a Luo speaker.</p></div>
    <div class="card"><button class="btn primary" data-action="love">Another note</button>
      <p id="love-message" style="margin:14px 0 0;text-align:center">${LOVE[loveIndex]}</p></div>
    ${installPanel()}${installCheckPanel()}${settingsPanel()}`;
}

const TAB_VIEWS = { Journey: journeyView, Practice: practiceView, Explore: exploreView, Culture: cultureView, "For You": youView };

function renderApp(keepScroll = false) {
  const scroll = window.scrollY;
  $("#topbar").innerHTML = topbarHtml();
  $("#view").innerHTML = TAB_VIEWS[currentTab]() +
    `<div class="footer">${icon("heart", 14)}<span>Made with love for Noela, from ${FROM}</span></div>
     <div class="footer" style="margin-top:0">Words from a Dholuo–English dictionary · Version ${APP_VERSION}</div>`;
  $("#tabbar").innerHTML = NAVI.map(([name, iconName]) =>
    `<button class="tab ${name === currentTab ? "on" : ""}" data-action="tab" data-v="${name}">${icon(iconName, 24)}<span>${name}</span></button>`).join("");
  window.scrollTo(0, keepScroll ? scroll : 0);
  if (currentTab === "Explore") startFeed();
}