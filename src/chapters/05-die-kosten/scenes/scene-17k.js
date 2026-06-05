/* ═══════════════════════════════════════════════════════════════════
   SCENE — 17.000 Periodenprodukte (Chapter 5, Scene 1)
   17 tampon SVGs fall from the top as you scroll, stacking at the bottom.
   Pure GSAP scroll-scrub — no physics engine.
═══════════════════════════════════════════════════════════════════ */
import { computeStack17 } from '../physics.js';

export default {
  id: 's-ch5-17k',
  height: '200vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch5-17k',
    html: `<p class="sl">EIN LEBEN VOLLER ZYKLEN ERFORDERT ÜBER</p>
           <p class="sh">17.000</p>
           <p class="sl">PERIODENPRODUKTE (TAMPONS, BINDEN&nbsp;&amp;&nbsp;CO.),<br>UM DURCH DIESE ZEIT ZU KOMMEN.</p>`,
  },

  init({ gsap, ScrollTrigger, stage }) {
    const { mRect, rRect, lines38Grp, coinsGrp, coinEls } = stage.refs;
    const stack17 = computeStack17();

    /* Extra 8 coins (scene-25k) stay hidden */
    gsap.set(coinEls.slice(17), { opacity: 0 });

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

    /* Tampons fall one by one as you scroll — staggered */
    stack17.forEach(({ dx, dy }, i) => {
      const t0 = 0.15 + i * 0.025;
      tl.fromTo(
        coinEls[i],
        { x: dx, y: -600, rotation: 0 },
        { x: dx, y: dy,   duration: 0.10, ease: 'power2.in' },
        t0,
      );
    });

    tl.to('#st-ch5-17k', { opacity: 0, duration: 0.06, ease: 'power1.in' }, 0.88);
    tl.to({}, { duration: 0.02 }, 0.98);

    /* Hide coins when scrolling back above this scene */
    ScrollTrigger.create({
      trigger: '#s-ch5-17k',
      start: 'top bottom',
      onLeaveBack() {
        gsap.set(coinsGrp, { opacity: 0 });
      },
    });
  },
};
