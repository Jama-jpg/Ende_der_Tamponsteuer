import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — 1930er  (Chapter 7)
   Left 1: Kotex text → fades out mid-scroll
   Right:  Moral panic → fades out mid-scroll
   Left 2: Tampon/o.b. text → comes in after, stays for scene-1950er
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-1930er',
  height: '600vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-1930er-left',
    html: `
      <p class="sl">Zellstoff-Verbandmaterial aus dem Krieg<br>wird zufällig als Binde entdeckt.</p>
      <p class="sl">Die Geburtsstunde von</p>
      <p class="sh">KOTEX.</p>
    `,
  },

  init({ gsap }) {
    const overlaysContainer = document.getElementById('overlays');

    if (!document.getElementById('st-ch7-1930er-right')) {
      const ov = document.createElement('div');
      ov.className = 'stext';
      ov.id = 'st-ch7-1930er-right';
      ov.innerHTML = `
        <p class="sh">MORALISCHE<br>PANIK</p>
        <p class="sl">bricht aus.<br>Religiöse Führer warnen vor Tampons.</p>
        <p class="sl">Sie fürchten den Verlust<br>der weiblichen</p>
        <p class="sh">JUNGFRÄU-<br>LICHKEIT</p>
        <p class="sl">oder unerlaubte sexuelle Lust.</p>
      `;
      overlaysContainer.appendChild(ov);
    }

    if (!document.getElementById('st-ch7-1930er-tampon')) {
      const ov = document.createElement('div');
      ov.className = 'stext';
      ov.id = 'st-ch7-1930er-tampon';
      ov.innerHTML = `
        <p class="sl">1933 erscheint der erste</p>
        <p class="sh">TAMPON</p>
        <p class="sl">mit Papp-Applikator.<br>Gefolgt von der ersten Menstruationstasse.</p>
        <p class="sl">Im Jahr 1950 revolutioniert<br>der</p>
        <p class="sh">O.B.-<br>TAMPON</p>
        <p class="sl">den Markt.</p>
      `;
      overlaysContainer.appendChild(ov);
    }

    gsap.set('#st-ch7-1930er-left',   { left: '0', right: 'auto' });
    gsap.set('#st-ch7-1930er-right',  { left: 'auto', right: '0' });

    const lblYear = document.getElementById('lbl-year');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-1930er',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onEnter() {
          if (lblYear) lblYear.textContent = '1930er';
        },
        onLeaveBack() {
          if (lblYear) lblYear.textContent = '1896';
        },
        onUpdate(self) {
          if (lblYear) {
            lblYear.textContent = self.progress > 0.48 ? '1950er' : '1930er';
          }
        },
      },
    });

    // 1930er content
    textIn(tl, '#st-ch7-1930er-left',  0.02);
    textIn(tl, '#st-ch7-1930er-right', 0.05);

    textOut(tl, '#st-ch7-1930er-right', 0.36);
    textOut(tl, '#st-ch7-1930er-left',  0.40);

    // Tampon text follows within the same scene — stays visible, no textOut here
    textIn(tl, '#st-ch7-1930er-tampon', 0.52);
  },
};
