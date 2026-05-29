/* ═══════════════════════════════════════════════════════════════════
   SVG HELPERS
   Pure geometry / element factories shared by the stage and scenes.
═══════════════════════════════════════════════════════════════════ */
import { SVG_NS } from './constants.js';

/* Create a namespaced SVG element with the given attributes. */
export function makeSvgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

/* Convert a polar coordinate (degrees, 0 = top) to cartesian. */
export function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* Build an SVG path string for a pie sector between two angles. */
export function sectorPath(cx, cy, r, startAngle, endAngle) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}
