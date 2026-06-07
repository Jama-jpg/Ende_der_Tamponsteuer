/* ═══════════════════════════════════════════════════════════════════
   SCENE — 25.000 Euro (Chapter 5, Scene 2)
   The 17 tampon infographics morph in-place into red circles with
   "1000€" labels (scroll-driven). Then 8 more circles fall from
   above onto the pile.

   Timeline (0 → 1 over 300vh):
     0.05–0.20  Counter ticks 0 → 25000; text overlay fades in
     0.05–0.60  17 tampons morph to circles (pill fades, circle grows)
     0.68–0.90  8 new circles fall from above onto the pile
     0.92–0.98  Text overlay fades out
═══════════════════════════════════════════════════════════════════ */
import { computeStack17, computeStack25 } from '../physics.js';

export default {
  id: 's-ch5-25k',
  height: '300vh',
  skipSnapStart: true,
  snapPoints: [0.80],

  overlay: {
    id: 'st-ch5-25k',
    html: `<p class="sl">RUND</p>
           <p class="sh"><span id="ch5-counter">0</span></p>
           <p class="sl">EURO.<br>KOSTET DIE PERIODE ÜBER<br>EIN GANZES LEBEN HINWEG<br>UND WIRD SO ZU EINER<br>UNFREIWILLIGEN<br>FINANZIELLEN VERPFLICHTUNG</p>`,
  },

  init({ gsap, ScrollTrigger, stage }) {
    const { coinsGrp, coinEls, tamponPillEls } = stage.refs;
    const counterEl = document.getElementById('ch5-counter');

    const stack17 = computeStack17();
    const stack25 = computeStack25(stack17);

    const proxy = { val: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch5-25k',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    tl.to('#st-ch5-25k', { opacity: 1, duration: 0.10, ease: 'power1.out' }, 0.05);
    tl.to(proxy, {
      val: 25000,
      duration: 0.15,
      ease: 'power2.inOut',
      onUpdate() {
        if (counterEl) counterEl.textContent = Math.round(proxy.val).toLocaleString('de-AT');
      },
    }, 0.05);

    /* Morph each tampon → circle (bottom rows first) */
    const MORPH_ORDER = [16,13,14,15,10,11,12,7,8,9,4,5,6,1,2,3,0];
    MORPH_ORDER.forEach((idx, order) => {
      const g       = coinEls[idx];
      const pillG   = tamponPillEls[idx];
      const circle  = g.querySelector('circle');
      const euroLbl = g.querySelector('text');
      const t0 = 0.05 + order * 0.016;

      tl.to(pillG,   { opacity: 0, duration: 0.12, ease: 'power1.in' }, t0);
      tl.to(circle,  { attr: { r: 22 }, opacity: 1, duration: 0.18, ease: 'power2.out' }, t0 + 0.06);
      tl.to(euroLbl, { opacity: 1, duration: 0.10, ease: 'power1.out' }, t0 + 0.16);
    });

    /* 8 new circles fall from above onto the pile */
    stack25.forEach(({ dx, dy }, j) => {
      const t0 = 0.68 + j * 0.025;
      tl.fromTo(
        coinEls[17 + j],
        { opacity: 1, x: dx, y: -600 },
        { opacity: 1, y: dy, duration: 0.10, ease: 'power2.in' },
        t0,
      );
    });

    tl.to('#st-ch5-25k', { opacity: 0, duration: 0.06, ease: 'power1.in' }, 0.92);
    tl.to({}, { duration: 0.02 }, 0.98);

    /* Pre-position tampons at their stacked locations when entering */
    ScrollTrigger.create({
      trigger: '#s-ch5-25k',
      start: 'top bottom',
      onEnter() {
        stack17.forEach(({ dx, dy }, i) => {
          gsap.set(coinEls[i], { x: dx, y: dy, rotation: 0 });
        });
        gsap.set(coinEls.slice(17), { opacity: 0 });
        gsap.set(coinsGrp, { opacity: 1 });
      },
      onLeaveBack() {
        gsap.set(coinsGrp, { opacity: 0 });
        gsap.set(coinEls.slice(17), { opacity: 0 });
      },
    });
  },
};
