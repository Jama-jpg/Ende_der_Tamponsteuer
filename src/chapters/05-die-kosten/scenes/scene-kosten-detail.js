/* ═══════════════════════════════════════════════════════════════════
   SCENE — Kosten Detail (Chapter 5, Scene 3)
   25 balls stay on screen. When the breakdown text appears, icon
   bodies representing Schmerzmittel (pill), Binde (pad), and
   Unterwäsche fall from the top into the physics world.
   Physics is destroyed when the section is fully scrolled past.
═══════════════════════════════════════════════════════════════════ */
import { ch5State } from '../chapter5-state.js';

export default {
  id: 's-ch5-detail',
  height: '150vh',
  skipSnapStart: true,
  snapPoints: [0.75],

  overlay: {
    id: 'st-ch5-detail',
    html: `<p class="sl">FÜR PERIODENPRODUKTE,<br>SCHMERZMITTEL, ERSATZKLEIDUNG,<br>MEDIKAMENTE UND BEGLEITKOSTEN.</p>`,
  },

  init({ gsap, ScrollTrigger }) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch5-detail',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    tl.to('#st-ch5-detail', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.12);
    tl.to('#st-ch5-detail', { opacity: 0, duration: 0.06, ease: 'power1.in'  }, 0.92);
    tl.to({}, { duration: 0.02 }, 0.98);

    /* Drop icon bodies when text enters */
    ScrollTrigger.create({
      trigger: '#s-ch5-detail',
      start:   'top 70%',
      onEnter() {
        if (ch5State.physics && !ch5State.iconsAdded) {
          ch5State.iconsAdded = true;
          ch5State.physics.addIcons(5, 280);
        }
      },
    });

  },
};
