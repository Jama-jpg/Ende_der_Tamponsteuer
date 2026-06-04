/* ═══════════════════════════════════════════════════════════════════
   SCENE — 17.000 Periodenprodukte (Chapter 5, Scene 1)
   Transitions from ch4 end state (rect + rRect visible) to 17 tampon
   infographic SVGs that fall from the top with gravity and stack.
   User can grab and drop individual tampons while held at scene bottom.

   Timeline (0 → 1 over 200vh):
     0.00–0.12  Ch4 rect / lines fade out
     0.12       Coins group becomes visible
     0.15–0.25  Text overlay fades in
     0.18–0.90  17 tampons fall from top, bottom rows first (stagger)
     0.92–0.98  Text overlay fades out
═══════════════════════════════════════════════════════════════════ */
import { COIN_POSITIONS } from '../../../core/constants.js';

/* Off-screen starting positions for each tampon (SVG absolute coords) */
const TAMPON_STARTS = [
  [790, -80],
  [700, -95], [790, -80], [880, -90],
  [700, -85], [790, -100], [880, -75],
  [700, -90], [790, -85], [880, -95],
  [700, -80], [790, -90], [880, -85],
  [700, -95], [790, -80], [880, -90],
  [700, -85],
];

/* Land order: highest y (bottom of screen) first → gravity stacking feel */
const FALL_ORDER = [16, 13, 14, 15, 10, 11, 12, 7, 8, 9, 4, 5, 6, 1, 2, 3, 0];

export default {
  id: 's-ch5-17k',
  height: '200vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch5-17k',
    html: `<p class="sl">EIN LEBEN VOLLER ZYKLEN ERFORDERT ÜBER</p>
           <p class="sh">17.000</p>
           <p class="sl">PERIODENPRODUKTE (TAMPONS, BINDEN&nbsp;&amp;&nbsp;CO.),<br>UM DURCH DIESE ZEIT ZU KOMMEN.</p>`,
  },

  init({ gsap, ScrollTrigger, stage, Draggable }) {
    const { mRect, rRect, lines38Grp, coinsGrp, coinEls } = stage.refs;

    /* Position all 17 tampons off-screen above their resting spots */
    coinEls.slice(0, 17).forEach((g, i) => {
      const [rx, ry] = TAMPON_STARTS[i];
      const [cx, cy] = COIN_POSITIONS[i];
      gsap.set(g, { x: rx - cx, y: ry - cy });
    });

    /* Keep the extra 8 coins (17-24) invisible while in this scene */
    gsap.set(coinEls.slice(17), { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch5-17k',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        snap: { snapTo: [0.75], duration: { min: 0.2, max: 0.5 }, delay: 0.1 },
      },
    });

    tl.to([mRect, rRect, lines38Grp], { opacity: 0, duration: 0.12, ease: 'power1.in' }, 0);
    tl.set(coinsGrp, { opacity: 1 }, 0.12);
    tl.to('#st-ch5-17k', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.15);

    /* Tampons drop in — bottom rows land first, like gravity stacking */
    FALL_ORDER.forEach((idx, order) => {
      tl.to(coinEls[idx], {
        x: 0, y: 0,
        ease: 'power3.out',
        duration: 0.18,
      }, 0.18 + order * 0.044);
    });

    tl.to('#st-ch5-17k', { opacity: 0, duration: 0.06, ease: 'power1.in' }, 0.92);
    tl.to({}, { duration: 0.02 }, 0.98);

    /* Draggable: user can pick up and drop tampons after they've landed */
    let draggables = [];

    function createDraggables() {
      draggables = Draggable.create(coinEls.slice(0, 17), {
        type: 'x,y',
        bounds: { minX: -500, maxX: 500, minY: -600, maxY: 350 },
        onDragEnd() {
          gsap.to(this.target, { x: 0, y: 0, ease: 'power2.out', duration: 1.0 });
        },
      });
    }

    function killDraggables() {
      draggables.forEach(d => d.kill());
      draggables = [];
    }

    ScrollTrigger.create({
      trigger: '#s-ch5-17k',
      start: '78% top',
      endTrigger: '#s-ch5-25k',
      end: 'top top',
      onEnter:     () => createDraggables(),
      onLeave:     () => killDraggables(),
      onEnterBack: () => createDraggables(),
      onLeaveBack: () => killDraggables(),
    });
  },
};
