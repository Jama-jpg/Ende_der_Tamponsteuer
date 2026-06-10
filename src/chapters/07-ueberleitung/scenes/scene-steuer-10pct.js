/* ═══════════════════════════════════════════════════════════════════
   SCENE — 10 % MwSt.  (Chapter 7 · Scene 2)
   Intro text fades out.  Right-side text fades in.  The scale appears:
   beam + both arms.  Left pan (Bücher / Kaviar / Honig + "10%") fades
   in, then the beam tips LEFT 20°.  Arms stay vertical via gravity.
═══════════════════════════════════════════════════════════════════ */
import { applyGravity } from '../waage-gravity.js';
import { textIn, textOut } from '../../../core/text-anim.js';

export default {
  id: 's-ch7-steuer-10pct',
  height: '300vh',
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
    const circleR = document.getElementById('waage-circle-r');
    const iconsL  = document.getElementById('waage-icons-l');

    /* Scale the left icons up; float loop starts after they appear */
    gsap.set(iconsL, { scale: 1.9, transformOrigin: '50% 50%' });

    const elems = { circleL, circleR };

    /* Initialise arm positions at rot=0 (matches markup, but explicit is safe) */
    applyGravity(0, elems);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-steuer-10pct',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.5,
      },
    });

    /* Steuer-intro text out */
    textOut(tl, '#st-ch7-steuer-intro', 0.0, { duration: 0.10 });

    /* Right-side text in — stays visible until scene-steuer-20pct fades it out */
    textIn(tl, '#st-ch7-steuer-10pct', 0.05, { duration: 0.18 });

    /* Scale structure appears (beam + both arms become visible) */
    tl.to(waage, { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.18);

    /* Left pan fades in; start float loop once visible */
    tl.to(circleL, { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.32);
    tl.add(() => {
      gsap.to(iconsL, { y: -12, duration: 1.8, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }, 0.55);

    /* Beam tips LEFT 15° (counter-clockwise); arms always stay vertical */
    tl.fromTo(beamGrp,
      { rotation: 0,   svgOrigin: '500 198' },
      {
        rotation: -15, svgOrigin: '500 198',
        duration: 0.60,
        ease: 'sine.inOut',
        onUpdate() {
          applyGravity(gsap.getProperty(beamGrp, 'rotation'), elems);
        },
      },
      0.40,
    );
  },
};
