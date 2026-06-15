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

export function createSpine({ ScrollTrigger, refs, gsap }) {
  const { cAxisProgress, spineHit, periodDots } = refs;
  if (!cAxisProgress || !spineHit) return;

  const dots = periodDots ? Array.from(periodDots.children) : [];

  /* ── Dot 1 click → jump to Geschichte-Intro ──────────────────────── */
  spineHit.style.cursor = 'pointer';
  spineHit.addEventListener('click', (e) => {
    const svg = spineHit.closest('svg');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgY = pt.matrixTransform(svg.getScreenCTM().inverse()).y;

    let nearestIdx = 0;
    let nearestDist = Infinity;
    DOT_YS.forEach((y, i) => {
      const d = Math.abs(svgY - y);
      if (d < nearestDist) { nearestDist = d; nearestIdx = i; }
    });

    if (nearestIdx === 1 && nearestDist < 40) {
      const target = document.querySelector('#s-ch7-geschichte-intro');
      if (!target || !gsap) return;

      // Cover the page so the brief animation cascade during the scroll jump
      // is invisible to the user
      const cover = document.createElement('div');
      cover.style.cssText =
        'position:fixed;inset:0;background:#F8F8F6;z-index:99999;pointer-events:none;';
      document.body.appendChild(cover);

      // Jump — ScrollTrigger processes this in its next rAF
      window.scrollTo(0, target.offsetTop);

      // After GSAP has rendered the new scroll position, blank everything
      // except the spine. Scrub tweens only re-fire on the NEXT scroll event,
      // so this state persists until the user scrolls again.
      setTimeout(() => {
        document.querySelectorAll('#main-svg > *:not(defs)').forEach(el => {
          if (!['c-axis', 'period-dots', 'c-axis-progress'].includes(el.id)) {
            gsap.set(el, { opacity: 0 });
          }
        });
        document.querySelectorAll('.stext').forEach(el =>
          gsap.set(el, { opacity: 0 })
        );

        // Restore persistent spine elements
        gsap.set(refs.cAxis, { opacity: 1, strokeDashoffset: 0 });
        gsap.set(refs.cAxisProgress, { opacity: 1 });
        gsap.set(refs.periodDots, { opacity: 1 });
        refs.cAxisProgress.setAttribute('y2', DOT_YS[1]);
        dots[0]?.setAttribute('fill', FILLED);
        dots[1]?.setAttribute('fill', FILLED);

        // Fade out and remove the cover
        gsap.to(cover, { opacity: 0, duration: 0.3, onComplete: () => cover.remove() });
      }, 100);
    }
  });

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
