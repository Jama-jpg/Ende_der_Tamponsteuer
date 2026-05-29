/* ═══════════════════════════════════════════════
   SCENE — Blob pulse (s6)
   Hooks the looping circle pulse (active from s4 exit until s7 exit, so the
   circle keeps breathing through the pie scene). The "1,9 Milliarden" text is
   owned by the pie hover logic (see pie-26.js), so it stays on screen here.
═══════════════════════════════════════════════ */

export default {
  id: 's6',
  height: '200vh',

  init({ ScrollTrigger, controllers }) {
    const { pulse } = controllers;

    /* Pulse runs while the big circle is on screen (s4 exit → s7 exit),
       so it keeps breathing through the pie scene. */
    ScrollTrigger.create({
      trigger:    '#s4',
      start:      'bottom bottom',
      endTrigger: '#s7',
      end:        'bottom bottom',
      onEnter:     pulse.start,
      onEnterBack: pulse.start,
      onLeave:     pulse.stop,
      onLeaveBack: pulse.stop,
    });
  },
};
