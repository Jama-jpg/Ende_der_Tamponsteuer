/* ═══════════════════════════════════════════════════════════════════
   SCENE — 1,4 Millionen (Chapter 6, Scene 1)

   The poverty circle is already shown at full size by scene-coins-grow
   the moment the 25 balls finish merging. This scene immediately shows
   the text and activates the hover interaction.

   Hover: mouseenter on the big red circle sweeps in a 17% pie sector
   and swaps the text to "DAS SIND 17%".

   The only scrubbed element is the late exit (text + overlay fade) so
   scene-500k can transition in cleanly.
═══════════════════════════════════════════════════════════════════ */
import { POV_CX, POV_CY, POV_R } from '../../../core/constants.js';
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
    const { povCircle, povPie17 } = stage.refs;
    const infoHint = document.getElementById('info-hint');
    const PIE17_DEG = 61.2; // 17% of 360°

    /* Pie starts as a tiny sliver so it can sweep open on hover */
    povPie17.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_R, 0, 0.01));

    /* ── Show overlay + text immediately on scene entry ──────────── */
    ScrollTrigger.create({
      trigger:     '#s-ch6-14m',
      start:       'top top',
      onEnter() {
        gsap.to('#st-ch6-14m',      { opacity: 1, duration: 0.01 });
        gsap.to('#st-ch6-14m-main', { opacity: 1, duration: 0.4, ease: 'power1.out' });
      },
      onLeaveBack() {
        gsap.to('#st-ch6-hover17',  { opacity: 0, duration: 0.2 });
        gsap.to('#st-ch6-14m-main', { opacity: 0, duration: 0.25 });
        gsap.to('#st-ch6-14m',      { opacity: 0, duration: 0.25, delay: 0.15 });
      },
    });

    /* ── Exit text near the end of the scene (scrub) ─────────────── */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-14m',
        start:   'top top',
        end:     'bottom bottom',
        scrub:   0.4,
      },
    });
    tl.to('#st-ch6-14m-main', { opacity: 0, duration: 0.05, ease: 'power1.in' }, 0.93);
    tl.to('#st-ch6-14m',      { opacity: 0, duration: 0.05, ease: 'power1.in' }, 0.95);
    tl.to({}, { duration: 0.02 }, 0.98);

    /* ── Hover interaction ───────────────────────────────────────── */
    let active  = false;
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
      povCircle.style.cursor        = on ? 'pointer' : 'default';
      povCircle.style.pointerEvents = on ? 'all'     : 'none';
      if (on) {
        gsap.to(infoHint, { opacity: 1, duration: 0.5, ease: 'power1.out' });
        infoHint.classList.add('visible');
      } else {
        leave();
        infoHint.classList.remove('hover-active');
        gsap.to(infoHint, {
          opacity: 0, duration: 0.3, ease: 'power1.in',
          onComplete() { infoHint.classList.remove('visible'); },
        });
      }
    }

    povCircle.style.pointerEvents = 'none';
    povCircle.addEventListener('mouseenter', enter);
    povCircle.addEventListener('mouseleave', leave);

    /* Hover active from the very start of the scene (circle already visible) */
    ScrollTrigger.create({
      trigger:     '#s-ch6-14m',
      start:       'top top',
      endTrigger:  '#s-ch6-500k',
      end:         'top top',
      onEnter()     { setActive(true);  },
      onEnterBack() { setActive(true);  },
      onLeave()     { setActive(false); },
      onLeaveBack() { setActive(false); },
    });
  },
};
