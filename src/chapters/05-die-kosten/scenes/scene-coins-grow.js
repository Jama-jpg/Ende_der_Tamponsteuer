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
import { Y_IN, Y_OUT, DUR_IN, DUR_OUT } from '../../../core/text-anim.js';

export default {
  id: 's-ch5-grow',
  height: '150vh',
  skipSnapStart: true,
  skipSnapEnd: true,
  snapPoints: [0.75],

  overlay: {
    id: 'st-ch5-grow',
    html: `<p class="sl">FÜR VIELE MENSCHEN SIND DIE KOSTEN<br>FÜR PERIODENPRODUKTE EIN REALES PROBLEM.</p>`,
  },

  init({ gsap, ScrollTrigger }) {
    gsap.set('#st-ch5-grow', { y: Y_IN() });

    /* ── Text (non-scrub) ────────────────────────────────────────── */
    ScrollTrigger.create({
      trigger:     '#s-ch5-grow',
      start:       'top 65%',
      onEnter:     () => gsap.to('#st-ch5-grow', { opacity: 1, y: 0,        duration: DUR_IN,  ease: 'power2.out' }),
      onLeaveBack: () => gsap.to('#st-ch5-grow', { opacity: 0, y: Y_IN(),   duration: DUR_OUT, ease: 'power2.in' }),
    });
    ScrollTrigger.create({
      trigger:     '#s-ch5-grow',
      start:       'bottom 35%',
      onEnter:     () => gsap.to('#st-ch5-grow', { opacity: 0, y: -Y_OUT(), duration: DUR_OUT, ease: 'power2.in' }),
      onLeaveBack: () => gsap.to('#st-ch5-grow', { opacity: 1, y: 0,        duration: DUR_IN,  ease: 'power2.out' }),
    });

    /* ── Freeze physics when scene becomes visible ───────────────── */
    ScrollTrigger.create({
      trigger: '#s-ch5-grow',
      start:   'top 90%',
      onEnter() {
        if (ch5State.physics) ch5State.physics.freeze();
      },
    });

    /* ── Grow: top→bottom-bottom (100vh), grid fully built at snap 0.75 ── */
    const GROW_END = 0.75;
    ScrollTrigger.create({
      trigger:  '#s-ch5-grow',
      start:    'top top',
      end:      'bottom bottom',
      scrub:    0.6,
      onUpdate(self) {
        if (!ch5State.physics) return;
        ch5State.physics.setGrowFactor(Math.min(1, self.progress / GROW_END));
      },
      onLeaveBack() {
        if (ch5State.physics) {
          ch5State.physics.setGrowFactor(0);
          ch5State.physics.setConvergeFactor(0);
        }
      },
    });

    /* ── Converge: starts when text fades (bottom 35%), ends at scene exit ── */
    /* This keeps the grid fully visible while the text is on screen, then
       merges the 25 balls into one circle simultaneously with the text leaving. */
    ScrollTrigger.create({
      trigger: '#s-ch5-grow',
      start:   'bottom 35%',
      end:     'bottom top',
      scrub:   0.6,
      onUpdate(self) {
        if (ch5State.physics) ch5State.physics.setConvergeFactor(self.progress);
      },
      onLeaveBack() {
        if (ch5State.physics) ch5State.physics.setConvergeFactor(0);
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
