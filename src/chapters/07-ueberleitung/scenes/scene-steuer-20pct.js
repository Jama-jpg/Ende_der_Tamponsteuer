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
  height: '300vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-steuer-20pct',
    html: `
      <p class="sl">… waren Periodenprodukte mit dem<br>
      regulären Steuersatz belastet.</p>
    `,
  },

  init({ gsap }) {
    /* Text sits on the RIGHT — same side as scene 10pct */
    gsap.set('#st-ch7-steuer-20pct', { left: 'auto', right: '0' });

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
        scrub: 1.0,
      },
    });

    /* Right pan fades in immediately */
    tl.to(circleR, { opacity: 1, duration: 0.18, ease: 'power1.out' }, 0.05);

    /* Beam swings from −15° → +15°; arms stay vertical via gravity. */
    tl.fromTo(beamGrp,
      { rotation: -15, svgOrigin: '500 198' },
      {
        rotation:  15, svgOrigin: '500 198',
        duration: 0.45,
        ease: 'power3.inOut',
        onUpdate() {
          applyGravity(gsap.getProperty(beamGrp, 'rotation'), elems);
        },
      },
      0.12,
    );

    /* 10pct text stays visible while scale swings, then fades out */
    tl.to('#st-ch7-steuer-10pct', { opacity: 0, duration: 0.15, ease: 'power1.in' }, 0.35);

    /* 20pct text fades in → out */
    tl.to('#st-ch7-steuer-20pct', { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.45);
    tl.to('#st-ch7-steuer-20pct', { opacity: 0, duration: 0.15, ease: 'power1.in'  }, 0.82);
  },
};
