const STORAGE_KEY = 'lockin_checked_v2';

let checked = {};
let currentFilter = 'all';

// Phase mapping for each section
const PHASE_MAP = {
  python: 1, sql: 1, stats: 1, math: 1,
  eda: 2, ml_core: 2, dl: 2,
  nlp: 3, cv: 3, genai: 3,
  mlops: 4, soft: 4
};

const SECTION_META = {
  python:  { kanji: '蛇', color: '#60a5fa', colorDim: 'rgba(96,165,250,0.13)' },
  sql:     { kanji: '礎', color: '#34d399', colorDim: 'rgba(52,211,153,0.13)' },
  stats:   { kanji: '理', color: '#a78bfa', colorDim: 'rgba(167,139,250,0.13)' },
  math:    { kanji: '算', color: '#f472b6', colorDim: 'rgba(244,114,182,0.13)' },
  eda:     { kanji: '探', color: '#fbbf24', colorDim: 'rgba(251,191,36,0.13)' },
  ml_core: { kanji: '剣', color: '#f87171', colorDim: 'rgba(248,113,113,0.13)' },
  dl:      { kanji: '炎', color: '#f59e0b', colorDim: 'rgba(245,158,11,0.13)' },
  nlp:     { kanji: '言', color: '#34d399', colorDim: 'rgba(52,211,153,0.13)' },
  cv:      { kanji: '眼', color: '#60a5fa', colorDim: 'rgba(96,165,250,0.13)' },
  genai:   { kanji: '神', color: '#c084fc', colorDim: 'rgba(192,132,252,0.13)' },
  mlops:   { kanji: '城', color: '#fb923c', colorDim: 'rgba(251,146,60,0.13)' },
  soft:    { kanji: '道', color: '#9ca3af', colorDim: 'rgba(156,163,175,0.13)' },
};

// MOTIVATIONAL QUOTES - conquerers, legends, myth
const MOTIVATIONS = [
  {
    icon: '🪨',
    quote: 'The struggle itself toward the heights is enough to fill a man\'s heart. One must imagine Sisyphus happy.',
    attribution: '— Albert Camus, The Myth of Sisyphus',
    accent: 'linear-gradient(90deg, #f87171, #c41c1c)',
    particles: '#f87171'
  },
  {
    icon: '⚔️',
    quote: 'I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.',
    attribution: '— Alexander the Great',
    accent: 'linear-gradient(90deg, #c8a84b, #f5d97a)',
    particles: '#c8a84b'
  },
  {
    icon: '🔥',
    quote: 'I came, I saw, I conquered. The greatest victory is not in falling, but in rising every time you fall.',
    attribution: '— Julius Caesar',
    accent: 'linear-gradient(90deg, #f59e0b, #f87171)',
    particles: '#f59e0b'
  },
  {
    icon: '🌊',
    quote: 'Every obstacle is a test. The boulder does not break Sisyphus — it forges him. Push it again.',
    attribution: '— Ancient Stoic Wisdom',
    accent: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
    particles: '#60a5fa'
  },
  {
    icon: '🏛️',
    quote: 'You have power over your mind — not outside events. Realize this, and you will find strength.',
    attribution: '— Marcus Aurelius, Meditations',
    accent: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
    particles: '#a78bfa'
  },
  {
    icon: '🦅',
    quote: 'Do not pray for an easy life, pray for the strength to endure a difficult one.',
    attribution: '— Bruce Lee',
    accent: 'linear-gradient(90deg, #34d399, #60a5fa)',
    particles: '#34d399'
  },
  {
    icon: '⚡',
    quote: 'The impediment to action advances action. What stands in the way becomes the way.',
    attribution: '— Marcus Aurelius',
    accent: 'linear-gradient(90deg, #f5d97a, #f59e0b)',
    particles: '#f5d97a'
  },
  {
    icon: '🗡️',
    quote: 'A man who has never tasted defeat cannot know the full sweetness of conquest. Keep grinding.',
    attribution: '— Napoleon Bonaparte',
    accent: 'linear-gradient(90deg, #f87171, #f59e0b)',
    particles: '#f87171'
  },
  {
    icon: '🌋',
    quote: 'He who conquers himself is the mightiest warrior. Every skill mastered is yourself, conquered.',
    attribution: '— Confucius',
    accent: 'linear-gradient(90deg, #fb923c, #f87171)',
    particles: '#fb923c'
  },
  {
    icon: '🌙',
    quote: 'The darkest hour has only sixty minutes. Sisyphus does not count the hours — he rolls.',
    attribution: '— Morris Mandel',
    accent: 'linear-gradient(90deg, #c084fc, #60a5fa)',
    particles: '#c084fc'
  },
  {
    icon: '🏔️',
    quote: 'It is not the mountain we conquer, but ourselves.',
    attribution: '— Sir Edmund Hillary',
    accent: 'linear-gradient(90deg, #34d399, #c8a84b)',
    particles: '#34d399'
  },
  {
    icon: '🛡️',
    quote: 'Even Sisyphus had to push the boulder one inch before a mile. One skill at a time. You are on the path.',
    attribution: '— Ancient Myth, Modern Truth',
    accent: 'linear-gradient(90deg, #a78bfa, #f472b6)',
    particles: '#a78bfa'
  },
  {
    icon: '🌅',
    quote: 'The sun also rises — and so will you. Hannibal crossed the Alps. You can cross this syllabus.',
    attribution: '— Inspired by Hannibal Barca',
    accent: 'linear-gradient(90deg, #f59e0b, #f5d97a)',
    particles: '#f59e0b'
  },
  {
    icon: '⚓',
    quote: 'He who is not everyday conquering some fear has not learned the secret of life.',
    attribution: '— Ralph Waldo Emerson',
    accent: 'linear-gradient(90deg, #60a5fa, #34d399)',
    particles: '#60a5fa'
  },
];

let lastMotivationIndex = -1;

function getMotivation() {
  let idx;
  do { idx = Math.floor(Math.random() * MOTIVATIONS.length); } while (idx === lastMotivationIndex);
  lastMotivationIndex = idx;
  return MOTIVATIONS[idx];
}

function showMotivation(skillName) {
  const m = getMotivation();
  const overlay = document.createElement('div');
  overlay.className = 'motivation-overlay';

  // particles
  let particleHTML = '';
  for (let i = 0; i < 14; i++) {
    const tx = (Math.random() - 0.5) * 160;
    const ty = -(Math.random() * 120 + 40);
    const d = (Math.random() * 1.5 + 0.8).toFixed(2);
    const dl = (Math.random() * 0.5).toFixed(2);
    const size = Math.floor(Math.random() * 5 + 3);
    particleHTML += `<div class="m-particle" style="width:${size}px;height:${size}px;background:${m.particles};left:${Math.random()*100}%;top:${Math.random()*80+10}%;--tx:${tx}px;--ty:${ty}px;--d:${d}s;--dl:${dl}s"></div>`;
  }

  overlay.innerHTML = `
    <div class="motivation-card" onclick="event.stopPropagation()">
      <div class="motivation-accent" style="background:${m.accent}"></div>
      <div class="motivation-particles">${particleHTML}</div>
      <div class="motivation-body">
        <span class="motivation-icon">${m.icon}</span>
        <div class="motivation-label">Skill Conquered</div>
        <div class="motivation-skill-name">"${skillName}"</div>
        <div class="motivation-quote">${m.quote}</div>
        <div class="motivation-attribution">${m.attribution}</div>
        <button class="motivation-continue" onclick="closeMotivation()">Keep grinding →</button>
      </div>
    </div>`;

  overlay.addEventListener('click', closeMotivation);
  document.body.appendChild(overlay);
}

function closeMotivation() {
  const overlay = document.querySelector('.motivation-overlay');
  if (overlay) {
    overlay.style.animation = 'overlay-in 0.18s ease reverse';
    setTimeout(() => overlay.remove(), 170);
  }
}

// Keyboard close
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeMotivation();
});

// ─── State ───────────────────────────────────────
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) checked = JSON.parse(raw);
  } catch (e) { checked = {}; }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)); } catch (e) {}
}

function getAllSkills() {
  return SECTIONS.flatMap(s => s.skills);
}

function updateStats() {
  const all = getAllSkills();
  const total = all.length;
  const done = all.filter(s => checked[s.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('count-done').textContent = done;
  document.getElementById('count-total').textContent = total;
  document.getElementById('ring-pct').textContent = pct + '%';
  document.getElementById('global-bar').style.width = pct + '%';
  const circumference = 163.36;
  document.getElementById('ring-fill').style.strokeDashoffset = circumference - (pct / 100) * circumference;
}

function skillVisible(skill) {
  if (currentFilter === 'all') return true;
  if (currentFilter === 'done') return !!checked[skill.id];
  if (currentFilter === 'undone') return !checked[skill.id];
  return skill.tag === currentFilter;
}

function toggleSkill(skillId) {
  const wasUnchecked = !checked[skillId];
  checked[skillId] = !checked[skillId];
  saveState();

  const item = document.querySelector('.skill-item[data-skill-id="' + skillId + '"]');
  let skillName = skillId;
  if (item) {
    const isDone = !!checked[skillId];
    item.querySelector('.seal-cb').classList.toggle('done', isDone);
    item.querySelector('.skill-name').classList.toggle('done', isDone);
    item.classList.toggle('is-done', isDone);
    skillName = item.querySelector('.skill-name').textContent;

    // flash animation
    item.classList.add('skill-flashing');
    setTimeout(() => item.classList.remove('skill-flashing'), 550);
  }

  updateStats();
  updateSectionProgress(findSectionForSkill(skillId));

  // Show motivation only when completing (checking), not unchecking
  if (wasUnchecked && checked[skillId]) {
    setTimeout(() => showMotivation(skillName), 120);
  }

  if (currentFilter === 'done' || currentFilter === 'undone') renderAll();
}

function findSectionForSkill(skillId) {
  for (const sec of SECTIONS) {
    if (sec.skills.some(s => s.id === skillId)) return sec.id;
  }
  return null;
}

function updateSectionProgress(sectionId) {
  if (!sectionId) return;
  const sec = SECTIONS.find(s => s.id === sectionId);
  if (!sec) return;
  const done = sec.skills.filter(s => checked[s.id]).length;
  const pct = Math.round((done / sec.skills.length) * 100);
  const bar = document.getElementById('bar-' + sectionId);
  const count = document.getElementById('count-' + sectionId);
  if (bar) bar.style.width = pct + '%';
  if (count) count.textContent = done + '/' + sec.skills.length;
}

function toggleSection(sectionId) {
  const body = document.getElementById('body-' + sectionId);
  const chev = document.getElementById('chev-' + sectionId);
  if (!body) return;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  if (chev) chev.classList.toggle('open', !isOpen);
}

function toggleResources(skillId, btn) {
  const dropdown = document.getElementById('res-' + skillId);
  if (!dropdown) return;
  const isOpen = dropdown.classList.contains('open');
  dropdown.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);
  btn.textContent = isOpen ? '▸ Free Resources' : '▾ Close';
}

function renderSection(sec) {
  const visSkills = sec.skills.filter(skillVisible);
  if (visSkills.length === 0) return null;

  const done = sec.skills.filter(s => checked[s.id]).length;
  const pct = Math.round((done / sec.skills.length) * 100);
  const meta = SECTION_META[sec.id] || { kanji: '道', color: '#c8a84b', colorDim: 'rgba(200,168,75,0.13)' };
  const phase = PHASE_MAP[sec.id] || 1;

  const secDiv = document.createElement('div');
  secDiv.className = 'section';
  secDiv.dataset.sectionId = sec.id;
  secDiv.dataset.phase = phase;

  const skillsHTML = visSkills.map(function(skill) {
    const isDone = !!checked[skill.id];
    const tagLabel = skill.tag === 'hot' ? '🔥 Hot 2025' : skill.tag === 'core' ? 'Core' : 'Advanced';
    const resHTML = skill.resources.map(function(r) {
      return '<a class="resource-link" href="' + r.url + '" target="_blank" rel="noopener noreferrer">' +
        '<div class="res-icon">' + r.icon + '</div>' +
        '<div class="res-info"><div class="res-name">' + r.name + '</div><div class="res-platform">' + r.platform + '</div></div>' +
        '<span class="res-arrow">↗</span></a>';
    }).join('');

    return '<div class="skill-item ' + (isDone ? 'is-done' : '') + '" data-skill-id="' + skill.id + '">' +
      '<div class="skill-main" onclick="toggleSkill(\'' + skill.id + '\')">' +
      '<div class="seal-cb ' + (isDone ? 'done' : '') + '"></div>' +
      '<div class="skill-text-wrap">' +
      '<div class="skill-name ' + (isDone ? 'done' : '') + '">' + skill.name + '</div>' +
      '<div class="skill-desc">' + skill.desc + '</div>' +
      '</div>' +
      '<span class="tag-scroll tag-' + skill.tag + '">' + tagLabel + '</span>' +
      '<button class="learn-btn" onclick="event.stopPropagation();toggleResources(\'' + skill.id + '\',this)">▸ Free Resources</button>' +
      '</div>' +
      '<div class="resource-dropdown" id="res-' + skill.id + '">' +
      '<div class="resource-label">Free Learning Resources</div>' +
      resHTML + '</div></div>';
  }).join('');

  secDiv.innerHTML =
    '<div class="sec-header" onclick="toggleSection(\'' + sec.id + '\')">' +
    '<div class="sec-crest" style="color:' + meta.color + ';border-color:' + meta.color + ';background:' + meta.colorDim + '">' + meta.kanji + '</div>' +
    '<div class="sec-info">' +
    '<div class="sec-title">' + sec.title + '</div>' +
    '<div class="sec-phase">' + sec.phase + '</div>' +
    '</div>' +
    '<div class="sec-right">' +
    '<span class="sec-count" id="count-' + sec.id + '">' + done + '/' + sec.skills.length + '</span>' +
    '<div class="sec-bar-wrap"><div class="sec-bar-fill" id="bar-' + sec.id + '" style="width:' + pct + '%"></div></div>' +
    '<span class="sec-chevron open" id="chev-' + sec.id + '">▼</span>' +
    '</div></div>' +
    '<div class="sec-body open" id="body-' + sec.id + '">' + skillsHTML + '</div>';

  return secDiv;
}

function renderAll() {
  const main = document.getElementById('main');
  main.innerHTML = '';
  let rendered = 0;
  for (const sec of SECTIONS) {
    const el = renderSection(sec);
    if (el) { main.appendChild(el); rendered++; }
  }
  if (rendered === 0) {
    main.innerHTML = '<div class="empty-state"><div class="big-kanji">完</div><p>All skills conquered — you are unstoppable</p></div>';
  }
  updateStats();
}

// ─── Elemental Background ────────────────────────
function buildBackground() {
  const bg = document.querySelector('.bg-layer');
  if (!bg) return;

  // Sky
  const sky = document.createElement('div');
  sky.className = 'sky-drift';
  bg.appendChild(sky);

  // Water
  const water = document.createElement('div');
  water.className = 'water-wrap';
  water.innerHTML = '<div class="wave"></div><div class="wave"></div><div class="wave"></div>';
  bg.appendChild(water);

  // Stars
  const starField = document.createElement('div');
  starField.style.cssText = 'position:absolute;inset:0;';
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = 'left:' + Math.random()*100 + '%;top:' + Math.random()*70 + '%;' +
      '--dur:' + (Math.random()*4+2).toFixed(1) + 's;' +
      '--delay:' + (Math.random()*5).toFixed(1) + 's;';
    starField.appendChild(s);
  }
  bg.appendChild(starField);

  // Embers (fire)
  for (let i = 0; i < 20; i++) {
    const e = document.createElement('div');
    e.className = 'ember';
    e.style.cssText = 'left:' + (Math.random()*100) + '%;bottom:' + (Math.random()*30) + '%;' +
      '--dur:' + (Math.random()*3+3).toFixed(1) + 's;--delay:' + (Math.random()*6).toFixed(1) + 's;';
    bg.appendChild(e);
  }

  // Earth lines
  for (let i = 0; i < 5; i++) {
    const l = document.createElement('div');
    l.className = 'earth-line';
    l.style.cssText = 'top:' + (15+i*18) + '%;left:0;right:0;animation-delay:' + (i*1.4).toFixed(1) + 's;';
    bg.appendChild(l);
  }
}

// ─── Filter buttons ──────────────────────────────
document.querySelectorAll('.scroll-tab[data-filter]').forEach(function(btn) {
  btn.addEventListener('click', function() {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll('.scroll-tab').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    renderAll();
  });
});

document.getElementById('reset-btn').addEventListener('click', function() {
  if (confirm('Reset all progress? This cannot be undone.')) {
    checked = {};
    saveState();
    renderAll();
  }
});

loadState();
buildBackground();
renderAll();
