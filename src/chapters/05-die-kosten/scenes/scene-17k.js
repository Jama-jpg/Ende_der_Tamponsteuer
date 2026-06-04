/* ═══════════════════════════════════════════════════════════════════
   SCENE — 17.000 Periodenprodukte (Chapter 5, Scene 1)
   Transitions from ch4 end state (rect + rRect visible) to 17 tampon
   infographic SVGs that fall from the top with gravity into the right
   half of the screen (spine → right edge, floor at bottom).
   Items stack randomly on each other.  User can grab and drop tampons
   while held at scene bottom.

   Timeline (0 → 1 over 200vh):
     0.00–0.12  Ch4 rect / lines fade out
     0.12       Coins group becomes visible
     0.15–0.25  Text overlay fades in
     0.18–0.90  17 tampons fall from top, bottom items first (gravity)
     0.92–0.98  Text overlay fades out
═══════════════════════════════════════════════════════════════════ */
import { COIN_POSITIONS } from '../../../core/constants.js';
import { computeStack17 }  from '../physics.js';

/* Deterministic start-position variation so fall trajectories look random
   but are identical on every page load (required for scroll-scrub). */
function startRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

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

    /* Compute physics-based landing positions once */
    const stackPos = computeStack17();
    const rng      = startRng(55555);

    /* Set each tampon to a start position above the screen */
    coinEls.slice(0, 17).forEach((g, i) => {
      const [cx0, cy0] = COIN_POSITIONS[i];
      const { dx } = stackPos[i];
      /* Slight random horizontal spread around target x so fall looks natural */
      const startDx = dx + (rng() - 0.5) * 90;
      /* Start well above the SVG canvas */
      const startDy = -(cy0 + 600 + rng() * 120);
      gsap.set(g, { x: startDx, y: startDy });
    });

    /* Extra 8 coins (scene-25k) stay hidden */
    gsap.set(coinEls.slice(17), { opacity: 0 });

    /* Fall order: items with highest cy (closest to floor) land first */
    const fallOrder = Array.from({ length: 17 }, (_, i) => i)
      .sort((a, b) => stackPos[b].cy - stackPos[a].cy);

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

    /* Tampons drop in — bottom-most land first, creating a gravity stack */
    fallOrder.forEach((idx, order) => {
      const { dx, dy } = stackPos[idx];
      tl.to(coinEls[idx], {
        x: dx, y: dy,
        ease: 'power3.out',
        duration: 0.18,
      }, 0.18 + order * 0.044);
    });

    tl.to('#st-ch5-17k', { opacity: 0, duration: 0.06, ease: 'power1.in' }, 0.92);
    tl.to({}, { duration: 0.02 }, 0.98);

    /* Draggable: user can pick up and drop tampons; they snap back to physics position */
    let draggables = [];

    function createDraggables() {
      draggables = Draggable.create(coinEls.slice(0, 17), {
        type: 'x,y',
        bounds: { minX: -500, maxX: 500, minY: -600, maxY: 400 },
        onDragEnd() {
          const idx = coinEls.indexOf(this.target);
          const { dx, dy } = stackPos[idx];
          gsap.to(this.target, { x: dx, y: dy, ease: 'power2.out', duration: 1.0 });
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
