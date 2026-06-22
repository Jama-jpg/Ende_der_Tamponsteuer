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
import { Y_IN, Y_OUT, DUR_IN, DUR_OUT } from '../../../core/text-anim.js';

export default {
  id: 's-ch5-17k',
  height: '120vh',
  skipSnapStart: true,
  snapPoints: [0.65],
  snapOnce: true,

  overlay: {
    id: 'st-ch5-17k',
    html: `<p class="sl">EIN LEBEN VOLLER <br> ZYKLEN ERFORDERT ÜBER</p>
           <p class="sh">17.000</p>
           <p class="sl">PERIODENPRODUKTE. DAZU KOMMEN <br> SCHMERZMITTEL, 
           ERSATZKLEIDUNG <br> UND ANDERE NOTWENDIGKEITEN.</p>`,
  },

  init({ gsap, ScrollTrigger, stage }) {
    const { mRect, rRect, lines38Grp } = stage.refs;

    gsap.set('#st-ch5-17k', { y: Y_IN() });

    /* ── Text overlay: fade in when section is in view (no scrub) ── */
    ScrollTrigger.create({
      trigger:    '#s-ch5-17k',
      start:      'top 65%',
      onEnter:    () => gsap.to('#st-ch5-17k', { opacity: 1, y: 0,       duration: DUR_IN,  ease: 'power2.out' }),
      onLeaveBack:() => gsap.to('#st-ch5-17k', { opacity: 0, y: Y_IN(),  duration: DUR_OUT, ease: 'power2.in' }),
    });
    ScrollTrigger.create({
      trigger:    '#s-ch5-17k',
      start:      'bottom 35%',
      onEnter:    () => gsap.to('#st-ch5-17k', { opacity: 0, y: -Y_OUT(), duration: DUR_OUT, ease: 'power2.in' }),
      onLeaveBack:() => gsap.to('#st-ch5-17k', { opacity: 1, y: 0,       duration: DUR_IN,  ease: 'power2.out' }),
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
      onLeaveBack() {
        /* Always reset flags so the animation replays on next forward scroll */
        ch5State.hasPlayed  = false;
        ch5State.morphed    = false;
        ch5State.iconsAdded = false;
        gsap.to([mRect, rRect, lines38Grp], { opacity: 1, duration: 0.4 });
        if (!ch5State.physics) return;
        ch5State.physics.liftUp();
        const p = ch5State.physics;
        ch5State.physics = null;
        setTimeout(() => p.destroy(), 800);
      },
    });

    /* ── Re-enter from below (user snapped backward from scene-25k) ── */
    /* When scrolling back from scene-25k, the snap lands at scene-17k's
       end boundary — well past the 'top 70%' trigger above, so onEnter
       never fires. This trigger catches that case via onEnterBack. */
    ScrollTrigger.create({
      trigger: '#s-ch5-17k',
      start:   'top top',
      end:     'bottom bottom',
      onEnterBack() {
        if (!ch5State.hasPlayed && !ch5State.physics) {
          ch5State.hasPlayed = true;
          gsap.set([mRect, rRect, lines38Grp], { opacity: 0 });
          ch5State.physics = createPhysicsWorld({ tamponCount: 17, spawnIntervalMs: 300 });
        }
      },
    });
  },
};
