export const Y = 24;

export function textIn(tl, id, time, { duration = 0.15, ease = 'power2.out' } = {}) {
  tl.fromTo(id, { opacity: 0, y: Y }, { opacity: 1, y: 0, duration, ease }, time);
}

export function textOut(tl, id, time, { duration = 0.12, ease = 'power2.in' } = {}) {
  tl.to(id, { opacity: 0, y: -Y, duration, ease }, time);
}
