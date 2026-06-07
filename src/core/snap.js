/* ═══════════════════════════════════════════════════════════════════
   SCROLL SNAP  (one scroll → one scene edge)
   Turns the page into a slideshow: every scroll gesture is captured and
   eased straight to the next (or previous) scene edge, so the scrubbed
   transition in between always plays through to completion and the view
   always comes to rest exactly on an edge — it can never freeze mid-way.

   Each scene rests at TWO points: its start (scrub at 0%) and its end
   (scrub at 100%, where the animation has fully played). One scroll runs
   the animation to completion and stops; the next moves on to the scene
   below. Short (100vh) scenes have start == end, so they're a single rest.

   Native scrolling is taken over (wheel / touch / keys) and replaced with a
   single locked tween per gesture, driven through GSAP's ScrollToPlugin.
   While the intro keeps scrolling locked (body overflow:hidden) all input
   is ignored. The spine drag (core/spine.js) still seeks freely — this
   reads the live scroll position on every gesture, so it stays in sync.
═══════════════════════════════════════════════════════════════════ */

const DURATION  = 1.2;     // seconds per scene transition
const EASE      = 'power2.inOut';
const LOCK_TIME = 2000;    // ms total lock: covers anim (1200ms) + scrub lag + buffer
const SWIPE     = 40;      // px of touch travel before it counts as a swipe

// Wheel accumulator: prevents trackpad noise from triggering multiple snaps.
// We sum raw deltaY events; once the total exceeds this threshold we fire once.
const ACCUM_THRESHOLD = 30;  // px accumulated before triggering
const ACCUM_RESET     = 200; // ms of wheel silence to reset the accumulator

export function createSnap({ ScrollTrigger, gsap, scenes }) {
  /* Live scene-edge scroll positions, sorted top→bottom.
     Per scene: its start (offsetTop, scrub 0%) and its end (where the
     section's bottom meets the viewport bottom, scrub 100%) — matching the
     scenes' `top top → bottom bottom` scrub range. Rounded + de-duped, so a
     100vh scene (start == end) collapses to one point.
     Scenes with skipSnapStart:true omit the start boundary so the snap jumps
     directly to the animation's end — avoiding a dead rest point where nothing
     changes visually. */
  function boundaries() {
    const vh = window.innerHeight;
    const pts = [];
    for (const scene of scenes) {
      const el = document.getElementById(scene.id);
      if (!el) continue;
      const start = el.offsetTop;
      const end   = Math.round(start + el.offsetHeight - vh);
      if (!scene.skipSnapStart) pts.push(Math.round(start));
      if (scene.snapPoints) {
        const range = el.offsetHeight - vh;
        for (const f of scene.snapPoints) {
          pts.push(Math.round(start + f * range));
        }
      }
      pts.push(end); // scrub end
    }
    return Array.from(new Set(pts)).sort((a, b) => a - b);
  }

  const maxScroll = () => ScrollTrigger.maxScroll(window);
  const locked    = () => document.body.style.overflow === 'hidden';

  let busy      = false;
  let lockTimer = null;

  /* Normalize wheel delta across deltaMode (pixels / lines / pages). */
  function normalizeDelta(e) {
    if (e.deltaMode === 1) return e.deltaY * 30;
    if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
    return e.deltaY;
  }

  /* Ease to the next boundary in the given direction (+1 down, −1 up).
     busy is set immediately at trigger time and held for LOCK_TIME ms so
     trackpad momentum events after the animation cannot re-trigger a snap. */
  function go(dir) {
    if (busy || locked()) return;
    const pts = boundaries();
    if (!pts.length) return;

    const y = Math.round(window.scrollY || window.pageYOffset);
    const eps = 2;
    let dest;
    if (dir > 0) {
      dest = pts.find((p) => p > y + eps);          // next scene below
      if (dest == null) return;                     // already at the last one
    } else {
      const above = pts.filter((p) => p < y - eps); // scenes above
      if (!above.length) return;                    // already at the first one
      dest = above[above.length - 1];
    }
    dest = Math.min(dest, maxScroll());
    if (Math.abs(dest - y) < eps) return;

    // Lock immediately — not after animation — so coast events are dropped.
    busy = true;
    clearTimeout(lockTimer);
    lockTimer = setTimeout(() => { busy = false; }, LOCK_TIME);

    gsap.to(window, {
      scrollTo: { y: dest, autoKill: false },
      duration: DURATION,
      ease: EASE,
    });
  }

  /* ── Wheel / trackpad ──
     Accumulate deltaY across consecutive events so that light trackpad
     touches (which produce many small events) don't trigger multiple snaps.
     A heavy mouse-wheel click (deltaY ~100) crosses the threshold immediately. */
  let accumY     = 0;
  let accumTimer = null;

  window.addEventListener('wheel', (e) => {
    if (locked()) return;
    e.preventDefault();                             // suppress native scroll

    if (busy) return;                               // drop all events while locked

    accumY += normalizeDelta(e);
    clearTimeout(accumTimer);
    accumTimer = setTimeout(() => { accumY = 0; }, ACCUM_RESET);

    if (Math.abs(accumY) >= ACCUM_THRESHOLD) {
      const dir = accumY > 0 ? 1 : -1;
      accumY = 0;
      clearTimeout(accumTimer);
      go(dir);
    }
  }, { passive: false });

  /* ── Touch (mobile) ── */
  let touchY = null;
  window.addEventListener('touchstart', (e) => {
    touchY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (locked() || touchY == null) return;
    e.preventDefault();
    const dy = touchY - e.touches[0].clientY;
    if (Math.abs(dy) > SWIPE) { go(dy > 0 ? 1 : -1); touchY = null; }
  }, { passive: false });
  window.addEventListener('touchend', () => { touchY = null; });

  /* ── Keyboard ── */
  window.addEventListener('keydown', (e) => {
    if (locked()) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault(); go(1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault(); go(-1);
    }
  });
}
