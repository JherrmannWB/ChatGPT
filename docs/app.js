'use strict';

const MEMBERS = [
  { name: 'split ya lip',    level: 84, role: 'Member',    vp: 1613, intel: 371, attacks: 4, missed: 0, participation: 100 },
  { name: 'Zed T Dog',       level: 84, role: 'Officer',   vp: 1446, intel: 227, attacks: 3, missed: 0, participation: 100 },
  { name: 'old man',         level: 65, role: 'Co-Leader', vp: 1307, intel: 144, attacks: 4, missed: 0, participation: 100 },
  { name: 'Rando Calrisian', level: 63, role: 'Officer',   vp: 1263, intel: 147, attacks: 3, missed: 0, participation: 100 },
  { name: 'gibbyrulz',       level: 64, role: 'Officer',   vp: 1261, intel: 90,  attacks: 4, missed: 0, participation: 100 },
  { name: 'MrBoomBoom',      level: 66, role: 'Leader',    vp: 1228, intel: 96,  attacks: 4, missed: 0, participation: 100 },
  { name: 'FJ Fruitman',     level: 70, role: 'Co-Leader', vp: 1167, intel: 162, attacks: 3, missed: 0, participation: 100 },
  { name: 'boomerbeachin',   level: 61, role: 'Officer',   vp: 1158, intel: 99,  attacks: 3, missed: 0, participation: 100 },
  { name: 'PutteQuick',      level: 64, role: 'Officer',   vp: 1062, intel: 132, attacks: 4, missed: 0, participation: 100 },
  { name: 'Alexk1728',       level: 64, role: 'Officer',   vp: 1061, intel: 134, attacks: 3, missed: 0, participation: 100 },
  { name: 'lumpy',           level: 63, role: 'Co-Leader', vp: 1028, intel: 138, attacks: 4, missed: 0, participation: 100 },
  { name: 'MT',              level: 55, role: 'Member',    vp: 1003, intel: 122, attacks: 3, missed: 0, participation: 100 },
  { name: 'Boomer',          level: 55, role: 'Co-Leader', vp: 996,  intel: 76,  attacks: 3, missed: 0, participation: 100 },
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

const vpRanking = [...MEMBERS]
  .sort((a, b) => b.vp - a.vp || b.intel - a.intel)
  .map(m => m.name);

let currentSort   = 'vp';
let currentRole   = '';
let currentSearch = '';

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

function renderSpotlight() {
  const byLevel = (a, b) => b.level - a.level || b.vp - a.vp;
  const tiers = [
    { key: 'Leader',    label: 'Leader' },
    { key: 'Co-Leader', label: 'Co-Leaders' },
    { key: 'Officer',   label: 'Officers' },
  ];
  document.getElementById('spotlight').innerHTML = tiers.map(({ key, label }) => {
    const group = MEMBERS.filter(m => m.role === key).sort(byLevel);
    const cards = group.map(m => `
      <div class="cmd-card ${roleCls(m.role)}">
        <div class="cmd-name">${esc(m.name)}</div>
        <span class="level-badge">Lvl ${m.level}</span>
      </div>`).join('');
    const slug = label.toLowerCase().replace(/[- ]/g, '-');
    return `
      <div class="cmd-tier cmd-tier-${slug}">
        <div class="tier-label tier-label-${slug}">${label}</div>
        <div class="cmd-cards">${cards}</div>
      </div>`;
  }).join('');
}

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
    const rankCell = medal
      ? `<span style="font-size:20px">${medal}</span>`
      : `<span class="rank-num">${vpRank}</span>`;
    const attacksCell = m.missed > 0
      ? `${m.attacks} <span class="miss-note">(${m.missed}✗)</span>`
      : `${m.attacks}`;

    return `
      <tr${vpRank <= 3 ? ' class="is-top-3"' : ''}>
        <td class="col-rank">${rankCell}</td>
        <td class="col-name">${esc(m.name)}</td>
        <td class="col-level"><span class="level-badge">${m.level}</span></td>
        <td class="col-role"><span class="role-badge ${roleCls(m.role)}">${m.role}</span></td>
        <td class="col-vp">${m.vp.toLocaleString()}</td>
        <td class="col-intel">${m.intel}</td>
        <td class="col-attacks">${attacksCell}</td>
        <td class="col-part">${renderPart(m.participation)}</td>
      </tr>`;
  }).join('');
}

function init() {
  renderSpotlight();
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
}

document.addEventListener('DOMContentLoaded', init);
