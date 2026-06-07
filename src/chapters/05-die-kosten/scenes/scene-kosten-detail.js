/* ═══════════════════════════════════════════════════════════════════
   SCENE — Kosten Detail (Chapter 5, Scene 3)
   Coins stay stacked. Text swaps to the breakdown of costs.
   User can still grab and drop coins (Draggable active from scene-25k).

   Timeline (0 → 1 over 150vh):
     0.00–0.12  Swap overlay text
     0.12–1.00  Hold (coins interactive)
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch5-detail',
  height: '150vh',
  skipSnapStart: true,
  snapPoints: [0.75],

  overlay: {
    id: 'st-ch5-detail',
    html: `<p class="sl">FÜR PERIODENPRODUKTE,<br>SCHMERZMITTEL, ERSATZKLEIDUNG,<br>MEDIKAMENTE UND BEGLEITKOSTEN.</p>`,
  },

  init({ gsap }) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch5-detail',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* scene-25k owns #st-ch5-25k fade-out. This scene only controls its own text. */
    tl.to('#st-ch5-detail', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.12);
    tl.to('#st-ch5-detail', { opacity: 0, duration: 0.06, ease: 'power1.in'  }, 0.92);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
