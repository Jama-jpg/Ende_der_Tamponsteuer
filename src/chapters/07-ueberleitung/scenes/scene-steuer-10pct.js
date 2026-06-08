/* ═══════════════════════════════════════════════════════════════════
   SCENE — 10 % MwSt.  (Chapter 7 · Scene 2)
   The ⊓ bracket fades in showing only the LEFT side: Bücher / Kaviar /
   Trüffel items + the large "10 %" serif label.  Right side (20% capsule)
   stays hidden.  Scale is level (no rotation yet).
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-steuer-10pct',
  height: '200vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-steuer-10pct',
    html: `
      <p class="sl">Während in Österreich bis ins<br>
      Jahr 2020 für Produkte<br>
      wie Bücher oder Kaviar ein reduzierter<br>
      Mehrwertsteuersatz galt,</p>
    `,
  },

  init({ gsap }) {
    const waage  = document.getElementById('waage-grp');
    const itemsL = document.getElementById('waage-items-l');
    const big10  = document.getElementById('waage-big-10');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-steuer-10pct',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    tl.to('#st-ch7-steuer-10pct', { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.10);
    tl.to('#st-ch7-steuer-10pct', { opacity: 0, duration: 0.15, ease: 'power1.in'  }, 0.82);

    // Bracket structure appears (beam + arms visible)
    tl.to(waage,  { opacity: 1, duration: 0.22, ease: 'power1.out' }, 0.18);

    // Left-side elements build in
    tl.to(itemsL, { opacity: 1, duration: 0.15, ease: 'power1.out' }, 0.35);
    tl.to(big10,  { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.45);
  },
};
