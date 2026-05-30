/* ═══════════════════════════════════════════════════════════════════
   SCROLL SNAP
   Makes the page rest on scene boundaries. After each scroll gesture the
   view eases to the nearest scene start, so every scrubbed animation
   always settles fully played (0% or 100%) and never freezes mid-way —
   one scroll carries you to the next scene, and the animation in between
   always runs to completion.

   Implemented as a single master ScrollTrigger spanning the whole page
   whose `snap` lands on each section's scroll offset. Snap points are
   recomputed live from the DOM so they stay correct across resizes and
   while the intro keeps scrolling locked.
═══════════════════════════════════════════════════════════════════ */

export function createSnap({ ScrollTrigger, gsap, scenes }) {
  /* Section-start progress points (0–1) along the whole scrollable page. */
  function snapPoints() {
    const max = ScrollTrigger.maxScroll(window);
    if (!max) return null; // layout not ready / scrolling locked
    const pts = scenes
      .map((s) => document.getElementById(s.id))
      .filter(Boolean)
      .map((el) => Math.min(1, Math.max(0, el.offsetTop / max)));
    pts.push(1); // the very end of the story
    return Array.from(new Set(pts)).sort((a, b) => a - b);
  }

  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    snap: {
      /* Snap to the nearest scene boundary once scrolling settles. */
      snapTo: (value) => {
        const pts = snapPoints();
        return pts ? gsap.utils.snap(pts, value) : value;
      },
      duration: { min: 0.3, max: 0.7 }, // ease-time scales with distance
      delay: 0.05,                       // wait briefly after the gesture ends
      ease: 'power2.inOut',
    },
  });
}
