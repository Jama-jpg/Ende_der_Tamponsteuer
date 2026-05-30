/* ═══════════════════════════════════════════════
   SCENE — 26% pie (s7)
   The big red circle is hoverable for the whole time it's at full size —
   from the end of the grow (s5) through the pie scene (s7). Hovering sweeps
   a pink 26% sector in and swaps the left text from "1,9 Milliarden" (#st5)
   to "26% der Weltbevölkerung" (#st7); leaving reverses both. Hover is gated
   on the live circle radius, so it activates exactly when the circle reaches
   its largest and is disabled everywhere else.
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

  init({ gsap, ScrollTrigger, stage, helpers, constants }) {
    const r = stage.refs;
    const { sectorPath } = helpers;
    const { CX, CY, PIE_R } = constants;

    const pieProxy = { angle: 0 };
    let enterTween = null;
    let leaveTween = null;
    let active  = false; // true while the circle is at full size (s5 end → s7)
    let hovered = false;

    function sweepIn() {
      if (leaveTween) { leaveTween.kill(); leaveTween = null; }
      gsap.set(r.pieHl, { opacity: 1 });
      enterTween = gsap.to(pieProxy, {
        angle: 93.6, duration: 0.9, ease: 'power2.inOut',
        onUpdate() { r.pieHl.setAttribute('d', sectorPath(CX, CY, PIE_R, 0, pieProxy.angle)); },
      });
    }

    function sweepOut() {
      if (enterTween) { enterTween.kill(); enterTween = null; }
      leaveTween = gsap.to(pieProxy, {
        angle: 0, duration: 0.6, ease: 'power2.in',
        onUpdate() { r.pieHl.setAttribute('d', sectorPath(CX, CY, PIE_R, 0, pieProxy.angle)); },
        onComplete() { gsap.set(r.pieHl, { opacity: 0 }); },
      });
    }

    function enter() {
      if (!active || hovered) return;
      hovered = true;
      sweepIn();
      gsap.to('#st5', { opacity: 0, duration: 0.3, ease: 'power1.in' });
      gsap.to('#st7', { opacity: 1, duration: 0.3, delay: 0.3, ease: 'power1.out' });
    }

    function leave() {
      if (!hovered) return;
      hovered = false;
      sweepOut();
      gsap.to('#st7', { opacity: 0, duration: 0.3, ease: 'power1.in' });
      gsap.to('#st5', { opacity: 1, duration: 0.3, delay: 0.3, ease: 'power1.out' });
    }

    r.cFill.addEventListener('mouseenter', enter);
    r.cFill.addEventListener('mouseleave', leave);
    r.cFill.style.cursor = 'default'; // pointer only while hover is active

    /* Toggle the whole hover feature on/off, owning the default text (#st5). */
    function setActive(on) {
      if (on === active) return;
      active = on;
      r.cFill.style.cursor = on ? 'pointer' : 'default';
      if (on) {
        gsap.to('#st5', { opacity: 1, duration: 0.3, ease: 'power1.out' });
      } else {
        hovered = false;
        sweepOut(); // retract the pie if it was open
        gsap.to(['#st5', '#st7'], { opacity: 0, duration: 0.3, ease: 'power1.in' });
      }
    }

    /* Hover works only while the circle is at full size: gate on the live
       radius across the s5→s7 range so it switches on the instant the grow
       finishes and off again when leaving the pie scene. */
    ScrollTrigger.create({
      trigger:    '#s5',
      start:      'top top',
      endTrigger: '#s7',
      end:        'bottom bottom',
      onUpdate:    () => setActive(parseFloat(r.cFill.getAttribute('r')) >= PIE_R - 1),
      onLeave:     () => setActive(false),
      onLeaveBack: () => setActive(false),
    });
  },
};
