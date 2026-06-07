/* Protest signs rise from below and sway gently.
   All content is rendered in SVG (#protest-grp). */

const SVG_NS = 'http://www.w3.org/2000/svg';

const SIGNS = [
  { x:  80, rot: -8, fill: '#D63335', textColor: '#ffffff', lines: ['BIOLOGIE',   'IST KEIN',   'LUXUS']        },
  { x: 220, rot:  4, fill: '#C9C9C0', textColor: '#1a1a1a', lines: ['MENSTRUATION', 'IST KEINE', 'SCHANDE']     },
  { x: 360, rot: -3, fill: '#D63335', textColor: '#ffffff', lines: ['WER BLUTET', 'ZAHLT KEINE', 'STRAFE']      },
  { x: 500, rot:  6, fill: '#531416', textColor: '#F4DEDB', lines: ['DAS ZIEL',   'IST',         'WÜRDE']       },
  { x: 640, rot: -5, fill: '#D63335', textColor: '#ffffff', lines: ['PERIODENPRODUKTE', 'IN SCHULEN', 'JETZT!'] },
  { x: 780, rot:  3, fill: '#C9C9C0', textColor: '#1a1a1a', lines: ['MENSTRUAL',  'EQUITY',      'NOW']         },
  { x: 920, rot: -7, fill: '#D63335', textColor: '#ffffff', lines: ['0 %', 'MwSt', 'JETZT']                     },
];

const SIGN_W = 110;
const SIGN_H = 80;
const SIGN_TOP_Y = 340; // resting top-y of signs
const STICK_BOT_Y = 530;

export default {
  id: 's-ch10-protest',
  height: '300vh',
  skipSnapStart: true,

  init({ gsap, ScrollTrigger }) {
    const grp = document.getElementById('protest-grp');

    // Build signs
    const signGroups = SIGNS.map(s => {
      const g = document.createElementNS(SVG_NS, 'g');
      // The transform-origin is at the bottom of the stick
      g.setAttribute('transform', `rotate(${s.rot},${s.x},${STICK_BOT_Y})`);
      g.setAttribute('opacity', '0');

      // Stick
      const stick = document.createElementNS(SVG_NS, 'line');
      stick.setAttribute('x1', s.x); stick.setAttribute('y1', SIGN_TOP_Y + SIGN_H);
      stick.setAttribute('x2', s.x); stick.setAttribute('y2', STICK_BOT_Y);
      stick.setAttribute('stroke', '#3a3a32'); stick.setAttribute('stroke-width', '3');
      stick.setAttribute('stroke-linecap', 'round');
      g.appendChild(stick);

      // Sign background
      const bg = document.createElementNS(SVG_NS, 'rect');
      bg.setAttribute('x',      s.x - SIGN_W / 2);
      bg.setAttribute('y',      SIGN_TOP_Y);
      bg.setAttribute('width',  SIGN_W);
      bg.setAttribute('height', SIGN_H);
      bg.setAttribute('rx',     4);
      bg.setAttribute('fill',   s.fill);
      g.appendChild(bg);

      // Text lines
      s.lines.forEach((line, li) => {
        const t = document.createElementNS(SVG_NS, 'text');
        const lineCount = s.lines.length;
        const totalH = lineCount * 20;
        const startY = SIGN_TOP_Y + (SIGN_H - totalH) / 2 + 16 + li * 20;
        t.setAttribute('x',    s.x);
        t.setAttribute('y',    startY);
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('class', 'svg-mono');
        t.setAttribute('font-size', '10');
        t.setAttribute('font-weight', '700');
        t.setAttribute('fill', s.textColor);
        t.setAttribute('letter-spacing', '1');
        t.textContent = line;
        g.appendChild(t);
      });

      grp.appendChild(g);
      return g;
    });

    // Tween helpers for the sway loop (started after entry animation)
    let swayTweens = [];

    function startSway() {
      swayTweens.forEach(t => t.kill());
      swayTweens = signGroups.map((g, i) => {
        const sign = SIGNS[i];
        const baseRot = sign.rot;
        return gsap.to(g, {
          rotate: `${baseRot + (i % 2 === 0 ? 2 : -2)}`,
          svgOrigin: `${sign.x} ${STICK_BOT_Y}`,
          duration: 1.8 + i * 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch10-protest',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onEnter: startSway,
        onEnterBack: startSway,
        onLeave()     { swayTweens.forEach(t => t.pause()); },
        onLeaveBack() { swayTweens.forEach(t => t.pause()); },
      },
    });

    tl
      // Signs rise from below (staggered from centre outward)
      .to(grp, { opacity: 1, duration: 0.05 }, 0)
      .from(signGroups, {
        y: 300,
        opacity: 0,
        duration: 0.30,
        ease: 'power3.out',
        stagger: { each: 0.04, from: 'center' },
      }, 0.05)
      // Hold through most of scroll
      // 88–100%: fade out
      .to(signGroups, { opacity: 0, duration: 0.10, ease: 'power1.in' }, 0.88)
      .to(grp,        { opacity: 0, duration: 0.10, ease: 'power1.in' }, 0.90);
  },
};
