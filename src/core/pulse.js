/* ═══════════════════════════════════════════════════════════════════
   CIRCLE PULSE CONTROLLER
   Looping breathing scale on the filled circle. Independent of scroll;
   active from the Scale chapter (s4 exit) until the blob scene (s6 exit).
═══════════════════════════════════════════════════════════════════ */

/* deps: { gsap, cFill } */
export function createPulse({ gsap, cFill }) {
  let tween = null;

  function start() {
    if (tween) return;
    tween = gsap.to(cFill, {
      scale: 1.07,
      transformOrigin: '50% 50%',
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
      gsap.set(cFill, { scale: 1, transformOrigin: '50% 50%' });
    }
  }

  return { start, stop };
}
