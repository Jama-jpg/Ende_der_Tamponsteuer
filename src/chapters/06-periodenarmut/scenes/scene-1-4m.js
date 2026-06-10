/* ═══════════════════════════════════════════════════════════════════
   SCENE — 1,4 Millionen (Chapter 6, Scene 1)

   Beat 1 (entry → ~35%): "ÜBER 1,4 MILLIONEN" text fades in.
   Beat 2 (~35% → ~75%): text swaps to "DAS SIND 17%" while the 17%
     pie sector sweeps in over the big circle.
   Beat 3 (~75% → exit): pie and text fade out so scene-500k can
     transition in cleanly.
═══════════════════════════════════════════════════════════════════ */
import { POV_CX, POV_CY, POV_R } from '../../../core/constants.js';
import { sectorPath } from '../../../core/svg.js';
import { textIn, textOut, Y_IN } from '../../../core/text-anim.js';

export default {
  id: 's-ch6-14m',
  height: '300vh',
  skipSnapStart: true,
  snapPoints: [0.38, 0.72],

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
    const { povPie17 } = stage.refs;
    const PIE17_DEG = 61.2; // 17% of 360°

    gsap.set('#st-ch6-14m-main', { y: Y_IN() });

    /* Reset sector to tiny sliver so the sweep starts from 0 */
    povPie17.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_R, 0, 0.01));

    /* ── Show overlay + text immediately on scene entry ──────────── */
    ScrollTrigger.create({
      trigger:    '#s-ch6-14m',
      start:      'top top',
      onEnter() {
        gsap.to('#st-ch6-14m',      { opacity: 1, duration: 0.01 });
        gsap.to('#st-ch6-14m-main', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
      },
      onLeaveBack() {
        gsap.to('#st-ch6-hover17',  { opacity: 0, duration: 0.2 });
        gsap.to('#st-ch6-14m-main', { opacity: 0, y: Y, duration: 0.25 });
        gsap.to('#st-ch6-14m',      { opacity: 0, duration: 0.25, delay: 0.15 });
        povPie17.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_R, 0, 0.01));
        gsap.set(povPie17, { opacity: 0 });
      },
    });

    /* ── Scrubbed story timeline ──────────────────────────────────── */
    const pieProxy = { angle: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-14m',
        start:   'top top',
        end:     'bottom bottom',
        scrub:   0.4,
      },
    });

    // Beat 1 → Beat 2: "1,4M" fades out, pie sweeps in, "17%" fades in
    textOut(tl, '#st-ch6-14m-main', 0.30, { duration: 0.08 });
    tl.to(povPie17,            { opacity: 1, duration: 0.01                     }, 0.38);
    tl.to(pieProxy, {
      angle: PIE17_DEG,
      duration: 0.20,
      ease: 'power2.out',
      onUpdate() {
        povPie17.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_R, 0, Math.max(0.01, pieProxy.angle)));
      },
    }, 0.38);
    textIn(tl,  '#st-ch6-hover17', 0.42, { duration: 0.08 });

    // Beat 2 → Beat 3: "17%" and pie exit
    textOut(tl, '#st-ch6-hover17', 0.76, { duration: 0.06 });
    tl.to(povPie17,            { opacity: 0, duration: 0.08, ease: 'power1.in'  }, 0.78);

    // Final overlay exit
    tl.to('#st-ch6-14m',       { opacity: 0, duration: 0.05, ease: 'power1.in'  }, 0.95);
    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
