'use strict';

// DATA BINDINGS
// Static roster data lives in data.js so this file can focus on rendering.
const TASK_FORCE_DATA = window.TASK_FORCE_DATA || {};
const PLAYER_CONFIG = TASK_FORCE_DATA.playerConfig || {};
const LAST_UPDATED = TASK_FORCE_DATA.lastUpdated || '';
const CURRENT_OP = TASK_FORCE_DATA.currentOperation || '';
const POTW_DATA = TASK_FORCE_DATA.playerOfTheWeek || {};
const MEMBERS = TASK_FORCE_DATA.members || [];
const GRAVEYARD = TASK_FORCE_DATA.graveyard || [];
const ROLE_CHANGES = TASK_FORCE_DATA.roleChanges || [];

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
  if (m.notesGiver)                                        out.push('<span class="ach-badge ach-notes-giver">📋 Op Notes</span>');
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

function renderRosterCard(m, i) {
  const displayRank = i + 1;
  const medal = medalFor(displayRank);
  const rankLabel = medal || `#${displayRank}`;
  const attacksCell = m.missed > 0
    ? `${m.attacks} <span class="miss-note">(${m.missed}&times;)</span>`
    : `${m.attacks}`;

  return `
    <article class="roster-card${displayRank <= 3 ? ' is-top-3' : ''}${m.intel > 5000 ? ' is-veteran' : ''}">
      <div class="roster-card-header">
        <div class="roster-card-rank">${rankLabel}</div>
        ${renderAvatar(m, { size: 'md' })}
        <div class="roster-card-main">
          <div class="roster-card-name">${esc(m.name)}</div>
          <div class="roster-card-badges">
            <span class="level-badge">Lvl ${m.level}</span>
            ${roleBadge(m.role)}
          </div>
          ${achBadges(m)}
        </div>
      </div>
      <div class="roster-card-stats">
        <div class="roster-card-stat">
          <span class="roster-card-label">VP</span>
          <span class="roster-card-value roster-card-value--vp">${m.vp.toLocaleString()}</span>
        </div>
        <div class="roster-card-stat">
          <span class="roster-card-label">Intel</span>
          <span class="roster-card-value roster-card-value--intel">${m.intel}</span>
        </div>
        <div class="roster-card-stat">
          <span class="roster-card-label">Attacks</span>
          <span class="roster-card-value">${attacksCell}</span>
        </div>
        <div class="roster-card-stat roster-card-stat--full">
          <span class="roster-card-label">Participation</span>
          ${renderPart(m.participation)}
        </div>
      </div>
    </article>`;
}

function renderRoster() {
  const filtered = getSorted(currentSort).filter(m => {
    const matchRole   = !currentRole   || m.role === currentRole;
    const matchSearch = !currentSearch || m.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchRole && matchSearch;
  });

  const tbody = document.getElementById('roster-body');
  const cards = document.getElementById('roster-cards');
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No commanders found</td></tr>';
    cards.innerHTML = '<div class="roster-empty-card">No commanders found</div>';
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

  cards.innerHTML = filtered.map(renderRosterCard).join('');
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
    else if (c.type === 'joined')   { icon = '🆕'; cls = 'change-joined';   desc = 'Joined the task force'; }
    else if (c.type === 'departed') { icon = '👋'; cls = 'change-departed'; desc = `Left · last seen as ${c.from}`; }
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
  const animated = document.querySelectorAll('.animate-in');
  if (!('IntersectionObserver' in window)) {
    animated.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.06 });

  animated.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('is-visible');
    observer.observe(el);
  });
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
