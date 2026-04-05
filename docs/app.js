const slides = [
  {
    type: "hero",
    eyebrow: "Pitch Deck · 2026",
    title: "PowerPoint was a product. AetherDeck is an experience.",
    lead:
      "This is what presentations look like when design systems, storytelling, and real-time interaction are built directly into the canvas.",
    chips: ["Cinematic transitions", "Keyboard first", "Presenter intelligence", "Zero install"],
    notes:
      "Set the tone: this is not a clone. It is a category jump from static slides to an operating system for live communication.",
    cues: ["Pause after the headline", "Gesture toward the progress rail", "Demo keyboard arrows"]
  },
  {
    type: "stats",
    title: "Built to impress technical and executive audiences",
    lead: "Every scene is optimized for clarity, pace, and emotional impact.",
    stats: [
      { value: "16:9", label: "True stage ratio with adaptive scaling" },
      { value: "60fps", label: "Fluid transitions and micro-interactions" },
      { value: "1 tap", label: "Fullscreen presenter launch" }
    ],
    notes:
      "Frame this as design + engineering excellence. It should feel premium before a single bullet point is read.",
    cues: ["Land each stat deliberately", "Use autoplay toggle to show control"]
  },
  {
    type: "split",
    title: "Story architecture that keeps attention",
    lead:
      "Each deck becomes a sequence of visual chapters with built-in rhythm. The system handles pace so the speaker can focus on persuasion.",
    leftTitle: "Why teams switch",
    leftItems: [
      "Beautiful by default, without template hunting",
      "Slides that feel like product demos",
      "Works from any browser—no plugin, no install",
      "Data-rich moments can coexist with bold cinematic pages"
    ],
    rightTitle: "Audience impact",
    rightItems: [
      "Higher retention through movement and hierarchy",
      "Fewer cluttered slides, stronger narrative arc",
      "Professional polish for client-facing moments",
      "Presenter confidence with notes and cueing"
    ],
    notes:
      "This is your business case slide. Contrast old 'bullet cemetery' decks with guided visual narratives.",
    cues: ["Keep pace brisk", "Emphasize confidence and retention"]
  },
  {
    type: "quote",
    title: "“If PowerPoint were invented today, this is what it would look like.”",
    lead: "Designed for modern teams that expect software to feel intelligent, beautiful, and alive.",
    notes:
      "Close with conviction. Invite them to imagine their own keynote, sales deck, or board update in this format.",
    cues: ["Slow down", "End with Present button click"]
  }
];

const state = {
  index: 0,
  autoplay: false,
  autoplayTimer: null,
  dark: true
};

const qs = (selector) => document.querySelector(selector);

function renderSlide(slide) {
  if (slide.type === "hero") {
    return `
      <div class="slide slide--hero">
        <p class="eyebrow">${slide.eyebrow}</p>
        <h1>${slide.title}</h1>
        <p class="lead">${slide.lead}</p>
        <div class="chipRow">${slide.chips.map((chip) => `<span>${chip}</span>`).join("")}</div>
      </div>`;
  }

  if (slide.type === "stats") {
    return `
      <div class="slide">
        <h1>${slide.title}</h1>
        <p class="lead">${slide.lead}</p>
        <div class="statGrid">
          ${slide.stats
            .map(
              (stat) => `
            <article class="statCard">
              <strong>${stat.value}</strong>
              <p>${stat.label}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>`;
  }

  if (slide.type === "split") {
    return `
      <div class="slide">
        <h1>${slide.title}</h1>
        <p class="lead">${slide.lead}</p>
        <div class="splitGrid">
          <section class="contentCard">
            <h2>${slide.leftTitle}</h2>
            <ul>${slide.leftItems.map((item) => `<li>${item}</li>`).join("")}</ul>
          </section>
          <section class="contentCard">
            <h2>${slide.rightTitle}</h2>
            <ul>${slide.rightItems.map((item) => `<li>${item}</li>`).join("")}</ul>
          </section>
        </div>
      </div>`;
  }

  return `
    <div class="slide slide--quote">
      <h1>${slide.title}</h1>
      <p class="lead">${slide.lead}</p>
    </div>`;
}

function renderThumbnails() {
  const rail = qs("#thumbRail");
  rail.innerHTML = slides
    .map(
      (slide, i) => `
      <button class="thumb ${i === state.index ? "is-active" : ""}" data-index="${i}" type="button">
        <span>${String(i + 1).padStart(2, "0")}</span>
        <strong>${slide.title}</strong>
      </button>`
    )
    .join("");

  rail.querySelectorAll(".thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      goToSlide(Number(thumb.dataset.index));
    });
  });
}

function renderNotes(slide) {
  qs("#speakerNotes").textContent = slide.notes;
  qs("#deliveryCues").innerHTML = slide.cues.map((cue) => `<li>${cue}</li>`).join("");
}

function syncMeta() {
  qs("#slideCounter").textContent = `${state.index + 1} / ${slides.length}`;
  qs("#progressFill").style.width = `${((state.index + 1) / slides.length) * 100}%`;
}

function goToSlide(index) {
  state.index = (index + slides.length) % slides.length;

  const stage = qs("#slideStage");
  stage.classList.remove("is-entering");

  requestAnimationFrame(() => {
    stage.innerHTML = renderSlide(slides[state.index]);
    stage.classList.add("is-entering");
  });

  renderNotes(slides[state.index]);
  renderThumbnails();
  syncMeta();
}

function setAutoplay(enabled) {
  state.autoplay = enabled;
  qs("#toggleAutoplay").textContent = enabled ? "Pause" : "Autoplay";

  if (state.autoplayTimer) {
    clearInterval(state.autoplayTimer);
    state.autoplayTimer = null;
  }

  if (!enabled) return;

  state.autoplayTimer = setInterval(() => {
    goToSlide(state.index + 1);
  }, 6000);
}

function initControls() {
  qs("#nextSlide").addEventListener("click", () => goToSlide(state.index + 1));
  qs("#prevSlide").addEventListener("click", () => goToSlide(state.index - 1));

  qs("#toggleNotes").addEventListener("click", () => {
    const panel = qs("#notesPanel");
    panel.hidden = !panel.hidden;
  });

  qs("#toggleAutoplay").addEventListener("click", () => {
    setAutoplay(!state.autoplay);
  });

  qs("#toggleTheme").addEventListener("click", () => {
    state.dark = !state.dark;
    document.body.classList.toggle("theme-light", !state.dark);
  });

  qs("#toggleFullscreen").addEventListener("click", async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "PageDown") {
      goToSlide(state.index + 1);
    }

    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      goToSlide(state.index - 1);
    }

    if (event.key.toLowerCase() === "f") {
      qs("#toggleFullscreen").click();
    }

    if (event.key.toLowerCase() === "n") {
      qs("#toggleNotes").click();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initControls();
  goToSlide(0);
});
