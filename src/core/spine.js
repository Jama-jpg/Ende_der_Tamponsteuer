/* ═══════════════════════════════════════════════════════════════════
   SPINE SCROLL INDICATOR
   Turns the central axis into the page's scrollbar: a red fill grows down
   the spine and the period dots fill in as it passes them, both tracking
   overall scroll progress through the whole story. The spine can be
   clicked / dragged to seek. The native scrollbar is hidden in base.css.
   Interaction is disabled while the intro locks scrolling.
═══════════════════════════════════════════════════════════════════ */

/* Spine endpoints in #main-svg viewBox coords (match #c-axis y1/y2). */
const Y_TOP = 42;
const Y_BOT = 510;

const FILLED = '#A9A99F';
const EMPTY  = 'white';

const clamp01 = (v) => Math.min(1, Math.max(0, v));

export function createSpine({ ScrollTrigger, refs }) {
  const { cAxisProgress, spineHit, periodDots } = refs;
  if (!cAxisProgress || !spineHit) return;

  /* The period dots become the scrollbar's "ticks". */
  const dots = periodDots ? Array.from(periodDots.children) : [];

  /* Grow the red fill down the spine and fill every dot it has passed. */
  function render(progress) {
    const y = Y_TOP + (Y_BOT - Y_TOP) * clamp01(progress);
    cAxisProgress.setAttribute('y2', y);
    for (const dot of dots) {
      const dy = parseFloat(dot.getAttribute('cy'));
      dot.setAttribute('fill', dy <= y + 0.5 ? FILLED : EMPTY);
    }
  }

  /* Drive the indicator from overall page scroll. */
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => render(self.progress),
    onRefresh: (self) => render(self.progress),
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
