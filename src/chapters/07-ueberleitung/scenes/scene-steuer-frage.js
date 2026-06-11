import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — Woher kommt diese Ungleichheit?  (Chapter 7 · Scene 4)
   Scale fades out; the bridging question leads the reader into the
   history timeline (chapter 8).
   At 83% scroll progress:
     • #lbl-kapitel / #lbl-periode morph with a departure-board ticker
       (each char inside overflow:hidden — old slides up, new rises in)
     • #lbl-year pulses big + red and swaps "2020" → "STEINZEIT"
     • VAT counter transitions "20% MwST." → "—"
       (number tickers out, % and MwST. fade away)
═══════════════════════════════════════════════════════════════════ */

/* Build overflow:hidden outer spans + inner moveable spans for `text`.
   Returns the inner span elements for GSAP to animate. */
function buildCharSpans(el, text) {
  el.innerHTML = [...text].map(c =>
    `<span style="display:inline-block;overflow:hidden;vertical-align:top;line-height:1.2">` +
    `<span style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>` +
    `</span>`,
  ).join('');
  return [...el.querySelectorAll('span > span')];
}

/* Departure-board ticker morph: old chars slide up, new chars rise in.
   Font, weight, and size are fully inherited. Returns cancel() for cleanup. */
function tickerMorph(gsap, el, newText) {
  const oldText = el.textContent;
  let cancelled = false;

  const innerOld = buildCharSpans(el, oldText);

  const outTween = gsap.to(innerOld, {
    y: '-100%',
    duration: 0.22,
    stagger: 0.025,
    ease: 'power2.in',
    onComplete() {
      if (cancelled) return;
      const innerNew = buildCharSpans(el, newText);
      gsap.fromTo(innerNew,
        { y: '100%' },
        {
          y: '0%',
          duration: 0.22,
          stagger: 0.025,
          ease: 'power2.out',
          onComplete() { if (!cancelled) el.textContent = newText; },
        },
      );
    },
  });

  return function cancel() {
    cancelled = true;
    outTween.kill();
    el.textContent = oldText;
  };
}

export default {
  id: 's-ch7-steuer-frage',
  height: '250vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-steuer-frage',
    html: `
      <p class="sl">Woher kommt diese Ungleichheit?<br>
      Die Antwort liegt weiter zurück<br>
      in der Geschichte.</p>
    `,
  },

  init({ gsap, ScrollTrigger }) {
    const waage      = document.getElementById('waage-grp');
    const crashBall  = document.getElementById('crash-ball');
    const lblKapitel = document.getElementById('lbl-kapitel');
    const lblPeriode = document.getElementById('lbl-periode');
    const lblYear    = document.getElementById('lbl-year');
    const vatNum     = document.getElementById('vat-big-num');
    const vatTax     = document.getElementById('vat-big-tax');

    /* Wrap the bare "%" text node in an animatable span (one-time, idempotent). */
    let vatPct = document.getElementById('vat-big-pct');
    if (!vatPct) {
      const vatCore = document.getElementById('vat-big-core');
      if (vatCore) {
        for (const node of vatCore.childNodes) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('%')) {
            vatPct = document.createElement('span');
            vatPct.id = 'vat-big-pct';
            vatPct.style.display = 'inline-block';
            vatPct.textContent = '%';
            vatCore.replaceChild(vatPct, node);
            break;
          }
        }
      }
    }

    /* Frage text sits on the LEFT (default overlay position) */
    gsap.set('#st-ch7-steuer-frage', { left: '0', right: 'auto' });

    /* Crash ball: natural resting position is on the SVG floor (cy=422, r=140).
       Start 900px above, transformOrigin at bottom so squash pivots on the floor. */
    gsap.set(crashBall, { y: -900 });
    gsap.set('#crash-ball-inner', { scale: 1.9, transformOrigin: '50% 50%' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-steuer-frage',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    });

    /* 20pct text and scale fade out together on enter */
    textOut(tl, '#st-ch7-steuer-20pct', 0.05);
    tl.to(waage, { opacity: 0, duration: 0.20, ease: 'power1.in' }, 0.05);

    /* Crash ball falls in from above and lands on the floor */
    tl.to(crashBall, { opacity: 1, duration: 0.04, ease: 'none' }, 0.04);
    tl.to(crashBall, { y: 0, duration: 0.62, ease: 'power3.in' }, 0.04);
    /* Crack appears on impact */
    tl.to('#crash-ball-crack', { opacity: 1, duration: 0.06, ease: 'power2.out' }, 0.66);
    /* Next scroll: ball falls off the bottom of the screen */
    tl.to(crashBall, { y: 350, duration: 0.14, ease: 'power2.in' }, 0.72);

    // Bridging question in → out
    textIn(tl, '#st-ch7-steuer-frage', 0.28);
    textOut(tl, '#st-ch7-steuer-frage', 0.80);

    // ── Non-scrubbed: fires once at 83% of this scene's scroll ──────
    let morphed = false;
    let cancelKapitel = null;
    let cancelPeriode = null;
    let cancelVat     = null;

    ScrollTrigger.create({
      trigger: '#s-ch7-steuer-frage',
      start: '83% top',
      onEnter() {
        if (morphed) return;
        morphed = true;

        // Year label: pulse big + red, swap "2020" → "STEINZEIT", settle back
        gsap.timeline()
          .fromTo(lblYear,
            { color: '#1a1a1a', scale: 1 },
            { color: '#D63335', scale: 2.2, duration: 0.35,
              ease: 'power2.out', transformOrigin: 'right top' })
          .to(lblYear, { scale: 1.8, duration: 0.12, ease: 'power1.in' })
          .to(lblYear, { scale: 2.2, duration: 0.18, ease: 'power2.out' })
          .call(() => { lblYear.textContent = 'STEINZEIT'; })
          .to(lblYear, { color: '#1a1a1a', scale: 1, duration: 0.45, ease: 'power2.inOut' });

        // Departure-board ticker on the chapter labels
        if (lblKapitel) cancelKapitel = tickerMorph(gsap, lblKapitel, 'KAPITEL 2');
        if (lblPeriode) cancelPeriode = tickerMorph(gsap, lblPeriode, 'DIE TAMPONSSTEUER');

        // VAT counter: ticker "20" → "—", fade out "%" only; "MwST." stays visible
        if (vatNum) cancelVat = tickerMorph(gsap, vatNum, '—');
        if (vatPct) {
          gsap.to(vatPct, {
            opacity: 0, duration: 0.2, ease: 'power2.in',
            onComplete() { vatPct.style.display = 'none'; },
          });
        }
      },
      onLeaveBack() {
        morphed = false;

        // Cancel in-flight morphs and reset labels
        if (cancelKapitel) { cancelKapitel(); cancelKapitel = null; }
        if (cancelPeriode) { cancelPeriode(); cancelPeriode = null; }
        if (cancelVat)     { cancelVat();     cancelVat     = null; }

        // Restore VAT "%" sign
        if (vatPct) { vatPct.style.display = 'inline-block'; gsap.set(vatPct, { opacity: 1 }); }

        // Reset year label
        gsap.killTweensOf(lblYear);
        if (lblYear) { gsap.set(lblYear, { color: '#1a1a1a', scale: 1 }); lblYear.textContent = '2020'; }
      },
    });
  },
};
