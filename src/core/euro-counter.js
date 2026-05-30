/* ═══════════════════════════════════════════════
   EURO COUNTER — top-left corner
   Fades in at the start of Chapter 2 (s4) and counts from 0 → 20.500 €,
   reaching the final value when the "Jeden Monat" scene (s8) reveals its text
   (≈ 72% through s8's scroll range).
═══════════════════════════════════════════════ */

export function createEuroCounter({ gsap, ScrollTrigger }) {
  const container = document.getElementById('euro-counter');
  const numEl     = document.getElementById('euro-num');
  const counter   = { value: 0 };

  const fmt = (n) =>
    Math.round(n).toLocaleString('de-AT');

  /* Fade in when Chapter 2 enters, fade out if scrolled back past it. */
  ScrollTrigger.create({
    trigger:      '#s4',
    start:        'top bottom',
    onEnter:      () => gsap.to(container, { opacity: 1, duration: 0.5 }),
    onLeaveBack:  () => gsap.to(container, { opacity: 0, duration: 0.4 }),
  });

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
}
