import steuerIntro      from './scenes/scene-steuer-intro.js';
import steuer10pct      from './scenes/scene-steuer-10pct.js';
import steuer20pct      from './scenes/scene-steuer-20pct.js';
import steuerFrage      from './scenes/scene-steuer-frage.js';
import geschichteIntro  from './scenes/scene-geschichte-intro.js';
import steinzeit        from './scenes/scene-steinzeit.js';
import antike           from './scenes/scene-antike.js';
import mittelalter      from './scenes/scene-mittelalter.js';
import jhd19           from './scenes/scene-19jhd.js';
import scene1896      from './scenes/scene-1896.js';
import scene1973      from './scenes/scene-1973.js';

export default {
  id: 'ueberleitung',
  title: 'Die Überleitung',
  scenes: [steuerIntro, steuer10pct, steuer20pct, steuerFrage, geschichteIntro, steinzeit, antike, mittelalter, jhd19, scene1896, scene1973],
};
