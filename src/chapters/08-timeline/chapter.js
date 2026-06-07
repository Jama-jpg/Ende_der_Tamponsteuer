import layoutIn  from './scenes/scene-layout-transition.js';
import era1      from './scenes/scene-era-1.js';
import era2      from './scenes/scene-era-2.js';
import era3      from './scenes/scene-era-3.js';
import era4      from './scenes/scene-era-4.js';
import era5      from './scenes/scene-era-5.js';
import era6      from './scenes/scene-era-6.js';
import layoutOut from './scenes/scene-layout-exit.js';

export default {
  id: 'timeline',
  title: 'Die Timeline',
  scenes: [layoutIn, era1, era2, era3, era4, era5, era6, layoutOut],
};
