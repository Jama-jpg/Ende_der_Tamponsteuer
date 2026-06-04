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
  COIN_POSITIONS, COIN_SCATTER, TAMPON_ROTATIONS, POV_CX, POV_CY, POV_R, POV_SUB_R,
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
    spineThick:    $('spine-thick'),
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
    lblKapitel:$('lbl-kapitel'),
    lblPeriode:$('lbl-periode'),

    /* Chapter 5 */
    tampon3d:      $('tampon-3d'),
    coinsGrp:      $('coins-grp'),
    coinEls:       [],   // filled below
    tamponPillEls: [],   // pill groups for coinEls[0..16], filled below

    /* Chapter 6 */
    povCircle: $('pov-circle'),
    povPie17:  $('pov-pie-17'),
    povSub:    $('pov-sub'),
    povPie90:  $('pov-pie-90'),
    povPie60:  $('pov-pie-60'),
    povPie15:  $('pov-pie-15'),
    povPie12:  $('pov-pie-12'),

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

  /* 25 elements for Chapter 5:
     Indices 0-16 → tampon infographic (pill + string + "1000"), with a hidden circle
                    and hidden "1000€" label that morph in during scene-25k.
     Indices 17-24 → regular euro coins that fall in during scene-25k. */
  /* TAMPON_ROTATIONS imported from constants */

  COIN_POSITIONS.forEach(([cx, cy], i) => {
    const g = makeSvgEl('g', {});

    if (i < 17) {
      /* Hidden circle — revealed during scene-25k morph */
      const circle = makeSvgEl('circle', { cx, cy, r: '0', fill: '#D63335', opacity: '0' });
      /* "1000€" label — appears after morph (first <text> in group for scene-coins-grow) */
      const euroLabel = makeSvgEl('text', {
        x: cx, y: cy,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'font-size': '7',
        fill: 'white',
        'font-family': 'var(--f-mono)',
        'letter-spacing': '0.5',
        opacity: '0',
      });
      euroLabel.textContent = '1000€';

      /* Tampon pill group — rotated at build time, visible during scene-17k */
      const pillG = makeSvgEl('g', {
        transform: `rotate(${TAMPON_ROTATIONS[i]}, ${cx}, ${cy})`,
      });
      const pill = makeSvgEl('rect', {
        x: cx - 40, y: cy - 20,
        width: '80', height: '40', rx: '20',
        fill: '#D63335',
      });
      const str = makeSvgEl('path', {
        d: `M ${cx + 40},${cy + 5} C ${cx + 52},${cy + 16} ${cx + 50},${cy + 30} ${cx + 54},${cy + 40}`,
        stroke: '#8B1A1A', 'stroke-width': '2.2', fill: 'none', 'stroke-linecap': 'round',
      });
      const pillLabel = makeSvgEl('text', {
        x: cx, y: cy,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'font-size': '9',
        fill: 'white',
        'font-family': 'var(--f-mono)',
        'letter-spacing': '0.5',
      });
      pillLabel.textContent = '1000';
      pillG.appendChild(pill);
      pillG.appendChild(str);
      pillG.appendChild(pillLabel);

      g.appendChild(circle);
      g.appendChild(euroLabel);
      g.appendChild(pillG);
      refs.tamponPillEls.push(pillG);
    } else {
      /* Regular euro coin — starts hidden, falls in during scene-25k */
      const circle = makeSvgEl('circle', { cx, cy, r: '22', fill: '#D63335' });
      const label = makeSvgEl('text', {
        x: cx, y: cy,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'font-size': '7',
        fill: 'white',
        'font-family': 'var(--f-mono)',
        'letter-spacing': '0.5',
      });
      label.textContent = '1000€';
      g.appendChild(circle);
      g.appendChild(label);
    }

    refs.coinsGrp.appendChild(g);
    refs.coinEls.push(g);
  });

  /* Pre-calculate scatter positions on each coin element for scene-coins-grow */
  COIN_SCATTER.forEach(([scx, scy], i) => {
    if (refs.coinEls[i]) {
      refs.coinEls[i].dataset.scatterX = scx;
      refs.coinEls[i].dataset.scatterY = scy;
    }
  });

  /* Pie sector paths for Chapter 6 poverty circle */
  const PIE17_DEG = 61.2;   // 17% of 360
  const PIE90_DEG = 324;    // 90% of 360
  const PIE60_DEG = 216;    // 60% of 360
  const PIE15_DEG = 54;     // 15% of 360
  const PIE12_DEG = 43.2;   // 12% of 360

  refs.povPie17.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_R,   0, PIE17_DEG));
  refs.povPie90.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, PIE90_DEG));
  refs.povPie60.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, PIE60_DEG));
  refs.povPie15.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, PIE15_DEG));
  refs.povPie12.setAttribute('d', sectorPath(POV_CX, POV_CY, POV_SUB_R, 0, PIE12_DEG));

  /* Initial hidden state — prevents any flash from scroll-restoration races.
     (Per-scene text overlays are hidden by .stext { opacity:0 } in CSS.) */
  gsap.set([
    refs.cAxis, refs.cOutline, refs.cSpinner, refs.pieBg, refs.pieHl,
    refs.pieTxt, refs.periodDots, refs.mCircles, refs.mRect, refs.rRect,
    refs.linesGrp, refs.lines38Grp, refs.liqFill, refs.liqStream, refs.vatBigTax,
    refs.cAxisProgress,
    refs.tampon3d, refs.coinsGrp,
    refs.povCircle, refs.povPie17, refs.povSub,
    refs.povPie90, refs.povPie60, refs.povPie15, refs.povPie12,
  ], { opacity: 0 });
  gsap.set(refs.cAxis,   { strokeDashoffset: 468 });
  gsap.set(refs.cSpinner,{ strokeDashoffset: 565.5 });

  return refs;
}
