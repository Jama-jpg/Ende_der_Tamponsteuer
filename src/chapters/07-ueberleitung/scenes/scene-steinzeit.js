import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — Steinzeit  (Chapter 7 · Scene 6)
   Right text from scene-geschichte-intro (Stigmatisierung) persists.
   Left side: 3 photos, slide-up entrance + continuous upward parallax.

   Images live in /public/images/ :
     steinzeit-moos.png  ←  Moos auf Stein
     steinzeit-gras.png  ←  Gras
     steinzeit-fell.png  ←  Tierfell
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
        <div class="photo-card" style="left:11%;top:10%;width:30%;">
          <img src="./images/steinzeit-moos.png" alt="Moos"
               style="display:block;width:100%;height:auto;object-fit:contain;">
        </div>
        <div class="photo-card" style="left:56%;top:13%;width:25%;">
          <img src="./images/steinzeit-gras.png" alt="Gras"
               style="display:block;width:100%;height:auto;object-fit:contain;">
        </div>
        <div class="photo-card" style="left:18%;top:70%;width:30%;">
          <img src="./images/steinzeit-fell.png" alt="Tierfell"
               style="display:block;width:100%;height:auto;object-fit:contain;">
        </div>
      `;
      document.getElementById('overlays').appendChild(p);
    }

    const cards = Array.from(document.querySelectorAll('#photos-steinzeit .photo-card'));

    gsap.set('#photos-steinzeit', { opacity: 1 });

    // Atmospheric breathing — runs independently of the scroll timeline
    Array.from(document.querySelectorAll('#photos-steinzeit img')).forEach((img, i) => {
      gsap.to(img, {
        scale: 1.06,
        duration: 5 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 1.4,
        transformOrigin: 'center center',
      });
    });

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

    // Cards drift upward as a whole for the entire scroll duration —
    // continuous parallax layered on top of the entrance slide-in.
    tl.to(cards, { yPercent: -20, ease: 'none' }, 0);

    textOut(tl, '#st-ch7-steinzeit', 0.93);
    textOut(tl, '#st-ch7-geschichte-2', 0.93);
    tl.to('#photos-steinzeit', { opacity: 0, y: -60, duration: 0.04, ease: 'power1.inOut' }, 0.96);
  },
};
