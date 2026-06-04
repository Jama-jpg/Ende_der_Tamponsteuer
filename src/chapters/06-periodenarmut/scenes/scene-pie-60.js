/* ═══════════════════════════════════════════════════════════════════
   SCENE — 60% Pie (Chapter 6, Scene 5)
   60% sector added on top of the 90% sector (different colour).
   All previous sectors remain visible.
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch6-pie60',
  height: '150vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch6-pie60',
    html: `<p class="sl">Für über</p>
           <p class="sh">60%</p>
           <p class="sl">stellte der Kauf von Tampons und Binden<br>eine finanzielle Belastung dar.</p>`,
  },

  init({ gsap }) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-pie60',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
      },
    });

    tl.to('#st-ch6-pie90', { opacity: 0, duration: 0.10 }, 0);
    tl.to('#st-ch6-pie60', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.08);
    tl.to('#pov-pie-60',   { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.18);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
