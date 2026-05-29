/* Chapter 4 — The Lifetime
   The monthly periods accumulate across a lifetime: 38 years, 456 times,
   adding up to 7 continuous years — and the VAT finally lands at 0%. */
import rect38Years  from './scenes/rect-38-years.js';
import rectWiden    from './scenes/rect-widen.js';
import lines456     from './scenes/lines-456.js';
import payoff7Years from './scenes/payoff-7-years.js';

export default {
  id: 'lifetime',
  title: 'The Lifetime',
  scenes: [rect38Years, rectWiden, lines456, payoff7Years],
};
