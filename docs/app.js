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
const mouse = { x: 0, y: 0, shooting: false };

const state = {
  paused: false,
  gameOver: false,
  victory: false,
  wave: 1,
  score: 0,
  nextWaveTimer: 0,
  lasers: [],
  particles: [],
  enemies: [],
};

const player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  radius: 20,
  health: 100,
  energy: 100,
  maxSpeed: 420,
  accel: 1600,
  friction: 0.9,
  shootCooldown: 0,
  punchCooldown: 0,
};

const WAVE_SETTINGS = {
  baseCount: 5,
  maxWave: 12,
  spawnPadding: 80,
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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

function resetGame() {
  state.paused = false;
  state.gameOver = false;
  state.victory = false;
  state.wave = 1;
  state.score = 0;
  state.nextWaveTimer = 0;
  state.lasers.length = 0;
  state.particles.length = 0;
  state.enemies.length = 0;

  player.x = width * 0.5;
  player.y = height * 0.65;
  player.vx = 0;
  player.vy = 0;
  player.health = 100;
  player.energy = 100;
  player.shootCooldown = 0;
  player.punchCooldown = 0;

  spawnWave();
  overlay.classList.add('hidden');
  updateHud();
}

function spawnWave() {
  const count = WAVE_SETTINGS.baseCount + (state.wave - 1) * 2;
  for (let i = 0; i < count; i += 1) {
    const side = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    const p = WAVE_SETTINGS.spawnPadding;

    if (side === 0) {
      x = -p;
      y = Math.random() * height;
    } else if (side === 1) {
      x = width + p;
      y = Math.random() * height;
    } else if (side === 2) {
      x = Math.random() * width;
      y = -p;
    } else {
      x = Math.random() * width;
      y = height + p;
    }

    const speed = 75 + state.wave * 14 + Math.random() * 50;
    const hp = 24 + state.wave * 9;

    state.enemies.push({
      x,
      y,
      vx: 0,
      vy: 0,
      radius: 14 + Math.random() * 7,
      speed,
      hp,
      maxHp: hp,
      touchDamage: 6 + Math.floor(state.wave / 2),
    });
  }

  updateHud();
}

function addExplosion(x, y, color, count = 16) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 190;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.3 + Math.random() * 0.7,
      color,
      size: 2 + Math.random() * 3,
    });
  }
}

function shootLaser() {
  if (player.shootCooldown > 0 || player.energy < 4) return;

  const dx = mouse.x - player.x;
  const dy = mouse.y - player.y;
  const mag = Math.hypot(dx, dy) || 1;

  state.lasers.push({
    x: player.x,
    y: player.y,
    vx: (dx / mag) * 920,
    vy: (dy / mag) * 920,
    life: 0.26,
    radius: 4,
  });

  player.shootCooldown = 0.08;
  player.energy = clamp(player.energy - 4, 0, 100);
}

function burstPunch() {
  if (player.punchCooldown > 0 || player.energy < 12) return;

  player.punchCooldown = 0.8;
  player.energy = clamp(player.energy - 12, 0, 100);

  const pulseRadius = 120;
  let hits = 0;

  for (const enemy of state.enemies) {
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const dist = Math.hypot(dx, dy);

    if (dist < pulseRadius) {
      const power = (pulseRadius - dist) / pulseRadius;
      enemy.hp -= 22 + power * 30;
      const knockback = 380 + power * 240;
      enemy.vx += (dx / (dist || 1)) * knockback;
      enemy.vy += (dy / (dist || 1)) * knockback;
      hits += 1;
    }
  }

  if (hits > 0) {
    state.score += hits * 40;
    addExplosion(player.x, player.y, '#9ec4ff', 30);
  }
}

function updatePlayer(dt) {
  let mx = 0;
  let my = 0;

  if (keys.has('KeyA') || keys.has('ArrowLeft')) mx -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) mx += 1;
  if (keys.has('KeyW') || keys.has('ArrowUp')) my -= 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) my += 1;

  const moving = mx !== 0 || my !== 0;
  const boost = keys.has('ShiftLeft') || keys.has('ShiftRight');

  if (moving) {
    const mag = Math.hypot(mx, my);
    mx /= mag;
    my /= mag;

    let accel = player.accel;
    let maxSpeed = player.maxSpeed;

    if (boost && player.energy > 0) {
      accel *= 1.35;
      maxSpeed *= 1.45;
      player.energy = clamp(player.energy - 24 * dt, 0, 100);
    }

    player.vx += mx * accel * dt;
    player.vy += my * accel * dt;

    const speed = Math.hypot(player.vx, player.vy);
    if (speed > maxSpeed) {
      const scale = maxSpeed / speed;
      player.vx *= scale;
      player.vy *= scale;
    }
  } else {
    const damping = Math.pow(player.friction, dt * 60);
    player.vx *= damping;
    player.vy *= damping;
  }

  if (!boost) {
    player.energy = clamp(player.energy + 16 * dt, 0, 100);
  }

  player.x += player.vx * dt;
  player.y += player.vy * dt;

  const margin = player.radius;
  player.x = clamp(player.x, margin, width - margin);
  player.y = clamp(player.y, margin + 90, height - margin);

  if (mouse.shooting) {
    shootLaser();
  }

  player.shootCooldown = Math.max(0, player.shootCooldown - dt);
  player.punchCooldown = Math.max(0, player.punchCooldown - dt);
}

function updateEnemies(dt) {
  for (let i = state.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = state.enemies[i];
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.hypot(dx, dy) || 1;

    const chase = enemy.speed;
    enemy.vx += (dx / dist) * chase * dt;
    enemy.vy += (dy / dist) * chase * dt;

    enemy.vx *= 0.95;
    enemy.vy *= 0.95;

    enemy.x += enemy.vx * dt;
    enemy.y += enemy.vy * dt;

    if (dist < enemy.radius + player.radius) {
      player.health = clamp(player.health - enemy.touchDamage * dt * 8, 0, 100);
      const push = 210;
      enemy.vx -= (dx / dist) * push * dt;
      enemy.vy -= (dy / dist) * push * dt;
    }

    if (enemy.hp <= 0) {
      state.score += 100 + state.wave * 15;
      addExplosion(enemy.x, enemy.y, '#ff6f6f', 20);
      state.enemies.splice(i, 1);
    }
  }
}

function updateLasers(dt) {
  for (let i = state.lasers.length - 1; i >= 0; i -= 1) {
    const laser = state.lasers[i];
    laser.x += laser.vx * dt;
    laser.y += laser.vy * dt;
    laser.life -= dt;

    for (let j = state.enemies.length - 1; j >= 0; j -= 1) {
      const enemy = state.enemies[j];
      const dx = enemy.x - laser.x;
      const dy = enemy.y - laser.y;
      const hitDist = enemy.radius + laser.radius;

      if (dx * dx + dy * dy <= hitDist * hitDist) {
        enemy.hp -= 16;
        laser.life = 0;
        addExplosion(laser.x, laser.y, '#ffe38f', 8);
        break;
      }
    }

    if (
      laser.life <= 0 ||
      laser.x < -40 || laser.x > width + 40 ||
      laser.y < -40 || laser.y > height + 40
    ) {
      state.lasers.splice(i, 1);
    }
  }
}

function updateParticles(dt) {
  for (let i = state.particles.length - 1; i >= 0; i -= 1) {
    const p = state.particles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.98;
    p.vy *= 0.98;

    if (p.life <= 0) {
      state.particles.splice(i, 1);
    }
  }
}

function updateGame(dt) {
  if (state.paused || state.gameOver || state.victory) return;

  updatePlayer(dt);
  updateEnemies(dt);
  updateLasers(dt);
  updateParticles(dt);

  if (player.health <= 0) {
    state.gameOver = true;
    overlayText.textContent = `Mission Failed • Score ${Math.floor(state.score)}`;
    overlay.classList.remove('hidden');
  }

  if (state.enemies.length === 0 && !state.gameOver) {
    if (state.wave >= WAVE_SETTINGS.maxWave) {
      state.victory = true;
      overlayText.textContent = `Metropolis Safe! Final Score ${Math.floor(state.score)}`;
      overlay.classList.remove('hidden');
    } else {
      state.nextWaveTimer += dt;
      if (state.nextWaveTimer >= 1.3) {
        state.wave += 1;
        state.nextWaveTimer = 0;
        spawnWave();
      }
    }
  }

  updateHud();
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#143572');
  sky.addColorStop(0.56, '#0c1f46');
  sky.addColorStop(1, '#070b14');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 80; i += 1) {
    const px = (i * 173) % width;
    const py = (i * 229) % height;
    const twinkle = 0.2 + Math.abs(Math.sin((performance.now() * 0.001) + i)) * 0.8;
    ctx.fillStyle = `rgba(255,255,255,${twinkle * 0.6})`;
    ctx.fillRect(px, py, 2, 2);
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
  ctx.fillRect(0, height - 100, width, 100);
}

function drawPlayer() {
  const angle = Math.atan2(player.vy, player.vx);

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(angle || -Math.PI / 2);

  ctx.fillStyle = '#3f79ff';
  ctx.beginPath();
  ctx.moveTo(22, 0);
  ctx.lineTo(-14, -13);
  ctx.lineTo(-4, 0);
  ctx.lineTo(-14, 13);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ff2f2f';
  ctx.fillRect(-4, -13, 8, 26);

  ctx.fillStyle = '#ffe17f';
  ctx.font = 'bold 15px Arial';
  ctx.fillText('S', -5, 5);

  ctx.restore();

  if (player.punchCooldown > 0.65) {
    const t = (0.8 - player.punchCooldown) / 0.15;
    ctx.strokeStyle = `rgba(158, 196, 255, ${1 - t})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 80 + t * 42, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawEnemies() {
  for (const enemy of state.enemies) {
    ctx.fillStyle = '#b51717';
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(enemy.x - 4, enemy.y - 3, 2, 0, Math.PI * 2);
    ctx.arc(enemy.x + 4, enemy.y - 3, 2, 0, Math.PI * 2);
    ctx.fill();

    const hpRatio = clamp(enemy.hp / enemy.maxHp, 0, 1);
    const w = enemy.radius * 2;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 10, w, 4);
    ctx.fillStyle = '#77ff93';
    ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 10, w * hpRatio, 4);
  }
}

function drawLasers() {
  for (const laser of state.lasers) {
    ctx.strokeStyle = '#ffea7f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(laser.x, laser.y);
    ctx.lineTo(laser.x - laser.vx * 0.02, laser.y - laser.vy * 0.02);
    ctx.stroke();
  }
}

function drawParticles() {
  for (const p of state.particles) {
    ctx.globalAlpha = clamp(p.life, 0, 1);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
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
  drawBackground();
  drawEnemies();
  drawLasers();
  drawParticles();
  drawPlayer();
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
  if (event.code === 'Space') {
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

canvas.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

canvas.addEventListener('mousedown', (event) => {
  if (event.button !== 0) return;
  mouse.shooting = true;
  shootLaser();
});

window.addEventListener('mouseup', () => {
  mouse.shooting = false;
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
