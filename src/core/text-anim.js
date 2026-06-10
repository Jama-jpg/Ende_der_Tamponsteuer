export const Y_IN  = () => window.innerHeight / 3;
export const Y_OUT = () => window.innerHeight * 2 / 3;

// Real-time seconds for ScrollTrigger-callback text animations (ch05/ch06)
export const DUR_IN  = 0.5;
export const DUR_OUT = 0.3;

// Fixed fraction of scene scroll progress — all scenes feel equally paced.
const IN_PCT  = 0.15;
const OUT_PCT = 0.10;

// setSceneVh is kept for backwards compatibility but no longer affects text animation speed.
export function setSceneVh(_vh) {}

export function textIn(tl, id, time) {
  tl.fromTo(id, { opacity: 0, y: Y_IN() }, { opacity: 1, y: 0, duration: IN_PCT, ease: 'power2.out' }, time);
}

export function textOut(tl, id, time) {
  const d = Math.min(OUT_PCT, 1.0 - time);
  tl.to(id, { opacity: 0, y: -Y_OUT(), duration: d, ease: 'power2.in' }, time);
}

// Fades in at 1/3 scroll progress, briefly at center, fades out at 2/3.
export function textThrough(tl, id) {
  tl.fromTo(id, { opacity: 0, y: Y_IN() }, { opacity: 1, y: 0, duration: IN_PCT,  ease: 'power2.out' }, 1 / 3);
  tl.to(id, { opacity: 0, y: -Y_OUT(), duration: OUT_PCT, ease: 'power2.in' }, 2 / 3 - OUT_PCT);
}
