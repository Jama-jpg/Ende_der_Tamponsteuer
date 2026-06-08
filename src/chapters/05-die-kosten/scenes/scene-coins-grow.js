/* ═══════════════════════════════════════════════════════════════════
   SCENE — Balls Grow + Converge (Chapter 5, Scene 4)

   The 25 physics balls freeze in place, grow to fill the right half
   of the screen, then converge into one big ball at the poverty-circle
   position. The full animation runs from 'top top' → 'bottom top'
   (the whole 200vh) so convergeFactor=1 lands exactly at the scene
   boundary — no gap before scene-1-4m begins.

   Timeline driven by scroll progress (0 → 1 over 200vh):
     top 90%   → physics frozen
     0 → 0.75  → growFactor 0 → 1  (balls expand into grid)
     0.75 → 1  → convergeFactor 0 → 1  (grid merges into one ball)
     bottom top → physics destroyed, pov-circle shown immediately
═══════════════════════════════════════════════════════════════════ */
import { ch5State } from '../chapter5-state.js';
import { POV_R } from '../../../core/constants.js';

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
      trigger:     '#s-ch5-grow',
      start:       'top 65%',
      onEnter:     () => gsap.to('#st-ch5-grow', { opacity: 1, duration: 0.5, ease: 'power1.out' }),
      onLeaveBack: () => gsap.to('#st-ch5-grow', { opacity: 0, duration: 0.3, ease: 'power1.in' }),
    });
    ScrollTrigger.create({
      trigger:     '#s-ch5-grow',
      start:       'bottom 35%',
      onEnter:     () => gsap.to('#st-ch5-grow', { opacity: 0, duration: 0.3, ease: 'power1.in' }),
      onLeaveBack: () => gsap.to('#st-ch5-grow', { opacity: 1, duration: 0.3, ease: 'power1.out' }),
    });

    /* ── Freeze physics when scene becomes visible ───────────────── */
    ScrollTrigger.create({
      trigger: '#s-ch5-grow',
      start:   'top 90%',
      onEnter() {
        if (ch5State.physics) ch5State.physics.freeze();
      },
    });

    /* ── Grow then converge via scroll progress ─────────────────── */
    /* end: 'bottom top' spreads the animation across the full 200vh so
       convergeFactor reaches 1.0 exactly when the scene boundary is hit
       and scene-1-4m starts — zero gap between the merged ball and the
       poverty circle appearing. */
    const GROW_END = 0.75;
    ScrollTrigger.create({
      trigger:  '#s-ch5-grow',
      start:    'top top',
      end:      'bottom top',
      scrub:    0.6,
      onUpdate(self) {
        if (!ch5State.physics) return;
        const p = self.progress;
        if (p <= GROW_END) {
          ch5State.physics.setGrowFactor(p / GROW_END);
          ch5State.physics.setConvergeFactor(0);
        } else {
          ch5State.physics.setGrowFactor(1);
          ch5State.physics.setConvergeFactor((p - GROW_END) / (1 - GROW_END));
        }
      },
      onLeaveBack() {
        if (ch5State.physics) {
          ch5State.physics.setGrowFactor(0);
          ch5State.physics.setConvergeFactor(0);
        }
      },
    });

    /* ── Destroy physics + hand off to scene-1-4m ───────────────── */
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
        /* Canvas is gone — immediately reveal the SVG poverty circle so
           scene-1-4m can take over without any visual gap. */
        gsap.set('#pov-circle', { opacity: 1, attr: { r: POV_R } });
      },
      onLeaveBack() {
        /* User scrolled back: hide the pov-circle (physics is already
           destroyed so scene-coins-grow shows nothing — acceptable). */
        gsap.set('#pov-circle', { opacity: 0, attr: { r: 0 } });
      },
    });
  },
};
