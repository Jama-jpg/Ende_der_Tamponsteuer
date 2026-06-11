/* ═══════════════════════════════════════════════════════════════════
   SPINE SCROLL INDICATOR
   Turns the central axis into the page's scrollbar: a grey fill grows
   down the spine tracking scroll progress. Click or drag anywhere on
   the spine to seek — the grey bar snaps to that position and the page
   scrolls there instantly. The native scrollbar is hidden in base.css.
   Interaction is disabled while the intro locks scrolling.
═══════════════════════════════════════════════════════════════════ */
import { DOT_YS } from './constants.js';

const Y_TOP = 70;
const Y_END = DOT_YS[3];

const FILLED = '#A9A99F';
const EMPTY  = 'white';

const clamp01 = (v) => Math.min(1, Math.max(0, v));

let yFloor = Y_TOP;
export function setSpineFloor(y) { yFloor = y; }

export function createSpine({ ScrollTrigger, refs }) {
  const { cAxisProgress, spineHit, periodDots } = refs;
  if (!cAxisProgress || !spineHit) return;

  const dots = periodDots ? Array.from(periodDots.children) : [];

  /* ── Piecewise spine progress ──────────────────────────────────────
     3 segments map to the 3 gaps between the 4 spine dots.

     Segment 0: #s3 top → steuer-frage 83%           (Kapitel 1: Intro → Überleitung)
     Segment 1: steuer-frage 83% → #s-ch7-geschichte-intro bottom  (Kapitel 2: Timeline)
     Segment 2: #s-ch7-geschichte-intro bottom → end              (Rest)
  */
  const SEG_Y = [DOT_YS[0], DOT_YS[1], DOT_YS[2]];
  const segProgress = [0, 0];

  function renderFromSegs() {
    let y = SEG_Y[0];
    for (let i = 0; i < 2; i++) {
      y = SEG_Y[i] + (SEG_Y[i + 1] - SEG_Y[i]) * clamp01(segProgress[i]);
      if (segProgress[i] < 1) break;
    }
    cAxisProgress.setAttribute('y2', Math.max(y, yFloor));
  }

  ScrollTrigger.create({
    trigger:    '#s3',
    start:      'top top',
    endTrigger: '#s-ch7-steuer-frage',
    end:        '83% top',
    onUpdate:  (self) => { segProgress[0] = self.progress; renderFromSegs(); },
    onRefresh: (self) => { segProgress[0] = self.progress; renderFromSegs(); },
  });

  ScrollTrigger.create({
    trigger:    '#s-ch7-steuer-frage',
    start:      '83% top',
    endTrigger: '#s-ch7-geschichte-intro',
    end:        'bottom bottom',
    onUpdate:  (self) => { segProgress[1] = self.progress; renderFromSegs(); },
    onRefresh: (self) => { segProgress[1] = self.progress; renderFromSegs(); },
  });

  /* ── Dot filling ─────────────────────────────────────────────────────
     Dot 0: filled by countdown.js (intro build-up).
     Dot 1: fills when "KAPITEL 2" ticker fires (steuer-frage 83%).
     Dot 2: fills at the end of Kapitel 2 (#s-ch7-geschichte-intro).  */
  const fill  = (i) => dots[i]?.setAttribute('fill', FILLED);
  const empty = (i) => dots[i]?.setAttribute('fill', EMPTY);

  ScrollTrigger.create({
    trigger:     '#s-ch7-steuer-frage',
    start:       '83% top',
    onEnter:     () => fill(1),
    onLeaveBack: () => empty(1),
  });

  ScrollTrigger.create({
    trigger:     '#s-ch7-geschichte-intro',
    start:       'bottom bottom',
    onEnter:     () => fill(2),
    onLeaveBack: () => empty(2),
  });

}
