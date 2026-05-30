/* ═══════════════════════════════════════════════════════════════════
   SCENE A — 12 circles → rect → widens → 38 dividers → "Für 38 Jahre"
   skipSnapStart: one scroll from chapter-3's end lands here at completion.

   Timeline (0 → 1 over 350vh):
     0.00–0.22  Phase A1: circles collapse into thin vertical rect
     0.22–0.47  Phase A2: rect widens to full 38-year span
     0.48–0.66  Phase A3: 38 year-divider lines radiate across rect
     0.70–0.82  Phase A4: "FÜR 38 JAHRE" text fades in
     0.82–1.00  Hold — user sees the rect + dividers + label before next scroll
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-periode-a',
  height: '350vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-periode',
    html: `
      <div style="display:grid; width:100%; text-align:center;">
        <div id="st-p1" style="grid-area:1/1; opacity:0; width:100%;">
          <p class="sl">UND DAS</p>
          <p class="sh">MONAT FÜR MONAT.</p>
        </div>
        <div id="st-p2" style="grid-area:1/1; opacity:0; width:100%;">
          <p class="sl">FÜR</p>
          <p class="sh">38 JAHRE</p>
        </div>
        <div id="st-p3" style="grid-area:1/1; opacity:0; width:100%;">
          <p class="sl">INSGESAMT</p>
          <p class="sh">456 mal</p>
        </div>
        <div id="st-p4" style="grid-area:1/1; opacity:0; width:100%;">
          <p class="sl">DAS SIND<br>ZUSAMMENGERECHNET</p>
          <p class="sh">7 JAHRE</p>
          <p class="sl">MENSTRUATION. DURCHGEHEND.</p>
        </div>
      </div>`,
  },

  init({ gsap, stage }) {
    const r = stage.refs;
    const { mcEls, mCircles, mRect, rRect, lines38Grp, line38Els, lblPeriode, lblXxxx } = r;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-periode-a',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
    });

    tl.set('#st-periode', { opacity: 1 }, 0);
    tl.set([lblPeriode, lblXxxx], { opacity: 1 }, 0);

    /* Phase A1 (0→0.22): 12 circles collapse → thin vertical rect */
    tl
      .to('#st8', { opacity: 0, duration: 0.06 }, 0.64)
      .to(mcEls, {
        attr: { r: 0 },
        stagger: { each: 0.008, from: 'start' },
        ease: 'power2.in',
        duration: 0.12,
      }, 0.06)
      .to(mRect, { opacity: 1, duration: 0.04 }, 0.15)
      .to(mCircles, { opacity: 0, duration: 0.04 }, 0.18);

    /* Phase A2 (0.22→0.47): thin rect widens to full 38-year span */
    tl
      .to([mRect, rRect], {
        attr: { x: 650, width: 150 },
        ease: 'power2.inOut',
        duration: 0.25,
      }, 0.22);

    /* Phase A3 (0.48→0.66): 38 year-divider lines radiate outward inside rect */
    tl
      .to(lines38Grp, { opacity: 1, duration: 0.03 }, 0.48)
      .to(line38Els, {
        attr: { x1: 650, x2: 800 },
        stagger: { each: 0.003, from: 'start' },
        ease: 'power2.out',
        duration: 0.14,
      }, 0.50);

    /* Phase A4 (0.70→0.82): "FÜR 38 JAHRE" text fades in */
    tl
      .to('#st-p2', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.70);
  },
};
