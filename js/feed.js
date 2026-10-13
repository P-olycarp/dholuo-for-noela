/* feed.js — the endless "Explore" feed. It shuffles every card, then reshuffles when it runs out. */

let feedBag = [];
let feedObserver = null;
let feedCount = 0;

function refillFeed() {
  feedBag = shuffle([
    ...ALL.map((word) => ["word", word]),
    ...ALL.filter((_, i) => i % 3 === 0).map((word) => ["quiz", word]),
    ...NAMES.map((name) => ["name", name]),
    ...DIAL.map((form) => ["dialect", form]),
    ...PROV.map((proverb) => ["proverb", proverb]),
    ...TIPS.map((tip) => ["tip", tip]),
  ]);
}

function feedCardHtml([type, value]) {
  switch (type) {
    case "word":
      return `<div class="feed-card" data-action="reveal">
        <div class="eyebrow">${value.cat}</div>
        <div class="feed-word">${value.luo}</div>
        <div class="reveal-text">${value.english}${value.note ? `<div class="muted" style="font-weight:400">${value.note}</div>` : ""}</div>
        <span class="hint">Tap to reveal</span></div>`;
    case "quiz":
      return `<div class="feed-card">
        <div class="eyebrow">Quick quiz${value.cat === "Plurals" ? " · pick the plural" : ""}</div>
        <div class="feed-word">${value.luo}</div>
        <div class="options" style="margin-top:12px">${choicesFor(value, true).map((o, k) =>
          `<button class="option" data-action="feedquiz" data-correct="${o === value ? 1 : 0}"><span class="option-key">${"ABCD"[k]}</span><span>${o.english}</span></button>`).join("")}</div></div>`;
    case "name":
      return `<div class="feed-card"><div class="eyebrow">Luo name</div><div class="feed-word">${value[0]}</div><div class="muted">${value[1]}</div></div>`;
    case "dialect":
      return `<div class="feed-card"><div class="eyebrow">Regional form${value[2] ? " · " + value[2] : ""}</div><div class="feed-word">${value[1]}</div><div class="muted">${value[0]}. Also: ${value[3]}</div></div>`;
    case "tip":
      return `<div class="feed-card"><div class="eyebrow">Grammar note</div><div class="feed-word" style="font-size:1.2rem">${value[0]}</div><div class="muted">${value[1]}</div></div>`;
    case "love":
      return `<div class="note-card"><div class="eyebrow">${icon("heart", 14)} A note for Noela</div><p>${value}</p><div class="sig">${FROM}</div></div>`;
    default:
      return `<div class="feed-card"><div class="eyebrow">Proverb</div><div class="feed-word" style="font-size:1.35rem">${value[0]}</div><div class="muted">${value[1]}</div></div>`;
  }
}

function appendFeed(count) {
  const feed = $("#feed");
  if (!feed) return;
  let html = "";
  for (let i = 0; i < count; i++) {
    if (!feedBag.length) refillFeed();
    html += feedCardHtml(feedBag.pop());
    if (++feedCount % 10 === 0) html += feedCardHtml(["love", rnd(LOVE)]); // a short note every 10 cards
  }
  feed.insertAdjacentHTML("beforeend", html);
}

function startFeed() {
  refillFeed();
  appendFeed(8);
  if (feedObserver) feedObserver.disconnect();
  feedObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) appendFeed(8);
  }, { rootMargin: "900px" });
  feedObserver.observe($("#feed-end"));
}

function answerFeedQuiz(button) {
  const group = button.parentNode;
  if (group.dataset.done) return;
  group.dataset.done = "1";
  group.querySelectorAll(".option").forEach((o) => { if (o.dataset.correct === "1") o.classList.add("ok"); });
  const correct = button.dataset.correct === "1";
  if (!correct) button.classList.add("no");
  correct ? sfxGood() : sfxBad();
}