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
  if (pct === 0) return RANKS[0];
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
  
  // Do not count days if they have not checked any skills
  const done = Object.values(checked).filter(v => v).length;
  if (done === 0) return 0;

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
  const sectionIcon = SECTION_ICONS[sec.id] || 'school';

  const phaseGroup = document.createElement('div');
  phaseGroup.className = 'flex flex-col gap-4';

  const cardsHTML = visSkills.map(function(skill) {
    const isDone = !!checked[skill.id];
    const tagLabel = skill.tag;
    const resHTML = skill.resources.map(r =>
      `<a href="${r.url}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3 border border-outline-variant hover:bg-surface-container-low transition-colors group text-on-surface-variant hover:text-primary">
        <div class="flex items-center gap-3"><span class="material-symbols-outlined text-[18px]">${r.icon}</span><span class="font-body-md text-sm">${r.name} (${r.platform})</span></div>
        <span class="material-symbols-outlined text-[16px] text-outline-variant group-hover:text-primary transition-colors">north_east</span>
      </a>`
    ).join('');
    
    const statusIcon = isDone ? 'check_box' : 'check_box_outline_blank';
    const isCompactClass = settings.compactCards ? ' p-4' : ' p-8';
    const activeBorderClass = isDone ? '' : 'border-l-4 border-l-secondary';
    
    return `<div class="card card-hover flex flex-col gap-4 relative overflow-hidden ${isDone?'opacity-60':''} ${activeBorderClass} ${isCompactClass} skill-card" data-skill-id="${skill.id}">
      <div class="absolute top-4 right-4 skill-status" onclick="toggleSkill('${skill.id}')">
        <span class="material-symbols-outlined cursor-pointer hover:text-secondary ${isDone?'text-secondary':'text-outline-variant'}" style="font-variation-settings: 'FILL' ${isDone?1:0};">${statusIcon}</span>
      </div>
      <span class="font-label-caps text-label-caps text-on-surface-variant uppercase">${tagLabel}</span>
      <h4 class="font-headline-md text-headline-md text-primary cursor-pointer pr-8 skill-card-name ${isDone?'line-through text-on-surface-variant':''}" onclick="toggleSkill('${skill.id}')">${skill.name.split('—')[0].trim()}</h4>
      ${!settings.compactCards ? `<p class="font-body-md text-body-md text-on-surface-variant cursor-pointer" onclick="toggleSkill('${skill.id}')">${skill.desc}</p>` : ''}
      <div class="flex gap-4 mt-2">
        <button class="font-body-md text-sm text-secondary hover:underline flex items-center gap-1 font-bold" onclick="event.stopPropagation();toggleResources('${skill.id}',this)">
          <span class="material-symbols-outlined text-[16px]">menu_book</span> Resources
        </button>
      </div>
      <div class="resource-dropdown hidden flex-col gap-2 mt-4 pt-4 border-t border-outline-variant" id="res-${skill.id}">
        <div class="font-label-caps text-label-caps text-on-surface-variant mb-2">FREE LEARNING RESOURCES</div>
        ${resHTML}
      </div>
    </div>`;
  }).join('');

  const collapsedClass = isExpanded ? 'grid' : 'hidden';
  const chevCollapsed = isExpanded ? 'rotate-180' : '';

  phaseGroup.innerHTML = `
    <div class="flex items-center justify-between cursor-pointer border-b border-outline-variant pb-2 mt-8" onclick="toggleSection('${sec.id}')">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-primary">${sectionIcon}</span>
        <h3 class="font-headline-md text-headline-md text-primary">${sec.title}</h3>
      </div>
      <div class="flex items-center gap-4">
        <span class="font-caption text-caption text-on-surface-variant" id="phase-count-${sec.id}">${done}/${total} (${pct}%)</span>
        <span class="material-symbols-outlined text-outline-variant transition-transform duration-300 ${chevCollapsed}" id="chev-${sec.id}">expand_more</span>
      </div>
    </div>
    <div class="w-full h-[2px] progress-bar-bg relative -top-4">
      <div class="absolute top-0 left-0 h-full progress-bar-fill" id="phase-bar-${sec.id}" style="width:${pct}%"></div>
    </div>
    <div class="grid-cols-1 md:grid-cols-2 gap-unit skills-grid ${collapsedClass}" id="grid-${sec.id}">${cardsHTML}</div>`;
  return phaseGroup;
}

function renderHero() {
  const { total, done, pct } = getGlobalStats();
  const rank = getRank(pct);
  const day = getDayCount();
  const dayStr = day === 0 ? 'Not Started' : `Day ${Math.min(day, 65)} of 65`;

  return `
  <div class="col-span-1 md:col-span-12 flex flex-col gap-section-gap">
    <section class="flex flex-col gap-unit">
      <div class="flex items-center gap-4 mb-4">
        <img alt="Gojo Mascot" class="w-16 h-16 rounded-full object-cover border border-outline-variant grayscale" src="./Gojo.png"/>
        <div>
          <h1 class="font-headline-lg text-headline-lg md:font-display md:text-display text-primary">${dayStr}</h1>
          <p class="font-body-md text-body-md text-on-surface-variant mt-2">Rank: ${rank.name.toUpperCase()} • Global Progress</p>
        </div>
      </div>
      <div class="card flex flex-col gap-6 p-8 border border-outline-variant bg-surface-bright">
        <div class="flex justify-between items-start">
          <div>
            <span class="font-label-caps text-label-caps text-on-surface-variant block mb-2">CURRENT MASTERY</span>
            <h2 class="font-headline-md text-headline-md text-primary">${done} / ${total} Skills Conquered</h2>
          </div>
          <span class="font-display text-display text-surface-container-highest" id="ring-pct">${pct}%</span>
        </div>
        <div class="w-full mt-4">
          <div class="w-full h-[2px] progress-bar-bg relative">
            <div class="absolute top-0 left-0 h-full progress-bar-fill" id="global-bar" style="width:${pct}%"></div>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-outline-variant" id="filter-tabs">
          <button class="filter-btn active font-label-caps" data-filter="all">ALL</button>
          <button class="filter-btn font-label-caps" data-filter="core">CORE</button>
          <button class="filter-btn font-label-caps" data-filter="hot">HOT</button>
          <button class="filter-btn font-label-caps" data-filter="advanced">ADVANCED</button>
          <button class="filter-btn font-label-caps" data-filter="undone">REMAINING</button>
          <button class="filter-btn font-label-caps" data-filter="done">COMPLETED</button>
          <button class="btn-secondary font-label-caps ml-auto" id="reset-btn">RESET</button>
        </div>
        <div class="relative w-full mt-2">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input class="search-input" type="text" placeholder="Search curriculum..." id="search-input" />
        </div>
      </div>
    </section>
  </div>`;
}

function renderPhasesView() {
  const main = document.getElementById('main');
  main.innerHTML = '';
  const tmp = document.createElement('div'); tmp.innerHTML = renderHero();
  while (tmp.firstChild) main.appendChild(tmp.firstChild);

  const firstIncomplete = findFirstIncompleteSection();
  const roadmap = document.createElement('div'); 
  roadmap.className = 'col-span-1 md:col-span-12 flex flex-col gap-8';
  roadmap.innerHTML = '<h3 class="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-4 mt-8">Curriculum Structure</h3>';
  
  let rendered = 0;
  for (const sec of SECTIONS) {
    const el = renderSection(sec, sec.id === firstIncomplete);
    if (el) { roadmap.appendChild(el); rendered++; }
  }
  if (!rendered) roadmap.innerHTML += '<div class="p-8 text-center text-on-surface-variant"><span class="material-symbols-outlined text-4xl mb-2">emoji_events</span><p>All skills conquered</p></div>';
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

  let html = `<div class="col-span-1 md:col-span-12 flex flex-col gap-8">
    <h1 class="font-display text-display text-primary border-b border-outline-variant pb-4">65-Day Roadmap</h1>
    <p class="font-body-md text-on-surface-variant">Your journey from Initiate to Elite Practitioner — ${totalDone}/${totalAll} skills conquered</p>
    <div class="flex flex-col gap-unit mt-4">`;

  SECTIONS.forEach((sec, i) => {
    const done = sec.skills.filter(s => checked[s.id]).length;
    const total = sec.skills.length;
    const pct = Math.round((done/total)*100);
    const isCurrent = sec.id === firstIncomplete;
    const isComplete = done === total;
    const bgClass = isCurrent ? 'border-l-4 border-l-secondary' : isComplete ? 'opacity-50' : '';

    html += `<div class="card flex flex-col gap-4 relative overflow-hidden ${bgClass}">
      <div class="absolute top-4 right-4">
        <span class="material-symbols-outlined ${isCurrent ? 'text-secondary animate-pulse' : isComplete ? 'text-secondary' : 'text-surface-container-highest'}">${isCurrent ? 'play_circle' : isComplete ? 'check_circle' : 'lock'}</span>
      </div>
      <span class="font-label-caps text-label-caps ${isCurrent ? 'text-secondary' : 'text-on-surface-variant'}">${sec.phase || 'MODULE'} ${isCurrent ? '• CURRENT' : ''}</span>
      <h4 class="font-headline-md text-headline-md ${isComplete ? 'text-on-surface-variant line-through' : 'text-primary'}">${sec.title}</h4>
      <div class="w-full mt-2">
        <div class="flex justify-between mb-2">
          <span class="font-caption text-caption text-on-surface-variant">Module Progress</span>
          <span class="font-caption text-caption text-on-surface-variant">${pct}%</span>
        </div>
        <div class="w-full h-[2px] progress-bar-bg relative">
          <div class="absolute top-0 left-0 h-full progress-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>
    </div>`;
  });

  html += '</div></div>';
  main.innerHTML = html;
}

function renderStatsView() {
  const main = document.getElementById('main');
  const { total, done, pct } = getGlobalStats();
  const rank = getRank(pct);
  const nextRank = getNextRank(pct);
  const day = getDayCount();

  let html = `<div class="col-span-1 md:col-span-12 flex flex-col gap-section-gap">
    <div>
      <h1 class="font-display text-display text-primary border-b border-outline-variant pb-4">Statistics Dashboard</h1>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
      <!-- Big Numbers -->
      <div class="bg-surface-bright border border-outline-variant p-8 flex flex-col gap-8">
        <div>
          <h4 class="font-label-caps text-label-caps text-on-surface-variant mb-4 tracking-widest border-b border-outline-variant pb-2">OVERVIEW</h4>
          <div class="flex items-end gap-2">
            <span class="font-display text-display text-primary">${done}</span>
            <span class="font-body-md text-body-md text-on-surface-variant pb-2">/ ${total}</span>
          </div>
          <span class="font-caption text-caption text-on-surface-variant">Skills Acquired</span>
        </div>
        <div class="w-full h-[2px] progress-bar-bg relative">
          <div class="absolute top-0 left-0 h-full progress-bar-fill" style="width:${pct}%"></div>
        </div>
        <div class="flex flex-col gap-4 mt-4">
          <div class="flex justify-between items-center border-b border-outline-variant pb-2">
            <span class="font-body-md text-body-md text-on-surface-variant">Total Progress</span>
            <span class="font-headline-md text-headline-md text-primary">${pct}%</span>
          </div>
          <div class="flex justify-between items-center border-b border-outline-variant pb-2">
            <span class="font-body-md text-body-md text-on-surface-variant">Days Elapsed</span>
            <span class="font-headline-md text-headline-md text-primary">${day}</span>
          </div>
          <div class="flex justify-between items-center pb-2">
            <span class="font-body-md text-body-md text-on-surface-variant">Pace</span>
            <span class="font-headline-md text-headline-md text-primary">${day>0 ? (done/day).toFixed(1) : '-'} / day</span>
          </div>
        </div>
      </div>
      
      <!-- Ranks -->
      <div class="card flex flex-col gap-4">
        <h4 class="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-2">RANK LADDER</h4>
        <ul class="flex flex-col gap-3 font-body-md text-body-md">`;
        
  RANKS.forEach(r => {
    const isCurrent = r.name === rank.name;
    const isAchieved = pct >= r.min;
    html += `<li class="flex items-center gap-3 ${isAchieved ? 'text-primary' : 'text-outline-variant'}">
      <span class="material-symbols-outlined ${isCurrent ? 'text-secondary' : ''}" style="font-variation-settings: 'FILL' ${isAchieved?1:0};">${r.icon}</span>
      <span class="${isCurrent ? 'font-bold' : ''}">${r.name} (${r.min}%)</span>
    </li>`;
  });

  html += `</ul></div></div></div>`;
  main.innerHTML = html;
}

function renderArchiveView() {
  const main = document.getElementById('main');
  const { done, total, pct } = getGlobalStats();

  let html = `<div class="col-span-1 md:col-span-12 flex flex-col gap-8">
    <h1 class="font-display text-display text-primary border-b border-outline-variant pb-4">Archive</h1>
    <p class="font-body-md text-on-surface-variant">Your conquered skills — ${done} / ${total} skills conquered (${pct}%)</p>
    <div class="flex flex-col gap-unit mt-4">`;

  if (done === 0) {
    html += `<div class="p-8 text-center text-on-surface-variant">No skills conquered yet. Start your journey in the Phases tab.</div>`;
  } else {
    SECTIONS.forEach(sec => {
      const doneSkills = sec.skills.filter(s => checked[s.id]);
      if (doneSkills.length === 0) return;
      
      html += `<div class="card flex flex-col gap-4">
        <h4 class="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-2 flex justify-between">
          <span>${sec.title}</span>
          <span class="text-on-surface-variant text-sm">${doneSkills.length}/${sec.skills.length}</span>
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">`;

      doneSkills.forEach(skill => {
        html += `<div class="flex items-center gap-3 text-on-surface-variant">
          <span class="material-symbols-outlined text-secondary" style="font-variation-settings:'FILL' 1;">check_circle</span>
          <span class="font-body-md text-sm">${skill.name.split('—')[0].trim()}</span>
        </div>`;
      });

      html += `</div></div>`;
    });
  }

  html += '</div></div>';
  main.innerHTML = html;
}

function renderResourcesView() {
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="col-span-1 md:col-span-12 flex flex-col gap-section-gap w-full">
      <div class="grid grid-cols-12 gap-gutter w-full">
        <div class="col-span-12 md:col-span-8 flex flex-col justify-center">
          <h1 class="font-display text-display text-primary mb-6">Digital Library</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Curated materials for profound focus and technical mastery. A sanctuary of thought distilled into text and code.</p>
        </div>
        <div class="col-span-12 md:col-span-4 flex justify-end items-center opacity-80">
          <img class="w-32 h-auto object-contain grayscale opacity-50" src="./Gojo.png" />
        </div>
      </div>
      
      <section class="w-full">
        <div class="flex items-center gap-4 mb-12">
          <h2 class="font-headline-lg text-headline-lg text-primary">Essential Reading</h2>
          <div class="h-px flex-grow bg-surface-container-high"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          
          <div class="card hairline-border p-8 flex flex-col justify-between h-full group card-hover">
            <div>
              <div class="flex justify-between items-start mb-6">
                <span class="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">PAPER</span>
                <span class="font-label-caps text-label-caps text-secondary bg-secondary-fixed/20 px-2 py-1">AI</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-primary mb-4 group-hover:text-secondary transition-colors">Attention Is All You Need</h3>
              <p class="font-body-md text-body-md text-on-surface-variant mb-8 line-clamp-3">The foundational paper introducing the Transformer architecture, dispensing with recurrence and convolutions entirely.</p>
            </div>
            <a href="https://arxiv.org/abs/1706.03762" target="_blank" class="font-label-caps text-label-caps text-primary border-b border-primary self-start hover:text-secondary hover:border-secondary transition-colors pb-1 flex items-center gap-2">
              READ DOCUMENT <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>

          <div class="card hairline-border p-8 flex flex-col justify-between h-full group card-hover">
            <div>
              <div class="flex justify-between items-start mb-6">
                <span class="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">BOOK</span>
                <span class="font-label-caps text-label-caps text-secondary bg-secondary-fixed/20 px-2 py-1">MATH</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-primary mb-4 group-hover:text-secondary transition-colors">Mathematics for Machine Learning</h3>
              <p class="font-body-md text-body-md text-on-surface-variant mb-8 line-clamp-3">The necessary mathematical concepts for understanding machine learning, from linear algebra to vector calculus.</p>
            </div>
            <a href="https://mml-book.github.io/" target="_blank" class="font-label-caps text-label-caps text-primary border-b border-primary self-start hover:text-secondary hover:border-secondary transition-colors pb-1 flex items-center gap-2">
              READ DOCUMENT <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>

          <div class="card hairline-border p-8 flex flex-col justify-between h-full group card-hover">
            <div>
              <div class="flex justify-between items-start mb-6">
                <span class="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">COURSE</span>
                <span class="font-label-caps text-label-caps text-secondary bg-secondary-fixed/20 px-2 py-1">DL</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-primary mb-4 group-hover:text-secondary transition-colors">Neural Networks: Zero to Hero</h3>
              <p class="font-body-md text-body-md text-on-surface-variant mb-8 line-clamp-3">Andrej Karpathy's masterclass on building neural networks from scratch in code.</p>
            </div>
            <a href="https://karpathy.ai/zero-to-hero.html" target="_blank" class="font-label-caps text-label-caps text-primary border-b border-primary self-start hover:text-secondary hover:border-secondary transition-colors pb-1 flex items-center gap-2">
              READ DOCUMENT <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>

        </div>
      </section>
    </div>
  `;
}

function renderJournalView() {
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="col-span-1 md:col-span-12 flex flex-col md:flex-row w-full min-h-[calc(100vh-64px-150px)] gap-gutter">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-surface-bright border border-outline-variant flex-shrink-0 flex flex-col h-auto md:h-full overflow-y-auto pt-8">
        <div class="px-6 mb-6">
          <h3 class="font-label-caps text-label-caps text-on-surface-variant mb-2">65-DAY MASTERY</h3>
          <div class="text-sm font-body-md text-primary font-medium">Day ${getDayCount()} / 65</div>
          <div class="w-full h-[2px] bg-surface-container mt-2">
            <div class="h-full bg-secondary" style="width: ${(getDayCount()/65)*100}%;"></div>
          </div>
        </div>
        <div class="flex-grow flex flex-col">
          <div class="p-4 border-b border-outline-variant cursor-pointer bg-white border-l-2 border-l-primary font-medium">
            <span class="font-body-md text-body-md">Day ${getDayCount()}</span>
            <div class="font-caption text-caption text-on-surface-variant">Today</div>
          </div>
          <div class="p-4 border-b border-outline-variant cursor-pointer hover:bg-surface-container-low transition-colors">
            <span class="font-body-md text-body-md">Day ${Math.max(0, getDayCount()-1)}</span>
            <div class="font-caption text-caption text-on-surface-variant">Yesterday</div>
          </div>
        </div>
        <div class="p-6 border-t border-outline-variant mt-auto">
          <button class="btn-secondary w-full flex items-center justify-center gap-2">
            <span class="material-symbols-outlined" style="font-size: 18px;">add</span> New Entry
          </button>
        </div>
      </aside>

      <!-- Editor Area -->
      <section class="flex-grow bg-white flex flex-col h-auto md:h-full overflow-y-auto p-8 relative border border-outline-variant">
        <div class="max-w-[800px] w-full mx-auto">
          <!-- Meta Header -->
          <div class="mb-12 border-b border-outline-variant pb-8">
            <input class="text-headline-lg font-headline-lg text-primary w-full outline-none mb-4 bg-transparent border-none" placeholder="Entry Title..." type="text" value="Reflections on Structural Integrity"/>
            <div class="flex flex-wrap gap-8">
              <div class="flex-1 min-w-[200px]">
                <label class="font-label-caps text-label-caps text-on-surface-variant block mb-2">DAILY MOOD</label>
                <div class="flex gap-4">
                  <span class="material-symbols-outlined cursor-pointer hover:text-primary transition-colors text-on-surface-variant" style="font-variation-settings: 'FILL' 1;">sentiment_excited</span>
                  <span class="material-symbols-outlined cursor-pointer hover:text-primary transition-colors text-outline-variant">sentiment_neutral</span>
                  <span class="material-symbols-outlined cursor-pointer hover:text-primary transition-colors text-outline-variant">sentiment_dissatisfied</span>
                </div>
              </div>
              <div class="flex-1 min-w-[200px]">
                <label class="font-label-caps text-label-caps text-on-surface-variant block mb-2">HOURS LOGGED</label>
                <input class="w-full border-b border-outline-variant pb-1 font-body-md text-primary outline-none focus:border-primary transition-colors bg-transparent" type="number" value="4.5"/>
              </div>
            </div>
          </div>

          <!-- Daily Prompt -->
          <div class="card bg-surface-bright p-8 mb-12 relative overflow-hidden border border-outline-variant rounded-none">
            <div class="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
            <div class="font-label-caps text-label-caps text-secondary mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined" style="font-size: 16px;">psychology</span> DAILY PROMPT
            </div>
            <p class="font-body-lg text-body-lg text-primary italic">What was your most challenging concept today, and how did you approach deconstructing it?</p>
          </div>

          <!-- Main Text Area -->
          <div class="mb-12">
            <label class="font-label-caps text-label-caps text-on-surface-variant block mb-4">TECHNICAL LOG & REFLECTIONS</label>
            <textarea class="w-full min-h-[400px] outline-none resize-y bg-transparent font-body-md text-primary leading-relaxed" placeholder="Start writing...">Today focused on applying the principles of structural integrity to the core architecture. The primary challenge remains achieving clean modularity without relying on excessive abstraction.

I spent 2 hours refining the grid alignment across the navigation elements. The subtraction of elements is harder than addition. Every line must justify its existence. 

Breakthrough: Using tonal stepping effectively creates necessary depth without violating the flat aesthetic rules.</textarea>
          </div>

          <!-- Key Breakthroughs -->
          <div class="mb-24">
            <label class="font-label-caps text-label-caps text-on-surface-variant block mb-4">KEY BREAKTHROUGHS</label>
            <div class="flex items-center gap-4 mb-4">
              <span class="material-symbols-outlined text-secondary" style="font-size: 20px;">check_circle</span>
              <input class="w-full border-b border-outline-variant pb-1 font-body-md text-primary outline-none focus:border-primary transition-colors bg-transparent" type="text" value="Mastered tonal stepping for depth"/>
            </div>
            <div class="flex items-center gap-4 mb-4">
              <span class="material-symbols-outlined text-outline-variant" style="font-size: 20px;">radio_button_unchecked</span>
              <input class="w-full border-b border-outline-variant pb-1 font-body-md text-primary outline-none focus:border-primary transition-colors bg-transparent" placeholder="Add breakthrough..." type="text"/>
            </div>
          </div>

          <div class="flex justify-end pt-8 border-t border-outline-variant">
            <button class="btn-primary">Save Entry</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function openPanel(panelId, overlayId) {
  document.getElementById(panelId).classList.add('open');
  document.getElementById(overlayId).classList.add('visible');
  document.body.style.overflow = 'hidden';
}
function closePanel(panelId, overlayId) {
  document.getElementById(panelId).classList.remove('open');
  document.getElementById(overlayId).classList.remove('visible');
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

  if (done === 0) {
    items.push({ icon: 'rocket_launch', title: 'Ready to Launch', desc: 'You haven\'t started yet. Check off your first skill to begin.', time: 'Now' });
  } else {
    items.push({ icon: rank.icon, title: `Current Rank: ${rank.name}`, desc: `Conquered ${done}/${total} skills.`, time: `Day ${day}` });
    if (nextRank) items.push({ icon: 'trending_up', title: `Next Rank: ${nextRank.name}`, desc: `Complete more skills to reach ${nextRank.min}%.`, time: 'Goal' });
    if (completeSections.length > 0) items.push({ icon: 'verified', title: `${completeSections.length} Sections Complete`, desc: completeSections.map(s => s.title.split('—')[0].trim()).join(', '), time: 'Achievement' });
  }

  body.innerHTML = items.map(n => `
    <div class="flex gap-4 p-4 border border-outline-variant rounded-none bg-surface-bright mb-4">
      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low text-secondary">
        <span class="material-symbols-outlined">${n.icon}</span>
      </div>
      <div class="flex flex-col">
        <div class="font-headline-md text-primary text-sm">${n.title}</div>
        <div class="font-body-md text-on-surface-variant text-sm mt-1">${n.desc}</div>
        <div class="font-caption text-outline-variant mt-2">${n.time}</div>
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
  document.querySelectorAll('#header-nav a, #mobile-header-nav a').forEach(a => {
    if (a.dataset.view) {
      if (a.dataset.view === view) {
        a.classList.remove('text-on-surface-variant');
        a.classList.add('text-primary');
        a.classList.add('active');
      } else {
        a.classList.remove('text-primary');
        a.classList.remove('active');
        a.classList.add('text-on-surface-variant');
      }
    }
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
    case 'resources': renderResourcesView(); break;
    case 'journal': renderJournalView(); break;
  }
  updateDayBadge();
}

// ─── Filter + search bindings ────────────────────────────────────
function bindFilterEvents() {
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', function() {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.classList.remove('bg-on-surface');
        b.classList.remove('text-surface-bright');
        b.classList.add('bg-surface-container-low');
        b.classList.add('text-on-surface-variant');
      });
      btn.classList.add('active');
      btn.classList.remove('bg-surface-container-low');
      btn.classList.remove('text-on-surface-variant');
      btn.classList.add('bg-on-surface');
      btn.classList.add('text-surface-bright');
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
        if (!rendered) roadmap.innerHTML = '<div class="p-8 text-center text-on-surface-variant"><span class="material-symbols-outlined text-4xl mb-2">search_off</span><p>No skills match your search</p></div>';
      }
    });
  }
}

// ─── Navigation & Panel bindings ─────────────────────────────────
document.querySelectorAll('#header-nav a, #mobile-header-nav a').forEach(a => {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    if (a.dataset.view) {
      switchView(a.dataset.view);
    }
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

// ─── Init ─────────────────────────────────────────────────────────
loadState();
renderView();
