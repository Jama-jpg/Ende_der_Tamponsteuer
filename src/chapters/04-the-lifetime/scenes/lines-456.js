/* ═══════════════════════════════════════════════
   SCENE — 456 lines (s12)
   The rect bursts into 456 horizontal lines spanning the viewport, with
   the "456 mal" text.
═══════════════════════════════════════════════ */

export default {
  id: 's12',
  height: '300vh',
  overlay: {
    id: 'st12',
    html: `<p class="sl">INSGESAMT</p>
           <p class="sh">456 mal</p>`,
  },

  init({ gsap, stage }) {
    const { linesGrp, lineEls } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s12', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl
      .to('#st10', { opacity: 0, duration: 0.12 }, 0)
      .to(linesGrp, { opacity: 1, duration: 0.1 }, 0.06)
      .to(lineEls, {
        attr: () => ({
          x1: 40  + Math.random() * 20,
          x2: 940 + Math.random() * 30,
        }),
        stagger: { each: 0.0028, from: 'start' },
        ease: 'power2.out',
        duration: 0.55,
      }, 0.08)
      .to('#st12', { opacity: 1, duration: 0.2 }, 0.65);
  },
};
