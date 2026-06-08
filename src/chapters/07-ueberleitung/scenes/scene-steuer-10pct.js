/* ═══════════════════════════════════════════════════════════════════
   SCENE — 10 % MwSt.  (Chapter 7 · Scene 2)
   Intro text fades out.  Right-side text fades in.  The scale appears:
   beam + both arms.  Left pan (Bücher / Kaviar / Honig + "10%") fades
   in, then the beam tips LEFT 20°.  Arms stay vertical via gravity.
═══════════════════════════════════════════════════════════════════ */
import { applyGravity } from '../waage-gravity.js';

export default {
  id: 's-ch7-steuer-10pct',
  height: '200vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-steuer-10pct',
    html: `
      <p class="sl">Während in Österreich bis ins<br>
      Jahr 2020 für Produkte<br>
      wie Bücher oder Kaviar ein reduzierter<br>
      Mehrwertsteuersatz galt,…</p>
    `,
  },

  init({ gsap }) {
    /* Text sits on the RIGHT — visual is on the left pan */
    gsap.set('#st-ch7-steuer-10pct', { left: 'auto', right: '0' });

    const waage   = document.getElementById('waage-grp');
    const beamGrp = document.getElementById('waage-beam-grp');
    const circleL = document.getElementById('waage-circle-l');
    const armL    = document.getElementById('waage-arm-l');
    const armR    = document.getElementById('waage-arm-r');
    const circleR = document.getElementById('waage-circle-r');

    const elems = { armL, armR, circleL, circleR };

    /* Initialise arm positions at rot=0 (matches markup, but explicit is safe) */
    applyGravity(0, elems);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-steuer-10pct',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* Steuer-intro text out */
    tl.to('#st-ch7-steuer-intro', { opacity: 0, duration: 0.12, ease: 'power1.in' }, 0.0);

    /* Right-side text in — stays until scene-steuer-20pct fades it out */
    tl.to('#st-ch7-steuer-10pct', { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.12);

    /* Scale structure appears (beam + both arms become visible) */
    tl.to(waage, { opacity: 1, duration: 0.22, ease: 'power1.out' }, 0.22);

    /* Left pan fades in */
    tl.to(circleL, { opacity: 1, duration: 0.22, ease: 'power1.out' }, 0.40);

    /* Beam tips LEFT 20° (counter-clockwise); arms always stay vertical */
    tl.fromTo(beamGrp,
      { rotation: 0,   svgOrigin: '500 198' },
      {
        rotation: -20, svgOrigin: '500 198',
        duration: 0.38,
        ease: 'power3.inOut',
        onUpdate() {
          applyGravity(gsap.getProperty(beamGrp, 'rotation'), elems);
        },
      },
      0.55,
    );
  },
};
