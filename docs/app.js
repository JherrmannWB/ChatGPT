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
// Homepage guard (ensure latest home sections are visible)
// -------------------------------
const aiWeeklyIssue = {
  id: "ai-weekly-2026-03-08",
  title: "AI Weekly Digest",
  subtitle: "The biggest artificial intelligence developments from March 2–8, 2026.",
  issue: "01",
  publishedDate: "2026-03-08",
  coverageWindow: "March 2–8, 2026"
};

function ensureHomeNewsletter(container, resourcesSection) {
  if (!container || !resourcesSection) return;
  if (document.getElementById(aiWeeklyIssue.id)) return;

  const newsletter = document.createElement('section');
  newsletter.className = 'newsletter-section';
  newsletter.id = aiWeeklyIssue.id;

  newsletter.innerHTML = `
    <div class="newsletter-shell">
      <header class="newsletter-header">
        <p class="newsletter-kicker">Weekly AI Brief</p>
        <h2>${aiWeeklyIssue.title}</h2>
        <p class="newsletter-subtitle">${aiWeeklyIssue.subtitle}</p>
        <div class="newsletter-meta" aria-label="Newsletter issue details">
          <span>Issue ${aiWeeklyIssue.issue}</span>
          <span aria-hidden="true">•</span>
          <time datetime="${aiWeeklyIssue.publishedDate}">March 8, 2026</time>
          <span aria-hidden="true">•</span>
          <span>5 key stories</span>
        </div>
      </header>

      <section class="newsletter-lead" aria-label="Lead story">
        <article class="lead-story">
          <p class="story-tag">Lead Story</p>
          <h3>OpenAI launches GPT-5.4 for professional and agentic workflows</h3>
          <p class="story-summary">OpenAI introduced GPT-5.4 with stronger coding, tool use, computer-use capabilities, and long-context performance for professional work.</p>
          <div class="story-why-box"><strong>Why it matters</strong><p>AI platforms are shifting from chat interfaces toward practical agent workflows that can search, plan, act, and verify.</p></div>
        </article>
      </section>

      <section class="newsletter-grid" aria-label="Weekly AI stories">
        <article class="news-card"><p class="story-tag">Products</p><h3>ChatGPT adds Excel workflows and financial data integrations</h3><p class="story-summary">OpenAI announced ChatGPT for Excel and new integrations for spreadsheet-heavy workflows.</p><p class="story-takeaway">AI adoption is moving deeper into everyday business tools.</p></article>
        <article class="news-card"><p class="story-tag">Models</p><h3>Google rolls out Gemini 3.1 Flash-Lite</h3><p class="story-summary">Google introduced a lower-cost, high-volume model for production tasks.</p><p class="story-takeaway">Cost and speed are now critical deployment metrics.</p></article>
        <article class="news-card"><p class="story-tag">Enterprise</p><h3>Microsoft expands Dragon Copilot in healthcare</h3><p class="story-summary">New clinical workflow features and partner app integrations were announced at HIMSS 2026.</p><p class="story-takeaway">Vertical AI assistants are becoming enterprise platforms.</p></article>
        <article class="news-card"><p class="story-tag">Security</p><h3>Anthropic partners with Mozilla on Firefox security</h3><p class="story-summary">The partnership emphasizes AI in defensive and trust-focused infrastructure use cases.</p><p class="story-takeaway">Security outcomes are increasingly central to AI value.</p></article>
        <article class="news-card"><p class="story-tag">Devices</p><h3>MWC 2026 spotlights AI-first hardware</h3><p class="story-summary">Vendors highlighted AI-native laptops, tablets, and new concept devices.</p><p class="story-takeaway">AI is now a core device selling point.</p></article>
      </section>

      <section class="newsletter-bottom" aria-label="Weekly takeaway">
        <div class="newsletter-summary"><h3>Weekly takeaway</h3><p>This week’s market moved in three directions: stronger agent models, cheaper task-specific deployment models, and deeper integration into industry workflows and end-user devices.</p></div>
      </section>
    </div>
  `;

  container.insertBefore(newsletter, resourcesSection);
}

function ensureHomeResources(resourcesSection) {
  if (!resourcesSection) return;

  const hasModule2Card = Array.from(resourcesSection.querySelectorAll('h3')).some(h =>
    h.textContent.toLowerCase().includes('module 2 references')
  );
  if (hasModule2Card) return;

  resourcesSection.innerHTML = `
    <h2>Shared Resources</h2>
    <div class="grid2">
      <div class="card">
        <h3>Module 1 references</h3>
        <ul class="linkList">
          <li><a target="_blank" rel="noreferrer" href="https://sloanreview.mit.edu/top-artificial-intelligence-articles/">MIT Sloan Management Review — AI</a></li>
          <li><a target="_blank" rel="noreferrer" href="https://www.scientificamerican.com/artificial-intelligence/">Scientific American — AI</a></li>
          <li><a target="_blank" rel="noreferrer" href="https://builtin.com/artificial-intelligence/ai-basics">Built In — AI Basics</a></li>
        </ul>
      </div>
      <div class="card">
        <h3>Module 2 references</h3>
        <ul class="linkList">
          <li><a target="_blank" rel="noreferrer" href="https://www.ibm.com/think/topics/artificial-intelligence-history">IBM — History of AI</a></li>
          <li><a target="_blank" rel="noreferrer" href="https://www.britannica.com/technology/history-of-artificial-intelligence">Britannica — History of Artificial Intelligence</a></li>
          <li><a target="_blank" rel="noreferrer" href="https://www.coursera.org/articles/history-of-ai">Coursera — The History of AI Timeline</a></li>
          <li><a target="_blank" rel="noreferrer" href="https://www.dataversity.net/a-brief-history-of-deep-learning/">Dataversity — A Brief History of Deep Learning</a></li>
          <li><a target="_blank" rel="noreferrer" href="https://youtu.be/zjkBMFhNi_g?si=O-Gi0la5pW7ZBAtY">Andrej Karpathy — Intro to Large Language Models</a></li>
        </ul>
      </div>
    </div>
  `;
}

function initHomeModule2Guard() {
  const isHome = !document.body.dataset.module;
  if (!isHome) return;

  const nav = qs('.nav');
  if (nav && !nav.querySelector('a[href="./modules/module-2.html"]')) {
    const resourcesLink = nav.querySelector('a[href="#resources"]');
    const module2Link = document.createElement('a');
    module2Link.href = './modules/module-2.html';
    module2Link.textContent = 'Module 2';

    if (resourcesLink) nav.insertBefore(module2Link, resourcesLink);
    else nav.appendChild(module2Link);
  }

  const grid = qs('#homeModuleGrid') || qs('.grid2');
  if (!grid) return;

  let module2Card = Array.from(grid.querySelectorAll('.card')).find(card => {
    const heading = card.querySelector('h3');
    return heading && heading.textContent.toLowerCase().includes('module 2');
  });

  if (!module2Card) {
    module2Card = document.createElement('div');
    module2Card.className = 'card';
    module2Card.innerHTML = `
      <h3>Module 2 — The Rise of Artificial Intelligence</h3>
      <p>A decade-by-decade timeline from the 1950s to the 2020s with AI winters, booms, and key take-aways.</p>
      <a class="btn btn--primary" href="./modules/module-2.html">Open Module 2</a>
    `;

    const staleCard = Array.from(grid.querySelectorAll('.card')).find(card => {
      const heading = card.querySelector('h3');
      return heading && heading.textContent.trim().toLowerCase() === 'next up';
    });

    if (staleCard) staleCard.replaceWith(module2Card);
    else grid.appendChild(module2Card);
  }

  const container = qs('main .container');
  const resourcesSection = qs('#resources');
  ensureHomeNewsletter(container, resourcesSection);
  ensureHomeResources(resourcesSection);
}

// -------------------------------
// Initialize Everything
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initQuiz();
  initPresenterMode();
  initGlossary();
  initActiveNav();
  initHomeModule2Guard();
});