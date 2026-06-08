/* ═══════════════════════════════════════════════
   EURO COUNTER — top-left corner
   Fades in with the circle fill (s4). Counts 0 → 20.000 as the reader
   scrolls from s3 through to just before scene-25k. At scene-25k the
   counter flies into the overlay text and finishes counting there.
═══════════════════════════════════════════════ */

let scrubTween = null;

export function createEuroCounter({ gsap, ScrollTrigger }) {
  const numEl  = document.getElementById('euro-num');
  const counter = { value: 0 };

  const fmt = (n) =>
    Math.round(n).toLocaleString('de-AT');

  /* Count 0 → 20 000 from when the counter first appears (~50% into s3)
     to just before scene-25k's overlay fades in (top 80%). The last 5 000
     are counted in the fly animation at the destination. */
  scrubTween = gsap.to(counter, {
    value: 20000,
    ease: 'none',
    scrollTrigger: {
      trigger:    '#s3',
      start:      '50% top',
      endTrigger: '#s-ch5-25k',
      end:        'top 80%',
      scrub:      1.5,
    },
    onUpdate() {
      numEl.textContent = fmt(counter.value);
    },
  });

  /* Attention pulse — fires once as the counter becomes visible (~52% into s3). */
  ScrollTrigger.create({
    trigger: '#s3',
    start:   '52% top',
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

/* Called by scene-25k just before the fly animation begins. */
export function killEuroScrub() {
  if (scrubTween) {
    scrubTween.kill();
    scrubTween = null;
  }
}
