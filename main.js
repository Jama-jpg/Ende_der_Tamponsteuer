/* ═══════════════════════════════════════════════════════════════════
   TAMPONSTEUER SCROLLYTELLING — main.js
   "Österreichs Weg zur 0% Tamponsteuer"
   GSAP 3.12.5 + ScrollTrigger + ScrollToPlugin
═══════════════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ───────────────────────────────────────────────
   CONSTANTS & PALETTE
─────────────────────────────────────────────── */
const PALETTE   = ['#D63335', '#531416', '#F07E7D', '#F4DEDB', '#D0D0C7'];
const CX        = 700;
const CY        = 281;
const R_SMALL   = 90;
const PIE_R     = 220;
const CIRC      = 2 * Math.PI * R_SMALL;   // spinner circumference

/* Scene 9: 12 month-circle Y positions (spread across vertical axis) */
const MC_Y = [70, 108, 147, 185, 223, 261, 300, 338, 376, 415, 454, 492];
const MC_X = 700;
const MC_R = 15;


/* ───────────────────────────────────────────────
   DOM REFERENCES
─────────────────────────────────────────────── */
const vatBigEl  = document.getElementById('vat-big');
const vatBigNum = document.getElementById('vat-big-num');
const vatFixed  = document.getElementById('vat-fixed');
const vatNum    = document.getElementById('vat-num');
const yearLbl   = document.getElementById('lbl-year');

const cAxis     = document.getElementById('c-axis');
const cOutline  = document.getElementById('c-outline');
const cSpinner  = document.getElementById('c-spinner');
const cFill     = document.getElementById('c-fill');
const pieBg     = document.getElementById('pie-bg');
const pieHl     = document.getElementById('pie-hl');
const pieTxt    = document.getElementById('pie-txt');
const mCircles  = document.getElementById('m-circles');
const mRect     = document.getElementById('m-rect');
const rRect     = document.getElementById('r-rect');
const linesGrp  = document.getElementById('lines');
const periodDots= document.getElementById('period-dots');
const lblXxxx   = document.getElementById('lbl-xxxx');
const lblPeriode= document.getElementById('lbl-periode');

const SVG_NS    = 'http://www.w3.org/2000/svg';


/* ───────────────────────────────────────────────
   SVG HELPERS
─────────────────────────────────────────────── */
function makeSvgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function sectorPath(cx, cy, r, startAngle, endAngle) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}


/* ───────────────────────────────────────────────
   GENERATE SVG ELEMENTS AT PAGE LOAD
─────────────────────────────────────────────── */

/* 9 period dots on center axis */
(function buildPeriodDots() {
  const ys = [85, 130, 175, 220, 265, 310, 355, 400, 445];
  ys.forEach((y, i) => {
    const c = makeSvgEl('circle', {
      cx: 500, cy: y, r: 4,
      fill:   i === 0 ? '#A0A097' : 'none',
      stroke: '#D0D0C7',
      'stroke-width': '0.8'
    });
    periodDots.appendChild(c);
  });
})();

/* 12 month circles — all start at cy=CY (center), spread in Scene 9 */
const mcEls = [];
(function buildMonthCircles() {
  for (let i = 0; i < 12; i++) {
    const c = makeSvgEl('circle', {
      cx: MC_X, cy: CY, r: MC_R,
      fill: '#D63335'
    });
    mCircles.appendChild(c);
    mcEls.push(c);
  }
})();

/* Pie chart paths */
pieBg.setAttribute('d', sectorPath(CX, CY, PIE_R, 93.6, 360));
pieHl.setAttribute('d', sectorPath(CX, CY, PIE_R, 0, 93.6));

/* 456 horizontal lines (built once; x1/x2 expanded in Scene 12) */
const lineEls = [];
(function buildLines() {
  const totalLines = 456;
  const yMin = 70, yMax = 492;
  for (let i = 0; i < totalLines; i++) {
    const y = yMin + (yMax - yMin) * (i / (totalLines - 1));
    const color = PALETTE[i % PALETTE.length];
    const ln = makeSvgEl('line', {
      x1: 695, y1: y, x2: 705, y2: y,
      stroke: color,
      'stroke-width': '0.9'
    });
    linesGrp.appendChild(ln);
    lineEls.push(ln);
  }
})();


/* ───────────────────────────────────────────────
   GLITCH COUNTER (RAF-based)
   Runs from Scene 3 start; stops on Scene 13 enter
─────────────────────────────────────────────── */
let glitchRaf  = null;
let glitchLast = 0;
const GLITCH_INTERVAL = 90; // ms

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function glitchTick(ts) {
  if (ts - glitchLast > GLITCH_INTERVAL) {
    vatBigNum.textContent = randomInt(0, 20);
    yearLbl.textContent   = randomInt(1000, 9999);
    glitchLast = ts;
  }
  glitchRaf = requestAnimationFrame(glitchTick);
}

function startGlitch() {
  if (glitchRaf) return;
  glitchRaf = requestAnimationFrame(glitchTick);
}

function stopGlitch() {
  if (glitchRaf) { cancelAnimationFrame(glitchRaf); glitchRaf = null; }
}

function setFinalCounters() {
  stopGlitch();
  vatBigNum.textContent = 0;
  vatNum.textContent    = 0;
  yearLbl.textContent   = 2026;
}





/* ───────────────────────────────────────────────
   PAGE LOAD ENTRANCE (staggered fades)
─────────────────────────────────────────────── */
gsap.set('#lbl-good-news, #lbl-year, #lbl-von, #lbl-zu, #scene-title, #vat-big', {
  opacity: 0
});

gsap.to('#lbl-good-news', { opacity: 1, duration: 1.2, ease: 'power1.out' });
gsap.to('#lbl-year',      { opacity: 1, duration: 1.2, ease: 'power1.out' });
gsap.to('#scene-title',   { opacity: 1, duration: 1.6, delay: 0.1, ease: 'power1.out' });
gsap.to('#vat-big',       { opacity: 1, duration: 2.0, delay: 0.3, ease: 'power1.out' });


/* ═══════════════════════════════════════════════
   PHASE A — Auto-play on page load: 20→0%
   Starts 1s after the page opens. No scrolling needed.
═══════════════════════════════════════════════ */
(function startCountdown() {
  const proxy = { vat: 20, yr: 1973 };
  gsap.to(proxy, {
    vat: 0,
    yr:  2026,
    delay: 1.0,
    duration: 2.4,
    ease: 'power1.inOut',
    onUpdate() {
      const v = Math.round(proxy.vat);
      const y = Math.round(proxy.yr);
      vatBigNum.textContent = v;
      vatNum.textContent    = v;
      yearLbl.textContent   = y;
    },
    onComplete() {
      vatBigNum.textContent = 0;
      vatNum.textContent    = 0;
      yearLbl.textContent   = 2026;
      playS2toS3Transition();
    }
  });
})();

/* ═══════════════════════════════════════════════
   S2 → S3 AUTO-PLAY TRANSITION
   Fires automatically after countdown ends.
   No scrolling needed.
═══════════════════════════════════════════════ */
function playS2toS3Transition() {
  const tlTrans = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

  tlTrans
    /* Title fades out */
    .to('#scene-title', { opacity: 0, y: -16, duration: 0.5, ease: 'power2.in' }, 0)

    /* VAT number shrinks to small label size */
    .to('#vat-big', { scale: 0.056, duration: 0.9, ease: 'power3.inOut' }, 0.1)

    /* GOOD NEWS → DIE PERIODE crossfade */
    .to('#lbl-good-news', { opacity: 0, duration: 0.25, ease: 'power1.in' }, 0.3)
    .call(() => { document.getElementById('lbl-good-news').textContent = 'DIE  PERIODE'; }, [], 0.56)
    .to('#lbl-good-news', { opacity: 1, duration: 0.3, ease: 'power1.out' }, 0.57)

    /* Center axis draws top → bottom */
    .to(cAxis, { opacity: 1, strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 0.3)

    /* First period dot fills red simultaneously with axis */
    .to('#period-dots', { opacity: 1, duration: 0.01 }, 0.32)
    .call(() => {
      const dot0 = periodDots.querySelector('circle:first-child');
      if (dot0) gsap.to(dot0, { attr: { fill: '#D63335' }, duration: 0.4, ease: 'power1.out' });
    }, [], 0.32)

    /* Start glitch counter once transition settles */
    .call(startGlitch, [], 1.4);
}

/* tl2 removed — S2→S3 transition is now auto-play (see playS2toS3Transition above) */


/* Glitch is started by playS2toS3Transition — no scroll trigger needed for initial start */

ScrollTrigger.create({
  trigger: '#s13',
  start:   'top top',
  end:     'bottom bottom',
  onEnter:     setFinalCounters,
  onLeaveBack: startGlitch
});


/* ═══════════════════════════════════════════════
   SCENE 3 — Axis draws, period intro, circle outline
═══════════════════════════════════════════════ */
const tl3 = gsap.timeline({
  scrollTrigger: {
    trigger: '#s3',
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.5
  }
});

tl3
  /* "DIE PERIODE" SVG label & XXXX appear */
  .to([lblPeriode, lblXxxx], { opacity: 1, duration: 0.2 }, 0)

  /* Remaining period dots appear */
  .to('#period-dots', { opacity: 1, duration: 0.25 }, 0.1)

  /* Circle outline appears */
  .to(cOutline, { opacity: 1, duration: 0.3, ease: 'power1.out' }, 0.35)

  /* Scene 3 text overlay fades in */
  .to('#st3', { opacity: 1, duration: 0.25 }, 0.52);


/* ═══════════════════════════════════════════════
   SCENE 4 — Loading Spinner → Circle Fills
═══════════════════════════════════════════════ */
const tl4 = gsap.timeline({
  scrollTrigger: {
    trigger: '#s4',
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.5
  }
});

tl4
  /* Spinner fades in */
  .to(cSpinner, { opacity: 1, duration: 0.08 }, 0)

  /* Spinner draws clockwise (dashoffset CIRC → 0) */
  .to(cSpinner, {
    strokeDashoffset: 0,
    ease: 'power2.inOut',
    duration: 0.68
  }, 0.04)

  /* Circle fills solid red */
  .to(cFill, { opacity: 1, duration: 0.14, ease: 'power1.out' }, 0.72)

  /* Spinner + outline fade out */
  .to([cSpinner, cOutline], { opacity: 0, duration: 0.12 }, 0.74)

  /* Scene 3 text fades out */
  .to('#st3', { opacity: 0, duration: 0.18 }, 0.0);


/* ═══════════════════════════════════════════════
   SCENE 5 — Circle Scales Up Massively
═══════════════════════════════════════════════ */
const tl5 = gsap.timeline({
  scrollTrigger: {
    trigger: '#s5',
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.5
  }
});

tl5
  /* Circle radius expands 90 → 220 */
  .to(cFill, {
    attr: { r: PIE_R },
    ease: 'power2.out',
    duration: 0.7
  }, 0)

  /* Scene 5 text fades in */
  .to('#st5', { opacity: 1, duration: 0.25 }, 0.5);


/* ═══════════════════════════════════════════════
   SCENE 6 — Organic Blob (SVG filter displacement)
═══════════════════════════════════════════════ */
const feDisp  = document.getElementById('fe-disp');
const feTurb  = document.getElementById('fe-turb');

/* Apply the blob filter to the filled circle */
gsap.set(cFill, { attr: { filter: 'url(#blob-filter)' } });

const tl6 = gsap.timeline({
  scrollTrigger: {
    trigger: '#s6',
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.5
  }
});

tl6
  /* Turbulence frequency shifts (more fluid, less rigid) */
  .to(feTurb, {
    attr: { baseFrequency: '0.028' },
    ease: 'sine.inOut',
    duration: 0.5
  }, 0)

  /* Displacement grows → blob forms */
  .to(feDisp, {
    attr: { scale: 30 },
    ease: 'power2.inOut',
    duration: 0.55
  }, 0.0)

  /* Breathing pullback — slight inhale */
  .to(feDisp, {
    attr: { scale: 22 },
    ease: 'sine.inOut',
    duration: 0.35
  }, 0.58)

  /* st5 text fades out */
  .to('#st5', { opacity: 0, duration: 0.18 }, 0.0);


/* ═══════════════════════════════════════════════
   SCENE 7 — Organic → Pie Chart (26% / 74%)
═══════════════════════════════════════════════ */
const tl7 = gsap.timeline({
  scrollTrigger: {
    trigger: '#s7',
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.5
  }
});

tl7
  /* Filter dissolves — circle resolves */
  .to(feDisp, {
    attr: { scale: 0 },
    ease: 'power2.out',
    duration: 0.35
  }, 0)
  .to(feTurb, {
    attr: { baseFrequency: '0.035' },
    ease: 'sine.out',
    duration: 0.35
  }, 0)

  /* Filled circle fades out */
  .to(cFill, { opacity: 0, duration: 0.18 }, 0.22)

  /* Remove filter attribute once invisible */
  .call(() => { gsap.set(cFill, { attr: { filter: 'none' } }); }, [], 0.42)

  /* Pie chart arcs appear */
  .to(pieBg, { opacity: 1, duration: 0.22 }, 0.30)
  .to(pieHl, { opacity: 1, duration: 0.22 }, 0.42)

  /* Pie text fades in */
  .to(pieTxt, { opacity: 1, duration: 0.25 }, 0.58);


/* ═══════════════════════════════════════════════
   SCENE 8 — Pie Collapses → Solid Circle Returns
═══════════════════════════════════════════════ */
const tl8 = gsap.timeline({
  scrollTrigger: {
    trigger: '#s8',
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.5
  }
});

tl8
  /* Pie fades out */
  .to([pieBg, pieHl, pieTxt], { opacity: 0, duration: 0.28 }, 0)

  /* Solid circle returns (still at r=220) */
  .to(cFill, {
    opacity: 1,
    attr: { r: PIE_R },
    duration: 0.25,
    ease: 'power1.out'
  }, 0.25)

  /* "JEDEN MONAT" text */
  .to('#st8', { opacity: 1, duration: 0.25 }, 0.48);


/* ═══════════════════════════════════════════════
   SCENE 9 — Circle → Ellipse → 12 Month Circles
═══════════════════════════════════════════════ */
const tl9 = gsap.timeline({
  scrollTrigger: {
    trigger: '#s9',
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.5
  }
});

tl9
  /* st8 fades out */
  .to('#st8', { opacity: 0, duration: 0.15 }, 0)

  /* Circle scaleY=3 → dramatic vertical ellipse
     transformOrigin must be in SVG user units via svgOrigin */
  .to(cFill, {
    scaleY: 3.2,
    svgOrigin: `${CX} ${CY}`,
    ease: 'power3.in',
    duration: 0.35
  }, 0.04)

  /* Ellipse snaps back and fades as circles appear */
  .to(cFill, {
    opacity: 0,
    scaleY: 1,
    duration: 0.12,
    ease: 'power2.out'
  }, 0.40)

  /* 12 month circles appear */
  .to(mCircles, { opacity: 1, duration: 0.1 }, 0.44)

  /* Circles spread from center to their column positions */
  .to(mcEls, {
    attr: (i) => ({ cy: MC_Y[i] }),
    stagger: { each: 0.022, from: 'center' },
    ease: 'back.out(1.2)',
    duration: 0.45
  }, 0.46);


/* ═══════════════════════════════════════════════
   SCENE 10 — 12 Circles → Thin Vertical Rect
   "FÜR 38 JAHRE"
═══════════════════════════════════════════════ */
const tl10 = gsap.timeline({
  scrollTrigger: {
    trigger: '#s10',
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.5
  }
});

tl10
  /* Month circles shrink to zero */
  .to(mcEls, {
    attr: { r: 0 },
    stagger: { each: 0.018, from: 'start' },
    ease: 'power2.in',
    duration: 0.35
  }, 0.02)

  .to(mCircles, { opacity: 0, duration: 0.08 }, 0.55)

  /* Thin rect reveals */
  .to(mRect, { opacity: 1, duration: 0.18 }, 0.42)

  /* Scene 10 text */
  .to('#st10', { opacity: 1, duration: 0.25 }, 0.62);


/* ═══════════════════════════════════════════════
   SCENE 11 — Rect Widens (38 years span)
═══════════════════════════════════════════════ */
const tl11 = gsap.timeline({
  scrollTrigger: {
    trigger: '#s11',
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.5
  }
});

tl11
  /* Rect expands from thin column to wide rectangle */
  .to(mRect, {
    attr: { x: 625, width: 150 },
    ease: 'power2.inOut',
    duration: 0.7
  }, 0)

  /* Keep r-rect (highlight segment) synced position for later */
  .to(rRect, {
    attr: { x: 625, width: 150 },
    ease: 'power2.inOut',
    duration: 0.7
  }, 0);


/* ═══════════════════════════════════════════════
   SCENE 12 — 456 Lines Burst Left & Right
═══════════════════════════════════════════════ */
const tl12 = gsap.timeline({
  scrollTrigger: {
    trigger: '#s12',
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.5
  }
});

tl12
  /* st10 fades out */
  .to('#st10', { opacity: 0, duration: 0.12 }, 0)

  /* Lines container fades in */
  .to(linesGrp, { opacity: 1, duration: 0.1 }, 0.06)

  /* Lines burst from the rect's X range (625–775) out to edges */
  .to(lineEls, {
    attr: (i) => ({
      x1: 40  + Math.random() * 20,   // left edge with slight variation
      x2: 940 + Math.random() * 30    // right edge with slight variation
    }),
    stagger: { each: 0.0028, from: 'start' },
    ease: 'power2.out',
    duration: 0.55
  }, 0.08)

  /* st12 text */
  .to('#st12', { opacity: 1, duration: 0.2 }, 0.65);


/* ═══════════════════════════════════════════════
   SCENE 13 — Lines Fall, 7-Year Rect, VAT 0% Pulse
═══════════════════════════════════════════════ */
const tl13 = gsap.timeline({
  scrollTrigger: {
    trigger: '#s13',
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.5
  }
});

tl13
  /* st12 fades out */
  .to('#st12', { opacity: 0, duration: 0.12 }, 0)

  /* 456 lines fall with gravity — staggered randomly */
  .to(lineEls, {
    y: 640,
    opacity: 0,
    stagger: { each: 0.0012, from: 'random' },
    ease: 'power2.in',
    duration: 0.48
  }, 0.0)

  /* Wide main rect fades too, leaving only the 7yr highlight */
  .to(mRect, { opacity: 0, duration: 0.22 }, 0.12)

  /* Lines group hides */
  .to(linesGrp, { opacity: 0, duration: 0.08 }, 0.62)

  /* 7-year highlight rect reveals */
  .to(rRect, { opacity: 1, duration: 0.28, ease: 'power1.out' }, 0.52)

  /* st13 text fades in */
  .to('#st13', { opacity: 1, duration: 0.25 }, 0.65)

  /* VAT 0% pulse: scale up → down, color flash */
  .to('#vat-fixed', {
    scale: 1.45,
    color: '#D63335',
    duration: 0.1,
    ease: 'power2.out'
  }, 0.76)
  .to('#vat-fixed', {
    scale: 1,
    color: '#1a1a1a',
    duration: 0.12,
    ease: 'power2.in'
  }, 0.87);


/* ═══════════════════════════════════════════════
   SCROLL END — final state lock
═══════════════════════════════════════════════ */
ScrollTrigger.create({
  trigger: '#s13',
  start:   'top top',
  onEnter: setFinalCounters
});
