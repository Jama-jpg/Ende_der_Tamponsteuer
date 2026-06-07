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
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch10-fazit-b',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    tl
      .to('#st-ch10-fazit-b', { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.10)
      .to('#st-ch10-fazit-b', { opacity: 0, duration: 0.15, ease: 'power1.in'  }, 0.80);
  },
};
