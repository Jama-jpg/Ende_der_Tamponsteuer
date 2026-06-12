import { textIn, textOut, Y_IN, Y_OUT } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — 1973  (Chapter 7 · Scene 10)  — 500vh, 3 right-column phases

   0.00 → 0.15   spine: center 500→333, right slides in 1050→667
   0.15 → 0.28   all content in (left + center + right-v1 + binde + mwst)
   0.32 → 0.42   right-v1 out
   0.42 → 0.55   right-v2 in  (8%)
   0.57 → 0.67   right-v2 out
   0.67 → 0.80   right-v3 in  (20%) + MwSt counter 0→16
   0.86 → 0.95   everything out

   NOTE: All right-column transitions use explicit fromTo so GSAP always
   knows the start AND end state — required for reliable scrub reversal.
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-1973',
  height: '500vh',
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

    /* ── Center (persists all phases) ── */
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

    /* ── Right v1: Austria introduces MwSt ── */
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

    /* ── Right v2: 8% for necessities ── */
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

    /* ── Right v3: Periodenprodukte at 20% ── */
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
    gsap.set('#st-ch7-1973-right',   { left: 'auto', width: '33%', right: '0' });
    gsap.set('#st-ch7-1973-right-2', { left: 'auto', width: '33%', right: '0' });
    gsap.set('#st-ch7-1973-right-3', { left: 'auto', width: '33%', right: '0' });

    /* ── SVG: binde icons + MwSt counter ── */
    const mainSvg = document.getElementById('main-svg');
    if (!document.getElementById('s1973-grp')) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.id = 's1973-grp';
      g.setAttribute('opacity', '0');
      g.innerHTML = `
        <g id="s1973-binde-gray" transform="translate(215, 118) rotate(45)">
          <ellipse cx="0" cy="-66" rx="22" ry="16" fill="#C9C9C0"/>
          <ellipse cx="0" cy="66"  rx="22" ry="16" fill="#C9C9C0"/>
          <ellipse cx="0" cy="0"   rx="44" ry="78" fill="#C9C9C0"/>
          <ellipse cx="0" cy="0"   rx="34" ry="64" fill="none" stroke="white" stroke-width="5.5"/>
        </g>
        <g id="s1973-binde-red" transform="translate(103, 450) rotate(45)">
          <ellipse cx="0" cy="-55" rx="18" ry="13" fill="#D23537"/>
          <ellipse cx="0" cy="55"  rx="18" ry="13" fill="#D23537"/>
          <ellipse cx="0" cy="0"   rx="37" ry="66" fill="#D23537"/>
          <ellipse cx="0" cy="0"   rx="28" ry="53" fill="none" stroke="white" stroke-width="5"/>
        </g>
      `;
      mainSvg.appendChild(g);
    }

    /* Right spine: clear opacity + dashoffset, park off-screen */
    gsap.set('#c-axis-right', { attr: { x1: 1050, x2: 1050, opacity: 1, 'stroke-dashoffset': 0 } });

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

    /* Capture y offsets once at init (same values textIn/textOut use) */
    const yIn  = Y_IN();
    const yOut = Y_OUT();

    const vatNum   = document.getElementById('vat-big-num');
    const vatPct   = document.getElementById('vat-big-pct'); // "%" span hidden after scene-steuer-frage
    const mwstProxy = { val: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-1973',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onEnter() {
          startFloat();
          /* Restore the "%" sign hidden by scene-steuer-frage, show dash as initial value */
          if (vatPct) { vatPct.style.display = 'inline-block'; gsap.set(vatPct, { opacity: 1 }); }
          if (vatNum) vatNum.textContent = '–';
          if (!labelSet && lblYear) {
            labelSet = true;
            gsap.timeline()
              .to(lblYear, { scale: 1.6, duration: 0.25, ease: 'power2.out', transformOrigin: 'right top' })
              .call(() => { lblYear.textContent = '1973'; })
              .to(lblYear, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
          }
        },
        onEnterBack() {
          startFloat();
          if (vatPct) { vatPct.style.display = 'inline-block'; gsap.set(vatPct, { opacity: 1 }); }
          if (vatNum) vatNum.textContent = '–';
        },
        onLeave() { stopFloat(); },
        onLeaveBack() {
          stopFloat();
          /* Restore state from scene-steuer-frage: "—" with hidden "%" */
          if (vatNum) vatNum.textContent = '—';
          if (vatPct) { gsap.set(vatPct, { opacity: 0 }); vatPct.style.display = 'none'; }
          labelSet = false;
          if (lblYear) {
            gsap.killTweensOf(lblYear);
            gsap.set(lblYear, { scale: 1 });
            lblYear.textContent = '19. JAHRHUNDERT';
          }
        },
      },
    });

    /* ── 0: spine transition (0 → 0.15) ───────────────────────────── */
    tl.fromTo(['#c-axis', '#c-axis-progress', '#spine-thick'],
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

    /* ── 1: all content fades in (0.15 → 0.28) ────────────────────── */
    textIn(tl, '#st-ch7-1973-left',   0.15);
    textIn(tl, '#st-ch7-1973-center', 0.15);
    tl.fromTo('#st-ch7-1973-right',
      { opacity: 0, y: yIn },
      { opacity: 1, y: 0, duration: 0.13, ease: 'power2.out' },
      0.15,
    );
    tl.fromTo('#s1973-grp', { opacity: 0 }, { opacity: 1, duration: 0.13, ease: 'power2.out' }, 0.15);

    /* ── right v1 out → v2 in (0.32 / 0.42) ────────────────────────── */
    tl.fromTo('#st-ch7-1973-right',
      { opacity: 1, y: 0 },
      { opacity: 0, y: -yOut, duration: 0.10, ease: 'power2.in' },
      0.32,
    );
    tl.fromTo('#st-ch7-1973-right-2',
      { opacity: 0, y: yIn },
      { opacity: 1, y: 0, duration: 0.13, ease: 'power2.out' },
      0.42,
    );

    /* ── right v2 out → v3 in (0.57 / 0.67) + MwSt counter ─────────── */
    tl.fromTo('#st-ch7-1973-right-2',
      { opacity: 1, y: 0 },
      { opacity: 0, y: -yOut, duration: 0.10, ease: 'power2.in' },
      0.57,
    );
    tl.fromTo('#st-ch7-1973-right-3',
      { opacity: 0, y: yIn },
      { opacity: 1, y: 0, duration: 0.13, ease: 'power2.out' },
      0.67,
    );

    /* Reset to "–" just before counting, then count 0 → 16 via the existing vat-big-num */
    tl.call(() => { if (vatNum) vatNum.textContent = '–'; }, [], 0.66);
    tl.fromTo(mwstProxy,
      { val: 0 },
      {
        val: 16,
        duration: 0.10,
        ease: 'none',
        onUpdate() { if (vatNum) vatNum.textContent = Math.round(mwstProxy.val); },
      },
      0.67,
    );

    /* ── all out (0.86 → 0.95) ──────────────────────────────────────── */
    textOut(tl, '#st-ch7-1973-left',   0.86);
    textOut(tl, '#st-ch7-1973-center', 0.86);
    tl.fromTo('#st-ch7-1973-right-3',
      { opacity: 1, y: 0 },
      { opacity: 0, y: -yOut, duration: 0.09, ease: 'power2.in' },
      0.86,
    );
    tl.fromTo('#s1973-grp', { opacity: 1 }, { opacity: 0, duration: 0.09, ease: 'power2.in' }, 0.86);
  },
};
