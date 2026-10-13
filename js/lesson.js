/* lesson.js — the lesson engine. A lesson is a short queue of questions built from the weakest words. */

let session = null; // the lesson in progress, or null

const PRAISE = ["Correct", "Well done", "Exactly right", "Perfect"];

/* ---------- building a lesson ---------- */

/** Three wrong answers + the right one, preferring words from the same category. */
function choicesFor(word, byEnglish) {
  const differs = (other) => other !== word && (byEnglish ? other.english !== word.english : other.luo !== word.luo);
  let pool = ALL.filter((other) => other.cat === word.cat && differs(other));
  if (pool.length < 3) pool = ALL.filter(differs);
  return shuffle([word, ...shuffle(pool).slice(0, 3)]);
}

function pickKind(word) {
  if (word.cat === "Plurals") return rnd(["toEnglish", "type"]);
  if (masteryOf(word.id) === 0) return "toEnglish";
  const kinds = ["toEnglish", "toLuo", "type"];
  if (word.cat === "Phrases" && word.luo.split(" ").length >= 3) kinds.push("tiles", "tiles");
  return rnd(kinds);
}

function startLesson(pool) {
  const words = shuffle(pool)
    .sort((a, b) => masteryOf(a.id) - masteryOf(b.id))
    .slice(0, 6);

  const queue = [];
  words.forEach((word) => {
    if (masteryOf(word.id) === 0) queue.push({ kind: "intro", word });
    queue.push({ kind: pickKind(word), word });
  });
  if (words.length >= 4) queue.push({ kind: "match", words: words.slice(0, 4) });

  session = { queue, index: 0, correct: 0, answered: 0, xp: 0, locked: false, pushed: false };
  $("#lesson").hidden = false;
  try {
    history.pushState({ lesson: true }, ""); // lets the phone's Back button close the lesson
    session.pushed = true;
  } catch (error) {
    /* not available on file:// in some browsers */
  }
  showQuestion();
}

const currentQuestion = () => session.queue[session.index];

function updateProgress() {
  $("#progress").style.width = `${(session.index / session.queue.length) * 100}%`;
  $("#lesson-xp").textContent = `${session.xp} XP`;
}

/* ---------- rendering one question ---------- */

const promptHtml = (text) => `<div class="prompt ${text.length > 22 ? "small" : ""}">${text}</div>`;

function renderIntro({ word }) {
  const isPlural = word.cat === "Plurals";
  return [
    `<div class="eyebrow">New word</div>
     ${promptHtml(word.luo)}
     <div class="subtitle">${isPlural ? "plural: " + word.english : word.english}</div>
     ${word.note ? `<div class="note">${word.note}</div>` : ""}`,
    `<button class="btn primary" data-action="next">Continue</button>`,
  ];
}

function renderChoice(question) {
  const { word } = question;
  const toEnglish = question.kind === "toEnglish";
  question.options = choicesFor(word, toEnglish);
  const title = word.cat === "Plurals" ? "What is the plural?" : toEnglish ? "What does this mean?" : "How do you say";
  const buttons = question.options
    .map((option, k) => `<button class="option" data-action="pick" data-k="${k}"><span class="option-key">${"ABCD"[k]}</span><span>${toEnglish ? option.english : option.luo}</span></button>`)
    .join("");
  return [`<div class="eyebrow">${title}</div>${promptHtml(toEnglish ? word.luo : word.english)}<div class="options">${buttons}</div>`, ""];
}

function renderType({ word }) {
  const isPlural = word.cat === "Plurals";
  return [
    `<div class="eyebrow">${isPlural ? "Type the plural of" : "Type it in Luo"}</div>
     ${promptHtml(isPlural ? word.luo : word.english)}
     <input id="answer" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Type here…">`,
    `<button id="check" class="btn primary" data-action="check" disabled>Check</button>`,
  ];
}

function renderTiles(question) {
  const { word } = question;
  const decoys = shuffle(ALL.filter((w) => w.cat === "Phrases" && w !== word).flatMap((w) => w.luo.split(" "))).slice(0, 2);
  question.bank = shuffle([...word.luo.split(" "), ...decoys]);
  question.picked = [];
  return [
    `<div class="eyebrow">Build the sentence</div>${promptHtml(word.english)}<div id="tiles"></div>`,
    `<button id="check" class="btn primary" data-action="check" disabled>Check</button>`,
  ];
}

function drawTiles(question) {
  const chosen = question.picked
    .map((k) => `<button class="tile" data-action="tile" data-k="${k}" data-remove="1">${question.bank[k]}</button>`)
    .join("");
  const bank = question.bank
    .map((text, k) =>
      question.picked.includes(k)
        ? `<span class="tile ghost">${text}</span>`
        : `<button class="tile" data-action="tile" data-k="${k}">${text}</button>`)
    .join("");
  $("#tiles").innerHTML = `<div class="answer-line">${chosen}</div><div class="tile-bank">${bank}</div>`;
  $("#check").disabled = question.picked.length === 0;
}

function renderMatch(question) {
  question.left = shuffle(question.words);
  question.right = shuffle(question.words);
  question.done = [];
  question.selected = null;
  return [`<div class="eyebrow">Match the pairs</div><div class="match-grid"><div id="match-left"></div><div id="match-right"></div></div>`, ""];
}

function drawMatch(question) {
  const button = (word, side) => {
    const gone = question.done.includes(word.id) ? "gone" : "";
    const on = question.selected && question.selected.side === side && question.selected.id === word.id ? "selected" : "";
    return `<button class="option match-item ${gone} ${on}" data-action="match" data-side="${side}" data-id="${word.id}">${side === "l" ? word.luo : word.english}</button>`;
  };
  $("#match-left").innerHTML = question.left.map((w) => button(w, "l")).join("");
  $("#match-right").innerHTML = question.right.map((w) => button(w, "r")).join("");
}

function showQuestion() {
  if (session.index >= session.queue.length) return finishLesson();
  const question = currentQuestion();
  session.locked = false;
  updateProgress();
  $("#feedback").className = "feedback";
  $("#feedback").innerHTML = "";
  $("#lesson-actions").hidden = false;

  const renderers = {
    intro: renderIntro,
    toEnglish: renderChoice,
    toLuo: renderChoice,
    type: renderType,
    tiles: renderTiles,
    match: renderMatch,
  };
  const [body, actions] = renderers[question.kind](question);
  $("#lesson-body").innerHTML = body;
  $("#lesson-body").scrollTop = 0;
  $("#lesson-actions").innerHTML = actions;

  if (question.kind === "tiles") drawTiles(question);
  if (question.kind === "match") drawMatch(question);
  if (question.kind === "type") setTimeout(() => { const input = $("#answer"); if (input) input.focus(); }, 80);
}

/* ---------- answering ---------- */

function chooseOption(k) {
  if (session.locked) return;
  const question = currentQuestion();
  const correct = question.options[k] === question.word;
  document.querySelectorAll("#lesson-body .option").forEach((button, i) => {
    if (question.options[i] === question.word) button.classList.add("ok");
    else if (i === k) button.classList.add("no");
  });
  const answer = question.kind === "toEnglish" ? question.word.english : question.word.luo;
  recordResult(correct, correct ? "" : `Answer: ${answer}`);
}

function moveTile(k, remove) {
  const question = currentQuestion();
  if (session.locked) return;
  question.picked = remove ? question.picked.filter((x) => x !== k) : [...question.picked, k];
  drawTiles(question);
}

function pickMatch(side, id) {
  const question = currentQuestion();
  if (session.locked || question.kind !== "match" || question.done.includes(id)) return;

  if (!question.selected || question.selected.side === side) {
    question.selected = { side, id };
    return drawMatch(question);
  }
  if (question.selected.id === id) {
    question.done.push(id);
    sfxGood();
    changeMastery(id, 1);
    question.selected = null;
    drawMatch(question);
    if (question.done.length === question.words.length) recordResult(true, "All matched!");
  } else {
    sfxBad();
    question.selected = null;
    drawMatch(question);
  }
}

function checkAnswer() {
  if (session.locked) return;
  const question = currentQuestion();
  const { word } = question;
  const isPlural = word.cat === "Plurals";
  const target = question.kind === "type" && isPlural ? word.english : word.luo;
  const given = question.kind === "type" ? $("#answer").value : question.picked.map((k) => question.bank[k]).join(" ");
  const correct = normalize(given) === normalize(target);
  recordResult(correct, correct ? "" : `Answer: ${target}`);
}

function recordResult(correct, message) {
  const question = currentQuestion();
  session.locked = true;
  session.answered++;

  if (correct) {
    sfxGood();
    session.correct++;
    session.xp += 10;
    addXp(10);
    if (question.word) changeMastery(question.word.id, 1);
  } else {
    sfxBad();
    if (question.word) {
      changeMastery(question.word.id, -1);
      // A missed word comes back once at the end of the lesson.
      if (!question.requeued) session.queue.push({ kind: question.kind, word: question.word, requeued: true });
    }
  }
  saveState();
  updateProgress();

  $("#lesson-actions").hidden = true;
  $("#feedback").className = `feedback ${correct ? "ok" : "no"}`;
  $("#feedback").innerHTML = `
    <div class="message"><b>${icon(correct ? "check" : "x", 22)}${correct ? rnd(PRAISE) : "Not quite"}</b>${message ? `<div>${message}</div>` : ""}</div>
    <button class="btn ${correct ? "primary" : "danger"}" data-action="next">Continue</button>`;
}

function nextQuestion() {
  session.index++;
  showQuestion();
}

/* ---------- ending ---------- */

function finishLesson() {
  addXp(20);
  saveState();
  const accuracy = session.answered ? Math.round((session.correct / session.answered) * 100) : 100;
  $("#progress").style.width = "100%";
  $("#feedback").className = "feedback";
  $("#feedback").innerHTML = "";
  $("#lesson-body").innerHTML = `
    <div class="finish">
      <div class="finish-mark">${icon("check", 40)}</div>
      <h1>Lesson complete</h1>
      <div class="metrics">
        <div class="metric"><b>+${session.xp + 20}</b><span>XP earned</span></div>
        <div class="metric"><b>${accuracy}%</b><span>Accuracy</span></div>
      </div>
      <div class="note-card"><div class="eyebrow">${icon("heart", 14)} A note for you</div><p>${rnd(LOVE)}</p><div class="sig">${FROM}</div></div>
    </div>`;
  $("#lesson-actions").hidden = false;
  $("#lesson-actions").innerHTML = `<button class="btn primary" data-action="close">Back to units</button>`;
}

function closeLesson() {
  $("#lesson").hidden = true;
  session = null;
  renderApp();
}

/** Closing goes through history.back() so the phone Back button and the close button behave the same. */
function quitLesson() {
  if (session && session.pushed) {
    session.pushed = false;
    history.back();
  } else {
    closeLesson();
  }
}