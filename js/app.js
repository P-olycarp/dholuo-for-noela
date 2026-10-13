/* app.js — start-up, tap handling, settings, install prompt, phone-specific polish. */

/* One click listener for the whole app. Buttons say what they do with data-action="...". */
const actions = {
  tab: (d) => { currentTab = d.v; haptic(8); renderApp(); },
  lesson: (d) => startLesson(ALL.filter((word) => word.cat === d.v)),
  mix: () => {
    const started = ALL.filter((word) => masteryOf(word.id) > 0);
    startLesson(started.length >= 4 ? started : ALL);
  },
  surprise: () => startLesson(ALL),
  close: () => quitLesson(),
  next: () => nextQuestion(),
  pick: (d) => chooseOption(Number(d.k)),
  check: () => checkAnswer(),
  tile: (d) => moveTile(Number(d.k), d.remove === "1"),
  match: (d) => pickMatch(d.side, d.id),
  reveal: (d, el) => el.classList.toggle("revealed"),
  feedquiz: (d, el) => answerFeedQuiz(el),
  love: () => {
    loveIndex = (loveIndex + 1) % LOVE.length;
    $("#love-message").textContent = LOVE[loveIndex];
    sfxGood();
  },
  theme: (d) => { state.settings.theme = d.v; saveState(); applyTheme(); renderApp(true); },
  toggle: (d) => { state.settings[d.v] = !state.settings[d.v]; saveState(); renderApp(true); },
  install: async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    renderApp(true);
  },
};

document.addEventListener("click", (event) => {
  const element = event.target.closest("[data-action]");
  if (!element || element.disabled) return;
  const handler = actions[element.dataset.action];
  if (handler) handler(element.dataset, element);
});

document.addEventListener("input", (event) => {
  if (event.target.id === "answer") $("#check").disabled = !event.target.value.trim();
});

document.addEventListener("keydown", (event) => {
  const typing = event.target.id === "answer";
  if (event.key === "Enter" && typing && event.target.value.trim() && session && !session.locked) checkAnswer();
});

/* ---------- phone polish ---------- */

/** Size the lesson to the *visible* area so the on-screen keyboard never covers the buttons. */
function syncViewport() {
  const viewport = window.visualViewport;
  const root = document.documentElement.style;
  root.setProperty("--app-h", `${viewport ? viewport.height : window.innerHeight}px`);
  root.setProperty("--app-top", `${viewport ? viewport.offsetTop : 0}px`);
}

function applyTheme() {
  const theme = state.settings.theme;
  if (theme === "auto") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
}

window.addEventListener("popstate", () => { if (session) closeLesson(); }); // Android Back button
window.addEventListener("resize", syncViewport);
if (window.visualViewport) {
  visualViewport.addEventListener("resize", syncViewport);
  visualViewport.addEventListener("scroll", syncViewport);
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  if (currentTab === "For You") renderApp(true);
});
window.addEventListener("appinstalled", () => { installPrompt = null; renderApp(true); });

/* ---------- start ---------- */

loadState();
rollDay();
applyTheme();
syncViewport();
renderApp();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  if (["localhost", "127.0.0.1"].includes(location.hostname)) {
    // While you are editing on your own computer, never keep an old copy of the app around.
    navigator.serviceWorker.getRegistrations().then((list) => list.forEach((reg) => reg.unregister()));
    if (window.caches) caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
  } else {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}