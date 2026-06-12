import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — 1973  (Chapter 7 · Scene 10)  — 600vh, 3 right-column phases

   Spine animation  0.00 → 0.15   center 500→333, right slides in 1050→667
   Phase 1 in       0.15 → 0.28   left + center + binde + right-v1 + mwst dash
   Right swap 1→2   0.32 → 0.40   right-v1 out / 0.40→0.48 right-v2 (8%) in
   Right swap 2→3   0.55 → 0.63   right-v2 out / 0.63→0.71 right-v3 (20%) in
                                   + MwST counter 0 → 16
   Fade out         0.86 → 0.95   everything out
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

    /* ── SVG: binde icons + MwSt counter ── */
    const mainSvg = document.getElementById('main-svg');
    if (!document.getElementById('s1973-grp')) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.id = 's1973-grp';
      g.setAttribute('opacity', '0');
      g.innerHTML = `
        <!-- GRAY BINDE — upper center-left -->
        <g id="s1973-binde-gray" transform="translate(215, 118) rotate(45)">
          <ellipse cx="0" cy="-66" rx="22" ry="16" fill="#C9C9C0"/>
          <ellipse cx="0" cy="66"  rx="22" ry="16" fill="#C9C9C0"/>
          <ellipse cx="0" cy="0"   rx="44" ry="78" fill="#C9C9C0"/>
          <ellipse cx="0" cy="0"   rx="34" ry="64" fill="none" stroke="white" stroke-width="5.5"/>
        </g>

        <!-- RED BINDE — lower-left corner -->
        <g id="s1973-binde-red" transform="translate(103, 450) rotate(45)">
          <ellipse cx="0" cy="-55" rx="18" ry="13" fill="#D23537"/>
          <ellipse cx="0" cy="55"  rx="18" ry="13" fill="#D23537"/>
          <ellipse cx="0" cy="0"   rx="37" ry="66" fill="#D23537"/>
          <ellipse cx="0" cy="0"   rx="28" ry="53" fill="none" stroke="white" stroke-width="5"/>
        </g>

        <!-- MwSt counter — center column bottom -->
        <text id="s1973-mwst" x="500" y="496" text-anchor="middle"
              class="svg-serif" font-size="30" fill="#1a1a1a">–% MwST.</text>
      `;
      mainSvg.appendChild(g);
    }

    /* Right spine: clear opacity + dashoffset, park off-screen */
    gsap.set('#c-axis-right', { attr: { x1: 1050, x2: 1050, opacity: 1, 'stroke-dashoffset': 0 } });

    /* Period dots ride the spine to x=333 */
    const periodDotEls = Array.from(document.querySelectorAll('#period-dots circle'));

    const lblYear = document.getElementById('lbl-year');
    let labelSet = false;

    let floatTween = null;
    function startFloat() {
      if (floatTween) floatTween.kill();
      floatTween = gsap.to('#s1973-grp', { y: -5, duration: 2.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }
    function stopFloat() {
      if (floatTween) { floatTween.kill(); floatTween = null; gsap.set('#s1973-grp', { y: 0 }); }
    }

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
          startFloat();
          if (!labelSet && lblYear) {
            labelSet = true;
            gsap.timeline()
              .to(lblYear, { scale: 1.6, duration: 0.25, ease: 'power2.out', transformOrigin: 'right top' })
              .call(() => { lblYear.textContent = '1973'; })
              .to(lblYear, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
          }
        },
        onEnterBack() { startFloat(); },
        onLeave()     { stopFloat(); },
        onLeaveBack() {
          stopFloat();
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

    /* ── Phase 1: all content fades in (0.15 → 0.28) ──────────── */
    textIn(tl, '#st-ch7-1973-left',   0.15);
    textIn(tl, '#st-ch7-1973-center', 0.15);
    textIn(tl, '#st-ch7-1973-right',  0.15);
    tl.to('#s1973-grp', { opacity: 1, duration: 0.13, ease: 'power2.out' }, 0.15);

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

    /* ── Left + center persist; all out at end (0.86 → 0.95) ───── */
    textOut(tl, '#st-ch7-1973-left',    0.86);
    textOut(tl, '#st-ch7-1973-center',  0.86);
    textOut(tl, '#st-ch7-1973-right-3', 0.86);
    tl.to('#s1973-grp', { opacity: 0, duration: 0.09, ease: 'power2.in' }, 0.86);
  },
};
