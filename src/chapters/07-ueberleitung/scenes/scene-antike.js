import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — Antike  (Chapter 7 · Scene 7)
   Left:  Stoffrolle SVG (top-left, rotated) + text about materials
   Right: Naturschwamm SVG (center-lower) + text about body stigma
   Era label transitions from STEINZEIT → ANTIKE
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-antike',
  height: '300vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-antike-left',
    html: `
      <p class="sl">In der Antike<br>nahm man sich unter anderem</p>
      <p class="sh">Stoffrollen,<br>Naturschwämme</p>
      <p class="sl">zur Hilfe</p>
    `,
  },

  init({ gsap }) {
    const overlaysContainer = document.getElementById('overlays');

    if (!document.getElementById('st-ch7-antike-right')) {
      const ov = document.createElement('div');
      ov.className = 'stext';
      ov.id = 'st-ch7-antike-right';
      ov.innerHTML = `
        <p class="sl">Gleichzeitig gilt der<br>weibliche Körper als</p>
        <p class="sh">Fehlerhaft.<br>Als zu »feucht«.</p>
        <p class="sl">Ohne die Blutung/<br>Entwässerung<br>drohe der Wahnsinn.</p>
      `;
      overlaysContainer.appendChild(ov);
    }

    gsap.set('#st-ch7-antike-left',  { left: '0', right: 'auto' });
    gsap.set('#st-ch7-antike-right', { left: 'auto', right: '0' });

    const mainSvg = document.getElementById('main-svg');
    if (!document.getElementById('antike-grp')) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.id = 'antike-grp';
      g.setAttribute('opacity', '0');
      g.innerHTML = `
        <!-- STOFFROLLE (Unbenannt-1-07) — upper-left, rotated ~-15° -->
        <!-- Original viewBox 0 0 445.44 405.67, scaled 0.38, center ~(110,100) -->
        <g transform="rotate(-15, 110, 100) translate(28, 28) scale(0.38)">
          <path d="M177.85,346.26c-5.14-30.8-22.17-53.94-44.11-74.04-13.94-12.77-29.16-23.79-46.66-31.32-9.88-4.25-20-7.55-30.89-7.89-.68-.02-1.36-.24-2.44-.44.78-.98,1.23-1.67,1.79-2.24,36.95-37.01,73.9-74.01,110.86-111.02,29.91-29.95,60.07-59.67,89.58-90.01,9.73-10.01,20.58-11.96,33.26-9.36,17.24,3.54,32.24,11.85,46.22,22.12,17.61,12.93,33.05,28,44.25,46.96,5.98,10.13,10.61,20.8,11.28,32.81.39,7.02-1.71,12.88-6.8,17.97-53.62,53.58-107.15,107.25-160.7,160.9-14.34,14.37-28.66,28.77-43,43.15-.76.76-1.59,1.45-2.65,2.42Z" fill="#d23537"/>
          <path d="M158.61,324.26c4.3,9.4,7.37,18.67,6.34,28.8-1.09,10.71-7.96,15.83-18.65,14.15-11.97-1.87-22.46-7.11-31.94-14.37-13.73-10.52-25.83-22.54-31.78-39.31-1.44-4.06-2.05-8.61-2.03-12.93.02-4.88,2.79-7.26,7.69-6.81,4.17.38,8.24,1.83,12.36,2.81.19.54.38,1.07.57,1.61-1.92,1.64-3.86,3.26-5.75,4.93-4.8,4.23-6.07,9.74-4.12,15.45,5.36,15.76,16.65,25.43,32.57,29.73,5.89,1.59,10.94-.69,15.15-4.71,5.6-5.35,10.99-10.93,16.48-16.4.94-.94,1.92-1.83,3.12-2.97Z" fill="#d23537"/>
          <path d="M96.46,282.31c4.47-4.63,8.81-9.12,13.38-13.84,16.83,12.09,31.22,26.47,42.14,43.81-3.74,3.64-7.4,7.2-11.07,10.77-8.25-19.92-23.82-33.2-44.45-40.75Z" fill="#d23537"/>
          <path d="M111.54,304.29c8.32,6.65,15.05,14.02,17.89,24.11.66,2.34-.2,5.11-.37,7.69-2.47-.35-5.22-.13-7.37-1.15-7.69-3.68-13.96-9.06-17.92-16.81-1.5-2.94-1.58-5.48,1.35-7.76,2.21-1.72,4.1-3.85,6.42-6.07Z" fill="#d23537"/>
        </g>

        <!-- NATURSCHWAMM (Unbenannt-1-06) — center lower-left -->
        <!-- Original viewBox 0 0 445.44 405.67, scaled 0.38, center ~(245,440) -->
        <g transform="translate(162, 372) scale(0.38)">
          <path d="M120.02,184.3c3.88,13.15,11.81,20.71,25.41,20.38,10.25-.25,18.58-7.02,21.83-16.79,3.42-10.29-.07-19.76-9.94-27.84,14.52-15.31,29.07-30.64,43.07-45.39,3.26,2.15,6.74,5.41,10.86,6.83,3.13,1.08,7.31.54,10.61-.54,6.05-1.98,10.17-9.1,9.75-15.2-.58-8.36-5.46-13.62-14.81-15.95-.1-.25-.34-.6-.26-.75,5.76-10.31,11.08-20.9,17.44-30.82,10.85-16.91,27.21-23.38,46.89-19.22,5.36,1.13,10.59,2.9,16.42,4.53-9.55,9.85-12.28,20.39-6.44,32.18,4.64,9.36,12.77,14.13,23.04,13.94,13.35-.25,21.31-8.06,25.48-21.2,6.31,5.68,12.51,10.75,18.13,16.41,17.75,17.84,32.84,37.69,42,61.29,3.37,8.69,5.42,18.25,6.1,27.55,1.19,16.32-6.77,28.64-20.47,37.07-13.28,8.17-27.11,15.48-40.23,23.88-29.24,18.72-53.59,42.6-73.19,71.29-.73,1.07-1.51,2.11-2.79,3.88-2.06-10.51-7.2-17.94-17-21.35-5.79-2.02-11.56-1.38-17.1.95-11.33,4.77-17.01,17.45-13.36,29.49,3.92,12.95,15.89,18.93,31.53,15.77-10.55,27.21-27.33,43.78-59.97,36.21-16.8-3.9-31.47-12.31-45.37-22.04-29.24-20.48-52.18-46.49-67.47-78.92-4.82-10.23-8.2-20.9-8.41-32.35-.25-14.22,4.66-26.35,16.43-34.46,10.02-6.9,20.95-12.48,31.81-18.83ZM344.61,143.29c-13.17-.01-24.13,10.72-24.17,23.66-.05,13.75,10.61,24.72,24.06,24.74,13.05.03,24.1-10.83,24.16-23.75.07-13.74-10.56-24.64-24.05-24.66ZM149.25,254.86c-8.96-.13-16.32,7.02-16.36,15.9-.04,9.13,6.84,16.21,15.88,16.35,8.71.13,16.18-6.85,16.49-15.42.33-9.03-6.97-16.7-16.01-16.83ZM275.58,179c-.07-7.7-6.66-14.32-14.2-14.27-7.56.05-14.19,6.81-14.09,14.36.1,7.8,6.54,14.23,14.19,14.19,7.7-.04,14.17-6.59,14.1-14.28Z" fill="#531819"/>
        </g>
      `;
      mainSvg.appendChild(g);
    }

    // Update era label from STEINZEIT → ANTIKE
    const lblYear = document.getElementById('lbl-year');
    let labelSet = false;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-antike',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onEnter() {
          if (!labelSet && lblYear) {
            labelSet = true;
            gsap.timeline()
              .to(lblYear, { scale: 1.6, duration: 0.25, ease: 'power2.out', transformOrigin: 'right top' })
              .call(() => { lblYear.textContent = 'ANTIKE'; })
              .to(lblYear, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
          }
        },
        onLeaveBack() {
          labelSet = false;
          if (lblYear) {
            gsap.killTweensOf(lblYear);
            gsap.set(lblYear, { scale: 1 });
            lblYear.textContent = 'STEINZEIT';
          }
        },
      },
    });

    textIn(tl, '#st-ch7-antike-left', 0.15);
    textIn(tl, '#st-ch7-antike-right', 0.15);
    tl.to('#antike-grp', { opacity: 1, duration: 0.15, ease: 'power2.out' }, 0.15);

    textOut(tl, '#st-ch7-antike-left', 0.82);
    textOut(tl, '#st-ch7-antike-right', 0.82);
    tl.to('#antike-grp', { opacity: 0, duration: 0.10, ease: 'power2.in' }, 0.82);
  },
};
