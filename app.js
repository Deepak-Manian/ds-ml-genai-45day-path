const STORAGE_KEY = 'lockin_v3_checked';
const DAY_START_KEY = 'lockin_start_date';
const SETTINGS_KEY = 'lockin_settings';

let checked = {};
let currentFilter = 'all';
let searchQuery = '';
let currentView = 'phases';
let settings = { compactCards: false };

// ─── Rank system ───────────────────────────────────────────────
const RANKS = [
  { min: 0,   name: 'Initiate',           icon: 'person' },
  { min: 5,   name: 'Apprentice',         icon: 'school' },
  { min: 15,  name: 'Student',            icon: 'menu_book' },
  { min: 25,  name: 'Practitioner',       icon: 'psychology' },
  { min: 40,  name: 'Warrior',            icon: 'shield' },
  { min: 55,  name: 'Expert',             icon: 'star' },
  { min: 70,  name: 'Master',             icon: 'workspace_premium' },
  { min: 85,  name: 'Grand Master',       icon: 'diamond' },
  { min: 100, name: 'Elite Practitioner', icon: 'military_tech' },
];

function getRank(pct) {
  let rank = RANKS[0];
  for (const r of RANKS) { if (pct >= r.min) rank = r; }
  return rank;
}

function getNextRank(pct) {
  for (const r of RANKS) { if (pct < r.min) return r; }
  return null;
}

// ─── Day counter ────────────────────────────────────────────────
function getStartDate() {
  try { const d = localStorage.getItem(DAY_START_KEY); return d ? new Date(d) : null; } catch(e) { return null; }
}
function setStartDate() {
  if (!getStartDate()) {
    try { localStorage.setItem(DAY_START_KEY, new Date().toISOString()); } catch(e) {}
  }
}
function getDayCount() {
  const start = getStartDate();
  if (!start) return 0;
  return Math.max(1, Math.ceil((new Date() - start) / (1000 * 60 * 60 * 24)));
}
function updateDayBadge() {
  const badge = document.getElementById('day-counter');
  if (!badge) return;
  const day = getDayCount();
  badge.textContent = day === 0 ? 'NOT STARTED' : 'DAY ' + Math.min(day, 65) + '/65';
}

// ─── Quotes ─────────────────────────────────────────────────────
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

const SECTION_ICONS = {
  python_basics: 'terminal', python: 'dataset', sql: 'storage', stats: 'query_stats',
  math: 'functions', eda: 'search_insights', ml_core: 'psychology', dl: 'neurology',
  nlp: 'translate', cv: 'visibility', genai: 'auto_awesome', mlops: 'build',
  data_eng: 'engineering', rl: 'smart_toy', ethics: 'balance', graph_ml: 'hub',
  capstones: 'military_tech', soft: 'record_voice_over',
};

const SKILL_ICONS_BY_PHASE = {
  blue:    ['code', 'functions', 'dataset', 'terminal', 'bar_chart', 'storage'],
  emerald: ['psychology', 'show_chart', 'account_tree', 'bubble_chart', 'analytics', 'tune'],
  gold:    ['neurology', 'translate', 'visibility', 'smart_toy', 'military_tech', 'record_voice_over'],
  crimson: ['auto_awesome', 'bolt', 'hub', 'rocket_launch', 'science', 'model_training'],
};

// ─── State ─────────────────────────────────────────────────────
function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if(r) checked = JSON.parse(r); } catch(e) { checked = {}; }
  try { const s = localStorage.getItem(SETTINGS_KEY); if(s) settings = { ...settings, ...JSON.parse(s) }; } catch(e) {}
}
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)); } catch(e) {} }
function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch(e) {} }
function getAllSkills() { return SECTIONS.flatMap(s => s.skills); }

// ─── Stats ──────────────────────────────────────────────────────
function getGlobalStats() {
  const all = getAllSkills(), total = all.length;
  const done = all.filter(s => checked[s.id]).length;
  const pct = total > 0 ? Math.round((done/total)*100) : 0;
  return { all, total, done, pct };
}

function updateStats() {
  const { total, done, pct } = getGlobalStats();
  const el = (id) => document.getElementById(id);
  if (el('count-done')) el('count-done').textContent = done;
  if (el('count-total')) el('count-total').textContent = total;
  if (el('ring-pct')) el('ring-pct').textContent = pct + '%';
  if (el('global-bar')) el('global-bar').style.width = pct + '%';
  if (el('progress-bar-2')) el('progress-bar-2').style.width = pct + '%';

  const rank = getRank(pct);
  if (el('rank-title')) el('rank-title').textContent = rank.name;
  if (el('rank-icon')) el('rank-icon').textContent = rank.icon;
  const rc = el('rank-card');
  if (rc) rc.classList.toggle('has-rank', pct > 0);

  updateDayBadge();
}

function skillVisible(skill) {
  if (currentFilter === 'done' && !checked[skill.id]) return false;
  if (currentFilter === 'undone' && checked[skill.id]) return false;
  if (currentFilter !== 'all' && currentFilter !== 'done' && currentFilter !== 'undone' && skill.tag !== currentFilter) return false;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    if (!skill.name.toLowerCase().includes(q) && !skill.desc.toLowerCase().includes(q)) return false;
  }
  return true;
}

function findFirstIncompleteSection() {
  for (const sec of SECTIONS) {
    if (sec.skills.filter(s => checked[s.id]).length < sec.skills.length) return sec.id;
  }
  return null;
}

// ─── Toggle skill ────────────────────────────────────────────────
function toggleSkill(skillId) {
  const wasDone = !!checked[skillId];
  checked[skillId] = !wasDone;
  saveState();
  if (!wasDone) setStartDate();

  const card = document.querySelector('.skill-card[data-skill-id="'+skillId+'"]');
  if (card) {
    const isDone = !!checked[skillId];
    card.classList.toggle('is-done', isDone);
    const statusEl = card.querySelector('.skill-status');
    if (statusEl) {
      const pc = getPhaseColor(card.dataset.element || 'earth');
      statusEl.innerHTML = isDone
        ? `<span class="material-symbols-outlined skill-check-icon" style="color:${pc.color};font-variation-settings:'FILL' 1;">check_circle</span>`
        : `<span class="material-symbols-outlined skill-unchecked-icon">radio_button_unchecked</span>`;
    }
  }

  updateStats();
  const secId = findSectionForSkill(skillId);
  updateSectionProgress(secId);
  if (!wasDone && checked[skillId]) showMotivation(skillId, secId);
  if (currentFilter==='done'||currentFilter==='undone') renderView();
}

function findSectionForSkill(skillId) {
  for (const sec of SECTIONS) { if(sec.skills.some(s=>s.id===skillId)) return sec.id; }
  return null;
}

function updateSectionProgress(sectionId) {
  if (!sectionId) return;
  const sec = SECTIONS.find(s=>s.id===sectionId); if(!sec) return;
  const done = sec.skills.filter(s=>checked[s.id]).length;
  const total = sec.skills.length;
  const pct = Math.round((done/total)*100);

  const countEl = document.getElementById('phase-count-'+sectionId);
  const barEl = document.getElementById('phase-bar-'+sectionId);
  const groupEl = document.querySelector('.phase-group[data-section-id="'+sectionId+'"]');
  const badgeEl = document.getElementById('phase-badge-'+sectionId);

  if (countEl) countEl.textContent = done+'/'+total;
  if (barEl) barEl.style.width = pct+'%';
  if (groupEl) groupEl.classList.toggle('completed', done === total);
  if (badgeEl) badgeEl.style.display = (done === total) ? 'inline-block' : 'none';
}

function toggleSection(sectionId) {
  const grid = document.getElementById('grid-'+sectionId);
  const chev = document.getElementById('chev-'+sectionId);
  if (!grid) return;
  grid.classList.toggle('collapsed');
  if (chev) chev.classList.toggle('collapsed');
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
  const { total, done, pct } = getGlobalStats();
  const rank = getRank(pct);

  const card = document.getElementById('motivation-card');
  card.querySelector('.motivation-element-symbol').style.color = meta.color;
  card.querySelector('.motivation-element-symbol').style.textShadow = `0 0 20px ${meta.color}66`;
  card.querySelector('.motivation-element-symbol').textContent = meta.symbol;
  card.querySelector('.motivation-skill-name').textContent = skillName + ' — Conquered';
  card.querySelector('.motivation-quote').textContent = `"${q.text}"`;
  card.querySelector('.motivation-quote-author').textContent = `— ${q.author}`;
  card.querySelector('.motivation-progress-note').textContent = `${done}/${total} conquered · ${pct}% · Rank: ${rank.name}`;
  card.style.borderColor = meta.color + '55';
  card.style.boxShadow = `0 0 40px ${meta.color}22`;

  document.getElementById('motivation-overlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeMotivation() {
  document.getElementById('motivation-overlay').classList.remove('visible');
  document.body.style.overflow = '';
}
document.getElementById('motivation-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeMotivation();
});

// ═══════════════════════════════════════════════════════════════════
// VIEW: PHASES (default — skill cards by section)
// ═══════════════════════════════════════════════════════════════════

function renderSection(sec, isExpanded) {
  const visSkills = sec.skills.filter(skillVisible);
  if (visSkills.length===0) return null;

  const done = sec.skills.filter(s=>checked[s.id]).length;
  const total = sec.skills.length;
  const pct = Math.round((done/total)*100);
  const isComplete = done === total;
  const element = sec.element || 'void';
  const pc = getPhaseColor(element);
  const sectionIcon = SECTION_ICONS[sec.id] || 'school';
  const skillIcons = SKILL_ICONS_BY_PHASE[pc.phase] || SKILL_ICONS_BY_PHASE.blue;

  const phaseGroup = document.createElement('div');
  phaseGroup.className = 'phase-group' + (isComplete ? ' completed' : '');
  phaseGroup.dataset.sectionId = sec.id;
  phaseGroup.dataset.element = element;

  const cardsHTML = visSkills.map(function(skill, idx) {
    const isDone = !!checked[skill.id];
    const tagLabel = skill.tag==='hot' ? '🔥 Hot' : skill.tag;
    const cardIcon = skillIcons[idx % skillIcons.length];
    const resHTML = skill.resources.map(r =>
      `<a class="resource-link" href="${r.url}" target="_blank" rel="noopener noreferrer">
        <div class="res-icon">${r.icon}</div>
        <div class="res-info"><div class="res-name">${r.name}</div><div class="res-platform">${r.platform}</div></div>
        <span class="res-arrow">↗</span></a>`
    ).join('');
    const statusIcon = isDone
      ? `<span class="material-symbols-outlined skill-check-icon" style="color:${pc.color};font-variation-settings:'FILL' 1;">check_circle</span>`
      : `<span class="material-symbols-outlined skill-unchecked-icon">radio_button_unchecked</span>`;
    const isCompactClass = settings.compactCards ? ' compact' : '';

    return `<div class="skill-card glass-card phase-${pc.phase} ${isDone?'is-done':''}${isCompactClass}" data-skill-id="${skill.id}" data-element="${element}">
      <div class="accent-bar" style="background:${pc.color};"></div>
      <div class="skill-card-header" onclick="toggleSkill('${skill.id}')">
        <span class="material-symbols-outlined skill-card-icon phase-${pc.phase}-icon">${cardIcon}</span>
        <div class="skill-status">${statusIcon}</div>
      </div>
      <div onclick="toggleSkill('${skill.id}')">
        <div class="skill-card-name">${skill.name.split('—')[0].trim()}</div>
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

  const collapsedClass = isExpanded ? '' : ' collapsed';
  const chevCollapsed = isExpanded ? '' : ' collapsed';
  const progressHTML = isComplete
    ? `<span class="phase-complete-badge" id="phase-badge-${sec.id}">✓ Complete</span>`
    : `<span class="phase-count" id="phase-count-${sec.id}">${done}/${total}</span>
       <div class="phase-progress-bar"><div class="phase-progress-fill" id="phase-bar-${sec.id}" style="width:${pct}%;background:${pc.color};"></div></div>
       <span class="phase-complete-badge" id="phase-badge-${sec.id}" style="display:none;">✓ Complete</span>`;

  phaseGroup.innerHTML = `
    <div class="phase-header" onclick="toggleSection('${sec.id}')">
      <div class="phase-icon-wrap" style="border:1px solid ${pc.color};">
        <span class="material-symbols-outlined" style="color:${pc.color};">${sectionIcon}</span>
      </div>
      <div style="flex:1;min-width:0;">
        <div class="phase-label" style="color:${pc.color};">${sec.phase || 'Phase'}</div>
        <h2 class="phase-title">${sec.title}</h2>
      </div>
      <div class="phase-header-right">
        ${progressHTML}
        <span class="phase-chevron${chevCollapsed}" id="chev-${sec.id}">
          <span class="material-symbols-outlined" style="font-size:18px;">expand_more</span>
        </span>
      </div>
    </div>
    <div class="skills-grid${collapsedClass}" id="grid-${sec.id}">${cardsHTML}</div>`;
  return phaseGroup;
}

function renderHero() {
  const { total, done, pct } = getGlobalStats();
  const rank = getRank(pct);
  const hasRankClass = pct > 0 ? ' has-rank' : '';
  return `
  <section class="hero-section glass-surface">
    <div class="hero-content">
      <div class="hero-rank-badge"><div class="dot"></div><span class="label">RANK: ${rank.name.toUpperCase()}</span></div>
      <h1 class="hero-title">65 DAYS TO MASTERY</h1>
      <div class="hero-quote"><p>"The struggle itself is enough to fill a man's heart."</p><p class="author">— Albert Camus</p></div>
      <button class="hero-cta" onclick="document.querySelector('.roadmap')?.scrollIntoView({behavior:'smooth'})">Continue →</button>
    </div>
    <div class="hero-avatar-wrap"><img src="./Gojo.png" alt="Gojo Mascot" /></div>
    <div class="hero-bg-gradient"></div>
  </section>
  <section class="stats-grid">
    <div class="stat-card glass-card">
      <span class="stat-label">Skills Conquered</span>
      <div class="stat-value"><span class="stat-big" id="count-done">${done}</span><span class="stat-sub">/ ${total}</span></div>
      <div class="stat-bar-track"><div class="stat-bar-fill blue" id="global-bar" style="width:${pct}%;"></div></div>
    </div>
    <div class="stat-card glass-card">
      <span class="stat-label">Total Progress</span>
      <div class="stat-value"><span class="stat-big" id="ring-pct">${pct}%</span></div>
      <div class="stat-bar-track"><div class="stat-bar-fill emerald" id="progress-bar-2" style="width:${pct}%;"></div></div>
    </div>
    <div class="stat-card glass-card rank-card${hasRankClass}" id="rank-card">
      <span class="material-symbols-outlined rank-icon" id="rank-icon" style="font-variation-settings:'FILL' 1;">${rank.icon}</span>
      <span class="stat-label" style="color:var(--phase-gold);">Current Rank</span>
      <span class="rank-title" id="rank-title">${rank.name}</span>
    </div>
  </section>
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

function renderPhasesView() {
  const main = document.getElementById('main');
  main.innerHTML = '';
  const tmp = document.createElement('div'); tmp.innerHTML = renderHero();
  while (tmp.firstChild) main.appendChild(tmp.firstChild);

  const firstIncomplete = findFirstIncompleteSection();
  const roadmap = document.createElement('div'); roadmap.className = 'roadmap';
  let rendered = 0;
  for (const sec of SECTIONS) {
    const el = renderSection(sec, sec.id === firstIncomplete);
    if (el) { roadmap.appendChild(el); rendered++; }
  }
  if (!rendered) roadmap.innerHTML = '<div class="empty-state"><span class="material-symbols-outlined">emoji_events</span><p>All skills conquered · The path is yours</p></div>';
  main.appendChild(roadmap);
  updateStats();
  bindFilterEvents();
  bindSearchEvent();
}

// ═══════════════════════════════════════════════════════════════════
// VIEW: ROADMAP (visual timeline)
// ═══════════════════════════════════════════════════════════════════

function renderRoadmapView() {
  const main = document.getElementById('main');
  const { done: totalDone, total: totalAll, pct: globalPct } = getGlobalStats();
  const firstIncomplete = findFirstIncompleteSection();

  let html = `<h1 class="font-display" style="font-size:clamp(28px,5vw,48px);margin-bottom:8px;">65-Day Roadmap</h1>
  <p style="color:var(--text-muted);margin-bottom:32px;">Your journey from Initiate to Elite Practitioner — ${totalDone}/${totalAll} skills conquered</p>
  <div class="roadmap-view">`;

  SECTIONS.forEach((sec, i) => {
    const done = sec.skills.filter(s => checked[s.id]).length;
    const total = sec.skills.length;
    const pct = Math.round((done/total)*100);
    const pc = getPhaseColor(sec.element || 'void');
    const isCurrent = sec.id === firstIncomplete;
    const isComplete = done === total;
    const dotClass = isComplete ? 'filled' : '';

    html += `<div class="timeline-item${isCurrent ? ' is-current' : ''}" style="animation-delay:${i * 0.05}s;">
      <div class="timeline-dot ${dotClass}" style="color:${pc.color};border-color:${pc.color};"></div>
      <div class="timeline-top">
        <span class="timeline-phase-label" style="color:${pc.color};">${sec.phase || 'Phase'}</span>
        <span class="timeline-days">${isCurrent ? '← YOU ARE HERE' : isComplete ? '✓ COMPLETE' : ''}</span>
      </div>
      <div class="timeline-title">${sec.title}</div>
      <div class="timeline-bar-wrap">
        <div class="timeline-bar"><div class="timeline-bar-fill" style="width:${pct}%;background:${pc.color};"></div></div>
        <span class="timeline-bar-pct">${pct}%</span>
      </div>
      <div class="timeline-skills-count">${done} of ${total} skills conquered</div>
    </div>`;
  });

  html += '</div>';
  main.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════════
// VIEW: STATS (dashboard)
// ═══════════════════════════════════════════════════════════════════

function renderStatsView() {
  const main = document.getElementById('main');
  const { total, done, pct } = getGlobalStats();
  const rank = getRank(pct);
  const nextRank = getNextRank(pct);
  const day = getDayCount();

  // Skills by element
  const elementMap = {};
  SECTIONS.forEach(sec => {
    const el = sec.element || 'void';
    if (!elementMap[el]) elementMap[el] = { total: 0, done: 0 };
    sec.skills.forEach(s => {
      elementMap[el].total++;
      if (checked[s.id]) elementMap[el].done++;
    });
  });

  // Skills by tag
  const tagMap = { core: { total: 0, done: 0 }, hot: { total: 0, done: 0 }, advanced: { total: 0, done: 0 } };
  getAllSkills().forEach(s => {
    if (tagMap[s.tag]) { tagMap[s.tag].total++; if (checked[s.id]) tagMap[s.tag].done++; }
  });

  // Sections sorted by completion
  const sectionStats = SECTIONS.map(sec => {
    const d = sec.skills.filter(s => checked[s.id]).length;
    return { title: sec.title, done: d, total: sec.skills.length, pct: Math.round((d/sec.skills.length)*100), color: getPhaseColor(sec.element || 'void').color };
  }).sort((a,b) => b.pct - a.pct);

  const elementNames = { earth: 'Earth · Python', water: 'Water · Stats/Math', fire: 'Fire · ML/DL', wind: 'Wind · NLP/CV', lightning: 'Lightning · GenAI', metal: 'Metal · MLOps', void: 'Void · Capstones' };
  const elementColors = { earth: '#0077FF', water: '#0077FF', fire: '#10B981', wind: '#FBBF24', lightning: '#EF4444', metal: '#10B981', void: '#FBBF24' };

  let html = `<h1 class="font-display" style="font-size:clamp(28px,5vw,48px);margin-bottom:32px;">Statistics Dashboard</h1>
  <div class="stats-view">
    <!-- Big Numbers -->
    <div class="stats-row">
      <div class="stats-panel">
        <div class="stats-panel-title">Overview</div>
        <div class="big-number-grid">
          <div class="big-number-item"><div class="big-number" style="color:var(--phase-blue);">${done}</div><div class="big-number-label">Skills Done</div></div>
          <div class="big-number-item"><div class="big-number" style="color:var(--text-muted);">${total - done}</div><div class="big-number-label">Remaining</div></div>
          <div class="big-number-item"><div class="big-number" style="color:var(--phase-emerald);">${pct}%</div><div class="big-number-label">Progress</div></div>
          <div class="big-number-item"><div class="big-number" style="color:var(--phase-gold);">${day}</div><div class="big-number-label">Day${day !== 1 ? 's' : ''} Elapsed</div></div>
        </div>
      </div>
      <div class="stats-panel">
        <div class="stats-panel-title">Rank Progression</div>
        <div class="rank-ladder">`;

  RANKS.forEach(r => {
    const cls = r.name === rank.name ? 'current' : (pct >= r.min ? 'achieved' : '');
    html += `<div class="rank-step ${cls}">
      <span class="material-symbols-outlined rank-step-icon" style="font-variation-settings:'FILL' 1;${r.name === rank.name ? 'color:var(--phase-gold);' : ''}">${r.icon}</span>
      <span class="rank-step-name">${r.name}</span>
      <span class="rank-step-pct">${r.min}%</span>
    </div>`;
  });

  html += `</div>
        ${nextRank ? `<p style="font-size:12px;color:var(--text-muted);margin-top:12px;text-align:center;">Next rank: <strong style="color:var(--phase-gold);">${nextRank.name}</strong> at ${nextRank.min}% (${Math.max(0, Math.ceil(total * nextRank.min / 100) - done)} more skills)</p>` : '<p style="font-size:12px;color:var(--phase-gold);margin-top:12px;text-align:center;">🏆 Maximum rank achieved!</p>'}
      </div>
    </div>

    <!-- By Element -->
    <div class="stats-row">
      <div class="stats-panel wide">
        <div class="stats-panel-title">Progress by Element</div>
        <div class="bar-chart">`;

  Object.entries(elementMap).forEach(([el, data]) => {
    const elPct = data.total > 0 ? Math.round((data.done/data.total)*100) : 0;
    html += `<div class="bar-row">
      <span class="bar-label">${elementNames[el] || el}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${elPct}%;background:${elementColors[el] || '#888'};"></div></div>
      <span class="bar-value">${data.done}/${data.total}</span>
    </div>`;
  });

  html += `</div></div></div>

    <!-- By Tag -->
    <div class="stats-row">
      <div class="stats-panel">
        <div class="stats-panel-title">By Skill Tag</div>
        <div class="bar-chart">
          <div class="bar-row"><span class="bar-label">Core</span><div class="bar-track"><div class="bar-fill" style="width:${tagMap.core.total ? Math.round(tagMap.core.done/tagMap.core.total*100) : 0}%;background:var(--text-secondary);"></div></div><span class="bar-value">${tagMap.core.done}/${tagMap.core.total}</span></div>
          <div class="bar-row"><span class="bar-label">🔥 Hot</span><div class="bar-track"><div class="bar-fill" style="width:${tagMap.hot.total ? Math.round(tagMap.hot.done/tagMap.hot.total*100) : 0}%;background:var(--phase-gold);"></div></div><span class="bar-value">${tagMap.hot.done}/${tagMap.hot.total}</span></div>
          <div class="bar-row"><span class="bar-label">Advanced</span><div class="bar-track"><div class="bar-fill" style="width:${tagMap.advanced.total ? Math.round(tagMap.advanced.done/tagMap.advanced.total*100) : 0}%;background:var(--phase-crimson);"></div></div><span class="bar-value">${tagMap.advanced.done}/${tagMap.advanced.total}</span></div>
        </div>
      </div>
      <div class="stats-panel">
        <div class="stats-panel-title">Sections by Completion</div>
        <div class="bar-chart">`;

  sectionStats.slice(0, 8).forEach(s => {
    html += `<div class="bar-row"><span class="bar-label">${s.title.split('—')[0].trim()}</span><div class="bar-track"><div class="bar-fill" style="width:${s.pct}%;background:${s.color};"></div></div><span class="bar-value">${s.pct}%</span></div>`;
  });

  html += `</div></div></div>

    <!-- Projection -->
    <div class="stats-row">
      <div class="stats-panel wide">
        <div class="stats-panel-title">Projections</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">
          <div class="big-number-item">
            <div class="big-number" style="color:var(--phase-blue);">${day > 0 && done > 0 ? Math.round(done/day * 10)/10 : '—'}</div>
            <div class="big-number-label">Skills / Day Avg</div>
          </div>
          <div class="big-number-item">
            <div class="big-number" style="color:var(--phase-emerald);">${day > 0 && done > 0 ? Math.ceil((total - done) / (done / day)) : '—'}</div>
            <div class="big-number-label">Est. Days Left</div>
          </div>
          <div class="big-number-item">
            <div class="big-number" style="color:var(--phase-gold);">${SECTIONS.filter(sec => sec.skills.every(s => checked[s.id])).length}</div>
            <div class="big-number-label">Sections Complete</div>
          </div>
          <div class="big-number-item">
            <div class="big-number" style="color:var(--phase-crimson);">${SECTIONS.length - SECTIONS.filter(sec => sec.skills.every(s => checked[s.id])).length}</div>
            <div class="big-number-label">Sections Left</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  main.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════════
// VIEW: ARCHIVE (trophy wall of completed skills)
// ═══════════════════════════════════════════════════════════════════

function renderArchiveView() {
  const main = document.getElementById('main');
  const { done, total, pct } = getGlobalStats();

  let html = `<h1 class="font-display" style="font-size:clamp(28px,5vw,48px);margin-bottom:8px;">Archive</h1>
  <p style="color:var(--text-muted);margin-bottom:32px;">Your conquered skills — a record of every battle won</p>`;

  if (done === 0) {
    html += `<div class="archive-empty"><span class="material-symbols-outlined">hourglass_empty</span><p>No skills conquered yet. Start your journey in the Phases tab.</p></div>`;
    main.innerHTML = html;
    return;
  }

  html += `<div class="archive-view">
    <div class="archive-count-bar">
      <span class="material-symbols-outlined" style="font-size:32px;color:var(--phase-emerald);font-variation-settings:'FILL' 1;">emoji_events</span>
      <div>
        <div class="stat-value"><span class="stat-big" style="color:var(--phase-emerald);">${done}</span><span class="stat-sub"> / ${total} skills conquered (${pct}%)</span></div>
      </div>
    </div>`;

  SECTIONS.forEach(sec => {
    const doneSkills = sec.skills.filter(s => checked[s.id]);
    if (doneSkills.length === 0) return;
    const pc = getPhaseColor(sec.element || 'void');
    const sectionIcon = SECTION_ICONS[sec.id] || 'school';

    html += `<div>
      <div class="archive-section-title">
        <span class="material-symbols-outlined" style="font-size:16px;color:${pc.color};">${sectionIcon}</span>
        <span style="color:${pc.color};">${sec.title}</span>
        <span style="margin-left:auto;">${doneSkills.length}/${sec.skills.length}</span>
      </div>
      <div class="archive-skill-grid">`;

    doneSkills.forEach(skill => {
      html += `<div class="archive-skill-item">
        <span class="material-symbols-outlined archive-skill-check" style="font-variation-settings:'FILL' 1;">check_circle</span>
        <span class="archive-skill-name">${skill.name.split('—')[0].trim()}</span>
      </div>`;
    });

    html += '</div></div>';
  });

  html += '</div>';
  main.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════════
// PANELS: Notifications & Settings
// ═══════════════════════════════════════════════════════════════════

function openPanel(panelId, overlayId) {
  document.getElementById(panelId).classList.add('open');
  document.getElementById(overlayId).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePanel(panelId, overlayId) {
  document.getElementById(panelId).classList.remove('open');
  document.getElementById(overlayId).classList.remove('open');
  document.body.style.overflow = '';
}

function renderNotifications() {
  const body = document.getElementById('notif-body');
  const { total, done, pct } = getGlobalStats();
  const rank = getRank(pct);
  const nextRank = getNextRank(pct);
  const day = getDayCount();
  const completeSections = SECTIONS.filter(sec => sec.skills.every(s => checked[s.id]));
  let items = [];

  // Milestone notifications
  if (done === 0) {
    items.push({ icon: 'rocket_launch', color: 'var(--phase-blue)', bg: 'rgba(0,119,255,0.1)', title: 'Ready to Launch', desc: 'You haven\'t started yet. Head to the Phases tab and check off your first skill to begin your 65-day journey!', time: 'Now' });
  } else {
    // Current rank
    items.push({ icon: rank.icon, color: 'var(--phase-gold)', bg: 'rgba(251,191,36,0.1)', title: `Current Rank: ${rank.name}`, desc: `You've conquered ${done} of ${total} skills (${pct}%).`, time: `Day ${day}` });

    // Next rank target
    if (nextRank) {
      const needed = Math.max(0, Math.ceil(total * nextRank.min / 100) - done);
      items.push({ icon: 'trending_up', color: 'var(--phase-emerald)', bg: 'rgba(16,185,129,0.1)', title: `Next Rank: ${nextRank.name}`, desc: `Complete ${needed} more skill${needed !== 1 ? 's' : ''} to reach ${nextRank.name} (${nextRank.min}% required).`, time: 'Goal' });
    }

    // Completed sections
    if (completeSections.length > 0) {
      items.push({ icon: 'verified', color: 'var(--phase-emerald)', bg: 'rgba(16,185,129,0.1)', title: `${completeSections.length} Section${completeSections.length > 1 ? 's' : ''} Complete`, desc: completeSections.map(s => s.title.split('—')[0].trim()).join(', '), time: 'Achievement' });
    }

    // Daily pace
    if (day > 0) {
      const pace = Math.round(done / day * 10) / 10;
      const idealPace = Math.round(total / 65 * 10) / 10;
      const status = pace >= idealPace ? 'ahead of schedule' : 'behind schedule';
      items.push({ icon: pace >= idealPace ? 'speed' : 'schedule', color: pace >= idealPace ? 'var(--phase-emerald)' : 'var(--phase-crimson)', bg: pace >= idealPace ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', title: `Pace: ${pace} skills/day`, desc: `Target is ${idealPace} skills/day. You're ${status}.`, time: `Day ${day}` });
    }

    // Suggest next section
    const firstIncomplete = findFirstIncompleteSection();
    if (firstIncomplete) {
      const sec = SECTIONS.find(s => s.id === firstIncomplete);
      const secDone = sec.skills.filter(s => checked[s.id]).length;
      items.push({ icon: 'arrow_forward', color: 'var(--phase-blue)', bg: 'rgba(0,119,255,0.1)', title: 'Continue Here', desc: `${sec.title} — ${secDone}/${sec.skills.length} done. Keep pushing!`, time: 'Suggestion' });
    }
  }

  // Milestone celebrations
  [10, 25, 50, 75, 100, 125].forEach(m => {
    if (done >= m) {
      items.push({ icon: 'celebration', color: 'var(--phase-gold)', bg: 'rgba(251,191,36,0.1)', title: `🎉 ${m} Skills Milestone!`, desc: `You've conquered ${m} skills. Legendary consistency.`, time: 'Milestone' });
    }
  });

  body.innerHTML = items.map(n => `
    <div class="notif-item">
      <div class="notif-icon" style="background:${n.bg};"><span class="material-symbols-outlined" style="color:${n.color};font-variation-settings:'FILL' 1;">${n.icon}</span></div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-desc">${n.desc}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>`).join('');
}

function renderSettings() {
  const body = document.getElementById('settings-body');
  const { done } = getGlobalStats();
  const startDate = getStartDate();

  body.innerHTML = `
    <div class="setting-group">
      <div class="setting-group-title">Display</div>
      <div class="setting-item">
        <div><div class="setting-label">Compact Cards</div><div class="setting-desc">Show smaller skill cards</div></div>
        <label class="toggle-switch"><input type="checkbox" id="toggle-compact" ${settings.compactCards ? 'checked' : ''} /><span class="toggle-slider"></span></label>
      </div>
    </div>
    <div class="setting-group">
      <div class="setting-group-title">Data</div>
      <div class="setting-item">
        <div><div class="setting-label">Export Progress</div><div class="setting-desc">Download as JSON file</div></div>
        <button class="setting-btn" id="btn-export">Export</button>
      </div>
      <div class="setting-item">
        <div><div class="setting-label">Import Progress</div><div class="setting-desc">Restore from JSON file</div></div>
        <button class="setting-btn" id="btn-import">Import</button>
        <input type="file" id="import-file" accept=".json" style="display:none;" />
      </div>
    </div>
    <div class="setting-group">
      <div class="setting-group-title">Info</div>
      <div class="setting-item">
        <div><div class="setting-label">Skills Conquered</div></div>
        <span style="color:var(--text-muted);font-family:'JetBrains Mono',monospace;font-size:13px;">${done}</span>
      </div>
      <div class="setting-item">
        <div><div class="setting-label">Journey Started</div></div>
        <span style="color:var(--text-muted);font-family:'JetBrains Mono',monospace;font-size:13px;">${startDate ? startDate.toLocaleDateString() : 'Not yet'}</span>
      </div>
      <div class="setting-item">
        <div><div class="setting-label">Days Elapsed</div></div>
        <span style="color:var(--text-muted);font-family:'JetBrains Mono',monospace;font-size:13px;">${getDayCount()}</span>
      </div>
    </div>
    <div class="setting-group">
      <div class="setting-group-title">Danger Zone</div>
      <div class="setting-item">
        <div><div class="setting-label">Reset All Progress</div><div class="setting-desc">Clear all checked skills and day counter</div></div>
        <button class="setting-btn danger" id="btn-reset">Reset</button>
      </div>
    </div>`;

  // Bind events
  document.getElementById('toggle-compact').addEventListener('change', function() {
    settings.compactCards = this.checked;
    saveSettings();
    if (currentView === 'phases') renderView();
  });

  document.getElementById('btn-export').addEventListener('click', function() {
    const data = { checked, startDate: localStorage.getItem(DAY_START_KEY), exportedAt: new Date().toISOString(), version: 3 };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'lockin-progress-' + new Date().toISOString().split('T')[0] + '.json';
    a.click(); URL.revokeObjectURL(a.href);
  });

  document.getElementById('btn-import').addEventListener('click', function() {
    document.getElementById('import-file').click();
  });

  document.getElementById('import-file').addEventListener('change', function(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.checked && typeof data.checked === 'object') {
          if (confirm('Import will replace your current progress. Continue?')) {
            checked = data.checked; saveState();
            if (data.startDate) { try { localStorage.setItem(DAY_START_KEY, data.startDate); } catch(e) {} }
            closePanel('settings-panel', 'settings-overlay');
            renderView();
          }
        } else { alert('Invalid file format.'); }
      } catch(err) { alert('Failed to parse file: ' + err.message); }
    };
    reader.readAsText(file);
  });

  document.getElementById('btn-reset').addEventListener('click', function() {
    if (confirm('⚠️ Reset ALL progress? This cannot be undone.')) {
      checked = {}; saveState();
      try { localStorage.removeItem(DAY_START_KEY); } catch(e) {}
      closePanel('settings-panel', 'settings-overlay');
      renderView();
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// VIEW ROUTER
// ═══════════════════════════════════════════════════════════════════

function switchView(view) {
  currentView = view;
  // Update nav active state
  document.querySelectorAll('.header-nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.view === view);
  });
  renderView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderView() {
  switch (currentView) {
    case 'phases':  renderPhasesView();  break;
    case 'roadmap': renderRoadmapView(); break;
    case 'stats':   renderStatsView();   break;
    case 'archive': renderArchiveView(); break;
  }
  updateDayBadge();
}

// ─── Filter + search bindings ────────────────────────────────────
function bindFilterEvents() {
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', function() {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderView();
    });
  });
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (confirm('Reset all progress? This cannot be undone.')) {
        checked = {}; saveState();
        try { localStorage.removeItem(DAY_START_KEY); } catch(e) {}
        renderView();
      }
    });
  }
}

function bindSearchEvent() {
  const input = document.getElementById('search-input');
  if (input) {
    input.value = searchQuery;
    input.addEventListener('input', function() {
      searchQuery = this.value;
      const roadmap = document.querySelector('.roadmap');
      if (roadmap) {
        roadmap.innerHTML = '';
        let rendered = 0;
        for (const sec of SECTIONS) {
          const el = renderSection(sec, !!searchQuery);
          if (el) { roadmap.appendChild(el); rendered++; }
        }
        if (!rendered) roadmap.innerHTML = '<div class="empty-state"><span class="material-symbols-outlined">search_off</span><p>No skills match your search</p></div>';
      }
    });
  }
}

// ─── Navigation & Panel bindings ─────────────────────────────────
document.querySelectorAll('.header-nav a').forEach(a => {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    switchView(a.dataset.view);
  });
});

// Notification panel
document.getElementById('notif-btn').addEventListener('click', function() {
  renderNotifications();
  openPanel('notif-panel', 'notif-overlay');
});
document.getElementById('notif-close').addEventListener('click', () => closePanel('notif-panel', 'notif-overlay'));
document.getElementById('notif-overlay').addEventListener('click', () => closePanel('notif-panel', 'notif-overlay'));

// Settings panel
document.getElementById('settings-btn').addEventListener('click', function() {
  renderSettings();
  openPanel('settings-panel', 'settings-overlay');
});
document.getElementById('settings-close').addEventListener('click', () => closePanel('settings-panel', 'settings-overlay'));
document.getElementById('settings-overlay').addEventListener('click', () => closePanel('settings-panel', 'settings-overlay'));

// ─── WebGL Shader Background ─────────────────────────────────────
function initShader() {
  const canvas = document.getElementById('shader-canvas');
  if (!canvas) return;
  function syncSize() {
    const w = canvas.clientWidth || 1280, h = canvas.clientHeight || 720;
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(syncSize).observe(canvas);
  syncSize();
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;
  const vs = `attribute vec2 a_position;varying vec2 v_texCoord;void main(){v_texCoord=a_position*0.5+0.5;gl_Position=vec4(a_position,0.0,1.0);}`;
  const fs = `precision highp float;varying vec2 v_texCoord;uniform float u_time;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);float a=hash(i);float b=hash(i+vec2(1.0,0.0));float c=hash(i+vec2(0.0,1.0));float d=hash(i+vec2(1.0,1.0));vec2 u=f*f*(3.0-2.0*f);return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;}
void main(){vec2 uv=v_texCoord;float n=noise(uv*3.0+u_time*0.1);n+=0.5*noise(uv*6.0-u_time*0.05);vec3 c1=vec3(0.03,0.04,0.05);vec3 c2=vec3(0.01,0.01,0.01);vec3 fc=mix(c1,c2,n);fc+=sin(uv.y*200.0+u_time*2.0)*0.02;gl_FragColor=vec4(fc,1.0);}`;
  function cs(type, src) { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
  const prog = gl.createProgram();
  gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog); gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(prog, 'a_position');
  gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  const uTime = gl.getUniformLocation(prog, 'u_time');
  (function render(t) {
    if (typeof ResizeObserver === 'undefined') syncSize();
    gl.viewport(0,0,canvas.width,canvas.height);
    if(uTime) gl.uniform1f(uTime,t*0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    requestAnimationFrame(render);
  })(0);
}

// ─── Init ─────────────────────────────────────────────────────────
loadState();
initShader();
renderView();
