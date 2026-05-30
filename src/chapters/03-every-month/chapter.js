/* Chapter 3+4 — Die Periode (merged)
   Jeden Monat → 12 circles → rect → 38 Jahre → 456 mal → 7 Jahre */
import jedenMonat from './scenes/jeden-monat.js';
import sceneA     from '../04-the-lifetime/scenes/scene-a-38-years.js';
import sceneB     from '../04-the-lifetime/scenes/scene-b-456-lines.js';
import sceneC     from '../04-the-lifetime/scenes/scene-c-7-years.js';

export default {
  id: 'die-periode',
  title: 'Die Periode',
  scenes: [jedenMonat, sceneA, sceneB, sceneC],
};
