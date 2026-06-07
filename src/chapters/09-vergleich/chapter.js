import realitaetscheck from './scenes/scene-realitaetscheck.js';
import globe           from './scenes/scene-globe.js';
import euComparison    from './scenes/scene-eu-comparison.js';

export default {
  id: 'vergleich',
  title: 'Der internationale Vergleich',
  scenes: [realitaetscheck, globe, euComparison],
};
