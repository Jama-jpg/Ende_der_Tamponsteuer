# Österreichs Weg zur 0% Tamponsteuer

A scroll-driven data story ("scrollytelling") about Austria's path to abolishing
VAT on period products. As you scroll, a single animated SVG canvas morphs through
a narrative: a VAT counter draining 20 → 0%, the scale of menstruation worldwide
(1.9 billion people, 26% of the world), and what it adds up to over a lifetime
(38 years, 456 periods, ≈ 7 continuous years).

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
    constants.js            Palette + SVG geometry (CX/CY, radii, month/dot positions)
    svg.js                  makeSvgEl, polarToCartesian, sectorPath
    glitch.js               VAT/year scramble counter controller
    wave.js                 Liquid wave background controller
    pulse.js                Breathing circle pulse controller
  stage/
    markup.js               Persistent #ui / #liquid-bg / #main-svg template
    index.js                buildStage(): inject markup, generate shapes, return refs
  styles/
    base.css                Reset, variables, stage + UI styling
    overlays.css            Scene text overlays (.stext)
  chapters/
    01-intro/               Countdown → period axis
    02-the-scale/           Circle fills, grows, pulses, 26% pie
    03-every-month/         Twelve month circles
    04-the-lifetime/        38 years → 456 lines → 7 years payoff
```

## The story, chapter by chapter

| Chapter | Scenes | Beats |
| --- | --- | --- |
| **1 — Intro** | `s1`–`s3` | Auto-played VAT countdown 20 → 0%, draining liquid, title, period axis reveal |
| **2 — The Scale** | `s4`–`s7` | Spinner → solid circle, grows to 1.9 billion, pulses, hover-reveal 26% pie |
| **3 — Every Month** | `s8`–`s9` | "Jeden Monat", the circle splits into twelve month circles |
| **4 — The Lifetime** | `s10`–`s13` | 38-year rect, 456 lines burst, lines fall, 7-year payoff, VAT locks at 0% |
