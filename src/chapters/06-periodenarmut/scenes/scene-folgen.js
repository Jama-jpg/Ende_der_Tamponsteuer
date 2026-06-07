/* ═══════════════════════════════════════════════════════════════════
   SCENE — Folgen (Chapter 6, Scene 3)
   The big red circle fades out, leaving only the dark sub-circle.
   Text shifts to consequences.

   Timeline (0 → 1 over 150vh):
     0.00–0.10  Text swap
     0.12–0.38  Big red circle fades out
     0.38–1.00  Hold
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch6-folgen',
  height: '150vh',
  skipSnapStart: true,
  snapPoints: [0.65],

  overlay: {
    id: 'st-ch6-folgen',
    html: `<p class="sl">UND DAS IST EIN PROBLEM MIT FOLGEN.<br>VON INFEKTIONEN<br>BIS ZUM SOZIALEN RÜCKZUG.</p>`,
  },

  init({ gsap, stage }) {
    const { povCircle, povPie17 } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-folgen',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* scene-500k owns #st-ch6-500k fade-out. */
    tl.to('#st-ch6-folgen', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.12);
    tl.to('#st-ch6-folgen', { opacity: 0, duration: 0.06, ease: 'power1.in'  }, 0.92);

    tl.to([povCircle, povPie17], { opacity: 0, ease: 'power1.in', duration: 0.24 }, 0.14);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
