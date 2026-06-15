import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — Steinzeit  (Chapter 7 · Scene 6)
   Right text from scene-geschichte-intro (Stigmatisierung) persists.
   Left side: 3 photo placeholders with parallax + clip-path reveal.
   → Replace placeholder images in /public/images/steinzeit-[1-3].jpg
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

    // ── Photo panel ──────────────────────────────────────────────────
    // Place your images in /public/images/ and set src="./images/steinzeit-1.jpg" etc.
    if (!document.getElementById('photos-steinzeit')) {
      const p = document.createElement('div');
      p.className = 'scene-photos';
      p.id = 'photos-steinzeit';
      p.innerHTML = `
        <div class="photo-card" style="left:6%;top:7%;width:54%;height:43%;transform:rotate(-2.5deg)">
          <img src="" alt="">
          <span class="photo-label">BILD 1 · STEINZEIT</span>
        </div>
        <div class="photo-card" style="left:3%;top:54%;width:40%;height:31%;transform:rotate(1.5deg)">
          <img src="" alt="">
          <span class="photo-label">BILD 2 · STEINZEIT</span>
        </div>
        <div class="photo-card" style="left:45%;top:62%;width:29%;height:22%;transform:rotate(-1deg)">
          <img src="" alt="">
          <span class="photo-label">BILD 3 · STEINZEIT</span>
        </div>
      `;
      document.getElementById('overlays').appendChild(p);
    }

    const cards = Array.from(document.querySelectorAll('#photos-steinzeit .photo-card'));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-steinzeit',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    textIn(tl, '#st-ch7-steinzeit', 0.15);

    // Staggered clip-path reveal + scale settle
    const yValues = [[-30, 50], [-20, 30], [-50, 70]];
    cards.forEach((card, i) => {
      const inAt = 0.03 + i * 0.04;
      tl.fromTo(card,
        { clipPath: 'inset(100% 0 0 0)', scale: 1.06, opacity: 1 },
        { clipPath: 'inset(0% 0 0 0)',   scale: 1.0,  duration: 0.15, ease: 'power2.out' },
        inAt,
      );
      // Parallax y — runs full scene length
      tl.fromTo(card,
        { y: yValues[i][0] },
        { y: yValues[i][1], duration: 1.0, ease: 'none' },
        0,
      );
    });

    textOut(tl, '#st-ch7-steinzeit', 0.86);
    textOut(tl, '#st-ch7-geschichte-2', 0.86);

    // Fade all cards out late so they linger into the next scene's start
    tl.to(cards, { opacity: 0, duration: 0.07, ease: 'power2.in' }, 0.93);
  },
};
