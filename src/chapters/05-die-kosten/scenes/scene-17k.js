/* ═══════════════════════════════════════════════════════════════════
   SCENE — 17.000 Periodenprodukte (Chapter 5, Scene 1)
   17 tampon SVGs fall from the top with real Matter.js physics,
   stacking and colliding. Interactive drag after landing.
═══════════════════════════════════════════════════════════════════ */
import { createGravityPhysics, buildItems } from '../gravity-physics.js';

export default {
  id: 's-ch5-17k',
  height: '200vh',
  skipSnapStart: true,
  snapPoints: [0.65],

  overlay: {
    id: 'st-ch5-17k',
    html: `<p class="sl">EIN LEBEN VOLLER ZYKLEN ERFORDERT ÜBER</p>
           <p class="sh">17.000</p>
           <p class="sl">PERIODENPRODUKTE (TAMPONS, BINDEN&nbsp;&amp;&nbsp;CO.),<br>UM DURCH DIESE ZEIT ZU KOMMEN.</p>`,
  },

  init({ gsap, ScrollTrigger, stage }) {
    const { mRect, rRect, lines38Grp, coinsGrp, coinEls } = stage.refs;

    gsap.set(coinEls.slice(17), { opacity: 0 });

    let physics = null;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch5-17k',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    tl.to([mRect, rRect, lines38Grp], { opacity: 0, duration: 0.12, ease: 'power1.in' }, 0);
    tl.set(coinsGrp, { opacity: 1 }, 0.12);
    tl.to('#st-ch5-17k', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.15);
    tl.to('#st-ch5-17k', { opacity: 0, duration: 0.06, ease: 'power1.in' }, 0.88);
    tl.to({}, { duration: 0.02 }, 0.98);

    ScrollTrigger.create({
      trigger: '#s-ch5-17k',
      start: 'top bottom',
      end: 'bottom top',  // = scene17k bottom at viewport top → scrollY = scene17k.bottom
      onEnter() {
        gsap.set(coinEls.slice(17), { opacity: 0 });
        gsap.set(coinsGrp, { opacity: 1 });
        if (!physics) {
          physics = createGravityPhysics({ items: buildItems(coinEls, 0, 17), gsap });
        }
      },
      onLeave() {
        if (physics) { physics.destroy(); physics = null; }
      },
      onLeaveBack() {
        if (physics) { physics.destroy(); physics = null; }
        gsap.set(coinsGrp, { opacity: 0 });
        gsap.set(coinEls.slice(17), { opacity: 0 });
      },
    });
  },
};
