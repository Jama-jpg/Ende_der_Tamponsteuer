import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — 1930er  (Chapter 7)
   Left:  Kotex & first tampon / menstrual cup
   Right: Moral panic around tampons
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-1930er',
  height: '500vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-1930er-left-1',
    html: `
      <p class="sl">Zellstoff-Verbandmaterial aus dem Krieg<br>wird zufällig als Binde entdeckt.</p>
      <p class="sl">Die Geburtsstunde von</p>
      <p class="sh">KOTEX.</p>
    `,
  },

  init({ gsap }) {
    const overlaysContainer = document.getElementById('overlays');

    if (!document.getElementById('st-ch7-1930er-left-2')) {
      const ov1 = document.createElement('div');
      ov1.className = 'stext';
      ov1.id = 'st-ch7-1930er-left-2';
      ov1.innerHTML = `
        <p class="sl">1933 erscheint der erste</p>
        <p class="sh">TAMPON</p>
        <p class="sl">mit Papp-Applikator.<br>Gefolgt von der ersten<br>Menstruationstasse.</p>
      `;
      overlaysContainer.appendChild(ov1);
    }

    if (!document.getElementById('st-ch7-1930er-right-1')) {
      const ov2 = document.createElement('div');
      ov2.className = 'stext';
      ov2.id = 'st-ch7-1930er-right-1';
      ov2.innerHTML = `
        <p class="sh">MORALISCHE<br>PANIK</p>
        <p class="sl">bricht aus.<br><br>Religiöse Führer<br>warnen vor Tampons.</p>
      `;
      overlaysContainer.appendChild(ov2);
    }

    if (!document.getElementById('st-ch7-1930er-right-2')) {
      const ov3 = document.createElement('div');
      ov3.className = 'stext';
      ov3.id = 'st-ch7-1930er-right-2';
      ov3.innerHTML = `
        <p class="sl">Sie fürchten den Verlust<br>der weiblichen</p>
        <p class="sh">JUNG-<br>FRÄU-<br>LICHKEIT</p>
        <p class="sl">oder unerlaubte<br>sexuelle Lust.</p>
      `;
      overlaysContainer.appendChild(ov3);
    }

    gsap.set('#st-ch7-1930er-left-1',  { left: '0', right: 'auto' });
    gsap.set('#st-ch7-1930er-left-2',  { left: '0', right: 'auto' });
    gsap.set('#st-ch7-1930er-right-1', { left: 'auto', right: '0' });
    gsap.set('#st-ch7-1930er-right-2', { left: 'auto', right: '0' });

    const lblYear = document.getElementById('lbl-year');
    let labelSet = false;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-1930er',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onEnter() {
          if (!labelSet && lblYear) {
            labelSet = true;
            gsap.timeline()
              .to(lblYear, { scale: 1.6, duration: 0.25, ease: 'power2.out', transformOrigin: 'right top' })
              .call(() => { lblYear.textContent = '1930er'; })
              .to(lblYear, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
          }
        },
        onLeaveBack() {
          labelSet = false;
          if (lblYear) {
            gsap.killTweensOf(lblYear);
            gsap.set(lblYear, { scale: 1 });
            lblYear.textContent = '1896';
          }
        },
      },
    });

    textIn(tl,  '#st-ch7-1930er-left-1',  0.02);
    textIn(tl,  '#st-ch7-1930er-right-1', 0.05);

    textOut(tl, '#st-ch7-1930er-left-1',  0.38);
    textIn(tl,  '#st-ch7-1930er-left-2',  0.45);

    textOut(tl, '#st-ch7-1930er-right-1', 0.50);
    textIn(tl,  '#st-ch7-1930er-right-2', 0.57);

    textOut(tl, '#st-ch7-1930er-left-2',  0.93);
    textOut(tl, '#st-ch7-1930er-right-2', 0.93);
  },
};
