/* Waage (balance scale) scene.
   The spine IS the mast. The beam pivots at (500, 220).
   Right side (Tampons, 20%) drops to show the unfair tax treatment. */

const DEG = -11; // final tilt in degrees (right drops)
const RAD = DEG * (Math.PI / 180);

// Given the beam endpoints at rest (±320 from fulcrum x=500),
// compute the displaced positions after rotation by RAD.
function rotatedPoint(dx, dy = 0) {
  return {
    x: 500 + dx * Math.cos(RAD) - dy * Math.sin(RAD),
    y: 220 + dx * Math.sin(RAD) + dy * Math.cos(RAD),
  };
}

export default {
  id: 's-ch7-waage',
  height: '300vh',
  skipSnapStart: true,

  init({ gsap, ScrollTrigger, stage }) {
    const waage   = document.getElementById('waage-grp');
    const beam    = document.getElementById('waage-beam');
    const fulcrum = document.getElementById('waage-fulcrum');
    const chainL  = document.getElementById('waage-chain-l');
    const chainR  = document.getElementById('waage-chain-r');
    const panL    = document.getElementById('waage-pan-l');
    const panR    = document.getElementById('waage-pan-r');
    const itemsL  = document.getElementById('waage-items-l');
    const itemsR  = document.getElementById('waage-items-r');
    const lblL    = document.getElementById('waage-lbl-l');
    const lblR    = document.getElementById('waage-lbl-r');
    const caption = document.getElementById('waage-caption');
    const caption2= document.getElementById('waage-caption-2');
    const taxLbl  = document.getElementById('waage-tampon-tax');

    // Compute final positions for animated elements after beam tilts DEG degrees
    const lTip = rotatedPoint(-320); // left tip of beam
    const rTip = rotatedPoint( 320); // right tip of beam

    // Chain ends (beam tip → chain bottom = 120px downward along tilt)
    const lChainEnd = { x: lTip.x, y: lTip.y + 120 };
    const rChainEnd = { x: rTip.x, y: rTip.y + 120 };

    // Proxy for beam rotation (GSAP drives the angle, we update all parts in onUpdate)
    const proxy = { angle: 0 };

    function updateGeometry(angleDeg) {
      const r = angleDeg * (Math.PI / 180);
      const cos = Math.cos(r), sin = Math.sin(r);

      const lx = 500 + (-320) * cos;
      const ly = 220 + (-320) * sin;
      const rx = 500 + 320 * cos;
      const ry = 220 + 320 * sin;

      beam.setAttribute('x1', lx); beam.setAttribute('y1', ly);
      beam.setAttribute('x2', rx); beam.setAttribute('y2', ry);

      // Chains hang straight down from beam tips
      chainL.setAttribute('x1', lx); chainL.setAttribute('y1', ly);
      chainL.setAttribute('x2', lx); chainL.setAttribute('y2', ly + 120);

      chainR.setAttribute('x1', rx); chainR.setAttribute('y1', ry);
      chainR.setAttribute('x2', rx); chainR.setAttribute('y2', ry + 120);

      // Pans sit at chain bottoms
      panL.setAttribute('cx', lx); panL.setAttribute('cy', ly + 120);
      panR.setAttribute('cx', rx); panR.setAttribute('cy', ry + 120);

      // Items follow their respective pans via translate
      const lDx = lx - 180, lDy = (ly + 120) - 340;
      const rDx = rx - 820, rDy = (ry + 120) - 340;
      itemsL.setAttribute('transform', `translate(${lDx},${lDy})`);
      itemsR.setAttribute('transform', `translate(${rDx},${rDy})`);

      // Labels follow pans too
      lblL.setAttribute('transform', `translate(${lDx},${lDy})`);
      lblR.setAttribute('transform', `translate(${rDx},${rDy})`);
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-waage',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    tl
      // 0–15%: Waage-Gruppe einblenden, Balken erscheint
      .to(waage,   { opacity: 1, duration: 0.15, ease: 'power1.out'  }, 0)
      // 15–40%: Items auf den Pans erscheinen
      .to(itemsL,  { opacity: 1, duration: 0.15, ease: 'power1.out'  }, 0.15)
      .to(itemsR,  { opacity: 1, duration: 0.15, ease: 'power1.out'  }, 0.22)
      .to(lblL,    { opacity: 1, duration: 0.12, ease: 'power1.out'  }, 0.30)
      .to(lblR,    { opacity: 1, duration: 0.12, ease: 'power1.out'  }, 0.36)
      // 45–70%: Balken kippt — right drops
      .to(proxy,   {
        angle: DEG,
        duration: 0.25,
        ease: 'power2.inOut',
        onUpdate() { updateGeometry(proxy.angle); },
      }, 0.45)
      // 65–85%: Caption-Text einblenden
      .to(caption,  { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.65)
      .to(caption2, { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.72)
      .to(taxLbl,   { opacity: 1, duration: 0.15, ease: 'power1.out' }, 0.80)
      // 90–100%: alles ausblenden
      .to(waage, { opacity: 0, duration: 0.10, ease: 'power1.in' }, 0.90);
  },
};
