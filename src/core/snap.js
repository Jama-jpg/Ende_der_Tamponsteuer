/* ═══════════════════════════════════════════════════════════════════
   SCROLL SNAP  (one scroll → one scene)
   Turns the page into a slideshow: every scroll gesture is captured and
   eased straight to the next (or previous) scene boundary, so the scrubbed
   transition in between always plays through to completion and the view
   always comes to rest exactly on a scene — it can never freeze mid-way.

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

  /* Live scene-start scroll positions, sorted top→bottom. */
  function boundaries() {
    return ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .map((el) => el.offsetTop)
      .sort((a, b) => a - b);
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
