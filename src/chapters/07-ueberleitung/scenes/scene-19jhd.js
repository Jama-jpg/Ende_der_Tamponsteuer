import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — 19. Jahrhundert  (Chapter 7 · Scene 9)
   Left + right text about handmade pads and menstruation declared illness.
   Left side: 3 photo placeholders with parallax + clip-path reveal.
   Era label transitions from MITTELALTER → 19. JAHRHUNDERT
   → Replace placeholder images in /public/images/19jhd-[1-3].jpg
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-19jhd',
  height: '300vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-19jhd-left',
    html: `
      <p class="sl">Binden werden in mühsamer<br>Handarbeit aus</p>
      <p class="sh">STOFFRESTE<br>ODER WOLLE</p>
      <p class="sl">genäht und in Familien oft<br>kollektiv geteilt.</p>
    `,
  },

  init({ gsap }) {
    const overlaysContainer = document.getElementById('overlays');

    if (!document.getElementById('st-ch7-19jhd-right')) {
      const ov = document.createElement('div');
      ov.className = 'stext';
      ov.id = 'st-ch7-19jhd-right';
      ov.innerHTML = `
        <p class="sl">Im Jahr&nbsp;&nbsp;1811 wird die<br>Menstruation offiziell zur</p>
        <p class="sh">KRANKHEIT</p>
        <p class="sl">erklärt.<br>Mediziner behaupten:<br>Menstruierende sind<br>während ihrer Tage geistig<br>unzurechnungsfähig.</p>
      `;
      overlaysContainer.appendChild(ov);
    }

    gsap.set('#st-ch7-19jhd-left',  { left: '0', right: 'auto' });
    gsap.set('#st-ch7-19jhd-right', { left: 'auto', right: '0' });

    // ── Photo panel ──────────────────────────────────────────────────
    if (!document.getElementById('photos-19jhd')) {
      const p = document.createElement('div');
      p.className = 'scene-photos';
      p.id = 'photos-19jhd';
      p.innerHTML = `
        <div class="photo-card" style="left:7%;top:8%;width:52%;height:42%;transform:rotate(1.5deg)">
          <img src="" alt="">
          <span class="photo-label">BILD 1 · 19. JHD.</span>
        </div>
        <div class="photo-card" style="left:5%;top:53%;width:38%;height:30%;transform:rotate(-2deg)">
          <img src="" alt="">
          <span class="photo-label">BILD 2 · 19. JHD.</span>
        </div>
        <div class="photo-card" style="left:44%;top:61%;width:28%;height:21%;transform:rotate(1.5deg)">
          <img src="" alt="">
          <span class="photo-label">BILD 3 · 19. JHD.</span>
        </div>
      `;
      overlaysContainer.appendChild(p);
    }

    const cards = Array.from(document.querySelectorAll('#photos-19jhd .photo-card'));
    gsap.set('#photos-19jhd', { opacity: 1 });

    // Atmospheric breathing — runs independently of the scroll timeline
    Array.from(document.querySelectorAll('#photos-19jhd img')).forEach((img, i) => {
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

    // Update era label from MITTELALTER → 19. JAHRHUNDERT
    const lblYear = document.getElementById('lbl-year');
    let labelSet = false;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-19jhd',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onEnter() {
          if (!labelSet && lblYear) {
            labelSet = true;
            gsap.timeline()
              .to(lblYear, { scale: 1.6, duration: 0.25, ease: 'power2.out', transformOrigin: 'right top' })
              .call(() => { lblYear.textContent = '19. JAHRHUNDERT'; })
              .to(lblYear, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
          }
        },
        onLeaveBack() {
          labelSet = false;
          if (lblYear) {
            gsap.killTweensOf(lblYear);
            gsap.set(lblYear, { scale: 1 });
            lblYear.textContent = 'MITTELALTER';
          }
        },
      },
    });

    textIn(tl, '#st-ch7-19jhd-left',  0.02);
    textIn(tl, '#st-ch7-19jhd-right', 0.05);

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

    textOut(tl, '#st-ch7-19jhd-left',  0.93);
    textOut(tl, '#st-ch7-19jhd-right', 0.93);

    tl.to('#photos-19jhd', { opacity: 0, duration: 0.04, ease: 'power2.in' }, 0.96);
  },
};
