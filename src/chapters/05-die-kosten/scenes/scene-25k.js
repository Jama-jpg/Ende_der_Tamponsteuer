/* ═════════════════════════════════════════════════════════════════
   SCENE — 25.000 Euro (Chapter 5, Scene 2)

   Reuses the physics world started by scene-17k (ch5State.physics).
   When this section enters the viewport:
     • 8 coin circles are dropped into the live physics world
     • The top-left euro counter flies from its corner position into
       the .sh headline and counts from ~20.000 → 25.000 on arrival

   When the section leaves forward (user scrolled past):
     • Physics world is destroyed
     • SVG coins group is made visible for scene-coins-grow
═════════════════════════════════════════════════════════════════ */
import { createPhysicsWorld } from '../gravity-physics.js';
import { ch5State } from '../chapter5-state.js';
import { killEuroScrub } from '../../../core/euro-counter.js';
import { Y_IN, Y_OUT } from '../../../core/text-anim.js';

export default {
  id: 's-ch5-25k',
  height: '300vh',
  skipSnapStart: true,
  snapPoints: [0.80],
  snapOnce: true,

  overlay: {
    id: 'st-ch5-25k',
    /* #ch5-counter is kept invisible — it serves as the landing-position
       anchor for the flying euro counter. The actual value is shown by
       the #euro-counter element once it arrives here. */
    html: `<p class="sl">ALLES ZUSAMMEN KOSTET EINE MENSTRUIERENDE PERSON IM LAUFE IHRES LEBENS RUND</p>
           <p class="sh"><span id="ch5-counter" style="opacity:0">25.000</span></p>
           <p class="sl">.</p>`,
  },

  init({ gsap, ScrollTrigger }) {
    gsap.set('#st-ch5-25k', { y: Y_IN() });

    let flyTween     = null;
    let finalTween   = null;
    let hasFlown     = false;

    /* ── Fly the top-left counter into the .sh headline ──────────── */
    function flyIn() {
      if (hasFlown) return;
      hasFlown = true;

      const euroEl = document.getElementById('euro-counter');
      const numEl  = document.getElementById('euro-num');
      const shEl   = document.querySelector('#st-ch5-25k .sh');

      if (!euroEl || !shEl || !numEl) return;

      /* Stop the scroll-scrub so it doesn't fight the final count. */
      killEuroScrub();

      const euroRect = euroEl.getBoundingClientRect();
      const shRect   = shEl.getBoundingClientRect();

      /* Delta from euro-counter center → .sh center */
      const dx = (shRect.left  + shRect.width  / 2) - (euroRect.left  + euroRect.width  / 2);
      const dy = (shRect.top   + shRect.height / 2) - (euroRect.top   + euroRect.height / 2);

      /* Scale so the number visually matches the .sh font size */
      const shFontPx   = parseFloat(getComputedStyle(shEl).fontSize);
      const euroFontPx = parseFloat(getComputedStyle(euroEl).fontSize);
      const scaleTo    = shFontPx / euroFontPx;

      flyTween = gsap.to(euroEl, {
        x: dx,
        y: dy,
        scale: scaleTo,
        transformOrigin: 'center center',
        duration: 0.9,
        ease: 'power2.inOut',
        onComplete() {
          /* Final count: current displayed value → 25 000 */
          const startVal = parseInt(numEl.textContent.replace(/\./g, ''), 10) || 0;
          const proxy    = { val: startVal };
          finalTween = gsap.to(proxy, {
            val:      25000,
            duration: 1.5,
            ease:     'power2.out',
            onUpdate() {
              numEl.textContent = Math.round(proxy.val).toLocaleString('de-AT');
            },
          });
        },
      });
    }

    /* ── Reset counter back to its corner position ────────────────── */
    function flyBack() {
      hasFlown = false;
      if (flyTween)   { flyTween.kill();   flyTween   = null; }
      if (finalTween) { finalTween.kill(); finalTween = null; }

      const numEl = document.getElementById('euro-num');
      gsap.to('#euro-counter', {
        x: 0, y: 0, scale: 1,
        transformOrigin: 'center center',
        duration: 0.5,
        ease: 'power2.in',
      });
      /* Restore the value the scrub would have shown */
      if (numEl) numEl.textContent = '20.000';
    }

    /* ── Text overlay ────────────────────────────────────────────── */
    ScrollTrigger.create({
      trigger:     '#s-ch5-25k',
      start:       'top 65%',
      onEnter() {
        gsap.to('#st-ch5-25k', { opacity: 1, y: 0,  duration: 0.5, ease: 'power2.out' });
        flyIn();
      },
      onLeaveBack() {
        gsap.to('#st-ch5-25k', { opacity: 0, y: Y_IN(),  duration: 0.3, ease: 'power2.in' });
        flyBack();
      },
    });

    ScrollTrigger.create({
      trigger:     '#s-ch5-25k',
      start:       'bottom 35%',
      onEnter() {
        gsap.to('#st-ch5-25k',  { opacity: 0, y: -Y_OUT(), duration: 0.3, ease: 'power2.in' });
        gsap.to('#euro-counter', { opacity: 0, duration: 0.3, ease: 'power1.in' });
      },
      onLeaveBack() {
        gsap.to('#st-ch5-25k',  { opacity: 1, y: 0,  duration: 0.3, ease: 'power2.out' });
        gsap.to('#euro-counter', { opacity: 1, duration: 0.3, ease: 'power1.out' });
      },
    });

    /* ── Physics: morph tampons → balls on scene enter ───────────── */
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
        }
      },
    });

  },
};
