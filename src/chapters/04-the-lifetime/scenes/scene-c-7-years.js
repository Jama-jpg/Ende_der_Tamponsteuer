/* ═══════════════════════════════════════════════════════════════════
   SCENE C — 456 lines retract → top 31 years wipe to pink → 7-year payoff
   Enters from scene-b's end state: rect + 38 dividers (lines still visible),
   #st-p3 ("456 mal") still visible — crossfaded to #st-p4 at the start.

   Timeline (0 → 1 over 150vh):
     0.00–0.08  "456 mal" (#st-p3) crossfades out
     0.06–0.16  "DAS SIND … 7 JAHRE" (#st-p4) fades in
     0.12–0.30  456 lines converge back to rect centre (from random)
     0.32–0.42  456-lines group fades out; 38 dividers remain visible
     0.42–0.72  rRect wipes top→bottom: pink overlay grows from y=70 downward
                covering the upper 31 years; bottom 7 stay solid red
     0.82–1.00  Hold
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-periode-c',
  height: '150vh',
  skipSnapStart: true,
  snapPoints: [0.75],

  init({ gsap, ScrollTrigger, stage }) {
    const { linesGrp, lineEls, rRect } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-periode-c',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* Crossfade "456 mal" → "7 JAHRE", then fade out at the end of the chapter. */
    tl.to('#st-p3', { opacity: 0, duration: 0.08, ease: 'power1.in'  }, 0.00);
    tl.to('#st-p4', { opacity: 1, duration: 0.10, ease: 'power1.out' }, 0.06);
    tl.to('#st-p4', { opacity: 0, duration: 0.06, ease: 'power1.in'  }, 0.92);

    /* 456 lines converge back toward the rect centre (CX=775) */
    tl
      .to(lineEls, {
        attr: { x1: 774, x2: 776 },
        stagger: { each: 0.00008, from: 'random' },
        ease: 'power2.in',
        duration: 0.18,
      }, 0.12)
      .to(linesGrp, { opacity: 0, duration: 0.10 }, 0.32);

    /* Pink overlay wipes from top (y=70) downward to y=414, covering the upper
       31 years. The bottom 7 years (y=414→492) remain as solid red mRect.
       rRect starts at opacity 0 (buildStage), height 344, y 70 (markup). */
    tl.fromTo(rRect,
      { opacity: 1, attr: { height: 0 } },
      { attr: { height: 344 }, duration: 0.30, ease: 'power1.inOut' },
      0.42,
    );

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
