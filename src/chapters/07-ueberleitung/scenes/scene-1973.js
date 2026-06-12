import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — 1973  (Chapter 7 · Scene 10)
   Animation sequence (scrub-driven):
     0.00 → 0.20  center spine slides 500 → 333
                  right spine slides in from off-screen → 667
     0.20 → 0.35  binde SVGs + text overlays fade in
     0.80 → 0.90  content fades out
   3-column layout:
     Left   (0–333):   gray Binde (top) + red Binde (bottom) + text
     Center (333–667): "DIE TAMPONSSTEUER" / stigma text / "–% MwST."
     Right  (667–1000): Austria introduces Mehrwertsteuer
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-1973',
  height: '300vh',
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

    /* 3-column text positioning */
    gsap.set('#st-ch7-1973-left',   { left: '0',    width: '33%', right: 'auto' });
    gsap.set('#st-ch7-1973-center', { left: '33%',  width: '34%', right: 'auto' });
    gsap.set('#st-ch7-1973-right',  { left: 'auto', width: '33%', right: '0'    });

    /* SVG labels + binde icons */
    const mainSvg = document.getElementById('main-svg');
    if (!document.getElementById('s1973-grp')) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.id = 's1973-grp';
      g.setAttribute('opacity', '0');
      g.innerHTML = `
        <!-- GRAY BINDE — upper center-left (large), matches storyboard upper position -->
        <g id="s1973-binde-gray" transform="translate(215, 118) rotate(45)">
          <ellipse cx="0" cy="-66" rx="22" ry="16" fill="#C9C9C0"/>
          <ellipse cx="0" cy="66"  rx="22" ry="16" fill="#C9C9C0"/>
          <ellipse cx="0" cy="0"   rx="44" ry="78" fill="#C9C9C0"/>
          <ellipse cx="0" cy="0"   rx="34" ry="64" fill="none" stroke="white" stroke-width="5.5"/>
        </g>

        <!-- RED BINDE — lower-left corner (slightly smaller), matches storyboard lower position -->
        <g id="s1973-binde-red" transform="translate(103, 450) rotate(45)">
          <ellipse cx="0" cy="-55" rx="18" ry="13" fill="#D23537"/>
          <ellipse cx="0" cy="55"  rx="18" ry="13" fill="#D23537"/>
          <ellipse cx="0" cy="0"   rx="37" ry="66" fill="#D23537"/>
          <ellipse cx="0" cy="0"   rx="28" ry="53" fill="none" stroke="white" stroke-width="5"/>
        </g>
      `;
      mainSvg.appendChild(g);
    }

    /* Right spine: clear opacity + dashoffset so the line is fully visible when it slides in */
    gsap.set('#c-axis-right', { attr: { x1: 1050, x2: 1050, opacity: 1, 'stroke-dashoffset': 0 } });

    /* Cache period-dot elements — they ride the spine to x=333 */
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

    /* ── Phase 1: spine transition (0 → 0.20) ─────────────────────── */

    /* Center spine slides left: 500 → 333 */
    tl.fromTo(
      ['#c-axis', '#c-axis-progress', '#spine-thick'],
      { attr: { x1: 500, x2: 500 } },
      { attr: { x1: 333, x2: 333 }, duration: 0.20, ease: 'power2.inOut' },
      0,
    );
    /* Move hit rect so click-to-seek follows the spine */
    tl.fromTo(
      '#spine-hit',
      { attr: { x: 486 } },
      { attr: { x: 319 }, duration: 0.20, ease: 'power2.inOut' },
      0,
    );
    /* Period dots ride the spine from 500 → 333 */
    if (periodDotEls.length) {
      tl.fromTo(
        periodDotEls,
        { attr: { cx: 500 } },
        { attr: { cx: 333 }, duration: 0.20, ease: 'power2.inOut' },
        0,
      );
    }

    /* Right spine slides in from off-screen right (1050) → 667 */
    tl.fromTo(
      '#spine-right-grp',
      { opacity: 0 },
      { opacity: 1, duration: 0.01 },
      0,
    );
    tl.fromTo(
      '#c-axis-right',
      { attr: { x1: 1050, x2: 1050 } },
      { attr: { x1: 667,  x2: 667  }, duration: 0.20, ease: 'power2.inOut' },
      0,
    );

    /* ── Phase 2: content fades in (0.20 → 0.35) ──────────────────── */
    textIn(tl, '#st-ch7-1973-left',   0.20);
    textIn(tl, '#st-ch7-1973-center', 0.20);
    textIn(tl, '#st-ch7-1973-right',  0.20);
    tl.to('#s1973-grp', { opacity: 1, duration: 0.15, ease: 'power2.out' }, 0.20);

    /* ── Phase 3: content fades out (0.80 → 0.90) ─────────────────── */
    textOut(tl, '#st-ch7-1973-left',   0.80);
    textOut(tl, '#st-ch7-1973-center', 0.80);
    textOut(tl, '#st-ch7-1973-right',  0.80);
    tl.to('#s1973-grp', { opacity: 0, duration: 0.10, ease: 'power2.in' }, 0.80);
  },
};
