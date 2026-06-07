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

    /* ── IntersectionObserver: physics + coins lifecycle ─────────── */
    const section = document.getElementById('s-ch5-25k');

    const observer = new IntersectionObserver((entries) => {
      const { isIntersecting, boundingClientRect: { top } } = entries[0];

      if (isIntersecting) {
        /* Ensure physics is running (covers the edge case where the user
           jumped directly into this section, skipping scene-17k). */
        if (!ch5State.physics) {
          ch5State.hasPlayed = true;
          ch5State.physics = createPhysicsWorld({ tamponCount: 20, spawnIntervalMs: 300 });
        }

        /* Add coins once per visit */
        if (!ch5State.coinsAdded) {
          ch5State.coinsAdded = true;
          ch5State.coinHandle = ch5State.physics.addCoins(8, 450);
          startCounter();
        }
        return;
      }

      if (top < 0) {
        /* Section is above viewport: user scrolled forward past this scene.
           Tear down physics and reveal the SVG coins for scene-coins-grow. */
        if (ch5State.physics) {
          ch5State.physics.destroy();
          ch5State.physics   = null;
          ch5State.coinHandle = null;
        }
        ch5State.coinsAdded = false;
        /* SVG coins are at their natural COIN_POSITIONS — show them for
           scene-kosten-detail and scene-coins-grow. */
        gsap.set(coinsGrp, { opacity: 1 });
      } else {
        /* top > 0: section is below viewport (user scrolled back up into 17k).
           Remove the extra coins so scene-17k shows only tampons. */
        if (ch5State.coinsAdded && ch5State.coinHandle) {
          ch5State.coinHandle.remove();
          ch5State.coinHandle = null;
        }
        ch5State.coinsAdded = false;
        resetCounter();
      }
    }, { threshold: 0 });

    observer.observe(section);
  },
};
