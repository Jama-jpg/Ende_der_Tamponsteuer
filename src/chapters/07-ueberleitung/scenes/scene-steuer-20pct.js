/* ═══════════════════════════════════════════════════════════════════
   SCENE — 20 % MwSt.  (Chapter 7 · Scene 3)
   The "20 %" tampon capsule appears on the right arm, then the entire
   ⊓ bracket rotates clockwise (right drops) via GSAP svgOrigin so
   the capsule tilts diagonally — exactly as in the storyboard.
═══════════════════════════════════════════════════════════════════ */

const DEG = 12; // clockwise → right arm drops, left arm rises

export default {
  id: 's-ch7-steuer-20pct',
  height: '200vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-steuer-20pct',
    html: `
      <p class="sl">waren Periodenprodukte mit dem<br>
      regulären Steuersatz von 20&nbsp;%<br>
      belastet.</p>
    `,
  },

  init({ gsap }) {
    const bracket = document.getElementById('waage-bracket');
    const big20   = document.getElementById('waage-big-20-grp');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-steuer-20pct',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    tl.to('#st-ch7-steuer-20pct', { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.10);
    tl.to('#st-ch7-steuer-20pct', { opacity: 0, duration: 0.15, ease: 'power1.in'  }, 0.82);

    // Tampon capsule fades in before tilt begins
    tl.to(big20, { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.15);

    // Rotate the whole bracket as a rigid body around the spine fulcrum
    // svgOrigin uses SVG user-space coordinates (fulcrum = second spine dot)
    tl.to(bracket, {
      rotation: DEG,
      svgOrigin: '500 220',
      duration: 0.30,
      ease: 'power2.inOut',
    }, 0.38);
  },
};
