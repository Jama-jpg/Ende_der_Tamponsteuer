import { textIn, textOut } from '../../../core/text-anim.js';

export default {
  id: 's-ch10-fazit-a',
  height: '150vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch10-fazit-a',
    html: `
      <p class="sl">1. JÄNNER 2026</p>
      <p class="sh">Das Ende von 150 Jahren steuerlicher Diskriminierung.</p>
      <p class="sl">Periodenprodukte sind jetzt, was sie immer waren: Grundbedarf.</p>
    `,
  },

  init({ gsap, ScrollTrigger }) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch10-fazit-a',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    textIn(tl, '#st-ch10-fazit-a', 0.10);
    textOut(tl, '#st-ch10-fazit-a', 0.80);
  },
};
