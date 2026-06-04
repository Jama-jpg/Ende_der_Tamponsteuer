/* ═══════════════════════════════════════════════════════════════════
   SCENE — 25.000 Euro (Chapter 5, Scene 2)
   Tampon fades out. A euro counter ticks up to 25.000 as the number
   in the text overlay. 25 red coins rain from the top-right and stack
   in a pyramid on the right half.

   Timeline (0 → 1 over 300vh):
     0.00–0.12  Tampon + #st-ch5-17k fade out
     0.10–0.25  Counter ticks 0 → 25000; text fades in
     0.18–0.75  25 coins rain from top-right → stacked positions (stagger)
     0.75–1.00  Hold
═══════════════════════════════════════════════════════════════════ */
import { COIN_POSITIONS } from '../../../core/constants.js';

/* Off-screen starting positions for the rain effect (top-right area) */
const RAIN_STARTS = [
  [955, -65], [1025, -82], [1105, -72], [985, -52], [1065, -92],
  [928, -72], [1042, -62], [1082, -82], [1015, -67], [952, -78],
  [1102, -57], [975, -87], [1035, -72], [1092, -62], [942, -82],
  [1055, -67], [1005, -78], [962, -57], [1072, -88], [1025, -72],
  [1082, -62], [942, -77], [1052, -82], [992, -67], [1035, -57],
];

export default {
  id: 's-ch5-25k',
  height: '300vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch5-25k',
    html: `<p class="sl">RUND</p>
           <p class="sh"><span id="ch5-counter">0</span></p>
           <p class="sl">EURO.<br>KOSTET DIE PERIODE ÜBER<br>EIN GANZES LEBEN HINWEG<br>UND WIRD SO ZU EINER<br>UNFREIWILLIGEN<br>FINANZIELLEN VERPFLICHTUNG</p>`,
  },

  init({ gsap, ScrollTrigger, stage, Draggable }) {
    const { tampon3d, coinsGrp, coinEls } = stage.refs;
    const counterEl = document.getElementById('ch5-counter');

    /* Move all coins off-screen to their rain starting positions */
    coinEls.forEach((g, i) => {
      const [rx, ry] = RAIN_STARTS[i] || [990, -70];
      const [cx, cy] = COIN_POSITIONS[i];
      gsap.set(g, { x: rx - cx, y: ry - cy });
    });

    const proxy = { val: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch5-25k',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    tl.to(tampon3d, { opacity: 0, duration: 0.10 }, 0);
    /* scene-17k owns #st-ch5-17k fade-out — no hand-off needed. */

    /* Counter ticks up; coins become visible once counter starts */
    tl.set(coinsGrp, { opacity: 1 }, 0.10);
    tl.to('#st-ch5-25k', { opacity: 1, duration: 0.10, ease: 'power1.out' }, 0.10);
    tl.to(proxy, {
      val: 25000,
      duration: 0.15,
      ease: 'power2.inOut',
      onUpdate() {
        if (!counterEl) return;
        const v = Math.round(proxy.val);
        counterEl.textContent = v.toLocaleString('de-AT');
      },
    }, 0.10);

    /* Coins rain in with stagger — bottom rows land first (gravity stacking) */
    const ORDER = [
      22, 23, 24,        // row 8 (bottom)
      19, 20, 21,        // row 7
      16, 17, 18,        // row 6
      13, 14, 15,        // row 5
      10, 11, 12,        // row 4
       7,  8,  9,        // row 3
       4,  5,  6,        // row 2
       1,  2,  3,        // row 1
       0,                 // top
    ];

    ORDER.forEach((idx, order) => {
      const g = coinEls[idx];
      tl.to(g, {
        x: 0,
        y: 0,
        ease: 'power2.out',
        duration: 0.18,
      }, 0.18 + order * 0.022);
    });

    /* Text fades out before scene-kosten-detail begins (owns its own lifecycle). */
    tl.to('#st-ch5-25k', { opacity: 0, duration: 0.06, ease: 'power1.in' }, 0.92);

    tl.to({}, { duration: 0.02 }, 0.98);

    /* Enable drag-and-snap-back after coins have landed.
       Kill instances when scrolling backward so the scrub can reclaim x/y. */
    let draggables = [];
    ScrollTrigger.create({
      trigger: '#s-ch5-25k',
      start: '80% top',
      endTrigger: '#s-ch5-grow',
      end: 'bottom bottom',
      onEnter() {
        draggables = Draggable.create(coinEls, {
          type: 'x,y',
          bounds: { minX: -300, maxX: 300, minY: -300, maxY: 300 },
          onDragEnd() {
            gsap.to(this.target, { x: 0, y: 0, ease: 'power2.out', duration: 1.2 });
          },
        });
      },
      onLeaveBack() {
        draggables.forEach(d => d.kill());
        draggables = [];
      },
    });
  },
};
