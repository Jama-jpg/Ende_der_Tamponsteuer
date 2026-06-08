/* ═══════════════════════════════════════════════════════════════════
   ENGINE — Tamponsteuer Scrollytelling
   Generic assembler: registers GSAP, builds the persistent stage, then
   walks the chapter registry to lay out scroll sections + text overlays
   and run each scene's init(ctx). Knows nothing about specific scenes.
═══════════════════════════════════════════════════════════════════ */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Draggable } from 'gsap/Draggable';

import './styles/base.css';
import './styles/overlays.css';

import { chapters } from './registry.js';
import { buildStage } from './stage/index.js';
import * as helpers from './core/svg.js';
import * as constants from './core/constants.js';
import { createWave } from './core/wave.js';
import { createPulse } from './core/pulse.js';
import { createSpine } from './core/spine.js';
import { createEuroCounter } from './core/euro-counter.js';
import { createSnap } from './core/snap.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable);

/* Force scroll to top before any ScrollTrigger initialises — prevents the
   browser's scroll-restoration from firing later scenes on reload. */
window.scrollTo(0, 0);
if (history.scrollRestoration) history.scrollRestoration = 'manual';

/* 1 ─ Build the persistent stage (markup + procedural SVG + hidden state) */
const mount = document.getElementById('app');
const refs = buildStage(mount, gsap);

/* 2 ─ Flatten the registry into an ordered list of scenes */
const scenes = chapters.flatMap((c) => c.scenes);

/* 3 ─ Lay out one scroll spacer section + optional text overlay per scene */
const scroller = refs.scroller;
const overlays = refs.overlays;

scenes.forEach((scene, i) => {
  /* noSection scenes contribute an overlay but no scroll-spacer section,
     so they add zero snap points while their init() and overlay still run. */
  if (!scene.noSection) {
    const section = document.createElement('section');
    section.id = scene.id;
    section.className = 'scene';
    section.dataset.scene = String(i + 1);
    section.style.height = scene.height || '100vh';
    scroller.appendChild(section);
  }

  if (scene.overlay) {
    const ov = document.createElement('div');
    ov.className = 'stext';
    ov.id = scene.overlay.id;
    ov.innerHTML = scene.overlay.html;
    overlays.appendChild(ov);
  }
});

/* 4 ─ Build the shared context and run every scene's init */
const controllers = {
  wave:   createWave(refs),
  pulse:  createPulse({
    gsap,
    targets: [refs.cFill, refs.pieHl],
    origin:  `${constants.CX} ${constants.CY}`,
  }),
};

const ctx = {
  gsap,
  ScrollTrigger,
  Draggable,
  stage: { refs },
  helpers,
  constants,
  controllers,
  shared: {}, // cross-scene handle bag (e.g. ctx.shared.pie)
};

scenes.forEach((scene) => scene.init?.(ctx));

/* 5 ─ Wire the spine as the page scrollbar (overall scroll progress + seek) */
createSpine({ ScrollTrigger, refs });

/* 6b ─ Scroll snap — eases to each scene's snap points on wheel/touch/key */
createSnap({ ScrollTrigger, gsap, scenes });

/* 7 ─ Euro counter — top-left corner, Chapter 2 → "Jeden Monat" */
createEuroCounter({ gsap, ScrollTrigger });
