/* ═══════════════════════════════════════════════════════════════════
   GRAVITY STACK PHYSICS — Chapter 5
   Simulates items raining into the right half of the SVG (x: 510–990,
   floor y: 548). Uses a seeded RNG so layout is identical on every load,
   which is required for scroll-scrub animations.

   Returns arrays of { cx, cy, bw, bh, dx, dy } where dx/dy are the
   GSAP transform offsets relative to each item's base COIN_POSITION.
═══════════════════════════════════════════════════════════════════ */
import { COIN_POSITIONS, TAMPON_ROTATIONS } from '../../core/constants.js';

const LEFT  = 512;
const RIGHT  = 988;
const FLOOR  = 548;

function seededRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

function stackItem(cx, bw, bh, placed) {
  let surfaceY = FLOOR;
  for (const p of placed) {
    /* detect x-axis overlap with a small tolerance for natural stacking */
    if (Math.abs(cx - p.cx) < (bw + p.bw) / 2 - 4) {
      surfaceY = Math.min(surfaceY, p.cy - p.bh / 2);
    }
  }
  return surfaceY - bh / 2; // cy where item comes to rest
}

/* Place 17 tampon pills in the right half via gravity simulation */
export function computeStack17(seed = 11111) {
  const rng = seededRng(seed);
  const W = 80, H = 40;
  const placed = [];

  return COIN_POSITIONS.slice(0, 17).map(([cx0, cy0], i) => {
    const rad = TAMPON_ROTATIONS[i] * Math.PI / 180;
    const cos = Math.abs(Math.cos(rad)), sin = Math.abs(Math.sin(rad));
    const bw = W * cos + H * sin;
    const bh = W * sin + H * cos;

    /* random cx within right half, respecting item width */
    const margin = bw / 2 + 6;
    const cx = LEFT + margin + rng() * (RIGHT - LEFT - 2 * margin);
    const cy = stackItem(cx, bw, bh, placed);
    placed.push({ cx, cy, bw, bh });
    return { cx, cy, bw, bh, dx: cx - cx0, dy: cy - cy0 };
  });
}

/* Place 8 euro circles on top of the existing 17-item tampon pile */
export function computeStack25(stack17, seed = 22222) {
  const rng = seededRng(seed);
  const R = 22, bw = R * 2, bh = R * 2;
  const placed = stack17.map(({ cx, cy, bw, bh }) => ({ cx, cy, bw, bh }));

  return COIN_POSITIONS.slice(17).map(([cx0, cy0]) => {
    const margin = R + 6;
    const cx = LEFT + margin + rng() * (RIGHT - LEFT - 2 * margin);
    const cy = stackItem(cx, bw, bh, placed);
    placed.push({ cx, cy, bw, bh });
    return { cx, cy, dx: cx - cx0, dy: cy - cy0 };
  });
}
