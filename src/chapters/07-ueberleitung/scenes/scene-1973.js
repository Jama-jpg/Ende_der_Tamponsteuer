import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — 1973  (Chapter 7 · Scene 10)  — 600vh, 3 right-column phases

   Spine animation  0.00 → 0.15   center 500→333, right slides in 1050→667
   Phase 1 in       0.15 → 0.28   left + center + photos + right-v1 + mwst dash
   Right swap 1→2   0.32 → 0.40   right-v1 out / 0.40→0.48 right-v2 (8%) in
   Right swap 2→3   0.55 → 0.63   right-v2 out / 0.63→0.71 right-v3 (20%) in
                                   + MwST counter 0 → 16
   Fade out         0.86 → 0.95   everything out

   Left side: 3 photo placeholders with parallax + clip-path reveal.
   MwSt counter preserved as standalone SVG text element.
   → Replace placeholder images in /public/images/1973-[1-3].jpg
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-1973',
  height: '600vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-1973-left',
    html: `
      <p class="sl">Die erste</p>
      <p class="sh">SELBST-<br>KLEBENDE<br>BINDE</p>
      <p class="sl">kommt auf den Markt und macht<br>schwere Hüftgurte überflüssig.</p>
    `,
  },

  init({ gsap }) {
    const overlaysContainer = document.getElementById('overlays');

    /* ── Center text (persists all 3 phases) ── */
    if (!document.getElementById('st-ch7-1973-center')) {
      const ov = document.createElement('div');
      ov.className = 'stext';
      ov.id = 'st-ch7-1973-center';
      ov.innerHTML = `
        <p class="sl">Die Menstruation ist<br>immer noch mit Scham behaftet.</p>
        <p class="sl">In Werbespots fließt nur<br>blaue Flüssigkeit. Das Ideal:</p>
        <p class="sh">BLOß NICHT<br>AUFFALLEN</p>
      `;
      overlaysContainer.appendChild(ov);
    }

    /* ── Right text — Phase 1: Austria introduces MwSt ── */
    if (!document.getElementById('st-ch7-1973-right')) {
      const ov = document.createElement('div');
      ov.className = 'stext';
      ov.id = 'st-ch7-1973-right';
      ov.innerHTML = `
        <p class="sl">Österreich führt die</p>
        <p class="sh">MEHRWERT-<br>STEUER</p>
        <p class="sl">ein.</p>
      `;
      overlaysContainer.appendChild(ov);
    }

    /* ── Right text — Phase 2: 8% for necessities ── */
    if (!document.getElementById('st-ch7-1973-right-2')) {
      const ov = document.createElement('div');
      ov.className = 'stext';
      ov.id = 'st-ch7-1973-right-2';
      ov.innerHTML = `
        <p class="sl">Lebensnotwendiges und<br>Grundbedürfnisse werden<br>mit nur</p>
        <p class="sh">8%</p>
        <p class="sl">besteuert.</p>
      `;
      overlaysContainer.appendChild(ov);
    }

    /* ── Right text — Phase 3: Periodenprodukte at 20% ── */
    if (!document.getElementById('st-ch7-1973-right-3')) {
      const ov = document.createElement('div');
      ov.className = 'stext';
      ov.id = 'st-ch7-1973-right-3';
      ov.innerHTML = `
        <p class="sh">PERIODEN-<br>PRODUKTE</p>
        <p class="sl">werden bei der Gesetzgebung<br>vergessen und nicht beachtet:<br>Daher fallen sie automatisch<br>in den Normalsteuersatz von</p>
        <p class="sh">20%</p>
      `;
      overlaysContainer.appendChild(ov);
    }

    /* ── 3-column positioning ── */
    gsap.set('#st-ch7-1973-left',    { left: '0',    width: '33%', right: 'auto' });
    gsap.set('#st-ch7-1973-center',  { left: '33%',  width: '34%', right: 'auto' });
    gsap.set('#st-ch7-1973-right',   { left: 'auto', width: '33%', right: '0'    });
    gsap.set('#st-ch7-1973-right-2', { left: 'auto', width: '33%', right: '0'    });
    gsap.set('#st-ch7-1973-right-3', { left: 'auto', width: '33%', right: '0'    });

    // ── Photo panel (fits the 33% left column) ──────────────────────
    if (!document.getElementById('photos-1973')) {
      const p = document.createElement('div');
      p.className = 'scene-photos';
      p.id = 'photos-1973';
      p.style.width = '33%';
      p.innerHTML = `
        <div class="photo-card" style="left:6%;top:8%;width:80%;height:40%;transform:rotate(-2deg)">
          <img src="" alt="">
          <span class="photo-label">BILD 1 · 1973</span>
        </div>
        <div class="photo-card" style="left:4%;top:52%;width:58%;height:28%;transform:rotate(1.5deg)">
          <img src="" alt="">
          <span class="photo-label">BILD 2 · 1973</span>
        </div>
        <div class="photo-card" style="left:64%;top:58%;width:30%;height:22%;transform:rotate(-1deg)">
          <img src="" alt="">
          <span class="photo-label">BILD 3 · 1973</span>
        </div>
      `;
      overlaysContainer.appendChild(p);
    }

    const cards = Array.from(document.querySelectorAll('#photos-1973 .photo-card'));
    gsap.set('#photos-1973', { opacity: 1 });

    /* ── MwSt counter — standalone SVG text (no binde shapes) ── */
    const mainSvg = document.getElementById('main-svg');
    if (!document.getElementById('s1973-mwst')) {
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.id = 's1973-mwst';
      t.setAttribute('x', '500');
      t.setAttribute('y', '496');
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('class', 'svg-serif');
      t.setAttribute('font-size', '30');
      t.setAttribute('fill', '#1a1a1a');
      t.setAttribute('opacity', '0');
      t.textContent = '–% MwST.';
      mainSvg.appendChild(t);
    }

    /* Right spine: clear opacity + dashoffset, park off-screen */
    gsap.set('#c-axis-right', { attr: { x1: 1050, x2: 1050, opacity: 1, 'stroke-dashoffset': 0 } });

    /* Period dots ride the spine to x=333 */
    const periodDotEls = Array.from(document.querySelectorAll('#period-dots circle'));

    const lblYear = document.getElementById('lbl-year');
    let labelSet = false;

    /* MwSt counter proxy — animated inside the scrub timeline */
    const mwstProxy = { val: 0 };
    const getMwstEl = () => document.getElementById('s1973-mwst');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-1973',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onEnter() {
          if (!labelSet && lblYear) {
            labelSet = true;
            gsap.timeline()
              .to(lblYear, { scale: 1.6, duration: 0.25, ease: 'power2.out', transformOrigin: 'right top' })
              .call(() => { lblYear.textContent = '1973'; })
              .to(lblYear, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
          }
        },
        onLeaveBack() {
          labelSet = false;
          if (lblYear) {
            gsap.killTweensOf(lblYear);
            gsap.set(lblYear, { scale: 1 });
            lblYear.textContent = '19. JAHRHUNDERT';
          }
        },
      },
    });

    /* ── Phase 0: spine transition (0 → 0.15) ─────────────────── */
    tl.fromTo(
      ['#c-axis', '#c-axis-progress', '#spine-thick'],
      { attr: { x1: 500, x2: 500 } },
      { attr: { x1: 333, x2: 333 }, duration: 0.15, ease: 'power2.inOut' },
      0,
    );
    tl.fromTo('#spine-hit',
      { attr: { x: 486 } },
      { attr: { x: 319 }, duration: 0.15, ease: 'power2.inOut' },
      0,
    );
    if (periodDotEls.length) {
      tl.fromTo(periodDotEls,
        { attr: { cx: 500 } },
        { attr: { cx: 333 }, duration: 0.15, ease: 'power2.inOut' },
        0,
      );
    }
    tl.fromTo('#spine-right-grp', { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0);
    tl.fromTo('#c-axis-right',
      { attr: { x1: 1050, x2: 1050 } },
      { attr: { x1: 667,  x2: 667  }, duration: 0.15, ease: 'power2.inOut' },
      0,
    );

    /* ── Phase 1: text + MwSt counter fade in (0.15 → 0.28) ──── */
    textIn(tl, '#st-ch7-1973-left',   0.15);
    textIn(tl, '#st-ch7-1973-center', 0.15);
    textIn(tl, '#st-ch7-1973-right',  0.15);
    tl.to('#s1973-mwst', { opacity: 1, duration: 0.13, ease: 'power2.out' }, 0.15);

    /* ── Photo cards: staggered slide-up entrance + upward parallax ── */
    const yValues = [[60, -40], [50, -30], [70, -50]];
    cards.forEach((card, i) => {
      const inAt = 0.03 + i * 0.04;
      tl.fromTo(card,
        { opacity: 0, y: yValues[i][0] },
        { opacity: 1, y: 0,            duration: 0.15, ease: 'power2.out' },
        inAt,
      );
      tl.fromTo(card,
        { y: 0 },
        { y: yValues[i][1], duration: 1.0, ease: 'none' },
        inAt + 0.15,
      );
    });

    /* ── Right swap 1→2 (0.32 out, 0.40 in) ────────────────────── */
    textOut(tl, '#st-ch7-1973-right',   0.32);
    textIn(tl,  '#st-ch7-1973-right-2', 0.40);

    /* ── Right swap 2→3 (0.55 out, 0.63 in) + MwSt counter ─────── */
    textOut(tl, '#st-ch7-1973-right-2', 0.55);
    textIn(tl,  '#st-ch7-1973-right-3', 0.63);

    /* Reset counter text just before it starts counting */
    tl.call(() => { const el = getMwstEl(); if (el) el.textContent = '–% MwST.'; }, [], 0.62);

    /* Count 0 → 16 in sync with the scroll */
    tl.fromTo(mwstProxy,
      { val: 0 },
      {
        val: 16,
        duration: 0.09,
        ease: 'none',
        onUpdate() {
          const el = getMwstEl();
          if (el) el.textContent = `${Math.round(mwstProxy.val)}% MwST.`;
        },
      },
      0.63,
    );

    /* ── All out at end (0.86 → 0.95) ──────────────────────────── */
    textOut(tl, '#st-ch7-1973-left',    0.86);
    textOut(tl, '#st-ch7-1973-center',  0.86);
    textOut(tl, '#st-ch7-1973-right-3', 0.86);
    tl.to('#s1973-mwst', { opacity: 0, duration: 0.09, ease: 'power2.in' }, 0.86);
    tl.to('#photos-1973', { opacity: 0, duration: 0.07, ease: 'power2.in' }, 0.93);
  },
};
