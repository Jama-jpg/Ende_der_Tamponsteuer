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

/* Chapter 5: 25 euro coin resting positions (stacked formation)
   1 top center + 8 rows of 3, r=22, spacing=55 vertical / 90 horizontal */
export const COIN_POSITIONS = [
  [790, 88],
  [700, 143], [790, 143], [880, 143],
  [700, 198], [790, 198], [880, 198],
  [700, 253], [790, 253], [880, 253],
  [700, 308], [790, 308], [880, 308],
  [700, 363], [790, 363], [880, 363],
  [700, 418], [790, 418], [880, 418],
  [700, 473], [790, 473], [880, 473],
  [700, 528], [790, 528], [880, 528],
];

/* Chapter 5: scattered positions used when coins grow to fill right half */
export const COIN_SCATTER = [
  [555, 65],  [670, 38],  [790, 58],  [910, 48],  [1015, 78],
  [542, 178], [672, 158], [798, 177], [922, 167], [1048, 193],
  [547, 290], [663, 268], [788, 288], [908, 273], [1038, 298],
  [558, 398], [675, 377], [800, 396], [924, 383], [1047, 408],
  [568, 502], [692, 482], [820, 502], [944, 488], [1058, 518],
];

/* Chapter 6: poverty circle geometry */
export const POV_CX    = 790;
export const POV_CY    = 281;
export const POV_R     = 180;   // big circle (1.4M people)
export const POV_SUB_R = 108;   // sub-circle (500k ≈ sqrt(500/1400) * 180)

export const SVG_NS = 'http://www.w3.org/2000/svg';
