/* ═══════════════════════════════════════════════════════════════════
   SCENE — 1,4 Millionen (Chapter 6, Scene 1)
   Coins fall off-screen bottom, large red circle grows in.
   Hovering the circle reveals a 17% pie sector and info text.

   Timeline (0 → 1 over 250vh):
     0.00–0.10  Text swap
     0.05–0.30  Coins fall off-screen (stagger, gravity)
     0.28–0.32  Coins group fades out
     0.32–0.55  Big red circle grows from r=0 → 180
     0.45–0.55  Text fades in
     0.55–1.00  Hold — hover active
═══════════════════════════════════════════════════════════════════ */
import { COIN_POSITIONS, POV_R } from '../../../core/constants.js';

export default {
  id: 's-ch6-14m',
  height: '250vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch6-14m',
    html: `<div style="display:grid;width:100%;text-align:center">
             <div id="st-ch6-14m-main" style="grid-area:1/1;opacity:0;width:100%">
               <p class="sl">ÜBER</p>
               <p class="sh">1,4 MILLIONEN</p>
               <p class="sl">MENSCHEN IN ÖSTERREICH<br>SIND ARMUTSGEFÄHRDET</p>
             </div>
             <div id="st-ch6-hover17" style="grid-area:1/1;opacity:0;width:100%">
               <p class="sl">DAS SIND</p>
               <p class="sh">17%</p>
               <p class="sl">DER BEVÖLKERUNG IN ÖSTERREICH</p>
             </div>
           </div>`,
  },

  init({ gsap, ScrollTrigger, stage }) {
    const { coinsGrp, coinEls, povCircle, povPie17 } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-14m',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* scene-coins-grow owns #st-ch5-grow fade-out. */

    /* Coins fall off-screen bottom.
       After scene-coins-grow, each coin's GSAP y = COIN_SCATTER[i][1] - COIN_POSITIONS[i][1].
       Setting y = 700 - cy (absolute) moves coin SVG position to y=700, below viewBox. */
    coinEls.forEach((g, i) => {
      const [, cy] = COIN_POSITIONS[i];
      tl.to(g, { y: 700 - cy, ease: 'power2.in', duration: 0.16 }, 0.05 + i * 0.008);
    });

    tl.to(coinsGrp, { opacity: 0, duration: 0.06 }, 0.30);

    /* Big circle grows in */
    tl.to(povCircle, { opacity: 1, attr: { r: POV_R }, ease: 'power2.out', duration: 0.20 }, 0.32);
    tl.to('#st-ch6-14m-main', { opacity: 1, duration: 0.12 }, 0.47);
    tl.to('#st-ch6-14m-main', { opacity: 0, duration: 0.08, ease: 'power1.in' }, 0.89);

    tl.to({}, { duration: 0.02 }, 0.98);

    /* Hover interaction — 17% pie reveals on mouseenter */
    let hovered = false;

    function enter() {
      if (hovered) return;
      hovered = true;
      gsap.to(povPie17, { opacity: 1, duration: 0.4, ease: 'power1.out' });
      gsap.to('#st-ch6-14m-main', { opacity: 0, duration: 0.25 });
      gsap.to('#st-ch6-hover17',  { opacity: 1, duration: 0.25, delay: 0.15 });
    }

    function leave() {
      if (!hovered) return;
      hovered = false;
      gsap.to(povPie17, { opacity: 0, duration: 0.3, ease: 'power1.in' });
      gsap.to('#st-ch6-hover17',  { opacity: 0, duration: 0.25 });
      gsap.to('#st-ch6-14m-main', { opacity: 1, duration: 0.25, delay: 0.15 });
    }

    povCircle.style.pointerEvents = 'none'; // enabled by ScrollTrigger once circle is fully in
    povCircle.addEventListener('mouseenter', enter);
    povCircle.addEventListener('mouseleave', leave);
    povCircle.style.cursor = 'pointer';

    /* Disable hover when out of range */
    ScrollTrigger.create({
      trigger: '#s-ch6-14m',
      start: '60% top',
      endTrigger: '#s-ch6-500k',
      end: 'top top',
      onLeave()     { leave(); povCircle.style.pointerEvents = 'none'; },
      onLeaveBack() { leave(); povCircle.style.pointerEvents = 'none'; },
      onEnter()     { povCircle.style.pointerEvents = 'all'; },
      onEnterBack() { povCircle.style.pointerEvents = 'all'; },
    });
  },
};
