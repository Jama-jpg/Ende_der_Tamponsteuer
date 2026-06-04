/* ═══════════════════════════════════════════════════════════════════
   SCENE — 25.000 Euro (Chapter 5, Scene 2)
   The 17 tampon infographics morph into red circles and their labels
   change from "1000" to "1000€". Then 8 more circles fall from the
   top to fill out 25 total (25 × 1000€ = 25.000€). A euro counter
   ticks up in parallel. All 25 coins become draggable at scene bottom.

   Timeline (0 → 1 over 300vh):
     0.05–0.20  Counter ticks 0 → 25000; text overlay fades in
     0.05–0.45  17 tampons morph to circles (pill fades, circle grows)
     0.38–0.72  8 extra circles rain from top → stacked positions
     0.92–0.98  Text overlay fades out
═══════════════════════════════════════════════════════════════════ */
import { COIN_POSITIONS } from '../../../core/constants.js';

/* Off-screen start positions for the 8 extra coins (indices 17-24) */
const EXTRA_STARTS = [
  [790, -60], [880, -75],
  [700, -80], [790, -65], [880, -90],
  [700, -70], [790, -80], [880, -60],
];

/* Land order for extra coins: bottom rows first (gravity stacking) */
const EXTRA_FALL_ORDER = [5, 6, 7, 2, 3, 4, 0, 1]; // indices into slice(17)

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
    const { coinsGrp, coinEls, tamponPillEls } = stage.refs;
    const counterEl = document.getElementById('ch5-counter');

    /* Position extra coins off-screen above their landing spots */
    coinEls.slice(17).forEach((g, j) => {
      const [cx, cy] = COIN_POSITIONS[j + 17];
      const [rx, ry] = EXTRA_STARTS[j];
      gsap.set(g, { x: rx - cx, y: ry - cy });
    });

    const proxy = { val: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch5-25k',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        snap: { snapTo: [0.75], duration: { min: 0.2, max: 0.5 }, delay: 0.1 },
      },
    });

    /* Counter ticks up alongside the morph */
    tl.to('#st-ch5-25k', { opacity: 1, duration: 0.10, ease: 'power1.out' }, 0.05);
    tl.to(proxy, {
      val: 25000,
      duration: 0.15,
      ease: 'power2.inOut',
      onUpdate() {
        if (!counterEl) return;
        counterEl.textContent = Math.round(proxy.val).toLocaleString('de-AT');
      },
    }, 0.05);

    /* Morph each tampon → circle (staggered, bottom rows first) */
    const MORPH_ORDER = [16, 13, 14, 15, 10, 11, 12, 7, 8, 9, 4, 5, 6, 1, 2, 3, 0];
    MORPH_ORDER.forEach((idx, order) => {
      const g       = coinEls[idx];
      const pillG   = tamponPillEls[idx];
      const circle  = g.querySelector('circle');
      const euroLbl = g.querySelector('text');
      const t0 = 0.05 + order * 0.016;

      tl.to(pillG,   { opacity: 0, duration: 0.12, ease: 'power1.in' }, t0);
      tl.to(circle,  { attr: { r: 22 }, opacity: 1, duration: 0.18, ease: 'power2.out' }, t0 + 0.06);
      tl.to(euroLbl, { opacity: 1, duration: 0.10, ease: 'power1.out' }, t0 + 0.16);
    });

    /* Extra 8 circles fall in — bottom-row first stacking */
    const extraEls = coinEls.slice(17);
    EXTRA_FALL_ORDER.forEach((j, order) => {
      const g = extraEls[j];
      tl.to(g, {
        x: 0, y: 0, opacity: 1,
        ease: 'power2.out',
        duration: 0.18,
      }, 0.38 + order * 0.046);
    });

    tl.to('#st-ch5-25k', { opacity: 0, duration: 0.06, ease: 'power1.in' }, 0.92);
    tl.to({}, { duration: 0.02 }, 0.98);

    /* Enable drag-and-snap-back after all coins have landed.
       Kill instances when scrolling backward so scrub can reclaim x/y. */
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
