export const Y_IN  = () => window.innerHeight / 3;
export const Y_OUT = () => window.innerHeight * 2 / 3;

// Real-time seconds for ScrollTrigger-callback text animations (ch05/ch06)
export const DUR_IN  = 0.5;
export const DUR_OUT = 0.3;

// Target scroll distances so text always moves at the same speed regardless of scene height.
// Call setSceneVh(N) once at the top of each scene's init() before any textIn/textOut calls.
const IN_VH  = 30;   // text drifts in over 30vh of scroll
const OUT_VH = 18;   // text drifts out over 18vh of scroll

let _sceneVh = 200;
export function setSceneVh(vh) { _sceneVh = vh; }

export function textIn(tl, id, time) {
  const d = IN_VH / _sceneVh;
  tl.fromTo(id, { opacity: 0, y: Y_IN() }, { opacity: 1, y: 0, duration: d, ease: 'power2.out' }, time);
}

export function textOut(tl, id, time) {
  const d = Math.min(OUT_VH / _sceneVh, 1.0 - time);
  tl.to(id, { opacity: 0, y: -Y_OUT(), duration: d, ease: 'power2.in' }, time);
}

// Fades in at 1/3 scroll progress, briefly at center, fades out at 2/3.
export function textThrough(tl, id) {
  const dIn  = IN_VH  / _sceneVh;
  const dOut = OUT_VH / _sceneVh;
  tl.fromTo(id, { opacity: 0, y: Y_IN() }, { opacity: 1, y: 0, duration: dIn,  ease: 'power2.out' }, 1 / 3);
  tl.to(id, { opacity: 0, y: -Y_OUT(), duration: dOut, ease: 'power2.in' }, 2 / 3 - dOut);
}
