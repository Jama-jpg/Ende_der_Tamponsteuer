/* ═══════════════════════════════════════════════════════════════════
   SHARED CONSTANTS & PALETTE
   Geometry of the persistent SVG stage. Scenes import what they need.
═══════════════════════════════════════════════════════════════════ */

export const PALETTE = ['#D63335', '#531416', '#F07E7D', '#F4DEDB', '#D0D0C7'];

/* Central circle (morphs across the Scale / Month chapters) */
export const CX      = 775;
export const CY      = 281;
export const R_SMALL = 90;
export const PIE_R   = 198;
export const CIRC    = 2 * Math.PI * R_SMALL; // spinner stroke circumference

/* Scene 9: 12 month-circle Y positions (spread across vertical axis) */
export const MC_Y = [70, 108, 147, 185, 223, 261, 300, 338, 376, 415, 454, 492];
export const MC_X = 775;
export const MC_R = 15;

/* Scene 3: 9 period dots on the center axis */
export const DOT_YS = [42, 101, 159, 218, 276, 335, 393, 452, 510];

/* Scene 12: number of horizontal lines that burst out */
export const LINE_COUNT = 456;

/* Die Periode Phase 3: year-divider lines within the rect */
export const LINE_38_COUNT = 39;  // 39 lines → 38 gaps = 38 years

export const SVG_NS = 'http://www.w3.org/2000/svg';
