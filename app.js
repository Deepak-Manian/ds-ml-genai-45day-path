const STORAGE_KEY = 'lockin_v3_checked';

let checked = {};
let currentFilter = 'all';

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

// element symbols for popup
const ELEMENT_META = {
  earth:     { symbol: '山', color: '#a87c44', label: 'Earth Phase' },
  water:     { symbol: '水', color: '#2a6aaa', label: 'Water Phase' },
  fire:      { symbol: '炎', color: '#cc3800', label: 'Fire Phase' },
  wind:      { symbol: '風', color: '#2a9a6a', label: 'Wind Phase' },
  lightning: { symbol: '雷', color: '#8855cc', label: 'Lightning Phase' },
  metal:     { symbol: '鉄', color: '#778899', label: 'Metal Phase' },
  void:      { symbol: '無', color: '#c8a84b', label: 'All Elements' },
};

const SECTION_ELEMENT = {};
SECTIONS.forEach(s => { SECTION_ELEMENT[s.id] = s.element || 'default'; });

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
  document.getElementById('count-done').textContent = done;
  document.getElementById('count-total').textContent = total;
  document.getElementById('ring-pct').textContent = pct + '%';
  document.getElementById('global-bar').style.width = pct + '%';
  const c = 163.36;
  document.getElementById('ring-fill').style.strokeDashoffset = c - (pct/100)*c;
}

function skillVisible(skill) {
  if (currentFilter==='all') return true;
  if (currentFilter==='done') return !!checked[skill.id];
  if (currentFilter==='undone') return !checked[skill.id];
  return skill.tag===currentFilter;
}

// ─── Toggle skill ────────────────────────────────────────────────
function toggleSkill(skillId) {
  const wasDone = !!checked[skillId];
  checked[skillId] = !wasDone;
  saveState();
  const item = document.querySelector('.skill-item[data-skill-id="'+skillId+'"]');
  if (item) {
    const isDone = !!checked[skillId];
    item.querySelector('.seal-cb').classList.toggle('done', isDone);
    item.querySelector('.skill-name').classList.toggle('done', isDone);
    item.classList.toggle('is-done', isDone);
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
  const pct = Math.round((done/sec.skills.length)*100);
  const bar = document.getElementById('bar-'+sectionId);
  const count = document.getElementById('count-'+sectionId);
  if (bar) bar.style.width = pct+'%';
  if (count) count.textContent = done+'/'+sec.skills.length;
}
function toggleSection(sectionId) {
  const body = document.getElementById('body-'+sectionId);
  const chev = document.getElementById('chev-'+sectionId);
  if (!body) return;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open',!isOpen);
  if (chev) chev.classList.toggle('open',!isOpen);
}
function toggleResources(skillId,btn) {
  const dd = document.getElementById('res-'+skillId); if(!dd) return;
  const isOpen = dd.classList.contains('open');
  dd.classList.toggle('open',!isOpen);
  btn.classList.toggle('open',!isOpen);
  btn.textContent = isOpen ? '▸ Learn free' : '▾ Close';
}

// ─── Motivation popup ────────────────────────────────────────────
function showMotivation(skillId, sectionId) {
  const element = SECTION_ELEMENT[sectionId] || 'default';
  const meta = ELEMENT_META[element] || { symbol:'完', color:'#c8a84b', label:'Mastered' };
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
  
  // element-specific border glow
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
function getElementColors(element) {
  const map = {
    earth:     { color:'#a87c44', dim:'rgba(168,124,68,0.13)' },
    water:     { color:'#2a6aaa', dim:'rgba(42,106,170,0.13)' },
    fire:      { color:'#cc3800', dim:'rgba(204,56,0,0.13)' },
    wind:      { color:'#2a9a6a', dim:'rgba(42,154,106,0.13)' },
    lightning: { color:'#8855cc', dim:'rgba(136,85,204,0.13)' },
    metal:     { color:'#778899', dim:'rgba(119,136,153,0.13)' },
    void:      { color:'#c8a84b', dim:'rgba(200,168,75,0.13)' },
  };
  return map[element] || map.void;
}
const ELEMENT_KANJI = { earth:'山',water:'水',fire:'炎',wind:'風',lightning:'雷',metal:'鉄',void:'無' };
const ELEMENT_LABELS = { earth:'Earth',water:'Water',fire:'Fire',wind:'Wind',lightning:'Lightning',metal:'Metal',void:'Void' };

function renderSection(sec) {
  const visSkills = sec.skills.filter(skillVisible);
  if (visSkills.length===0) return null;
  const done = sec.skills.filter(s=>checked[s.id]).length;
  const pct = Math.round((done/sec.skills.length)*100);
  const element = sec.element || 'void';
  const ec = getElementColors(element);
  const kanji = ELEMENT_KANJI[element] || '道';
  
  const secDiv = document.createElement('div');
  secDiv.className = 'section';
  secDiv.dataset.sectionId = sec.id;
  secDiv.dataset.element = element;
  
  const skillsHTML = visSkills.map(function(skill) {
    const isDone = !!checked[skill.id];
    const tagLabel = skill.tag==='hot' ? '🔥 Hot 2025' : skill.tag;
    const resHTML = skill.resources.map(function(r) {
      return `<a class="resource-link" href="${r.url}" target="_blank" rel="noopener noreferrer">
        <div class="res-icon">${r.icon}</div>
        <div class="res-info"><div class="res-name">${r.name}</div><div class="res-platform">${r.platform}</div></div>
        <span class="res-arrow">↗</span></a>`;
    }).join('');
    return `<div class="skill-item ${isDone?'is-done':''}" data-skill-id="${skill.id}">
      <div class="skill-main" onclick="toggleSkill('${skill.id}')">
        <div class="seal-cb ${isDone?'done':''}"></div>
        <div class="skill-text-wrap">
          <div class="skill-name ${isDone?'done':''}">${skill.name}</div>
          <div class="skill-desc">${skill.desc}</div>
        </div>
        <span class="tag-scroll tag-${skill.tag}">${tagLabel}</span>
        <button class="learn-btn" onclick="event.stopPropagation();toggleResources('${skill.id}',this)">▸ Learn free</button>
      </div>
      <div class="resource-dropdown" id="res-${skill.id}">
        <div class="resource-label">Free Learning Resources · Zero cost, maximum value</div>
        ${resHTML}
      </div>
    </div>`;
  }).join('');
  
  secDiv.innerHTML = `
    <div class="sec-header" onclick="toggleSection('${sec.id}')">
      <div class="sec-crest elem-${element}" style="color:${ec.color};border-color:${ec.color}55;background:${ec.dim}">
        ${kanji}
      </div>
      <div class="sec-info">
        <div class="sec-title">${sec.title}</div>
        <div class="sec-phase">${sec.phase}</div>
      </div>
      <div class="sec-right">
        <span class="sec-count" id="count-${sec.id}">${done}/${sec.skills.length}</span>
        <div class="sec-bar-wrap"><div class="sec-bar-fill" id="bar-${sec.id}" style="width:${pct}%"></div></div>
        <span class="sec-chevron open" id="chev-${sec.id}">▼</span>
      </div>
    </div>
    <div class="sec-body open" id="body-${sec.id}">${skillsHTML}</div>`;
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
  if (rendered===0) {
    main.innerHTML = '<div class="empty-state"><div class="big-kanji">完</div><p>All skills conquered · The path is yours</p></div>';
  }
  updateStats();
}

// ─── Particle animation canvas (elemental bg) ────────────────────
const particleCanvas = document.getElementById('particle-canvas');
const pctx = particleCanvas ? particleCanvas.getContext('2d') : null;
let particles = [];
let currentElementColor = null;

function resizeCanvas() {
  if (!particleCanvas) return;
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function spawnParticles(color, type) {
  particles = [];
  const count = type === 'lightning' ? 12 : type === 'fire' ? 30 : 20;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * (type==='wind'?2:0.5),
      vy: type==='fire' ? -Math.random()*1.5-0.5 : type==='water' ? Math.random()*0.5 : (Math.random()-0.5)*0.8,
      life: 1, decay: Math.random()*0.003+0.002,
      size: Math.random()*3+1,
      color, type
    });
  }
  currentElementColor = color;
}

function animateParticles() {
  if (!pctx || particles.length===0) { requestAnimationFrame(animateParticles); return; }
  pctx.clearRect(0,0,particleCanvas.width,particleCanvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    if (p.life <= 0) { p.life=1; p.x=Math.random()*window.innerWidth; p.y=p.vy<0?window.innerHeight:Math.random()*window.innerHeight; }
    pctx.globalAlpha = p.life * 0.3;
    pctx.beginPath();
    if (p.type==='lightning') {
      pctx.moveTo(p.x, p.y);
      pctx.lineTo(p.x + (Math.random()-0.5)*20, p.y + (Math.random()-0.5)*20);
      pctx.strokeStyle = p.color;
      pctx.lineWidth = 1;
      pctx.stroke();
    } else {
      pctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      pctx.fillStyle = p.color;
      pctx.fill();
    }
  });
  pctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Observer to detect which section is in view and update particles
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
      const element = entry.target.dataset.element;
      if (!element) return;
      const ec = { earth:'#a87c44', water:'#2a6aaa', fire:'#ff4400', wind:'#2a9a6a', lightning:'#8855cc', metal:'#aabbcc', void:'#c8a84b' };
      const c = ec[element] || ec.void;
      if (c !== currentElementColor) spawnParticles(c, element);
    }
  });
}, { threshold: 0.3 });

function observeSections() {
  document.querySelectorAll('.section').forEach(s => sectionObserver.observe(s));
}

// ─── Filter tabs ─────────────────────────────────────────────────
document.querySelectorAll('.scroll-tab[data-filter]').forEach(function(btn) {
  btn.addEventListener('click', function() {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll('.scroll-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderAll();
    observeSections();
  });
});

document.getElementById('reset-btn').addEventListener('click', function() {
  if (confirm('Reset all progress? This cannot be undone.')) {
    checked = {}; saveState(); renderAll(); observeSections();
  }
});

// ─── Init ─────────────────────────────────────────────────────────
loadState();
renderAll();
observeSections();
spawnParticles('#a87c44', 'earth'); // start with earth particles
