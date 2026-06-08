/* ═══════════════════════════════════════════════════════════════════
   SPINE SCROLL INDICATOR
   Turns the central axis into the page's scrollbar: a grey fill grows down
   the spine tracking scroll progress from s3 onward (where user scrolling
   begins). There are 4 dots on the spine; dot 0 is filled by the intro,
   dot 1 fills after the scale/steuer chapter (ch 7, when the Waage exits),
   dot 2 at end of timeline (ch 8), dot 3 at the very end of the website (ch 10).
   The spine can be clicked / dragged to seek. The native scrollbar is
   hidden in base.css. Interaction is disabled while intro locks scrolling.
═══════════════════════════════════════════════════════════════════ */
import { DOT_YS } from './constants.js';

/* Spine endpoints in #main-svg viewBox coords (match #c-axis y1/y2). */
const Y_TOP = 70;
/* The grey progress line travels the full height of the spine. */
const Y_END = DOT_YS[3];

const FILLED = '#A9A99F';
const EMPTY  = 'white';

const clamp01 = (v) => Math.min(1, Math.max(0, v));

export function createSpine({ ScrollTrigger, refs }) {
  const { cAxisProgress, spineHit, periodDots } = refs;
  if (!cAxisProgress || !spineHit) return;

  const dots = periodDots ? Array.from(periodDots.children) : [];

  /* Grow the progress line from dot 0 to dot 3 (full spine). */
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
     Dot 1 fills when the scale chapter exits (end of ch 7, where the Waage fades out).
     Dot 2 fills at the end of the timeline chapter (chapter 8).
     Dot 3 fills at the very end of the website (chapter 10). */
  const fill  = (i) => dots[i]?.setAttribute('fill', FILLED);
  const empty = (i) => dots[i]?.setAttribute('fill', EMPTY);

  ScrollTrigger.create({
    trigger:     '#s-ch7-steuer-frage',
    start:       'bottom bottom',
    onEnter:     () => fill(1),
    onLeaveBack: () => empty(1),
  });

  ScrollTrigger.create({
    trigger:     '#s-tl-layout-out',
    start:       'bottom bottom',
    onEnter:     () => fill(2),
    onLeaveBack: () => empty(2),
  });

  ScrollTrigger.create({
    trigger:     '#s-ch10-protest',
    start:       'bottom bottom',
    onEnter:     () => fill(3),
    onLeaveBack: () => empty(3),
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
