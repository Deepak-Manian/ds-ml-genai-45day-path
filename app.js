const STORAGE_KEY = 'lockin_v3_checked';

let checked = {};
let currentFilter = 'all';
let searchQuery = '';

// ─── Inspiring quotes keyed to elements ────────────────────────
const QUOTES = {
  earth: [
    { text: "The boulder does not hate Sisyphus. And Sisyphus does not need it to. He pushes because pushing is what makes him free.", author: "Albert Camus (reimagined)" },
    { text: "We must imagine Sisyphus happy. The struggle itself toward the heights is enough to fill a man's heart.", author: "Albert Camus" },
    { text: "A mountain does not care about your fear. It only cares about your next step.", author: "Ancient Wisdom" },
    { text: "The Spartans did not ask how many. They asked where.", author: "Plutarch" },
    { text: "Caesar crossed the Rubicon not because he was certain of victory. He crossed because he understood that doubt is the only true defeat.", author: "Historical Observation" },
  ],
  water: [
    { text: "The Nile does not ask permission to reach the sea. Neither should you.", author: "African Proverb" },
    { text: "Water carves the Grand Canyon — not with force, but with relentless consistency. Be the water.", author: "Natural Philosophy" },
    { text: "Odysseus survived every monster, every god, every storm — not because he was the strongest, but because he refused to stop.", author: "Homer (The Odyssey)" },
    { text: "The ocean never apologises for its depth. Go deep.", author: "Philosophical Maxim" },
    { text: "A river cuts through rock not because of its power, but because of its persistence.", author: "Jim Watkins" },
  ],
  fire: [
    { text: "Prometheus stole fire from the gods and gave it to mortals. They chained him to a mountain. He never regretted it.", author: "Greek Mythology" },
    { text: "Alexander wept at the edge of the known world — not from defeat, but because there was nothing left to conquer. Make sure your world is big enough.", author: "Historical Legend" },
    { text: "Genghis Khan went from a slave in chains to ruler of the largest land empire ever built. The gap between where you are and where you could be is not as large as you think.", author: "Historical Record" },
    { text: "Hannibal crossed the Alps with elephants in winter. His generals said it was impossible. He did it anyway. So did you, just now.", author: "Historical Record" },
    { text: "Every time Sisyphus reaches the top, he has beaten gravity. That is what you just did.", author: "Philosophical Interpretation" },
  ],
  wind: [
    { text: "Sun Tzu never fought a battle he wasn't already winning. Be so prepared that victory arrives before you.", author: "Sun Tzu, The Art of War" },
    { text: "The samurai trains so that in the moment of crisis, his body acts without his mind needing to ask. This skill is yours now.", author: "Miyamoto Musashi" },
    { text: "The mind is a kite — it can only soar when held against the wind of difficulty.", author: "Persian Proverb" },
    { text: "The faster you master the fundamentals, the sooner you can break the rules deliberately.", author: "Bruce Lee" },
    { text: "Your spirit, having wandered far, must return to the body with a gift. You just brought one back.", author: "Sufi Teaching" },
  ],
  lightning: [
    { text: "Tesla saw the future in his mind before he built it in the world. Visualise the system. Then build it.", author: "Nikola Tesla" },
    { text: "Newton did not discover gravity because an apple fell. He discovered it because he had spent twenty years preparing to understand it.", author: "Historical Reflection" },
    { text: "Einstein failed the entrance exam to the Swiss Polytechnic. Then he rewrote physics. Failure is not the end. It is the tutorial.", author: "Historical Record" },
    { text: "The gods gave fire to Prometheus as a punishment — but mortals turned it into civilization. Turn every obstacle into infrastructure.", author: "Mythological Interpretation" },
    { text: "Every system you understand is one fewer thing the world can use against you.", author: "Modern Stoicism" },
  ],
  metal: [
    { text: "A sword does not apologise for being sharp. Sharpen yourself without apology.", author: "Samurai Code" },
    { text: "The Roman legion did not conquer the world through luck. It conquered through systems, discipline, and repetition. You are building your legion.", author: "Historical Observation" },
    { text: "Marcus Aurelius ruled an empire while grieving, at war, and in pain — and still wrote the greatest manual for living under pressure ever created.", author: "Meditations" },
    { text: "You do not rise to the level of your goals. You fall to the level of your systems. Build better systems.", author: "James Clear" },
    { text: "The infrastructure you build today is the empire you rule tomorrow.", author: "Ancient Engineering Wisdom" },
  ],
  void: [
    { text: "The hero's journey has no endpoint — only the next threshold. You just crossed one.", author: "Joseph Campbell" },
    { text: "Sisyphus is free when he realises the mountain is his. Every push is a choice.", author: "Camus revisited" },
    { text: "Achilles chose a short life of glory over a long life of comfort. He chose correctly — for him. Choose correctly for you.", author: "The Iliad" },
    { text: "In the end, we only regret the chances we didn't take, the skills we didn't build, the hours we didn't push.", author: "Mark Twain (paraphrased)" },
    { text: "You are not the same person who started this journey. Good. That was the whole point.", author: "The Path of Mastery" },
  ],
  default: [
    { text: "We must imagine Sisyphus happy.", author: "Albert Camus" },
    { text: "The obstacle is the way.", author: "Marcus Aurelius" },
    { text: "Do not pray for an easy life. Pray for the strength to endure a difficult one.", author: "Bruce Lee" },
    { text: "Mastery is not a destination. It is a direction.", author: "Robert Greene" },
    { text: "Conquer yourself and you conquer the world.", author: "St. Francis of Assisi" },
  ]
};

// Element symbols for popup
const ELEMENT_META = {
  earth:     { symbol: '⛰', color: '#0077FF', label: 'Foundations' },
  water:     { symbol: '🌊', color: '#0077FF', label: 'Statistics' },
  fire:      { symbol: '🔥', color: '#10B981', label: 'Machine Learning' },
  wind:      { symbol: '💨', color: '#FBBF24', label: 'Applied AI' },
  lightning: { symbol: '⚡', color: '#EF4444', label: 'Generative AI' },
  metal:     { symbol: '⚙️', color: '#10B981', label: 'Engineering' },
  void:      { symbol: '✨', color: '#FBBF24', label: 'Mastery' },
};

const SECTION_ELEMENT = {};
SECTIONS.forEach(s => { SECTION_ELEMENT[s.id] = s.element || 'default'; });

// ─── Element → Phase mapping ───────────────────────────────────
function getPhaseColor(element) {
  const map = {
    earth:     { color: '#0077FF', phase: 'blue',    icon: 'code' },
    water:     { color: '#0077FF', phase: 'blue',    icon: 'query_stats' },
    fire:      { color: '#10B981', phase: 'emerald', icon: 'psychology' },
    wind:      { color: '#FBBF24', phase: 'gold',    icon: 'neurology' },
    lightning: { color: '#EF4444', phase: 'crimson', icon: 'auto_awesome' },
    metal:     { color: '#10B981', phase: 'emerald', icon: 'build' },
    void:      { color: '#FBBF24', phase: 'gold',    icon: 'military_tech' },
  };
  return map[element] || map.earth;
}

// Material icon per section (contextual)
const SECTION_ICONS = {
  python_basics: 'terminal',
  python: 'dataset',
  sql: 'storage',
  stats: 'query_stats',
  math: 'functions',
  eda: 'search_insights',
  ml_core: 'psychology',
  dl: 'neurology',
  nlp: 'translate',
  cv: 'visibility',
  genai: 'auto_awesome',
  mlops: 'build',
  data_eng: 'engineering',
  rl: 'smart_toy',
  ethics: 'balance',
  graph_ml: 'hub',
  capstones: 'military_tech',
  soft: 'record_voice_over',
};

// Skill card icons (cycle through a set per phase)
const SKILL_ICONS_BY_PHASE = {
  blue:    ['code', 'functions', 'dataset', 'terminal', 'bar_chart', 'storage'],
  emerald: ['psychology', 'show_chart', 'account_tree', 'bubble_chart', 'analytics', 'tune'],
  gold:    ['neurology', 'translate', 'visibility', 'smart_toy', 'military_tech', 'record_voice_over'],
  crimson: ['auto_awesome', 'bolt', 'hub', 'rocket_launch', 'science', 'model_training'],
};

// ─── State ─────────────────────────────────────────────────────
function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if(r) checked = JSON.parse(r); } catch(e) { checked = {}; }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)); } catch(e) {}
}
function getAllSkills() { return SECTIONS.flatMap(s => s.skills); }

// ─── Stats ──────────────────────────────────────────────────────
function updateStats() {
  const all = getAllSkills(), total = all.length;
  const done = all.filter(s => checked[s.id]).length;
  const pct = total > 0 ? Math.round((done/total)*100) : 0;

  const countDone = document.getElementById('count-done');
  const countTotal = document.getElementById('count-total');
  const pctEl = document.getElementById('ring-pct');
  const barEl = document.getElementById('global-bar');

  if (countDone) countDone.textContent = done;
  if (countTotal) countTotal.textContent = total;
  if (pctEl) pctEl.textContent = pct + '%';
  if (barEl) barEl.style.width = pct + '%';
}

function skillVisible(skill) {
  if (currentFilter==='all') {
    // apply search filter
  } else if (currentFilter==='done') {
    if (!checked[skill.id]) return false;
  } else if (currentFilter==='undone') {
    if (checked[skill.id]) return false;
  } else {
    if (skill.tag !== currentFilter) return false;
  }
  // Search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    const nameMatch = skill.name.toLowerCase().includes(q);
    const descMatch = skill.desc.toLowerCase().includes(q);
    if (!nameMatch && !descMatch) return false;
  }
  return true;
}

// ─── Toggle skill ────────────────────────────────────────────────
function toggleSkill(skillId) {
  const wasDone = !!checked[skillId];
  checked[skillId] = !wasDone;
  saveState();

  const card = document.querySelector('.skill-card[data-skill-id="'+skillId+'"]');
  if (card) {
    const isDone = !!checked[skillId];
    card.classList.toggle('is-done', isDone);
    // Update icon
    const statusEl = card.querySelector('.skill-status');
    if (statusEl) {
      const pc = getPhaseColor(card.dataset.element || 'earth');
      if (isDone) {
        statusEl.innerHTML = `<span class="material-symbols-outlined skill-check-icon" style="color:${pc.color};font-variation-settings:'FILL' 1;">check_circle</span>`;
      } else {
        statusEl.innerHTML = `<span class="material-symbols-outlined skill-unchecked-icon">radio_button_unchecked</span>`;
      }
    }
  }

  updateStats();
  const secId = findSectionForSkill(skillId);
  updateSectionProgress(secId);
  if (!wasDone && checked[skillId]) showMotivation(skillId, secId);
  if (currentFilter==='done'||currentFilter==='undone') renderAll();
}

function findSectionForSkill(skillId) {
  for (const sec of SECTIONS) { if(sec.skills.some(s=>s.id===skillId)) return sec.id; }
  return null;
}

function updateSectionProgress(sectionId) {
  if (!sectionId) return;
  const sec = SECTIONS.find(s=>s.id===sectionId); if(!sec) return;
  const done = sec.skills.filter(s=>checked[s.id]).length;
  const countEl = document.getElementById('phase-count-'+sectionId);
  if (countEl) countEl.textContent = done+'/'+sec.skills.length+' Conquered';
}

function toggleSection(sectionId) {
  const grid = document.getElementById('grid-'+sectionId);
  const chev = document.getElementById('chev-'+sectionId);
  if (!grid) return;
  const isCollapsed = grid.classList.contains('collapsed');
  grid.classList.toggle('collapsed', !isCollapsed);
  if (chev) chev.classList.toggle('collapsed', !isCollapsed);
}

function toggleResources(skillId, btn) {
  const dd = document.getElementById('res-'+skillId); if(!dd) return;
  const isOpen = dd.classList.contains('open');
  dd.classList.toggle('open',!isOpen);
  btn.classList.toggle('open',!isOpen);
  btn.textContent = isOpen ? '▸ Learn' : '▾ Close';
}

// ─── Motivation popup ────────────────────────────────────────────
function showMotivation(skillId, sectionId) {
  const element = SECTION_ELEMENT[sectionId] || 'default';
  const meta = ELEMENT_META[element] || { symbol:'✅', color:'#FBBF24', label:'Mastered' };
  const pool = QUOTES[element] || QUOTES.default;
  const q = pool[Math.floor(Math.random()*pool.length)];

  const skillObj = getAllSkills().find(s=>s.id===skillId);
  const skillName = skillObj ? skillObj.name.split('—')[0].trim() : 'Skill';

  const all = getAllSkills(), total = all.length;
  const done = all.filter(s=>checked[s.id]).length;

  const card = document.getElementById('motivation-card');
  card.querySelector('.motivation-element-symbol').style.color = meta.color;
  card.querySelector('.motivation-element-symbol').style.textShadow = `0 0 20px ${meta.color}66`;
  card.querySelector('.motivation-element-symbol').textContent = meta.symbol;
  card.querySelector('.motivation-skill-name').textContent = skillName + ' — Conquered';
  card.querySelector('.motivation-quote').textContent = `"${q.text}"`;
  card.querySelector('.motivation-quote-author').textContent = `— ${q.author}`;
  card.querySelector('.motivation-progress-note').textContent =
    `${done} of ${total} skills conquered · ${Math.round((done/total)*100)}% of the path walked`;

  // phase-specific border glow
  card.style.borderColor = meta.color + '55';
  card.style.boxShadow = `0 0 40px ${meta.color}22`;

  const overlay = document.getElementById('motivation-overlay');
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeMotivation() {
  document.getElementById('motivation-overlay').classList.remove('visible');
  document.body.style.overflow = '';
}
document.getElementById('motivation-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeMotivation();
});

// ─── Render ──────────────────────────────────────────────────────

function renderSection(sec) {
  const visSkills = sec.skills.filter(skillVisible);
  if (visSkills.length===0) return null;

  const done = sec.skills.filter(s=>checked[s.id]).length;
  const element = sec.element || 'void';
  const pc = getPhaseColor(element);
  const sectionIcon = SECTION_ICONS[sec.id] || 'school';
  const skillIcons = SKILL_ICONS_BY_PHASE[pc.phase] || SKILL_ICONS_BY_PHASE.blue;

  const phaseGroup = document.createElement('div');
  phaseGroup.className = 'phase-group';
  phaseGroup.dataset.sectionId = sec.id;
  phaseGroup.dataset.element = element;

  // Build skill cards
  const cardsHTML = visSkills.map(function(skill, idx) {
    const isDone = !!checked[skill.id];
    const tagLabel = skill.tag==='hot' ? '🔥 Hot' : skill.tag;
    const cardIcon = skillIcons[idx % skillIcons.length];

    const resHTML = skill.resources.map(function(r) {
      return `<a class="resource-link" href="${r.url}" target="_blank" rel="noopener noreferrer">
        <div class="res-icon">${r.icon}</div>
        <div class="res-info"><div class="res-name">${r.name}</div><div class="res-platform">${r.platform}</div></div>
        <span class="res-arrow">↗</span></a>`;
    }).join('');

    const statusIcon = isDone
      ? `<span class="material-symbols-outlined skill-check-icon" style="color:${pc.color};font-variation-settings:'FILL' 1;">check_circle</span>`
      : `<span class="material-symbols-outlined skill-unchecked-icon">radio_button_unchecked</span>`;

    return `<div class="skill-card glass-card phase-${pc.phase} ${isDone?'is-done':''}" data-skill-id="${skill.id}" data-element="${element}">
      <div class="accent-bar" style="background:${pc.color};"></div>
      <div class="skill-card-header" onclick="toggleSkill('${skill.id}')">
        <span class="material-symbols-outlined skill-card-icon phase-${pc.phase}-icon">${cardIcon}</span>
        <div class="skill-status">${statusIcon}</div>
      </div>
      <div onclick="toggleSkill('${skill.id}')">
        <div class="skill-card-name${isDone?' done':''}">${skill.name.split('—')[0].trim()}</div>
        <div class="skill-card-desc">${skill.desc}</div>
      </div>
      <div class="skill-card-bottom">
        <span class="tag-scroll tag-${skill.tag}">${tagLabel}</span>
        <button class="learn-btn" onclick="event.stopPropagation();toggleResources('${skill.id}',this)">▸ Learn</button>
      </div>
      <div class="resource-dropdown" id="res-${skill.id}">
        <div class="resource-label">Free Learning Resources</div>
        ${resHTML}
      </div>
    </div>`;
  }).join('');

  phaseGroup.innerHTML = `
    <div class="phase-header glass-surface" style="border-color:transparent;" onclick="toggleSection('${sec.id}')">
      <div class="phase-icon-wrap" style="border:1px solid ${pc.color};">
        <span class="material-symbols-outlined" style="color:${pc.color};">${sectionIcon}</span>
      </div>
      <div>
        <div class="phase-label" style="color:${pc.color};">${sec.phase || 'Phase'}</div>
        <h2 class="phase-title">${sec.title}</h2>
      </div>
      <div class="phase-header-right">
        <span class="phase-count" id="phase-count-${sec.id}">${done}/${sec.skills.length} Conquered</span>
        <span class="phase-chevron" id="chev-${sec.id}">
          <span class="material-symbols-outlined" style="font-size:18px;">expand_more</span>
        </span>
      </div>
    </div>
    <div class="skills-grid" id="grid-${sec.id}">
      ${cardsHTML}
    </div>`;

  return phaseGroup;
}

function renderHero() {
  const all = getAllSkills(), total = all.length;
  const done = all.filter(s => checked[s.id]).length;
  const pct = total > 0 ? Math.round((done/total)*100) : 0;

  return `
  <!-- Hero Section -->
  <section class="hero-section glass-surface">
    <div class="hero-content">
      <div class="hero-rank-badge">
        <div class="dot"></div>
        <span class="label">RANK: ELITE PRACTITIONER</span>
      </div>
      <h1 class="hero-title">65 DAYS TO MASTERY</h1>
      <div class="hero-quote">
        <p>"The struggle itself is enough to fill a man's heart."</p>
        <p class="author">— Albert Camus</p>
      </div>
      <button class="hero-cta" onclick="document.querySelector('.roadmap')?.scrollIntoView({behavior:'smooth'})">Continue →</button>
    </div>
    <div class="hero-avatar-wrap">
      <img src="./Gojo.png" alt="Gojo Mascot" />
    </div>
    <div class="hero-bg-gradient"></div>
  </section>

  <!-- Stats Bar -->
  <section class="stats-grid">
    <div class="stat-card glass-card">
      <span class="stat-label">Skills Conquered</span>
      <div class="stat-value">
        <span class="stat-big" id="count-done">${done}</span>
        <span class="stat-sub">/ ${total}</span>
      </div>
      <div class="stat-bar-track">
        <div class="stat-bar-fill blue" id="global-bar" style="width:${pct}%;"></div>
      </div>
    </div>
    <div class="stat-card glass-card">
      <span class="stat-label">Total Progress</span>
      <div class="stat-value">
        <span class="stat-big" id="ring-pct">${pct}%</span>
      </div>
      <div class="stat-bar-track">
        <div class="stat-bar-fill emerald" style="width:${pct}%;"></div>
      </div>
    </div>
    <div class="stat-card glass-card rank-card">
      <span class="material-symbols-outlined rank-icon" style="font-variation-settings:'FILL' 1;">military_tech</span>
      <span class="stat-label" style="color:var(--phase-gold);">Current Rank</span>
      <span class="rank-title">Elite Practitioner</span>
    </div>
  </section>

  <!-- Control Bar -->
  <section class="control-bar">
    <div class="filter-group" id="filter-tabs">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="core">Core</button>
      <button class="filter-btn" data-filter="hot">Hot <span class="material-symbols-outlined">local_fire_department</span></button>
      <button class="filter-btn" data-filter="advanced">Advanced</button>
      <button class="filter-btn" data-filter="undone">Remaining</button>
      <button class="filter-btn" data-filter="done">Completed</button>
      <button class="reset-btn" id="reset-btn">Reset</button>
    </div>
    <div class="search-wrap">
      <span class="material-symbols-outlined">search</span>
      <input class="search-input" type="text" placeholder="Search skills..." id="search-input" />
    </div>
  </section>`;
}

function renderAll() {
  const main = document.getElementById('main');
  main.innerHTML = '';

  // Hero + Stats + Controls
  const topHTML = renderHero();
  const topContainer = document.createElement('div');
  topContainer.innerHTML = topHTML;
  while (topContainer.firstChild) {
    main.appendChild(topContainer.firstChild);
  }

  // Roadmap sections
  const roadmap = document.createElement('div');
  roadmap.className = 'roadmap';
  let rendered = 0;
  for (const sec of SECTIONS) {
    const el = renderSection(sec);
    if (el) { roadmap.appendChild(el); rendered++; }
  }
  if (rendered===0) {
    roadmap.innerHTML = '<div class="empty-state"><span class="material-symbols-outlined">emoji_events</span><p>All skills conquered · The path is yours</p></div>';
  }
  main.appendChild(roadmap);

  updateStats();
  bindFilterEvents();
  bindSearchEvent();
}

// ─── Filter tabs ─────────────────────────────────────────────────
function bindFilterEvents() {
  document.querySelectorAll('.filter-btn[data-filter]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderAll();
    });
  });

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (confirm('Reset all progress? This cannot be undone.')) {
        checked = {}; saveState(); renderAll();
      }
    });
  }
}

// ─── Search ──────────────────────────────────────────────────────
function bindSearchEvent() {
  const input = document.getElementById('search-input');
  if (input) {
    input.value = searchQuery;
    input.addEventListener('input', function() {
      searchQuery = this.value;
      // Re-render sections only (keep hero/stats/filters)
      const roadmap = document.querySelector('.roadmap');
      if (roadmap) {
        roadmap.innerHTML = '';
        let rendered = 0;
        for (const sec of SECTIONS) {
          const el = renderSection(sec);
          if (el) { roadmap.appendChild(el); rendered++; }
        }
        if (rendered===0) {
          roadmap.innerHTML = '<div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>No skills match your search</p></div>';
        }
      }
    });
  }
}

// ─── WebGL Shader Background ─────────────────────────────────────
function initShader() {
  const canvas = document.getElementById('shader-canvas');
  if (!canvas) return;

  function syncSize() {
    const w = canvas.clientWidth || 1280;
    const h = canvas.clientHeight || 720;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(syncSize).observe(canvas);
  }
  syncSize();

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

  const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = v_texCoord;
    float n = noise(uv * 3.0 + u_time * 0.1);
    n += 0.5 * noise(uv * 6.0 - u_time * 0.05);
    vec3 color1 = vec3(0.03, 0.04, 0.05);
    vec3 color2 = vec3(0.01, 0.01, 0.01);
    vec3 finalColor = mix(color1, color2, n);
    float scan = sin(uv.y * 200.0 + u_time * 2.0) * 0.02;
    finalColor += scan;
    gl_FragColor = vec4(finalColor, 1.0);
}`;

  function cs(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(prog, 'a_position');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uRes = gl.getUniformLocation(prog, 'u_resolution');

  function render(t) {
    if (typeof ResizeObserver === 'undefined') syncSize();
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uTime) gl.uniform1f(uTime, t * 0.001);
    if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  render(0);
}

// ─── Init ─────────────────────────────────────────────────────────
loadState();
initShader();
renderAll();
