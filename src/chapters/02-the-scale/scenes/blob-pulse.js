/* ═══════════════════════════════════════════════
   SCENE — Blob pulse (s6)
   Hooks the looping circle pulse (active from s4 exit until s6 exit) and
   fades out the "1,9 Milliarden" text.
═══════════════════════════════════════════════ */

export default {
  id: 's6',
  height: '200vh',

  init({ gsap, ScrollTrigger, controllers }) {
    const { pulse } = controllers;

    /* Pulse runs while the big circle is on screen (s4 exit → s6 exit). */
    ScrollTrigger.create({
      trigger:    '#s4',
      start:      'bottom bottom',
      endTrigger: '#s6',
      end:        'bottom bottom',
      onEnter:     pulse.start,
      onEnterBack: pulse.start,
      onLeave:     pulse.stop,
      onLeaveBack: pulse.stop,
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#s6', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    });

    tl.to('#st5', { opacity: 0, duration: 0.18 }, 0.0);
  },
};
