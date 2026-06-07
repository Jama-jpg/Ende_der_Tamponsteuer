export default {
  id: 's-ch7-ueberleitung',
  height: '150vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-ueberleitung',
    html: `
      <p class="sl">UND DOCH —</p>
      <p class="sh">Wer keine Wahl hat,<br>ob er blutet —</p>
      <p class="sl">sollte zumindest keine Strafe dafür zahlen.</p>
    `,
  },

  init({ gsap, ScrollTrigger }) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-ueberleitung',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    tl
      .to('#st-ch7-ueberleitung', { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.10)
      .to('#st-ch7-ueberleitung', { opacity: 0, duration: 0.15, ease: 'power1.in'  }, 0.75);
  },
};
