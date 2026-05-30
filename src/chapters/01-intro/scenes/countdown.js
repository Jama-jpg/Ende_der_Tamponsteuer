/* ═══════════════════════════════════════════════
   SCENE — Countdown (s1 + intro autoplay)
   Page-load entrance fades, the auto-played 20→0% VAT countdown with
   draining liquid, and the S2→S3 transition that unlocks scrolling.
   This whole sequence is time-driven (no ScrollTrigger).
═══════════════════════════════════════════════ */

export default {
  id: 's1',
  height: '220vh',

  init({ gsap, stage, controllers, shared }) {
    const r = stage.refs;
    const { wave } = controllers;

    /* Shrink the big VAT number so the "0%" lands at twice the year-label size;
       "MwST." (0.5em) then renders at the year size. Derived from rendered px,
       and shared so the s13 pulse uses the same base scale.
       Capture yearLbl size before the spine transition changes it. */
    const yearLblPx = parseFloat(getComputedStyle(r.yearLbl).fontSize);
    const vatScale  = (yearLblPx / parseFloat(getComputedStyle(r.vatBigEl).fontSize)) * 2;
    shared.vatScale = vatScale;
    /* Target size for euro counter + year label: match the shrunk VAT number. */
    const targetLabelPx = yearLblPx * 2;

    /* Lock scrolling until the S2→S3 transition completes */
    document.body.style.overflow = 'hidden';

    function unlockScroll() {
      document.body.style.overflow = '';
      const s3 = document.getElementById('s3');
      const base = s3 ? s3.offsetTop : 0;
      if (s3) window.scrollTo(0, base);

      /* Hide the scroll hint the moment the reader actually scrolls. */
      const hideHint = () => {
        if (window.scrollY > base + 30) {
          gsap.to(r.scrollHint, { opacity: 0, duration: 0.4, ease: 'power1.out' });
          window.removeEventListener('scroll', hideHint);
        }
      };
      window.addEventListener('scroll', hideHint, { passive: true });
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
      const euroContainer = document.getElementById('euro-counter');
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
      tl
        .to(r.sceneTitle, { opacity: 0, y: -16, duration: 0.5, ease: 'power2.in' }, 0)
        .to(r.vatBigEl,   { scale: vatScale, duration: 0.9, ease: 'power3.inOut' }, 0.1)
        .to(r.lblGoodNews,{ opacity: 0, duration: 0.25, ease: 'power1.in' }, 0.3)
        .call(() => { r.lblGoodNews.textContent = 'DIE  PERIODE'; }, [], 0.56)
        .to(r.lblGoodNews,{ opacity: 1, duration: 0.3, ease: 'power1.out' }, 0.57)
        .to(r.cAxis,      { opacity: 1, strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 0.3)
        .to(r.cAxisProgress, { opacity: 1, duration: 0.8, ease: 'power1.out' }, 0.8)
        .to(r.periodDots, { opacity: 1, duration: 0.01 }, 0.32)
        .call(() => {
          const dot0 = r.periodDots.querySelector('circle:first-child');
          if (dot0) gsap.to(dot0, { attr: { fill: '#A9A99F' }, duration: 0.4, ease: 'power1.out' });
        }, [], 0.32)
        /* The moment the 0% has finished shrinking, "MwST." fades in to its
           right (absolutely positioned, so it never shifts the centered 0%). */
        .to(r.vatBigTax, { opacity: 1, duration: 0.4, ease: 'power1.out' }, 1.0)
        /* …and the first circle builds up alongside the spine. The left text
           is held back — it fades in only once the reader starts scrolling
           (see period-axis.js). */
        .to(r.cOutline, { opacity: 1, duration: 0.7, ease: 'power1.out' }, 0.9)
        /* Euro counter + year label appear with the spine progress bar and grow
           to match the visual size of the shrunk VAT number (2× base size). */
        .to(euroContainer, { opacity: 1, duration: 0.8, ease: 'power1.out' }, 0.8)
        .call(() => { r.yearLbl.textContent = '2020'; }, [], 0.8)
        .to([euroContainer, r.yearLbl], { fontSize: targetLabelPx + 'px', duration: 0.5, ease: 'power2.out' }, 0.8)
        /* Once everything has settled, prompt the reader to scroll. */
        .to(r.scrollHint, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 1.6)
        .call(unlockScroll, [], 1.6);
    }

    /* ── Auto-play countdown: 20→0% and 1973→2026 over 4.2s, liquid drains
       in step. Both land on their final value and stay static — no glitch.
       The bottom shows just "0%"; the "MwST." part is added at chapter 2. ── */
    const proxy = { vat: 20, yr: 1973 };
    gsap.to(proxy, {
      vat: 0,
      yr:  2026,
      delay: 1.0,
      duration: 4.2,
      ease: 'power1.inOut',
      onUpdate() {
        r.vatBigNum.textContent = Math.round(proxy.vat);
        r.yearLbl.textContent   = Math.round(proxy.yr);
        r.liquidBg.style.height = proxy.vat + 'vh';
      },
      onComplete() {
        r.vatBigNum.textContent = 0;
        r.yearLbl.textContent   = 2026;
        r.liquidBg.style.height = '0vh';
        wave.stop();
        gsap.delayedCall(0.6, playS2toS3Transition);
      },
    });
  },
};
