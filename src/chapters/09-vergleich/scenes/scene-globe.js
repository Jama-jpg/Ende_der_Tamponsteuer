/* 3D rotating globe showing period-product VAT rates worldwide.
   Uses a sinusoidal projection to simulate 3D rotation driven by scroll. */

import { COUNTRIES, rateColor, rateLabel } from '../globe-data.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const CX = 775, CY = 281, R = 185;

function toRad(deg) { return deg * Math.PI / 180; }

/* Project lat/lon + rotation offset onto SVG coords.
   Returns { x, y, visible, scale } */
function project(lat, lon, lonOffset) {
  const latR = toRad(lat);
  const lonR = toRad(lon + lonOffset);
  const cosLat = Math.cos(latR);
  const x = CX + R * cosLat * Math.sin(lonR);
  const y = CY - R * Math.sin(latR);
  const z = cosLat * Math.cos(lonR); // z>0 = facing viewer
  const scale = Math.max(0.2, (z + 1) / 2);
  return { x, y, visible: z > -0.15, scale };
}

export default {
  id: 's-ch9-globe',
  height: '350vh',
  skipSnapStart: true,

  overlay: {
    id: 'st-ch9-globe',
    html: `
      <p class="sl">INTERNATIONALER VERGLEICH</p>
      <p class="sh">Der Blick<br>auf die Welt</p>
      <p class="sl">MwSt. auf Periodenprodukte 2026</p>
    `,
  },

  init({ gsap, ScrollTrigger }) {
    const globeGrp   = document.getElementById('globe-grp');
    const latsGrp    = document.getElementById('globe-lats');
    const lonsGrp    = document.getElementById('globe-lons');
    const markersGrp = document.getElementById('globe-markers');
    const labelsGrp  = document.getElementById('globe-labels');
    const legendGrp  = document.getElementById('globe-legend');

    // ── Build latitude lines ─────────────────────────────────────
    [-60, -30, 0, 30, 60].forEach(lat => {
      const ry = R * Math.abs(Math.cos(toRad(lat)));
      const yPos = CY - R * Math.sin(toRad(lat));
      const el = document.createElementNS(SVG_NS, 'ellipse');
      el.setAttribute('cx', CX); el.setAttribute('cy', yPos);
      el.setAttribute('rx', ry); el.setAttribute('ry', ry * 0.2);
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', '#C9C9C0'); el.setAttribute('stroke-width', '0.4');
      latsGrp.appendChild(el);
    });

    // ── Build longitude lines (as thin ellipses rotated) ─────────
    for (let lon = 0; lon < 180; lon += 30) {
      const el = document.createElementNS(SVG_NS, 'ellipse');
      el.setAttribute('cx', CX); el.setAttribute('cy', CY);
      el.setAttribute('rx', 3); el.setAttribute('ry', R);
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', '#C9C9C0'); el.setAttribute('stroke-width', '0.4');
      el.setAttribute('transform', `rotate(${lon},${CX},${CY})`);
      lonsGrp.appendChild(el);
    }

    // ── Build country markers ────────────────────────────────────
    const markerEls = COUNTRIES.map(c => {
      const g = document.createElementNS(SVG_NS, 'g');

      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('r',    '6');
      dot.setAttribute('fill', rateColor(c.rate));
      dot.setAttribute('stroke', 'rgba(255,255,255,0.6)');
      dot.setAttribute('stroke-width', '0.8');
      g.appendChild(dot);

      markersGrp.appendChild(g);
      return { el: g, dot, ...c };
    });

    // ── Build label elements ─────────────────────────────────────
    const labelEls = COUNTRIES.map(c => {
      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('opacity', '0');

      const bg = document.createElementNS(SVG_NS, 'rect');
      bg.setAttribute('rx', '2'); bg.setAttribute('fill', 'rgba(10,10,8,0.75)');
      g.appendChild(bg);

      const txt = document.createElementNS(SVG_NS, 'text');
      txt.setAttribute('class', 'svg-mono');
      txt.setAttribute('font-size', '6.5');
      txt.setAttribute('fill', '#ffffff');
      txt.setAttribute('letter-spacing', '0.8');
      txt.textContent = `${c.name}  ${rateLabel(c.rate)}`;
      g.appendChild(txt);

      labelsGrp.appendChild(g);
      return { el: g, bg, txt, ...c };
    });

    // ── Build legend ─────────────────────────────────────────────
    const legendItems = [
      { label: '0 %',        color: '#5BB85B' },
      { label: 'Reduziert',  color: '#E8B84B' },
      { label: '>10–20 %',   color: '#E8794B' },
      { label: '>20 %',      color: '#D63335' },
    ];
    legendItems.forEach((item, i) => {
      const lx = 560 + i * 100;
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', lx); dot.setAttribute('cy', 500);
      dot.setAttribute('r', '6'); dot.setAttribute('fill', item.color);
      legendGrp.appendChild(dot);

      const txt = document.createElementNS(SVG_NS, 'text');
      txt.setAttribute('x', lx + 10); txt.setAttribute('y', 504);
      txt.setAttribute('class', 'svg-mono'); txt.setAttribute('font-size', '7');
      txt.setAttribute('fill', '#1a1a1a'); txt.setAttribute('letter-spacing', '0.8');
      txt.textContent = item.label;
      legendGrp.appendChild(txt);
    });

    // ── Rotation proxy ───────────────────────────────────────────
    const proxy = { lonOffset: 30 }; // start with Americas visible

    function redraw() {
      markerEls.forEach(m => {
        const p = project(m.lat, m.lon, proxy.lonOffset);
        const g = m.el;
        g.setAttribute('transform', `translate(${p.x},${p.y}) scale(${p.scale.toFixed(3)})`);
        g.setAttribute('opacity', p.visible ? p.scale.toFixed(3) : '0');
      });
    }

    function showLabels(lonOffset) {
      labelEls.forEach(m => {
        const p = project(m.lat, m.lon, lonOffset);
        if (!p.visible || p.scale < 0.5) {
          gsap.to(m.el, { opacity: 0, duration: 0.3 });
          return;
        }
        m.txt.setAttribute('x', p.x + 10);
        m.txt.setAttribute('y', p.y + 4);
        // Rough background sizing
        const w = m.txt.textContent.length * 4.2 + 8;
        m.bg.setAttribute('x', p.x + 7); m.bg.setAttribute('y', p.y - 6);
        m.bg.setAttribute('width', w);   m.bg.setAttribute('height', 11);
        gsap.to(m.el, { opacity: p.scale, duration: 0.4 });
      });
    }

    // Initial draw
    redraw();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s-ch9-globe',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onUpdate(self) {
          redraw();
          // Show labels when rotation slows (last 30%)
          if (self.progress > 0.65) showLabels(proxy.lonOffset);
        },
      },
    });

    tl
      // 0–15%: globe fades in, overlay appears
      .to(globeGrp,             { opacity: 1, duration: 0.15, ease: 'power1.out' }, 0)
      .to('#st-ch9-globe',      { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.05)
      .to(latsGrp,              { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.08)
      .to(lonsGrp,              { opacity: 1, duration: 0.20, ease: 'power1.out' }, 0.10)
      // 15–60%: markers appear + globe rotates ~1.5 turns
      .to(markersGrp,           { opacity: 1, duration: 0.15, ease: 'power1.out' }, 0.15)
      .to(proxy, {
        lonOffset: 30 + 540,   // 1.5 full rotations
        duration: 0.45,
        ease: 'power1.inOut',
        onUpdate: redraw,
      }, 0.15)
      // 60–80%: slow down, rotation eases to centre Europe
      .to(proxy, {
        lonOffset: 30 + 540 - 14, // Europe centred (~lon=0 in front)
        duration: 0.20,
        ease: 'power2.out',
        onUpdate: redraw,
      }, 0.60)
      // 65–85%: labels & legend appear
      .to(labelsGrp,            { opacity: 1, duration: 0.15, ease: 'power1.out' }, 0.65)
      .to(legendGrp,            { opacity: 1, duration: 0.15, ease: 'power1.out' }, 0.70)
      // 88–100%: fade out
      .to('#st-ch9-globe',      { opacity: 0, duration: 0.10, ease: 'power1.in'  }, 0.88)
      .to(globeGrp,             { opacity: 0, duration: 0.10, ease: 'power1.in'  }, 0.90);
  },
};
