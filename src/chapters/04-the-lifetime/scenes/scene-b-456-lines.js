/* ═══════════════════════════════════════════════════════════════════
   SCENE B — 456 lines burst as barcode + "456 mal" text
   Enters from scene-a's end state: rect + 38 dividers + "FÜR 38 JAHRE".

   The 38 year-divider lines stay visible throughout — the 456 lines
   layer on top, spanning the rect width, so the combined effect reads
   like a dense barcode over the 38-year rectangle.

   Timeline (0 → 1 over 300vh):
     0.00–0.10  "FÜR 38 JAHRE" fades out first (no overlap with animation)
     0.15–0.58  456 lines expand from collapsed centre to rect width
     0.65–0.78  "INSGESAMT 456 mal" text fades in
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

    /* Fade out previous text at the very start — before lines appear.
       immediateRender:false so FROM is captured during actual play (opacity:1
       from scene A), not at page-load time (when it would be 0). */
    tl.to('#st-p2', { opacity: 0, duration: 0.10, immediateRender: false }, 0.00);

    /* 456 lines expand from rect centre (x≈720–730) to rect bounds (x≈650–800)
       — layered on top of the 38 year-dividers for a barcode effect */
    tl
      .to(linesGrp, { opacity: 1, duration: 0.04 }, 0.15)
      .to(lineEls, {
        attr: () => ({
          x1: 650 + Math.random() * 3,
          x2: 797 + Math.random() * 3,
        }),
        stagger: { each: 0.0003, from: 'start' },
        ease: 'power2.out',
        duration: 0.38,
      }, 0.19);

    /* "INSGESAMT 456 mal" text fades in after lines are fully built. */
    tl.to('#st-p3', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.65);
  },
};
