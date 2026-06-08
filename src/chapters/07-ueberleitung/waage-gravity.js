/* ═══════════════════════════════════════════════════════════════════
   WAAGE GRAVITY HELPER
   Keeps the two arms always vertical (pendulum physics) while the
   beam rotates.  Call applyGravity(rotDeg, elems) inside every GSAP
   onUpdate that changes the beam's rotation.

   Geometry (all in SVG user-space, viewBox 0 0 1000 562):
     Fulcrum  : (FX=500, FY=198)  — spine dot 2
     Beam left: (BL=200, FY)       Beam right: (BR=800, FY)
     Arm length: ARM_LEN = 82 px
     Circle r  : 140 px  (circle centre = arm-end + r along Y)
     Circle origins in markup: (200, 420) and (800, 420)
═══════════════════════════════════════════════════════════════════ */

const FX = 500, FY = 198;
const BL = 200, BR = 800;
export const ARM_LEN = 82;
const CIRCLE_R = 140;
const SVG_BOTTOM = 562;

/**
 * @param {number} rotDeg  Current beam rotation in degrees (positive = CW).
 * @param {{ armL, armR, circleL, circleR }} elems  DOM element references.
 */
export function applyGravity(rotDeg, { armL, armR, circleL, circleR }) {
  const θ = rotDeg * (Math.PI / 180);
  const c = Math.cos(θ);
  const s = Math.sin(θ);

  /* New positions of the two beam ends after rotation around (FX, FY). */
  const lx = FX + (BL - FX) * c;   // left  beam-end x  (= 500 − 300·cosθ)
  const ly = FY + (BL - FX) * s;   // left  beam-end y  (= 198 − 300·sinθ)
  const rx = FX + (BR - FX) * c;   // right beam-end x  (= 500 + 300·cosθ)
  const ry = FY + (BR - FX) * s;   // right beam-end y  (= 198 + 300·sinθ)

  /* Arms hang straight down from the (now-moved) beam ends. */
  armL.setAttribute('x1', lx);  armL.setAttribute('y1', ly);
  armL.setAttribute('x2', lx);  armL.setAttribute('y2', ly + ARM_LEN);
  armR.setAttribute('x1', rx);  armR.setAttribute('y1', ry);
  armR.setAttribute('x2', rx);  armR.setAttribute('y2', ry + ARM_LEN);

  /* Circle centres: arm-end + CIRCLE_R below, clamped so the circle
     never exits the bottom of the SVG viewport. */
  const rawLcy = ly + ARM_LEN + CIRCLE_R;
  const lcy    = Math.min(rawLcy, SVG_BOTTOM - CIRCLE_R);
  const rawRcy = ry + ARM_LEN + CIRCLE_R;
  const rcy    = Math.min(rawRcy, SVG_BOTTOM - CIRCLE_R);

  /* Translate from markup origins (200, 420) and (800, 420). */
  circleL.setAttribute('transform', `translate(${lx - 200},${lcy - 420})`);
  circleR.setAttribute('transform', `translate(${rx - 800},${rcy - 420})`);
}
