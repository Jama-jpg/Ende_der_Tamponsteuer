/* Transitions the page from 2-column to 3-column layout:
   - Existing spine shifts left (x=500 → 333)
   - Right spine slides in (x=667, dash-offset 440 → 0)
   - tl-cards group fades in
   - All existing stext overlays fade out (they're not used in timeline) */

import { SPINE_L_X, SPINE_R_X } from '../../../core/constants.js';

export default {
  id: 's-tl-layout-in',
  height: '100vh',
  skipSnapStart: true,

  init({ gsap, ScrollTrigger, stage }) {
    // Collect all spine x-bearing elements
    const cAxis     = document.getElementById('c-axis');
    const cProgress = document.getElementById('c-axis-progress');
    const spineThick= document.getElementById('spine-thick');
    const spineHit  = document.getElementById('spine-hit');
    const dots      = document.querySelectorAll('#period-dots circle');
    const spineRGrp = document.getElementById('spine-right-grp');
    const axisRight = document.getElementById('c-axis-right');
    const tlCards   = document.getElementById('tl-cards');

    // Hide all stext overlays for the duration of timeline chapter
    const allOverlays = document.querySelectorAll('.stext');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-tl-layout-in',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    // Fade out any lingering overlays
    tl.to(allOverlays, { opacity: 0, duration: 0.15, ease: 'power1.in' }, 0);

    // Shift left spine from x=500 → SPINE_L_X=333
    tl.to(cAxis,      { attr: { x1: SPINE_L_X, x2: SPINE_L_X }, duration: 0.40, ease: 'power2.inOut' }, 0.10);
    tl.to(cProgress,  { attr: { x1: SPINE_L_X, x2: SPINE_L_X }, duration: 0.40, ease: 'power2.inOut' }, 0.10);
    tl.to(spineThick, { attr: { x1: SPINE_L_X, x2: SPINE_L_X }, duration: 0.40, ease: 'power2.inOut' }, 0.10);
    tl.to(spineHit,   { attr: { x: SPINE_L_X - 14 },             duration: 0.40, ease: 'power2.inOut' }, 0.10);
    dots.forEach(dot => {
      tl.to(dot, { attr: { cx: SPINE_L_X }, duration: 0.40, ease: 'power2.inOut' }, 0.10);
    });

    // Bring in right spine group, then draw its dash
    tl.to(spineRGrp, { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.30);
    tl.to(axisRight, { opacity: 1, attr: { 'stroke-dashoffset': 0 }, duration: 0.35, ease: 'power2.inOut' }, 0.40);

    // Reveal the cards layer
    tl.to(tlCards, { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.60);
  },
};
