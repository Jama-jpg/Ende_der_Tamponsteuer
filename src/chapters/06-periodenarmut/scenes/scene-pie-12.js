/* ═══════════════════════════════════════════════════════════════════
   SCENE — 12% Pie (Chapter 6, Scene 7)
   12% sector completes the cumulative pie.
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch6-pie12',
  height: '150vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch6-pie12',
    html: `<p class="sh">12%</p>
           <p class="sl">zögern den Wechsel vom Periodenprodukten<br>bewusst hinaus um Material zu sparen.<br>Das erhöht das Risiko für<br>Infektionen und TSS.</p>`,
  },

  init({ gsap }) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch6-pie12',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
      },
    });

    tl.to('#st-ch6-pie15', { opacity: 0, duration: 0.10 }, 0);
    tl.to('#st-ch6-pie12', { opacity: 1, duration: 0.12, ease: 'power1.out' }, 0.08);
    tl.to('#pov-pie-12',   { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.18);

    tl.to({}, { duration: 0.02 }, 0.98);
  },
};
