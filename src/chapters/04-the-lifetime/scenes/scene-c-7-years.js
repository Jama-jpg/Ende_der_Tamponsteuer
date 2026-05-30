/* ═══════════════════════════════════════════════════════════════════
   SCENE C — 456 lines retract → 31 years fade → 7-year payoff text
   Enters from scene-b's end state: rect + 38 dividers + 456 barcode
   lines (st-p3 already gone, faded out at end of scene B).

   Timeline (0 → 1 over 300vh):
     0.12–0.30  456 lines converge back to rect centre (from random)
     0.32–0.42  456-lines group fades out; 38 dividers remain visible
     0.42–0.62  Light-pink rRect overlay fades in over bottom 31 years
                (top 7-year strip stays solid red — the visual payoff)
     0.65–0.82  Final text "DAS SIND … 7 JAHRE MENSTRUATION." fades in
     0.82–1.00  Hold
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-periode-c',
  height: '300vh',
  skipSnapStart: true,

  init({ gsap, stage }) {
    const { linesGrp, lineEls, rRect } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-periode-c',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
    });

    /* Fade out "456 mal" text as scene C begins scrolling. */
    tl.to('#st-p3', { opacity: 0, duration: 0.08, ease: 'power1.in' }, 0.04);

    /* 456 lines converge back toward the rect centre */
    tl
      .to(lineEls, {
        attr: { x1: 724, x2: 726 },
        stagger: { each: 0.00008, from: 'random' },
        ease: 'power2.in',
        duration: 0.18,
      }, 0.12)
      .to(linesGrp, { opacity: 0, duration: 0.10 }, 0.32);

    /* Light-pink overlay fades in over bottom 31 years (top 7 stay red) */
    tl.fromTo(rRect, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power1.out' }, 0.42);

    /* Final payoff text — only after rect animation is complete. */
    tl
      .to('#st-p4', { opacity: 1, duration: 0.16, ease: 'power1.out' }, 0.65)
      .to({}, { duration: 0.02 }, 0.98);
  },
};
