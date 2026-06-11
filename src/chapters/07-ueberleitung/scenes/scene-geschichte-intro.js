import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — Geschichte der Periodenprodukte  (Chapter 7 · Scene 5)
   After the bridging question, two texts + SVG backgrounds appear:
     Left:  tampon silhouette + "Die Geschichte der Periodenprodukte…"
     Right: exclamation mark  + "Gleichzeitig beginnt die Stigmatisierung…"
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-geschichte-intro',
  height: '300vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-geschichte-1',
    html: `
      <p class="sl">Die Geschichte der</p>
      <p class="sh">Periodenprodukte</p>
      <p class="sl">beginnt mit einfachen Hilfsmitteln.</p>
    `,
  },

  init({ gsap }) {
    // Manually inject the second overlay so it can be animated independently
    const overlaysContainer = document.getElementById('overlays');
    if (!document.getElementById('st-ch7-geschichte-2')) {
      const ov = document.createElement('div');
      ov.className = 'stext';
      ov.id = 'st-ch7-geschichte-2';
      ov.innerHTML = `
        <p class="sl">Gleichzeitig beginnt</p>
        <p class="sh">Die Stigmatisierung<br>der Periode</p>
        <p class="sl">mit den ersten Vorurteilen<br>und Mythen.</p>
      `;
      overlaysContainer.appendChild(ov);
    }

    // Text 1 on the LEFT (default), text 2 on the RIGHT
    gsap.set('#st-ch7-geschichte-1', { left: '0', right: 'auto' });
    gsap.set('#st-ch7-geschichte-2', { left: 'auto', right: '0' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-geschichte-intro',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    textIn(tl, '#st-ch7-geschichte-1', 0.15);
    textIn(tl, '#st-ch7-geschichte-2', 0.15);

    textOut(tl, '#st-ch7-geschichte-1', 0.82);
    // #st-ch7-geschichte-2 (right text) persists into scene-steinzeit and fades there
  },
};
