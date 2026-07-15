const STORAGE_KEY = 'lockin_v3_checked';
const DAY_START_KEY = 'lockin_start_date';
const SETTINGS_KEY = 'lockin_settings';

let checked = {};
let currentFilter = 'all';
let searchQuery = '';
let currentView = 'phases';
let settings = { compactCards: false };

let journalEntries = {};
let journalSelectedDay = 1;

// Old sync variables removed

function getDetailedElapsedTime() {
  const startStr = localStorage.getItem(DAY_START_KEY);
  if (!startStr) return null;
  const start = new Date(startStr);
  const diffMs = new Date() - start;

  const secs = Math.floor(diffMs / 1000) % 60;
  const mins = Math.floor(diffMs / (1000 * 60)) % 60;
  const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return { days, hours, mins, secs, totalMs: diffMs };
}

let headerTimerInterval = null;
function startHeaderTimer() {
  if (headerTimerInterval) clearInterval(headerTimerInterval);
  headerTimerInterval = setInterval(() => {
    const elapsed = getDetailedElapsedTime();
    const el = document.getElementById('day-counter');
    if (!el) return;
    if (!elapsed) {
      el.textContent = 'NOT STARTED';
    } else {
      el.textContent = `DAY ${elapsed.days + 1} (${elapsed.days}d ${elapsed.hours}h ${elapsed.mins}m ${elapsed.secs}s)`;
    }

    const statsTimerEl = document.getElementById('stats-live-timer');
    if (statsTimerEl && elapsed) {
      statsTimerEl.textContent = `${elapsed.days}d ${elapsed.hours}h ${elapsed.mins}m ${elapsed.secs}s`;
    }
  }, 1000);
}

// ─── Rank system ───────────────────────────────────────────────
const RANKS = [
  { min: 0, name: 'Initiate', icon: 'person' },
  { min: 5, name: 'Apprentice', icon: 'school' },
  { min: 15, name: 'Student', icon: 'menu_book' },
  { min: 25, name: 'Practitioner', icon: 'psychology' },
  { min: 40, name: 'Warrior', icon: 'shield' },
  { min: 55, name: 'Expert', icon: 'star' },
  { min: 70, name: 'Master', icon: 'workspace_premium' },
  { min: 85, name: 'Grand Master', icon: 'diamond' },
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
  try { const d = localStorage.getItem(DAY_START_KEY); return d ? new Date(d) : null; } catch (e) { return null; }
}
function setStartDate() {
  if (!getStartDate()) {
    try { localStorage.setItem(DAY_START_KEY, new Date().toISOString()); } catch (e) { console.warn('Silenced error:', e); }
    saveGlobalStateToSupabase();
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
  const elapsed = getDetailedElapsedTime();
  const el = document.getElementById('day-counter');
  if (!el) return;
  if (!elapsed) {
    el.textContent = 'NOT STARTED';
  } else {
    el.textContent = `DAY ${elapsed.days + 1} (${elapsed.days}d ${elapsed.hours}h ${elapsed.mins}m ${elapsed.secs}s)`;
  }
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
  earth: { symbol: '⛰', color: '#0077FF', label: 'Foundations' },
  water: { symbol: '🌊', color: '#0077FF', label: 'Statistics' },
  fire: { symbol: '🔥', color: '#10B981', label: 'Machine Learning' },
  wind: { symbol: '💨', color: '#FBBF24', label: 'Applied AI' },
  lightning: { symbol: '⚡', color: '#EF4444', label: 'Generative AI' },
  metal: { symbol: '⚙️', color: '#10B981', label: 'Engineering' },
  void: { symbol: '✨', color: '#FBBF24', label: 'Mastery' },
};

const SECTION_ELEMENT = {};
SECTIONS.forEach(s => { SECTION_ELEMENT[s.id] = s.element || 'default'; });

function getPhaseColor(element) {
  const map = {
    earth: { color: '#0077FF', phase: 'blue', icon: 'code' },
    water: { color: '#0077FF', phase: 'blue', icon: 'query_stats' },
    fire: { color: '#10B981', phase: 'emerald', icon: 'psychology' },
    wind: { color: '#FBBF24', phase: 'gold', icon: 'neurology' },
    lightning: { color: '#EF4444', phase: 'crimson', icon: 'auto_awesome' },
    metal: { color: '#10B981', phase: 'emerald', icon: 'build' },
    void: { color: '#FBBF24', phase: 'gold', icon: 'military_tech' },
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
  blue: ['code', 'functions', 'dataset', 'terminal', 'bar_chart', 'storage'],
  emerald: ['psychology', 'show_chart', 'account_tree', 'bubble_chart', 'analytics', 'tune'],
  gold: ['neurology', 'translate', 'visibility', 'smart_toy', 'military_tech', 'record_voice_over'],
  crimson: ['auto_awesome', 'bolt', 'hub', 'rocket_launch', 'science', 'model_training'],
};

// ─── State ─────────────────────────────────────────────────────
function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) checked = JSON.parse(r); } catch (e) { checked = {}; }
  try { const s = localStorage.getItem(SETTINGS_KEY); if (s) settings = { ...settings, ...JSON.parse(s) }; } catch (e) { console.warn('Silenced error:', e); }
  try { const j = localStorage.getItem('lockin_journal'); if (j) journalEntries = JSON.parse(j); } catch (e) { journalEntries = {}; }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)); } catch (e) { console.warn('Silenced error:', e); }
  saveGlobalStateToSupabase();
}
function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { console.warn('Silenced error:', e); } }
function saveJournalState() {
  try { localStorage.setItem('lockin_journal', JSON.stringify(journalEntries)); } catch (e) { console.warn('Silenced error:', e); }
}
function getAllSkills() { return SECTIONS.flatMap(s => s.skills); }

// ─── Cloud Sync (Supabase) ──────────────────────────────────────
const SUPABASE_URL = 'https://iyaehxeiiblkoafarpgz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5YWVoeGVpaWJsa29hZmFycGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMjQ5NzUsImV4cCI6MjA5OTYwMDk3NX0.U0iqUCzpfdq6de-Ov4JllljvOUTkyKAEf_tDUgDBnc0';

let supabaseClient = null;
if (typeof supabase !== 'undefined') {
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let currentUser = null;
let isLoginMode = true;

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    const authOverlay = document.getElementById('auth-overlay');
    if (currentUser) {
      if (authOverlay) authOverlay.classList.add('hidden');
      loadJournalsFromSupabase().then(() => {
        setupJournalRealtime();
      });
    } else {
      if (authOverlay) authOverlay.classList.remove('hidden');
    }
  });
}

function toggleAuthMode(e) {
  if (e) e.preventDefault();
  isLoginMode = !isLoginMode;
  document.getElementById('auth-title').textContent = isLoginMode ? 'LOGIN TO ZEN' : 'CREATE ACCOUNT';
  document.getElementById('auth-submit-btn').textContent = isLoginMode ? 'LOGIN' : 'SIGN UP';
  document.getElementById('auth-toggle-link').textContent = isLoginMode ? "Don't have an account? Sign up" : 'Already have an account? Login';
  document.getElementById('auth-error').classList.add('hidden');
}

async function handleAuthSubmit() {
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value.trim();
  const errorEl = document.getElementById('auth-error');
  errorEl.classList.add('hidden');

  if (!email || !password) {
    errorEl.textContent = 'Please enter email and password.';
    errorEl.classList.remove('hidden');
    return;
  }

  const btn = document.getElementById('auth-submit-btn');
  const originalText = btn.textContent;
  btn.textContent = 'PROCESSING...';

  try {
    let res;
    if (isLoginMode) {
      res = await supabaseClient.auth.signInWithPassword({ email, password });
    } else {
      res = await supabaseClient.auth.signUp({ email, password });
    }

    if (res.error) throw res.error;

    if (!isLoginMode && res.data?.user && res.data?.session === null) {
      errorEl.textContent = 'Please check your email to confirm your account.';
      errorEl.classList.remove('hidden');
      errorEl.classList.remove('text-error');
      errorEl.classList.add('text-secondary');
    }
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.classList.remove('hidden');
    errorEl.classList.add('text-error');
    errorEl.classList.remove('text-secondary');
  } finally {
    btn.textContent = originalText;
  }
}

async function handleLogout() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
    checked = {};
    try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(DAY_START_KEY); localStorage.removeItem('lockin_journal'); } catch (e) { console.warn('Silenced error:', e); }
    journalEntries = {};
    renderView();
  }
}

window.toggleAuthMode = toggleAuthMode;
window.handleAuthSubmit = handleAuthSubmit;
window.handleLogout = handleLogout;

async function saveGlobalStateToSupabase() {
  if (!supabaseClient || !currentUser) return;
  try {
    const payload = { checked, startDate: localStorage.getItem(DAY_START_KEY) };
    const { data: existing, error: findErr } = await supabaseClient.from('journals').select('id').eq('title', 'global_state');
    if (findErr) throw findErr;

    if (existing && existing.length > 0) {
      await supabaseClient.from('journals').update({ content: JSON.stringify(payload) }).eq('id', existing[0].id);
    } else {
      await supabaseClient.from('journals').insert([{ title: 'global_state', content: JSON.stringify(payload) }]);
    }
  } catch (err) {
    console.error('Failed to sync global state:', err);
  }
}

async function loadJournalsFromSupabase() {
  if (!supabaseClient || !currentUser) return;
  try {
    const { data, error } = await supabaseClient.from('journals').select('*');
    if (error) throw error;

    if (data) {
      let updated = false;
      for (const row of data) {
        if (row.title === 'global_state') {
          try {
            const payload = JSON.parse(row.content);
            if (payload.checked && JSON.stringify(payload.checked) !== JSON.stringify(checked)) {
              checked = payload.checked;
              try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)); } catch (e) { console.warn('Silenced error:', e); }
              updated = true;
            }
            if (payload.startDate !== undefined) {
              if (payload.startDate === null) {
                try { localStorage.removeItem(DAY_START_KEY); } catch (e) { console.warn('Silenced error:', e); }
                updated = true;
              } else if (payload.startDate !== localStorage.getItem(DAY_START_KEY)) {
                try { localStorage.setItem(DAY_START_KEY, payload.startDate); } catch (e) { console.warn('Silenced error:', e); }
                updated = true;
              }
            }
          } catch (e) { console.warn('Silenced error:', e); }
        }
        else if (row.title && row.title.startsWith('Day ')) {
          const dayMatch = row.title.match(/Day (\d+)/);
          if (dayMatch && dayMatch[1]) {
            const dayNum = parseInt(dayMatch[1], 10);
            try {
              const entry = JSON.parse(row.content);
              entry.id = row.id;
              if (JSON.stringify(journalEntries[dayNum]) !== JSON.stringify(entry)) {
                journalEntries[dayNum] = entry;
                updated = true;
              }
            } catch (e) { console.warn('Silenced error:', e); }
          }
        }
      }
      if (updated) {
        try { localStorage.setItem('lockin_journal', JSON.stringify(journalEntries)); } catch (e) { console.warn('Silenced error:', e); }
        renderView();
      }
    }
  } catch (err) {
    console.error('Failed to load journals from Supabase:', err);
  }
}

function setupJournalRealtime() {
  if (!supabaseClient || !currentUser) return;
  supabaseClient
    .channel('public:journals')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'journals' }, payload => {
      loadJournalsFromSupabase();
    })
    .subscribe();
}

function showSyncStatus(msg) {
  const status = document.getElementById('sync-status');
  if (status) status.textContent = msg;
}

// ─── Stats ──────────────────────────────────────────────────────
function getGlobalStats() {
  const all = getAllSkills(), total = all.length;
  const done = all.filter(s => checked[s.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
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

  const card = document.querySelector('.skill-card[data-skill-id="' + skillId + '"]');
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
  if (currentFilter === 'done' || currentFilter === 'undone') renderView();
}

function findSectionForSkill(skillId) {
  for (const sec of SECTIONS) { if (sec.skills.some(s => s.id === skillId)) return sec.id; }
  return null;
}

function updateSectionProgress(sectionId) {
  if (!sectionId) return;
  const sec = SECTIONS.find(s => s.id === sectionId); if (!sec) return;
  const done = sec.skills.filter(s => checked[s.id]).length;
  const total = sec.skills.length;
  const pct = Math.round((done / total) * 100);

  const countEl = document.getElementById('phase-count-' + sectionId);
  const barEl = document.getElementById('phase-bar-' + sectionId);
  const groupEl = document.querySelector('.phase-group[data-section-id="' + sectionId + '"]');
  const badgeEl = document.getElementById('phase-badge-' + sectionId);

  if (countEl) countEl.textContent = done + '/' + total;
  if (barEl) barEl.style.width = pct + '%';
  if (groupEl) groupEl.classList.toggle('completed', done === total);
  if (badgeEl) badgeEl.style.display = (done === total) ? 'inline-block' : 'none';
}

function toggleSection(sectionId) {
  const grid = document.getElementById('grid-' + sectionId);
  const chev = document.getElementById('chev-' + sectionId);
  if (!grid) return;
  grid.classList.toggle('collapsed');
  if (chev) chev.classList.toggle('collapsed');
}

function toggleResources(skillId, btn) {
  const dd = document.getElementById('res-' + skillId); if (!dd) return;
  const isOpen = dd.classList.contains('open');
  dd.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);
  btn.textContent = isOpen ? '▸ Learn' : '▾ Close';
}

// ─── Motivation popup ────────────────────────────────────────────
function showMotivation(skillId, sectionId) {
  const element = SECTION_ELEMENT[sectionId] || 'default';
  const meta = ELEMENT_META[element] || { symbol: '✅', color: '#FBBF24', label: 'Mastered' };
  const pool = QUOTES[element] || QUOTES.default;
  const q = pool[Math.floor(Math.random() * pool.length)];
  const skillObj = getAllSkills().find(s => s.id === skillId);
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
document.getElementById('motivation-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeMotivation();
});

// ═══════════════════════════════════════════════════════════════════
// VIEW: PHASES (default — skill cards by section)
// ═══════════════════════════════════════════════════════════════════

function renderSection(sec, isExpanded) {
  const visSkills = sec.skills.filter(skillVisible);
  if (visSkills.length === 0) return null;

  const done = sec.skills.filter(s => checked[s.id]).length;
  const total = sec.skills.length;
  const pct = Math.round((done / total) * 100);
  const isComplete = done === total;
  const sectionIcon = SECTION_ICONS[sec.id] || 'school';

  const phaseGroup = document.createElement('div');
  phaseGroup.className = 'flex flex-col gap-4';

  const cardsHTML = visSkills.map(function (skill) {
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

    return `<div class="card card-hover flex flex-col gap-4 relative overflow-hidden ${isDone ? 'opacity-60' : ''} ${activeBorderClass} ${isCompactClass} skill-card" data-skill-id="${skill.id}">
      <div class="absolute top-4 right-4 skill-status" onclick="toggleSkill('${skill.id}')">
        <span class="material-symbols-outlined cursor-pointer hover:text-secondary ${isDone ? 'text-secondary' : 'text-outline-variant'}" style="font-variation-settings: 'FILL' ${isDone ? 1 : 0};">${statusIcon}</span>
      </div>
      <span class="font-label-caps text-label-caps text-on-surface-variant uppercase">${tagLabel}</span>
      <h4 class="font-headline-md text-headline-md text-primary cursor-pointer pr-8 skill-card-name ${isDone ? 'line-through text-on-surface-variant' : ''}" onclick="toggleSkill('${skill.id}')">${skill.name.split('—')[0].trim()}</h4>
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
    <div class="w-full progress-bar-bg relative -top-4">
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
      <div class="flex items-center flex-wrap gap-4 mb-4">
        <img alt="Gojo Mascot" class="w-16 h-16 rounded-full object-cover grayscale" src="./Gojo.png"/>
        <div>
          <h1 class="font-headline-lg text-headline-lg md:font-display md:text-display text-primary">${dayStr}</h1>
          <p class="font-body-md text-body-md text-on-surface-variant mt-2">Rank: ${rank.name.toUpperCase()} • Global Progress</p>
        </div>
        ${day === 0 ? `<button class="ml-auto bg-primary text-white hover:opacity-90 px-6 py-3 font-label-caps tracking-widest text-sm uppercase transition-opacity" onclick="startJourney()">BEGIN LOCK-IN</button>` : ''}
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
          <div class="w-full progress-bar-bg relative">
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
          <input class="search-input pl-10" type="text" placeholder="Search curriculum..." id="search-input" />
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
  const { done: totalDone, total: totalAll } = getGlobalStats();
  const firstIncomplete = findFirstIncompleteSection();

  let html = `
    <div class="col-span-12 md:col-start-3 md:col-span-8 mb-16 text-center">
      <h1 class="font-display text-display text-primary mb-4 tracking-tighter text-3xl md:text-5xl">The Discipline of Intelligence</h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">A rigorous, 65-day architectural blueprint for mastering advanced AI systems. Proceed with focus.</p>
    </div>
    
    <div class="col-span-12 md:col-start-2 md:col-span-10 relative">
      <!-- Central Line -->
      <div class="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-secondary to-transparent md:-translate-x-1/2"></div>
  `;

  SECTIONS.forEach((sec, i) => {
    const done = sec.skills.filter(s => checked[s.id]).length;
    const total = sec.skills.length;
    const pct = Math.round((done / total) * 100);
    const isCurrent = sec.id === firstIncomplete;
    const isComplete = done === total;

    const alignmentClass = i % 2 === 0
      ? 'md:flex-row'
      : 'md:flex-row-reverse';

    const textAlignmentClass = i % 2 === 0
      ? 'md:text-right md:justify-end'
      : 'md:text-left md:justify-start';

    const cardClass = isCurrent
      ? 'border-l-4 border-l-secondary bg-white'
      : isComplete
        ? 'opacity-60 bg-surface-container-low'
        : 'bg-white';

    const cardHtml = `
      <div class="bg-white p-8 border border-outline-variant w-full flex flex-col gap-4 ${cardClass}">
        <span class="font-label-caps text-label-caps font-bold ${isCurrent ? 'text-secondary' : 'text-on-surface-variant'} tracking-widest uppercase">
          ${sec.phase || 'MODULE'} ${isCurrent ? '• CURRENT' : ''}
        </span>
        <h4 class="font-headline-md text-headline-md font-semibold text-primary tracking-tight ${isComplete ? 'line-through text-on-surface-variant' : ''}">
          ${sec.title}
        </h4>
        <p class="font-body-md text-body-md text-on-surface-variant">
          ${done}/${total} skills conquered (${pct}%)
        </p>
        <div class="w-full mt-2">
          <div class="w-full progress-bar-bg relative">
            <div class="absolute top-0 left-0 h-full progress-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>
      </div>
    `;

    html += `
      <div class="relative flex flex-col ${alignmentClass} items-start mb-16 group">
        <!-- Left Side Column (or right side if reversed) -->
        <div class="md:w-1/2 w-full pl-12 md:pl-0 flex ${i % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}">
          ${cardHtml}
        </div>
        
        <!-- Node in the middle -->
        <div class="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-surface border-2 ${isCurrent ? 'border-secondary' : isComplete ? 'border-secondary' : 'border-outline-variant'} md:-translate-x-1/2 flex items-center justify-center z-10 transition-colors">
          <div class="w-2 h-2 rounded-full ${isCurrent || isComplete ? 'bg-secondary' : 'bg-transparent'}"></div>
        </div>
        
        <!-- Empty Space on other side -->
        <div class="md:w-1/2 hidden md:block"></div>
      </div>
    `;
  });

  html += `</div>`;
  main.innerHTML = html;
}

function getTotalHoursLogged() {
  let total = 0;
  for (const day in journalEntries) {
    const hr = parseFloat(journalEntries[day].hours);
    if (!isNaN(hr)) total += hr;
  }
  return total;
}

function renderStatsView() {
  const main = document.getElementById('main');
  const { total, done, pct } = getGlobalStats();
  const rank = getRank(pct);
  const nextRank = getNextRank(pct);
  const elapsed = getDetailedElapsedTime();
  const daysElapsed = elapsed ? (elapsed.totalMs / (1000 * 60 * 60 * 24)) : 0;
  const totalHours = getTotalHoursLogged();

  let paceText = "Not enough progress data yet.";
  let projectionText = "Check off your first skills and log study hours in your Journal to calculate speed projections.";

  if (done > 0 && elapsed) {
    // Floor at 1 day so a skill checked minutes into Day 1 doesn't
    // extrapolate into an absurd "8 skills/day" pace / short ETA.
    const effectiveDays = Math.max(daysElapsed, 1);

    const skillsPerDay = done / effectiveDays;
    const hoursPerDay = totalHours / effectiveDays;
    const remainingSkills = total - done;
    const estimatedDaysRemaining = remainingSkills / skillsPerDay;

    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + estimatedDaysRemaining);

    paceText = `Completing <strong>${skillsPerDay.toFixed(2)} skills/day</strong>, studying <strong>${hoursPerDay.toFixed(1)} hrs/day</strong>.`;
    if (daysElapsed < 1) {
      paceText += ` <span class="text-on-surface-variant">(early estimate — settles after Day 1)</span>`;
    }

    if (totalHours > 0) {
      const hoursPerSkill = totalHours / done;
      const estimatedHoursRemaining = remainingSkills * hoursPerSkill;
      projectionText = `To conquer the remaining <strong>${remainingSkills} skills</strong>, you need approximately <strong>${estimatedHoursRemaining.toFixed(1)} hours</strong> of study, which will take about <strong>${estimatedDaysRemaining.toFixed(1)} days</strong> at your current pace.<br/><span class="text-secondary mt-2 block font-bold">Projected graduation date: ${completionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>`;
    } else {
      projectionText = `At your current pace, the remaining <strong>${remainingSkills} skills</strong> will take about <strong>${estimatedDaysRemaining.toFixed(1)} days</strong>.<br/><span class="text-secondary mt-2 block font-bold">Projected graduation date: ${completionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span><br/>Log hours in your Journal to see a time-based estimate too.`;
    }
  }

  let html = `<div class="col-span-1 md:col-span-12 flex flex-col gap-6 md:gap-8">
    <div>
      <h1 class="font-display text-display text-primary border-b border-outline-variant pb-4">Statistics Dashboard</h1>
    </div>
    
    <!-- Live Journey Timer & Projections -->
    <div class="card bg-surface-bright border border-outline-variant p-6 md:p-8 flex flex-col gap-6">
      <h3 class="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-2 uppercase tracking-widest text-xs">JOURNEY TIMER & PROJECTIONS</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex flex-col gap-1">
          <span class="font-caption text-xs text-on-surface-variant">TOTAL ACTIVE TIME</span>
          <span class="font-mono text-lg md:text-xl text-primary font-bold" id="stats-live-timer">Loading...</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-caption text-xs text-on-surface-variant">TOTAL HOURS STUDIED</span>
          <span class="font-mono text-lg md:text-xl text-secondary font-bold">${totalHours.toFixed(1)} hours</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="font-caption text-xs text-on-surface-variant">CURRENT STUDY PACE</span>
          <span class="font-body-md text-sm text-primary">${paceText}</span>
        </div>
      </div>
      <div class="p-4 bg-surface-container-low border border-outline-variant font-body-md text-sm text-primary">
        ${projectionText}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
      <!-- Big Numbers -->
      <div class="bg-surface-bright border border-outline-variant p-6 md:p-8 flex flex-col gap-8">
        <div>
          <h4 class="font-label-caps text-label-caps text-on-surface-variant mb-4 tracking-widest border-b border-outline-variant pb-2">OVERVIEW</h4>
          <div class="flex items-end gap-2">
            <span class="font-display text-display text-primary">${done}</span>
            <span class="font-body-md text-body-md text-on-surface-variant pb-2">/ ${total}</span>
          </div>
          <span class="font-caption text-caption text-on-surface-variant">Skills Acquired</span>
        </div>
        <div class="w-full progress-bar-bg relative">
          <div class="absolute top-0 left-0 h-full progress-bar-fill" style="width:${pct}%"></div>
        </div>
        <div class="flex flex-col gap-4 mt-4 text-sm font-body-md">
          <div class="flex justify-between items-center border-b border-outline-variant pb-2">
            <span class="text-on-surface-variant">Total Progress</span>
            <span class="text-primary font-bold">${pct}%</span>
          </div>
          <div class="flex justify-between items-center border-b border-outline-variant pb-2">
            <span class="text-on-surface-variant">Days Elapsed</span>
            <span class="text-primary font-bold">${Math.floor(daysElapsed)}</span>
          </div>
          <div class="flex justify-between items-center pb-2">
            <span class="text-on-surface-variant">Average Speed</span>
            <span class="text-primary font-bold">${done > 0 ? (done / Math.max(daysElapsed, 1)).toFixed(1) : '-'} skills / day</span>
          </div>
        </div>
      </div>
      
      <!-- Ranks -->
      <div class="card flex flex-col gap-4 p-6 md:p-8 bg-white border border-outline-variant">
        <h4 class="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-2">RANK LADDER</h4>
        <ul class="flex flex-col gap-3 font-body-md text-body-md">`;

  RANKS.forEach(r => {
    const isCurrent = r.name === rank.name;
    const isAchieved = pct >= r.min;
    html += `<li class="flex items-center gap-3 ${isAchieved ? 'text-primary' : 'text-outline-variant'}">
      <span class="material-symbols-outlined ${isCurrent ? 'text-secondary' : ''}" style="font-variation-settings: 'FILL' ${isAchieved ? 1 : 0};">${r.icon}</span>
      <span class="${isCurrent ? 'font-bold' : ''}">${r.name} (${r.min}%)</span>
    </li>`;
  });

  html += `</ul></div></div></div>`;
  main.innerHTML = html;
}

function renderTimerView() {
  const main = document.getElementById('main');
  const { done, total } = getGlobalStats();

  const start = getStartDate();
  let html = `<div class="col-span-1 md:col-span-12 flex flex-col gap-8">
    <h1 class="font-display text-display text-primary border-b border-outline-variant pb-4">Smart Timer</h1>`;

  if (!start) {
    html += `<div class="p-16 text-center text-on-surface-variant flex flex-col items-center gap-6">
      <span class="material-symbols-outlined text-6xl text-outline-variant">timer</span>
      <p class="font-body-lg text-xl">Your 65-day journey has not started yet.</p>
      <button class="bg-primary text-white hover:opacity-90 px-8 py-4 font-label-caps tracking-widest text-sm uppercase transition-opacity mt-4" onclick="startJourney()">BEGIN LOCK-IN</button>
    </div></div>`;
    main.innerHTML = html;
    return;
  }

  const msElapsed = new Date() - start;
  const daysElapsed = msElapsed / (1000 * 60 * 60 * 24);
  const targetDays = 65;
  const paceTarget = total / targetDays; // ~2.13 skills/day

  const expectedSkillsRaw = daysElapsed * paceTarget;
  const expectedSkills = Math.min(Math.floor(expectedSkillsRaw), total);
  const currentPace = daysElapsed > 0.1 ? (done / daysElapsed) : 0;

  let projectedDays = 0;
  if (currentPace > 0) projectedDays = total / currentPace;

  const diff = done - expectedSkills;

  let feedback = '';
  let feedbackColor = '';

  if (done === 0 && daysElapsed < 1) {
    feedback = `<strong>The clock is ticking.</strong> You just began your 65-day lock-in. To stay on track, you need to conquer at least ${Math.ceil(paceTarget)} skills today. Time to get to work.`;
    feedbackColor = 'text-primary';
  } else if (diff > 0) {
    if (daysElapsed < 1) {
      feedback = `<strong>Great start!</strong> You've already conquered ${done} skill(s) on Day 1. The baseline is ${Math.ceil(paceTarget)} skills per day. Keep building this early momentum.`;
    } else {
      const daysEarly = Math.max(0, targetDays - projectedDays);
      feedback = `<strong>Ahead of schedule!</strong> You are crushing it. You've conquered ${diff} more skill(s) than expected. If you maintain this pace, you will finish <strong>${daysEarly.toFixed(1)} days early</strong>. Outstanding discipline.`;
    }
    feedbackColor = 'text-secondary';
  } else if (diff < 0) {
    feedback = `<strong>Behind schedule.</strong> You are short by ${Math.abs(diff)} skill(s). The lock-in requires relentless discipline. You need to push harder today to catch up to the baseline. Don't fall further behind.`;
    feedbackColor = 'text-error';
  } else {
    feedback = `<strong>Perfectly on track.</strong> You are exactly where you need to be. Maintain this consistency.`;
    feedbackColor = 'text-primary';
  }

  const expectedPct = Math.min(100, Math.round((expectedSkills / total) * 100));
  const actualPct = Math.min(100, Math.round((done / total) * 100));

  html += `
    <div class="card flex flex-col gap-6 p-8 bg-surface-bright border border-outline-variant">
      <p class="font-body-lg ${feedbackColor} text-lg md:text-xl leading-relaxed">${feedback}</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
      <!-- Expected Mastery -->
      <div class="card flex flex-col gap-4 p-8 border border-outline-variant relative overflow-hidden bg-surface-container-low">
        <h3 class="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase mb-2">EXPECTED MASTERY</h3>
        <span class="font-display text-5xl text-on-surface-variant">${expectedSkills} <span class="text-2xl text-outline-variant">/ ${total}</span></span>
        <span class="font-caption text-sm text-on-surface-variant">Skills you should have by Day ${Math.max(1, Math.floor(daysElapsed))}</span>
        <div class="w-full h-[4px] bg-surface-container relative mt-4">
          <div class="absolute top-0 left-0 h-full bg-outline-variant transition-all duration-1000" style="width:${expectedPct}%"></div>
        </div>
      </div>
      
      <!-- Actual Mastery -->
      <div class="card flex flex-col gap-4 p-8 border ${diff >= 0 ? 'border-secondary' : 'border-error'} relative overflow-hidden bg-white">
        <h3 class="font-label-caps text-label-caps ${diff >= 0 ? 'text-secondary' : 'text-error'} tracking-widest uppercase mb-2">ACTUAL MASTERY</h3>
        <span class="font-display text-5xl ${diff >= 0 ? 'text-primary' : 'text-error'}">${done} <span class="text-2xl text-on-surface-variant opacity-60">/ ${total}</span></span>
        <span class="font-caption text-sm text-on-surface-variant">Skills you actually have right now</span>
        <div class="w-full h-[4px] bg-surface-container relative mt-4">
          <div class="absolute top-0 left-0 h-full ${diff >= 0 ? 'bg-secondary' : 'bg-error'} transition-all duration-1000" style="width:${actualPct}%"></div>
        </div>
      </div>
    </div>
  </div>`;

  main.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════════
// VIEW: BETA (UpNext-style Stubs dashboard)
// ═══════════════════════════════════════════════════════════════════

const SPINE_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#2c3e50', '#34495e', '#1B4332', '#2D6A4F',
  '#7B2D26', '#6B3FA0', '#3D405B', '#264653',
  '#2B2D42', '#4A4E69', '#6D6875', '#1D3557',
  '#3A0CA3', '#4361EE'
];

function generateBarcode() {
  const bars = [];
  for (let i = 0; i < 28; i++) {
    const h = 12 + Math.floor(Math.random() * 24);
    const w = Math.random() > 0.6 ? 3 : 2;
    bars.push(`<span class="bar" style="height:${h}px;width:${w}px"></span>`);
  }
  return bars.join('');
}

function renderBetaView() {
  const main = document.getElementById('main');
  const { done, total } = getGlobalStats();
  const start = getStartDate();
  const elapsed = getDetailedElapsedTime();

  // Find current section (first incomplete)
  let currentSection = null;
  let currentSkill = null;
  for (const sec of SECTIONS) {
    const incomplete = sec.skills.find(s => !checked[s.id]);
    if (incomplete) {
      currentSection = sec;
      currentSkill = incomplete;
      break;
    }
  }

  // Completed sections
  const completedSections = SECTIONS.filter(sec =>
    sec.skills.every(s => checked[s.id])
  );

  // Top conquests: sections sorted by completion % (descending), top 4
  const sectionStats = SECTIONS.map(sec => {
    const d = sec.skills.filter(s => checked[s.id]).length;
    const t = sec.skills.length;
    return { sec, done: d, total: t, pct: t > 0 ? Math.round((d / t) * 100) : 0 };
  }).filter(s => s.done > 0).sort((a, b) => b.pct - a.pct).slice(0, 4);

  // Day info
  const dayNum = elapsed ? elapsed.days + 1 : 0;
  const timeStr = elapsed ? `${elapsed.days}d ${elapsed.hours}h ${elapsed.mins}m` : '—';
  const ticketNumber = String(dayNum).padStart(6, '0');

  let html = `<div class="col-span-1 md:col-span-12 flex flex-col gap-12">
    <div class="flex items-center justify-between">
      <h1 class="font-display text-display text-primary border-b border-outline-variant pb-4 flex-1">Stubs</h1>
      <span class="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase text-xs">BETA</span>
    </div>`;

  // ──── TICKET STUB ────
  if (currentSection && start) {
    const secDone = currentSection.skills.filter(s => checked[s.id]).length;
    const secTotal = currentSection.skills.length;
    const skillName = currentSkill.name.split('—')[0].trim();
    const sectionName = currentSection.title.split('—')[0].trim();

    html += `
    <div class="ticket-stub">
      <div class="ticket-stub-left">
        <span class="ticket-brand">🔒 ZEN MASTERY</span>
        <div class="ticket-title">${sectionName}</div>
        <div class="ticket-meta">
          Up Next: ${skillName}<br/>
          Day ${dayNum} · ${timeStr} elapsed · ${secDone}/${secTotal} in section
        </div>
      </div>
      <div class="ticket-stub-right">
        <span class="ticket-admit">ADMIT ONE</span>
        <div>
          <div class="ticket-barcode">${generateBarcode()}</div>
          <span class="ticket-number">NO. ${ticketNumber}</span>
        </div>
      </div>
    </div>`;
  } else if (!start) {
    html += `
    <div class="ticket-stub" style="opacity:0.5">
      <div class="ticket-stub-left">
        <span class="ticket-brand">🔒 ZEN MASTERY</span>
        <div class="ticket-title">Not Started</div>
        <div class="ticket-meta">Begin your lock-in to receive your first ticket.</div>
      </div>
      <div class="ticket-stub-right">
        <span class="ticket-admit">ADMIT ONE</span>
        <div>
          <div class="ticket-barcode">${generateBarcode()}</div>
          <span class="ticket-number">NO. 000000</span>
        </div>
      </div>
    </div>`;
  } else {
    // All sections complete
    html += `
    <div class="ticket-stub">
      <div class="ticket-stub-left">
        <span class="ticket-brand">🔒 ZEN MASTERY</span>
        <div class="ticket-title">ALL CONQUERED</div>
        <div class="ticket-meta">Every single skill has been mastered. You are an Elite Practitioner.</div>
      </div>
      <div class="ticket-stub-right">
        <span class="ticket-admit">GRADUATED</span>
        <div>
          <div class="ticket-barcode">${generateBarcode()}</div>
          <span class="ticket-number">NO. ${ticketNumber}</span>
        </div>
      </div>
    </div>`;
  }

  // ──── KNOWLEDGE SHELF ────
  html += `
    <div>
      <h2 class="font-headline-md text-headline-md text-primary mb-2">Shelf</h2>
      <p class="font-body-md text-on-surface-variant mb-6">${completedSections.length} finished section${completedSections.length !== 1 ? 's' : ''}</p>
      <div class="book-shelf-container">
        <div class="book-shelf">`;

  if (completedSections.length === 0) {
    // Show placeholder empty spines
    for (let i = 0; i < 6; i++) {
      const h = 160 + Math.floor(Math.random() * 60);
      html += `<div class="book-spine book-spine-empty" style="height:${h}px">· · ·</div>`;
    }
  } else {
    completedSections.forEach((sec, i) => {
      const color = SPINE_COLORS[i % SPINE_COLORS.length];
      const h = 180 + Math.floor(Math.random() * 50);
      const label = sec.title.split('—')[0].split('·')[0].trim();
      html += `<div class="book-spine" style="background:${color};height:${h}px" title="${sec.title}">${label}</div>`;
    });
  }

  html += `
        </div>
        <div class="book-shelf-line"></div>
      </div>
    </div>`;

  // ──── TOP CONQUESTS ────
  if (sectionStats.length > 0) {
    html += `
    <div>
      <h2 class="font-headline-md text-headline-md text-primary mb-2">Top ${Math.min(sectionStats.length, 4)}</h2>
      <p class="font-body-md text-on-surface-variant mb-6">Your strongest areas</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;

    sectionStats.forEach((s, i) => {
      const icon = SECTION_ICONS[s.sec.id] || 'school';
      const label = s.sec.title.split('—')[0].trim();
      html += `
        <div class="conquest-card">
          <span class="material-symbols-outlined text-3xl ${s.pct === 100 ? 'text-secondary' : 'text-on-surface-variant'}" style="font-variation-settings: 'FILL' ${s.pct === 100 ? 1 : 0}">${icon}</span>
          <div class="flex-1">
            <div class="font-body-md text-primary font-medium">${label}</div>
            <div class="font-caption text-on-surface-variant text-sm">${s.done}/${s.total} conquered · ${s.pct}%</div>
          </div>
          ${s.pct === 100 ? '<span class="material-symbols-outlined text-secondary" style="font-variation-settings:\'FILL\' 1">verified</span>' : ''}
        </div>`;
    });

    html += `</div></div>`;
  }

  html += `</div>`;
  main.innerHTML = html;
}

const FLASHCARDS = [
  {
    id: "fc_01",
    category: "Math / Stats",
    question: "What is the Central Limit Theorem?",
    answer: "The Central Limit Theorem states that the distribution of sample means approximates a normal distribution as the sample size becomes large (typically n >= 30), regardless of the population's distribution shape."
  },
  {
    id: "fc_02",
    category: "Deep Learning",
    question: "Why is the Softmax function used in multi-class classification?",
    answer: "Softmax normalizes raw model outputs (logits) into a probability distribution over classes, ensuring each value is between 0 and 1, and the sum of all values is exactly 1."
  },
  {
    id: "fc_03",
    category: "SQL",
    question: "What is the difference between WHERE and HAVING in SQL?",
    answer: "WHERE filters rows before aggregations are computed. HAVING filters group results after the GROUP BY clause has been applied."
  },
  {
    id: "fc_04",
    category: "Python / NumPy",
    question: "Explain NumPy Broadcasting.",
    answer: "Broadcasting allows NumPy to perform arithmetic operations on arrays of different shapes by conceptually expanding the smaller array to match the shape of the larger array."
  },
  {
    id: "fc_05",
    category: "Deep Learning",
    question: "What is the purpose of Layer Normalization in Transformers?",
    answer: "Layer Normalization normalizes the inputs across the features of a single training example, stabilizing network training and reducing dependencies on batch sizes (crucial for NLP tasks)."
  },
  {
    id: "fc_06",
    category: "Math / Stats",
    question: "What is the difference between L1 and L2 regularization?",
    answer: "L1 regularization (Lasso) adds the absolute values of coefficients to the loss, driving some weights to exactly 0 (sparsity/feature selection). L2 regularization (Ridge) adds the squared values, penalizing large weights."
  }
];

let activeResourceTab = 'flashcards'; // 'flashcards' or 'neuron'
let currentFlashcardIndex = 0;
let flashcardFlipped = false;
let masteredCards = {};

try {
  const mc = localStorage.getItem('lockin_mastered_cards');
  if (mc) masteredCards = JSON.parse(mc);
} catch (e) { masteredCards = {}; }

function renderResourcesView() {
  const main = document.getElementById('main');

  const tabClass = (tab) => activeResourceTab === tab
    ? 'border-b-2 border-secondary text-primary font-medium'
    : 'text-on-surface-variant hover:text-primary';

  let subViewHtml = '';

  if (activeResourceTab === 'flashcards') {
    const card = FLASHCARDS[currentFlashcardIndex];
    const total = FLASHCARDS.length;
    const masteredCount = Object.keys(masteredCards).length;
    const isMastered = masteredCards[card.id];

    subViewHtml = `
      <div class="col-span-12 flex flex-col items-center gap-8 max-w-[600px] mx-auto w-full">
        <!-- Stats -->
        <div class="w-full flex justify-between items-center text-sm font-body-md text-on-surface-variant">
          <span>Card ${currentFlashcardIndex + 1} of ${total}</span>
          <span>Mastered: ${masteredCount} / ${total}</span>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full h-[2px] bg-surface-container relative mb-4">
          <div class="absolute top-0 left-0 h-full bg-secondary transition-all duration-300" style="width: ${(masteredCount / total) * 100}%;"></div>
        </div>

        <!-- Flashcard container with flip style -->
        <div id="flashcard-box" class="w-full min-h-[300px] border border-outline-variant bg-white p-8 flex flex-col justify-between cursor-pointer card-hover relative select-none" onclick="flipFlashcard()">
          <div class="absolute top-4 right-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest text-xs">
            ${card.category}
          </div>
          
          <div class="flex-grow flex items-center justify-center text-center p-4">
            <h3 class="font-headline-md text-headline-md text-primary leading-relaxed text-lg md:text-xl">
              ${flashcardFlipped ? card.answer : card.question}
            </h3>
          </div>
          
          <div class="text-center font-caption text-caption text-on-surface-variant uppercase tracking-widest border-t border-outline-variant/30 pt-4 text-xs">
            ${flashcardFlipped ? 'Click to show question' : 'Click to reveal answer'}
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-4 w-full">
          <button class="flex-1 py-3 border border-outline font-label-caps text-label-caps uppercase hover:bg-surface-container-low text-xs" onclick="prevFlashcard()">Previous</button>
          <button class="flex-1 py-3 bg-primary text-white font-label-caps text-label-caps uppercase hover:opacity-85 text-xs" onclick="toggleMasterCard('${card.id}')">
            ${isMastered ? 'Remove Mastered' : 'Mark Mastered'}
          </button>
          <button class="flex-1 py-3 border border-outline font-label-caps text-label-caps uppercase hover:bg-surface-container-low text-xs" onclick="nextFlashcard()">Next</button>
        </div>
      </div>
    `;
  } else {
    // Neuron Playground
    const x1 = parseFloat(document.getElementById('neuron-x1')?.value ?? 1.0);
    const x2 = parseFloat(document.getElementById('neuron-x2')?.value ?? -0.5);
    const w1 = parseFloat(document.getElementById('neuron-w1')?.value ?? 0.8);
    const w2 = parseFloat(document.getElementById('neuron-w2')?.value ?? 1.2);
    const b = parseFloat(document.getElementById('neuron-b')?.value ?? -0.2);
    const act = document.getElementById('neuron-act')?.value ?? 'relu';

    // Calculate weighted sum
    const z = (x1 * w1) + (x2 * w2) + b;
    let y = 0;
    if (act === 'linear') y = z;
    else if (act === 'relu') y = Math.max(0, z);
    else if (act === 'sigmoid') y = 1 / (1 + Math.exp(-z));
    else if (act === 'tanh') y = Math.tanh(z);

    subViewHtml = `
      <div class="col-span-12 lg:col-span-6 flex flex-col gap-6">
        <h3 class="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-2 text-lg">Neuron Parameters</h3>
        
        <div class="flex flex-col gap-4">
          <div>
            <div class="flex justify-between font-caption text-on-surface-variant mb-1 text-xs">
              <span>Input 1 (x₁)</span>
              <span class="font-mono">${x1.toFixed(1)}</span>
            </div>
            <input type="range" id="neuron-x1" min="-2" max="2" step="0.1" value="${x1}" class="w-full accent-secondary" oninput="updateNeuronSim()"/>
          </div>
          <div>
            <div class="flex justify-between font-caption text-on-surface-variant mb-1 text-xs">
              <span>Input 2 (x₂)</span>
              <span class="font-mono">${x2.toFixed(1)}</span>
            </div>
            <input type="range" id="neuron-x2" min="-2" max="2" step="0.1" value="${x2}" class="w-full accent-secondary" oninput="updateNeuronSim()"/>
          </div>
          <div>
            <div class="flex justify-between font-caption text-on-surface-variant mb-1 text-xs">
              <span>Weight 1 (w₁)</span>
              <span class="font-mono">${w1.toFixed(1)}</span>
            </div>
            <input type="range" id="neuron-w1" min="-2" max="2" step="0.1" value="${w1}" class="w-full accent-secondary" oninput="updateNeuronSim()"/>
          </div>
          <div>
            <div class="flex justify-between font-caption text-on-surface-variant mb-1 text-xs">
              <span>Weight 2 (w₂)</span>
              <span class="font-mono">${w2.toFixed(1)}</span>
            </div>
            <input type="range" id="neuron-w2" min="-2" max="2" step="0.1" value="${w2}" class="w-full accent-secondary" oninput="updateNeuronSim()"/>
          </div>
          <div>
            <div class="flex justify-between font-caption text-on-surface-variant mb-1 text-xs">
              <span>Bias (b)</span>
              <span class="font-mono">${b.toFixed(1)}</span>
            </div>
            <input type="range" id="neuron-b" min="-2" max="2" step="0.1" value="${b}" class="w-full accent-secondary" oninput="updateNeuronSim()"/>
          </div>
          <div>
            <label class="font-caption text-on-surface-variant block mb-1 text-xs">Activation Function</label>
            <select id="neuron-act" class="w-full border border-outline-variant p-2 outline-none bg-white font-body-md text-primary focus:border-secondary focus:ring-0 rounded-none text-sm" onchange="updateNeuronSim()">
              <option value="linear" ${act === 'linear' ? 'selected' : ''}>Linear</option>
              <option value="relu" ${act === 'relu' ? 'selected' : ''}>ReLU (Rectified Linear)</option>
              <option value="sigmoid" ${act === 'sigmoid' ? 'selected' : ''}>Sigmoid</option>
              <option value="tanh" ${act === 'tanh' ? 'selected' : ''}>Tanh</option>
            </select>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-6 flex flex-col gap-6 bg-surface-bright border border-outline-variant p-6 md:p-8">
        <h3 class="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-2 text-lg">Mathematical Outputs</h3>
        
        <div class="flex flex-col gap-6 font-mono text-xs">
          <div>
            <div class="font-label-caps text-label-caps text-on-surface-variant mb-2 text-xs">WEIGHTED SUM (z)</div>
            <div class="p-3 bg-white border border-outline-variant">
              <div>z = (w₁ · x₁) + (w₂ · x₂) + b</div>
              <div class="text-secondary mt-1">z = (${w1.toFixed(1)} · ${x1.toFixed(1)}) + (${w2.toFixed(1)} · ${x2.toFixed(1)}) + (${b.toFixed(1)})</div>
              <div class="font-bold text-primary mt-1">z = ${z.toFixed(4)}</div>
            </div>
          </div>

          <div>
            <div class="font-label-caps text-label-caps text-on-surface-variant mb-2 text-xs">ACTIVATION OUT (y)</div>
            <div class="p-3 bg-white border border-outline-variant">
              <div>y = f(z)</div>
              <div class="text-secondary mt-1">y = ${act.toUpperCase()}(${z.toFixed(4)})</div>
              <div class="font-bold text-primary mt-1 text-sm">y = ${y.toFixed(4)}</div>
            </div>
          </div>

          <div class="flex justify-between items-center h-24 border-t border-outline-variant/30 pt-6 mt-4">
            <div class="flex flex-col text-[10px] text-center gap-1">
              <span class="p-1 bg-white border border-outline-variant">x₁: ${x1.toFixed(1)}</span>
              <span class="p-1 bg-white border border-outline-variant">x₂: ${x2.toFixed(1)}</span>
            </div>
            
            <div class="w-8 h-1px bg-outline-variant relative">
              <div class="absolute -top-3 left-0 text-[8px] text-secondary">w₁</div>
            </div>
            
            <div class="w-12 h-12 rounded-full border border-primary flex items-center justify-center bg-white font-bold text-[10px] flex-col">
              <span>Σ</span>
              <span class="text-[8px] text-secondary">${z.toFixed(1)}</span>
            </div>
            
            <div class="w-8 h-1px bg-outline-variant relative">
              <div class="absolute -top-3 left-0 text-[8px] text-secondary">f</div>
            </div>
            
            <div class="flex flex-col text-[10px] text-center">
              <span class="p-1.5 bg-secondary text-white font-bold">y: ${y.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  main.innerHTML = `
    <!-- Tab Controls -->
    <div class="col-span-12 flex justify-center border-b border-outline-variant mb-8 md:mb-12">
      <div class="flex gap-4 md:gap-8">
        <button class="py-3 px-2 font-label-caps text-label-caps uppercase tracking-wider text-xs md:text-sm ${tabClass('flashcards')}" onclick="switchResourceTab('flashcards')">AI Quiz & Flashcards</button>
        <button class="py-3 px-2 font-label-caps text-label-caps uppercase tracking-wider text-xs md:text-sm ${tabClass('neuron')}" onclick="switchResourceTab('neuron')">Neuron Playground</button>
      </div>
    </div>

    <!-- Active view contents -->
    ${subViewHtml}
  `;
}

function switchResourceTab(tab) {
  activeResourceTab = tab;
  renderResourcesView();
}

function flipFlashcard() {
  flashcardFlipped = !flashcardFlipped;
  renderResourcesView();
}

function prevFlashcard() {
  flashcardFlipped = false;
  currentFlashcardIndex = (currentFlashcardIndex - 1 + FLASHCARDS.length) % FLASHCARDS.length;
  renderResourcesView();
}

function nextFlashcard() {
  flashcardFlipped = false;
  currentFlashcardIndex = (currentFlashcardIndex + 1) % FLASHCARDS.length;
  renderResourcesView();
}

function toggleMasterCard(id) {
  if (masteredCards[id]) {
    delete masteredCards[id];
  } else {
    masteredCards[id] = true;
  }
  try {
    localStorage.setItem('lockin_mastered_cards', JSON.stringify(masteredCards));
  } catch (e) { console.warn('Silenced error:', e); }
  renderResourcesView();
}

function updateNeuronSim() {
  renderResourcesView();
}

window.switchResourceTab = switchResourceTab;
window.flipFlashcard = flipFlashcard;
window.prevFlashcard = prevFlashcard;
window.nextFlashcard = nextFlashcard;
window.toggleMasterCard = toggleMasterCard;
window.updateNeuronSim = updateNeuronSim;

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderJournalView() {
  const main = document.getElementById('main');
  const dayCount = getDayCount();

  if (dayCount === 0) {
    main.innerHTML = `
      <div class="col-span-12 flex flex-col items-center justify-center text-center p-12 bg-white border border-outline-variant min-h-[400px]">
        <span class="material-symbols-outlined text-6xl text-on-surface-variant mb-4">edit_note</span>
        <h2 class="font-display text-2xl font-light text-primary mb-2">Journal Locked</h2>
        <p class="font-body-md text-on-surface-variant max-w-md">Your journal will unlock automatically once you check off your first skill in the <strong class="text-primary">Phases</strong> tab and start your 65-day journey.</p>
      </div>
    `;
    return;
  }

  if (journalSelectedDay > dayCount || journalSelectedDay < 1) {
    journalSelectedDay = dayCount;
  }

  const currentEntry = journalEntries[journalSelectedDay] || {
    title: '',
    mood: 'neutral',
    hours: '',
    text: '',
    breakthroughs: ['', '']
  };

  if (!currentEntry.breakthroughs) {
    currentEntry.breakthroughs = ['', ''];
  }

  activeJournalMood = currentEntry.mood || 'neutral';

  let sidebarDaysHtml = '';
  for (let d = dayCount; d >= 1; d--) {
    const isSel = d === journalSelectedDay;
    const entry = journalEntries[d];
    const hasLog = entry && (entry.title || entry.text);

    sidebarDaysHtml += `
      <div class="p-3 md:p-4 border border-outline-variant md:border-none md:border-b cursor-pointer transition-colors flex-shrink-0 ${isSel ? 'bg-primary text-white md:bg-white md:text-primary md:border-l-4 md:border-l-secondary font-medium' : 'bg-surface-container-low hover:bg-surface-container-high'}" onclick="selectJournalDay(${d})">
        <div class="flex md:justify-between items-center gap-2">
          <span class="font-body-md text-sm md:text-md">Day ${String(d).padStart(2, '0')}</span>
          ${hasLog ? `<span class="material-symbols-outlined ${isSel ? 'text-white md:text-secondary' : 'text-secondary'} text-sm">edit</span>` : ''}
        </div>
        <div class="font-caption text-caption ${isSel ? 'text-white/80 md:text-on-surface-variant' : 'text-on-surface-variant'}">${d === dayCount ? 'Today' : d === dayCount - 1 ? 'Yesterday' : ''}</div>
      </div>
    `;
  }

  const prompts = [
    "What was your most challenging concept today, and how did you approach deconstructing it?",
    "How did you apply today's learning to a real-world problem or scenario?",
    "What is one thing you understand today that you didn't understand yesterday?",
    "Did you encounter any bugs or errors today? How did you debug them?",
    "What was the most interesting resource or article you read today?",
    "How are you feeling about your progress so far? What is keeping you motivated?",
    "Summarize today's learning in a single sentence."
  ];
  const promptText = prompts[journalSelectedDay % prompts.length];

  main.innerHTML = `
    <div class="col-span-12 flex flex-col md:flex-row w-full min-h-0 md:min-h-[calc(100vh-64px-150px)] gap-gutter">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-surface-bright border border-outline-variant flex-shrink-0 flex flex-col h-auto md:h-full p-4 md:p-0 pt-4 md:pt-8">
        <div class="px-2 md:px-6 mb-4 md:mb-6">
          <h3 class="font-label-caps text-label-caps text-on-surface-variant mb-2">65-DAY MASTERY</h3>
          <div class="text-sm font-body-md text-primary font-medium">Day ${dayCount} / 65</div>
          <div class="w-full h-[2px] bg-surface-container mt-2">
            <div class="h-full bg-secondary" style="width: ${(dayCount / 65) * 100}%;"></div>
          </div>
        </div>
        <div class="flex-grow flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto gap-2 md:gap-0 scrollbar-none pb-2 md:pb-0">
          ${sidebarDaysHtml}
        </div>
      </aside>

      <!-- Editor Area -->
      <section class="flex-grow bg-white flex flex-col h-auto md:h-full overflow-y-auto p-4 md:p-8 relative border border-outline-variant">
        <div class="max-w-[800px] w-full mx-auto">
          <!-- Meta Header -->
          <div class="mb-8 md:mb-12 border-b border-outline-variant pb-6 md:pb-8">
            <input id="journal-title" class="text-headline-lg font-headline-lg text-primary w-full outline-none mb-4 bg-transparent border-none focus:ring-0 text-xl md:text-3xl" placeholder="Entry Title..." type="text" value="${escapeHTML(currentEntry.title || '')}"/>
            <div class="flex flex-wrap gap-6 md:gap-8">
              <div class="flex-1 min-w-[150px]">
                <label class="font-label-caps text-label-caps text-on-surface-variant block mb-2">DAILY MOOD</label>
                <div class="flex gap-4" id="mood-selector">
                  <span class="material-symbols-outlined cursor-pointer hover:text-primary transition-colors ${activeJournalMood === 'excited' ? 'text-secondary' : 'text-outline-variant'}" style="font-variation-settings: 'FILL' ${activeJournalMood === 'excited' ? 1 : 0};" onclick="setJournalMood('excited')">sentiment_excited</span>
                  <span class="material-symbols-outlined cursor-pointer hover:text-primary transition-colors ${activeJournalMood === 'neutral' ? 'text-secondary' : 'text-outline-variant'}" style="font-variation-settings: 'FILL' ${activeJournalMood === 'neutral' ? 1 : 0};" onclick="setJournalMood('neutral')">sentiment_neutral</span>
                  <span class="material-symbols-outlined cursor-pointer hover:text-primary transition-colors ${activeJournalMood === 'sad' ? 'text-secondary' : 'text-outline-variant'}" style="font-variation-settings: 'FILL' ${activeJournalMood === 'sad' ? 1 : 0};" onclick="setJournalMood('sad')">sentiment_dissatisfied</span>
                </div>
              </div>
              <div class="flex-1 min-w-[150px]">
                <label class="font-label-caps text-label-caps text-on-surface-variant block mb-2">HOURS LOGGED</label>
                <input id="journal-hours" class="w-full border-b border-outline-variant pb-1 font-body-md text-primary outline-none focus:border-primary transition-colors bg-transparent focus:ring-0" type="number" step="0.1" value="${currentEntry.hours || ''}"/>
              </div>
            </div>
          </div>

          <!-- Daily Prompt -->
          <div class="card bg-surface-bright p-6 md:p-8 mb-8 md:mb-12 relative overflow-hidden border border-outline-variant rounded-none">
            <div class="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
            <div class="font-label-caps text-label-caps text-secondary mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined" style="font-size: 16px;">psychology</span> DAILY PROMPT
            </div>
            <p class="font-body-lg text-body-lg text-primary italic text-sm md:text-base">${promptText}</p>
          </div>

          <!-- Main Text Area -->
          <div class="mb-8 md:mb-12">
            <label class="font-label-caps text-label-caps text-on-surface-variant block mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">code</span> TECHNICAL LOG & REFLECTIONS
            </label>
            <textarea id="journal-text" class="w-full min-h-[250px] md:min-h-[300px] outline-none resize-y bg-transparent font-mono text-sm leading-relaxed border border-outline-variant p-4 focus:border-primary transition-colors focus:ring-0" placeholder="Start writing...">${escapeHTML(currentEntry.text || '')}</textarea>
          </div>

          <!-- Key Breakthroughs -->
          <div class="mb-16 md:mb-24">
            <label class="font-label-caps text-label-caps text-on-surface-variant block mb-4">KEY BREAKTHROUGHS</label>
            <div id="breakthroughs-list" class="flex flex-col gap-2">
              ${(currentEntry.breakthroughs || []).map((bt, idx) => `
                <div class="flex items-center gap-4">
                  <span class="material-symbols-outlined ${bt ? 'text-secondary' : 'text-outline-variant'}" style="font-size: 20px;">
                    ${bt ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <input class="w-full border-b border-outline-variant pb-1 font-body-md text-primary outline-none focus:border-primary transition-colors bg-transparent focus:ring-0 journal-bt-input" type="text" data-index="${idx}" value="${escapeHTML(bt || '')}" placeholder="${idx === 0 ? 'e.g. Mastered tonal stepping for depth' : 'Add breakthrough...'}" oninput="updateBtIcons()"/>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="flex justify-end pt-8 border-t border-outline-variant gap-4">
            <span id="save-status" class="self-center font-caption text-on-surface-variant italic text-sm"></span>
            ${currentEntry.id || currentEntry.text || currentEntry.title ? `<button class="font-label-caps text-label-caps px-6 py-3 text-error hover:opacity-80 transition-opacity uppercase tracking-wider text-xs md:text-sm border border-error bg-transparent" onclick="deleteJournalEntry()">Delete Entry</button>` : ''}
            <button class="btn-primary font-label-caps text-label-caps px-6 py-3" onclick="saveJournalEntry()">Save Entry</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function selectJournalDay(d) {
  journalSelectedDay = d;
  renderJournalView();
}

let activeJournalMood = 'neutral';
function setJournalMood(mood) {
  activeJournalMood = mood;
  const selector = document.getElementById('mood-selector');
  if (selector) {
    selector.querySelectorAll('span').forEach((el, idx) => {
      const moods = ['excited', 'neutral', 'sad'];
      const m = moods[idx];
      const isSel = m === mood;
      el.className = `material-symbols-outlined cursor-pointer hover:text-primary transition-colors ${isSel ? 'text-secondary' : 'text-outline-variant'}`;
      el.style.fontVariationSettings = `'FILL' ${isSel ? 1 : 0}`;
    });
  }
}

function updateBtIcons() {
  const list = document.getElementById('breakthroughs-list');
  if (!list) return;
  list.querySelectorAll('.flex').forEach(container => {
    const input = container.querySelector('input');
    const icon = container.querySelector('span');
    if (input && icon) {
      const val = input.value.trim();
      if (val) {
        icon.textContent = 'check_circle';
        icon.className = 'material-symbols-outlined text-secondary';
      } else {
        icon.textContent = 'radio_button_unchecked';
        icon.className = 'material-symbols-outlined text-outline-variant';
      }
    }
  });
}

async function saveJournalEntry() {
  const title = document.getElementById('journal-title').value.trim();
  const hours = parseFloat(document.getElementById('journal-hours').value) || 0;
  const text = document.getElementById('journal-text').value.trim();

  const breakthroughs = [];
  document.querySelectorAll('.journal-bt-input').forEach(input => {
    const val = input.value.trim();
    if (val) breakthroughs.push(val);
  });
  breakthroughs.push('');

  const entryData = {
    title,
    mood: activeJournalMood,
    hours,
    text,
    breakthroughs
  };

  const oldEntry = journalEntries[journalSelectedDay] || {};
  journalEntries[journalSelectedDay] = { ...oldEntry, ...entryData };

  saveJournalState();

  const status = document.getElementById('save-status');
  if (status) status.textContent = 'Saving to cloud...';

  if (supabaseClient) {
    try {
      const payload = {
        title: `Day ${journalSelectedDay}: ${title || 'Untitled'}`,
        content: JSON.stringify(journalEntries[journalSelectedDay])
      };

      let res;
      if (oldEntry.id) {
        res = await supabaseClient.from('journals').update(payload).eq('id', oldEntry.id);
      } else {
        res = await supabaseClient.from('journals').insert([payload]).select();
        if (res.data && res.data.length > 0) {
          journalEntries[journalSelectedDay].id = res.data[0].id;
          saveJournalState();
        }
      }
      if (res.error) throw res.error;
      if (status) status.textContent = 'Saved successfully.';
    } catch (err) {
      console.error(err);
      if (status) status.textContent = 'Error saving to cloud.';
    }
  } else {
    if (status) status.textContent = 'Saved locally.';
  }

  setTimeout(() => { if (status) status.textContent = ''; }, 3000);
  renderJournalView();
}

async function deleteJournalEntry() {
  if (!confirm('Are you sure you want to delete this entry?')) return;

  const status = document.getElementById('save-status');
  if (status) status.textContent = 'Deleting...';

  const oldEntry = journalEntries[journalSelectedDay] || {};

  if (supabaseClient && oldEntry.id) {
    try {
      const { error } = await supabaseClient.from('journals').delete().eq('id', oldEntry.id);
      if (error) throw error;
    } catch (err) {
      console.error(err);
      if (status) status.textContent = 'Error deleting from cloud.';
      setTimeout(() => { if (status) status.textContent = ''; }, 3000);
      return;
    }
  }

  delete journalEntries[journalSelectedDay];
  saveJournalState();

  if (status) status.textContent = 'Deleted.';
  setTimeout(() => { if (status) status.textContent = ''; }, 3000);
  renderJournalView();
}

window.selectJournalDay = selectJournalDay;
window.setJournalMood = setJournalMood;
window.updateBtIcons = updateBtIcons;
window.saveJournalEntry = saveJournalEntry;
window.deleteJournalEntry = deleteJournalEntry;

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
    <div class="flex flex-col gap-6 font-body-md text-on-surface">
      <!-- DISPLAY -->
      <div class="flex flex-col gap-4">
        <h4 class="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-2 tracking-widest uppercase">DISPLAY</h4>
        <div class="flex items-center justify-between">
          <div>
            <div class="font-body-md text-primary font-medium">Compact Cards</div>
            <div class="font-caption text-on-surface-variant text-sm">Show smaller skill cards</div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="toggle-compact" class="sr-only peer" ${settings.compactCards ? 'checked' : ''}>
            <div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
          </label>
        </div>
      </div>

      <!-- CLOUD SYNC -->
      <div class="flex flex-col gap-4">
        <h4 class="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-2 tracking-widest uppercase">CLOUD SYNC</h4>
        <div class="flex items-center justify-between">
          <div>
            <div class="font-body-md text-primary font-medium">Supabase Status</div>
            <div class="font-caption text-on-surface-variant text-sm" id="sync-status">${typeof supabase !== 'undefined' ? 'Connected to Supabase (Journals syncing)' : 'Not Connected'}</div>
          </div>
          <span class="material-symbols-outlined ${typeof supabase !== 'undefined' ? 'text-secondary' : 'text-outline-variant'}">cloud_sync</span>
        </div>
        <div class="flex justify-start mt-2">
          <button class="px-4 py-2 border border-outline text-on-surface font-label-caps text-xs uppercase hover:bg-surface-container-low" onclick="handleLogout()">Log Out</button>
        </div>
      </div>

      <!-- DATA -->
      <div class="flex flex-col gap-4">
        <h4 class="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-2 tracking-widest uppercase">DATA</h4>
        <div class="flex items-center justify-between">
          <div>
            <div class="font-body-md text-primary font-medium">Export Progress</div>
            <div class="font-caption text-on-surface-variant text-sm">Download as JSON file</div>
          </div>
          <button class="px-4 py-2 border border-primary text-primary font-label-caps text-xs uppercase hover:bg-surface-container-low" id="btn-export">Export</button>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <div class="font-body-md text-primary font-medium">Import Progress</div>
            <div class="font-caption text-on-surface-variant text-sm">Restore from JSON file</div>
          </div>
          <button class="px-4 py-2 border border-primary text-primary font-label-caps text-xs uppercase hover:bg-surface-container-low" id="btn-import">Import</button>
          <input type="file" id="import-file" accept=".json" class="hidden" />
        </div>
      </div>

      <!-- INFO -->
      <div class="flex flex-col gap-4">
        <h4 class="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-2 tracking-widest uppercase">INFO</h4>
        <div class="flex items-center justify-between">
          <div class="font-body-md text-primary font-medium">Skills Conquered</div>
          <span class="font-body-md font-mono text-on-surface-variant">${done}</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="font-body-md text-primary font-medium">Journey Started</div>
          <span class="font-body-md font-mono text-on-surface-variant">${startDate ? startDate.toLocaleDateString() : 'Not yet'}</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="font-body-md text-primary font-medium">Days Elapsed</div>
          <span class="font-body-md font-mono text-on-surface-variant">${getDayCount()}</span>
        </div>
      </div>

      <!-- DANGER ZONE -->
      <div class="flex flex-col gap-4">
        <h4 class="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-2 tracking-widest uppercase text-error">DANGER ZONE</h4>
        <div class="flex items-center justify-between">
          <div>
            <div class="font-body-md text-primary font-medium">Reset All Progress</div>
            <div class="font-caption text-on-surface-variant text-sm">Clear all checked skills and day counter</div>
          </div>
          <button class="px-4 py-2 bg-error text-on-error font-label-caps text-xs uppercase hover:opacity-90" id="btn-reset">Reset</button>
        </div>
      </div>
    </div>`;

  // Bind events
  document.getElementById('toggle-compact').addEventListener('change', function () {
    settings.compactCards = this.checked;
    saveSettings();
    if (currentView === 'phases') renderView();
  });

  // Sync UI removed

  document.getElementById('btn-export').addEventListener('click', function () {
    const data = { checked, startDate: localStorage.getItem(DAY_START_KEY), exportedAt: new Date().toISOString(), version: 3 };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'lockin-progress-' + new Date().toISOString().split('T')[0] + '.json';
    a.click(); URL.revokeObjectURL(a.href);
  });

  document.getElementById('btn-import').addEventListener('click', function () {
    document.getElementById('import-file').click();
  });

  document.getElementById('import-file').addEventListener('change', function (e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.checked && typeof data.checked === 'object') {
          if (confirm('Import will replace your current progress. Continue?')) {
            checked = data.checked;
            if (data.startDate) { try { localStorage.setItem(DAY_START_KEY, data.startDate); } catch (e) { console.warn('Silenced error:', e); } }
            saveState();
            closePanel('settings-panel', 'settings-overlay');
            renderView();
          }
        } else { alert('Invalid file format.'); }
      } catch (err) { alert('Failed to parse file: ' + err.message); }
    };
    reader.readAsText(file);
  });

  document.getElementById('btn-reset').addEventListener('click', function () {
    if (confirm('⚠️ Reset ALL progress? This cannot be undone.')) {
      checked = {};
      try { localStorage.removeItem(DAY_START_KEY); } catch (e) { console.warn('Silenced error:', e); }
      saveState();
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
  // Re-trigger the fadeInUp animation on every view switch
  const main = document.getElementById('main');
  main.style.animation = 'none';
  main.offsetHeight; // force reflow
  main.style.animation = '';

  switch (currentView) {
    case 'phases': renderPhasesView(); break;
    case 'roadmap': renderRoadmapView(); break;
    case 'stats': renderStatsView(); break;
    case 'timer': renderTimerView(); break;
    case 'resources': renderResourcesView(); break;
    case 'journal': renderJournalView(); break;
    case 'beta': renderBetaView(); break;
  }
  updateDayBadge();
  initScrollReveal();
}

// ─── Scroll Reveal Observer ──────────────────────────────────────
let revealObserver = null;
function initScrollReveal() {
  // Tag all skill cards and major sections as reveal targets
  document.querySelectorAll('.skill-card, .conquest-card, .book-shelf-container, .ticket-stub').forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
  });

  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    revealObserver.observe(el);
  });
}

// ─── Filter + search bindings ────────────────────────────────────
function bindFilterEvents() {
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', function () {
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
    resetBtn.addEventListener('click', function () {
      if (confirm('Reset all progress? This cannot be undone.')) {
        checked = {};
        try { localStorage.removeItem(DAY_START_KEY); } catch (e) { console.warn('Silenced error:', e); }
        saveState();
        renderView();
      }
    });
  }
}

function bindSearchEvent() {
  const input = document.getElementById('search-input');
  if (input) {
    input.value = searchQuery;
    input.addEventListener('input', function () {
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
  a.addEventListener('click', function (e) {
    e.preventDefault();
    if (a.dataset.view) {
      switchView(a.dataset.view);
    }
  });
});

// Notification panel
document.getElementById('notif-btn').addEventListener('click', function () {
  renderNotifications();
  openPanel('notif-panel', 'notif-overlay');
});
document.getElementById('notif-close').addEventListener('click', () => closePanel('notif-panel', 'notif-overlay'));
document.getElementById('notif-overlay').addEventListener('click', () => closePanel('notif-panel', 'notif-overlay'));

// Settings panel
document.getElementById('settings-btn').addEventListener('click', function () {
  renderSettings();
  openPanel('settings-panel', 'settings-overlay');
});
document.getElementById('settings-close').addEventListener('click', () => closePanel('settings-panel', 'settings-overlay'));
document.getElementById('settings-overlay').addEventListener('click', () => closePanel('settings-panel', 'settings-overlay'));

function startJourney() {
  if (confirm('Ready to lock in for the next 65 days?')) {
    setStartDate();
    renderView();
  }
}
window.startJourney = startJourney;

// ─── Init ─────────────────────────────────────────────────────────
loadState();
startHeaderTimer();
renderView();