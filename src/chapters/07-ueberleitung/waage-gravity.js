/* ═══════════════════════════════════════════════════════════════════
   WAAGE GRAVITY HELPER
   Repositions the two pan groups each frame while the beam rotates.
   Pans hang directly from the beam ends (no intermediate arm segments).

   Geometry (all in SVG user-space, viewBox 0 0 1000 562):
     Fulcrum  : (FX=500, FY=198)  — spine dot 2
     Beam left: (BL=200, FY)       Beam right: (BR=800, FY)
     Circle r  : 140 px  (circle centre = beam-end + r along Y)
     Circle origins in markup: (200, 338) and (800, 338)
═══════════════════════════════════════════════════════════════════ */

const FX = 500, FY = 198;
const BL = 200, BR = 800;
const CIRCLE_R = 140;
const SVG_BOTTOM = 562;

/**
 * @param {number} rotDeg  Current beam rotation in degrees (positive = CW).
 * @param {{ circleL, circleR }} elems  DOM element references.
 */
export function applyGravity(rotDeg, { circleL, circleR }) {
  const θ = rotDeg * (Math.PI / 180);
  const c = Math.cos(θ);
  const s = Math.sin(θ);

  /* New positions of the two beam ends after rotation around (FX, FY). */
  const lx = FX + (BL - FX) * c;
  const ly = FY + (BL - FX) * s;
  const rx = FX + (BR - FX) * c;
  const ry = FY + (BR - FX) * s;

  /* Circle centres: directly CIRCLE_R below the (now-moved) beam ends,
     clamped so the circle never exits the bottom of the SVG viewport. */
  const rawLcy = ly + CIRCLE_R;
  const lcy    = Math.min(rawLcy, SVG_BOTTOM - CIRCLE_R);
  const rawRcy = ry + CIRCLE_R;
  const rcy    = Math.min(rawRcy, SVG_BOTTOM - CIRCLE_R);

  /* Translate from markup origins (200, 338) and (800, 338). */
  circleL.setAttribute('transform', `translate(${lx - 200},${lcy - 338})`);
  circleR.setAttribute('transform', `translate(${rx - 800},${rcy - 338})`);
}
