'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const healthEl = document.getElementById('health');
const waveEl = document.getElementById('wave');
const enemiesEl = document.getElementById('enemies');
const scoreEl = document.getElementById('score');
const energyEl = document.getElementById('energy');

const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlay-text');
const restartBtn = document.getElementById('restart');

let width = 0;
let height = 0;
let dpr = 1;

const keys = new Set();

const LEVEL_COUNT = 10;
const LEVEL_LENGTH = 2600;
const GRAVITY = 1450;
const GROUND_HEIGHT = 108;

const state = {
  paused: false,
  gameOver: false,
  victory: false,
  wave: 1,
  score: 0,
  cameraX: 0,
  particles: [],
  enemies: [],
  levelEndX: LEVEL_LENGTH,
};

const player = {
  x: 120,
  y: 0,
  vx: 0,
  vy: 0,
  width: 36,
  height: 74,
  health: 100,
  energy: 100,
  maxWalkSpeed: 290,
  maxFlySpeed: 380,
  accel: 1650,
  airAccel: 1150,
  friction: 0.82,
  flyPower: 2000,
  onGround: false,
  facing: 1,
  punchCooldown: 0,
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function groundYAt() {
  return height - GROUND_HEIGHT;
}

function levelStartX(level) {
  return (level - 1) * LEVEL_LENGTH;
}

function resize() {
  dpr = Math.max(1, window.devicePixelRatio || 1);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function addParticles(x, y, color, count = 16, speedScale = 1) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (65 + Math.random() * 200) * speedScale;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.35 + Math.random() * 0.65,
      color,
      size: 2 + Math.random() * 4,
    });
  }
}

function spawnLevel(level) {
  state.enemies.length = 0;
  const startX = levelStartX(level);
  state.levelEndX = startX + LEVEL_LENGTH - 260;

  const count = 5 + level * 2;
  for (let i = 0; i < count; i += 1) {
    const x = startX + 380 + Math.random() * (LEVEL_LENGTH - 560);
    const baseY = groundYAt();

    state.enemies.push({
      x,
      y: baseY,
      vx: 0,
      vy: 0,
      width: 30,
      height: 62,
      speed: 95 + level * 20 + Math.random() * 40,
      hp: 32 + level * 12,
      maxHp: 32 + level * 12,
      touchDamage: 8 + Math.floor(level / 2),
      jumpTimer: Math.random() * 2,
      facing: -1,
      isFlying: Math.random() < 0.28 + level * 0.03,
    });
  }
}

function resetGame() {
  state.paused = false;
  state.gameOver = false;
  state.victory = false;
  state.wave = 1;
  state.score = 0;
  state.cameraX = 0;
  state.particles.length = 0;

  player.x = 120;
  player.y = groundYAt();
  player.vx = 0;
  player.vy = 0;
  player.health = 100;
  player.energy = 100;
  player.punchCooldown = 0;
  player.onGround = true;
  player.facing = 1;

  spawnLevel(state.wave);
  overlay.classList.add('hidden');
  updateHud();
}

function burstPunch() {
  if (player.punchCooldown > 0 || player.energy < 18) return;
  player.punchCooldown = 0.75;
  player.energy = clamp(player.energy - 18, 0, 100);

  const pulseRadius = 135;
  let hits = 0;

  for (const enemy of state.enemies) {
    const ex = enemy.x - player.x;
    const ey = (enemy.y - enemy.height * 0.5) - (player.y - player.height * 0.5);
    const dist = Math.hypot(ex, ey);
    if (dist > pulseRadius) continue;

    const power = (pulseRadius - dist) / pulseRadius;
    enemy.hp -= 28 + power * 32;
    enemy.vx += Math.sign(ex || player.facing) * (340 + power * 260);
    enemy.vy -= 180 + power * 160;
    hits += 1;
  }

  if (hits > 0) {
    state.score += hits * 45;
    addParticles(player.x, player.y - player.height * 0.5, '#9ec4ff', 28);
  }
}

function updatePlayer(dt) {
  let mx = 0;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) mx -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) mx += 1;

  const tryingFly = keys.has('KeyW') || keys.has('ArrowUp') || keys.has('Space');

  if (mx !== 0) {
    player.facing = mx > 0 ? 1 : -1;
  }

  const accel = player.onGround ? player.accel : player.airAccel;
  player.vx += mx * accel * dt;

  const topSpeed = player.onGround ? player.maxWalkSpeed : player.maxFlySpeed;
  player.vx = clamp(player.vx, -topSpeed, topSpeed);

  if (mx === 0 && player.onGround) {
    const damping = Math.pow(player.friction, dt * 60);
    player.vx *= damping;
    if (Math.abs(player.vx) < 2) player.vx = 0;
  }

  if (tryingFly && player.energy > 0) {
    player.vy -= player.flyPower * dt;
    player.energy = clamp(player.energy - 28 * dt, 0, 100);
    player.onGround = false;
  } else {
    player.energy = clamp(player.energy + 14 * dt, 0, 100);
  }

  player.vy += GRAVITY * dt;

  player.x += player.vx * dt;
  player.y += player.vy * dt;

  const groundY = groundYAt();
  if (player.y >= groundY) {
    player.y = groundY;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  player.x = Math.max(20, player.x);

  const levelMaxX = levelStartX(state.wave) + LEVEL_LENGTH - 100;
  player.x = Math.min(levelMaxX, player.x);

  state.cameraX = clamp(player.x - width * 0.33, levelStartX(state.wave), levelStartX(state.wave) + LEVEL_LENGTH - width);

  player.punchCooldown = Math.max(0, player.punchCooldown - dt);
}

function rectHit(a, b) {
  return (
    Math.abs(a.x - b.x) * 2 < (a.width + b.width) &&
    Math.abs((a.y - a.height * 0.5) - (b.y - b.height * 0.5)) * 2 < (a.height + b.height)
  );
}

function updateEnemies(dt) {
  const playerBox = {
    x: player.x,
    y: player.y,
    width: player.width,
    height: player.height,
  };

  for (let i = state.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = state.enemies[i];
    const dx = player.x - enemy.x;
    const distance = Math.abs(dx);

    enemy.facing = dx >= 0 ? 1 : -1;

    if (distance < 620) {
      enemy.vx += enemy.facing * enemy.speed * dt;
    }

    const maxEnemySpeed = enemy.isFlying ? 260 : 210;
    enemy.vx = clamp(enemy.vx, -maxEnemySpeed, maxEnemySpeed);

    enemy.jumpTimer -= dt;
    if (enemy.isFlying && distance < 400) {
      const targetY = player.y - 40;
      enemy.vy += clamp((targetY - enemy.y) * 4.8, -300, 300) * dt;
    } else {
      if (enemy.jumpTimer <= 0 && distance < 240) {
        enemy.vy -= 530;
        enemy.jumpTimer = 1.35 + Math.random() * 1.1;
      }
      enemy.vy += GRAVITY * dt;
    }

    enemy.x += enemy.vx * dt;
    enemy.y += enemy.vy * dt;

    if (!enemy.isFlying) {
      const gy = groundYAt();
      if (enemy.y >= gy) {
        enemy.y = gy;
        enemy.vy = 0;
      }
    }

    enemy.vx *= 0.92;

    const enemyBox = {
      x: enemy.x,
      y: enemy.y,
      width: enemy.width,
      height: enemy.height,
    };

    if (rectHit(playerBox, enemyBox)) {
      player.health = clamp(player.health - enemy.touchDamage * dt * 8, 0, 100);
      const knock = 220;
      player.vx -= enemy.facing * knock * dt;
      if (!player.onGround) {
        player.vy -= 130 * dt;
      }
    }

    if (enemy.hp <= 0) {
      state.score += 130 + state.wave * 22;
      addParticles(enemy.x, enemy.y - enemy.height * 0.5, '#ff7c7c', 20);
      state.enemies.splice(i, 1);
    }
  }
}

function updateParticles(dt) {
  for (let i = state.particles.length - 1; i >= 0; i -= 1) {
    const p = state.particles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.97;
    p.vy *= 0.97;

    if (p.life <= 0) {
      state.particles.splice(i, 1);
    }
  }
}

function updateGame(dt) {
  if (state.paused || state.gameOver || state.victory) return;

  updatePlayer(dt);
  updateEnemies(dt);
  updateParticles(dt);

  if (player.health <= 0) {
    state.gameOver = true;
    overlayText.textContent = `Mission Failed • Score ${Math.floor(state.score)}`;
    overlay.classList.remove('hidden');
  }

  if (!state.gameOver && player.x >= state.levelEndX && state.enemies.length === 0) {
    if (state.wave >= LEVEL_COUNT) {
      state.victory = true;
      overlayText.textContent = `All 10 Levels Cleared! Final Score ${Math.floor(state.score)}`;
      overlay.classList.remove('hidden');
    } else {
      state.wave += 1;
      player.x = levelStartX(state.wave) + 120;
      player.y = groundYAt();
      player.vx = 0;
      player.vy = 0;
      spawnLevel(state.wave);
      addParticles(player.x, player.y - 120, '#9fffd8', 36, 1.2);
    }
  }

  updateHud();
}

function drawCityBackdrop(levelStart) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#7ec7ff');
  sky.addColorStop(0.4, '#4f9ce4');
  sky.addColorStop(1, '#1a3f74');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const cloudShift = state.cameraX * 0.2;
  for (let i = 0; i < 12; i += 1) {
    const x = ((i * 260 - cloudShift) % (width + 340)) - 170;
    const y = 60 + (i % 4) * 42;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.ellipse(x, y, 56, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const buildingParallax = state.cameraX * 0.55;
  for (let i = -1; i < 20; i += 1) {
    const bx = i * 150 - (buildingParallax % 150);
    const bh = 120 + ((i + state.wave * 3) % 6) * 30;
    ctx.fillStyle = i % 2 === 0 ? '#173560' : '#102a50';
    ctx.fillRect(bx, groundYAt() - bh, 98, bh);
  }

  ctx.fillStyle = '#284821';
  ctx.fillRect(0, groundYAt(), width, GROUND_HEIGHT);

  for (let i = -1; i < 24; i += 1) {
    const tx = i * 120 - ((state.cameraX * 1.05) % 120);
    ctx.fillStyle = '#2f5b28';
    ctx.fillRect(tx + 6, groundYAt() + 18, 16, 42);
    ctx.beginPath();
    ctx.fillStyle = '#4f8a44';
    ctx.arc(tx + 14, groundYAt() + 14, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  const finishX = state.levelEndX - levelStart;
  const fx = finishX - state.cameraX + levelStart;
  ctx.fillStyle = '#fff';
  ctx.fillRect(fx, groundYAt() - 100, 6, 100);
  ctx.fillStyle = '#ff4545';
  ctx.fillRect(fx + 6, groundYAt() - 100, 34, 24);
}

function drawHumanCharacter(x, y, widthBody, heightBody, facing, palette, cape = false) {
  const sx = x - state.cameraX;
  ctx.save();
  ctx.translate(sx, y - heightBody);
  ctx.scale(facing, 1);

  if (cape) {
    ctx.fillStyle = palette.cape;
    ctx.beginPath();
    ctx.moveTo(-10, 16);
    ctx.quadraticCurveTo(-32, 54, -24, 92);
    ctx.lineTo(2, 72);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = palette.skin;
  ctx.beginPath();
  ctx.arc(0, 12, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.hair;
  ctx.beginPath();
  ctx.arc(0, 7, 10, Math.PI, 0);
  ctx.lineTo(10, 9);
  ctx.lineTo(-10, 9);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = palette.suit;
  ctx.fillRect(-8, 22, 16, 24);

  ctx.fillStyle = palette.accent;
  ctx.fillRect(-8, 42, 16, 6);

  ctx.fillStyle = palette.skin;
  ctx.fillRect(-14, 24, 6, 20);
  ctx.fillRect(8, 24, 6, 20);

  ctx.fillStyle = palette.boots;
  ctx.fillRect(-8, 46, 6, 24);
  ctx.fillRect(2, 46, 6, 24);

  ctx.restore();
}

function drawPlayer() {
  drawHumanCharacter(
    player.x,
    player.y,
    player.width,
    player.height,
    player.facing,
    {
      skin: '#ffd1b3',
      hair: '#231205',
      suit: '#2f72ff',
      accent: '#ffdb58',
      boots: '#d82828',
      cape: '#d91a1a',
    },
    true,
  );

  if (player.punchCooldown > 0.6) {
    const t = (0.75 - player.punchCooldown) / 0.15;
    const cx = player.x - state.cameraX;
    const cy = player.y - player.height * 0.5;
    ctx.strokeStyle = `rgba(158, 196, 255, ${1 - t})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 85 + t * 42, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawEnemies() {
  for (const enemy of state.enemies) {
    drawHumanCharacter(
      enemy.x,
      enemy.y,
      enemy.width,
      enemy.height,
      enemy.facing,
      {
        skin: '#f0c7aa',
        hair: '#3d2b1e',
        suit: '#6a2a7d',
        accent: '#9d5dcb',
        boots: '#2f1937',
        cape: '#6d3257',
      },
      enemy.isFlying,
    );

    const sx = enemy.x - state.cameraX;
    const ratio = clamp(enemy.hp / enemy.maxHp, 0, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(sx - 18, enemy.y - enemy.height - 12, 36, 4);
    ctx.fillStyle = '#7aff91';
    ctx.fillRect(sx - 18, enemy.y - enemy.height - 12, 36 * ratio, 4);
  }
}

function drawParticles() {
  for (const p of state.particles) {
    ctx.globalAlpha = clamp(p.life, 0, 1);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x - state.cameraX, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawHudHints() {
  const levelStart = levelStartX(state.wave);
  const progress = clamp((player.x - levelStart) / (LEVEL_LENGTH - 260), 0, 1);

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(24, height - 34, width - 48, 12);
  ctx.fillStyle = '#6ac8ff';
  ctx.fillRect(24, height - 34, (width - 48) * progress, 12);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px Arial';
  ctx.fillText(`Level ${state.wave} progress`, 24, height - 42);
}

function drawPause() {
  if (!state.paused || state.gameOver || state.victory) return;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', width * 0.5, height * 0.5);
  ctx.textAlign = 'left';
}

function render() {
  const levelStart = levelStartX(state.wave);
  drawCityBackdrop(levelStart);
  drawEnemies();
  drawParticles();
  drawPlayer();
  drawHudHints();
  drawPause();
}

function updateHud() {
  healthEl.textContent = Math.ceil(player.health);
  waveEl.textContent = state.wave;
  enemiesEl.textContent = state.enemies.length;
  scoreEl.textContent = Math.floor(state.score);
  energyEl.textContent = Math.ceil(player.energy);
}

window.addEventListener('resize', resize);

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyF') {
    event.preventDefault();
    burstPunch();
    return;
  }

  if (event.code === 'KeyP') {
    state.paused = !state.paused;
    return;
  }

  keys.add(event.code);
});

window.addEventListener('keyup', (event) => {
  keys.delete(event.code);
});

restartBtn.addEventListener('click', () => {
  resetGame();
});

let lastTime = performance.now();

function frame(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;

  updateGame(dt);
  render();

  requestAnimationFrame(frame);
}

resize();
resetGame();
requestAnimationFrame(frame);
