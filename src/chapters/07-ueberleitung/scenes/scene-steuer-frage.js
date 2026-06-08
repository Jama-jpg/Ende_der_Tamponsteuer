/* ═══════════════════════════════════════════════════════════════════
   SCENE — Woher kommt diese Ungleichheit?  (Chapter 7 · Scene 4)
   Scale fades out; the bridging question leads the reader into the
   history timeline (chapter 8).
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-steuer-frage',
  height: '150vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-steuer-frage',
    html: `
      <p class="sl">Woher kommt diese Ungleichheit?<br>
      Die Antwort liegt weiter zurück<br>
      in der Geschichte.</p>
    `,
  },

  init({ gsap }) {
    const waage = document.getElementById('waage-grp');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-steuer-frage',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    // Scale fades out as we enter this scene
    tl.to(waage, { opacity: 0, duration: 0.20, ease: 'power1.in' }, 0.05);

    // Bridging question in → out
    tl.to('#st-ch7-steuer-frage', { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.22);
    tl.to('#st-ch7-steuer-frage', { opacity: 0, duration: 0.15, ease: 'power1.in'  }, 0.80);
  },
};
