import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — Mittelalter  (Chapter 7 · Scene 8)
   Left + right text about free bleeding and religious stigma.
   Left side: 3 photo placeholders with parallax + clip-path reveal.
   Era label transitions from ANTIKE → MITTELALTER
   → Replace placeholder images in /public/images/mittelalter-[1-3].jpg
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-mittelalter',
  height: '300vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-mittelalter-left',
    html: `
      <p class="sl">Im Mittelalter wurde in der Regel<br>keine Unterwäsche getragen.<br>Das bedeutete</p>
      <p class="sh">FREE BLEEDING</p>
      <p class="sl">Einzige Abhilfe waren</p>
      <p class="sh">STOFFFETZEN</p>
      <p class="sl">die das Blut spärlich auffingen</p>
    `,
  },

  init({ gsap }) {
    const overlaysContainer = document.getElementById('overlays');

    if (!document.getElementById('st-ch7-mittelalter-right')) {
      const ov = document.createElement('div');
      ov.className = 'stext';
      ov.id = 'st-ch7-mittelalter-right';
      ov.innerHTML = `
        <p class="sl">Die Biologie wird zur</p>
        <p class="sh">RELIGIÖSE SÜNDE</p>
        <p class="sl">Die Kirche deklariert das Blut als</p>
        <p class="sh">EVAS FLUCH</p>
        <p class="sl">Wer blutet, gilt als</p>
        <p class="sh">UNREIN</p>
      `;
      overlaysContainer.appendChild(ov);
    }

    gsap.set('#st-ch7-mittelalter-left',  { left: '0', right: 'auto' });
    gsap.set('#st-ch7-mittelalter-right', { left: 'auto', right: '0' });

    // ── Photo panel ──────────────────────────────────────────────────
    if (!document.getElementById('photos-mittelalter')) {
      const p = document.createElement('div');
      p.className = 'scene-photos';
      p.id = 'photos-mittelalter';
      p.innerHTML = `
        <div class="photo-card" style="left:8%;top:6%;width:48%;height:44%;transform:rotate(-1.5deg)">
          <img src="" alt="">
          <span class="photo-label">BILD 1 · MITTELALTER</span>
        </div>
        <div class="photo-card" style="left:4%;top:53%;width:36%;height:29%;transform:rotate(2deg)">
          <img src="" alt="">
          <span class="photo-label">BILD 2 · MITTELALTER</span>
        </div>
        <div class="photo-card" style="left:42%;top:60%;width:30%;height:22%;transform:rotate(-1deg)">
          <img src="" alt="">
          <span class="photo-label">BILD 3 · MITTELALTER</span>
        </div>
      `;
      overlaysContainer.appendChild(p);
    }

    const cards = Array.from(document.querySelectorAll('#photos-mittelalter .photo-card'));

    // Update era label from ANTIKE → MITTELALTER
    const lblYear = document.getElementById('lbl-year');
    let labelSet = false;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-mittelalter',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onEnter() {
          if (!labelSet && lblYear) {
            labelSet = true;
            gsap.timeline()
              .to(lblYear, { scale: 1.6, duration: 0.25, ease: 'power2.out', transformOrigin: 'right top' })
              .call(() => { lblYear.textContent = 'MITTELALTER'; })
              .to(lblYear, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
          }
        },
        onLeaveBack() {
          labelSet = false;
          if (lblYear) {
            gsap.killTweensOf(lblYear);
            gsap.set(lblYear, { scale: 1 });
            lblYear.textContent = 'ANTIKE';
          }
        },
      },
    });

    textIn(tl, '#st-ch7-mittelalter-left',  0.15);
    textIn(tl, '#st-ch7-mittelalter-right', 0.15);

    // Staggered clip-path reveal + scale settle
    const yValues = [[-30, 50], [-20, 30], [-50, 70]];
    cards.forEach((card, i) => {
      const inAt = 0.03 + i * 0.04;
      tl.fromTo(card,
        { clipPath: 'inset(100% 0 0 0)', scale: 1.06, opacity: 1 },
        { clipPath: 'inset(0% 0 0 0)',   scale: 1.0,  duration: 0.15, ease: 'power2.out' },
        inAt,
      );
      tl.fromTo(card,
        { y: yValues[i][0] },
        { y: yValues[i][1], duration: 1.0, ease: 'none' },
        0,
      );
    });

    textOut(tl, '#st-ch7-mittelalter-left',  0.86);
    textOut(tl, '#st-ch7-mittelalter-right', 0.86);

    tl.to(cards, { opacity: 0, duration: 0.07, ease: 'power2.in' }, 0.93);
  },
};
