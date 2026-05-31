/* ═══════════════════════════════════════════════
   SCENE — Circle grows (s5)
   The filled circle expands (r 90 → 198). Scene 3 text is cleared on first
   scroll. The "1,9 Milliarden" text (#st5) is shown/hidden by the pie hover
   logic (see pie-26.js), which switches on the instant the circle is full.
═══════════════════════════════════════════════ */
import { PIE_R } from '../../../core/constants.js';

export default {
  id: 's5',
  height: '200vh',
  skipSnapStart: true,
  overlay: {
    id: 'st5',
    html: `<p class="sl">EIN ABO, DAS WELTWEIT ÜBER</p>
           <p class="sh">1,9 MILLIONEN</p>
           <p class="sl">MENSCHEN TEILEN:</p>
           <p class="sl">Die Menstruation</p>`,
  },

  init({ gsap, ScrollTrigger, stage, controllers }) {
    const { cFill } = stage.refs;
    const { pulse } = controllers;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s5', start: 'top top', end: 'bottom bottom', scrub: 1 },
    });

    tl
      .to('#st3', { opacity: 0, duration: 0.2 }, 0)
      .to({}, { duration: 0.28 }, 0.02) // hold fully filled before growth
      .to(cFill, { attr: { r: PIE_R }, ease: 'power2.out', duration: 0.62 }, 0.30)
      .to('#st5', { opacity: 1, duration: 0.4, ease: 'power1.out' }, 0.40);

    /* Pulse runs while the big circle is on screen (s4 exit → s8 mid). */
    ScrollTrigger.create({
      trigger:    '#s4',
      start:      'bottom bottom',
      endTrigger: '#s8',
      end:        'center bottom',
      onEnter:     pulse.start,
      onEnterBack: pulse.start,
      onLeave:     pulse.stop,
      onLeaveBack: pulse.stop,
    });
  },
};
