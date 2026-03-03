function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

const state = {
  showDefinitions: true,
  showBusiness: true,
};

function setVisibility() {
  qsa(".definable").forEach(el => {
    el.style.display = state.showDefinitions ? "" : "none";
  });
  qsa(".businessable").forEach(el => {
    el.style.display = state.showBusiness ? "" : "none";
  });
}

function setAllAccordions(open) {
  qsa("details.accordion").forEach(d => { d.open = open; });
}

function initNav() {
  const btn = qs("#navToggle");
  const menu = qs("#mobileNav");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    menu.hidden = expanded;
  });

  // Close mobile menu after click
  qsa("#mobileNav a").forEach(a => {
    a.addEventListener("click", () => {
      btn.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    });
  });
}

const quiz = [
  {
    q: "Which is the best definition of AI (per Module 1)?",
    options: [
      "A sentient computer brain that thinks like humans",
      "Systems capable of perception, reasoning, decision-making, and learning",
      "Any automation that runs a workflow",
      "A tool that always gives correct answers"
    ],
    answer: 1
  },
  {
    q: "Which statement is true?",
    options: [
      "AI is fully autonomous and needs no oversight",
      "AI replaces human judgment in complex work",
      "AI is not sentient and works best with human collaboration",
      "AI is magic"
    ],
    answer: 2
  },
  {
    q: "What’s a key difference between automation and AI?",
    options: [
      "Automation learns from data; AI follows strict rules",
      "Automation follows defined rules; AI can learn/adapt from data",
      "They’re the same thing",
      "Automation is only for robots"
    ],
    answer: 1
  },
  {
    q: "Which “type of AI” is common today?",
    options: [
      "General AI",
      "Super AI",
      "Narrow AI",
      "Sentient AI"
    ],
    answer: 2
  }
];

function renderQuiz(root, isLocked = false) {
  root.innerHTML = "";
  quiz.forEach((item, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "quiz__q";

    const h = document.createElement("h4");
    h.textContent = `${idx + 1}. ${item.q}`;
    wrap.appendChild(h);

    const opts = document.createElement("div");
    opts.className = "quiz__opts";

    item.options.forEach((opt, oidx) => {
      const label = document.createElement("label");
      label.className = "quiz__opt";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${idx}`;
      input.value = String(oidx);
      input.disabled = isLocked;

      const span = document.createElement("span");
      span.textContent = opt;

      label.appendChild(input);
      label.appendChild(span);
      opts.appendChild(label);
    });

    wrap.appendChild(opts);
    root.appendChild(wrap);
  });
}

function scoreQuiz(root) {
  let score = 0;
  quiz.forEach((item, idx) => {
    const picked = root.querySelector(`input[name="q${idx}"]:checked`);
    if (!picked) return;
    if (Number(picked.value) === item.answer) score += 1;
  });
  return score;
}

function lockQuiz(root) {
  root.querySelectorAll("input").forEach(i => i.disabled = true);
}

function initQuiz() {
  const root = qs("#quizRoot");
  const startBtn = qs("#startQuiz");
  const resetBtn = qs("#resetQuiz");
  if (!root || !startBtn || !resetBtn) return;

  let started = false;
  renderQuiz(root, true);

  startBtn.addEventListener("click", () => {
    if (!started) {
      started = true;
      renderQuiz(root, false);
      startBtn.textContent = "Submit";
      resetBtn.disabled = false;
      return;
    }

    const score = scoreQuiz(root);
    lockQuiz(root);

    const result = document.createElement("div");
    result.className = "quiz__score";
    result.textContent = `Score: ${score} / ${quiz.length}`;
    root.appendChild(result);

    startBtn.disabled = true;
  });

  resetBtn.addEventListener("click", () => {
    started = false;
    startBtn.disabled = false;
    startBtn.textContent = "Start quiz";
    resetBtn.disabled = true;
    renderQuiz(root, true);
  });
}

function initControls() {
  const def = qs("#toggleDefinitions");
  const biz = qs("#toggleBusiness");
  const expandAll = qs("#expandAll");
  const collapseAll = qs("#collapseAll");

  if (def) def.addEventListener("change", (e) => {
    state.showDefinitions = !!e.target.checked;
    setVisibility();
  });

  if (biz) biz.addEventListener("change", (e) => {
    state.showBusiness = !!e.target.checked;
    setVisibility();
  });

  if (expandAll) expandAll.addEventListener("click", () => setAllAccordions(true));
  if (collapseAll) collapseAll.addEventListener("click", () => setAllAccordions(false));

  setVisibility();
}

initNav();
initControls();
initQuiz();