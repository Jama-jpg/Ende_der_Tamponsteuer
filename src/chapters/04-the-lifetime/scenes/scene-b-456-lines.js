/* ═══════════════════════════════════════════════════════════════════
   SCENE B — 456 lines burst as barcode + "456 mal" text
   Enters from scene-a's end state: rect + 38 dividers + "FÜR 38 JAHRE".

   The 38 year-divider lines stay visible throughout — the 456 lines
   layer on top, spanning the rect width, so the combined effect reads
   like a dense barcode over the 38-year rectangle.

   Timeline (0 → 1 over 300vh):
     0.00–0.08  "FÜR 38 JAHRE" fades out
     0.12–0.55  456 lines expand from collapsed centre to rect width
     0.60–0.78  "INSGESAMT 456 mal" text fades in
     0.78–1.00  Hold
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-periode-b',
  height: '300vh',
  skipSnapStart: true,

  init({ gsap, stage }) {
    const { linesGrp, lineEls } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-periode-b',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
    });

    /* Fade out previous text (explicitly set from-state to avoid stale values) */
    tl.fromTo('#st-p2', { opacity: 1 }, { opacity: 0, duration: 0.08 }, 0);

    /* 456 lines expand from rect centre (x≈720–730) to rect bounds (x≈650–800)
       — layered on top of the 38 year-dividers for a barcode effect */
    tl
      .to(linesGrp, { opacity: 1, duration: 0.04 }, 0.12)
      .to(lineEls, {
        attr: () => ({
          x1: 650 + Math.random() * 3,
          x2: 797 + Math.random() * 3,
        }),
        stagger: { each: 0.0003, from: 'start' },
        ease: 'power2.out',
        duration: 0.38,
      }, 0.16);

    /* "INSGESAMT 456 mal" text */
    tl.to('#st-p3', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.60);
  },
};
