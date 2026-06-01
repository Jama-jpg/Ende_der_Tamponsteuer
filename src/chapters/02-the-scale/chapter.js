/* Chapter 2 — The Scale
   The circle fills (in the merged s3 scene), grows to represent 1.9 billion
   people, pulses, and reveals (on hover) that menstruating people are 26% of
   the world. circle-fill is now part of period-axis (Chapter 1, scene s3). */
import circleGrow from './scenes/circle-grow.js';
import pie26      from './scenes/pie-26.js';

export default {
  id: 'scale',
  title: 'The Scale',
  scenes: [circleGrow, pie26],
};
