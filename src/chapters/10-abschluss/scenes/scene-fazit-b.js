import { textIn, textOut, setSceneVh } from '../../../core/text-anim.js';

export default {
  id: 's-ch10-fazit-b',
  height: '150vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch10-fazit-b',
    html: `
      <p class="sl">ABER —</p>
      <p class="sh">Die 0 % Steuer ist nicht das Ende der Belastung.</p>
      <p class="sl">Sie ist der Anfang der Anerkennung.</p>
    `,
  },

  init({ gsap, ScrollTrigger }) {
    setSceneVh(150);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch10-fazit-b',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    textIn(tl, '#st-ch10-fazit-b', 0.10);
    textOut(tl, '#st-ch10-fazit-b', 0.80);
  },
};
