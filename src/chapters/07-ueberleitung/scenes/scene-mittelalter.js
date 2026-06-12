import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — Mittelalter  (Chapter 7 · Scene 8)
   Left:  Blutstropfen SVG (upper-left) + text about free bleeding
   Right: Stofffetzen SVG (lower-center) + text about religious stigma
   Era label transitions from ANTIKE → MITTELALTER
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-mittelalter',
  height: '300vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-mittelalter-left',
    html: `
      <p class="sl">Im Mittelalter wurde in der Regel<br>keine Unterwäsche getragen.<br>Das bedeutete</p>
      <p class="sh">FREE BLEEDING</p>
      <p class="sl">Einzige Abhilfe waren</p>
      <p class="sh">STOFFFETZEN</p>
      <p class="sl">die das Blut spärlich auffingen</p>
    `,
  },

  init({ gsap }) {
    const overlaysContainer = document.getElementById('overlays');

    if (!document.getElementById('st-ch7-mittelalter-right')) {
      const ov = document.createElement('div');
      ov.className = 'stext';
      ov.id = 'st-ch7-mittelalter-right';
      ov.innerHTML = `
        <p class="sl">Die Biologie wird zur</p>
        <p class="sh">RELIGIÖSE SÜNDE</p>
        <p class="sl">Die Kirche deklariert das Blut als</p>
        <p class="sh">EVAS FLUCH</p>
        <p class="sl">Wer blutet, gilt als</p>
        <p class="sh">UNREIN</p>
      `;
      overlaysContainer.appendChild(ov);
    }

    gsap.set('#st-ch7-mittelalter-left',  { left: '0', right: 'auto' });
    gsap.set('#st-ch7-mittelalter-right', { left: 'auto', right: '0' });

    const mainSvg = document.getElementById('main-svg');
    if (!document.getElementById('mittelalter-grp')) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.id = 'mittelalter-grp';
      g.setAttribute('opacity', '0');
      g.innerHTML = `
        <!-- BLUTSTROPFEN — upper-left -->
        <!-- Original viewBox 0 0 445.44 405.67, scaled 0.44 -->
        <g id="mittelalter-tropfen" transform="translate(28, 20) scale(0.44)">
          <path d="M106.86,258.05c-.18-21.64,6.06-41.61,16.62-60.14,29.65-52.05,59.62-103.92,89.59-155.78,1.16-2.01,3.34-3.74,5.45-4.81,3.99-2.01,5.88-1.2,8.1,2.65,30.08,52.26,60.5,104.34,90.09,156.87,15.33,27.22,21.03,56.56,11.97,87.22-8.57,29.01-27.14,50.54-53.14,65.55-43.58,25.15-97.25,19.68-134.64-13.97-22.89-20.6-33.38-47.07-34.04-77.6Z" fill="#d23537"/>
        </g>

        <!-- STOFFFETZEN — lower-center-left -->
        <!-- Original viewBox 0 0 445.44 405.67, scaled 0.38 -->
        <g id="mittelalter-fetzen" transform="translate(145, 358) scale(0.38)">
          <path d="M67.14,305.3c1.49-3.27,2.4-6.06,3.93-8.45,5.34-8.28,10.84-16.47,16.41-24.6,1.34-1.95,1.32-3.4,0-5.35-5.26-7.69-10.33-15.52-15.55-23.25-5.16-7.64-5.17-11.12.03-18.87,5.2-7.74,10.26-15.58,15.52-23.27,1.33-1.95,1.37-3.33,0-5.31-5.65-8.24-11.02-16.66-16.66-24.91-3.61-5.27-3.61-10.28-.02-15.55,5.47-8.04,10.64-16.28,16.21-24.24,1.87-2.67,1.67-4.49-.1-7.05-5.47-7.88-10.65-15.95-15.96-23.93-4.34-6.52-3.91-11.67,1.58-17.19,14.95-15.01,29.92-30.01,44.91-44.98,5.71-5.71,10.82-6.2,17.5-1.78,8.11,5.37,16.26,10.67,24.23,16.24,2.41,1.68,4.05,1.49,6.34-.1,8-5.53,16.19-10.78,24.21-16.27,5.26-3.59,10.32-3.62,15.58-.05,8.27,5.61,16.65,11.04,24.89,16.69,1.97,1.35,3.4,1.3,5.33-.02,7.92-5.41,15.95-10.65,23.91-16,6.61-4.45,10.68-4.5,17.21-.13,7.86,5.26,15.82,10.37,23.58,15.78,2.51,1.75,4.24,1.59,6.68-.09,7.99-5.54,16.15-10.83,24.26-16.2,6.28-4.16,11.56-3.72,16.89,1.59,15.2,15.14,30.35,30.33,45.48,45.54,5.11,5.14,5.66,10.55,1.69,16.6-5.48,8.35-10.98,16.69-16.66,24.91-1.55,2.24-1.47,3.82.05,6.03,5.52,8,10.83,16.15,16.24,24.23,3.88,5.8,3.93,10.08.1,15.87-5.51,8.33-10.97,16.7-16.6,24.95-1.33,1.95-1.38,3.33-.02,5.31,5.65,8.23,11.03,16.66,16.7,24.89,3.65,5.3,3.49,10.34-.02,15.57-5.42,8.07-10.66,16.26-16.18,24.27-1.68,2.43-1.84,4.18-.09,6.7,5.47,7.87,10.64,15.96,15.97,23.93,4.58,6.86,4.14,11.97-1.7,17.82-14.78,14.81-29.55,29.62-44.35,44.41-6.05,6.04-11.07,6.5-18.14,1.79-7.98-5.32-16.01-10.57-23.9-16.02-2.19-1.51-3.74-1.65-6-.09-7.99,5.54-16.14,10.85-24.22,16.25-5.95,3.97-10.28,3.97-16.22,0-8.2-5.47-16.44-10.88-24.57-16.45-1.96-1.34-3.4-1.3-5.34.03-7.91,5.42-15.94,10.67-23.9,16.03-6.62,4.45-10.68,4.48-17.21.11-7.75-5.19-15.62-10.2-23.23-15.58-2.78-1.97-4.7-1.73-7.35.13-7.75,5.41-15.7,10.55-23.58,15.78-6.71,4.45-11.84,4-17.52-1.67-15.09-15.06-30.22-30.09-45.12-45.33-2.28-2.33-3.48-5.7-5.24-8.7Z" fill="#531819"/>
        </g>
      `;
      mainSvg.appendChild(g);
    }

    // Update era label from ANTIKE → MITTELALTER
    const lblYear = document.getElementById('lbl-year');
    let labelSet = false;

    let floatTween = null;

    function startFloat() {
      if (floatTween) floatTween.kill();
      floatTween = gsap.to('#mittelalter-grp', { y: -5, duration: 2.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }
    function stopFloat() {
      if (floatTween) { floatTween.kill(); floatTween = null; gsap.set('#mittelalter-grp', { y: 0 }); }
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-mittelalter',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onEnter() {
          startFloat();
          if (!labelSet && lblYear) {
            labelSet = true;
            gsap.timeline()
              .to(lblYear, { scale: 1.6, duration: 0.25, ease: 'power2.out', transformOrigin: 'right top' })
              .call(() => { lblYear.textContent = 'MITTELALTER'; })
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
            lblYear.textContent = 'ANTIKE';
          }
        },
      },
    });

    textIn(tl, '#st-ch7-mittelalter-left',  0.15);
    textIn(tl, '#st-ch7-mittelalter-right', 0.15);
    tl.to('#mittelalter-grp', { opacity: 1, duration: 0.15, ease: 'power2.out' }, 0.15);

    textOut(tl, '#st-ch7-mittelalter-left',  0.82);
    textOut(tl, '#st-ch7-mittelalter-right', 0.82);
    tl.to('#mittelalter-grp', { opacity: 0, duration: 0.10, ease: 'power2.in' }, 0.82);
  },
};
