const slides = [
  {
    type: "hero",
    title: "AetherDeck X",
    eyebrow: "Category leap · 2026",
    lead:
      "This is what happens when presentations are treated like software products: live systems, dynamic pacing, and executive-grade visual storytelling.",
    chips: ["Cinematic canvas", "Fragment reveals", "Presenter intelligence", "Command palette"],
    notes:
      "Set the hook. This is not a theme—it is a complete delivery system with controls engineered for persuasion.",
    cues: ["Pause before saying 'software products'", "Point to top status bar", "Press right arrow once"],
    track: [
      "Problem: traditional slides are static and fragile.",
      "Shift: real-time controls and adaptive flow.",
      "Outcome: confidence, clarity, and control."
    ]
  },
  {
    type: "timeline",
    title: "From deck file to presentation operating system",
    lead: "AetherDeck X upgrades each part of the delivery loop.",
    timeline: [
      { year: "Then", text: "Static slide pages with little context awareness." },
      { year: "Now", text: "Slides + fragments + pacing + live state sync." },
      { year: "Next", text: "Presentations that adapt in real time to audience needs." }
    ],
    notes: "Show momentum. Emphasize this is a deliberate product trajectory, not a visual reskin.",
    cues: ["Keep this under 30 seconds", "Use deliberate cadence"],
    track: ["Then → now → next narrative", "Signal long-term roadmap confidence"]
  },
  {
    type: "metrics",
    title: "Engineered for the room, not just the screen",
    lead: "Hard delivery features that speakers actually need during high-stakes moments.",
    stats: [
      { value: "∞", label: "Fragment steps per slide" },
      { value: "⌘K", label: "Instant jump command palette" },
      { value: "URL", label: "Deep-link to any slide" },
      { value: "Live", label: "Runtime timer + mode status" }
    ],
    notes: "This is your confidence slide. Translate technical features into presenter outcomes.",
    cues: ["Mention board meetings and keynotes", "Show timer in header"],
    track: ["Reliable navigation", "Precise pacing", "Improved speaker control"]
  },
  {
    type: "split",
    title: "Multi-layer storytelling with progressive reveals",
    lead:
      "Each reveal can expose a new argument, proof point, or objection-handling line exactly when needed.",
    leftTitle: "What your team gains",
    leftItems: [
      "Visual authority from the first slide",
      "Clean narrative rhythm",
      "Presenter confidence in live Q&A",
      "No dependency on desktop slide software"
    ],
    rightTitle: "What your audience feels",
    rightItems: [
      "Less cognitive overload",
      "Clearer takeaways",
      "Higher trust in your message",
      "A keynote-grade experience"
    ],
    fragments: [
      "Reveal 1: frame the challenge",
      "Reveal 2: show capability",
      "Reveal 3: land business impact"
    ],
    notes: "Use fragment stepping here to visibly demonstrate progressive reveal behavior.",
    cues: ["Tap Next Step multiple times", "Narrate each reveal"],
    track: ["Challenge", "Capability", "Business impact"]
  },
  {
    type: "quote",
    title: "“If Microsoft reimagined PowerPoint from scratch for 2026, it would feel like this.”",
    lead: "AetherDeck X turns every presentation into a modern product experience.",
    notes: "Deliver this slowly. Then open command palette and jump back to any slide title instantly.",
    cues: ["Strong finish", "Invite next step: deploy this as default template"],
    track: ["Aspirational close", "Clear call to action"]
  }
];

const state = {
  slideIndex: 0,
  fragmentIndex: 0,
  autoplay: false,
  autoplayTimer: null,
  dark: true,
  startedAt: null
};

const qs = (selector) => document.querySelector(selector);

function getHashSlideIndex() {
  const match = location.hash.match(/slide-(\d+)/i);
  if (!match) return 0;

  const candidate = Number(match[1]) - 1;
  if (Number.isNaN(candidate)) return 0;
  return Math.min(Math.max(candidate, 0), slides.length - 1);
}

function updateHash() {
  const target = `slide-${state.slideIndex + 1}`;
  if (location.hash !== `#${target}`) {
    history.replaceState(null, "", `#${target}`);
  }
}

function currentSlide() {
  return slides[state.slideIndex];
}

function totalFragments(slide) {
  return Array.isArray(slide.fragments) ? slide.fragments.length : 0;
}

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

  if (slide.type === "timeline") {
    return `
      <div class="slide">
        <h1>${slide.title}</h1>
        <p class="lead">${slide.lead}</p>
        <div class="timelineGrid">
          ${slide.timeline
            .map(
              (step) => `
              <article class="timelineStep">
                <strong>${step.year}</strong>
                <p>${step.text}</p>
              </article>`
            )
            .join("")}
        </div>
      </div>`;
  }

  if (slide.type === "metrics") {
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
    const revealCount = Math.min(state.fragmentIndex, totalFragments(slide));

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

        <div class="revealRail">
          ${slide.fragments
            .map(
              (item, index) =>
                `<div class="revealItem ${index < revealCount ? "is-on" : ""}">${item}</div>`
            )
            .join("")}
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
      (slide, index) => `
      <button class="thumb ${index === state.slideIndex ? "is-active" : ""}" data-index="${index}" type="button">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${slide.title}</strong>
      </button>`
    )
    .join("");

  rail.querySelectorAll(".thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => goToSlide(Number(thumb.dataset.index)));
  });
}

function renderNotes(slide) {
  qs("#speakerNotes").textContent = slide.notes;
  qs("#deliveryCues").innerHTML = slide.cues.map((cue) => `<li>${cue}</li>`).join("");
  qs("#talkTrack").innerHTML = slide.track.map((step) => `<p>• ${step}</p>`).join("");
}

function syncMeta() {
  const slide = currentSlide();
  const fragmentTotal = totalFragments(slide);

  qs("#slideCounter").textContent = `${state.slideIndex + 1} / ${slides.length}`;
  qs("#progressFill").style.width = `${((state.slideIndex + 1) / slides.length) * 100}%`;
  qs("#fragmentCounter").textContent =
    fragmentTotal > 0 ? `Step ${Math.min(state.fragmentIndex + 1, fragmentTotal + 1)} of ${fragmentTotal + 1}` : "";

  qs("#nextFragment").textContent =
    fragmentTotal > 0 && state.fragmentIndex < fragmentTotal ? "Next Reveal →" : "Next Slide →";
}

function renderStage() {
  const stage = qs("#slideStage");
  stage.classList.remove("is-entering");

  requestAnimationFrame(() => {
    stage.innerHTML = renderSlide(currentSlide());
    stage.classList.add("is-entering");
  });
}

function goToSlide(index, fragmentIndex = 0) {
  state.slideIndex = (index + slides.length) % slides.length;
  state.fragmentIndex = Math.max(fragmentIndex, 0);

  renderStage();
  renderNotes(currentSlide());
  renderThumbnails();
  syncMeta();
  updateHash();
}

function goNext() {
  const slide = currentSlide();
  const fragmentTotal = totalFragments(slide);

  if (fragmentTotal > 0 && state.fragmentIndex < fragmentTotal) {
    state.fragmentIndex += 1;
    renderStage();
    syncMeta();
    return;
  }

  goToSlide(state.slideIndex + 1, 0);
}

function goPrev() {
  if (state.fragmentIndex > 0) {
    state.fragmentIndex -= 1;
    renderStage();
    syncMeta();
    return;
  }

  goToSlide(state.slideIndex - 1, 0);
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
    goNext();
  }, 5500);
}

function tickClock() {
  if (!state.startedAt) state.startedAt = Date.now();

  const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  qs("#statusTime").textContent = `${minutes}:${seconds}`;
}

function updateModeStatus() {
  const mode = document.fullscreenElement ? "Presenter View" : "Audience View";
  qs("#statusMode").textContent = mode;
}

function renderSearchResults(filter = "") {
  const results = qs("#searchResults");
  const query = filter.trim().toLowerCase();

  const matches = slides
    .map((slide, index) => ({ slide, index }))
    .filter(({ slide, index }) => {
      if (!query) return true;
      return slide.title.toLowerCase().includes(query) || String(index + 1) === query;
    });

  results.innerHTML = matches
    .map(
      ({ slide, index }) => `
      <button class="palette__item" data-index="${index}" type="button">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${slide.title}</strong>
      </button>`
    )
    .join("");

  results.querySelectorAll(".palette__item").forEach((item) => {
    item.addEventListener("click", () => {
      goToSlide(Number(item.dataset.index));
      togglePalette(false);
    });
  });
}

function togglePalette(force) {
  const palette = qs("#commandPalette");
  const next = typeof force === "boolean" ? force : palette.hidden;

  palette.hidden = !next;
  if (next) {
    renderSearchResults();
    qs("#slideSearch").focus();
    return;
  }

  qs("#slideSearch").value = "";
}

function initControls() {
  qs("#prevSlide").addEventListener("click", goPrev);
  qs("#nextFragment").addEventListener("click", goNext);

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

  qs("#toggleCommand").addEventListener("click", () => togglePalette());

  qs("#slideSearch").addEventListener("input", (event) => {
    renderSearchResults(event.target.value);
  });

  document.addEventListener("fullscreenchange", updateModeStatus);

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      togglePalette();
      return;
    }

    if (event.key === "Escape") {
      togglePalette(false);
      return;
    }

    if (!qs("#commandPalette").hidden) return;

    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") goNext();
    if (event.key === "ArrowLeft" || event.key === "PageUp") goPrev();
    if (event.key.toLowerCase() === "n") qs("#toggleNotes").click();
    if (event.key.toLowerCase() === "f") qs("#toggleFullscreen").click();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initControls();
  setInterval(tickClock, 1000);
  goToSlide(getHashSlideIndex());
  updateModeStatus();
});
