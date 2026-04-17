// -----------------------
// Snake Rush
// -----------------------
const snakeCanvas = document.getElementById("snakeCanvas");
const snakeCtx = snakeCanvas.getContext("2d");
const snakeScoreEl = document.getElementById("snakeScore");
const snakeBestEl = document.getElementById("snakeBest");
const snakeStartBtn = document.getElementById("snakeStart");

const snakeState = {
  size: 18,
  tile: snakeCanvas.width / 18,
  snake: [{ x: 9, y: 9 }],
  dir: { x: 1, y: 0 },
  nextDir: { x: 1, y: 0 },
  food: { x: 4, y: 4 },
  score: 0,
  speed: 130,
  timer: null,
  running: false,
  best: Number(localStorage.getItem("arcadeSnakeBest") || 0)
};

snakeBestEl.textContent = String(snakeState.best);

function drawSnake() {
  snakeCtx.fillStyle = "#040918";
  snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

  snakeCtx.strokeStyle = "rgba(120, 170, 255, 0.12)";
  for (let i = 0; i < snakeState.size; i += 1) {
    const pos = i * snakeState.tile;
    snakeCtx.beginPath();
    snakeCtx.moveTo(pos, 0);
    snakeCtx.lineTo(pos, snakeCanvas.height);
    snakeCtx.moveTo(0, pos);
    snakeCtx.lineTo(snakeCanvas.width, pos);
    snakeCtx.stroke();
  }

  snakeCtx.fillStyle = "#ff5fa2";
  snakeCtx.beginPath();
  snakeCtx.arc(
    snakeState.food.x * snakeState.tile + snakeState.tile / 2,
    snakeState.food.y * snakeState.tile + snakeState.tile / 2,
    snakeState.tile * 0.32,
    0,
    Math.PI * 2
  );
  snakeCtx.fill();

  snakeState.snake.forEach((seg, idx) => {
    snakeCtx.fillStyle = idx === 0 ? "#5be6ff" : "#53ff9f";
    snakeCtx.fillRect(
      seg.x * snakeState.tile + 2,
      seg.y * snakeState.tile + 2,
      snakeState.tile - 4,
      snakeState.tile - 4
    );
  });
}

function spawnFood() {
  while (true) {
    const x = Math.floor(Math.random() * snakeState.size);
    const y = Math.floor(Math.random() * snakeState.size);
    const overlap = snakeState.snake.some((seg) => seg.x === x && seg.y === y);
    if (!overlap) {
      snakeState.food = { x, y };
      return;
    }
  }
}

function stepSnake() {
  snakeState.dir = snakeState.nextDir;
  const head = snakeState.snake[0];
  const next = {
    x: head.x + snakeState.dir.x,
    y: head.y + snakeState.dir.y
  };

  const out =
    next.x < 0 || next.y < 0 ||
    next.x >= snakeState.size || next.y >= snakeState.size;
  const hitSelf = snakeState.snake.some((seg) => seg.x === next.x && seg.y === next.y);

  if (out || hitSelf) {
    clearInterval(snakeState.timer);
    snakeState.running = false;
    snakeStartBtn.textContent = "Play Again";
    return;
  }

  snakeState.snake.unshift(next);

  if (next.x === snakeState.food.x && next.y === snakeState.food.y) {
    snakeState.score += 10;
    snakeScoreEl.textContent = String(snakeState.score);
    spawnFood();
    snakeState.speed = Math.max(70, snakeState.speed - 3);
    clearInterval(snakeState.timer);
    snakeState.timer = setInterval(stepSnake, snakeState.speed);
  } else {
    snakeState.snake.pop();
  }

  if (snakeState.score > snakeState.best) {
    snakeState.best = snakeState.score;
    localStorage.setItem("arcadeSnakeBest", String(snakeState.best));
    snakeBestEl.textContent = String(snakeState.best);
  }

  drawSnake();
}

function resetSnake() {
  clearInterval(snakeState.timer);
  snakeState.snake = [{ x: 9, y: 9 }];
  snakeState.dir = { x: 1, y: 0 };
  snakeState.nextDir = { x: 1, y: 0 };
  snakeState.score = 0;
  snakeState.speed = 130;
  snakeState.running = true;
  snakeScoreEl.textContent = "0";
  spawnFood();
  drawSnake();
  snakeState.timer = setInterval(stepSnake, snakeState.speed);
  snakeStartBtn.textContent = "Restart";
}

snakeStartBtn.addEventListener("click", resetSnake);
document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  const map = {
    arrowup: { x: 0, y: -1 }, w: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
    arrowleft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 }, d: { x: 1, y: 0 }
  };
  const next = map[key];
  if (!next) return;
  const reverse = next.x === -snakeState.dir.x && next.y === -snakeState.dir.y;
  if (!reverse) snakeState.nextDir = next;
});

drawSnake();

// -----------------------
// Memory Matrix
// -----------------------
const memoryGrid = document.getElementById("memoryGrid");
const memoryMovesEl = document.getElementById("memoryMoves");
const memoryMatchedEl = document.getElementById("memoryMatched");
const memoryResetBtn = document.getElementById("memoryReset");

const symbols = ["🎮", "🕹️", "⭐", "🚀", "👾", "💎", "🔥", "⚡"];
const memoryState = {
  cards: [],
  open: [],
  lock: false,
  matched: 0,
  moves: 0
};

function shuffle(list) {
  const clone = [...list];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function renderMemory() {
  memoryGrid.innerHTML = "";
  memoryState.cards.forEach((card, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memory-card";
    button.textContent = card.symbol;
    if (card.revealed) button.classList.add("is-revealed");
    if (card.matched) button.classList.add("is-matched");
    button.disabled = card.matched;
    button.addEventListener("click", () => flipCard(index));
    memoryGrid.appendChild(button);
  });
}

function syncMemoryStats() {
  memoryMovesEl.textContent = String(memoryState.moves);
  memoryMatchedEl.textContent = String(memoryState.matched);
}

function flipCard(index) {
  if (memoryState.lock) return;
  const card = memoryState.cards[index];
  if (card.revealed || card.matched) return;

  card.revealed = true;
  memoryState.open.push(index);
  renderMemory();

  if (memoryState.open.length < 2) return;

  memoryState.moves += 1;
  memoryState.lock = true;
  syncMemoryStats();

  const [a, b] = memoryState.open;
  const first = memoryState.cards[a];
  const second = memoryState.cards[b];

  if (first.symbol === second.symbol) {
    first.matched = true;
    second.matched = true;
    memoryState.matched += 1;
    memoryState.open = [];
    memoryState.lock = false;
    syncMemoryStats();
    renderMemory();
    return;
  }

  setTimeout(() => {
    first.revealed = false;
    second.revealed = false;
    memoryState.open = [];
    memoryState.lock = false;
    renderMemory();
  }, 700);
}

function resetMemory() {
  const board = shuffle([...symbols, ...symbols]).map((symbol) => ({
    symbol,
    revealed: false,
    matched: false
  }));

  memoryState.cards = board;
  memoryState.open = [];
  memoryState.lock = false;
  memoryState.matched = 0;
  memoryState.moves = 0;
  syncMemoryStats();
  renderMemory();
}

memoryResetBtn.addEventListener("click", resetMemory);
resetMemory();

// -----------------------
// Target Tap
// -----------------------
const targetArena = document.getElementById("targetArena");
const targetDot = document.getElementById("targetDot");
const targetOverlay = document.getElementById("targetOverlay");
const targetStartBtn = document.getElementById("targetStart");
const targetHitsEl = document.getElementById("targetHits");
const targetTimeEl = document.getElementById("targetTime");
const targetBestEl = document.getElementById("targetBest");

const targetState = {
  running: false,
  hits: 0,
  timeLeft: 30,
  tickTimer: null,
  hopTimer: null,
  best: Number(localStorage.getItem("arcadeTargetBest") || 0)
};

targetBestEl.textContent = String(targetState.best);

function moveTarget() {
  const area = targetArena.getBoundingClientRect();
  const maxX = Math.max(0, area.width - 46);
  const maxY = Math.max(0, area.height - 46);
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);
  targetDot.style.left = `${x}px`;
  targetDot.style.top = `${y}px`;
}

function stopTargetRound(message) {
  targetState.running = false;
  clearInterval(targetState.tickTimer);
  clearInterval(targetState.hopTimer);
  targetDot.style.display = "none";
  targetOverlay.textContent = message;
  targetOverlay.style.display = "grid";
  targetStartBtn.textContent = "Play Again";

  if (targetState.hits > targetState.best) {
    targetState.best = targetState.hits;
    localStorage.setItem("arcadeTargetBest", String(targetState.best));
    targetBestEl.textContent = String(targetState.best);
  }
}

function startTargetRound() {
  targetState.running = true;
  targetState.hits = 0;
  targetState.timeLeft = 30;
  targetHitsEl.textContent = "0";
  targetTimeEl.textContent = "30";
  targetOverlay.style.display = "none";
  targetDot.style.display = "block";
  targetStartBtn.textContent = "Running...";

  moveTarget();
  clearInterval(targetState.tickTimer);
  clearInterval(targetState.hopTimer);

  targetState.tickTimer = setInterval(() => {
    targetState.timeLeft -= 1;
    targetTimeEl.textContent = String(targetState.timeLeft);
    if (targetState.timeLeft <= 0) {
      stopTargetRound(`Time! Final score: ${targetState.hits}`);
    }
  }, 1000);

  targetState.hopTimer = setInterval(moveTarget, 650);
}

targetStartBtn.addEventListener("click", () => {
  if (!targetState.running) startTargetRound();
});

targetDot.addEventListener("click", () => {
  if (!targetState.running) return;
  targetState.hits += 1;
  targetHitsEl.textContent = String(targetState.hits);
  moveTarget();
});
