import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — Antike  (Chapter 7 · Scene 7)
   Left + right text about materials and body stigma.
   Left side: 3 photo placeholders with parallax + clip-path reveal.
   Era label transitions from STEINZEIT → ANTIKE
   → Replace placeholder images in /public/images/antike-[1-3].jpg
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-antike',
  height: '450vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-antike-left',
    html: `
      <p class="sl">In der Antike<br>nahm man sich unter anderem</p>
      <p class="sh">STOFFROLLEN,<br>NATURSCHWÄMME</p>
      <p class="sl">zur Hilfe</p>
    `,
  },

  init({ gsap }) {
    const overlaysContainer = document.getElementById('overlays');

    if (!document.getElementById('st-ch7-antike-right')) {
      const ov = document.createElement('div');
      ov.className = 'stext';
      ov.id = 'st-ch7-antike-right';
      ov.innerHTML = `
        <p class="sl">Gleichzeitig gilt der<br>weibliche Körper als</p>
        <p class="sh">FEHLERHAFT.<br>Als zu FEUCHT.</p>
        <p class="sl">Ohne die Blutung/<br>Entwässerung<br>drohe der Wahnsinn.</p>
      `;
      overlaysContainer.appendChild(ov);
    }

    if (!document.getElementById('st-ch7-antike-right-2')) {
      const ov2 = document.createElement('div');
      ov2.className = 'stext';
      ov2.id = 'st-ch7-antike-right-2';
      ov2.innerHTML = `
        <p class="sl">Die Blutung sei<br>kein gesunder Zyklus,<br>sondern die notwendige<br>Reinigung eines</p>
        <p class="sh">BIOLOGISCHEN<br>DEFEKTS.</p>
      `;
      overlaysContainer.appendChild(ov2);
    }

    gsap.set('#st-ch7-antike-left',    { left: '0', right: 'auto' });
    gsap.set('#st-ch7-antike-right',   { left: 'auto', right: '0' });
    gsap.set('#st-ch7-antike-right-2', { left: 'auto', right: '0' });

    // ── Photo panel ──────────────────────────────────────────────────
    if (!document.getElementById('photos-antike')) {
      const p = document.createElement('div');
      p.className = 'scene-photos';
      p.id = 'photos-antike';
      p.style.width = '100%';
      p.innerHTML = `
        <div class="photo-card" style="left:5%;top:10%;width:14%;transform:rotate(2deg)">
          <img src="./images/Antike_1.png" alt="Naturschwamm" style="height:auto;object-fit:initial;">
          <span class="photo-label">NATURSCHWAMM · ANTIKE</span>
        </div>
        <div class="photo-card" style="left:9%;top:55%;width:14%;transform:rotate(-1.5deg)">
          <img src="./images/Antike_2.png" alt="Stoffrolle" style="height:auto;object-fit:initial;">
          <span class="photo-label">STOFFROLLE · ANTIKE</span>
        </div>
        <div class="photo-card" style="right:8%;top:15%;width:22%;transform:rotate(1.5deg)">
          <img src="./images/Antike_3.png" alt="Antike Statue" style="height:auto;object-fit:initial;">
          <span class="photo-label">STATUE · ANTIKE</span>
        </div>
      `;
      overlaysContainer.appendChild(p);
    }

    const cards = Array.from(document.querySelectorAll('#photos-antike .photo-card'));
    gsap.set('#photos-antike', { opacity: 1 });

    // Atmospheric breathing — runs independently of the scroll timeline
    Array.from(document.querySelectorAll('#photos-antike img')).forEach((img, i) => {
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

    // Update era label from STEINZEIT → ANTIKE
    const lblYear = document.getElementById('lbl-year');
    let labelSet = false;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-antike',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onEnter() {
          if (!labelSet && lblYear) {
            labelSet = true;
            gsap.timeline()
              .to(lblYear, { scale: 1.6, duration: 0.25, ease: 'power2.out', transformOrigin: 'right top' })
              .call(() => { lblYear.textContent = 'ANTIKE'; })
              .to(lblYear, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
          }
        },
        onLeaveBack() {
          labelSet = false;
          if (lblYear) {
            gsap.killTweensOf(lblYear);
            gsap.set(lblYear, { scale: 1 });
            lblYear.textContent = 'STEINZEIT';
          }
        },
      },
    });

    textIn(tl, '#st-ch7-antike-left',  0.02);
    textIn(tl, '#st-ch7-antike-right', 0.05);

    // Staggered slide-up entrance — starts immediately so the photo panel
    // hands off seamlessly from scene-steinzeit's fade-out at the scroll boundary.
    cards.forEach((card, i) => {
      const inAt = i * 0.02;
      tl.fromTo(card,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
        inAt,
      );
    });

    // right text swaps mid-scene; left stays visible
    textOut(tl, '#st-ch7-antike-right',   0.42);
    textIn(tl,  '#st-ch7-antike-right-2', 0.52);

    textOut(tl, '#st-ch7-antike-left',    0.93);
    textOut(tl, '#st-ch7-antike-right-2', 0.93);

    tl.to('#photos-antike', { opacity: 0, y: -60, duration: 0.04, ease: 'power2.in' }, 0.96);
  },
};
