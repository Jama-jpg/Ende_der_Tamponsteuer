/* Period-product VAT rates by country (2026).
   lat/lon in degrees; rate in % (null = varies by state/product). */

export const COUNTRIES = [
  // 0% — green
  { name: 'Österreich',   rate: 0,    lat:  47, lon:  14 },
  { name: 'Irland',       rate: 0,    lat:  53, lon:  -8 },
  { name: 'Spanien',      rate: 0,    lat:  40, lon:  -4 },
  { name: 'Luxemburg',    rate: 0,    lat:  49, lon:   6 },
  { name: 'Malta',        rate: 0,    lat:  36, lon:  14 },
  { name: 'Niederlande',  rate: 0,    lat:  52, lon:   5 },
  { name: 'England',      rate: 0,    lat:  52, lon:  -1 },
  { name: 'Zypern',       rate: 0,    lat:  35, lon:  33 },
  { name: 'Kenia',        rate: 0,    lat:  -1, lon:  37 },
  { name: 'Kanada',       rate: 0,    lat:  56, lon: -96 },
  { name: 'Indien',       rate: 0,    lat:  20, lon:  78 },
  { name: 'Schottland',   rate: 0,    lat:  57, lon:  -4 },

  // Reduced — yellow
  { name: 'Deutschland',  rate: 7,    lat:  51, lon:  10 },
  { name: 'Frankreich',   rate: 5.5,  lat:  46, lon:   2 },
  { name: 'Polen',        rate: 5,    lat:  52, lon:  20 },
  { name: 'Belgien',      rate: 6,    lat:  51, lon:   4 },
  { name: 'Portugal',     rate: 6,    lat:  39, lon:  -8 },
  { name: 'Australien',   rate: 10,   lat: -25, lon: 133 },
  { name: 'USA',          rate: null, lat:  38, lon: -97 }, // varies by state

  // High — red/orange
  { name: 'Italien',      rate: 22,   lat:  42, lon:  13 },
  { name: 'Griechenland', rate: 23,   lat:  39, lon:  22 },
  { name: 'Ungarn',       rate: 27,   lat:  47, lon:  19 },
];

/* Color by rate */
export function rateColor(rate) {
  if (rate === null)   return '#C9C9C0'; // unknown / varies
  if (rate === 0)      return '#5BB85B'; // green
  if (rate <= 10)      return '#E8B84B'; // yellow
  if (rate <= 20)      return '#E8794B'; // orange
  return '#D63335';                      // red (>20%)
}

/* Format rate for display */
export function rateLabel(rate) {
  if (rate === null) return 'varies';
  return `${rate} %`;
}
