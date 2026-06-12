import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — 19. Jahrhundert  (Chapter 7 · Scene 9)
   Left:  Binde SVG (tilted oval with stitching, upper-center-left)
          + Wollknäuel SVG (lower-left)
          + text about handmade cloth pads
   Right: text about menstruation declared illness in 1811
   Era label transitions from MITTELALTER → 19. JAHRHUNDERT
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-19jhd',
  height: '300vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-19jhd-left',
    html: `
      <p class="sl">Binden werden in mühsamer<br>Handarbeit aus</p>
      <p class="sh">STOFFRESTE<br>ODER WOLLE</p>
      <p class="sl">genäht und in Familien oft<br>kollektiv geteilt.</p>
    `,
  },

  init({ gsap }) {
    const overlaysContainer = document.getElementById('overlays');

    if (!document.getElementById('st-ch7-19jhd-right')) {
      const ov = document.createElement('div');
      ov.className = 'stext';
      ov.id = 'st-ch7-19jhd-right';
      ov.innerHTML = `
        <p class="sl">Im Jahr&nbsp;&nbsp;1811 wird die<br>Menstruation offiziell zur</p>
        <p class="sh">KRANKHEIT</p>
        <p class="sl">erklärt.<br>Mediziner behaupten:<br>Menstruierende sind<br>während ihrer Tage geistig<br>unzurechnungsfähig.</p>
      `;
      overlaysContainer.appendChild(ov);
    }

    gsap.set('#st-ch7-19jhd-left',  { left: '0', right: 'auto' });
    gsap.set('#st-ch7-19jhd-right', { left: 'auto', right: '0' });

    const mainSvg = document.getElementById('main-svg');
    if (!document.getElementById('jhd19-grp')) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.id = 'jhd19-grp';
      g.setAttribute('opacity', '0');
      g.innerHTML = `
        <!-- BINDE — tilted oval with dashed stitching, upper center-left -->
        <!-- Center: (330, 125), rx=62, ry=92, tilted 18° clockwise -->
        <g id="jhd19-binde" transform="translate(330, 125) rotate(18)">
          <ellipse cx="0" cy="0" rx="62" ry="92" fill="#621B1B"/>
          <ellipse cx="0" cy="0" rx="54" ry="84" fill="none"
            stroke="white" stroke-width="5" stroke-dasharray="12,8" stroke-linecap="round"/>
        </g>

        <!-- WOLLKNÄUEL — pom-pom (central circle + 8 bumps), lower-left -->
        <!-- Center: (140, 444). Peak radius ~74, valley ~57 (24% indent, 8 bumps). -->
        <g id="jhd19-wolle" transform="translate(140, 444)">
          <!-- central fill -->
          <circle cx="0"    cy="0"     r="42"  fill="#d23537"/>
          <!-- 8 bump circles, distance=52, r=22 -->
          <circle cx="52"   cy="0"     r="22"  fill="#d23537"/>
          <circle cx="36.8" cy="36.8"  r="22"  fill="#d23537"/>
          <circle cx="0"    cy="52"    r="22"  fill="#d23537"/>
          <circle cx="-36.8" cy="36.8" r="22"  fill="#d23537"/>
          <circle cx="-52"  cy="0"     r="22"  fill="#d23537"/>
          <circle cx="-36.8" cy="-36.8" r="22" fill="#d23537"/>
          <circle cx="0"    cy="-52"   r="22"  fill="#d23537"/>
          <circle cx="36.8" cy="-36.8" r="22"  fill="#d23537"/>
          <!-- white hooks / thread curls -->
          <path d="M-25,-22 Q-15,-36 -4,-24"  fill="none" stroke="white" stroke-width="5.5" stroke-linecap="round"/>
          <path d="M 16,-26 Q 26,-38  36,-26" fill="none" stroke="white" stroke-width="5.5" stroke-linecap="round"/>
          <path d="M-32,  2 Q-22,-10 -12,  2" fill="none" stroke="white" stroke-width="5.5" stroke-linecap="round"/>
          <path d="M  8,  0 Q 18,-12  28,  0" fill="none" stroke="white" stroke-width="5.5" stroke-linecap="round"/>
          <path d="M-22, 24 Q-12, 12  -2, 24" fill="none" stroke="white" stroke-width="5.5" stroke-linecap="round"/>
          <path d="M  6, 28 Q 16, 16  26, 28" fill="none" stroke="white" stroke-width="5.5" stroke-linecap="round"/>
          <path d="M-10, 38 Q  0, 26  10, 38" fill="none" stroke="white" stroke-width="5.5" stroke-linecap="round"/>
        </g>
      `;
      mainSvg.appendChild(g);
    }

    const lblYear = document.getElementById('lbl-year');
    let labelSet = false;

    let floatTween = null;

    function startFloat() {
      if (floatTween) floatTween.kill();
      floatTween = gsap.to('#jhd19-grp', { y: -5, duration: 2.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }
    function stopFloat() {
      if (floatTween) { floatTween.kill(); floatTween = null; gsap.set('#jhd19-grp', { y: 0 }); }
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-19jhd',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onEnter() {
          startFloat();
          if (!labelSet && lblYear) {
            labelSet = true;
            gsap.timeline()
              .to(lblYear, { scale: 1.6, duration: 0.25, ease: 'power2.out', transformOrigin: 'right top' })
              .call(() => { lblYear.textContent = '19. JAHRHUNDERT'; })
              .to(lblYear, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
          }
        },
        onEnterBack() { startFloat(); },
        onLeave()     { stopFloat(); },
        onLeaveBack() {
          stopFloat();
          labelSet = false;
          if (lblYear) {
            gsap.killTweensOf(lblYear);
            gsap.set(lblYear, { scale: 1 });
            lblYear.textContent = 'MITTELALTER';
          }
        },
      },
    });

    textIn(tl, '#st-ch7-19jhd-left',  0.15);
    textIn(tl, '#st-ch7-19jhd-right', 0.15);
    tl.to('#jhd19-grp', { opacity: 1, duration: 0.15, ease: 'power2.out' }, 0.15);

    textOut(tl, '#st-ch7-19jhd-left',  0.82);
    textOut(tl, '#st-ch7-19jhd-right', 0.82);
    tl.to('#jhd19-grp', { opacity: 0, duration: 0.10, ease: 'power2.in' }, 0.82);
  },
};
