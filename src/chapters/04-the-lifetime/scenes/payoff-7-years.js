/* ═══════════════════════════════════════════════
   SCENE — 7 years payoff (s13)
   The lines fall away, the 7-year highlight rect is revealed, the final
   "7 Jahre" text appears, and the VAT label pulses to its locked 0%.
   This scene also locks the glitch counter to its final values.
═══════════════════════════════════════════════ */

export default {
  id: 's13',
  height: '250vh',
  overlay: {
    id: 'st13',
    html: `<p class="sl">DAS SIND<br>ZUSAMMENGERECHNET</p>
           <p class="sh">7 JAHRE</p>
           <p class="sl">MENSTRUATION. DURCHGEHEND.</p>`,
  },

  init({ gsap, ScrollTrigger, stage, controllers }) {
    const r = stage.refs;
    const { glitch } = controllers;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s13', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl
      .to('#st12', { opacity: 0, duration: 0.12 }, 0)
      .to(r.lineEls, {
        y: 640,
        opacity: 0,
        stagger: { each: 0.0012, from: 'random' },
        ease: 'power2.in',
        duration: 0.48,
      }, 0.0)
      .to(r.mRect,    { opacity: 0, duration: 0.22 }, 0.12)
      .to(r.linesGrp, { opacity: 0, duration: 0.08 }, 0.62)
      .to(r.rRect,    { opacity: 1, duration: 0.28, ease: 'power1.out' }, 0.52)
      .to('#st13',    { opacity: 1, duration: 0.25 }, 0.65)
      .to(r.vatFixed, { scale: 1.45, color: '#D63335', duration: 0.1, ease: 'power2.out' }, 0.76)
      .to(r.vatFixed, { scale: 1, color: '#1a1a1a', duration: 0.12, ease: 'power2.in' }, 0.87);

    /* Lock the counters to their final state at s13; re-arm on scroll back up. */
    ScrollTrigger.create({
      trigger: '#s13',
      start:   'top top',
      end:     'bottom bottom',
      onEnter:     glitch.setFinal,
      onLeaveBack: glitch.start,
    });
  },
};
