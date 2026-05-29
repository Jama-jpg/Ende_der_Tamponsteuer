/* ═══════════════════════════════════════════════
   SCENE — Countdown (s1 + intro autoplay)
   Page-load entrance fades, the auto-played 20→0% VAT countdown with
   draining liquid, and the S2→S3 transition that unlocks scrolling.
   This whole sequence is time-driven (no ScrollTrigger).
═══════════════════════════════════════════════ */

export default {
  id: 's1',
  height: '220vh',

  init({ gsap, stage, controllers }) {
    const r = stage.refs;
    const { wave, glitch } = controllers;

    /* Lock scrolling until the S2→S3 transition completes */
    document.body.style.overflow = 'hidden';

    function unlockScroll() {
      document.body.style.overflow = '';
      const s3 = document.getElementById('s3');
      if (s3) window.scrollTo(0, s3.offsetTop);
    }

    /* ── Page-load entrance (staggered fades) ── */
    gsap.set([r.lblGoodNews, r.yearLbl, r.sceneTitle, r.vatBigEl], { opacity: 0 });
    gsap.to(r.lblGoodNews, { opacity: 1, duration: 1.2, ease: 'power1.out' });
    gsap.to(r.yearLbl,     { opacity: 1, duration: 1.2, ease: 'power1.out' });
    gsap.to(r.sceneTitle,  { opacity: 1, duration: 1.6, delay: 0.1, ease: 'power1.out' });
    gsap.to(r.vatBigEl,    { opacity: 1, duration: 2.0, delay: 0.3, ease: 'power1.out' });
    gsap.to(r.liquidBg,    { opacity: 1, duration: 1.8, delay: 0.4, ease: 'power1.out',
      onStart: () => wave.start() });

    /* ── S2 → S3 transition (auto-plays after the countdown) ── */
    function playS2toS3Transition() {
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
      tl
        .to(r.sceneTitle, { opacity: 0, y: -16, duration: 0.5, ease: 'power2.in' }, 0)
        .to(r.vatBigEl,   { scale: 0.056, duration: 0.9, ease: 'power3.inOut' }, 0.1)
        .to(r.lblGoodNews,{ opacity: 0, duration: 0.25, ease: 'power1.in' }, 0.3)
        .call(() => { r.lblGoodNews.textContent = 'DIE  PERIODE'; }, [], 0.56)
        .to(r.lblGoodNews,{ opacity: 1, duration: 0.3, ease: 'power1.out' }, 0.57)
        .to(r.cAxis,      { opacity: 1, strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 0.3)
        .to(r.periodDots, { opacity: 1, duration: 0.01 }, 0.32)
        .call(() => {
          const dot0 = r.periodDots.querySelector('circle:first-child');
          if (dot0) gsap.to(dot0, { attr: { fill: '#1a1a1a' }, duration: 0.4, ease: 'power1.out' });
        }, [], 0.32)
        .call(unlockScroll,   [], 1.45)
        .call(glitch.start,   [], 1.5);
    }

    /* ── Auto-play countdown: 20→0% over 4.2s, liquid drains in step ── */
    const proxy = { vat: 20, yr: 1973 };
    gsap.to(proxy, {
      vat: 0,
      yr:  2026,
      delay: 1.0,
      duration: 4.2,
      ease: 'power1.inOut',
      onUpdate() {
        const v = Math.round(proxy.vat);
        r.vatBigNum.textContent = v;
        r.vatNum.textContent    = v;
        r.yearLbl.textContent   = Math.round(proxy.yr);
        r.liquidBg.style.height = proxy.vat + 'vh';
      },
      onComplete() {
        r.vatBigNum.textContent = 0;
        r.vatNum.textContent    = 0;
        r.yearLbl.textContent   = 2026;
        r.liquidBg.style.height = '0vh';
        wave.stop();
        gsap.delayedCall(0.6, playS2toS3Transition);
      },
    });
  },
};
