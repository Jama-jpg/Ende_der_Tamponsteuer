export const Y_IN  = () => window.innerHeight / 3;
export const Y_OUT = () => window.innerHeight * 2 / 3;

export function textIn(tl, id, time, { duration = 0.4, ease = 'power2.out' } = {}) {
  tl.fromTo(id, { opacity: 0, y: Y_IN() }, { opacity: 1, y: 0, duration, ease }, time);
}

export function textOut(tl, id, time, { duration = 0.35, ease = 'power2.in' } = {}) {
  tl.to(id, { opacity: 0, y: -Y_OUT(), duration, ease }, time);
}

// Fades in at 1/3 scroll progress, pauses briefly at center, fades out at 2/3.
export function textThrough(tl, id, { inDuration = 0.12, outDuration = 0.12 } = {}) {
  tl.fromTo(id, { opacity: 0, y: Y_IN() }, { opacity: 1, y: 0, duration: inDuration, ease: 'power2.out' }, 1 / 3);
  tl.to(id, { opacity: 0, y: -Y_OUT(), duration: outDuration, ease: 'power2.in' }, 2 / 3 - outDuration);
}
