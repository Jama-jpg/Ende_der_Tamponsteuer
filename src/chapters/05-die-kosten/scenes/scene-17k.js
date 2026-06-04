/* ═══════════════════════════════════════════════════════════════════
   SCENE — 17.000 Periodenprodukte (Chapter 5, Scene 1)
   Transitions from ch4 end state (rect + rRect visible) to a wireframe
   3D tampon object with "17.000" inside.

   Timeline (0 → 1 over 200vh):
     0.00–0.15  Ch4 rect / pink overlay fade out
     0.15–0.30  Tampon 3D group fades in, text fades in
     0.30–1.00  Hold — mouse tracking rotates tampon
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch5-17k',
  height: '200vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch5-17k',
    html: `<p class="sl">EIN LEBEN VOLLER ZYKLEN ERFORDERT ÜBER</p>
           <p class="sh">17.000</p>
           <p class="sl">PERIODENPRODUKTE (TAMPONS, BINDEN&nbsp;&amp;&nbsp;CO.),<br>UM DURCH DIESE ZEIT ZU KOMMEN.</p>`,
  },

  init({ gsap, ScrollTrigger, stage }) {
    const { mRect, rRect, lines38Grp, tampon3d } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch5-17k',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
      },
    });

    /* Fade out ch4 end state */
    tl.to([mRect, rRect, lines38Grp], { opacity: 0, duration: 0.12, ease: 'power1.in' }, 0);
    tl.to('#st-p4', { opacity: 0, duration: 0.10 }, 0);

    /* Tampon and text appear */
    tl.to(tampon3d,      { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.18);
    tl.to('#st-ch5-17k', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.22);

    tl.to({}, { duration: 0.02 }, 0.98);

    /* Interactive 3D rotation on mouse move while this scene is active */
    let mouseHandler = null;

    function attachMouse() {
      mouseHandler = (e) => {
        const rotY = (e.clientX / window.innerWidth  - 0.5) * 40;
        const rotX = (e.clientY / window.innerHeight - 0.5) * -22;
        gsap.to(tampon3d, {
          rotationY: rotY,
          rotationX: rotX,
          svgOrigin: '790 267',
          duration: 0.55,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };
      document.addEventListener('mousemove', mouseHandler);
    }

    function detachMouse(reset = true) {
      if (mouseHandler) {
        document.removeEventListener('mousemove', mouseHandler);
        mouseHandler = null;
      }
      if (reset) {
        gsap.to(tampon3d, { rotationX: 0, rotationY: 0, duration: 0.4, ease: 'power2.out' });
      }
    }

    ScrollTrigger.create({
      trigger: '#s-ch5-17k',
      start: 'top top',
      endTrigger: '#s-ch5-25k',
      end: 'top top',
      onEnter()     { attachMouse(); },
      onLeave()     { detachMouse(true); },
      onEnterBack() { attachMouse(); },
      onLeaveBack() { detachMouse(false); },
    });
  },
};
