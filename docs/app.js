'use strict';

// ─── PLAYER CONFIG ──────────────────────────────────────────────────────────
// Personalize each player's avatar. Change emoji, color (hex), or title here.
// Colors: any 6-digit hex (#rrggbb). Emoji: any single emoji character.
// To add a player not listed: just add a new entry matching their exact name.
const PLAYER_CONFIG = {
  'MrBoomBoom':      { emoji: '👑', title: 'Commander',      color: '#ffd700' },
  'split ya lip':    { emoji: '🫦', title: 'This Week MVP',  color: '#ff6b35' },
  'Zed T Dog':       { emoji: '🐕', title: 'Top Dog',        color: '#4fc3f7' },
  'old man':         { emoji: '⚓', title: 'Founder',        color: '#66bb6a' },
  'Rando Calrisian': { emoji: '🎲', title: 'Wild Card',      color: '#ce93d8' },
  'gibbyrulz':       { emoji: '⚡', title: 'Shock Trooper',  color: '#fff176' },
  'FJ Fruitman':     { emoji: '☕', title: 'Perfect Record', color: '#ff8c00' },
  'boomerbeachin':   { emoji: '🏖️', title: 'Beach Bum',     color: '#80deea' },
  'PutteQuick':      { emoji: '⛳', title: 'Eagle Eye',      color: '#a5d6a7' },
  'Alexk1728':       { emoji: '🔭', title: 'Intel Scout',    color: '#4dd0e1' },
  'lumpy':           { emoji: '🏔️', title: 'Mountain',      color: '#90a4ae' },
  'MT':              { emoji: '🗻', title: 'Summit',         color: '#78909c' },
  'Boomer':          { emoji: '💥', title: 'Site Architect', color: '#ffd700' },
  'jenuine':         { emoji: '💎', title: 'Diamond',        color: '#4fc3f7' },
  'Papa Midnite':    { emoji: '🌙', title: 'Night Owl',      color: '#5c6bc0' },
  '☆CRAZY DAVE☆':   { emoji: '🌀', title: 'Wildman',        color: '#f06292' },
  'keg too':         { emoji: '🍺', title: 'Old School',     color: '#ffa726' },
  'th3.sid':         { emoji: '🎸', title: 'Rockstar',       color: '#ba68c8' },
  'BRUNOG':          { emoji: '🦁', title: 'Lion',           color: '#ffca28' },
  'CRAZYCRAFT':      { emoji: '🔨', title: 'Crafter',        color: '#ff7043' },
  'ACFrontRanger':   { emoji: '🏕️', title: 'Ranger',        color: '#66bb6a' },
  'MRchappel24':     { emoji: '📐', title: 'Architect',      color: '#42a5f5' },
  'COYG':            { emoji: '🫏', title: 'Team Dumbass',   color: '#ffd54f' },
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
  'Ramo19':          { emoji: '🪖', title: 'Recruit',        color: '#66bb6a' },
};

// ─── PLAYER OF THE WEEK ─────────────────────────────────────────────────────
// To update: change name, week, vp, and intel here.
const LAST_UPDATED = 'May 30, 2026';
const CURRENT_OP   = 'Massive Attack'; // Update each operation

const POTW_DATA = {
  name:  'split ya lip',
  week:  'Week of May 27, 2026',
  vp:    1613,
  intel: 387,
};

// ─── ROSTER DATA ─────────────────────────────────────────────────────────────
// To update stats: edit vp, intel, attacks, missed, participation for any player.
// participation is a percentage (0–100). missed = attack slots not used.
const MEMBERS = [
  { name: 'old man',         level: 65, role: 'Co-Leader', vp: 1304, intel: 15205, attacks: 488, missed: 4,  participation: 99,  exLeader: true },
  { name: 'FJ Fruitman',     level: 70, role: 'Co-Leader', vp: 1173, intel: 12513, attacks: 424, missed: 0,  participation: 100, neverMissed: true },
  { name: 'MrBoomBoom',      level: 66, role: 'Leader',    vp: 1229, intel: 11432, attacks: 440, missed: 12, participation: 97  },
  { name: 'PutteQuick',      level: 64, role: 'Officer',   vp: 1045, intel: 10743, attacks: 283, missed: 76, participation: 78  },
  { name: 'Boomer',          level: 55, role: 'Co-Leader', vp: 1004, intel: 7749,  attacks: 412, missed: 0,  participation: 100, exLeader: true, neverMissed: true, creator: true },
  { name: 'Papa Midnite',    level: 57, role: 'Officer',   vp: 935,  intel: 7638,  attacks: 305, missed: 84, participation: 78  },
  { name: 'Rando Calrisian', level: 63, role: 'Officer',   vp: 1269, intel: 7477,  attacks: 179, missed: 9,  participation: 95  },
  { name: 'COYG',            level: 70, role: 'Co-Leader', vp: 617,  intel: 6048,  attacks: 258, missed: 1,  participation: 99  },
  { name: 'th3.sid',         level: 59, role: 'Co-Leader', vp: 772,  intel: 5710,  attacks: 273, missed: 11, participation: 96  },
  { name: 'MT',              level: 56, role: 'Member',    vp: 994,  intel: 5448,  attacks: 161, missed: 51, participation: 75  },
  { name: 'Frei_Taz',        level: 59, role: 'Officer',   vp: 609,  intel: 4528,  attacks: 193, missed: 21, participation: 90  },
  { name: 'gibbyrulz',       level: 64, role: 'Officer',   vp: 1270, intel: 3168,  attacks: 76,  missed: 5,  participation: 93,  sabotagePass: true },
  { name: 'MRchappel24',     level: 61, role: 'Officer',   vp: 641,  intel: 2673,  attacks: 119, missed: 32, participation: 78  },
  { name: 'Boofoo',          level: 50, role: 'Officer',   vp: 588,  intel: 2442,  attacks: 111, missed: 21, participation: 84  },
  { name: 'Alexk1728',       level: 64, role: 'Officer',   vp: 1063, intel: 2316,  attacks: 61,  missed: 3,  participation: 95  },
  { name: 'SpartyOn',        level: 82, role: 'Member',    vp: 8,    intel: 2089,  attacks: 172, missed: 40, participation: 81  },
  { name: 'papagiorgio',     level: 67, role: 'Officer',   vp: 161,  intel: 2079,  attacks: 217, missed: 17, participation: 92  },
  { name: 'boomerbeachin',   level: 61, role: 'Officer',   vp: 1156, intel: 2059,  attacks: 89,  missed: 3,  participation: 96  },
  { name: 'cupidstunt',      level: 52, role: 'Officer',   vp: 164,  intel: 2024,  attacks: 224, missed: 13, participation: 94  },
  { name: 'jenuine',         level: 63, role: 'Officer',   vp: 977,  intel: 1866,  attacks: 93,  missed: 6,  participation: 93  },
  { name: 'keg too',         level: 78, role: 'Officer',   vp: 810,  intel: 1622,  attacks: 70,  missed: 9,  participation: 88  },
  { name: 'ACFrontRanger',   level: 70, role: 'Officer',   vp: 665,  intel: 1555,  attacks: 92,  missed: 1,  participation: 98  },
  { name: 'CRAZYCRAFT',      level: 62, role: 'Co-Leader', vp: 676,  intel: 1539,  attacks: 79,  missed: 0,  participation: 100 },
  { name: 'lumpy',           level: 63, role: 'Co-Leader', vp: 1051, intel: 1339,  attacks: 37,  missed: 1,  participation: 97  },
  { name: 'Rubberducky',     level: 43, role: 'Officer',   vp: 375,  intel: 1236,  attacks: 53,  missed: 3,  participation: 94  },
  { name: 'Ricky',           level: 62, role: 'Member',    vp: 491,  intel: 944,   attacks: 37,  missed: 7,  participation: 84  },
  { name: 'Zed T Dog',       level: 84, role: 'Officer',   vp: 1449, intel: 928,   attacks: 18,  missed: 0,  participation: 100 },
  { name: 'Commander',       level: 72, role: 'Officer',   vp: 0,    intel: 915,   attacks: 106, missed: 0,  participation: 100 },
  { name: 'Dr Faustus',      level: 81, role: 'Officer',   vp: 0,    intel: 897,   attacks: 113, missed: 4,  participation: 96  },
  { name: 'Skyfan113',       level: 51, role: 'Member',    vp: 479,  intel: 733,   attacks: 33,  missed: 4,  participation: 89  },
  { name: 'DaVinceC',        level: 35, role: 'Member',    vp: 577,  intel: 621,   attacks: 10,  missed: 2,  participation: 83  },
  { name: 'MrBoomBoomjr',    level: 42, role: 'Member',    vp: 583,  intel: 595,   attacks: 33,  missed: 0,  participation: 100 },
  { name: '☆CRAZY DAVE☆',   level: 54, role: 'Member',    vp: 892,  intel: 585,   attacks: 12,  missed: 6,  participation: 66  },
  { name: 'CHARLIES DAD',    level: 74, role: 'Officer',   vp: 186,  intel: 515,   attacks: 30,  missed: 1,  participation: 96  },
  { name: 'homer459',        level: 27, role: 'Officer',   vp: 190,  intel: 503,   attacks: 33,  missed: 0,  participation: 100 },
  { name: 'split ya lip',    level: 84, role: 'Officer',   vp: 1637, intel: 501,   attacks: 8,   missed: 0,  participation: 100 },
  { name: 'TwistedDonut',    level: 56, role: 'Member',    vp: 219,  intel: 441,   attacks: 64,  missed: 0,  participation: 100 },
  { name: 'Buda',            level: 78, role: 'Member',    vp: 133,  intel: 379,   attacks: 25,  missed: 6,  participation: 80  },
  { name: 'Snopy',           level: 49, role: 'Officer',   vp: 0,    intel: 359,   attacks: 79,  missed: 5,  participation: 94  },
  { name: 'BRUNOG',          level: 53, role: 'Member',    vp: 733,  intel: 313,   attacks: 15,  missed: 6,  participation: 71  },
  { name: 'ただん',           level: 81, role: 'Member',    vp: 118,  intel: 283,   attacks: 20,  missed: 5,  participation: 80  },
  { name: 'ميدو الطيار',     level: 69, role: 'Member',    vp: 258,  intel: 244,   attacks: 9,   missed: 1,  participation: 90  },
  { name: 'ringoskyblastr3', level: 84, role: 'Member',    vp: 5,    intel: 232,   attacks: 34,  missed: 0,  participation: 100 },
  { name: 'el conquestador', level: 81, role: 'Officer',   vp: 9,    intel: 227,   attacks: 28,  missed: 4,  participation: 87  },
  { name: '⛔Tired Bloke⛔',  level: 78, role: 'Officer',   vp: 51,   intel: 128,   attacks: 21,  missed: 2,  participation: 91  },
  { name: 'Black Naruto89',  level: 62, role: 'Member',    vp: 169,  intel: 40,    attacks: 2,   missed: 2,  participation: 50  },
  { name: 'Andy',            level: 57, role: 'Member',    vp: 5,    intel: 39,    attacks: 3,   missed: 1,  participation: 75  },
  { name: 'Ramo19',          level: 74, role: 'Member',    vp: 153,  intel: 7,     attacks: 0,   missed: 0,  participation: 0   },
];

// ─── GRAVEYARD ───────────────────────────────────────────────────────────────
// Players who have left or been kicked, with their last recorded stats.
const GRAVEYARD = [
  {
    name: 'JASHAN', departed: 'May 30, 2026', reason: 'Departed',
    lastRole: 'Member', lastLevel: 48, lastVP: 503,
    lastIntel: 24, lastAttacks: 0, lastParticipation: 0,
  },
];

// ─── ROLE CHANGES ────────────────────────────────────────────────────────────
// Tracks promotions, demotions, and new joins. Add an entry each update.
const ROLE_CHANGES = [
  { date: 'May 30, 2026', name: 'split ya lip',  from: 'Member', to: 'Officer', type: 'promotion' },
  { date: 'May 30, 2026', name: 'CHARLIES DAD',  from: 'Member', to: 'Officer', type: 'promotion' },
  { date: 'May 30, 2026', name: 'Ramo19',         from: null,     to: 'Member',  type: 'joined'    },
];

// ─── COMPUTED ────────────────────────────────────────────────────────────────
let currentSort   = 'intel';
let currentRole   = '';
let currentSearch = '';

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function roleCls(role) { return 'role-' + role.replace(' ', '-'); }

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
  const extraClass = m.creator ? ' avatar--creator' : '';

  return `<div class="avatar avatar-${size}${extraClass}" style="${style}">
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
  const change = ROLE_CHANGES.find(c => c.name === m.name);
  if (change?.type === 'joined')    out.push('<span class="ach-badge ach-new-recruit">🆕 New Recruit</span>');
  if (change?.type === 'promotion') out.push(`<span class="ach-badge ach-promoted">⬆️ Promoted to ${change.to}</span>`);
  if (change?.type === 'demotion')  out.push(`<span class="ach-badge ach-demoted">⬇️ Demoted to ${change.to}</span>`);
  if (m.intel > 5000)                                      out.push('<span class="ach-badge ach-veteran">🎖️ Veteran</span>');
  if (m.creator)                                           out.push('<span class="ach-badge ach-creator">💥 Site Architect</span>');
  if (m.exLeader)                                          out.push('<span class="ach-badge ach-ex-leader">🏛️ Ex-Leader</span>');
  if (m.missed === 0 && m.attacks > 0)                     out.push('<span class="ach-badge ach-never-missed">🎯 Perfect Record</span>');
  if (m.sabotagePass)                                      out.push('<span class="ach-badge ach-sabotage-pass">💣 Unlimited Sabotage Pass</span>');
  if (m.role === 'Member' && m.intel >= 500 && m.participation >= 90) out.push('<span class="ach-badge ach-promote-me">⭐ Promote Me</span>');
  if (m.role === 'Member' && m.intel >= 400 && m.intel < 500) out.push(`<span class="ach-badge ach-promo-watch">📈 Promotion Watch · ${500 - m.intel} intel to go</span>`);
  if (m.participation < 80 && m.role === 'Officer')        out.push('<span class="ach-badge ach-demotion-watch">⚠️ Demotion Watch</span>');
  else if (m.participation < 80)                           out.push('<span class="ach-badge ach-kick-watch">⚠️ Kick Watch</span>');
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
        <div class="cmd-card ${roleCls(m.role)}${m.intel > 5000 ? ' is-veteran' : ''}">
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
    <div class="prev-leader-card${m.intel > 5000 ? ' is-veteran' : ''}">
      <div class="prev-leader-header">
        <div class="prev-leader-ribbon">🏛️ Former Leader</div>
        ${renderAvatar(m, { size: 'xl' })}
        <div class="prev-leader-info">
          <div class="prev-leader-name">${esc(m.name)}</div>
          <div class="prev-leader-badges">
            <span class="level-badge">Lvl ${m.level}</span>
            ${roleBadge(m.role)}
            ${m.missed === 0 && m.attacks > 0 ? '<span class="ach-badge ach-never-missed">🎯 Perfect Record</span>' : ''}
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
          <div class="prev-stat-lbl">🔭 Total Intel</div>
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
          <div class="act-lbl">Highest VP</div>
          <div class="act-name">${esc(topVP[0].name)}</div>
        </div>
      </div>
      <div class="act-card act-card--intel">
        <div class="act-icon">🔭</div>
        <div class="act-info">
          <div class="act-val">${topIntel[0].intel}</div>
          <div class="act-lbl">Most Total Intel</div>
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
          <div class="act-lbl">Attackers Logged</div>
          <div class="act-name">${activeCount} commanders with attacks</div>
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
        <div class="lb-header">🔭 Total Intel</div>
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
    if (key === 'promote') {
      const aReady = a.role === 'Member' && a.intel >= 500 && a.participation >= 90;
      const bReady = b.role === 'Member' && b.intel >= 500 && b.participation >= 90;
      if (aReady !== bReady) return aReady ? -1 : 1;
      return b.intel - a.intel;
    }
    if (key === 'promo') {
      const aWatch = a.role === 'Member' && a.intel >= 400 && a.intel < 500;
      const bWatch = b.role === 'Member' && b.intel >= 400 && b.intel < 500;
      if (aWatch !== bWatch) return aWatch ? -1 : 1;
      if (aWatch) return b.intel - a.intel;
      return b.intel - a.intel;
    }
    if (key === 'watch') {
      const aWatch = a.participation < 80;
      const bWatch = b.participation < 80;
      if (aWatch !== bWatch) return aWatch ? -1 : 1;
      if (aWatch) return a.participation - b.participation;
      return b.participation - a.participation;
    }
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

  tbody.innerHTML = filtered.map((m, i) => {
    const displayRank = i + 1;
    const medal  = medalFor(displayRank);
    const rankCell   = medal
      ? `<span class="medal">${medal}</span>`
      : `<span class="rank-num">${displayRank}</span>`;
    const attacksCell = m.missed > 0
      ? `${m.attacks} <span class="miss-note">(${m.missed}✗)</span>`
      : `${m.attacks}`;

    return `
      <tr class="${displayRank <= 3 ? 'is-top-3' : ''}${m.intel > 5000 ? ' is-veteran' : ''}">
        <td class="col-rank" data-label="Rank">${rankCell}</td>
        <td class="col-name" data-label="Commander">
          <div class="name-cell">
            ${renderAvatar(m, { size: 'sm' })}
            <div>
              <div>${esc(m.name)}</div>
              ${achBadges(m)}
            </div>
          </div>
        </td>
        <td class="col-level" data-label="Level"><span class="level-badge">${m.level}</span></td>
        <td class="col-role" data-label="Role">${roleBadge(m.role)}</td>
        <td class="col-vp" data-label="VP">${m.vp.toLocaleString()}</td>
        <td class="col-intel" data-label="Intel">${m.intel}</td>
        <td class="col-attacks" data-label="Attacks">${attacksCell}</td>
        <td class="col-part" data-label="Participation">${renderPart(m.participation)}</td>
      </tr>`;
  }).join('');
}

// ─── RENDER: CHANGELOG ───────────────────────────────────────────────────────
function renderChangelog() {
  const el = document.getElementById('changelog-list');
  if (!el) return;
  if (!ROLE_CHANGES.length) {
    el.innerHTML = '<p class="no-changes">No recent changes.</p>';
    return;
  }
  el.innerHTML = ROLE_CHANGES.map(c => {
    const m = MEMBERS.find(x => x.name === c.name);
    const avatarHtml = m ? renderAvatar(m, { size: 'sm' }) : '';
    let icon, cls, desc;
    if (c.type === 'promotion') { icon = '⬆️'; cls = 'change-promoted'; desc = `${c.from} → ${c.to}`; }
    else if (c.type === 'demotion') { icon = '⬇️'; cls = 'change-demoted'; desc = `${c.from} → ${c.to}`; }
    else if (c.type === 'joined') { icon = '🆕'; cls = 'change-joined'; desc = 'Joined the task force'; }
    else { icon = '📝'; cls = ''; desc = c.note || ''; }
    return `
      <div class="change-item ${cls}">
        <span class="change-icon">${icon}</span>
        ${avatarHtml}
        <span class="change-name">${esc(c.name)}</span>
        <span class="change-desc">${desc}</span>
        <span class="change-date">${c.date}</span>
      </div>`;
  }).join('');
}

// ─── RENDER: GRAVEYARD ───────────────────────────────────────────────────────
function renderGraveyard() {
  const el = document.getElementById('graveyard-grid');
  if (!el) return;
  if (!GRAVEYARD.length) {
    el.innerHTML = '<p class="no-changes">No departed members on record.</p>';
    return;
  }
  el.innerHTML = GRAVEYARD.map(m => {
    const cfg   = getPlayerConfig(m.name);
    const emoji = cfg.emoji || '💀';
    const color = cfg.color || '#78909c';
    let style = `border-color:${color};`;
    try { style += `background:rgba(${hexToRgb(color)},0.10);`; } catch (_) {}
    return `
      <div class="grave-card">
        <div class="grave-avatar" style="${style}">
          <span class="avatar-emoji">${emoji}</span>
        </div>
        <div class="grave-info">
          <div class="grave-name">${esc(m.name)}</div>
          <div class="grave-meta">
            ${roleBadge(m.lastRole)}
            <span class="grave-date">Departed ${m.departed}</span>
          </div>
          <div class="grave-stats">
            <span>Lvl ${m.lastLevel}</span>
            <span class="grave-sep">·</span>
            <span>🔭 ${m.lastIntel} intel</span>
            <span class="grave-sep">·</span>
            <span>🏅 ${m.lastVP} VP</span>
            <span class="grave-sep">·</span>
            <span>${m.lastParticipation}% part.</span>
          </div>
        </div>
      </div>`;
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
  renderChangelog();
  renderGraveyard();
  renderRoster();
  document.getElementById('last-updated').textContent = `Last updated: ${LAST_UPDATED}`;
  document.getElementById('current-op-display').textContent = CURRENT_OP;

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
