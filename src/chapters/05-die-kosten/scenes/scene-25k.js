/* ═════════════════════��════════════════════════════��════════════════
   SCENE — 25.000 Euro (Chapter 5, Scene 2)

   Reuses the physics world started by scene-17k (ch5State.physics).
   When this section enters the viewport:
     • 8 coin circles are dropped into the live physics world
     • The euro counter animates 0 → 25 000

   When the section leaves forward (user scrolled past):
     • Physics world is destroyed
     • SVG coins group is made visible for scene-coins-grow

   Physics is independent of scroll — it runs on its own RAF loop.
═════════════════════════════════════��═══════════════════════════��═ */
import { createPhysicsWorld } from '../gravity-physics.js';
import { ch5State } from '../chapter5-state.js';

export default {
  id: 's-ch5-25k',
  height: '300vh',
  skipSnapStart: true,
  snapPoints: [0.80],

  overlay: {
    id: 'st-ch5-25k',
    html: `<p class="sl">RUND</p>
           <p class="sh"><span id="ch5-counter">0</span></p>
           <p class="sl">EURO.<br>KOSTET DIE PERIODE ÜBER<br>EIN GANZES LEBEN HINWEG<br>UND WIRD SO ZU EINER<br>UNFREIWILLIGEN<br>FINANZIELLEN VERPFLICHTUNG</p>`,
  },

  init({ gsap, ScrollTrigger, stage }) {
    const { coinsGrp } = stage.refs;

    /* ── Text overlay (non-scrub) ────────────────────────────────── */
    ScrollTrigger.create({
      trigger:    '#s-ch5-25k',
      start:      'top 65%',
      onEnter:    () => gsap.to('#st-ch5-25k', { opacity: 1, duration: 0.5, ease: 'power1.out' }),
      onLeaveBack:() => gsap.to('#st-ch5-25k', { opacity: 0, duration: 0.3, ease: 'power1.in' }),
    });
    ScrollTrigger.create({
      trigger:    '#s-ch5-25k',
      start:      'bottom 35%',
      onEnter:    () => gsap.to('#st-ch5-25k', { opacity: 0, duration: 0.3, ease: 'power1.in' }),
      onLeaveBack:() => gsap.to('#st-ch5-25k', { opacity: 1, duration: 0.3, ease: 'power1.out' }),
    });

    /* ── Counter helper ──────────────────────────────────────────── */
    const counterEl = document.getElementById('ch5-counter');
    let counterTween = null;

    function startCounter() {
      if (counterTween) counterTween.kill();
      const proxy = { val: 0 };
      if (counterEl) counterEl.textContent = '0';
      counterTween = gsap.to(proxy, {
        val:      25000,
        duration: 2,
        ease:     'power2.out',
        onUpdate() {
          if (counterEl) counterEl.textContent = Math.round(proxy.val).toLocaleString('de-AT');
        },
      });
    }

    function resetCounter() {
      if (counterTween) { counterTween.kill(); counterTween = null; }
      if (counterEl) counterEl.textContent = '0';
    }

    /* ── ScrollTrigger: morph tampons → balls on scene enter ────── */
    ScrollTrigger.create({
      trigger: '#s-ch5-25k',
      start:   'top 70%',
      onEnter() {
        /* Edge case: user jumped directly here, skipping scene-17k */
        if (!ch5State.physics) {
          ch5State.hasPlayed = true;
          ch5State.physics = createPhysicsWorld({ tamponCount: 17, spawnIntervalMs: 300 });
        }
        if (!ch5State.morphed) {
          ch5State.morphed = true;
          ch5State.physics.morph({ extraBalls: 8, extraSpawnMs: 400 });
          startCounter();
        }
      },
    });

    ScrollTrigger.create({
      trigger: '#s-ch5-25k',
      start:   'bottom top',   // section fully scrolled past
      onEnter() {
        /* User scrolled forward past scene — tear down physics, show SVG coins */
        if (ch5State.physics) {
          ch5State.physics.destroy();
          ch5State.physics = null;
        }
        ch5State.morphed = false;
        gsap.set(coinsGrp, { opacity: 1 });
      },
      onLeaveBack() {
        /* User scrolled back into scene from beyond — restore SVG coins hidden */
        gsap.set(coinsGrp, { opacity: 0 });
      },
    });
  },
};
