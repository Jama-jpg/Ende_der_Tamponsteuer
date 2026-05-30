/* ═══════════════════════════════════════════════
   EURO COUNTER — top-left corner
   Appears with the spine in the S2→S3 intro transition (see countdown.js),
   then counts from 0 → 20.500 € as the reader scrolls through Chapter 2.
═══════════════════════════════════════════════ */

export function createEuroCounter({ gsap, ScrollTrigger }) {
  const numEl  = document.getElementById('euro-num');
  const counter = { value: 0 };

  const fmt = (n) =>
    Math.round(n).toLocaleString('de-AT');

  /* Count 0 → 20 500 from the top of s4 to the text-reveal point in s8.
     scrub ties the value directly to scroll position; ease: 'none' keeps
     the mapping linear so the number grows at a steady pace per VH scrolled. */
  gsap.to(counter, {
    value: 20500,
    ease: 'none',
    scrollTrigger: {
      trigger:    '#s4',
      start:      'top top',
      endTrigger: '#s8',
      end:        '72% bottom',
      scrub:      1.5,
    },
    onUpdate() {
      numEl.textContent = fmt(counter.value);
    },
  });

  /* Attention pulse — fires once when the counter first appears (s4, ~92% of
     the circle-fill scrub ≈ 55% of s4's height at the viewport top).
     A short delay lets the counter finish fading in before pulsing red. */
  ScrollTrigger.create({
    trigger:    '#s4',
    start:      '55% top',
    once:       true,
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
