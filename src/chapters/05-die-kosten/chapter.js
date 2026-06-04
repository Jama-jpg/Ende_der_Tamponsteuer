/* Chapter 5 — Die Kosten */
import scene17k    from './scenes/scene-17k.js';
import scene25k    from './scenes/scene-25k.js';
import sceneDetail from './scenes/scene-kosten-detail.js';
import sceneGrow   from './scenes/scene-coins-grow.js';

export default {
  id: 'die-kosten',
  title: 'Die Kosten',
  scenes: [scene17k, scene25k, sceneDetail, sceneGrow],
};
