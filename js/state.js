/* state.js — everything the app remembers about the learner (saved in localStorage on this device only). */

const STORAGE_KEY = "dh2";
const DAILY_GOAL = 60;   // XP target per day
const MAX_MASTERY = 4;   // 0 = new word ... 4 = mastered

const DEFAULT_SETTINGS = { sound: true, haptics: true, theme: "auto" };

const state = {
  mastery: {},       // word id -> 0..4
  xp: 0,             // total XP
  todayXp: 0,        // XP earned today
  day: "",           // date todayXp belongs to
  lastActive: "",    // the last day she earned XP, used for the streak
  streak: 0,         // days in a row with at least one lesson
  welcomed: false,   // false on a brand-new device, which shows the welcome screen
  settings: { ...DEFAULT_SETTINGS },
};

const todayKey = () => new Date().toDateString();
const yesterdayKey = () => new Date(Date.now() - 864e5).toDateString();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return; // a brand-new device starts at zero
    const saved = JSON.parse(raw);
    Object.assign(state, saved);
    state.settings = { ...DEFAULT_SETTINGS, ...saved.settings };
    // Older versions used shorter field names.
    state.mastery = saved.mastery || saved.m || {};
    state.todayXp = saved.todayXp ?? saved.dxp ?? 0;
    state.lastActive = saved.lastActive || saved.lastVisit || "";
    // A device that already has progress does not need the welcome screen.
    state.welcomed = Boolean(saved.welcomed) || state.xp > 0 || Object.keys(state.mastery).length > 0;
  } catch (error) {
    /* Storage blocked (private mode): the app still works, it just won't remember. */
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    /* ignore */
  }
}

/** Call once on start-up: resets today's XP, and ends the streak if a whole day was missed. */
function rollDay() {
  if (state.day !== todayKey()) {
    state.day = todayKey();
    state.todayXp = 0;
  }
  if (state.lastActive && state.lastActive !== todayKey() && state.lastActive !== yesterdayKey()) {
    state.streak = 0;
  }
  saveState();
}

/** Every XP gain counts as activity today, so the streak grows with her first answer each day. */
function addXp(amount) {
  state.xp += amount;
  state.todayXp += amount;
  if (state.lastActive !== todayKey()) {
    state.streak = state.lastActive === yesterdayKey() ? state.streak + 1 : 1;
    state.lastActive = todayKey();
  }
}

/** Wipes progress on this device (settings are kept) so the next learner starts from zero. */
function resetProgress() {
  Object.assign(state, { mastery: {}, xp: 0, todayXp: 0, lastActive: "", streak: 0, welcomed: false });
  try {
    localStorage.removeItem("dh-install-dismissed");
  } catch (error) {
    /* ignore */
  }
  saveState();
}

const masteryOf = (id) => state.mastery[id] || 0;

function changeMastery(id, delta) {
  state.mastery[id] = Math.max(0, Math.min(MAX_MASTERY, masteryOf(id) + delta));
}

/** 0-100: how much of a category she has mastered. */
function categoryProgress(category) {
  const words = ALL.filter((word) => word.cat === category);
  const total = words.reduce((sum, word) => sum + masteryOf(word.id), 0);
  return Math.round((total / (words.length * MAX_MASTERY)) * 100);
}