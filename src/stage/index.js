/* ═══════════════════════════════════════════════════════════════════
   STAGE BUILDER
   Injects the persistent markup, generates the procedural SVG elements
   (period dots, month circles, pie arcs, 456 lines), applies the initial
   hidden state, and returns a `refs` object of every long-lived handle
   that scenes animate through `ctx.stage.refs`.
═══════════════════════════════════════════════════════════════════ */
import { stageMarkup } from './markup.js';
import { makeSvgEl, sectorPath } from '../core/svg.js';
import {
  PALETTE, CX, CY, PIE_R, MC_X, MC_R, MC_Y, DOT_YS, LINE_COUNT, LINE_38_COUNT,
} from '../core/constants.js';

/* gsap — used only to apply the initial hidden state. */
export function buildStage(mount, gsap) {
  mount.innerHTML = stageMarkup;

  const $ = (id) => mount.querySelector('#' + id);

  const refs = {
    /* Fixed UI */
    sceneTitle: $('scene-title'),
    lblGoodNews:$('lbl-good-news'),
    vatBigEl:  $('vat-big'),
    vatBigNum: $('vat-big-num'),
    vatBigTax: $('vat-big-tax'),
    yearLbl:   $('lbl-year'),
    scrollHint:$('scroll-hint'),

    /* SVG canvas — shapes */
    cAxis:     $('c-axis'),
    cAxisProgress: $('c-axis-progress'),
    spineHit:      $('spine-hit'),
    cOutline:  $('c-outline'),
    cSpinner:  $('c-spinner'),
    cFill:     $('c-outline'),  // same element — outline fills itself
    pieBg:     $('pie-bg'),
    pieHl:     $('pie-hl'),
    pieTxt:    $('pie-txt'),
    mCircles:  $('m-circles'),
    gooeyBlur: $('gooey-blur'),
    mRect:     $('m-rect'),
    rRect:     $('r-rect'),
    linesGrp:  $('lines'),
    lines38Grp:$('lines-38'),
    periodDots:$('period-dots'),
    lblXxxx:   $('lbl-xxxx'),
    lblPeriode:$('lbl-periode'),

    /* Liquid background */
    liquidBg:       $('liquid-bg'),
    liquidWavePath: $('liquid-wave-path'),
    liqStream:      $('liq-stream'),
    liqFill:        $('liq-fill'),

    /* Procedurally generated collections (filled below) */
    mcEls:    [],
    lineEls:  [],
    line38Els:[],

    /* Layout anchors injected by the engine */
    scroller: $('scroller'),
    overlays: $('overlays'),
  };

  /* 9 period dots on the center axis */
  DOT_YS.forEach((y) => {
    refs.periodDots.appendChild(makeSvgEl('circle', {
      cx: 500, cy: y, r: 5.5, fill: 'white', stroke: '#A9A99F', 'stroke-width': '1',
    }));
  });

  /* 12 month circles — all start at center, spread apart in Scene 9 */
  for (let i = 0; i < MC_Y.length; i++) {
    const c = makeSvgEl('circle', { cx: MC_X, cy: CY, r: MC_R, fill: '#D63335' });
    refs.mCircles.appendChild(c);
    refs.mcEls.push(c);
  }

  /* Pie chart arcs (74% red background, 26% pink highlight) */
  refs.pieBg.setAttribute('d', sectorPath(CX, CY, PIE_R, 93.6, 360));
  refs.pieHl.setAttribute('d', sectorPath(CX, CY, PIE_R, 0, 93.6));

  /* 456 horizontal lines (x1/x2 expanded during Die Periode Phase 4) */
  /* Start collapsed at rect centre (x=775, matching CX) so they burst outward on reveal. */
  const yMin = 70, yMax = 492;
  for (let i = 0; i < LINE_COUNT; i++) {
    const y = yMin + (yMax - yMin) * (i / (LINE_COUNT - 1));
    const ln = makeSvgEl('line', {
      x1: 770, y1: y, x2: 780, y2: y,
      stroke: PALETTE[i % PALETTE.length], 'stroke-width': '0.9',
    });
    refs.linesGrp.appendChild(ln);
    refs.lineEls.push(ln);
  }

  /* 38 year-divider lines — span the rect width (x=700…850) during Die Periode Phase 3.
     Start collapsed at the rect centre (x=775, matching CX) so they radiate outward on reveal. */
  for (let i = 0; i < LINE_38_COUNT; i++) {
    const y = yMin + (yMax - yMin) * (i / (LINE_38_COUNT - 1));
    const ln = makeSvgEl('line', {
      x1: 775, y1: y, x2: 775, y2: y,
      stroke: '#531416', 'stroke-width': '1.5',
    });
    refs.lines38Grp.appendChild(ln);
    refs.line38Els.push(ln);
  }

  /* Initial hidden state — prevents any flash from scroll-restoration races.
     (Per-scene text overlays are hidden by .stext { opacity:0 } in CSS.) */
  gsap.set([
    refs.cAxis, refs.cOutline, refs.cSpinner, refs.pieBg, refs.pieHl,
    refs.pieTxt, refs.periodDots, refs.mCircles, refs.mRect, refs.rRect,
    refs.linesGrp, refs.lines38Grp, refs.liqFill, refs.liqStream, refs.vatBigTax,
    refs.cAxisProgress,
  ], { opacity: 0 });
  gsap.set(refs.cAxis,   { strokeDashoffset: 468 });
  gsap.set(refs.cSpinner,{ strokeDashoffset: 565.5 });

  return refs;
}
