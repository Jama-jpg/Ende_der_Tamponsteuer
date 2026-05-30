/* ═══════════════════════════════════════════════════════════════════
   SCENE C — 456 lines retract → 31 years fade → 7-year payoff text
   Enters from scene-b's end state: rect + 38 dividers + 456 barcode
   lines + "INSGESAMT 456 mal" text.

   Timeline (0 → 1 over 300vh):
     0.00–0.08  "456 mal" text fades out
     0.06–0.26  456 lines converge back to rect centre (from random)
     0.28–0.38  456-lines group fades out; 38 dividers remain visible
     0.36–0.58  Light-pink rRect overlay fades in over bottom 31 years
                (top 7-year strip stays solid red — the visual payoff)
     0.60–0.82  Final text "DAS SIND … 7 JAHRE MENSTRUATION." fades in
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

    /* Fade out "456 mal" text */
    tl.fromTo('#st-p3', { opacity: 1 }, { opacity: 0, duration: 0.08 }, 0);

    /* 456 lines converge back toward the rect centre */
    tl
      .to(lineEls, {
        attr: { x1: 724, x2: 726 },
        stagger: { each: 0.00008, from: 'random' },
        ease: 'power2.in',
        duration: 0.18,
      }, 0.06)
      .to(linesGrp, { opacity: 0, duration: 0.10 }, 0.28);

    /* Light-pink overlay fades in over bottom 31 years (top 7 stay red) */
    tl.fromTo(rRect, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power1.out' }, 0.36);

    /* Final payoff text */
    tl
      .to('#st-p4', { opacity: 1, duration: 0.16, ease: 'power1.out' }, 0.62)
      .to({}, { duration: 0.02 }, 0.98);
  },
};
