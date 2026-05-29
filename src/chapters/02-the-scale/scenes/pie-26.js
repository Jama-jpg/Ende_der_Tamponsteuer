/* ═══════════════════════════════════════════════
   SCENE — 26% pie (s7)
   Hover-activated: a pink sector sweeps in over the big circle while the
   "26% der Weltbevölkerung" text fades in. Publishes its leave() handler
   on ctx.shared.pie so the following scene can reset the hover state.
═══════════════════════════════════════════════ */

export default {
  id: 's7',
  height: '250vh',
  overlay: {
    id: 'st7',
    html: `<p class="sl">DAS SIND</p>
           <p class="sh">26%</p>
           <p class="sl">DER WELTBEVÖLKERUNG</p>`,
  },

  init({ gsap, ScrollTrigger, stage, helpers, constants, shared }) {
    const r = stage.refs;
    const { sectorPath } = helpers;
    const { CX, CY, PIE_R } = constants;

    const pieProxy = { angle: 0 };
    let enterTween = null;
    let leaveTween = null;

    function enter() {
      if (leaveTween) { leaveTween.kill(); leaveTween = null; }
      gsap.set(r.pieHl, { opacity: 1 });
      enterTween = gsap.to(pieProxy, {
        angle: 93.6,
        duration: 0.9,
        ease: 'power2.inOut',
        onUpdate() { r.pieHl.setAttribute('d', sectorPath(CX, CY, PIE_R, 0, pieProxy.angle)); },
      });
      gsap.to('#st7', { opacity: 1, duration: 0.4, ease: 'power1.out' });
    }

    function leave() {
      if (enterTween) { enterTween.kill(); enterTween = null; }
      gsap.to('#st7', { opacity: 0, duration: 0.3 });
      leaveTween = gsap.to(pieProxy, {
        angle: 0,
        duration: 0.6,
        ease: 'power2.in',
        onUpdate() { r.pieHl.setAttribute('d', sectorPath(CX, CY, PIE_R, 0, pieProxy.angle)); },
        onComplete() { gsap.set(r.pieHl, { opacity: 0 }); },
      });
    }

    r.cFill.addEventListener('mouseenter', enter);
    r.cFill.addEventListener('mouseleave', leave);

    /* Reset hover state when scrolling away from Scene 7. */
    ScrollTrigger.create({
      trigger: '#s7',
      start:   'bottom bottom',
      onLeave:     leave,
      onLeaveBack: leave,
    });

    /* Expose for the next scene to clean up. */
    shared.pie = { enter, leave };
  },
};
