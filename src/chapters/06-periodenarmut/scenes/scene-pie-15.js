/* ═══════════════════════════════════════════════════════════════════
   SCENE — 15% Pie (Chapter 6, Scene 6)
   15% sector added on top of 90% + 60%.
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch6-pie15',
  height: '150vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch6-pie15',
    html: `<p class="sh">15%</p>
           <p class="sl">versuchen, so wenig Material wie<br>möglich zu verbrauchen</p>`,
  },

  init({ gsap }) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-pie15',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
      },
    });

    tl.to('#st-ch6-pie60', { opacity: 0, duration: 0.10 }, 0);
    tl.to('#st-ch6-pie15', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.08);
    tl.to('#pov-pie-15',   { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.18);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
