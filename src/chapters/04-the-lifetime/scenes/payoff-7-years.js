/* ═══════════════════════════════════════════════
   SCENE — 7 years payoff (s13)
   The lines fall away, the 7-year highlight rect is revealed, the final
   "7 Jahre" text appears, and the static "0% MwST." label gives one pulse
   of emphasis.
═══════════════════════════════════════════════ */

import { textIn, textOut } from '../../../core/text-anim.js';

export default {
  id: 's13',
  height: '250vh',
  overlay: {
    id: 'st13',
    html: `<p class="sl">DAS SIND<br>ZUSAMMENGERECHNET</p>
           <p class="sh">7 JAHRE</p>
           <p class="sl">MENSTRUATION. DURCHGEHEND.</p>`,
  },

  init({ gsap, ScrollTrigger, stage, shared }) {
    const r = stage.refs;
    /* Same shrink scale the intro computed, so the pulse stays on-size. */
    const base = shared.vatScale ?? 0.056;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s13', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    textOut(tl, '#st12', 0);
    textIn(tl, '#st13', 0.65);

    tl
      .to(r.lineEls, {
        y: 640,
        opacity: 0,
        stagger: { each: 0.0012, from: 'random' },
        ease: 'power2.in',
        duration: 0.48,
      }, 0.0)
      .to(r.mRect,    { opacity: 0, duration: 0.22 }, 0.12)
      .to(r.linesGrp, { opacity: 0, duration: 0.08 }, 0.62)
      .to(r.rRect,    { opacity: 1, duration: 0.28, ease: 'power1.out' }, 0.52)
      .to(r.vatBigEl, { scale: base * 1.45, color: '#D63335', duration: 0.1, ease: 'power2.out' }, 0.76)
      .to(r.vatBigEl, { scale: base, color: '#1a1a1a', duration: 0.12, ease: 'power2.in' }, 0.87);

    /* Fill the first spine dot (Y=42) at the climax of "7 Jahre". */
    ScrollTrigger.create({
      trigger: '#s13',
      start: '85% top',
      onEnter:     () => r.periodDots?.children[0]?.setAttribute('fill', '#A9A99F'),
      onLeaveBack: () => r.periodDots?.children[0]?.setAttribute('fill', 'white'),
    });
  },
};
