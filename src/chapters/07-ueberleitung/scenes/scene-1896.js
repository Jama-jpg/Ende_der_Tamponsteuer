import { textIn, textOut } from '../../../core/text-anim.js';

/* ═══════════════════════════════════════════════════════════════════
   SCENE — 1896  (Chapter 7 · Scene 10)
   Left: Lister's Towel — first disposable pad, heavy belts.
   Right: Shame around menstruation, commercial flop.
═══════════════════════════════════════════════════════════════════ */

export default {
  id: 's-ch7-1896',
  height: '400vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch7-1896-left',
    html: `
      <p class="sl">Mit „Lister's Towel" erscheint<br>die erste</p>
      <p class="sh">EINWEGBINDE</p>
      <p class="sl">auf dem Markt. Mangels moderner<br>Klebetechnik muss sie mit schweren</p>
      <p class="sh">GURTEN</p>
      <p class="sl">am Körper fixiert werden.</p>
    `,
  },

  init({ gsap }) {
    const overlaysContainer = document.getElementById('overlays');

    if (!document.getElementById('st-ch7-1896-right-1')) {
      const ov1 = document.createElement('div');
      ov1.className = 'stext';
      ov1.id = 'st-ch7-1896-right-1';
      ov1.innerHTML = `
        <p class="sl">Die</p>
        <p class="sh">SCHAM</p>
        <p class="sl">rund um das Thema ist groß.<br>Über die Periode spricht man<br>im Geschäft nicht offen.<br><br>Diskrete Zettel beim Kauf<br>ersparen das Aussprechen.<br>Verpackt wird das Produkt<br>unauffällig in neutrales Papier.</p>
      `;
      overlaysContainer.appendChild(ov1);
    }

    if (!document.getElementById('st-ch7-1896-right-2')) {
      const ov2 = document.createElement('div');
      ov2.className = 'stext';
      ov2.id = 'st-ch7-1896-right-2';
      ov2.innerHTML = `
        <p class="sl">Diese Hürden erschweren den Erfolg:<br>Die erste Einwegbinde wird zu einem</p>
        <p class="sh">KOMMER-<br>ZIELLEN<br>FLOP.</p>
      `;
      overlaysContainer.appendChild(ov2);
    }

    gsap.set('#st-ch7-1896-left',    { left: '0', right: 'auto' });
    gsap.set('#st-ch7-1896-right-1', { left: 'auto', right: '0' });
    gsap.set('#st-ch7-1896-right-2', { left: 'auto', right: '0' });

    const lblYear = document.getElementById('lbl-year');
    let labelSet = false;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch7-1896',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onEnter() {
          if (!labelSet && lblYear) {
            labelSet = true;
            gsap.timeline()
              .to(lblYear, { scale: 1.6, duration: 0.25, ease: 'power2.out', transformOrigin: 'right top' })
              .call(() => { lblYear.textContent = '1896'; })
              .to(lblYear, { scale: 1, duration: 0.3, ease: 'power2.inOut' });
          }
        },
        onLeaveBack() {
          labelSet = false;
          if (lblYear) {
            gsap.killTweensOf(lblYear);
            gsap.set(lblYear, { scale: 1 });
            lblYear.textContent = '19. JAHRHUNDERT';
          }
        },
      },
    });

    textIn(tl, '#st-ch7-1896-left',    0.02);
    textIn(tl, '#st-ch7-1896-right-1', 0.05);

    textOut(tl, '#st-ch7-1896-right-1', 0.45);
    textIn(tl,  '#st-ch7-1896-right-2', 0.55);

    textOut(tl, '#st-ch7-1896-left',    0.93);
    textOut(tl, '#st-ch7-1896-right-2', 0.93);
  },
};
