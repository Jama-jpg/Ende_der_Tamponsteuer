/* ═══════════════════════════════════════════════
   EURO COUNTER — top-left corner
   Fades in with the circle fill (s3, ~68% scroll). Counts 0 → 20.500 € as
   the reader scrolls from s3 (circle full) through Chapter 2.
═══════════════════════════════════════════════ */

export function createEuroCounter({ gsap, ScrollTrigger }) {
  const numEl  = document.getElementById('euro-num');
  const counter = { value: 0 };

  const fmt = (n) =>
    Math.round(n).toLocaleString('de-AT');

  /* Count 0 → 20 500 from when the counter first appears (~65% into s3)
     to the text-reveal point in s8. scrub keeps the value linear to scroll. */
  gsap.to(counter, {
    value: 20500,
    ease: 'none',
    scrollTrigger: {
      trigger:    '#s3',
      start:      '65% top',
      endTrigger: '#s8',
      end:        '72% bottom',
      scrub:      1.5,
    },
    onUpdate() {
      numEl.textContent = fmt(counter.value);
    },
  });

  /* Attention pulse — fires once just before the counter fully fades in.
     The 0.3 s delay means it plays while the counter is becoming visible. */
  ScrollTrigger.create({
    trigger: '#s3',
    start:   '60% top',
    once:    true,
    onEnter: () => {
      gsap.delayedCall(0.3, () => {
        gsap.timeline()
          .fromTo('#euro-counter',
            { color: '#1a1a1a', scale: 1 },
            { color: '#D63335', scale: 1.6, duration: 0.35, ease: 'power2.out',
              transformOrigin: 'left top' })
          .to('#euro-counter',
            { scale: 1.0, duration: 0.15, ease: 'power1.in' })
          .to('#euro-counter',
            { scale: 1.4, duration: 0.2, ease: 'power2.out' })
          .to('#euro-counter',
            { color: '#1a1a1a', scale: 1, duration: 0.4, ease: 'power2.inOut' });
      });
    },
  });
}
