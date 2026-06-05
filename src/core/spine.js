/* ═══════════════════════════════════════════════════════════════════
   SPINE SCROLL INDICATOR
   Turns the central axis into the page's scrollbar: a grey fill grows down
   the spine tracking scroll progress from s3 onward (where user scrolling
   begins). There are 4 dots on the spine; dot 0 is filled by the intro,
   dot 1 fills when the grey line reaches it at the end of chapter 6.
   The line's maximum travel is from dot 0 to dot 1 — the lower two dots
   represent future chapters not yet in this scrollytelling.
   The spine can be clicked / dragged to seek. The native scrollbar is
   hidden in base.css. Interaction is disabled while intro locks scrolling.
═══════════════════════════════════════════════════════════════════ */
import { DOT_YS } from './constants.js';

/* Spine endpoints in #main-svg viewBox coords (match #c-axis y1/y2). */
const Y_TOP = 70;
/* The grey progress line travels only to dot 1 — end of Kapitel 1. */
const Y_END = DOT_YS[1];

const FILLED = '#A9A99F';
const EMPTY  = 'white';

const clamp01 = (v) => Math.min(1, Math.max(0, v));

export function createSpine({ ScrollTrigger, refs }) {
  const { cAxisProgress, spineHit, periodDots } = refs;
  if (!cAxisProgress || !spineHit) return;

  const dots = periodDots ? Array.from(periodDots.children) : [];

  /* Grow the progress line from dot 0 toward dot 1 only. */
  function render(progress) {
    const y = Y_TOP + (Y_END - Y_TOP) * clamp01(progress);
    cAxisProgress.setAttribute('y2', y);
  }

  /* Drive from s3 (where user scrolling begins) to page end, so progress=0
     right after the intro and progress=1 at the very last scene. */
  ScrollTrigger.create({
    trigger:    '#s3',
    start:      'top top',
    endTrigger: document.body,
    end:        'bottom bottom',
    onUpdate:  (self) => render(self.progress),
    onRefresh: (self) => render(self.progress),
  });

  /* ── Dot filling ────────────────────────────────────────────────────
     Dot 0 is filled during the intro by countdown.js.
     Dot 1 fills when the user reaches the last scene of chapter 6
     (end of Kapitel 1 = end of this scrollytelling). */
  const fill  = (i) => dots[i]?.setAttribute('fill', FILLED);
  const empty = (i) => dots[i]?.setAttribute('fill', EMPTY);

  ScrollTrigger.create({
    trigger:     '#s-ch6-pie12',
    start:       'bottom bottom',
    onEnter:     () => fill(1),
    onLeaveBack: () => empty(1),
  });

  /* ── Click / drag the spine to seek ────────────────────────────────
     Map the pointer's screen Y onto the hit-area's rendered box, then
     scroll the document to the matching position. Ignored while the
     intro holds scrolling locked (body overflow:hidden). */
  const locked = () => document.body.style.overflow === 'hidden';

  function seek(clientY) {
    const box = spineHit.getBoundingClientRect();
    const p = clamp01((clientY - box.top) / box.height);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, p * max);
  }

  let dragging = false;

  spineHit.addEventListener('pointerdown', (e) => {
    if (locked()) return;
    dragging = true;
    spineHit.setPointerCapture(e.pointerId);
    seek(e.clientY);
  });
  spineHit.addEventListener('pointermove', (e) => {
    if (dragging) seek(e.clientY);
  });
  const endDrag = (e) => {
    dragging = false;
    if (spineHit.hasPointerCapture?.(e.pointerId)) {
      spineHit.releasePointerCapture(e.pointerId);
    }
  };
  spineHit.addEventListener('pointerup', endDrag);
  spineHit.addEventListener('pointercancel', endDrag);
}
