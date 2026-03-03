# AI Training Companion – Project Context

## Purpose

This repository hosts the AI Training Companion site for the AI Initiatives group.

The site is deployed via GitHub Pages and supports multiple modules in a structured format.

---

## GitHub Pages Configuration

Branch: main  
Folder: /docs  

Only files inside the `docs` folder are publicly hosted.

Anything outside `docs` is not visible on the live site.

Live URL format:
https://jherrmannwb.github.io/ChatGPT/

---

## Folder Structure

ChatGPT/
│
├── docs/
│   ├── index.html              ← Series Home (Landing Page)
│   ├── styles.css              ← Global styling
│   ├── app.js                  ← Shared JavaScript
│   ├── modules/
│   │   ├── module-1.html
│   │   ├── module-2.html (future)
│   │   └── module-n.html
│
├── README.md
└── PROJECT_CONTEXT.md

---

## Module Pattern

Each module:

- Lives inside docs/modules/
- Uses shared CSS and JS
- Must reference assets using relative paths:

CSS:
<link rel="stylesheet" href="../styles.css">

JS:
<script src="../app.js"></script>

Home link from modules:
<a href="../index.html">Home</a>

---

## Deployment Workflow

1. Edit files in VS Code
2. Save
3. Run:

git add .
git commit -m "Description of change"
git push

4. GitHub Pages auto-deploys
5. Hard refresh browser (Ctrl + F5)

---

## Common Gotchas

1. GitHub Pages is case-sensitive
   - index.html ≠ Index.html

2. Module pages are one folder deeper
   - Must use ../ for shared assets

3. Pages only serves from /docs

4. If styling disappears:
   - Check relative paths first
   - Then check browser console

---

## Expansion Plan

- Add new modules under docs/modules/
- Update index.html with module cards
- Keep styles centralized in styles.css
- Keep shared logic in app.js

---

## Strategic Vision

This site is meant to:

- Support AI Initiatives training
- Evolve with each module
- Demonstrate practical AI leadership
- Provide reusable structured components
