/* Chapter 4 — Die Periode (three-scroll sequence)
   Three separate scroll steps, each with its own ScrollTrigger + snap point:
     A (350vh): 12 circles → rect → widens → 38 dividers → "Für 38 Jahre"
     B (300vh): 456 barcode lines appear → "456 mal"
     C (300vh): lines retract → 31 years fade → 7-year payoff text */
import sceneA from './scenes/scene-a-38-years.js';
import sceneB from './scenes/scene-b-456-lines.js';
import sceneC from './scenes/scene-c-7-years.js';

export default {
  id: 'lifetime',
  title: 'Die Periode',
  scenes: [sceneA, sceneB, sceneC],
};
