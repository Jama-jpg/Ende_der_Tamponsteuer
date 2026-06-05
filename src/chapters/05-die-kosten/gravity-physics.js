/* ═══════════════════════════════════════════════════════════════════
   INTERACTIVE GRAVITY PHYSICS — Chapter 5
   Matter.js wrapper: items fall from above, stack with real collisions,
   and stay where the user drops them (no snap-back).

   Usage:
     const phys = createGravityPhysics({ items, gsap });
     // items: [{ el, coinPosIdx, isTampon }]

   phys.destroy() — kills engine + RAF loop, resets pointer-events
═══════════════════════════════════════════════════════════════════ */
import Matter from 'matter-js';
import { COIN_POSITIONS, TAMPON_ROTATIONS } from '../../core/constants.js';

const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;

const SVG_W     = 1000;
const SVG_H     = 562;
const ZONE_L    = 514;
const ZONE_R    = 986;
const ZONE_FLOOR= 550;
const WALL      = 400;

/* ── helpers ──────────────────────────────────────────────────── */

function seededRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 4294967296; };
}

/* Convert screen coordinates to SVG viewBox coordinates */
function syncMouseScale(mouse, svgEl) {
  const rect = svgEl.getBoundingClientRect();
  if (!rect.width) return;
  const scale = Math.min(rect.width / SVG_W, rect.height / SVG_H);
  const lbX = (rect.width  - SVG_W * scale) / 2;
  const lbY = (rect.height - SVG_H * scale) / 2;
  mouse.scale.x  = 1 / scale;
  mouse.scale.y  = 1 / scale;
  mouse.offset.x = -lbX;
  mouse.offset.y = -lbY;
}

/* ── main export ──────────────────────────────────────────────── */

/**
 * @param {Object}   opts
 * @param {Array}    opts.items      — [{ el, coinPosIdx, isTampon, isStatic? }]
 *                                    isStatic = true → frozen in place initially
 * @param {Function} opts.gsap
 * @param {number}   [opts.dropSeed]
 * @param {number}   [opts.gravity]  — default 2.0
 */
export function createGravityPhysics({ items, gsap, dropSeed = 12345, gravity = 2.0 }) {
  const svgEl = document.getElementById('main-svg');

  /* Engine ─────────────────────────────────────────────────────── */
  const engine = Engine.create({ gravity: { x: 0, y: gravity } });
  const world  = engine.world;

  /* Static boundaries */
  Composite.add(world, [
    /* floor */
    Bodies.rectangle((ZONE_L + ZONE_R) / 2, ZONE_FLOOR + WALL / 2,
      ZONE_R - ZONE_L + WALL * 2, WALL,
      { isStatic: true, friction: 0.95, frictionStatic: 1.0, label: 'floor' }),
    /* left wall */
    Bodies.rectangle(ZONE_L - WALL / 2, SVG_H / 2,
      WALL, SVG_H * 3,
      { isStatic: true, label: 'wallL' }),
    /* right wall */
    Bodies.rectangle(ZONE_R + WALL / 2, SVG_H / 2,
      WALL, SVG_H * 3,
      { isStatic: true, label: 'wallR' }),
  ]);

  /* Create one physics body per item ───────────────────────────── */
  const rand = seededRng(dropSeed);
  const bodies = [];

  items.forEach(({ coinPosIdx, isTampon, isStatic, cx: initCx, cy: initCy }) => {
    let dropX, dropY;
    if (initCx != null && initCy != null) {
      dropX = initCx;
      dropY = initCy;
    } else {
      const margin = isTampon ? 55 : 30;
      dropX = ZONE_L + margin + rand() * (ZONE_R - ZONE_L - 2 * margin);
      /* Stagger start heights so items arrive well-spaced (one every ~0.4s) */
      dropY = -(180 + bodies.length * 220 + rand() * 80);
    }

    let body;
    if (isTampon) {
      body = Bodies.rectangle(dropX, dropY, 80, 40, {
        angle: TAMPON_ROTATIONS[coinPosIdx] * Math.PI / 180,
        restitution: 0,
        friction: 0.90,
        frictionAir: 0.08,
        frictionStatic: 0.80,
        isStatic: !!isStatic,
      });
    } else {
      body = Bodies.circle(dropX, dropY, 22, {
        restitution: 0.05,
        friction: 0.80,
        frictionAir: 0.05,
        isStatic: !!isStatic,
      });
    }
    body._itemIdx = bodies.length; // index into items[]
    bodies.push(body);
  });
  Composite.add(world, bodies);

  /* Set GSAP transforms for dynamic items to their drop positions.
     Static items (with explicit cx/cy) keep their current visual position. */
  items.forEach(({ el, coinPosIdx, isStatic }, idx) => {
    if (isStatic) return;
    const [cx0, cy0] = COIN_POSITIONS[coinPosIdx];
    const b = bodies[idx];
    gsap.set(el, {
      x: b.position.x - cx0,
      y: b.position.y - cy0,
      rotation: 0,
      transformOrigin: '50% 50%',
      transformBox: 'fill-box',
    });
  });

  /* Mouse constraint for drag-and-drop ───────────────────────── */
  const mouse = Mouse.create(svgEl);
  syncMouseScale(mouse, svgEl);

  const mc = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.14, damping: 0.12 },
  });
  Composite.add(world, mc);

  Events.on(mc, 'startdrag', () => { svgEl.style.cursor = 'grabbing'; });
  Events.on(mc, 'enddrag',   () => { svgEl.style.cursor = 'grab'; });

  /* Enable pointer events on SVG so mouse events reach Matter ── */
  svgEl.style.pointerEvents = 'all';
  svgEl.style.cursor = 'grab';

  /* RAF loop: step engine + sync positions to SVG elements ────── */
  let rafId, lastTs;

  function frame(ts) {
    rafId = requestAnimationFrame(frame);
    const dt = lastTs ? Math.min(ts - lastTs, 50) : 16.67;
    lastTs = ts;

    syncMouseScale(mouse, svgEl);
    Engine.update(engine, dt);

    items.forEach(({ el, coinPosIdx, isTampon, isStatic }, idx) => {
      if (isStatic) return;
      const [cx0, cy0] = COIN_POSITIONS[coinPosIdx];
      const b = bodies[idx];
      const angleDeg = b.angle * 180 / Math.PI;
      /* Compensate for the SVG-attribute rotation baked into pillG */
      const rot = isTampon ? angleDeg - TAMPON_ROTATIONS[coinPosIdx] : angleDeg;

      gsap.set(el, {
        x: b.position.x - cx0,
        y: b.position.y - cy0,
        rotation: rot,
        transformOrigin: '50% 50%',
        transformBox: 'fill-box',
      });
    });
  }

  rafId = requestAnimationFrame(frame);

  /* Public API ─────────────────────────────────────────────────── */
  return {
    bodies,
    engine,

    /* Make a previously-static body dynamic (for deferred activation) */
    activate(idx) {
      Body.setStatic(bodies[idx], false);
    },

    /* Teleport a body to a new (cx, cy) in SVG coords and wake it */
    teleport(idx, cx, cy) {
      Body.setPosition(bodies[idx], { x: cx, y: cy });
      Body.setVelocity(bodies[idx], { x: 0, y: 0 });
    },

    destroy() {
      cancelAnimationFrame(rafId);
      Events.off(mc);
      Composite.clear(world, false);
      Engine.clear(engine);
      svgEl.style.pointerEvents = '';
      svgEl.style.cursor = '';
    },
  };
}

/* ── Preset builders (convenience) ───────────────────────────── */

/** Build item descriptors for the first N coinEls (tampons for 0-16, coins 17+) */
export function buildItems(coinEls, from = 0, to = coinEls.length, isStatic = false) {
  return coinEls.slice(from, to).map((el, j) => {
    const coinPosIdx = from + j;
    return { el, coinPosIdx, isTampon: coinPosIdx < 17, isStatic };
  });
}
