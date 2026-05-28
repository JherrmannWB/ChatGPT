'use strict';

// ─── PLAYER CONFIG ──────────────────────────────────────────────────────────
// Personalize each player's avatar. Change emoji, color (hex), or title here.
// Colors: any 6-digit hex (#rrggbb). Emoji: any single emoji character.
// To add a player not listed: just add a new entry matching their exact name.
const PLAYER_CONFIG = {
  'MrBoomBoom':      { emoji: '👑', title: 'Commander',      color: '#ffd700' },
  'split ya lip':    { emoji: '💥', title: 'This Week MVP',  color: '#ff6b35' },
  'Zed T Dog':       { emoji: '🐕', title: 'Top Dog',        color: '#4fc3f7' },
  'old man':         { emoji: '⚓', title: 'Founder',        color: '#66bb6a' },
  'Rando Calrisian': { emoji: '🎲', title: 'Wild Card',      color: '#ce93d8' },
  'gibbyrulz':       { emoji: '⚡', title: 'Shock Trooper',  color: '#fff176' },
  'FJ Fruitman':     { emoji: '🎯', title: 'Perfect Record', color: '#ff8c00' },
  'boomerbeachin':   { emoji: '🏖️', title: 'Beach Bum',     color: '#80deea' },
  'PutteQuick':      { emoji: '⛳', title: 'Eagle Eye',      color: '#a5d6a7' },
  'Alexk1728':       { emoji: '🔭', title: 'Intel Scout',    color: '#4dd0e1' },
  'lumpy':           { emoji: '🏔️', title: 'Mountain',      color: '#90a4ae' },
  'MT':              { emoji: '🗻', title: 'Summit',         color: '#78909c' },
  'Boomer':          { emoji: '🛡️', title: 'Iron Guard',    color: '#66bb6a' },
  'jenuine':         { emoji: '💎', title: 'Diamond',        color: '#4fc3f7' },
  'Papa Midnite':    { emoji: '🌙', title: 'Night Owl',      color: '#5c6bc0' },
  '☆CRAZY DAVE☆':   { emoji: '🌀', title: 'Wildman',        color: '#f06292' },
  'keg too':         { emoji: '🍺', title: 'Old School',     color: '#ffa726' },
  'th3.sid':         { emoji: '🎸', title: 'Rockstar',       color: '#ba68c8' },
  'BRUNOG':          { emoji: '🦁', title: 'Lion',           color: '#ffca28' },
  'CRAZYCRAFT':      { emoji: '🔨', title: 'Crafter',        color: '#ff7043' },
  'ACFrontRanger':   { emoji: '🏕️', title: 'Ranger',        color: '#66bb6a' },
  'MRchappel24':     { emoji: '📐', title: 'Architect',      color: '#42a5f5' },
  'COYG':            { emoji: '🏆', title: 'Champion',       color: '#ffd54f' },
  'Frei_Taz':        { emoji: '🌪️', title: 'Whirlwind',     color: '#b0bec5' },
  'MrBoomBoomjr':    { emoji: '💣', title: 'Boom Jr.',       color: '#ef9a9a' },
  'Boofoo':          { emoji: '👻', title: 'Ghost',          color: '#e0e0e0' },
  'DaVinceC':        { emoji: '🎨', title: 'Artist',         color: '#ce93d8' },
  'JASHAN':          { emoji: '🌟', title: 'Rising Star',    color: '#fff176' },
  'Ricky':           { emoji: '🎵', title: 'Rhythm',         color: '#80cbc4' },
  'Skyfan113':       { emoji: '✈️', title: 'Pilot',          color: '#90caf9' },
  'Rubberducky':     { emoji: '🦆', title: 'Rubber Duck',    color: '#fff59d' },
  'ميدو الطيار':     { emoji: '🦅', title: 'Eagle',          color: '#ffcc02' },
  'TwistedDonut':    { emoji: '🍩', title: 'Twisted',        color: '#f48fb1' },
  'homer459':        { emoji: '🍩', title: "D'oh!",          color: '#ffd54f' },
  'CHARLIES DAD':    { emoji: '👨', title: 'The Dad',        color: '#90a4ae' },
  'Black Naruto89':  { emoji: '🍃', title: 'Ninja',          color: '#81c784' },
  'cupidstunt':      { emoji: '💘', title: 'Cupid',          color: '#f48fb1' },
  'papagiorgio':     { emoji: '🎭', title: 'Il Capitano',    color: '#66bb6a' },
  'Buda':            { emoji: '☯️', title: 'Zen',            color: '#fff176' },
  'ただん':           { emoji: '⛩️', title: 'Samurai',       color: '#ef9a9a' },
  'bouboule44':      { emoji: '🫧', title: 'Bubble',         color: '#80deea' },
  'Exterminador':    { emoji: '💀', title: 'Exterminator',   color: '#b0bec5' },
  '⛔Tired Bloke⛔':  { emoji: '😴', title: 'Night Shift',   color: '#5c6bc0' },
  'el conquestador': { emoji: '🗡️', title: 'Conqueror',     color: '#ff7043' },
  'SpartyOn':        { emoji: '🎉', title: 'Party On',       color: '#f06292' },
  'ringoskyblastr3': { emoji: '🚀', title: 'Sky Blaster',    color: '#42a5f5' },
  'Dr Faustus':      { emoji: '🧪', title: 'Alchemist',      color: '#ce93d8' },
  'Snopy':           { emoji: '🐾', title: 'Tracker',        color: '#a5d6a7' },
  'Andy':            { emoji: '🔧', title: 'Fixer',          color: '#78909c' },
  'Commander':       { emoji: '📡', title: 'Tactician',      color: '#4fc3f7' },
};

// ─── PLAYER OF THE WEEK ─────────────────────────────────────────────────────
// To update: change name, week, vp, and intel here.
const POTW_DATA = {
  name:  'split ya lip',
  week:  'Week of May 27, 2026',
  vp:    1613,
  intel: 346,
};

// ─── ROSTER DATA ─────────────────────────────────────────────────────────────
// To update stats: edit vp, intel, attacks, missed, participation for any player.
// participation is a percentage (0–100). missed = attack slots not used.
const MEMBERS = [
  { name: 'split ya lip',    level: 84, role: 'Member',    vp: 1613, intel: 371, attacks: 4, missed: 0, participation: 100 },
  { name: 'Zed T Dog',       level: 84, role: 'Officer',   vp: 1446, intel: 227, attacks: 3, missed: 0, participation: 100 },
  { name: 'old man',         level: 65, role: 'Co-Leader', vp: 1307, intel: 144, attacks: 4, missed: 0, participation: 100, exLeader: true },
  { name: 'Rando Calrisian', level: 63, role: 'Officer',   vp: 1263, intel: 147, attacks: 3, missed: 0, participation: 100 },
  { name: 'gibbyrulz',       level: 64, role: 'Officer',   vp: 1261, intel: 90,  attacks: 4, missed: 0, participation: 100 },
  { name: 'MrBoomBoom',      level: 66, role: 'Leader',    vp: 1228, intel: 96,  attacks: 4, missed: 0, participation: 100 },
  { name: 'FJ Fruitman',     level: 70, role: 'Co-Leader', vp: 1167, intel: 162, attacks: 3, missed: 0, participation: 100, neverMissed: true },
  { name: 'boomerbeachin',   level: 61, role: 'Officer',   vp: 1158, intel: 99,  attacks: 3, missed: 0, participation: 100 },
  { name: 'PutteQuick',      level: 64, role: 'Officer',   vp: 1062, intel: 132, attacks: 4, missed: 0, participation: 100 },
  { name: 'Alexk1728',       level: 64, role: 'Officer',   vp: 1061, intel: 134, attacks: 3, missed: 0, participation: 100 },
  { name: 'lumpy',           level: 63, role: 'Co-Leader', vp: 1028, intel: 138, attacks: 4, missed: 0, participation: 100 },
  { name: 'MT',              level: 55, role: 'Member',    vp: 1003, intel: 122, attacks: 3, missed: 0, participation: 100 },
  { name: 'Boomer',          level: 55, role: 'Co-Leader', vp: 996,  intel: 76,  attacks: 3, missed: 0, participation: 100, exLeader: true, neverMissed: true },
  { name: 'jenuine',         level: 63, role: 'Officer',   vp: 980,  intel: 17,  attacks: 2, missed: 1, participation: 66  },
  { name: 'Papa Midnite',    level: 56, role: 'Officer',   vp: 929,  intel: 65,  attacks: 2, missed: 0, participation: 100 },
  { name: '☆CRAZY DAVE☆',   level: 54, role: 'Member',    vp: 898,  intel: 76,  attacks: 1, missed: 1, participation: 50  },
  { name: 'keg too',         level: 78, role: 'Officer',   vp: 805,  intel: 49,  attacks: 2, missed: 0, participation: 100 },
  { name: 'th3.sid',         level: 59, role: 'Co-Leader', vp: 780,  intel: 66,  attacks: 3, missed: 0, participation: 100 },
  { name: 'BRUNOG',          level: 53, role: 'Member',    vp: 733,  intel: 63,  attacks: 1, missed: 1, participation: 50  },
  { name: 'CRAZYCRAFT',      level: 62, role: 'Co-Leader', vp: 677,  intel: 15,  attacks: 2, missed: 0, participation: 100 },
  { name: 'ACFrontRanger',   level: 70, role: 'Officer',   vp: 676,  intel: 61,  attacks: 2, missed: 0, participation: 100 },
  { name: 'MRchappel24',     level: 61, role: 'Officer',   vp: 634,  intel: 39,  attacks: 3, missed: 1, participation: 75  },
  { name: 'COYG',            level: 70, role: 'Co-Leader', vp: 620,  intel: 148, attacks: 4, missed: 0, participation: 100 },
  { name: 'Frei_Taz',        level: 59, role: 'Officer',   vp: 609,  intel: 81,  attacks: 4, missed: 0, participation: 100 },
  { name: 'MrBoomBoomjr',    level: 42, role: 'Member',    vp: 585,  intel: 83,  attacks: 4, missed: 0, participation: 100 },
  { name: 'Boofoo',          level: 50, role: 'Officer',   vp: 585,  intel: 65,  attacks: 4, missed: 0, participation: 100 },
  { name: 'DaVinceC',        level: 34, role: 'Member',    vp: 528,  intel: 167, attacks: 2, missed: 0, participation: 100 },
  { name: 'JASHAN',          level: 48, role: 'Member',    vp: 503,  intel: 23,  attacks: 0, missed: 0, participation: 0   },
  { name: 'Ricky',           level: 62, role: 'Member',    vp: 493,  intel: 108, attacks: 3, missed: 0, participation: 100 },
  { name: 'Skyfan113',       level: 50, role: 'Member',    vp: 477,  intel: 73,  attacks: 3, missed: 1, participation: 75  },
  { name: 'Rubberducky',     level: 43, role: 'Officer',   vp: 403,  intel: 55,  attacks: 4, missed: 0, participation: 100 },
  { name: 'ميدو الطيار',     level: 69, role: 'Member',    vp: 267,  intel: 86,  attacks: 3, missed: 0, participation: 100 },
  { name: 'TwistedDonut',    level: 56, role: 'Member',    vp: 219,  intel: 19,  attacks: 4, missed: 0, participation: 100 },
  { name: 'homer459',        level: 27, role: 'Officer',   vp: 189,  intel: 75,  attacks: 4, missed: 0, participation: 100 },
  { name: 'CHARLIES DAD',    level: 74, role: 'Member',    vp: 188,  intel: 79,  attacks: 2, missed: 0, participation: 100 },
  { name: 'Black Naruto89',  level: 62, role: 'Member',    vp: 169,  intel: 16,  attacks: 2, missed: 0, participation: 100 },
  { name: 'cupidstunt',      level: 52, role: 'Officer',   vp: 165,  intel: 2,   attacks: 1, missed: 1, participation: 50  },
  { name: 'papagiorgio',     level: 67, role: 'Officer',   vp: 163,  intel: 13,  attacks: 1, missed: 1, participation: 50  },
  { name: 'Buda',            level: 78, role: 'Member',    vp: 131,  intel: 34,  attacks: 1, missed: 1, participation: 50  },
  { name: 'ただん',           level: 81, role: 'Member',    vp: 118,  intel: 42,  attacks: 2, missed: 0, participation: 100 },
  { name: 'bouboule44',      level: 32, role: 'Member',    vp: 73,   intel: 4,   attacks: 0, missed: 1, participation: 0   },
  { name: 'Exterminador',    level: 14, role: 'Member',    vp: 59,   intel: 2,   attacks: 0, missed: 1, participation: 0   },
  { name: '⛔Tired Bloke⛔',  level: 78, role: 'Officer',   vp: 55,   intel: 43,  attacks: 3, missed: 0, participation: 100 },
  { name: 'el conquestador', level: 81, role: 'Officer',   vp: 9,    intel: 46,  attacks: 3, missed: 0, participation: 100 },
  { name: 'SpartyOn',        level: 82, role: 'Member',    vp: 8,    intel: 15,  attacks: 3, missed: 0, participation: 100 },
  { name: 'ringoskyblastr3', level: 84, role: 'Member',    vp: 5,    intel: 29,  attacks: 3, missed: 0, participation: 100 },
  { name: 'Dr Faustus',      level: 81, role: 'Officer',   vp: 0,    intel: 34,  attacks: 2, missed: 0, participation: 100 },
  { name: 'Snopy',           level: 49, role: 'Officer',   vp: 0,    intel: 24,  attacks: 3, missed: 0, participation: 100 },
  { name: 'Andy',            level: 56, role: 'Member',    vp: 0,    intel: 27,  attacks: 2, missed: 0, participation: 100 },
  { name: 'Commander',       level: 72, role: 'Officer',   vp: 0,    intel: 41,  attacks: 4, missed: 0, participation: 100 },
];

// ─── COMPUTED ────────────────────────────────────────────────────────────────
const vpRanking = [...MEMBERS]
  .sort((a, b) => b.vp - a.vp || b.intel - a.intel)
  .map(m => m.name);

let currentSort   = 'vp';
let currentRole   = '';
let currentSearch = '';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function roleCls(role) { return 'role-' + role.replace(' ', '-'); }
function vpRankOf(name) { return vpRanking.indexOf(name) + 1; }

function medalFor(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
}

function getPlayerConfig(name) {
  return PLAYER_CONFIG[name] || {};
}

function roleDefaultEmoji(role) {
  return { 'Leader': '👑', 'Co-Leader': '🔱', 'Officer': '⭐', 'Member': '⚔️' }[role] || '⚔️';
}

function roleDefaultColor(role) {
  return { 'Leader': '#ffd700', 'Co-Leader': '#ff8c00', 'Officer': '#4fc3f7', 'Member': '#81c784' }[role] || '#4fc3f7';
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// Renders a circular avatar with emoji and role-colored border
function renderAvatar(m, opts = {}) {
  const cfg   = getPlayerConfig(m.name);
  const emoji = cfg.emoji || roleDefaultEmoji(m.role);
  const color = cfg.color || roleDefaultColor(m.role);
  const size  = opts.size || 'md';

  let style = `border-color:${color};`;
  try { style += `background:rgba(${hexToRgb(color)},0.12);`; } catch (_) {}

  return `<div class="avatar avatar-${size}" style="${style}">
    <span class="avatar-emoji">${emoji}</span>
  </div>`;
}

function roleBadge(role) {
  const icons = { 'Leader': '👑 ', 'Officer': '⭐ ' };
  const icon  = icons[role] || '';
  return `<span class="role-badge ${roleCls(role)}">${icon}${role}</span>`;
}

function achBadges(m) {
  const out = [];
  if (m.exLeader)    out.push('<span class="ach-badge ach-ex-leader">🏛️ Ex-Leader</span>');
  if (m.neverMissed) out.push('<span class="ach-badge ach-never-missed">🎯 Perfect Record</span>');
  return out.length ? `<div class="ach-wrap">${out.join('')}</div>` : '';
}

// ─── RENDER: COMMAND STRUCTURE ───────────────────────────────────────────────
function renderSpotlight() {
  const byLevel = (a, b) => b.level - a.level || b.vp - a.vp;
  const tiers = [
    { key: 'Leader',    label: 'Leader',     icon: '👑', slug: 'leader'     },
    { key: 'Co-Leader', label: 'Co-Leaders', icon: '🔱', slug: 'co-leaders' },
    { key: 'Officer',   label: 'Officers',   icon: '⭐', slug: 'officers'   },
  ];

  document.getElementById('spotlight').innerHTML = tiers.map(({ key, label, icon, slug }) => {
    const group = MEMBERS.filter(m => m.role === key).sort(byLevel);
    const cards = group.map(m => {
      const cfg   = getPlayerConfig(m.name);
      const title = cfg.title ? `<div class="cmd-title">${esc(cfg.title)}</div>` : '';
      const avSize = m.role === 'Leader' ? 'lg' : 'md';
      return `
        <div class="cmd-card ${roleCls(m.role)}">
          ${renderAvatar(m, { size: avSize })}
          <div class="cmd-info">
            <div class="cmd-name">${esc(m.name)}</div>
            ${title}
          </div>
          <span class="level-badge">Lvl ${m.level}</span>
        </div>`;
    }).join('');

    return `
      <div class="cmd-tier cmd-tier-${slug}">
        <div class="tier-label tier-label-${slug}"><span>${icon}</span> ${label}</div>
        <div class="cmd-cards">${cards}</div>
      </div>`;
  }).join('');
}

// ─── RENDER: PREVIOUS LEADERS ────────────────────────────────────────────────
function renderPrevLeaders() {
  const order   = ['old man', 'Boomer'];
  const leaders = order.map(n => MEMBERS.find(m => m.name === n)).filter(Boolean);

  document.getElementById('prev-leaders-grid').innerHTML = leaders.map(m => `
    <div class="prev-leader-card">
      <div class="prev-leader-header">
        <div class="prev-leader-ribbon">🏛️ Former Leader</div>
        ${renderAvatar(m, { size: 'xl' })}
        <div class="prev-leader-info">
          <div class="prev-leader-name">${esc(m.name)}</div>
          <div class="prev-leader-badges">
            <span class="level-badge">Lvl ${m.level}</span>
            ${roleBadge(m.role)}
            ${m.neverMissed ? '<span class="ach-badge ach-never-missed">🎯 Perfect Record</span>' : ''}
          </div>
        </div>
      </div>
      <div class="prev-leader-stats">
        <div class="prev-stat">
          <div class="prev-stat-val">${m.vp.toLocaleString()}</div>
          <div class="prev-stat-lbl">🏅 Victory Points</div>
        </div>
        <div class="prev-stat-div"></div>
        <div class="prev-stat">
          <div class="prev-stat-val">${m.intel}</div>
          <div class="prev-stat-lbl">🔭 This Week Intel</div>
        </div>
        <div class="prev-stat-div"></div>
        <div class="prev-stat">
          <div class="prev-stat-val">${m.participation}%</div>
          <div class="prev-stat-lbl">📊 Participation</div>
        </div>
      </div>
    </div>`).join('');
}

// ─── RENDER: PLAYER OF THE WEEK ──────────────────────────────────────────────
function renderPOTW() {
  const p = POTW_DATA;
  const m = MEMBERS.find(x => x.name === p.name);
  if (!m) return;

  document.getElementById('potw-card').innerHTML = `
    <div class="potw-card">
      <div class="potw-left">
        <div class="potw-trophy">🏆</div>
        ${renderAvatar(m, { size: 'xl' })}
      </div>
      <div class="potw-body">
        <div class="potw-week">${esc(p.week)}</div>
        <div class="potw-name">${esc(p.name)}</div>
        <div class="potw-badges">
          <span class="level-badge">Lvl ${m.level}</span>
          ${roleBadge(m.role)}
        </div>
      </div>
      <div class="potw-stats">
        <div class="potw-stat">
          <div class="potw-stat-val">${p.vp.toLocaleString()}</div>
          <div class="potw-stat-lbl">🏅 Victory Points</div>
        </div>
        <div class="potw-stat-divider"></div>
        <div class="potw-stat">
          <div class="potw-stat-val">${p.intel}</div>
          <div class="potw-stat-lbl">🔭 Intel</div>
        </div>
        <div class="potw-stat-divider"></div>
        <div class="potw-stat">
          <div class="potw-stat-val">${m.participation}%</div>
          <div class="potw-stat-lbl">📊 Participation</div>
        </div>
      </div>
    </div>`;
}

// ─── RENDER: ACTIVITY HIGHLIGHTS ─────────────────────────────────────────────
function renderActivityHighlights() {
  const topVP       = [...MEMBERS].sort((a, b) => b.vp    - a.vp    || b.intel - a.intel).slice(0, 5);
  const topIntel    = [...MEMBERS].sort((a, b) => b.intel - a.intel || b.vp    - a.vp   ).slice(0, 5);
  const perfPart    = MEMBERS.filter(m => m.participation === 100);
  const activeCount = MEMBERS.filter(m => m.attacks > 0).length;
  const activeRate  = Math.round(activeCount / MEMBERS.length * 100);

  const summary = `
    <div class="activity-summary">
      <div class="act-card act-card--vp">
        <div class="act-icon">🏅</div>
        <div class="act-info">
          <div class="act-val">${topVP[0].vp.toLocaleString()}</div>
          <div class="act-lbl">Top VP This Week</div>
          <div class="act-name">${esc(topVP[0].name)}</div>
        </div>
      </div>
      <div class="act-card act-card--intel">
        <div class="act-icon">🔭</div>
        <div class="act-info">
          <div class="act-val">${topIntel[0].intel}</div>
          <div class="act-lbl">Top Intel</div>
          <div class="act-name">${esc(topIntel[0].name)}</div>
        </div>
      </div>
      <div class="act-card act-card--part">
        <div class="act-icon">💯</div>
        <div class="act-info">
          <div class="act-val">${perfPart.length}</div>
          <div class="act-lbl">Perfect Participation</div>
          <div class="act-name">of ${MEMBERS.length} members</div>
        </div>
      </div>
      <div class="act-card act-card--active">
        <div class="act-icon">⚔️</div>
        <div class="act-info">
          <div class="act-val">${activeRate}%</div>
          <div class="act-lbl">Active This Week</div>
          <div class="act-name">${activeCount} commanders attacked</div>
        </div>
      </div>
    </div>`;

  const lbRow = (m, i, score, color) => `
    <div class="lb-row">
      <span class="lb-rank">${i + 1}</span>
      ${renderAvatar(m, { size: 'sm' })}
      <span class="lb-name">${esc(m.name)}</span>
      <span class="lb-score" style="color:${color}">${score}</span>
    </div>`;

  const leaderboards = `
    <div class="activity-leaderboards">
      <div class="lb-panel">
        <div class="lb-header">🏅 Top Victory Points</div>
        ${topVP.map((m, i) => lbRow(m, i, m.vp.toLocaleString(), '#ffd700')).join('')}
      </div>
      <div class="lb-panel">
        <div class="lb-header">🔭 Top Intel</div>
        ${topIntel.map((m, i) => lbRow(m, i, m.intel, '#4fc3f7')).join('')}
      </div>
      <div class="lb-panel">
        <div class="lb-header">💯 Perfect Participation</div>
        ${perfPart.slice(0, 5).map((m, i) => lbRow(m, i, '100%', '#4caf50')).join('')}
        ${perfPart.length > 5 ? `<div class="lb-more">+${perfPart.length - 5} more with perfect attendance</div>` : ''}
      </div>
    </div>`;

  document.getElementById('activity-content').innerHTML = summary + leaderboards;
}

// ─── RENDER: ROSTER ──────────────────────────────────────────────────────────
function getSorted(key) {
  return [...MEMBERS].sort((a, b) => {
    if (key === 'vp')            return b.vp            - a.vp            || b.intel - a.intel;
    if (key === 'intel')         return b.intel         - a.intel         || b.vp    - a.vp;
    if (key === 'level')         return b.level         - a.level         || b.vp    - a.vp;
    if (key === 'participation') return b.participation - a.participation || b.intel - a.intel;
    return 0;
  });
}

function renderPart(pct) {
  const isZero = pct === 0;
  return `<div class="part-wrap">
    <div class="part-bar"><div class="part-fill${isZero ? ' zero' : ''}" style="width:${isZero ? 100 : pct}%"></div></div>
    <span class="part-pct">${pct}%</span>
  </div>`;
}

function renderRoster() {
  const filtered = getSorted(currentSort).filter(m => {
    const matchRole   = !currentRole   || m.role === currentRole;
    const matchSearch = !currentSearch || m.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchRole && matchSearch;
  });

  const tbody = document.getElementById('roster-body');
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No commanders found</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(m => {
    const vpRank = vpRankOf(m.name);
    const medal  = medalFor(vpRank);
    const rankCell   = medal
      ? `<span class="medal">${medal}</span>`
      : `<span class="rank-num">${vpRank}</span>`;
    const attacksCell = m.missed > 0
      ? `${m.attacks} <span class="miss-note">(${m.missed}✗)</span>`
      : `${m.attacks}`;

    return `
      <tr${vpRank <= 3 ? ' class="is-top-3"' : ''}>
        <td class="col-rank">${rankCell}</td>
        <td class="col-name">
          <div class="name-cell">
            ${renderAvatar(m, { size: 'sm' })}
            <div>
              <div>${esc(m.name)}</div>
              ${achBadges(m)}
            </div>
          </div>
        </td>
        <td class="col-level"><span class="level-badge">${m.level}</span></td>
        <td class="col-role">${roleBadge(m.role)}</td>
        <td class="col-vp">${m.vp.toLocaleString()}</td>
        <td class="col-intel">${m.intel}</td>
        <td class="col-attacks">${attacksCell}</td>
        <td class="col-part">${renderPart(m.participation)}</td>
      </tr>`;
  }).join('');
}

// ─── SCROLL ANIMATIONS ───────────────────────────────────────────────────────
function initAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.06 });
  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
function init() {
  renderSpotlight();
  renderPrevLeaders();
  renderPOTW();
  renderActivityHighlights();
  renderRoster();

  document.getElementById('search').addEventListener('input', e => {
    currentSearch = e.target.value;
    renderRoster();
  });

  document.getElementById('role-filter').addEventListener('change', e => {
    currentRole = e.target.value;
    renderRoster();
  });

  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentSort = btn.dataset.sort;
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRoster();
    });
  });

  initAnimations();
}

document.addEventListener('DOMContentLoaded', init);
