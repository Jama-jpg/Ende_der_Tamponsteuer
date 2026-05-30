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

  /* Attention pulse — fires once when the counter reaches its final value
     (same scroll position as the counting end: 72% of s8 at viewport bottom).
     The counter flashes red and grows, then returns to normal. */
  ScrollTrigger.create({
    trigger:    '#s8',
    start:      '72% bottom',
    once:       true,
    onEnter: () => {
      gsap.timeline()
        .fromTo('#euro-counter',
          { color: '#1a1a1a', scale: 1 },
          { color: '#D63335', scale: 2.0, duration: 0.4, ease: 'power2.out',
            transformOrigin: 'left top' })
        .to('#euro-counter',
          { color: '#1a1a1a', scale: 1, duration: 0.6, ease: 'power2.inOut' });
    },
  });
}
