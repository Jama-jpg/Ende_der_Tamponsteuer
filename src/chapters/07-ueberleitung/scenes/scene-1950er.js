import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — 1950er  (Chapter 7)
   Left:  tampon/o.b. text carries over from scene-1930er (stays)
   Right: Menotoxin legend debunked 1958 (only right text changes)
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-1950er',
  height: '300vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-1950er-right',
    html: `
      <p class="sl">Erst 1958 wird der Mythos<br>vom giftigen „Menotoxin" widerlegt.</p>
      <p class="sl">Man glaubte an ein Gift in Schweiß und Blut,<br>das Pflanzen verwelken und Nahrung verderben lässt.</p>
    `,
  },

  init({ gsap }) {
    gsap.set('#st-ch7-1950er-right', { left: 'auto', right: '0' });

    const lblYear = document.getElementById('lbl-year');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-1950er',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onEnter() {
          if (lblYear) lblYear.textContent = '1950er';
        },
        onLeaveBack() {
          if (lblYear) lblYear.textContent = '1950er';
        },
      },
    });

    // Left text already visible from scene-1930er — only right text comes in
    textIn(tl, '#st-ch7-1950er-right', 0.05);

    // Both fade out near end
    textOut(tl, '#st-ch7-1930er-tampon', 0.88);
    textOut(tl, '#st-ch7-1950er-right',  0.88);
  },
};
