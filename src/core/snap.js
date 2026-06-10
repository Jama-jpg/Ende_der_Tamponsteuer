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
const LOCK_TIME = 3500;    // ms total lock: covers anim (1200ms) + scrub lag + buffer
const SWIPE     = 120;     // px of touch travel before it counts as a swipe

// Wheel accumulator: prevents trackpad noise from triggering multiple snaps.
// We sum raw deltaY events; once the total exceeds this threshold we fire once.
const ACCUM_THRESHOLD = 500;  // px accumulated before triggering
const ACCUM_RESET     = 400; // ms of wheel silence to reset the accumulator

export function createSnap({ ScrollTrigger, gsap, scenes }) {
  /* Scenes marked snapOnce:true fire their snap once, then release forward
     scrolling so the user can pass through without further snapping.
     Cleared when the user scrolls back above the scene's start. */
  const firedScenes = new Set();

  /* Live scene-edge scroll positions, sorted top→bottom.
     Per scene: its start (offsetTop, scrub 0%) and its end (where the
     section's bottom meets the viewport bottom, scrub 100%) — matching the
     scenes' `top top → bottom bottom` scrub range. Rounded + de-duped, so a
     100vh scene (start == end) collapses to one point.
     Scenes with skipSnapStart:true omit the start boundary so the snap jumps
     directly to the animation's end — avoiding a dead rest point where nothing
     changes visually.
     When dir > 0 (forward), snapOnce scenes that have already fired are
     excluded so the user can scroll freely past them. */
  function boundaries(dir = 0) {
    const vh = window.innerHeight;
    const pts = [];
    for (const scene of scenes) {
      const el = document.getElementById(scene.id);
      if (!el) continue;
      const start = el.offsetTop;
      const end   = Math.round(start + el.offsetHeight - vh);
      const skip  = dir > 0 && scene.snapOnce && firedScenes.has(scene.id);
      if (!scene.skipSnapStart) pts.push(Math.round(start));
      if (scene.snapPoints && !skip) {
        const range = el.offsetHeight - vh;
        for (const f of scene.snapPoints) {
          pts.push(Math.round(start + f * range));
        }
      }
      if (!scene.skipSnapEnd && !skip) pts.push(end); // scrub end
    }
    return Array.from(new Set(pts)).sort((a, b) => a - b);
  }

  const maxScroll = () => ScrollTrigger.maxScroll(window);
  const locked    = () => document.body.style.overflow === 'hidden';

  /* Returns true only if there is a snap boundary ahead in the given
     direction (+1 down, -1 up) AND within 1.5 viewports — so native scroll
     is left untouched when the snap scenes are far away. */
  function wouldSnap(dir) {
    const pts = boundaries(dir);
    if (!pts.length) return false;
    const y     = Math.round(window.scrollY || window.pageYOffset);
    const eps   = 4;
    const range = window.innerHeight * 1.5;
    return dir > 0
      ? pts.some(p => p > y + eps && p < y + range)
      : pts.some(p => p < y - eps && p > y - range);
  }

  /* When scrolling up, un-fire snapOnce scenes whose start is now above us,
     so they snap again if the user scrolls back down into them. */
  function clearFiredAbove() {
    const y = Math.round(window.scrollY || window.pageYOffset);
    for (const scene of scenes) {
      if (!firedScenes.has(scene.id)) continue;
      const el = document.getElementById(scene.id);
      if (el && y < el.offsetTop) firedScenes.delete(scene.id);
    }
  }

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
    const pts = boundaries(dir);
    if (!pts.length) return;

    const y     = Math.round(window.scrollY || window.pageYOffset);
    const eps   = 2;
    const range = window.innerHeight * 1.5;
    let dest;
    if (dir > 0) {
      dest = pts.find((p) => p > y + eps && p < y + range);
      if (dest == null) return;
    } else {
      const above = pts.filter((p) => p < y - eps && p > y - range);
      if (!above.length) return;
      dest = above[above.length - 1];
    }
    dest = Math.min(dest, maxScroll());
    if (Math.abs(dest - y) < eps) return;

    // Lock immediately — not after animation — so coast events are dropped.
    busy = true;
    clearTimeout(lockTimer);
    lockTimer = setTimeout(() => {
      busy = false;
      // Mark snapOnce scene as fired if dest was one of its snap points.
      if (dir > 0) {
        for (const scene of scenes) {
          if (!scene.snapOnce || firedScenes.has(scene.id)) continue;
          const el = document.getElementById(scene.id);
          if (!el) continue;
          const start = el.offsetTop;
          const snapRange = el.offsetHeight - window.innerHeight;
          if (scene.snapPoints) {
            for (const f of scene.snapPoints) {
              if (Math.abs(dest - Math.round(start + f * snapRange)) < 4) {
                firedScenes.add(scene.id);
              }
            }
          }
        }
      }
    }, LOCK_TIME);

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
    const delta = normalizeDelta(e);
    const dir   = delta >= 0 ? 1 : -1;
    if (dir < 0) clearFiredAbove();
    // Only intercept if a snap target exists in this direction, or a snap
    // animation is already running (prevent fighting the tween).
    if (!busy && !wouldSnap(dir)) return;
    e.preventDefault();

    if (busy) return;                               // drop all events while locked

    accumY += delta;
    clearTimeout(accumTimer);
    accumTimer = setTimeout(() => { accumY = 0; }, ACCUM_RESET);

    if (Math.abs(accumY) >= ACCUM_THRESHOLD) {
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
    const dy  = touchY - e.touches[0].clientY;
    const dir = dy >= 0 ? 1 : -1;
    if (dir < 0) clearFiredAbove();
    if (!busy && !wouldSnap(dir)) return;
    e.preventDefault();
    if (Math.abs(dy) > SWIPE) { go(dir); touchY = null; }
  }, { passive: false });
  window.addEventListener('touchend', () => { touchY = null; });

  /* ── Keyboard ── */
  window.addEventListener('keydown', (e) => {
    if (locked()) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      if (!wouldSnap(1)) return;
      e.preventDefault(); go(1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (!wouldSnap(-1)) return;
      e.preventDefault(); go(-1);
    }
  });
}
