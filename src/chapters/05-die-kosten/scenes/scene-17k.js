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
    html: `<p class="sl">EIN LEBEN VOLLER ZYKLEN ERFORDERT ÜBER</p>
           <p class="sh">17.000</p>
           <p class="sl">PERIODENPRODUKTE (TAMPONS, BINDEN&nbsp;&amp;&nbsp;CO.),<br>UM DURCH DIESE ZEIT ZU KOMMEN.</p>`,
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

    /* ── IntersectionObserver: physics lifecycle ─────────────────── */
    const section = document.getElementById('s-ch5-17k');

    function startPhysics() {
      /* Hide ch4 holdover elements that may still be visible */
      gsap.to([mRect, rRect, lines38Grp], { opacity: 0, duration: 0.4 });
      ch5State.physics = createPhysicsWorld({ tamponCount: 20, spawnIntervalMs: 300 });
    }

    const observer = new IntersectionObserver((entries) => {
      const { isIntersecting, boundingClientRect: { top } } = entries[0];

      if (isIntersecting) {
        /* Play once per page load — storyboard: animation triggers once and
           stays frozen if user scrolls back. */
        if (!ch5State.hasPlayed) {
          ch5State.hasPlayed = true;
          startPhysics();
        }
        /* Re-entry after scroll-back: physics canvas is position:fixed,
           already visible — nothing to do. */
        return;
      }

      /* top > 0: scrolled back above section — keep physics alive (frozen pile).
         top < 0: scrolled into scene-25k — keep alive; scene-25k manages. */
      if (top > 0) {
        gsap.to('#st-ch5-17k', { opacity: 0, duration: 0.2 });
      }
    }, { threshold: 0.15 });

    observer.observe(section);
  },
};
