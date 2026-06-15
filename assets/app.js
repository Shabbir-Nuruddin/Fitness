/* =========================================================================
   app.js — runs the fitness app
   No frameworks, no internet needed. Everything is saved in your browser.
   ========================================================================= */

// ANIM, EXERCISES and WEEK are defined as globals by exercises.js (loaded first).

// ---- Your numbers ----
const PROFILE = { weightKg: 63, heightCm: 169 };
const BMI = (PROFILE.weightKg / Math.pow(PROFILE.heightCm / 100, 2)).toFixed(1);
// Water goal: ~35 ml per kg of bodyweight, rounded to glasses of 250 ml.
const WATER_GOAL_ML = Math.round((PROFILE.weightKg * 35) / 250) * 250;
const GLASS_ML = 250;
const WATER_GLASSES = Math.round(WATER_GOAL_ML / GLASS_ML);

// ---- Tiny storage helper (saves between days) ----
const today = () => new Date().toISOString().slice(0, 10);
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem("fit_" + k)) ?? d; } catch { return d; } },
  set: (k, v) => localStorage.setItem("fit_" + k, JSON.stringify(v)),
};

const app = document.getElementById("app");
let currentTab = "today";

// JS Sunday=0 ; our WEEK starts Monday, so map it.
function todayIndex() { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; }

/* ----------------------------- NAV ----------------------------- */
const TABS = [
  { id: "today", label: "Today" },
  { id: "plan",  label: "Plan" },
  { id: "timer", label: "Timer" },
  { id: "water", label: "Water" },
  { id: "tips",  label: "Guide" },
];

function renderTabs() {
  return `<div class="tabs">${TABS.map(t =>
    `<button class="tab ${t.id === currentTab ? "active" : ""}" data-tab="${t.id}">${t.label}</button>`
  ).join("")}</div>`;
}

function go(tab) { currentTab = tab; render(); window.scrollTo({ top: 0, behavior: "smooth" }); }

/* --------------------------- RENDER ROOT ----------------------- */
function render() {
  let body = "";
  if (currentTab === "today") body = viewToday();
  else if (currentTab === "plan") body = viewPlan();
  else if (currentTab === "timer") body = viewTimer();
  else if (currentTab === "water") body = viewWater();
  else if (currentTab === "tips") body = viewTips();
  else if (currentTab === "workout") body = viewWorkout(openDayIndex);

  app.innerHTML = `
    <header class="app-header">
      <h1>💪 <span class="flex">Shabbir</span>'s Fitness</h1>
      <p>Your simple daily plan to get lean, strong & 6-pack ready</p>
    </header>
    <div class="stats">
      <div class="stat"><b>${PROFILE.weightKg}kg</b><span>Weight</span></div>
      <div class="stat"><b>${PROFILE.heightCm}cm</b><span>Height</span></div>
      <div class="stat"><b>${BMI}</b><span>BMI (healthy)</span></div>
    </div>
    ${currentTab !== "workout" ? renderTabs() : ""}
    <div id="view">${body}</div>
    <p class="foot">Made for Shabbir · Move daily, drink water, rest well. You've got this. 🔥</p>
  `;
  bind();
}

/* --------------------------- TODAY ----------------------------- */
function viewToday() {
  const idx = todayIndex();
  const d = WEEK[idx];
  const dateStr = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  const water = getWater();
  const exNames = d.rest ? [] : flatItems(d).map(k => EXERCISES[k].name);

  return `
    <p class="muted">${dateStr}</p>
    <div class="day-card is-today" data-open="${idx}" style="border-left-color:${d.color}">
      <div class="top">
        <div>
          <div class="dow">Today's Session</div>
          <h3>${d.title}</h3>
          <div class="focus">${d.focus}</div>
        </div>
        <span class="badge today">TODAY</span>
      </div>
      ${d.rest
        ? `<div class="preview">😴 Rest day — gentle stretching or a relaxed walk/swim if you feel like it.</div>`
        : `<div class="preview">▶️ ${exNames.length} exercises · tap to start</div>`}
    </div>

    <div class="info-card">
      <h3>💧 Water so far today</h3>
      <div class="water-bar"><div style="width:${Math.min(100, water / WATER_GLASSES * 100)}%"></div></div>
      <p class="muted" style="margin-top:8px">${water} of ${WATER_GLASSES} glasses (${(water*GLASS_ML/1000).toFixed(2)} / ${(WATER_GOAL_ML/1000).toFixed(2)} L).
      <button class="how-toggle" data-tab="water">Open water tracker →</button></p>
    </div>

    <div class="info-card">
      <h3>📋 Daily 4-step routine</h3>
      <ul>
        <li><b>1. Warm-up</b> first — never skip it (5 min).</li>
        <li><b>2. Main workout</b> — follow the cards in order.</li>
        <li><b>3. Abs finisher</b> — your 6-pack work.</li>
        <li><b>4. Cool-down stretch</b> — finish calm (5 min).</li>
      </ul>
      <p class="muted" style="margin-top:8px">Use the <b>Timer</b> tab for your rest gaps between sets.</p>
    </div>
  `;
}

/* ---------------------------- PLAN ----------------------------- */
function viewPlan() {
  const idx = todayIndex();
  return `<h2 class="section-title">Your Week</h2>` + WEEK.map((d, i) => {
    const exNames = d.rest ? "Rest & recovery" : flatItems(d).map(k => EXERCISES[k].name).join(" · ");
    return `
      <div class="day-card ${i === idx ? "is-today" : ""}" data-open="${i}" style="border-left-color:${d.color}">
        <div class="top">
          <div>
            <div class="dow">${d.day}</div>
            <h3>${d.title}</h3>
            <div class="focus">${d.focus}</div>
          </div>
          <span class="badge ${i === idx ? "today" : ""}">${i === idx ? "TODAY" : d.rest ? "REST" : "WORKOUT"}</span>
        </div>
        <div class="preview">${exNames}</div>
      </div>`;
  }).join("");
}

/* --------------------------- WORKOUT --------------------------- */
let openDayIndex = 0;
function flatItems(d) { return d.blocks.flatMap(b => b.items); }

function viewWorkout(idx) {
  const d = WEEK[idx];
  const blocks = d.blocks.map(block => `
    <div class="block-title">${block.label}</div>
    ${block.items.map(key => exerciseCard(EXERCISES[key], key)).join("")}
  `).join("");

  return `
    <button class="back-btn" data-tab="plan">← Back to plan</button>
    <h2 class="section-title">${d.day} — ${d.title}</h2>
    <p class="muted" style="margin-bottom:6px">${d.focus}</p>
    ${d.rest ? `<div class="info-card"><h3>😴 Today is a rest day</h3>
        <p>Rest is when your muscles actually rebuild and grow stronger. Don't feel guilty!</p>
        <ul><li>Do the gentle stretch below if you like.</li>
        <li>Drink your water, eat well, sleep 7–9 hours.</li>
        <li>A relaxed walk or easy swim is perfect.</li></ul></div>` : ""}
    ${blocks}
  `;
}

function exerciseCard(ex, key) {
  return `
    <div class="ex-card">
      <div class="ex-head">
        <div class="ex-svg-box">${ANIM[ex.anim] ? ANIM[ex.anim]() : ""}</div>
        <div class="ex-info">
          <h4>${ex.name}</h4>
          <div class="ex-target">🎯 ${ex.target}</div>
          <div class="pills">
            <span class="pill">Sets: <b>${ex.sets}</b></span>
            <span class="pill">Do: <b>${ex.reps}</b></span>
            <span class="pill">Rest: <b>${ex.rest}</b></span>
          </div>
        </div>
      </div>
      <div class="ex-detail">
        <button class="how-toggle" data-how="${key}">▾ How to do it (step by step)</button>
        <div class="how-body hidden" id="how-${key}">
          <ol>${ex.how.map(s => `<li>${s}</li>`).join("")}</ol>
          <div class="note breathe"><span class="ico">🫁</span><div><b>Breathing:</b> ${ex.breathe}</div></div>
          <div class="note tip"><span class="ico">💡</span><div><b>Tip:</b> ${ex.tip}</div></div>
        </div>
      </div>
    </div>`;
}

/* ---------------------------- TIMER ---------------------------- */
let timer = { remaining: 60, total: 60, running: false, id: null, mode: "Rest" };
function fmt(s) { const m = Math.floor(s / 60); const ss = s % 60; return `${m}:${ss.toString().padStart(2, "0")}`; }

function viewTimer() {
  return `
    <h2 class="section-title">Workout Timer</h2>
    <p class="muted" style="margin-bottom:14px">Use this for your rest gaps between sets, or to time planks, skipping rounds and boxing rounds.</p>
    <div class="timer-card">
      <div class="timer-presets">
        <button class="btn ghost sm" data-set="30">30s</button>
        <button class="btn ghost sm" data-set="45">45s</button>
        <button class="btn ghost sm" data-set="60">1 min</button>
        <button class="btn ghost sm" data-set="90">90s</button>
        <button class="btn ghost sm" data-set="120">2 min</button>
      </div>
      <div class="timer-display" id="tdisp">${fmt(timer.remaining)}</div>
      <div class="timer-label" id="tlabel">${timer.running ? "Counting down…" : "Ready"}</div>
      <div class="timer-btns">
        <button class="btn" id="tstart">${timer.running ? "Pause" : "Start"}</button>
        <button class="btn ghost" id="treset">Reset</button>
      </div>
    </div>
    <div class="info-card" style="margin-top:16px">
      <p class="muted">💡 Rest matters: short rests (30–45s) keep your heart rate up for fat-burn. Longer rests (60–90s) help you lift stronger on the next set.</p>
    </div>
  `;
}

function tick() {
  if (timer.remaining > 0) {
    timer.remaining--;
    const disp = document.getElementById("tdisp");
    if (disp) disp.textContent = fmt(timer.remaining);
  } else {
    stopTimer();
    beep();
    const lbl = document.getElementById("tlabel");
    if (lbl) lbl.textContent = "⏰ Time! Next set.";
  }
}
function startTimer() { if (timer.running) return; timer.running = true; timer.id = setInterval(tick, 1000); }
function stopTimer() { timer.running = false; clearInterval(timer.id); }
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination); o.frequency.value = 880; o.type = "sine";
    o.start(); g.gain.setValueAtTime(0.25, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6); o.stop(ctx.currentTime + 0.6);
  } catch {}
}

/* ---------------------------- WATER ---------------------------- */
function getWater() {
  const data = store.get("water", {});
  return data.date === today() ? data.count : 0;
}
function setWater(n) { store.set("water", { date: today(), count: Math.max(0, n) }); }

function viewWater() {
  const count = getWater();
  const glasses = Array.from({ length: WATER_GLASSES }, (_, i) =>
    `<div class="glass ${i < count ? "full" : ""}" data-glass="${i}"></div>`).join("");
  return `
    <h2 class="section-title">Water Tracker</h2>
    <div class="water-card">
      <div class="water-top">
        <div>
          <div class="muted">Today's goal</div>
          <div class="water-amount">${(WATER_GOAL_ML/1000).toFixed(2)} L</div>
        </div>
        <div style="text-align:right">
          <div class="muted">You've had</div>
          <div class="water-amount">${(count*GLASS_ML/1000).toFixed(2)} L</div>
        </div>
      </div>
      <div class="water-bar"><div style="width:${Math.min(100, count / WATER_GLASSES * 100)}%"></div></div>
      <div class="glasses">${glasses}</div>
      <div class="timer-btns" style="justify-content:flex-start">
        <button class="btn blue sm" id="waterAdd">+ 1 glass (250ml)</button>
        <button class="btn ghost sm" id="waterSub">− 1 glass</button>
      </div>
      <p class="muted" style="margin-top:10px">Tap a glass to fill it. ${WATER_GLASSES} glasses = your daily goal (about 35ml per kg of your bodyweight).</p>
    </div>
    <div class="info-card">
      <h3>When to drink (simple)</h3>
      <ul>
        <li><b>Wake up:</b> 1 glass first thing in the morning.</li>
        <li><b>Before workout:</b> 1 glass about 20–30 min before.</li>
        <li><b>During workout:</b> small sips between sets — don't gulp.</li>
        <li><b>After workout:</b> 1–2 glasses to refill.</li>
        <li><b>With meals & through the day:</b> the rest, spread out.</li>
      </ul>
      <p class="muted">On boxing, skipping & swimming days you sweat more — add an extra glass or two.</p>
    </div>
  `;
}

/* ----------------------------- TIPS ---------------------------- */
function viewTips() {
  return `
    <h2 class="section-title">Beginner Guide</h2>

    <div class="info-card">
      <h3>🥇 The 5 golden rules</h3>
      <ul>
        <li><b>Form first.</b> Do the movement correctly and slowly before adding speed or weight.</li>
        <li><b>Warm up & cool down</b> every single session.</li>
        <li><b>Rest days are not lazy</b> — muscle grows while you rest and sleep.</li>
        <li><b>Be consistent.</b> 4–5 honest days a week beats 1 huge session.</li>
        <li><b>Progress slowly.</b> Each week aim for 1 more rep or a little more weight.</li>
      </ul>
    </div>

    <div class="info-card">
      <h3>🍽️ Food for muscle + a 6-pack (simple)</h3>
      <p>Abs are made in the kitchen. To see them you need muscle <i>and</i> low belly fat.</p>
      <ul>
        <li><b>Protein every meal</b> (eggs, chicken, fish, lentils, beans, yogurt, milk) — this builds muscle. Aim for a palm-sized portion.</li>
        <li><b>Carbs for energy</b> (rice, oats, roti, potatoes, fruit) — eat these especially around workouts.</li>
        <li><b>Healthy fats</b> (nuts, olive oil, eggs) in smaller amounts.</li>
        <li><b>Vegetables</b> with most meals — fills you up, keeps you healthy.</li>
        <li><b>Cut back</b> on sugary drinks, fried food and snacks to reveal the abs.</li>
      </ul>
      <p class="muted">At 63kg, aim for roughly 100–120g of protein per day to build muscle.</p>
    </div>

    <div class="info-card">
      <h3>😴 Sleep & recovery</h3>
      <ul>
        <li>Sleep <b>7–9 hours</b>. This is when your body repairs and builds muscle.</li>
        <li>A little muscle soreness 1–2 days after is normal. Sharp pain is not — stop if something hurts sharply.</li>
        <li>Walk or stretch on sore days to feel better faster.</li>
      </ul>
    </div>

    <div class="info-card">
      <h3>📈 How long until I see results?</h3>
      <ul>
        <li><b>Weeks 1–2:</b> exercises feel easier, more energy.</li>
        <li><b>Weeks 3–6:</b> noticeably stronger, more pull-ups & push-ups.</li>
        <li><b>Weeks 8–12:</b> visible muscle, leaner stomach, abs starting to show.</li>
      </ul>
      <p class="muted">Keep going. The plan works if you work the plan. 🔥</p>
    </div>

    <div class="info-card">
      <h3>🧰 Your equipment</h3>
      <ul>
        <li><b>Dumbbells</b> — press, curl, row, squat, lunge (building muscle & strength).</li>
        <li><b>Pull-up bar</b> — pull-ups for a strong back and arms.</li>
        <li><b>Punching bag</b> — cardio, arms, core & great stress relief.</li>
        <li><b>Skipping rope</b> — fast fat-burning cardio and footwork.</li>
        <li><b>Pool</b> — full-body, low-impact training and recovery.</li>
      </ul>
    </div>
  `;
}

/* --------------------------- BINDINGS -------------------------- */
function bind() {
  // tab buttons (and any element with data-tab)
  document.querySelectorAll("[data-tab]").forEach(el =>
    el.addEventListener("click", () => go(el.dataset.tab)));

  // open a workout from a day card
  document.querySelectorAll("[data-open]").forEach(el =>
    el.addEventListener("click", () => { openDayIndex = +el.dataset.open; go("workout"); }));

  // expand "how to"
  document.querySelectorAll("[data-how]").forEach(el =>
    el.addEventListener("click", () => {
      const body = document.getElementById("how-" + el.dataset.how);
      const open = !body.classList.contains("hidden");
      body.classList.toggle("hidden");
      el.textContent = (open ? "▾ How to do it (step by step)" : "▴ Hide steps");
    }));

  // timer
  const setBtns = document.querySelectorAll("[data-set]");
  setBtns.forEach(el => el.addEventListener("click", () => {
    stopTimer(); timer.total = +el.dataset.set; timer.remaining = +el.dataset.set;
    document.getElementById("tdisp").textContent = fmt(timer.remaining);
    document.getElementById("tlabel").textContent = "Ready";
    document.getElementById("tstart").textContent = "Start";
  }));
  const tstart = document.getElementById("tstart");
  if (tstart) tstart.addEventListener("click", () => {
    if (timer.running) { stopTimer(); tstart.textContent = "Start"; document.getElementById("tlabel").textContent = "Paused"; }
    else { if (timer.remaining === 0) timer.remaining = timer.total;
      startTimer(); tstart.textContent = "Pause"; document.getElementById("tlabel").textContent = "Counting down…"; }
  });
  const treset = document.getElementById("treset");
  if (treset) treset.addEventListener("click", () => {
    stopTimer(); timer.remaining = timer.total;
    document.getElementById("tdisp").textContent = fmt(timer.remaining);
    document.getElementById("tlabel").textContent = "Ready";
    if (tstart) tstart.textContent = "Start";
  });

  // water
  const add = document.getElementById("waterAdd");
  if (add) add.addEventListener("click", () => { setWater(getWater() + 1); render(); });
  const sub = document.getElementById("waterSub");
  if (sub) sub.addEventListener("click", () => { setWater(getWater() - 1); render(); });
  document.querySelectorAll("[data-glass]").forEach(g =>
    g.addEventListener("click", () => { setWater(+g.dataset.glass + 1); render(); }));
}

/* ----------------------------- BOOT ---------------------------- */
render();
