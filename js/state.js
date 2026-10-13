/* state.js — everything the app remembers about the learner (saved in localStorage). */

const STORAGE_KEY = "dh2";
const DAILY_GOAL = 60;   // XP target per day
const MAX_MASTERY = 4;   // 0 = new word ... 4 = mastered

const DEFAULT_SETTINGS = { sound: true, haptics: true, theme: "auto" };

const state = {
  mastery: {},      // word id -> 0..4
  xp: 0,            // total XP
  todayXp: 0,       // XP earned today
  day: "",          // date todayXp belongs to
  lastVisit: "",    // used for the streak
  streak: 0,
  settings: { ...DEFAULT_SETTINGS },
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    Object.assign(state, saved);
    state.settings = { ...DEFAULT_SETTINGS, ...saved.settings };
    // Older versions used shorter field names.
    state.mastery = saved.mastery || saved.m || {};
    state.todayXp = saved.todayXp ?? saved.dxp ?? 0;
    state.lastVisit = saved.lastVisit || saved.last || "";
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

/** Call once on start-up: resets today's XP and updates the streak. */
function rollDay() {
  const today = new Date().toDateString();
  if (state.day !== today) {
    state.day = today;
    state.todayXp = 0;
  }
  if (state.lastVisit !== today) {
    const yesterday = new Date(Date.now() - 864e5).toDateString();
    state.streak = state.lastVisit === yesterday ? state.streak + 1 : 1;
    state.lastVisit = today;
  }
  saveState();
}

function addXp(amount) {
  state.xp += amount;
  state.todayXp += amount;
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