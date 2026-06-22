# Österreichs Weg zur 0% Tamponsteuer

A scroll-driven data story ("scrollytelling") about Austria's path to abolishing
VAT on period products. As you scroll, a single animated SVG canvas morphs through
a narrative: a VAT counter draining 20 → 0%, the scale of menstruation worldwide
(1.9 billion people, 26% of the world), a lifetime of costs (17 000 products,
≈ €25 000), period poverty in Austria (500 000 affected), and 150 years of
taxation history from the Stone Age to 1973.

Built with **[GSAP](https://gsap.com/) + ScrollTrigger** and bundled with **[Vite](https://vitejs.dev/)**.
The animation code is plain, imperative GSAP — there is no UI framework. Instead the
page is **assembled from chapters, each containing scenes**, so it stays modular and
easy to extend.

## Getting started

```bash
npm install      # install gsap + vite
npm run dev      # start the dev server (opens the browser)
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## How it works

The page is composed at runtime by a small generic **engine** ([src/main.js](src/main.js)):

1. It builds the persistent **stage** — the fixed UI layer, the liquid background and
   the SVG canvas with all long-lived shapes — and collects references to every element.
2. It walks the **chapter registry** ([src/registry.js](src/registry.js)), and for each
   **scene** it lays out a scroll spacer `<section>` and an optional text overlay.
3. It runs each scene's `init(ctx)`, which wires that scene's GSAP timeline against the
   shared stage elements.

A **scene** is one scroll-driven step. A **chapter** is an ordered group of scenes that
forms a narrative section. Adding content means dropping a new scene module into a
chapter — nothing in the engine changes.

> Writing or changing scenes? Read **[AGENTS.md](AGENTS.md)** for the scene/chapter
> contracts and step-by-step recipes.

## Project structure

```
index.html                  Thin shell — Typekit fonts + #app mount + module script
vite.config.js              Vite config (relative base for sub-path hosting)
package.json                Scripts + deps (gsap, vite)
images/                     Static assets

src/
  main.js                   Engine: register GSAP, build stage, assemble scenes
  registry.js               Ordered list of chapters

  core/
    constants.js            Palette + SVG geometry (CX/CY, radii, coin/dot positions)
    svg.js                  makeSvgEl, polarToCartesian, sectorPath
    wave.js                 Liquid wave background controller
    pulse.js                Breathing circle pulse controller
    euro-counter.js         Persistent top-left euro counter (counts 0 → 25 000)
    snap.js                 Scroll-snap engine (wheel/touch → scene edges)
    spine.js                Spine scroll indicator + click/drag seek
    text-anim.js            Shared text animation helpers

  stage/
    markup.js               Persistent #ui / #liquid-bg / #main-svg template
    index.js                buildStage(): inject markup, generate shapes, return refs

  styles/
    base.css                Reset, variables, stage + UI styling
    overlays.css            Scene text overlays (.stext)

  chapters/
    01-intro/               Countdown → title → period axis
    02-the-scale/           Circle grows to 1.9 billion, 26% pie
    03-every-month/         jeden-monat + lifetime sequence (borrows scenes from 04)
    04-the-lifetime/        38 years → 456 lines → 7-year payoff (scenes used by ch3)
    05-die-kosten/          17 000 products, €25 000 lifetime cost, physics coins
    06-periodenarmut/       1.4 M at risk → 500 k period poverty → consequences
    07-ueberleitung/        Balance scale (VAT inequality) + 150-year history timeline
```

## The story, chapter by chapter

| Chapter | Scenes | Beats |
| --- | --- | --- |
| **1 — Intro** | countdown, title-transition, period-axis | Auto-played VAT countdown 20 → 0%, draining liquid, title card, period axis + circle fill |
| **2 — The Scale** | circle-grow, pie-26 | Circle grows to 1.9 billion; hover reveals 26% of the world menstruates |
| **3 — Die Periode** | jeden-monat, scene-a, scene-b, scene-c | "Jeden Monat" → 12 month circles → rect widens → 38 years → 456 barcode lines → 7-year payoff |
| **5 — Die Kosten** | scene-17k, scene-25k, scene-coins-grow | 17 000 products drop via Matter.js physics; euro counter flies to €25 000; coins converge into poverty circle |
| **6 — Periodenarmut** | scene-1-4m, scene-500k, scene-folgen, scene-pie-90/60/15/12 | 1.4 M at-risk circle (hover: 17%); 500 k sub-circle grows; consequences; pie slices show % affected |
| **7 — Die Überleitung** | steuer-intro, steuer-10pct, steuer-20pct, steuer-frage, geschichte-intro, steinzeit, antike, mittelalter, 19jhd, 1896, 1930er, 1973 | Balance scale tips under 10% vs 20% VAT weights; then a photo-card timeline from Stone Age to 1973 |

## Key data points

| Fact | Value |
| --- | --- |
| People who menstruate worldwide | 1.9 billion — ~26% of world population |
| Average menstruating lifetime | 38 years, 456 periods, ≈ 7 continuous years |
| Lifetime period products | 17 000+ (tampons, pads, painkillers, spare clothing) |
| Lifetime cost | ≈ €25 000 |
| At poverty risk in Austria | 1.4 million (17% of population) |
| Affected by period poverty in Austria | 500 000 women |
| VAT abolished | 0% from 1 January 2026 |

## Core modules

| Module | Purpose |
| --- | --- |
| `euro-counter.js` | Floating counter top-left; counts 0 → 20 000 via scroll scrub, then flies into the ch5 overlay and finishes at 25 000 |
| `snap.js` | Intercepts wheel/touch/keyboard input and eases the scroll position to the nearest scene edge so animations always play to completion |
| `spine.js` | The central SVG axis acts as a scrubable scrollbar; four dots fill as the reader advances; click or drag to seek |
| `wave.js` | Animated liquid background that drains as the VAT counter drops |
| `pulse.js` | Breathing pulse animation on the main circle |
| `text-anim.js` | Shared helpers for animating text overlays across scenes |

## Physics (Chapter 5)

Chapter 5 runs a live **Matter.js** simulation alongside the GSAP scroll animation:

- `gravity-physics.js` — creates the Matter.js world, drops tampon pills and coin circles
- `chapter5-state.js` — shared state so scene-17k, scene-25k, and scene-coins-grow hand off the same physics world
- Physics runs on its own `requestAnimationFrame` loop, independent of scroll
- When scene-coins-grow ends, the world is destroyed and the SVG coin group takes over for the GSAP-driven convergence animation

## Balance scale (Chapter 7)

`waage-gravity.js` drives a custom gravity simulation for the balance scale:

- Two pans connected by an arm that pivots around a fulcrum
- The scale tips depending on the VAT weight placed on each pan
- Used in scene-steuer-10pct and scene-steuer-20pct to illustrate the structural tax inequality on period products

## History timeline (Chapter 7)

After the balance scale, chapter 7 continues into a photo-card timeline spanning human history:

- **Steinzeit / Antike / Mittelalter** — early period management across civilisations
- **19. Jahrhundert** — industrialisation and the first commercial products
- **1896** — a landmark moment in period product history
- **1930er** — interwar period and changing social norms
- **1973** — a pivotal year for women's rights and taxation debates
