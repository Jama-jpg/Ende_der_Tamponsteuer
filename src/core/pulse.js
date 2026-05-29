/* ═══════════════════════════════════════════════════════════════════
   CIRCLE PULSE CONTROLLER
   Looping breathing scale on the filled circle (and the pie highlight, so
   it pulses together with it during Scene 7). Independent of scroll; active
   from the Scale chapter (s4 exit) until the pie scene (s7 exit).
═══════════════════════════════════════════════════════════════════ */

/* deps: { gsap, targets, origin } — targets scale together around the SVG
   user-space point `origin` (e.g. "775 281"), so they pulse concentrically. */
export function createPulse({ gsap, targets, origin }) {
  const items = Array.isArray(targets) ? targets : [targets];
  let tween = null;

  function start() {
    if (tween) return;
    tween = gsap.to(items, {
      scale: 1.07,
      svgOrigin: origin,
      ease: 'sine.inOut',
      duration: 1.4,
      yoyo: true,
      repeat: -1,
    });
  }

  function stop() {
    if (tween) {
      tween.kill();
      tween = null;
      gsap.set(items, { scale: 1, svgOrigin: origin });
    }
  }

  return { start, stop };
}
