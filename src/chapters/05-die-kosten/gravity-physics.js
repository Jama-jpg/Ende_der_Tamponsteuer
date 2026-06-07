/* ═══════════════════════════════════════════════════════════════════
   GRAVITY PHYSICS — Chapter 5 (canvas-based, scroll-independent)

   Setup mirrors the official Matter.js demo pattern:
     - Engine + Render.create({ element: document.body })
     - Canvas repositioned as position:fixed overlay after creation
     - Bodies spawned one-at-a-time via setTimeout (no static/dynamic dance)
     - Custom afterRender draws cord + "1000" text on each tampon body

   Layout:
     Left wall  = SVG spine (x ≈ 500 SVG units → screen px)
     Right wall = right edge of viewport
     Floor      = bottom of viewport
═══════════════════════════════════════════════════════════════════ */
import Matter from 'matter-js';

const {
  Engine, Render, Runner, Bodies, Body, Composite,
  Mouse, MouseConstraint, Events,
} = Matter;

const SVG_W = 1000;
const SVG_H = 562;
const WALL_T = 60;

const MORPH_DURATION = 900; // ms for tampon → ball animation

function getSVGLayout() {
  const el    = document.getElementById('main-svg');
  const r     = el.getBoundingClientRect();
  const scale = Math.min(r.width / SVG_W, r.height / SVG_H);
  const lbX   = (r.width - SVG_W * scale) / 2;
  return { scale, lbX };
}

/**
 * Creates a self-contained Matter.js physics world on a fixed canvas.
 * @returns {{ morph(), destroy() }}
 */
export function createPhysicsWorld({ tamponCount = 17, spawnIntervalMs = 300 } = {}) {
  const W = window.innerWidth;
  const H = window.innerHeight;

  /* ── Engine (mirrors demo: no extra options) ──────────────────── */
  const engine = Engine.create();
  engine.gravity.y = 1;
  const world = engine.world;

  /* ── Render — let Matter.js create and append the canvas ──────── */
  const render = Render.create({
    element: document.body,
    engine,
    options: {
      width:      W,
      height:     H,
      wireframes: false,
      background: 'transparent',
    },
  });

  /* Reposition Matter.js's canvas as a fixed full-viewport overlay */
  const canvas = render.canvas;
  canvas.style.position      = 'fixed';
  canvas.style.top           = '0';
  canvas.style.left          = '0';
  canvas.style.width         = W + 'px';
  canvas.style.height        = H + 'px';
  canvas.style.zIndex        = '20';
  canvas.style.pointerEvents = 'auto';
  canvas.style.cursor        = 'grab';

  /* ── Walls ───────────────────────────────────────────────────── */
  const { scale, lbX } = getSVGLayout();
  const spineX = lbX + 500 * scale;

  const floor = Bodies.rectangle(
    (spineX + W) / 2, H + WALL_T / 2, (W - spineX) + WALL_T * 2, WALL_T,
    { isStatic: true, label: 'floor', render: { visible: false }, friction: 1, restitution: 0 },
  );
  const wallL = Bodies.rectangle(
    spineX - WALL_T / 2, H / 2, WALL_T, H * 4,
    { isStatic: true, label: 'wallL', render: { visible: false }, friction: 1 },
  );
  const wallR = Bodies.rectangle(
    W + WALL_T / 2, H / 2, WALL_T, H * 4,
    { isStatic: true, label: 'wallR', render: { visible: false }, friction: 1 },
  );
  Composite.add(world, [floor, wallL, wallR]);

  /* ── Body factory ────────────────────────────────────────────── */
  function makeBody(type) {
    const { scale: sc, lbX: lx } = getSVGLayout();
    const sx = lx + 500 * sc;

    if (type === 'tampon') {
      const bw     = 120 * sc;
      const bh     = 42 * sc;
      const margin = bw / 2 + 8;
      const x      = sx + margin + Math.random() * (window.innerWidth - sx - 2 * margin);
      const y      = -(bh + 10 + Math.random() * 40);
      return Bodies.rectangle(x, y, bw, bh, {
        angle:          (Math.random() - 0.5) * Math.PI * 0.5,
        chamfer:        { radius: bh * 0.46 },
        restitution:    0.05,
        friction:       0.9,
        frictionAir:    0.04,
        frictionStatic: 0.8,
        label:          'tampon',
        render:         { fillStyle: '#D63335', strokeStyle: 'transparent', lineWidth: 0 },
      });
    }

    if (type === 'ball') {
      const { scale: sc2, lbX: lx2 } = getSVGLayout();
      const sx2 = lx2 + 500 * sc2;
      const cr  = 40 * sc2;
      const margin2 = cr + 8;
      const x2 = sx2 + margin2 + Math.random() * (window.innerWidth - sx2 - 2 * margin2);
      const y2 = -(cr * 2 + 10 + Math.random() * 40);
      return Bodies.circle(x2, y2, cr, {
        restitution:    0.05,
        friction:       0.9,
        frictionAir:    0.03,
        label:          'ball1000',
        render:         { fillStyle: '#D63335', strokeStyle: 'transparent', lineWidth: 0 },
      });
    }

    /* coin */
    const cr     = 22 * sc;
    const margin = cr + 8;
    const x      = sx + margin + Math.random() * (window.innerWidth - sx - 2 * margin);
    const y      = -(cr * 2 + 10 + Math.random() * 40);
    return Bodies.circle(x, y, cr, {
      restitution:    0.05,
      friction:       0.9,
      frictionAir:    0.03,
      label:          'coin',
      render:         { fillStyle: '#531416', strokeStyle: '#D63335', lineWidth: 1.5 },
    });
  }

  /* ── Spawn tampons one at a time with setTimeout ─────────────── */
  const tamponBodies = [];
  let   coinBodies   = [];
  let   ballBodies   = [];
  const timers       = [];

  for (let i = 0; i < tamponCount; i++) {
    const t = setTimeout(() => {
      const b = makeBody('tampon');
      Composite.add(world, b);
      tamponBodies.push(b);
    }, i * spawnIntervalMs + Math.random() * 50);
    timers.push(t);
  }

  /* ── Morph state ─────────────────────────────────────────────── */
  let morphStartTime = null;
  let morphDone      = false;

  /* ── Custom afterRender: cord + text on tampons, text on balls ── */
  Events.on(render, 'afterRender', () => {
    const ctx         = render.context;
    const { scale: sc } = getSVGLayout();
    const bw          = 120 * sc;
    const bh          = 42 * sc;
    const cordLen     = bw * 0.55;
    const textSz      = Math.max(10, Math.round(12 * sc));

    /* Compute morph progress (0 → 1) */
    let morphT = 0;
    if (morphStartTime !== null) {
      morphT = Math.min(1, (Date.now() - morphStartTime) / MORPH_DURATION);
    }

    /* Tampons — cord + "1000" text (fade out during morph) */
    if (tamponBodies.length) {
      const alpha = 1 - morphT;
      ctx.save();
      ctx.globalAlpha  = alpha;
      ctx.font         = `bold ${textSz}px dm-mono, monospace`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';

      for (const b of tamponBodies) {
        ctx.save();
        ctx.translate(b.position.x, b.position.y);
        ctx.rotate(b.angle);

        /* Wavy cord from right end of pill */
        ctx.beginPath();
        ctx.moveTo(bw * 0.5, 0);
        ctx.bezierCurveTo(
          bw * 0.5 + cordLen * 0.3,  -bh * 0.5,
          bw * 0.5 + cordLen * 0.7,   bh * 0.5,
          bw * 0.5 + cordLen,          0,
        );
        ctx.strokeStyle = '#D63335';
        ctx.lineWidth   = Math.max(1.5, 2 * sc);
        ctx.lineCap     = 'round';
        ctx.stroke();

        /* "1000" label */
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('1000', 0, 0);

        ctx.restore();
      }
      ctx.restore();

      /* Growing circle overlay during morph */
      if (morphT > 0) {
        const targetR = 40 * sc;
        const r       = targetR * morphT;
        ctx.save();
        for (const b of tamponBodies) {
          ctx.beginPath();
          ctx.arc(b.position.x, b.position.y, r, 0, Math.PI * 2);
          ctx.fillStyle = '#D63335';
          ctx.fill();

          if (r > 14) {
            const fs = Math.max(8, Math.round(r * 0.32));
            ctx.font         = `bold ${fs}px dm-mono, monospace`;
            ctx.fillStyle    = '#FFFFFF';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.globalAlpha  = morphT;
            ctx.fillText('1000€', b.position.x, b.position.y);
          }
        }
        ctx.restore();
      }
    }

    /* Morphed balls — "1000€" text */
    if (ballBodies.length) {
      const { scale: sc2 } = getSVGLayout();
      const ballR  = 40 * sc2;
      const ballFs = Math.max(9, Math.round(ballR * 0.32));
      ctx.save();
      ctx.font         = `bold ${ballFs}px dm-mono, monospace`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle    = '#FFFFFF';
      for (const b of ballBodies) {
        ctx.fillText('1000€', b.position.x, b.position.y);
      }
      ctx.restore();
    }

    /* Coins */
    if (coinBodies.length) {
      const fs = Math.max(7, Math.round(7 * sc));
      ctx.save();
      ctx.font         = `bold ${fs}px dm-mono, monospace`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle    = '#F4DEDB';
      for (const b of coinBodies) {
        ctx.fillText('€', b.position.x, b.position.y);
      }
      ctx.restore();
    }
  });

  /* ── Mouse drag (wheel events must not block page scroll) ────── */
  const mouse = Mouse.create(canvas);
  ['wheel', 'mousewheel', 'DOMMouseScroll'].forEach(ev => {
    try { canvas.removeEventListener(ev, mouse.mousewheel); } catch (_) {}
  });
  const mc = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, render: { visible: false } },
  });
  Composite.add(world, mc);
  Events.on(mc, 'startdrag', () => { canvas.style.cursor = 'grabbing'; });
  Events.on(mc, 'enddrag',   () => { canvas.style.cursor = 'grab'; });

  /* ── Start (mirrors demo: Render.run first, then Runner.run) ─── */
  Render.run(render);
  const runner = Runner.create();
  Runner.run(runner, engine);

  /* ── Resize ──────────────────────────────────────────────────── */
  function onResize() {
    const { scale: sc, lbX: lx } = getSVGLayout();
    const sx = lx + 500 * sc;
    const nW = window.innerWidth;
    const nH = window.innerHeight;
    canvas.style.width  = nW + 'px';
    canvas.style.height = nH + 'px';
    Render.setSize(render, nW, nH);
    Body.setPosition(floor, { x: (sx + nW) / 2,   y: nH + WALL_T / 2 });
    Body.setPosition(wallL,  { x: sx - WALL_T / 2, y: nH / 2 });
    Body.setPosition(wallR,  { x: nW + WALL_T / 2, y: nH / 2 });
  }
  window.addEventListener('resize', onResize);

  /* ── Public API ──────────────────────────────────────────────── */
  return {
    /** Animate each tampon pill morphing into a 1000€ red ball. */
    morph() {
      if (morphDone || morphStartTime !== null) return;
      morphStartTime = Date.now();

      const t = setTimeout(() => {
        const { scale: sc } = getSVGLayout();
        const ballR = 40 * sc;

        /* Capture live positions/velocities before removing bodies */
        const saved = tamponBodies.map(b => ({
          x:  b.position.x,
          y:  b.position.y,
          vx: b.velocity.x,
          vy: b.velocity.y,
        }));

        /* Remove tampon bodies */
        [...tamponBodies].forEach(b => Composite.remove(world, b));
        tamponBodies.length = 0;

        /* Add ball bodies at tampon positions */
        saved.forEach(({ x, y, vx, vy }) => {
          const b = Bodies.circle(x, y, ballR, {
            restitution:    0.1,
            friction:       0.9,
            frictionAir:    0.03,
            label:          'ball1000',
            render:         { fillStyle: '#D63335', strokeStyle: 'transparent', lineWidth: 0 },
          });
          Body.setVelocity(b, { x: vx, y: vy });
          Composite.add(world, b);
          ballBodies.push(b);
        });

        morphDone      = true;
        morphStartTime = null;
      }, MORPH_DURATION);
      timers.push(t);
    },

    addCoins(count = 8, spawnMs = 400) {
      const newBodies = [];
      for (let i = 0; i < count; i++) {
        const t = setTimeout(() => {
          const b = makeBody('coin');
          Composite.add(world, b);
          newBodies.push(b);
          coinBodies = coinBodies.concat([b]);
        }, i * spawnMs);
        timers.push(t);
      }
      return {
        remove() {
          newBodies.forEach(b => Composite.remove(world, b));
          coinBodies = coinBodies.filter(b => !newBodies.includes(b));
        },
      };
    },

    destroy() {
      timers.forEach(clearTimeout);
      Runner.stop(runner);
      Render.stop(render);
      window.removeEventListener('resize', onResize);
      Events.off(engine);
      Events.off(render);
      Events.off(mc);
      Composite.clear(world, false);
      Engine.clear(engine);
      canvas.remove();
    },
  };
}
