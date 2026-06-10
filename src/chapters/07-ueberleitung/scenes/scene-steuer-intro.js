/* ═══════════════════════════════════════════════════════════════════
   SCENE — Steuer Intro  (Chapter 7 · Scene 1)
   Clears the chapter-6 pov/pie visuals, shows the structural-inequality
   intro text, and fires a one-shot red pulse on the year label (→ 2020)
   and the VAT counter — matching the euro-counter pulse from chapter 2.
═══════════════════════════════════════════════════════════════════ */

import { textIn, textOut } from '../../../core/text-anim.js';

export default {
  id: 's-ch7-steuer-intro',
  height: '150vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-steuer-intro',
    html: `
      <p class="sl">Zu dieser finanziellen Belastung<br>
      für menstruierende Menschen<br>
      kommt auch noch ein strukturelles,<br>
      diskriminierendes Ungleichgewicht<br>
      in der Besteuerung von<br>
      Periodenprodukten hinzu.</p>
    `,
  },

  init({ gsap, stage }) {
    const { povSub, povPie90, povPie60, povPie15, povPie12 } = stage.refs;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-steuer-intro',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    // Fade out chapter-6 pie visuals immediately on enter
    tl.to([povSub, povPie90, povPie60, povPie15, povPie12],
      { opacity: 0, duration: 0.15, ease: 'power1.in' }, 0.0);
    textOut(tl, '#st-ch6-pie12', 0.0);
    textIn(tl, '#st-ch7-steuer-intro', 0.18);
  },
};
