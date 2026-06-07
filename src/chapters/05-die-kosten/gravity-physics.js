/* ═══════════════════════════════════════════════════════════════════
   GRAVITY PHYSICS — Chapter 5 (canvas-based, scroll-independent)

   Creates a position:fixed <canvas> rendered by Matter.js Render.
   The physics simulation runs on its own RAF loop (Matter.js Runner),
   completely decoupled from the page scroll.

   Layout:
     Left wall  = SVG spine (x = 500 SVG units → screen px)
     Right wall = right edge of viewport
     Floor      = bottom of viewport

   Bodies:
     Tampons  — chamfered rectangles (pill shape), #D63335,
                drawn with "1000" label + wavy cord in afterRender
     Coins    — circles, #531416, with a drawn '€' label
═══════════════════════════════════════════════════════════════════ */
import Matter from 'matter-js';

const { Engine, Render, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;

const SVG_W  = 1000;
const SVG_H  = 562;
const WALL_T = 60;

function getSVGLayout() {
  const el    = document.getElementById('main-svg');
  const r     = el.getBoundingClientRect();
  const scale = Math.min(r.width / SVG_W, r.height / SVG_H);
  const lbX   = (r.width - SVG_W * scale) / 2;
  return { scale, lbX };
}

function seededRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

/**
 * Creates a self-contained Matter.js physics world rendered on a
 * fixed canvas overlay.  The caller is responsible for calling
 * destroy() when the section leaves the viewport.
 *
 * @returns {{ addCoins(n, spawnMs): { remove() }, destroy() }}
 */
export function createPhysicsWorld({ tamponCount = 20, spawnIntervalMs = 300 } = {}) {
  const W = window.innerWidth;
  const H = window.innerHeight;

  /* Fixed canvas overlay — sits above #main-svg (z-index: 10).
     Explicit CSS width/height prevent sizing issues in some browsers. */
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    `position:fixed;top:0;left:0;width:${W}px;height:${H}px;` +
    `z-index:20;pointer-events:auto;cursor:grab;`;
  document.body.appendChild(canvas);

  const engine = Engine.create({ gravity: { x: 0, y: 1 }, enableSleeping: true });
  const world  = engine.world;

  const render = Render.create({
    canvas,
    engine,
    options: {
      width:      W,
      height:     H,
      pixelRatio: window.devicePixelRatio || 1,
      wireframes: false,
      background: 'transparent',
    },
  });

  /* ── Walls ──────────────────────────────────────────────────── */
  const { scale, lbX } = getSVGLayout();
  const spineX = lbX + 500 * scale;

  const floor = Bodies.rectangle(
    (spineX + W) / 2, H + WALL_T / 2, W - spineX + WALL_T * 2, WALL_T,
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

  /* ── Shared spawn-queue (one beforeUpdate handler for all batches) ── */
  const spawnQueues = [];

  Events.on(engine, 'beforeUpdate', (ev) => {
    for (const q of spawnQueues) {
      if (q.released >= q.bodies.length) continue;
      if (q.startTs === null) q.startTs = ev.timestamp;
      const n = Math.floor((ev.timestamp - q.startTs) / q.intervalMs);
      while (q.released < n && q.released < q.bodies.length) {
        Body.setStatic(q.bodies[q.released], false);
        q.released++;
      }
    }
  });

  /* ── Body factory ────────────────────────────────────────────── */
  const rand = seededRng(42);

  function makeBodies(count, isTampon) {
    const { scale: sc, lbX: lx } = getSVGLayout();
    const sx   = lx + 500 * sc;
    const bw   = 80 * sc;
    const bh   = 28 * sc;
    const cr   = 22 * sc;
    const out  = [];

    for (let i = 0; i < count; i++) {
      const margin = (isTampon ? bw : cr) / 2 + 8;
      const x = sx + margin + rand() * (window.innerWidth - sx - 2 * margin);
      const y = -(40 + rand() * 60);

      const body = isTampon
        ? Bodies.rectangle(x, y, bw, bh, {
            angle:          (rand() - 0.5) * Math.PI * 0.6,
            chamfer:        { radius: bh * 0.46 },
            isStatic:       true,
            restitution:    0.05,
            friction:       0.9,
            frictionAir:    0.04,
            frictionStatic: 0.8,
            label:          'tampon',
            render:         { fillStyle: '#D63335', strokeStyle: '#531416', lineWidth: 1.5 },
          })
        : Bodies.circle(x, y, cr, {
            isStatic:       true,
            restitution:    0.05,
            friction:       0.9,
            frictionAir:    0.03,
            label:          'coin',
            render:         { fillStyle: '#531416', strokeStyle: '#D63335', lineWidth: 1.5 },
          });
      out.push(body);
    }
    return out;
  }

  /* Spawn initial tampons — kept in outer scope for afterRender */
  let tamponBodies = makeBodies(tamponCount, true);
  Composite.add(world, tamponBodies);
  spawnQueues.push({ bodies: tamponBodies, released: 0, startTs: null, intervalMs: spawnIntervalMs });

  /* ── Coin '€' labels and tampon cord+"1000" drawn after each render ── */
  let coinBodies = [];

  Events.on(render, 'afterRender', () => {
    const ctx = render.context;
    const { scale: sc } = getSVGLayout();

    /* Tampon bodies: draw wavy cord + "1000" text */
    if (tamponBodies.length) {
      const bw      = 80 * sc;
      const bh      = 28 * sc;
      const cordLen = bw * 0.55;
      const textSz  = Math.round(9 * sc);

      ctx.font         = `bold ${textSz}px dm-mono, monospace`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';

      for (const b of tamponBodies) {
        ctx.save();
        ctx.translate(b.position.x, b.position.y);
        ctx.rotate(b.angle);

        /* Wavy cord from the right end of the pill */
        ctx.beginPath();
        ctx.moveTo(bw * 0.5, 0);
        ctx.bezierCurveTo(
          bw * 0.5 + cordLen * 0.3,  -bh * 0.5,
          bw * 0.5 + cordLen * 0.7,   bh * 0.5,
          bw * 0.5 + cordLen,         0,
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
    }

    /* Coin bodies: draw '€' label */
    if (coinBodies.length) {
      const { scale: sc2 } = getSVGLayout();
      const fs = Math.round(7 * sc2);
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

  /* ── Mouse (canvas as hit target; wheel events pass through) ─── */
  const mouse = Mouse.create(canvas);
  /* Remove Matter.js wheel handlers that would call preventDefault,
     blocking the snap-scroll system from receiving wheel events. */
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

  /* ── Runner + Render (both independent of page scroll) ──────── */
  const runner = Runner.create();
  Runner.run(runner, engine);
  Render.run(render);

  /* ── Resize: reposition walls, update canvas size ────────────── */
  function onResize() {
    const { scale: sc, lbX: lx } = getSVGLayout();
    const sx  = lx + 500 * sc;
    const nW  = window.innerWidth;
    const nH  = window.innerHeight;
    canvas.style.width  = nW + 'px';
    canvas.style.height = nH + 'px';
    Render.setSize(render, nW, nH);
    Body.setPosition(floor, { x: (sx + nW) / 2, y: nH + WALL_T / 2 });
    Body.setPosition(wallL,  { x: sx - WALL_T / 2, y: nH / 2 });
    Body.setPosition(wallR,  { x: nW + WALL_T / 2, y: nH / 2 });
  }
  window.addEventListener('resize', onResize);

  /* ── Public API ──────────────────────────────────────────────── */
  return {
    /**
     * Drop `count` coin circles into the live world (scene-25k).
     * Returns a handle with remove() to undo if the user scrolls back.
     */
    addCoins(count = 8, spawnMs = 400) {
      const newBodies = makeBodies(count, false);
      Composite.add(world, newBodies);
      const q = { bodies: newBodies, released: 0, startTs: null, intervalMs: spawnMs };
      spawnQueues.push(q);
      coinBodies = coinBodies.concat(newBodies);

      return {
        remove() {
          Composite.remove(world, newBodies);
          coinBodies = coinBodies.filter(b => !newBodies.includes(b));
          const qi = spawnQueues.indexOf(q);
          if (qi !== -1) spawnQueues.splice(qi, 1);
        },
      };
    },

    destroy() {
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
