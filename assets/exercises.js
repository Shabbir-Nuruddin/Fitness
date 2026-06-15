/* =========================================================================
   exercises.js  —  Exercise library for Shabbir's fitness app
   -------------------------------------------------------------------------
   This file contains TWO things:
     1) ANIM  -> animated SVG "simulations" of each exercise (stick figures
        that actually move, so you can SEE how the movement looks).
     2) EXERCISES -> the full instructions: how to do it, sets, reps, rest,
        breathing, and beginner tips.
     3) WEEK -> your 7-day plan that ties the exercises together.

   Everything is written for a complete beginner. No gym knowledge needed.
   ========================================================================= */

/* -------------------------------------------------------------------------
   1) ANIMATED SIMULATIONS
   Each function returns an SVG that animates by itself (loops forever).
   They are simple stick figures on purpose: clear and easy to copy.
   ------------------------------------------------------------------------- */

const SVG_HEAD =
  '<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" class="exercise-svg" aria-hidden="true">' +
  '<rect x="0" y="206" width="220" height="6" rx="3" fill="var(--line-dim)"/>'; // floor

const S = {
  // common drawing helpers
  stroke: 'stroke="var(--accent)" stroke-width="7" stroke-linecap="round" fill="none"',
  head: (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="14" fill="var(--accent)"/>`,
};

const ANIM = {
  /* ---- PUSH-UP (side view, body pivots at the feet) ---- */
  pushup: () => SVG_HEAD +
    `<g transform-origin="180 190">
       <animateTransform attributeName="transform" type="translate" values="0 0; 0 26; 0 0"
         dur="2.4s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
       ${S.head(60,120)}
       <line x1="72" y1="128" x2="180" y2="150" ${S.stroke}/>            <!-- body -->
       <line x1="180" y1="150" x2="195" y2="200" ${S.stroke}/>           <!-- legs -->
       <line x1="80" y1="130" x2="80" y2="195" ${S.stroke}>             <!-- arm -->
         <animate attributeName="y1" values="130;150;130" dur="2.4s" repeatCount="indefinite"/>
       </line>
     </g>` + '</svg>',

  /* ---- SQUAT (front view, hips go down and up) ---- */
  squat: () => SVG_HEAD +
    `${S.head(110,46)}
     <line x1="110" y1="60" x2="110" y2="118" ${S.stroke}>
       <animate attributeName="y2" values="118;138;118" dur="2.2s" repeatCount="indefinite"/>
     </line>
     <g><animateTransform attributeName="transform" type="translate" values="0 0;0 20;0 0" dur="2.2s" repeatCount="indefinite"/>
       <line x1="110" y1="70" x2="78" y2="96" ${S.stroke}/>
       <line x1="110" y1="70" x2="142" y2="96" ${S.stroke}/>
     </g>
     <line x1="110" y1="118" x2="84" y2="160" ${S.stroke}>
       <animate attributeName="y1" values="118;138;118" dur="2.2s" repeatCount="indefinite"/>
     </line>
     <line x1="84" y1="160" x2="84" y2="200" ${S.stroke}/>
     <line x1="110" y1="118" x2="136" y2="160" ${S.stroke}>
       <animate attributeName="y1" values="118;138;118" dur="2.2s" repeatCount="indefinite"/>
     </line>
     <line x1="136" y1="160" x2="136" y2="200" ${S.stroke}/>` + '</svg>',

  /* ---- DUMBBELL CURL (forearm lifts the weight up and down) ---- */
  curl: () => SVG_HEAD +
    `${S.head(110,46)}
     <line x1="110" y1="60" x2="110" y2="140" ${S.stroke}/>
     <line x1="110" y1="140" x2="92" y2="200" ${S.stroke}/>
     <line x1="110" y1="140" x2="128" y2="200" ${S.stroke}/>
     <line x1="110" y1="78" x2="138" y2="120" ${S.stroke}/>           <!-- upper arm -->
     <g transform-origin="138 120">
       <animateTransform attributeName="transform" type="rotate" values="0 138 120; -120 138 120; 0 138 120"
         dur="2s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
       <line x1="138" y1="120" x2="138" y2="170" ${S.stroke}/>         <!-- forearm -->
       <rect x="128" y="166" width="20" height="12" rx="2" fill="var(--accent-2)"/> <!-- dumbbell -->
     </g>` + '</svg>',

  /* ---- SHOULDER / OVERHEAD PRESS (both arms push up) ---- */
  press: () => SVG_HEAD +
    `${S.head(110,56)}
     <line x1="110" y1="70" x2="110" y2="150" ${S.stroke}/>
     <line x1="110" y1="150" x2="92" y2="200" ${S.stroke}/>
     <line x1="110" y1="150" x2="128" y2="200" ${S.stroke}/>
     <line x1="110" y1="86" x2="80" y2="86" ${S.stroke}>
       <animate attributeName="y2" values="86;40;86" dur="1.9s" repeatCount="indefinite"/>
     </line>
     <line x1="110" y1="86" x2="140" y2="86" ${S.stroke}>
       <animate attributeName="y2" values="86;40;86" dur="1.9s" repeatCount="indefinite"/>
     </line>
     <rect x="70" y="80" width="20" height="11" rx="2" fill="var(--accent-2)"><animate attributeName="y" values="80;34;80" dur="1.9s" repeatCount="indefinite"/></rect>
     <rect x="130" y="80" width="20" height="11" rx="2" fill="var(--accent-2)"><animate attributeName="y" values="80;34;80" dur="1.9s" repeatCount="indefinite"/></rect>` + '</svg>',

  /* ---- PULL-UP (whole body rises toward a bar) ---- */
  pullup: () => SVG_HEAD +
    `<line x1="40" y1="24" x2="180" y2="24" stroke="var(--line-dim)" stroke-width="8" stroke-linecap="round"/>
     <g><animateTransform attributeName="transform" type="translate" values="0 36;0 0;0 36" dur="2.4s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
       <line x1="92" y1="24" x2="92" y2="70" ${S.stroke}/>
       <line x1="128" y1="24" x2="128" y2="70" ${S.stroke}/>
       ${S.head(110,84)}
       <line x1="110" y1="98" x2="110" y2="160" ${S.stroke}/>
       <line x1="110" y1="160" x2="96" y2="200" ${S.stroke}/>
       <line x1="110" y1="160" x2="124" y2="200" ${S.stroke}/>
     </g>` + '</svg>',

  /* ---- PLANK (steady hold, gentle breathing) ---- */
  plank: () => SVG_HEAD +
    `${S.head(56,150)}
     <line x1="68" y1="156" x2="186" y2="170" ${S.stroke}><animate attributeName="y2" values="170;166;170" dur="3s" repeatCount="indefinite"/></line>
     <line x1="186" y1="170" x2="200" y2="200" ${S.stroke}/>
     <line x1="74" y1="158" x2="74" y2="200" ${S.stroke}/>` + '</svg>',

  /* ---- CRUNCH (lying down, torso curls up) ---- */
  crunch: () => SVG_HEAD +
    `<line x1="60" y1="160" x2="60" y2="200" ${S.stroke}/>            <!-- bent knees -->
     <line x1="60" y1="160" x2="96" y2="160" ${S.stroke}/>
     <g transform-origin="120 178">
       <animateTransform attributeName="transform" type="rotate" values="0 120 178;-34 120 178;0 120 178" dur="2s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
       <line x1="120" y1="178" x2="180" y2="178" ${S.stroke}/>
       ${S.head(192,178)}
     </g>` + '</svg>',

  /* ---- LYING LEG RAISE (legs lift up and down) ---- */
  legraise: () => SVG_HEAD +
    `${S.head(50,178)}
     <line x1="62" y1="180" x2="120" y2="184" ${S.stroke}/>
     <g transform-origin="120 184">
       <animateTransform attributeName="transform" type="rotate" values="0 120 184;-80 120 184;0 120 184" dur="2.4s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
       <line x1="120" y1="184" x2="195" y2="186" ${S.stroke}/>
     </g>` + '</svg>',

  /* ---- SKIPPING ROPE (hops + rope arc) ---- */
  jumprope: () => SVG_HEAD +
    `<path d="M70 110 Q110 250 150 110" stroke="var(--accent-2)" stroke-width="4" fill="none">
       <animate attributeName="d" values="M70 110 Q110 250 150 110; M70 110 Q110 10 150 110; M70 110 Q110 250 150 110" dur="0.7s" repeatCount="indefinite"/>
     </path>
     <g><animateTransform attributeName="transform" type="translate" values="0 0;0 -14;0 0" dur="0.7s" repeatCount="indefinite"/>
       ${S.head(110,52)}
       <line x1="110" y1="66" x2="110" y2="140" ${S.stroke}/>
       <line x1="110" y1="80" x2="78" y2="110" ${S.stroke}/>
       <line x1="110" y1="80" x2="142" y2="110" ${S.stroke}/>
       <line x1="110" y1="140" x2="96" y2="196" ${S.stroke}/>
       <line x1="110" y1="140" x2="124" y2="196" ${S.stroke}/>
     </g>` + '</svg>',

  /* ---- PUNCHING BAG (arms alternate punches) ---- */
  punch: () => SVG_HEAD +
    `<rect x="150" y="20" width="30" height="120" rx="14" fill="var(--accent-2)" opacity="0.85">
       <animateTransform attributeName="transform" type="rotate" values="0 165 20;6 165 20;0 165 20;-3 165 20;0 165 20" dur="1.2s" repeatCount="indefinite"/>
     </rect>
     ${S.head(80,60)}
     <line x1="80" y1="74" x2="80" y2="140" ${S.stroke}/>
     <line x1="80" y1="140" x2="66" y2="196" ${S.stroke}/>
     <line x1="80" y1="140" x2="94" y2="196" ${S.stroke}/>
     <line x1="80" y1="88" x2="120" y2="88" ${S.stroke}>
       <animate attributeName="x2" values="120;150;120" dur="0.6s" repeatCount="indefinite"/>
     </line>
     <line x1="80" y1="92" x2="118" y2="100" ${S.stroke}>
       <animate attributeName="x2" values="118;148;118" dur="0.6s" begin="0.3s" repeatCount="indefinite"/>
     </line>` + '</svg>',

  /* ---- LUNGE (step forward and dip) ---- */
  lunge: () => SVG_HEAD +
    `${S.head(100,56)}
     <line x1="100" y1="70" x2="100" y2="128" ${S.stroke}><animate attributeName="y2" values="128;142;128" dur="2.2s" repeatCount="indefinite"/></line>
     <line x1="100" y1="128" x2="64" y2="170" ${S.stroke}><animate attributeName="y1" values="128;142;128" dur="2.2s" repeatCount="indefinite"/></line>
     <line x1="64" y1="170" x2="64" y2="200" ${S.stroke}/>
     <line x1="100" y1="128" x2="150" y2="168" ${S.stroke}><animate attributeName="y1" values="128;142;128" dur="2.2s" repeatCount="indefinite"/></line>
     <line x1="150" y1="168" x2="150" y2="200" ${S.stroke}/>` + '</svg>',

  /* ---- BENT-OVER ROW (pull dumbbell to hip) ---- */
  row: () => SVG_HEAD +
    `${S.head(64,96)}
     <line x1="76" y1="100" x2="150" y2="130" ${S.stroke}/>           <!-- back, bent over -->
     <line x1="150" y1="130" x2="150" y2="200" ${S.stroke}/>          <!-- leg -->
     <line x1="120" y1="118" x2="120" y2="170" ${S.stroke}>          <!-- arm pulling -->
       <animate attributeName="y2" values="170;128;170" dur="1.8s" repeatCount="indefinite"/>
     </line>
     <rect x="110" y="166" width="20" height="11" rx="2" fill="var(--accent-2)"><animate attributeName="y" values="166;124;166" dur="1.8s" repeatCount="indefinite"/></rect>` + '</svg>',

  /* ---- JUMPING JACK ---- */
  jumpingjack: () => SVG_HEAD +
    `${S.head(110,50)}
     <line x1="110" y1="64" x2="110" y2="130" ${S.stroke}/>
     <line x1="110" y1="78" x2="78" y2="110" ${S.stroke}><animate attributeName="x2" values="78;64;78" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y2" values="110;54;110" dur="0.8s" repeatCount="indefinite"/></line>
     <line x1="110" y1="78" x2="142" y2="110" ${S.stroke}><animate attributeName="x2" values="142;156;142" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y2" values="110;54;110" dur="0.8s" repeatCount="indefinite"/></line>
     <line x1="110" y1="130" x2="92" y2="196" ${S.stroke}><animate attributeName="x2" values="92;72;92" dur="0.8s" repeatCount="indefinite"/></line>
     <line x1="110" y1="130" x2="128" y2="196" ${S.stroke}><animate attributeName="x2" values="128;148;128" dur="0.8s" repeatCount="indefinite"/></line>` + '</svg>',

  /* ---- MOUNTAIN CLIMBER (knees drive in from plank) ---- */
  climber: () => SVG_HEAD +
    `${S.head(60,150)}
     <line x1="72" y1="154" x2="175" y2="172" ${S.stroke}/>
     <line x1="78" y1="156" x2="78" y2="200" ${S.stroke}/>
     <line x1="175" y1="172" x2="150" y2="200" ${S.stroke}><animate attributeName="x2" values="150;120;150" dur="0.6s" repeatCount="indefinite"/><animate attributeName="y2" values="200;176;200" dur="0.6s" repeatCount="indefinite"/></line>
     <line x1="175" y1="172" x2="190" y2="200" ${S.stroke}><animate attributeName="x2" values="190;160;190" dur="0.6s" begin="0.3s" repeatCount="indefinite"/><animate attributeName="y2" values="200;178;200" dur="0.6s" begin="0.3s" repeatCount="indefinite"/></line>` + '</svg>',

  /* ---- HIGH KNEES (run in place) ---- */
  highknees: () => SVG_HEAD +
    `${S.head(110,50)}
     <line x1="110" y1="64" x2="110" y2="130" ${S.stroke}/>
     <line x1="110" y1="80" x2="84" y2="120" ${S.stroke}><animate attributeName="y2" values="120;90;120" dur="0.5s" repeatCount="indefinite"/></line>
     <line x1="110" y1="80" x2="136" y2="120" ${S.stroke}><animate attributeName="y2" values="120;90;120" dur="0.5s" begin="0.25s" repeatCount="indefinite"/></line>
     <line x1="110" y1="130" x2="92" y2="196" ${S.stroke}><animate attributeName="y2" values="196;150;196" dur="0.5s" repeatCount="indefinite"/><animate attributeName="x2" values="92;104;92" dur="0.5s" repeatCount="indefinite"/></line>
     <line x1="110" y1="130" x2="128" y2="196" ${S.stroke}><animate attributeName="y2" values="196;150;196" dur="0.5s" begin="0.25s" repeatCount="indefinite"/><animate attributeName="x2" values="128;116;128" dur="0.5s" begin="0.25s" repeatCount="indefinite"/></line>` + '</svg>',

  /* ---- SWIMMING (freestyle arm stroke) ---- */
  swim: () => SVG_HEAD +
    `<rect x="0" y="150" width="220" height="62" fill="var(--accent-2)" opacity="0.18"/>
     ${S.head(70,150)}
     <line x1="82" y1="152" x2="170" y2="160" ${S.stroke}/>
     <line x1="170" y1="160" x2="200" y2="150" ${S.stroke}><animate attributeName="y2" values="150;158;150" dur="0.6s" repeatCount="indefinite"/></line>
     <g transform-origin="110 154">
       <animateTransform attributeName="transform" type="rotate" values="0 110 154;360 110 154" dur="2s" repeatCount="indefinite"/>
       <line x1="110" y1="154" x2="110" y2="110" ${S.stroke}/>
     </g>` + '</svg>',

  /* ---- REST / STRETCH (calm breathing figure) ---- */
  rest: () => SVG_HEAD +
    `<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="3.4s" repeatCount="indefinite"/>
       ${S.head(110,56)}
       <line x1="110" y1="70" x2="110" y2="140" ${S.stroke}/>
       <line x1="110" y1="86" x2="84" y2="118" ${S.stroke}/>
       <line x1="110" y1="86" x2="136" y2="118" ${S.stroke}/>
       <line x1="110" y1="140" x2="92" y2="196" ${S.stroke}/>
       <line x1="110" y1="140" x2="128" y2="196" ${S.stroke}/>
     </g>` + '</svg>',
};

/* -------------------------------------------------------------------------
   2) THE EXERCISE LIBRARY
   Each entry: name, the animation to show, what muscle it trains,
   step-by-step "how", sets/reps/rest, breathing, and a beginner tip.
   ------------------------------------------------------------------------- */

const EXERCISES = {
  // ---------- Warm-up ----------
  marchwarm: {
    name: "March + Arm Circles", anim: "highknees", target: "Warm-up (whole body)",
    how: [
      "Stand tall. March on the spot, lifting your knees to about waist height.",
      "At the same time, draw big slow circles with both arms (10 forward, 10 back).",
      "Keep it light and easy — you should feel warmer, not tired.",
    ],
    sets: "2 rounds", reps: "45 seconds each", rest: "20 sec",
    breathe: "Breathe normally and steadily.",
    tip: "This wakes up your muscles so you don't get injured. Never skip it.",
  },
  jacks: {
    name: "Jumping Jacks", anim: "jumpingjack", target: "Warm-up / Cardio",
    how: [
      "Stand with feet together, arms by your sides.",
      "Jump: feet go out wide AND arms swing up over your head.",
      "Jump again to bring feet together and arms back down. That's 1 rep.",
    ],
    sets: "2", reps: "30 reps", rest: "20 sec",
    breathe: "In through the nose, out through the mouth, in rhythm.",
    tip: "Land softly on the balls of your feet, knees slightly bent.",
  },

  // ---------- Push (chest / shoulders / triceps) ----------
  pushup: {
    name: "Push-Ups", anim: "pushup", target: "Chest, shoulders, arms",
    how: [
      "Hands on the floor a little wider than your shoulders.",
      "Legs straight behind you, body in one straight line (no saggy hips).",
      "Bend your elbows and lower your chest toward the floor.",
      "Push back up to the start. That's 1 rep.",
    ],
    sets: "3", reps: "8–12 reps", rest: "60 sec",
    breathe: "Breathe IN as you go down, breathe OUT as you push up.",
    tip: "Too hard? Put your knees on the floor. Build up to full push-ups over a few weeks.",
  },
  press: {
    name: "Dumbbell Overhead Press", anim: "press", target: "Shoulders, arms",
    how: [
      "Stand tall, a dumbbell in each hand at shoulder height, palms facing forward.",
      "Press both dumbbells straight up until your arms are almost straight.",
      "Lower them back to your shoulders with control. That's 1 rep.",
    ],
    sets: "3", reps: "10–12 reps", rest: "60 sec",
    breathe: "Breathe OUT as you push up, IN as you lower.",
    tip: "Don't lean back. Squeeze your tummy tight to protect your lower back.",
  },

  // ---------- Pull (back / biceps) ----------
  pullup: {
    name: "Pull-Ups", anim: "pullup", target: "Back, arms (biceps)",
    how: [
      "Grab the pull-up bar with both hands, palms facing away, hands shoulder-width.",
      "Hang with straight arms, then pull yourself up until your chin is over the bar.",
      "Lower yourself down slowly until arms are straight again. That's 1 rep.",
    ],
    sets: "3", reps: "As many as you can (aim 3–8)", rest: "90 sec",
    breathe: "Breathe OUT as you pull up, IN as you come down.",
    tip: "Can't do one yet? Jump up to the top, then lower yourself down as SLOWLY as possible. This builds the strength fast.",
  },
  row: {
    name: "Bent-Over Dumbbell Row", anim: "row", target: "Back, arms",
    how: [
      "Hold a dumbbell in each hand. Bend forward at the hips, back flat, knees soft.",
      "Let your arms hang straight down toward the floor.",
      "Pull both dumbbells up toward your hips, squeezing your shoulder blades together.",
      "Lower slowly. That's 1 rep.",
    ],
    sets: "3", reps: "10–12 reps", rest: "60 sec",
    breathe: "Breathe OUT as you pull up, IN as you lower.",
    tip: "Keep your back flat like a table — never rounded. Look at the floor ahead of you.",
  },
  curl: {
    name: "Dumbbell Biceps Curl", anim: "curl", target: "Arms (biceps)",
    how: [
      "Stand tall, a dumbbell in each hand, arms hanging straight, palms facing forward.",
      "Bend your elbows and curl the dumbbells up toward your shoulders.",
      "Keep your elbows pinned to your sides — only the forearm moves.",
      "Lower slowly. That's 1 rep.",
    ],
    sets: "3", reps: "12 reps", rest: "45 sec",
    breathe: "Breathe OUT as you lift, IN as you lower.",
    tip: "Slow and controlled beats heavy and swinging. No body rocking.",
  },

  // ---------- Legs ----------
  squat: {
    name: "Bodyweight / Dumbbell Squat", anim: "squat", target: "Legs, glutes",
    how: [
      "Stand with feet shoulder-width apart, toes pointed slightly out.",
      "Hold a dumbbell against your chest with both hands (or no weight to start).",
      "Sit back and down like you're sitting into a chair, knees tracking over your toes.",
      "Go as low as comfortable (aim for thighs parallel to floor), then stand back up. That's 1 rep.",
    ],
    sets: "3", reps: "12–15 reps", rest: "60 sec",
    breathe: "Breathe IN as you go down, OUT as you stand up.",
    tip: "Keep your heels flat on the floor and your chest up the whole time.",
  },
  lunge: {
    name: "Lunges", anim: "lunge", target: "Legs, glutes, balance",
    how: [
      "Stand tall (hold a dumbbell in each hand for more challenge).",
      "Step one foot forward and lower until both knees are bent about 90°.",
      "Push through your front foot to stand back up.",
      "Swap legs. One rep on each leg = 1 set of reps.",
    ],
    sets: "3", reps: "10 each leg", rest: "60 sec",
    breathe: "Breathe IN as you step down, OUT as you push up.",
    tip: "Front knee should stay above your ankle, not shoot past your toes.",
  },

  // ---------- Core / Abs (for your 6-pack) ----------
  plank: {
    name: "Plank", anim: "plank", target: "Core / abs",
    how: [
      "Rest on your forearms and toes, elbows under your shoulders.",
      "Make your body a straight line from head to heels.",
      "Squeeze your tummy and hold still. Don't let your hips sag or pop up.",
    ],
    sets: "3", reps: "Hold 20–40 seconds", rest: "45 sec",
    breathe: "Keep breathing slowly — do NOT hold your breath.",
    tip: "Quality over time. A perfect 20-second plank beats a saggy 1-minute one.",
  },
  crunch: {
    name: "Crunches", anim: "crunch", target: "Core / upper abs",
    how: [
      "Lie on your back, knees bent, feet flat on the floor.",
      "Hands lightly behind your head (don't pull your neck).",
      "Curl your shoulders up off the floor toward your knees.",
      "Lower back down slowly. That's 1 rep.",
    ],
    sets: "3", reps: "15–20 reps", rest: "45 sec",
    breathe: "Breathe OUT as you crunch up, IN as you lower.",
    tip: "Look at the ceiling, not your knees, to keep your neck relaxed.",
  },
  legraise: {
    name: "Lying Leg Raises", anim: "legraise", target: "Core / lower abs",
    how: [
      "Lie flat on your back, legs straight, hands by your sides or under your hips.",
      "Keeping legs straight, raise them up until they point at the ceiling.",
      "Lower them slowly — stop just before they touch the floor. That's 1 rep.",
    ],
    sets: "3", reps: "12–15 reps", rest: "45 sec",
    breathe: "Breathe OUT as you lift, IN as you lower.",
    tip: "If your lower back lifts off the floor, don't lower your legs as far. Press your back down.",
  },

  // ---------- Cardio / Conditioning ----------
  skip: {
    name: "Skipping Rope", anim: "jumprope", target: "Cardio, fat-burn, footwork",
    how: [
      "Hold a handle in each hand, rope behind you.",
      "Swing the rope over your head and jump over it with small, light hops.",
      "Stay on the balls of your feet. Keep your jumps low — just clear the rope.",
    ],
    sets: "5 rounds", reps: "45 sec skip / 20 sec rest", rest: "20 sec between rounds",
    breathe: "Find a steady rhythm and breathe with it.",
    tip: "Tripping a lot is normal at first. Go slow; speed comes with practice.",
  },
  bag: {
    name: "Punching Bag Rounds", anim: "punch", target: "Cardio, arms, core, stress relief",
    how: [
      "Stand an arm's length from the bag, one foot slightly forward, fists up by your chin.",
      "Throw straight punches: left, right, left, right — turn your hips into each punch.",
      "Keep moving, stay light on your feet. Mix in faster combos.",
    ],
    sets: "3 rounds", reps: "2 minutes each", rest: "60 sec",
    breathe: "Short sharp breath OUT with each punch (like 'tss').",
    tip: "Start gently to warm your wrists. Don't fully lock out your elbows when you punch.",
  },
  climber: {
    name: "Mountain Climbers", anim: "climber", target: "Cardio + core",
    how: [
      "Get into the top of a push-up position, body straight, hands under shoulders.",
      "Drive one knee in toward your chest, then quickly switch legs.",
      "Keep switching like you're running on the spot horizontally.",
    ],
    sets: "3", reps: "30 seconds", rest: "30 sec",
    breathe: "Quick steady breaths.",
    tip: "Keep your hips low and level — don't let your bum stick up in the air.",
  },
  swim: {
    name: "Swimming", anim: "swim", target: "Whole-body cardio + muscle (low impact)",
    how: [
      "Swim at a steady, comfortable pace — any stroke you can do.",
      "Aim for continuous laps with short rests at the wall when you need them.",
      "Mix it up: a few fast laps, then a few easy ones.",
    ],
    sets: "1 session", reps: "20–30 minutes", rest: "Rest at the wall as needed",
    breathe: "Breathe in time with your strokes; never hold your breath long.",
    tip: "Swimming works almost every muscle and is very kind to your joints. A great recovery-day activity.",
  },

  // ---------- Cool-down ----------
  stretch: {
    name: "Cool-Down Stretch", anim: "rest", target: "Recovery / flexibility",
    how: [
      "Slow everything down. Gently stretch the muscles you just worked.",
      "Reach for your toes (legs), pull each arm across your chest (shoulders), and reach overhead (sides).",
      "Hold each stretch for 20–30 seconds. Never bounce.",
    ],
    sets: "1", reps: "5 minutes total", rest: "—",
    breathe: "Long, slow breaths. Relax into each stretch on the exhale.",
    tip: "Stretching now means less soreness tomorrow. Finish every workout with this.",
  },
};

/* -------------------------------------------------------------------------
   3) YOUR 7-DAY PLAN
   Built for: lose belly fat (abs show), build muscle, get stronger.
   Equipment used: dumbbells, pull-up bar, punching bag, skipping rope, pool.
   Every workout = warm-up -> main work -> abs -> cool-down.
   ------------------------------------------------------------------------- */

const WEEK = [
  {
    day: "Monday", title: "Push + Abs", focus: "Chest, shoulders, arms & core",
    color: "var(--accent)",
    blocks: [
      { label: "Warm-up", items: ["marchwarm", "jacks"] },
      { label: "Main workout", items: ["pushup", "press", "curl"] },
      { label: "Abs finisher", items: ["plank", "crunch"] },
      { label: "Cool-down", items: ["stretch"] },
    ],
  },
  {
    day: "Tuesday", title: "Boxing + Cardio", focus: "Fat-burn, conditioning, stress relief",
    color: "var(--accent-2)",
    blocks: [
      { label: "Warm-up", items: ["marchwarm", "jacks"] },
      { label: "Main workout", items: ["bag", "skip"] },
      { label: "Abs finisher", items: ["legraise", "plank"] },
      { label: "Cool-down", items: ["stretch"] },
    ],
  },
  {
    day: "Wednesday", title: "Legs + Core", focus: "Legs, glutes & balance",
    color: "var(--accent)",
    blocks: [
      { label: "Warm-up", items: ["marchwarm", "jacks"] },
      { label: "Main workout", items: ["squat", "lunge"] },
      { label: "Abs finisher", items: ["crunch", "legraise"] },
      { label: "Cool-down", items: ["stretch"] },
    ],
  },
  {
    day: "Thursday", title: "Pull + Abs", focus: "Back & biceps (great for posture)",
    color: "var(--accent)",
    blocks: [
      { label: "Warm-up", items: ["marchwarm", "jacks"] },
      { label: "Main workout", items: ["pullup", "row", "curl"] },
      { label: "Abs finisher", items: ["plank", "crunch"] },
      { label: "Cool-down", items: ["stretch"] },
    ],
  },
  {
    day: "Friday", title: "Full-Body Strength", focus: "Everything — build total strength",
    color: "var(--accent)",
    blocks: [
      { label: "Warm-up", items: ["marchwarm", "jacks"] },
      { label: "Main workout", items: ["squat", "pushup", "row", "press"] },
      { label: "Abs finisher", items: ["legraise", "climber"] },
      { label: "Cool-down", items: ["stretch"] },
    ],
  },
  {
    day: "Saturday", title: "Swim + Cardio", focus: "Low-impact whole-body cardio",
    color: "var(--accent-2)",
    blocks: [
      { label: "Warm-up", items: ["marchwarm"] },
      { label: "Main workout", items: ["swim", "skip"] },
      { label: "Abs finisher", items: ["crunch", "plank"] },
      { label: "Cool-down", items: ["stretch"] },
    ],
  },
  {
    day: "Sunday", title: "Rest & Recover", focus: "Let your muscles rebuild — this is when you grow!",
    color: "var(--good)",
    rest: true,
    blocks: [
      { label: "Active recovery (optional)", items: ["stretch"] },
    ],
  },
];

// Make data available to app.js
window.FIT = { ANIM, EXERCISES, WEEK };
