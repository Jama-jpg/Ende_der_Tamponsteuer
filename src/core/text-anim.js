export const Y_IN  = () => window.innerHeight / 3;
export const Y_OUT = () => window.innerHeight * 2 / 3;

const DURATION_IN  = 0.12;
const DURATION_OUT = 0.08;

export function textIn(tl, id, time) {
  tl.fromTo(id, { opacity: 0, y: Y_IN() }, { opacity: 1, y: 0, duration: DURATION_IN, ease: 'power2.out' }, time);
}

export function textOut(tl, id, time) {
  tl.to(id, { opacity: 0, y: -Y_OUT(), duration: DURATION_OUT, ease: 'power2.in' }, time);
}

// Fades in at 1/3 scroll progress, pauses briefly at center, fades out at 2/3.
export function textThrough(tl, id) {
  tl.fromTo(id, { opacity: 0, y: Y_IN() }, { opacity: 1, y: 0, duration: DURATION_IN, ease: 'power2.out' }, 1 / 3);
  tl.to(id, { opacity: 0, y: -Y_OUT(), duration: DURATION_OUT, ease: 'power2.in' }, 2 / 3 - DURATION_OUT);
}
