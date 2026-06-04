/* ═══════════════════════════════════════════════════════════════════
   SCENE — 25.000 Euro (Chapter 5, Scene 2)
   The 17 tampon infographics morph in-place into red circles with
   "1000€" labels. Then 8 more circles rain down from above into the
   right-half gravity pile. A euro counter ticks up in parallel.
   All 25 coins become draggable at scene bottom.

   Timeline (0 → 1 over 300vh):
     0.05–0.20  Counter ticks 0 → 25000; text overlay fades in
     0.05–0.45  17 tampons morph to circles (pill fades, circle grows)
     0.38–0.72  8 extra circles fall from top into physics positions
     0.92–0.98  Text overlay fades out
═══════════════════════════════════════════════════════════════════ */
import { COIN_POSITIONS } from '../../../core/constants.js';
import { computeStack17, computeStack25 } from '../physics.js';

function startRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

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

    /* Recompute the same 17-tampon physics layout as scene-17k */
    const stack17 = computeStack17();
    /* Compute 8 new circles falling on top of the existing pile */
    const stack25 = computeStack25(stack17);
    const rng     = startRng(77777);

    /* Position extra coins above screen ready to fall */
    coinEls.slice(17).forEach((g, j) => {
      const [cx0, cy0] = COIN_POSITIONS[j + 17];
      const { dx } = stack25[j];
      const startDx = dx + (rng() - 0.5) * 80;
      const startDy = -(cy0 + 580 + rng() * 100);
      gsap.set(g, { x: startDx, y: startDy });
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

    /* Morph each tampon → circle in-place (bottom rows first) */
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

    /* 8 extra circles fall into physics positions — bottom-most land first */
    const extraEls    = coinEls.slice(17);
    const extraOrder  = Array.from({ length: 8 }, (_, j) => j)
      .sort((a, b) => stack25[b].cy - stack25[a].cy);

    extraOrder.forEach((j, order) => {
      const { dx, dy } = stack25[j];
      tl.to(extraEls[j], {
        x: dx, y: dy, opacity: 1,
        ease: 'power3.out',
        duration: 0.18,
      }, 0.38 + order * 0.046);
    });

    tl.to('#st-ch5-25k', { opacity: 0, duration: 0.06, ease: 'power1.in' }, 0.92);
    tl.to({}, { duration: 0.02 }, 0.98);

    /* All 25 coins draggable; snap back to their physics positions */
    let draggables = [];
    ScrollTrigger.create({
      trigger: '#s-ch5-25k',
      start: '80% top',
      endTrigger: '#s-ch5-grow',
      end: 'bottom bottom',
      onEnter() {
        draggables = Draggable.create(coinEls, {
          type: 'x,y',
          bounds: { minX: -500, maxX: 500, minY: -600, maxY: 400 },
          onDragEnd() {
            const i   = coinEls.indexOf(this.target);
            const pos = i < 17 ? stack17[i] : stack25[i - 17];
            gsap.to(this.target, { x: pos.dx, y: pos.dy, ease: 'power2.out', duration: 1.2 });
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
