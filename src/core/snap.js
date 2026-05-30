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

const DURATION = 0.9;      // seconds per scene transition
const EASE     = 'power2.inOut';
const COOLDOWN = 120;      // ms lock after a transition before re-arming
const SWIPE    = 30;       // px of touch travel before it counts as a swipe

export function createSnap({ ScrollTrigger, gsap, scenes }) {
  const ids = scenes.map((s) => s.id);

  /* Live scene-edge scroll positions, sorted top→bottom.
     Per scene: its start (offsetTop, scrub 0%) and its end (where the
     section's bottom meets the viewport bottom, scrub 100%) — matching the
     scenes' `top top → bottom bottom` scrub range. Rounded + de-duped, so a
     100vh scene (start == end) collapses to one point. */
  function boundaries() {
    const vh = window.innerHeight;
    const pts = [];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const start = el.offsetTop;
      pts.push(Math.round(start));
      pts.push(Math.round(start + el.offsetHeight - vh)); // scrub end
    }
    return Array.from(new Set(pts)).sort((a, b) => a - b);
  }

  const maxScroll = () => ScrollTrigger.maxScroll(window);
  const locked    = () => document.body.style.overflow === 'hidden';

  let busy = false;

  /* Ease to the next boundary in the given direction (+1 down, −1 up). */
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

    busy = true;
    gsap.to(window, {
      scrollTo: { y: dest, autoKill: false },       // can't be interrupted mid-flight
      duration: DURATION,
      ease: EASE,
      onComplete: () => { setTimeout(() => { busy = false; }, COOLDOWN); },
    });
  }

  /* ── Wheel / trackpad ── */
  window.addEventListener('wheel', (e) => {
    if (locked()) return;
    e.preventDefault();                             // suppress native scroll
    if (Math.abs(e.deltaY) < 1) return;
    go(e.deltaY > 0 ? 1 : -1);
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
