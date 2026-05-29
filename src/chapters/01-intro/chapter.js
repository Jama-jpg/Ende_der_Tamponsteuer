/* Chapter 1 — Intro
   The auto-played VAT countdown, title, and the period axis reveal. */
import countdown       from './scenes/countdown.js';
import titleTransition from './scenes/title-transition.js';
import periodAxis      from './scenes/period-axis.js';

export default {
  id: 'intro',
  title: 'Intro',
  scenes: [countdown, titleTransition, periodAxis],
};
