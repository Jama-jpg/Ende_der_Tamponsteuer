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
      p.innerHTML = `
        <div class="photo-card" style="left:5%;top:9%;width:50%;height:41%;transform:rotate(2deg)">
          <img src="./images/pexels-meruyert-gonullu-7500417.jpg" alt="Naturschwamm">
          <span class="photo-label">NATURSCHWAMM · ANTIKE</span>
        </div>
        <div class="photo-card" style="left:20%;top:52%;width:42%;height:33%;transform:rotate(-1.5deg)">
          <img src="./images/pexels-teona-swift-6850550.jpg" alt="Stoffrolle">
          <span class="photo-label">STOFFROLLE · ANTIKE</span>
        </div>
      `;
      overlaysContainer.appendChild(p);
    }

    const cards = Array.from(document.querySelectorAll('#photos-antike .photo-card'));
    gsap.set('#photos-antike', { opacity: 1 });

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

    textIn(tl, '#st-ch7-antike-left',  0.15);
    textIn(tl, '#st-ch7-antike-right', 0.15);

    // Staggered slide-up entrance
    cards.forEach((card, i) => {
      const inAt = 0.02 + i * 0.05;
      tl.fromTo(card,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' },
        inAt,
      );
    });

    // right text swaps mid-scene; left stays visible
    textOut(tl, '#st-ch7-antike-right',   0.42);
    textIn(tl,  '#st-ch7-antike-right-2', 0.52);

    textOut(tl, '#st-ch7-antike-left',    0.86);
    textOut(tl, '#st-ch7-antike-right-2', 0.86);

    tl.to('#photos-antike', { opacity: 0, duration: 0.07, ease: 'power2.in' }, 0.93);
  },
};
