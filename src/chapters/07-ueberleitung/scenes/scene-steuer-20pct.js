/* ═══════════════════════════════════════════════════════════════════
   SCENE — 20 % MwSt.  (Chapter 7 · Scene 3)
   Right-side text (10pct) fades out; left-side text fades in.
   The right pan (tampon + "20%") fades in, then the beam swings from
   −20° all the way to +20° (the heavier right side wins).
   Arms stay vertical throughout via the gravity helper.
═══════════════════════════════════════════════════════════════════ */
import { applyGravity } from '../waage-gravity.js';

export default {
  id: 's-ch7-steuer-20pct',
  height: '200vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-steuer-20pct',
    html: `
      <p class="sl">… waren Periodenprodukte mit dem<br>
      regulären Steuersatz belastet.</p>
    `,
  },

  init({ gsap }) {
    const beamGrp = document.getElementById('waage-beam-grp');
    const circleL = document.getElementById('waage-circle-l');
    const circleR = document.getElementById('waage-circle-r');
    const armL    = document.getElementById('waage-arm-l');
    const armR    = document.getElementById('waage-arm-r');

    const elems = { armL, armR, circleL, circleR };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-steuer-20pct',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* Right-side 10pct text out */
    tl.to('#st-ch7-steuer-10pct', { opacity: 0, duration: 0.12, ease: 'power1.in' }, 0.0);

    /* Left-side text in → out */
    tl.to('#st-ch7-steuer-20pct', { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.12);
    tl.to('#st-ch7-steuer-20pct', { opacity: 0, duration: 0.15, ease: 'power1.in'  }, 0.82);

    /* Right pan fades in */
    tl.to(circleR, { opacity: 1, duration: 0.22, ease: 'power1.out' }, 0.18);

    /* Beam swings from −20° → +20° (40° total); arms stay vertical via gravity.
       fromTo makes the start state explicit — safe even if user jumps here. */
    tl.fromTo(beamGrp,
      { rotation: -20, svgOrigin: '500 198' },
      {
        rotation:  20, svgOrigin: '500 198',
        duration: 0.42,
        ease: 'power3.inOut',
        onUpdate() {
          applyGravity(gsap.getProperty(beamGrp, 'rotation'), elems);
        },
      },
      0.35,
    );
  },
};
