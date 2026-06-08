/* ═══════════════════════════════════════════════════════════════════
   SCENE — 17.000 Periodenprodukte (Chapter 5, Scene 1)

   A fixed canvas overlay is created once when this section enters the
   viewport (~15% visible). Matter.js runs on its own RAF loop —
   completely independent of the page scroll. 20 tampon pills drop
   from the top and stack in the right half of the viewport.

   Text overlay fades in/out via non-scrub ScrollTrigger callbacks.
   Physics persists into scene-25k (ch5State.physics is shared).
   Animation plays once per page load; the pile freezes on scroll-back.
═══════════════════════════════════════════════════════════════════ */
import { createPhysicsWorld } from '../gravity-physics.js';
import { ch5State } from '../chapter5-state.js';

export default {
  id: 's-ch5-17k',
  height: '200vh',
  skipSnapStart: true,
  snapPoints: [0.65],

  overlay: {
    id: 'st-ch5-17k',
    html: `<p class="sl">EIN LEBEN VOLLER ZYKLEN BEDEUTET ÜBER</p>
           <p class="sh">17.000</p>
           <p class="sl">PERIODENPRODUKTE SOWIE ZUSÄTZLICHE KOSTEN FÜR SCHMERZMITTEL, MEDIKAMENTE, ERSATZKLEIDUNG UND WEITERE BEGLEITKOSTEN.</p>`,
  },

  init({ gsap, ScrollTrigger, stage }) {
    const { mRect, rRect, lines38Grp } = stage.refs;

    /* ── Text overlay: fade in when section is in view (no scrub) ── */
    ScrollTrigger.create({
      trigger:    '#s-ch5-17k',
      start:      'top 65%',
      onEnter:    () => gsap.to('#st-ch5-17k', { opacity: 1, duration: 0.5, ease: 'power1.out' }),
      onLeaveBack:() => gsap.to('#st-ch5-17k', { opacity: 0, duration: 0.3, ease: 'power1.in' }),
    });
    ScrollTrigger.create({
      trigger:    '#s-ch5-17k',
      start:      'bottom 35%',
      onEnter:    () => gsap.to('#st-ch5-17k', { opacity: 0, duration: 0.3, ease: 'power1.in' }),
      onLeaveBack:() => gsap.to('#st-ch5-17k', { opacity: 1, duration: 0.3, ease: 'power1.out' }),
    });

    /* ── Physics trigger via ScrollTrigger (once per page load) ─── */
    ScrollTrigger.create({
      trigger: '#s-ch5-17k',
      start:   'top 70%',
      onEnter() {
        if (!ch5State.hasPlayed) {
          ch5State.hasPlayed = true;
          gsap.to([mRect, rRect, lines38Grp], { opacity: 0, duration: 0.4 });
          ch5State.physics = createPhysicsWorld({ tamponCount: 17, spawnIntervalMs: 300 });
        }
      },
    });
  },
};
