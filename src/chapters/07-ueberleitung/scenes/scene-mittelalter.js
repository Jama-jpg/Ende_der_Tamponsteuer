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
      p.style.width = '100vw';
      p.innerHTML = `
        <div class="photo-card" style="left:18%;top:7%;width:27%;height:auto;transform:rotate(-1.5deg)">
          <img src="./images/19Jhd_2.png" alt="Stofffetzen" style="display:block;width:100%;height:auto;object-fit:fill;">
        </div>
        <div class="photo-card" style="left:3%;top:55%;width:20%;height:auto;transform:rotate(2deg)">
          <img src="./images/19Jhd_1.png" alt="Asche" style="display:block;width:100%;height:auto;object-fit:fill;">
        </div>
        <div class="photo-card" style="left:52%;top:8%;width:27%;height:auto;transform:rotate(-1deg)">
          <img src="./images/Mittelalter_3.png" alt="Mittelalter Statue" style="display:block;width:100%;height:auto;object-fit:fill;">
        </div>
      `;
      overlaysContainer.appendChild(p);
    }

    const cards = Array.from(document.querySelectorAll('#photos-mittelalter .photo-card'));
    gsap.set('#photos-mittelalter', { opacity: 1 });

    // Atmospheric breathing — runs independently of the scroll timeline
    Array.from(document.querySelectorAll('#photos-mittelalter img')).forEach((img, i) => {
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

    textIn(tl, '#st-ch7-mittelalter-left',  0.02);
    textIn(tl, '#st-ch7-mittelalter-right', 0.05);

    // Staggered slide-up entrance + upward parallax throughout scene.
    // Parallax duration fills from entrance end to 1.0 so the timeline
    // stays at 1.0 total and textOut timing remains percentage-accurate.
    const yValues = [[60, -40], [50, -30], [70, -50]];
    cards.forEach((card, i) => {
      const inAt = 0.03 + i * 0.04;
      const entranceEnd = inAt + 0.15;
      tl.fromTo(card,
        { opacity: 0, y: yValues[i][0] },
        { opacity: 1, y: 0,            duration: 0.15, ease: 'power2.out' },
        inAt,
      );
      tl.fromTo(card,
        { y: 0 },
        { y: yValues[i][1], duration: 1.0 - entranceEnd, ease: 'none' },
        entranceEnd,
      );
    });

    textOut(tl, '#st-ch7-mittelalter-left',  0.93);
    textOut(tl, '#st-ch7-mittelalter-right', 0.93);

    tl.to('#photos-mittelalter', { opacity: 0, duration: 0.04, ease: 'power2.in' }, 0.96);
  },
};
