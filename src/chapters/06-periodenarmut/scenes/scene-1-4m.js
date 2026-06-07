/* ═══════════════════════════════════════════════════════════════════
   SCENE — 1,4 Millionen (Chapter 6, Scene 1)
   Coins fall off-screen bottom, large red circle grows in.
   Hovering the circle reveals a 17% pie sector and info text.
   Info-hint (top-right "i HOVER") appears when circle is at full
   size, identical to the pie-26 pattern in Chapter 2.

   Timeline (0 → 1 over 250vh):
     0.00–0.10  Text swap
     0.05–0.30  Coins fall off-screen (stagger, gravity)
     0.28–0.32  Coins group fades out
     0.32–0.55  Big red circle grows from r=0 → 180
     0.45–0.55  Text fades in
     0.55–1.00  Hold — hover active
═══════════════════════════════════════════════════════════════════ */
import { COIN_POSITIONS, POV_CX, POV_CY, POV_R } from '../../../core/constants.js';
import { sectorPath } from '../../../core/svg.js';

export default {
  id: 's-ch6-14m',
  height: '250vh',
  skipSnapStart: true,
  snapPoints: [0.70],

  overlay: {
    id: 'st-ch6-14m',
    html: `<div style="display:grid;width:100%">
             <div id="st-ch6-14m-main" style="grid-area:1/1;opacity:0">
               <p class="sl">ÜBER</p>
               <p class="sh">1,4 MILLIONEN</p>
               <p class="sl">MENSCHEN IN ÖSTERREICH<br>SIND ARMUTSGEFÄHRDET</p>
             </div>
             <div id="st-ch6-hover17" style="grid-area:1/1;opacity:0">
               <p class="sl">DAS SIND</p>
               <p class="sh">17%</p>
               <p class="sl">DER BEVÖLKERUNG IN ÖSTERREICH</p>
             </div>
           </div>`,
  },

  init({ gsap, ScrollTrigger, stage }) {
    const { coinsGrp, coinEls, povCircle, povPie17 } = stage.refs;
    const infoHint = document.getElementById('info-hint');
    const PIE17_DEG = 61.2; // 17% of 360°

    /* Pie starts as a tiny sliver at the top so it can sweep open on hover */
    povPie17.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_R, 0, 0.01));

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

    /* Make the overlay container visible (children control their own opacity) */
    tl.to('#st-ch6-14m', { opacity: 1, duration: 0.01 }, 0);

    /* Big circle grows in */
    tl.to(povCircle, { opacity: 1, attr: { r: POV_R }, ease: 'power2.out', duration: 0.20 }, 0.32);
    tl.to('#st-ch6-14m-main', { opacity: 1, duration: 0.12 }, 0.47);
    /* Fade out very late so the text remains visible during the entire hover zone.
       The hover leave() restores this text — fading it earlier fights the scrub. */
    tl.to('#st-ch6-14m-main', { opacity: 0, duration: 0.05, ease: 'power1.in' }, 0.93);
    tl.to('#st-ch6-14m',      { opacity: 0, duration: 0.05, ease: 'power1.in' }, 0.95);

    tl.to({}, { duration: 0.02 }, 0.98);

    /* Hover interaction — 17% pie sweeps in from the top on mouseenter */
    let active = false;
    let hovered = false;
    const pieProxy = { angle: 0 };

    function enter() {
      if (!active || hovered) return;
      hovered = true;
      infoHint.classList.add('hover-active');
      gsap.set(povPie17, { opacity: 1 });
      gsap.to(pieProxy, {
        angle: PIE17_DEG,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate() {
          povPie17.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_R, 0, Math.max(0.01, pieProxy.angle)));
        },
      });
      gsap.to('#st-ch6-14m-main', { opacity: 0, duration: 0.25 });
      gsap.to('#st-ch6-hover17',  { opacity: 1, duration: 0.25, delay: 0.15 });
    }

    function leave() {
      if (!hovered) return;
      hovered = false;
      infoHint.classList.remove('hover-active');
      gsap.to(pieProxy, {
        angle: 0,
        duration: 0.35,
        ease: 'power1.in',
        onUpdate() {
          povPie17.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_R, 0, Math.max(0.01, pieProxy.angle)));
        },
        onComplete() { gsap.set(povPie17, { opacity: 0 }); },
      });
      gsap.to('#st-ch6-hover17',  { opacity: 0, duration: 0.25 });
      gsap.to('#st-ch6-14m-main', { opacity: 1, duration: 0.25, delay: 0.15 });
    }

    function setActive(on) {
      if (on === active) return;
      active = on;
      povCircle.style.cursor = on ? 'pointer' : 'default';
      povCircle.style.pointerEvents = on ? 'all' : 'none';
      if (on) {
        gsap.to(infoHint, { opacity: 1, duration: 0.5, ease: 'power1.out' });
        infoHint.classList.add('visible');
      } else {
        leave();
        infoHint.classList.remove('hover-active');
        gsap.to(infoHint, { opacity: 0, duration: 0.3, ease: 'power1.in',
          onComplete() { infoHint.classList.remove('visible'); } });
      }
    }

    povCircle.style.pointerEvents = 'none';
    povCircle.addEventListener('mouseenter', enter);
    povCircle.addEventListener('mouseleave', leave);

    /* Enable hover + info-hint once circle is fully grown; disable when out of range */
    ScrollTrigger.create({
      trigger: '#s-ch6-14m',
      start: '60% top',
      endTrigger: '#s-ch6-500k',
      end: 'top top',
      onEnter()     { setActive(true); },
      onEnterBack() { setActive(true); },
      onLeave()     { setActive(false); },
      onLeaveBack() { setActive(false); },
    });
  },
};
