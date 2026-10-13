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
  close: () => requestQuit(),
  stay: () => hideSheet(),
  leave: () => { if (session) session.leaving = true; hideSheet(); quitLesson(); },
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
  "reset-offline": async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((reg) => reg.unregister()));
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    } catch (error) { /* ignore */ }
    showToast("Offline copy cleared. Reloading…");
    setTimeout(() => location.reload(), 700);
  },
  "dismiss-install": () => {
    try { localStorage.setItem("dh-install-dismissed", "1"); } catch (error) { /* ignore */ }
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

/* ---------- leaving a lesson, and small messages ---------- */

const midLesson = () => session && session.index > 0 && session.index < session.queue.length;
const showSheet = () => { $("#sheet").hidden = false; };
const hideSheet = () => { $("#sheet").hidden = true; };

/** Asks before leaving a lesson that is half done. */
function requestQuit() {
  if (midLesson()) showSheet();
  else quitLesson();
}

function showToast(text) {
  const toast = $("#toast");
  toast.textContent = text;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 3500);
}

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

// Android Back button: ask first if the lesson is half done.
window.addEventListener("popstate", () => {
  if (!session) return;
  if (midLesson() && !session.leaving) {
    try { history.pushState({ lesson: true }, ""); } catch (error) { /* ignore */ }
    showSheet();
  } else {
    hideSheet();
    closeLesson();
  }
});
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
window.addEventListener("appinstalled", () => {
  installPrompt = null;
  showToast("Installed. Open Dholuo from your home screen.");
  renderApp(true);
});

/* ---------- start ---------- */

loadState();
rollDay();
const startTab = new URLSearchParams(location.search).get("tab"); // home-screen shortcuts open a tab directly
if (TAB_VIEWS[startTab]) currentTab = startTab;
applyTheme();
syncViewport();
renderApp();

const refreshSettings = () => { if (currentTab === "For You" && !session) renderApp(true); };

if (!("serviceWorker" in navigator)) {
  swStatus = "unsupported";
} else if (location.protocol.startsWith("http")) {
  if (["localhost", "127.0.0.1"].includes(location.hostname)) {
    // While you are editing on your own computer, never keep an old copy of the app around.
    navigator.serviceWorker.getRegistrations().then((list) => list.forEach((reg) => reg.unregister()));
    if (window.caches) caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
  } else {
    navigator.serviceWorker.register("sw.js", { scope: "./" })
      .then((registration) => {
        swStatus = "installing";
        registration.update().catch(() => {}); // always look for a newer version of the app
        const watch = (worker) => worker && worker.addEventListener("statechange", () => {
          if (worker.state === "redundant") {
            swStatus = "failed";
            swError = "The browser did not accept the offline files.";
            refreshSettings();
          }
        });
        watch(registration.installing);
        registration.addEventListener("updatefound", () => watch(registration.installing));
      })
      .catch((error) => {
        swStatus = "failed";
        swError = error && error.message ? error.message : "Registration failed.";
        refreshSettings();
      });
    navigator.serviceWorker.ready.then(() => {
      swStatus = "ready";
      swError = "";
      refreshSettings();
    });
  }
}