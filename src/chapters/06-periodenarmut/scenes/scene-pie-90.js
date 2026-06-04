/* ═══════════════════════════════════════════════════════════════════
   SCENE — 90% Pie (Chapter 6, Scene 4)
   90% of the dark sub-circle fills with red.
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch6-pie90',
  height: '150vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch6-pie90',
    html: `<p class="sh">90%</p>
           <p class="sl">finden dass sie Periodenprodukte<br>im Handel zu teuer sind</p>`,
  },

  init({ gsap }) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-pie90',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
      },
    });

    tl.to('#st-ch6-folgen', { opacity: 0, duration: 0.10 }, 0);
    tl.to('#st-ch6-pie90',  { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.08);
    tl.to('#pov-pie-90',    { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.18);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
