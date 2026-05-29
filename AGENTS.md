# AGENTS.md — Architecture & contributor guide

This file is the contract for working on this codebase. Read it before adding or
changing scenes. The goal of the architecture is that **a scene is the only unit you
touch** to add narrative — the engine and stage stay generic.

## Mental model

```
chapters (registry, ordered)
  └── chapter = { id, title, scenes: [...] }
        └── scene = one scroll-driven step
              ├── a <section> scroll spacer (id + height)
              ├── an optional fixed text overlay
              └── init(ctx) — its GSAP timeline against shared stage elements
```

The **stage** ([src/stage/](src/stage/)) is a single persistent SVG canvas + fixed UI
layer shared by every scene. Scenes do **not** create their own shapes for the main
canvas; they animate the long-lived elements built once by `buildStage` and handed out
via `ctx.stage.refs`. This is deliberate — the central circle, rect and lines morph
*across* scenes, so they must persist.

## Boot order (`src/main.js`)

1. `gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)`, force scroll to top, set
   `history.scrollRestoration = 'manual'`.
2. `buildStage(mount, gsap)` → injects markup, generates procedural shapes (period dots,
   12 month circles, pie arcs, 456 lines), applies the initial hidden state, returns `refs`.
3. Flatten `chapters.flatMap(c => c.scenes)`. For each scene, append a `<section>` to
   `#scroller` and (if present) an overlay `<div class="stext">` to `#overlays`.
4. Create controllers, build `ctx`, then call `scene.init?.(ctx)` for every scene.

## The Scene contract

A scene module **default-exports a plain object**:

```js
export default {
  id: 's4',            // REQUIRED. Becomes <section id="s4">; use it as the ScrollTrigger trigger.
  height: '250vh',     // REQUIRED. Scroll spacer height (drives how long the scene lasts).
  overlay: {           // OPTIONAL. Injected as <div class="stext" id="...">.
    id: 'st5',
    html: `<p class="sl">…</p><p class="sh">1,9 MILLIARDEN</p>`,
  },
  init(ctx) {          // OPTIONAL. Wire the scene's animation here. Omit for a pure spacer.
    // ...
  },
};
```

- `id`s are conventionally `s1, s2, …` and overlay ids `st3, st5, …`. Keep them unique.
- A scene with no `init` is a **pure scroll spacer** (e.g. the s2 title-transition, whose
  animation is auto-played from the countdown scene while scrolling is locked).
- Overlay copy uses two text classes: `.sl` (small mono label) and `.sh` (large serif).

## The `ctx` passed to `init`

| Field | What it is |
| --- | --- |
| `ctx.gsap` | The GSAP instance (already has ScrollTrigger + ScrollToPlugin). |
| `ctx.ScrollTrigger` | The ScrollTrigger class, for standalone `ScrollTrigger.create(...)`. |
| `ctx.stage.refs` | All persistent stage element handles (see below). |
| `ctx.helpers` | `makeSvgEl`, `polarToCartesian`, `sectorPath` from [src/core/svg.js](src/core/svg.js). |
| `ctx.constants` | Geometry + palette from [src/core/constants.js](src/core/constants.js). |
| `ctx.controllers` | `{ glitch, wave, pulse }` — cross-scene animation controllers (see below). |
| `ctx.shared` | A mutable bag for cross-scene handles. e.g. `pie-26` publishes `ctx.shared.pie = { enter, leave }` and `jeden-monat` calls `shared.pie.leave()`. |

### `ctx.stage.refs`

UI: `sceneTitle`, `lblGoodNews`, `vatBigEl`, `vatBigNum`, `vatFixed`, `vatNum`, `yearLbl`.
SVG shapes: `cAxis`, `cOutline`, `cSpinner`, `cFill`, `pieBg`, `pieHl`, `pieTxt`,
`mCircles`, `mRect`, `rRect`, `linesGrp`, `periodDots`, `lblXxxx`, `lblPeriode`.
Liquid: `liquidBg`, `liquidWavePath`, `liqStream`, `liqFill`.
Collections: `mcEls` (12 month circles), `lineEls` (456 lines).
Layout anchors: `scroller`, `overlays`.

### `ctx.controllers`

| Controller | Methods | Used by |
| --- | --- | --- |
| `glitch` | `start()`, `stop()`, `setFinal()` | Started in `countdown` (Scene 3), locked in `payoff-7-years` (s13). |
| `wave` | `start()`, `stop()` | Liquid background; started in `countdown`'s entrance, stopped when the countdown completes. |
| `pulse` | `start()`, `stop()` | Breathing circle; toggled by a ScrollTrigger in `blob-pulse` (s4 exit → s6 exit). |

## The Chapter contract

`chapter.js` default-exports `{ id, title, scenes: [scene, …] }`. Scene order within the
array is the scroll order within the chapter.

## The Registry

[src/registry.js](src/registry.js) imports the chapters in order and exports `chapters`.
**This is the single place that defines page order.**

---

## Recipe: add a new scene to an existing chapter

1. Create `src/chapters/<NN-chapter>/scenes/<my-scene>.js` following the Scene contract.
   Give it a fresh `id` (e.g. `s14`) and a `height`.
2. In that scene's `init`, build a scrubbed timeline against `#<id>` and animate
   `ctx.stage.refs.*`. If you need a *new* shape on the canvas, add it to
   [src/stage/markup.js](src/stage/markup.js) and expose a ref in
   [src/stage/index.js](src/stage/index.js) so it persists and is hidden at boot.
3. Import it in the chapter's `chapter.js` and add it to the `scenes` array in the right
   position. Done — the engine lays out the section + overlay and runs `init`.

## Recipe: add a new chapter

1. Create `src/chapters/<NN-name>/chapter.js` and a `scenes/` folder with its scenes.
2. Import the chapter in [src/registry.js](src/registry.js) and insert it into the
   `chapters` array at the desired position.

## Conventions & gotchas

- **Scrubbed scene timelines** use `{ trigger: '#<id>', start: 'top top', end: 'bottom bottom', scrub: 1.5 }`.
- **Cross-scene state** goes through `ctx.shared` or a `ctx.controllers` controller — never module-level globals.
- **`r` attribute vs scale**: animating a circle's `r` and `scale` simultaneously conflicts.
  The pulse uses `scale`; scenes that resize the circle use `attr: { r }`. Keep them separate.
- **Initial hidden state**: anything that should start invisible is set to `opacity: 0` in
  `buildStage` (shapes) or via `.stext { opacity: 0 }` in CSS (overlays). This prevents flashes
  from scroll-restoration races on reload.
- The intro (Scenes 1–2) is **time-driven, not scroll-driven**: scrolling is locked until the
  countdown + S2→S3 transition complete, then `unlockScroll` snaps to `#s3`.
