import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — Die Periode (unified 500vh sequence)
   One sticky section drives 5 visual phases in a single ScrollTrigger.
   The 12 month-circles (left by Chapter 3) morph through:

     Phase 1 (0→20%)   Circles collapse → thin vertical rect
                        Text: "UND DAS / MONAT FÜR MONAT."
     Phase 2 (20→40%)  Rect widens to full 38-year span
                        Text: "FÜR / 38 JAHRE"
     Phase 3 (40→60%)  38 dark year-divider lines radiate across rect
     Phase 4 (60→80%)  Lines multiply & burst to full viewport width (456 months)
                        Text: "INSGESAMT / 456 mal"
     Phase 5 (80→100%) Lines converge back; bottom 31 years fades to light pink;
                        top 7-year block stays solid red
                        Text: "DAS SIND ZUSAMMENGERECHNET / 7 JAHRE /
                               MENSTRUATION. DURCHGEHEND."

   Timeline is deliberately kept inside 0→1 so scroll progress maps
   1:1 to animation progress throughout.
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-periode',
  height: '500vh',

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
    const { mcEls, mCircles, mRect, rRect, linesGrp, lineEls, lines38Grp, line38Els,
            lblKapitel, lblPeriode, lblXxxx } = r;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-periode',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    /* ── Always-on container + corner labels ──────────────────────── */
    tl.set('#st-periode', { opacity: 1 }, 0);
    tl.set([lblKapitel, lblPeriode, lblXxxx], { opacity: 1 }, 0);

    /* ── Text transitions ──────────────────────────────────────────── */
    textOut(tl, '#st8', 0.00);
    textIn(tl, '#st-p1', 0.01);
    textOut(tl, '#st-p1', 0.10);
    textIn(tl, '#st-p2', 0.26);
    textOut(tl, '#st-p2', 0.53);
    textIn(tl, '#st-p3', 0.64);
    textOut(tl, '#st-p3', 0.88);
    textIn(tl, '#st-p4', 0.87);

    /* ── Phase 1 (0→0.20): 12 circles → thin rect ─────────────────
       Fade out the previous scene's "JEDEN MONAT" text, show state-1
       text, then collapse the month circles into the thin mRect.       */
    tl
      .to(mcEls, {
        attr: { r: 0 },
        stagger: { each: 0.006, from: 'start' },
        ease: 'power2.in',
        duration: 0.04,
      }, 0.09)
      .to(mRect, { opacity: 1, duration: 0.04 }, 0.12)
      .to(mCircles, { opacity: 0, duration: 0.04 }, 0.17);

    /* ── Phase 2 (0.20→0.40): thin rect widens + "FÜR 38 JAHRE" ─── */
    tl
      .to([mRect, rRect], {
        attr: { x: 650, width: 150 },
        ease: 'power2.inOut',
        duration: 0.17,
      }, 0.20);

    /* ── Phase 3 (0.40→0.60): 38 year-dividers appear in the rect ── */
    tl
      .to(lines38Grp, { opacity: 1, duration: 0.03 }, 0.42)
      .to(line38Els, {
        attr: { x1: 650, x2: 800 },
        stagger: { each: 0.002, from: 'start' },
        ease: 'power2.out',
        duration: 0.05,
      }, 0.44);

    /* ── Phase 4 (0.60→0.80): 456 lines burst to full width ─────── */
    tl
      .to(lines38Grp, { opacity: 0, duration: 0.04 }, 0.60)
      .to(linesGrp, { opacity: 1, duration: 0.04 }, 0.60)
      .to(lineEls, {
        attr: () => ({
          x1: 40  + Math.random() * 20,
          x2: 940 + Math.random() * 30,
        }),
        stagger: { each: 0.00015, from: 'start' },
        ease: 'power2.out',
        duration: 0.08,
      }, 0.61);

    /* ── Phase 5 (0.80→1.00): lines converge, 7-year block revealed ─
       Lines collapse back toward the rect centre, the group fades out,
       then the light-pink rRect overlay fades in over the bottom 31
       years — leaving the top 7-year strip visually solid red.         */
    tl
      .to(lineEls, {
        attr: { x1: 724, x2: 726 },
        stagger: { each: 0.00008, from: 'random' },
        ease: 'power2.in',
        duration: 0.06,
      }, 0.80)
      .to(linesGrp, { opacity: 0, duration: 0.07 }, 0.87)
      .to(rRect, { opacity: 1, duration: 0.10, ease: 'power1.out' }, 0.85)
      /* Pad to keep total timeline duration at 1.0 */
      .to({}, { duration: 0.02 }, 0.98);
  },
};
