/* ═══════════════════════════════════════════════════════════════════
   SCENE — Coins Grow (Chapter 5, Scene 4)
   The 25 stacked coins grow in radius and scatter to fill the right
   half of the screen.

   Timeline (0 → 1 over 200vh):
     0.00–0.12  Text swap
     0.15–0.70  Each coin's circle grows r: 22 → 82 and moves to scatter position
     0.70–1.00  Hold
═══════════════════════════════════════════════════════════════════ */
import { COIN_POSITIONS, COIN_SCATTER } from '../../../core/constants.js';

export default {
  id: 's-ch5-grow',
  height: '200vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch5-grow',
    html: `<p class="sl">FÜR VIELE MENSCHEN SIND DIE KOSTEN<br>FÜR PERIODENPRODUKTE EIN REALES PROBLEM.</p>`,
  },

  init({ gsap, stage }) {
    const { coinEls } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch5-grow',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
      },
    });

    tl.to('#st-ch5-detail', { opacity: 0, duration: 0.10, ease: 'power1.in' }, 0);
    tl.to('#st-ch5-grow',   { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.12);

    /* Grow each coin and scatter it */
    coinEls.forEach((g, i) => {
      const circle = g.querySelector('circle');
      const label  = g.querySelector('text');
      const [cx, cy] = COIN_POSITIONS[i];
      const [scx, scy] = COIN_SCATTER[i];
      const tx = scx - cx;
      const ty = scy - cy;

      tl.to(g, { x: tx, y: ty, ease: 'power2.inOut', duration: 0.35 }, 0.15 + i * 0.01);
      tl.to(circle, { attr: { r: 82 }, ease: 'power2.inOut', duration: 0.35 }, 0.15 + i * 0.01);
      tl.to(label,  { attr: { 'font-size': 12 }, ease: 'power2.inOut', duration: 0.35 }, 0.15 + i * 0.01);
    });

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
