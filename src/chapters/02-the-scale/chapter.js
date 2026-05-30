/* Chapter 2 — The Scale
   The circle fills, grows to represent 1.9 billion people, pulses, and
   reveals (on hover) that menstruating people are 26% of the world. */
import circleFill from './scenes/circle-fill.js';
import circleGrow from './scenes/circle-grow.js';
import pie26      from './scenes/pie-26.js';

export default {
  id: 'scale',
  title: 'The Scale',
  scenes: [circleFill, circleGrow, pie26],
};
