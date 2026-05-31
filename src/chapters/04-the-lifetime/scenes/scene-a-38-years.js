/* ═══════════════════════════════════════════════════════════════════
   SCENE A — 12 circles → rect → widens → 38 dividers → "Für 38 Jahre"
   skipSnapStart: one scroll from chapter-3's end lands here at completion.

   Timeline (0 → 1 over 350vh):
     0.00–0.22  Phase A1: circles grow via gooey and merge into the thin rect
     0.22–0.47  Phase A2: rect widens to full 38-year span
     0.48–0.66  Phase A3: 38 year-divider lines radiate across rect
     0.70–0.82  Phase A4: "FÜR 38 JAHRE" text fades in
     0.82–1.00  Hold — user reads the label; scene B scrolls it away
═══════════════════════════════════════════════════════════════════ */
import { MC_R } from '../../../core/constants.js';

const GOOEY_BLUR = 10;  // matches jeden-monat.js FULL_BLUR
const GROW_R     = 22;  // circles grow to this radius so neighbours merge via gooey

export default {
  id: 's-periode-a',
  height: '350vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-periode',
    html: `
      <div style="display:grid; width:100%; text-align:center;">
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
    const { mcEls, mCircles, mRect, rRect, lines38Grp, line38Els, gooeyBlur } = r;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-periode-a',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    tl.set('#st-periode', { opacity: 1 }, 0);
    tl.set(['#st-p2', '#st-p3', '#st-p4'], { opacity: 0 }, 0);

    /* "Jeden Monat" text from s8 fades out as scene A begins. */
    tl.fromTo('#st8', { opacity: 1 }, { opacity: 0, duration: 0.08, ease: 'power1.in' }, 0.04);

    /* Phase A1 (0→0.22): circles grow and merge via gooey filter into a vertical bar,
       then the solid rect cross-dissolves in as the gooey blob fades out. */
    tl
      /* Re-engage gooey filter so growing circles merge organically. */
      .fromTo(gooeyBlur, { attr: { stdDeviation: 0 } }, { attr: { stdDeviation: GOOEY_BLUR }, duration: 0.06 }, 0.02)
      /* Circles grow from their resting radius so they touch neighbours and merge. */
      .fromTo(mcEls, { attr: { r: MC_R } }, {
        attr: { r: GROW_R },
        stagger: { each: 0.005, from: 'center' },
        ease: 'power1.inOut',
        duration: 0.12,
      }, 0.03)
      /* Solid rect fades in under the merged blob. */
      .to(mRect, { opacity: 1, duration: 0.03 }, 0.16)
      /* Gooey blob fades out, leaving the clean rect behind. */
      .to(mCircles, { opacity: 0, duration: 0.04 }, 0.17)
      .to(gooeyBlur, { attr: { stdDeviation: 0 }, duration: 0.02 }, 0.21);

    /* Phase A2 (0.22→0.47): thin rect widens to full 38-year span (center stays at CX=775) */
    tl
      .to([mRect, rRect], {
        attr: { x: 700, width: 150 },
        ease: 'power2.inOut',
        duration: 0.25,
      }, 0.22);

    /* Phase A3 (0.48→0.66): 38 year-divider lines radiate outward inside rect */
    tl
      .to(lines38Grp, { opacity: 1, duration: 0.03 }, 0.48)
      .to(line38Els, {
        attr: { x1: 700, x2: 850 },
        stagger: { each: 0.003, from: 'start' },
        ease: 'power2.out',
        duration: 0.14,
      }, 0.50);

    /* Phase A4 (0.70→0.82): "FÜR 38 JAHRE" text fades in */
    tl
      .to('#st-p2', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.70);

    /* Text stays visible until scene B scrolls it away. */
  },
};
