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

/* POV circle constants (mirror of core/constants.js) */
const POV_CX = 790;
const POV_CY = 281;
const POV_R  = 180;

const MORPH_DURATION = 900; // ms for tampon → ball animation

function getSVGLayout() {
  const el    = document.getElementById('main-svg');
  const r     = el.getBoundingClientRect();
  const scale = Math.min(r.width / SVG_W, r.height / SVG_H);
  const lbX   = (r.width  - SVG_W * scale) / 2;
  const lbY   = (r.height - SVG_H * scale) / 2;
  return { scale, lbX, lbY };
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
  let   iconBodies   = [];   // { body, type } — pill | pad | undies
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

  /* ── Grow state (balls pack into grid and expand) ────────────── */
  let growFactor    = 0;     // 0 → 1 driven by scroll
  let growEntries   = [];    // { startX, startY, targetX, targetY }
  let growBaseR     = 0;
  let growTargetR   = 0;

  /* ── Converge state (25 balls → 1 big ball at POV position) ──── */
  let convergeFactor = 0;    // 0 → 1 driven by scroll (after grow phase)

  /* ── Offscreen canvases for metaball converge effect ────────── */
  const grayCanvas  = document.createElement('canvas');
  const colorCanvas = document.createElement('canvas');
  grayCanvas.width  = colorCanvas.width  = W;
  grayCanvas.height = colorCanvas.height = H;
  const grayCtx  = grayCanvas.getContext('2d');
  const colorCtx = colorCanvas.getContext('2d');

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

    /* Morphed balls — "1000€" text (only before freeze/grow takes over) */
    if (ballBodies.length && !growEntries.length) {
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

    /* Balls animate into packed grid and grow (growFactor 0 → 1).
       Also handles the frozen state (growFactor=0) so text is visible
       as soon as the scene enters and freeze() has been called. */
    if (growEntries.length && convergeFactor === 0) {
      /* smoothstep for position, linear for radius */
      const pt   = growFactor * growFactor * (3 - 2 * growFactor);
      const drawR = growBaseR + (growTargetR - growBaseR) * growFactor;
      const fs    = Math.max(8, Math.round(drawR * 0.28));
      ctx.save();
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      for (const e of growEntries) {
        const x = e.startX + (e.targetX - e.startX) * pt;
        const y = e.startY + (e.targetY - e.startY) * pt;
        ctx.beginPath();
        ctx.arc(x, y, drawR, 0, Math.PI * 2);
        ctx.fillStyle = '#D63335';
        ctx.fill();
        ctx.font      = `bold ${fs}px dm-mono, monospace`;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('1000€', x, y);
      }
      ctx.restore();
    }

    /* 25 balls converge into one big red ball — fluid metaball effect */
    if (growEntries.length && convergeFactor > 0) {
      const { scale: sc, lbX: lx, lbY: ly } = getSVGLayout();
      const centerX = lx + POV_CX * sc;
      const centerY = ly + POV_CY * sc;
      const bigR    = POV_R * sc;

      const pt = convergeFactor * convergeFactor * (3 - 2 * convergeFactor);

      const cW = canvas.width;
      const cH = canvas.height;
      if (grayCanvas.width !== cW || grayCanvas.height !== cH) {
        grayCanvas.width  = colorCanvas.width  = cW;
        grayCanvas.height = colorCanvas.height = cH;
      }

      /* Blur radius grows as balls converge so gooey necks form naturally */
      const blurR = Math.max(6, growTargetR * (0.3 + 0.7 * pt));

      /* Step 1: draw blurred white circles to grayCanvas */
      grayCtx.clearRect(0, 0, cW, cH);
      grayCtx.filter    = `blur(${blurR.toFixed(1)}px)`;
      grayCtx.fillStyle = 'white';
      for (const e of growEntries) {
        const x = e.targetX + (centerX - e.targetX) * pt;
        const y = e.targetY + (centerY - e.targetY) * pt;
        /* radius grows toward bigR as convergence nears completion */
        const r = growTargetR + (bigR - growTargetR) * Math.pow(pt, 1.5);
        grayCtx.beginPath();
        grayCtx.arc(x, y, r, 0, Math.PI * 2);
        grayCtx.fill();
      }
      grayCtx.filter = 'none';

      /* Step 2: fill colorCanvas with red, then mask it with the
         threshold-contrasted metaball shape (destination-in).
         The contrast filter snaps the blurred alpha gradient into a
         sharp gooey outline and fills gaps between close circles. */
      colorCtx.clearRect(0, 0, cW, cH);
      colorCtx.fillStyle = '#D63335';
      colorCtx.fillRect(0, 0, cW, cH);
      colorCtx.globalCompositeOperation = 'destination-in';
      colorCtx.filter = 'contrast(18)';
      colorCtx.drawImage(grayCanvas, 0, 0);
      colorCtx.filter = 'none';
      colorCtx.globalCompositeOperation = 'source-over';

      /* Step 3: composite metaball onto main canvas */
      ctx.drawImage(colorCanvas, 0, 0);

      /* Step 4: "1000€" fades in on the final merged circle */
      if (pt > 0.82) {
        const textAlpha = (pt - 0.82) / 0.18;
        const mergedR   = growTargetR + (bigR - growTargetR) * Math.pow(pt, 1.5);
        const fs        = Math.max(14, Math.round(mergedR * 0.28));
        ctx.save();
        ctx.globalAlpha  = textAlpha;
        ctx.font         = `bold ${fs}px dm-mono, monospace`;
        ctx.fillStyle    = '#FFFFFF';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('1000€', centerX, centerY);
        ctx.restore();
      }
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

    /* Icon bodies — pill / pad / undies (hidden during grow) */
    if (iconBodies.length && growFactor === 0) {
      const { scale: sc2 } = getSVGLayout();
      for (const { body: b, type } of iconBodies) {
        ctx.save();
        ctx.translate(b.position.x, b.position.y);
        ctx.rotate(b.angle);

        if (type === 'pill') {
          /* White capsule body (drawn by Matter.js). Add red seam + label. */
          const ph = 20 * sc2;
          ctx.strokeStyle = '#D63335';
          ctx.lineWidth   = Math.max(1, 1.5 * sc2);
          ctx.beginPath();
          ctx.moveTo(0, -ph / 2);
          ctx.lineTo(0,  ph / 2);
          ctx.stroke();
          const fs = Math.max(6, Math.round(7 * sc2));
          ctx.font         = `bold ${fs}px dm-mono, monospace`;
          ctx.fillStyle    = '#D63335';
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('SCHMERZ', 0, 0);

        } else if (type === 'pad') {
          /* Red body. Draw wings + label. */
          const pw = 70 * sc2, ph = 25 * sc2;
          const wingW = pw * 0.18, wingH = ph * 0.44;
          ctx.fillStyle = '#D63335';
          ctx.fillRect(-pw / 2 - wingW, -wingH / 2, wingW, wingH);
          ctx.fillRect( pw / 2,         -wingH / 2, wingW, wingH);
          const fs = Math.max(6, Math.round(7 * sc2));
          ctx.font         = `bold ${fs}px dm-mono, monospace`;
          ctx.fillStyle    = '#FFFFFF';
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('BINDE', 0, 0);

        } else {
          /* undies — dark red body. Draw U-arc + label. */
          const bw = 58 * sc2, bh = 34 * sc2;
          const uw = bw * 0.55, uh = bh * 0.42;
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth   = Math.max(1, 1.5 * sc2);
          ctx.beginPath();
          ctx.moveTo(-uw / 2, -uh / 2);
          ctx.quadraticCurveTo(-uw / 2, uh / 2, 0, uh / 2);
          ctx.quadraticCurveTo( uw / 2, uh / 2, uw / 2, -uh / 2);
          ctx.stroke();
          const fs = Math.max(6, Math.round(7 * sc2));
          ctx.font         = `bold ${fs}px dm-mono, monospace`;
          ctx.fillStyle    = '#FFFFFF';
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('WÄSCHE', 0, -bh * 0.2);
        }

        ctx.restore();
      }
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
    grayCanvas.width  = colorCanvas.width  = nW;
    grayCanvas.height = colorCanvas.height = nH;
    Body.setPosition(floor, { x: (sx + nW) / 2,   y: nH + WALL_T / 2 });
    Body.setPosition(wallL,  { x: sx - WALL_T / 2, y: nH / 2 });
    Body.setPosition(wallR,  { x: nW + WALL_T / 2, y: nH / 2 });
  }
  window.addEventListener('resize', onResize);

  /* ── Public API ──────────────────────────────────────────────── */
  return {
    /** Freeze all bodies and compute the target grid for the grow animation. */
    freeze() {
      engine.gravity.y = 0;
      const all = [
        ...tamponBodies,
        ...ballBodies,
        ...iconBodies.map(e => e.body),
        ...coinBodies,
      ];
      all.forEach(b => {
        Body.setStatic(b, true);
        Body.setVelocity(b, { x: 0, y: 0 });
        Body.setAngularVelocity(b, 0);
      });

      if (!ballBodies.length) return;

      /* ── Compute tight grid that fills the right half ──────────── */
      const { lbX: lx, scale: sc } = getSVGLayout();
      const spineX = lx + 500 * sc;
      const availW = window.innerWidth  - spineX;
      const availH = window.innerHeight;
      const n      = ballBodies.length;

      /* Choose cols so the grid aspect ratio matches the available area */
      const cols = Math.round(Math.sqrt(n * (availW / availH)));
      const rows = Math.ceil(n / cols);

      const colSpacing = availW / cols;
      const rowSpacing = availH / rows;

      /* Radius: largest that fits without overlap, with a hair of breathing room */
      growBaseR   = 40 * sc;
      growTargetR = Math.min(colSpacing, rowSpacing) / 2 * 0.98;

      /* Build target positions row-major, centred in each cell */
      const targets = [];
      for (let row = 0; row < rows && targets.length < n; row++) {
        for (let col = 0; col < cols && targets.length < n; col++) {
          targets.push({
            x: spineX + colSpacing * (col + 0.5),
            y: rowSpacing * (row + 0.5),
          });
        }
      }

      /* Assign each ball to the nearest target (greedy by sorted row then x) */
      const rowH = availH / rows;
      const sorted = [...ballBodies].sort((a, b) => {
        const ra = Math.floor(a.position.y / rowH);
        const rb = Math.floor(b.position.y / rowH);
        return ra !== rb ? ra - rb : a.position.x - b.position.x;
      });

      growEntries = sorted.map((b, i) => ({
        startX:  b.position.x,
        startY:  b.position.y,
        targetX: targets[i].x,
        targetY: targets[i].y,
      }));

      /* Hide original body renders — custom afterRender takes over */
      ballBodies.forEach(b => { b.render.opacity = 0; });
      iconBodies.forEach(e => { e.body.render.opacity = 0; });
    },

    /** Drive the grow animation (0 = original positions, 1 = full grid). */
    setGrowFactor(t) {
      growFactor = t;
    },

    /** Drive the convergence animation (0 = grid, 1 = single big ball at POV). */
    setConvergeFactor(t) {
      convergeFactor = t;
    },

    /** Animate each tampon pill morphing into a 1000€ red ball,
     *  then drop `extraBalls` additional balls from the top. */
    morph({ extraBalls = 0, extraSpawnMs = 400 } = {}) {
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

        /* Drop extra balls from above */
        for (let i = 0; i < extraBalls; i++) {
          const et = setTimeout(() => {
            const { scale: sc2, lbX: lx } = getSVGLayout();
            const r2      = 40 * sc2;
            const sx      = lx + 500 * sc2;
            const margin  = r2 + 8;
            const bx      = sx + margin + Math.random() * (window.innerWidth - sx - 2 * margin);
            const by      = -(r2 * 2 + 10 + Math.random() * 60);
            const b = Bodies.circle(bx, by, r2, {
              restitution:    0.1,
              friction:       0.9,
              frictionAir:    0.03,
              label:          'ball1000',
              render:         { fillStyle: '#D63335', strokeStyle: 'transparent', lineWidth: 0 },
            });
            Composite.add(world, b);
            ballBodies.push(b);
          }, i * extraSpawnMs + Math.random() * 80);
          timers.push(et);
        }

        morphDone      = true;
        morphStartTime = null;
      }, MORPH_DURATION);
      timers.push(t);
    },

    /** Drop countPerType each of: pill (Schmerzmittel), pad (Binde), undies (Unterwäsche). */
    addIcons(countPerType = 5, spawnMs = 280) {
      const types = ['pill', 'pad', 'undies'];
      const queue = [];
      for (let i = 0; i < countPerType; i++) {
        for (const t of types) queue.push(t);
      }
      /* Shuffle */
      for (let i = queue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [queue[i], queue[j]] = [queue[j], queue[i]];
      }

      queue.forEach((type, idx) => {
        const t = setTimeout(() => {
          const { scale: sc, lbX: lx } = getSVGLayout();
          const sx = lx + 500 * sc;

          let body;
          if (type === 'pill') {
            const bw = 52 * sc, bh = 20 * sc;
            const margin = bw / 2 + 8;
            const x = sx + margin + Math.random() * (window.innerWidth - sx - 2 * margin);
            const y = -(bh + 10 + Math.random() * 50);
            body = Bodies.rectangle(x, y, bw, bh, {
              angle:          (Math.random() - 0.5) * Math.PI * 0.4,
              chamfer:        { radius: bh * 0.46 },
              restitution:    0.1,
              friction:       0.8,
              frictionAir:    0.04,
              label:          'icon-pill',
              render:         { fillStyle: '#FFFFFF', strokeStyle: '#D63335', lineWidth: Math.max(1, 2 * sc) },
            });
          } else if (type === 'pad') {
            const bw = 70 * sc, bh = 25 * sc;
            const margin = bw / 2 + 8;
            const x = sx + margin + Math.random() * (window.innerWidth - sx - 2 * margin);
            const y = -(bh + 10 + Math.random() * 50);
            body = Bodies.rectangle(x, y, bw, bh, {
              angle:          (Math.random() - 0.5) * Math.PI * 0.3,
              chamfer:        { radius: bh * 0.28 },
              restitution:    0.1,
              friction:       0.8,
              frictionAir:    0.04,
              label:          'icon-pad',
              render:         { fillStyle: '#D63335', strokeStyle: 'transparent', lineWidth: 0 },
            });
          } else {
            const bw = 58 * sc, bh = 34 * sc;
            const margin = bw / 2 + 8;
            const x = sx + margin + Math.random() * (window.innerWidth - sx - 2 * margin);
            const y = -(bh + 10 + Math.random() * 50);
            body = Bodies.rectangle(x, y, bw, bh, {
              angle:          (Math.random() - 0.5) * Math.PI * 0.3,
              chamfer:        { radius: bh * 0.38 },
              restitution:    0.1,
              friction:       0.8,
              frictionAir:    0.04,
              label:          'icon-undies',
              render:         { fillStyle: '#531416', strokeStyle: 'transparent', lineWidth: 0 },
            });
          }

          Composite.add(world, body);
          iconBodies.push({ body, type });
        }, idx * spawnMs + Math.random() * 80);
        timers.push(t);
      });
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
