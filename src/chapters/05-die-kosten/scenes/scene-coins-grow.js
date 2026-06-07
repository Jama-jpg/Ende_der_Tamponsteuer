/* ═══════════════════════════════════════════════════════════════════
   SCENE — Balls Grow (Chapter 5, Scene 4)

   The 25 physics balls freeze in place and grow via canvas to fill
   the right half of the screen as the user scrolls. No SVG involved.

   Timeline driven by scroll progress (0 → 1 over 200vh):
     enter   → physics frozen
     0 → 1   → growFactor sent to physics, balls expand in afterRender
     bottom  → physics world destroyed
═══════════════════════════════════════════════════════════════════ */
import { ch5State } from '../chapter5-state.js';

export default {
  id: 's-ch5-grow',
  height: '200vh',
  skipSnapStart: true,
  snapPoints: [0.75],

  overlay: {
    id: 'st-ch5-grow',
    html: `<p class="sl">FÜR VIELE MENSCHEN SIND DIE KOSTEN<br>FÜR PERIODENPRODUKTE EIN REALES PROBLEM.</p>`,
  },

  init({ gsap, ScrollTrigger }) {
    /* ── Text (non-scrub) ────────────────────────────────────────── */
    ScrollTrigger.create({
      trigger:    '#s-ch5-grow',
      start:      'top 65%',
      onEnter:    () => gsap.to('#st-ch5-grow', { opacity: 1, duration: 0.5, ease: 'power1.out' }),
      onLeaveBack:() => gsap.to('#st-ch5-grow', { opacity: 0, duration: 0.3, ease: 'power1.in' }),
    });
    ScrollTrigger.create({
      trigger:    '#s-ch5-grow',
      start:      'bottom 35%',
      onEnter:    () => gsap.to('#st-ch5-grow', { opacity: 0, duration: 0.3, ease: 'power1.in' }),
      onLeaveBack:() => gsap.to('#st-ch5-grow', { opacity: 1, duration: 0.3, ease: 'power1.out' }),
    });

    /* ── Freeze physics when scene becomes visible ───────────────── */
    ScrollTrigger.create({
      trigger: '#s-ch5-grow',
      start:   'top 90%',
      onEnter() {
        if (ch5State.physics) ch5State.physics.freeze();
      },
    });

    /* ── Grow balls via scroll progress ─────────────────────────── */
    ScrollTrigger.create({
      trigger:  '#s-ch5-grow',
      start:    'top top',
      end:      'bottom bottom',
      scrub:    0.6,
      onUpdate(self) {
        if (ch5State.physics) ch5State.physics.setGrowFactor(self.progress);
      },
      onLeaveBack() {
        if (ch5State.physics) ch5State.physics.setGrowFactor(0);
      },
    });

    /* ── Destroy physics when scene is fully scrolled past ───────── */
    ScrollTrigger.create({
      trigger: '#s-ch5-grow',
      start:   'bottom top',
      onEnter() {
        if (ch5State.physics) {
          ch5State.physics.destroy();
          ch5State.physics    = null;
          ch5State.morphed    = false;
          ch5State.iconsAdded = false;
        }
      },
    });
  },
};
