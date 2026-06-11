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
import { textIn, textOut, setSceneVh } from '../../../core/text-anim.js';

const GOOEY_BLUR = 10;  // matches jeden-monat.js FULL_BLUR
const GROW_R     = 22;  // circles grow to this radius so neighbours merge via gooey

export default {
  id: 's-periode-a',
  height: '300vh',
  skipSnapStart: true,
  skipSnapEnd: true,
  snapPoints: [0.75],

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
    setSceneVh(200);
    const r = stage.refs;
    const { mcEls, mCircles, mRect, rRect, lines38Grp, line38Els, gooeyBlur } = r;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-periode-a',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        /* Re-enable gooey filter on mCircles: jeden-monat.js sets it to 'none'
           at split end, so the merge animation would be invisible without this. */
        onEnter:     () => mCircles.setAttribute('filter', 'url(#gooey)'),
        onEnterBack: () => mCircles.setAttribute('filter', 'url(#gooey)'),
      },
    });

    tl.set('#st-periode', { opacity: 1 }, 0);
    /* Defensive resets — clear carried-over text except #st8 which crossfades. */
    tl.set(['#st5', '#st-p2', '#st-p3', '#st-p4'], { opacity: 0 }, 0);
    /* Size mRect/rRect to match the gooey-merged circles (r=22 → width=44, x=753)
       so the crossfade from circles to rect looks like a true morph, not an insert. */
    tl.set([mRect, rRect], { attr: { x: 753, width: 44 } }, 0);

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

    /* Phase A4: crossfade "Jeden Monat" → "FÜR 38 JAHRE". #st-p2 stays visible
       through the end of this scene — scene-b will crossfade to "456 mal". */
    textOut(tl, '#st8', 0.58);
    textIn(tl, '#st-p2', 0.63);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
