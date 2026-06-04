/* ═══════════════════════════════════════════════════════════════════
   SCENE B — 456 lines burst as barcode + "456 mal" text
   Enters from scene-a's end state: rect + 38 dividers (st-p2 already gone).

   The 38 year-divider lines stay visible throughout — the 456 lines
   layer on top, spanning the rect width, so the combined effect reads
   like a dense barcode over the 38-year rectangle.

   Timeline (0 → 1 over 300vh):
     0.15–0.58  456 lines expand from collapsed centre to rect width
     0.65–0.78  "INSGESAMT 456 mal" text fades in
     0.78–0.88  Hold — user reads the label
     0.88–0.96  "INSGESAMT 456 mal" fades out (scene owns its own text)
     0.96–1.00  Hold — clean slate for scene C
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-periode-b',
  height: '150vh',
  skipSnapStart: true,

  init({ gsap, stage }) {
    const { linesGrp, lineEls } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-periode-b',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* Scene A owns the fade-out of #st-p2 — no cross-scene hand-off needed. */

    /* 456 lines expand from rect centre (x≈770–780) to rect bounds (x≈700–850)
       — layered on top of the 38 year-dividers for a barcode effect */
    tl
      .to(linesGrp, { opacity: 1, duration: 0.04 }, 0.15)
      .to(lineEls, {
        attr: () => ({
          x1: 700 + Math.random() * 3,
          x2: 847 + Math.random() * 3,
        }),
        stagger: { each: 0.0003, from: 'start' },
        ease: 'power2.out',
        duration: 0.38,
      }, 0.19);

    /* "INSGESAMT 456 mal" fades in early as lines start appearing, holds long,
       then fades out late so scene C starts with a clean slate. */
    tl.to('#st-p3', { opacity: 1, duration: 0.10, ease: 'power1.out' }, 0.12);
    tl.to('#st-p3', { opacity: 0, duration: 0.06, ease: 'power1.in'  }, 0.92);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
