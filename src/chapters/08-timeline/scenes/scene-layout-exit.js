/* Reverses the 3-column layout back to 2-column after the timeline. */

import { clearCards } from '../timeline-layout.js';

export default {
  id: 's-tl-layout-out',
  height: '100vh',
  skipSnapStart: true,

  init({ gsap, ScrollTrigger }) {
    const cAxis     = document.getElementById('c-axis');
    const cProgress = document.getElementById('c-axis-progress');
    const spineThick= document.getElementById('spine-thick');
    const spineHit  = document.getElementById('spine-hit');
    const dots      = document.querySelectorAll('#period-dots circle');
    const spineRGrp = document.getElementById('spine-right-grp');
    const axisRight = document.getElementById('c-axis-right');
    const tlCards   = document.getElementById('tl-cards');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-tl-layout-out',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onLeave() { clearCards(); },
      },
    });

    // Fade out cards + right spine
    tl.to(tlCards,   { opacity: 0, duration: 0.20, ease: 'power1.in' }, 0);
    tl.to(axisRight, { opacity: 0, attr: { 'stroke-dashoffset': 440 }, duration: 0.30, ease: 'power2.inOut' }, 0.10);
    tl.to(spineRGrp, { opacity: 0, duration: 0.20, ease: 'power1.in' }, 0.30);

    // Shift left spine back to x=500
    tl.to(cAxis,      { attr: { x1: 500, x2: 500 }, duration: 0.40, ease: 'power2.inOut' }, 0.30);
    tl.to(cProgress,  { attr: { x1: 500, x2: 500 }, duration: 0.40, ease: 'power2.inOut' }, 0.30);
    tl.to(spineThick, { attr: { x1: 500, x2: 500 }, duration: 0.40, ease: 'power2.inOut' }, 0.30);
    tl.to(spineHit,   { attr: { x: 486 },            duration: 0.40, ease: 'power2.inOut' }, 0.30);
    dots.forEach(dot => {
      tl.to(dot, { attr: { cx: 500 }, duration: 0.40, ease: 'power2.inOut' }, 0.30);
    });
  },
};
