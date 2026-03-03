// ===============================
// AI Training Companion - app.js
// ===============================

// -------------------------------
// Utility helpers
// -------------------------------
function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

// -------------------------------
// Quiz Data (Module 1)
// -------------------------------
const quizData = [
  {
    question: "Which best defines AI?",
    options: [
      "A sentient computer that thinks like humans",
      "Systems capable of perception, reasoning, decision-making, and learning",
      "Any automated workflow",
      "A system that always produces correct answers"
    ],
    answer: 1
  },
  {
    question: "Which statement is true?",
    options: [
      "AI is fully autonomous and requires no oversight",
      "AI replaces professional judgment",
      "AI is not sentient and requires human validation",
      "AI and automation are the same thing"
    ],
    answer: 2
  },
  {
    question: "What distinguishes AI from automation?",
    options: [
      "Automation learns from data",
      "AI follows strict if/then rules only",
      "Automation follows rules; AI can learn from data",
      "There is no difference"
    ],
    answer: 2
  },
  {
    question: "Which type of AI exists today?",
    options: [
      "General AI",
      "Super AI",
      "Narrow AI",
      "Sentient AI"
    ],
    answer: 2
  }
];

// -------------------------------
// Quiz Rendering
// -------------------------------
function renderQuiz(root) {
  root.innerHTML = "";

  quizData.forEach((item, qIndex) => {
    const wrapper = document.createElement("div");
    wrapper.className = "quiz__q";

    const title = document.createElement("h4");
    title.textContent = `${qIndex + 1}. ${item.question}`;
    wrapper.appendChild(title);

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "quiz__opts";

    item.options.forEach((option, oIndex) => {
      const label = document.createElement("label");
      label.className = "quiz__opt";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${qIndex}`;
      input.value = oIndex;

      const span = document.createElement("span");
      span.textContent = option;

      label.appendChild(input);
      label.appendChild(span);
      optionsWrap.appendChild(label);
    });

    wrapper.appendChild(optionsWrap);
    root.appendChild(wrapper);
  });
}

function scoreQuiz(root) {
  let score = 0;

  quizData.forEach((item, qIndex) => {
    const selected = root.querySelector(`input[name="q${qIndex}"]:checked`);
    if (!selected) return;

    if (Number(selected.value) === item.answer) {
      score++;
    }
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
  const feedback = qs("#quizFeedback");

  if (!root || !startBtn || !resetBtn) return;

  renderQuiz(root);

  startBtn.addEventListener("click", () => {
    const score = scoreQuiz(root);
    lockQuiz(root);

    if (feedback) {
      feedback.textContent = `Score: ${score} / ${quizData.length}`;
    }

    startBtn.disabled = true;
    resetBtn.disabled = false;
  });

  resetBtn.addEventListener("click", () => {
    renderQuiz(root);
    if (feedback) feedback.textContent = "";
    startBtn.disabled = false;
    resetBtn.disabled = true;
  });
}

// -------------------------------
// Presenter Mode
// -------------------------------
function initPresenterMode() {
  const presenterBtn = qs("#presenterToggle");
  if (!presenterBtn) return;

  presenterBtn.addEventListener("click", () => {
    document.body.classList.toggle("presenter");

    presenterBtn.textContent =
      document.body.classList.contains("presenter")
        ? "Exit presenter"
        : "Presenter mode";
  });
}

// -------------------------------
// Glossary Drawer
// -------------------------------
function initGlossary() {
  const glossaryBtn = qs("#glossaryToggle");
  const glossaryDrawer = qs("#glossaryDrawer");
  const glossaryClose = qs("#glossaryClose");

  if (!glossaryBtn || !glossaryDrawer) return;

  glossaryBtn.addEventListener("click", () => {
    glossaryDrawer.hidden = !glossaryDrawer.hidden;
  });

  if (glossaryClose) {
    glossaryClose.addEventListener("click", () => {
      glossaryDrawer.hidden = true;
    });
  }
}

// -------------------------------
// Sidebar Active Section Highlight
// -------------------------------
function initActiveNav() {
  const navLinks = qsa(".sideNav__link");
  if (!navLinks.length) return;

  const sections = navLinks
    .map(link => {
      const id = link.getAttribute("href").replace("#", "");
      return { link, section: document.getElementById(id) };
    })
    .filter(x => x.section);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      sections.forEach(item => {
        item.link.classList.toggle(
          "is-active",
          item.section.id === entry.target.id
        );
      });
    });
  }, {
    threshold: 0.3,
    rootMargin: "-20% 0px -60% 0px"
  });

  sections.forEach(item => observer.observe(item.section));
}

// -------------------------------
// Initialize Everything
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initQuiz();
  initPresenterMode();
  initGlossary();
  initActiveNav();
});