import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — Steinzeit  (Chapter 7 · Scene 6)
   Right text from scene-geschichte-intro (Stigmatisierung) persists.
   Left side: 3 photos, slide-up entrance + internal image parallax.

   Image assignment → save to /public/images/ :
     steinzeit-1.jpg  ←  Gras  (portrait, green grass)
     steinzeit-2.jpg  ←  Tierfell  (landscape, animal fur)
     steinzeit-3.jpg  ←  Moos  (landscape, moss on rock)
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-steinzeit',
  height: '300vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-steinzeit',
    html: `
      <p class="sl">In der Steinzeit<br>half die Natur selbst:</p>
      <p class="sh">MOOS, GRAS,<br>TIERFELLE</p>
      <p class="sl">wurden benutzt um Blut aufzufangen</p>
    `,
  },

  init({ gsap }) {
    gsap.set('#st-ch7-steinzeit', { left: '0', right: 'auto' });

    if (!document.getElementById('photos-steinzeit')) {
      const p = document.createElement('div');
      p.className = 'scene-photos';
      p.id = 'photos-steinzeit';
      p.innerHTML = `
        <div class="photo-card" style="left:6%;top:7%;width:54%;height:43%;transform:rotate(-2.5deg)">
          <img src="./images/steinzeit-1.jpg" alt="Gras"
               style="position:absolute;width:100%;height:100%;top:0;left:0;object-fit:cover;">
        </div>
        <div class="photo-card" style="left:3%;top:54%;width:40%;height:31%;transform:rotate(1.5deg)">
          <img src="./images/steinzeit-2.jpg" alt="Tierfell"
               style="position:absolute;width:100%;height:100%;top:0;left:0;object-fit:cover;">
        </div>
        <div class="photo-card" style="left:45%;top:62%;width:29%;height:22%;transform:rotate(-1deg)">
          <img src="./images/steinzeit-3.jpg" alt="Moos"
               style="position:absolute;width:100%;height:100%;top:0;left:0;object-fit:cover;">
        </div>
      `;
      document.getElementById('overlays').appendChild(p);
    }

    const cards = Array.from(document.querySelectorAll('#photos-steinzeit .photo-card'));

    gsap.set('#photos-steinzeit', { opacity: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-steinzeit',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      },
    });

    textIn(tl, '#st-ch7-steinzeit', 0.15);

    // Cards slide UP from below and fade in, staggered
    cards.forEach((card, i) => {
      const inAt = 0.03 + i * 0.05;
      tl.fromTo(card,
        { opacity: 0, y: 80 },
        { opacity: 0.65, y: 0, duration: 0.22, ease: 'power2.out' },
        inAt,
      );
    });

    textOut(tl, '#st-ch7-steinzeit', 0.82);
    textOut(tl, '#st-ch7-geschichte-2', 0.82);
    tl.to('#photos-steinzeit', { opacity: 0, duration: 0.12, ease: 'power1.inOut' }, 0.88);
  },
};
