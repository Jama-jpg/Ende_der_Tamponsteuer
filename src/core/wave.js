/* ═══════════════════════════════════════════════════════════════════
   LIQUID WAVE CONTROLLER
   Animates the wave path in the #liquid-bg background (Scenes 1–2).
═══════════════════════════════════════════════════════════════════ */
const WAVE_BASE_Y = 15;   // y in the liquid-svg viewBox (0 0 1000 80)
const WAVE_AMP    = 5;

/* deps: { liquidWavePath } the <path> inside #liquid-svg. */
export function createWave({ liquidWavePath }) {
  let raf = null;
  let start = null;

  function update(ts) {
    if (!start) start = ts;
    const t = (ts - start) / 2800;
    const a = WAVE_AMP;
    const y = (offset) => (WAVE_BASE_Y + Math.sin(t * Math.PI * 2 + offset) * a).toFixed(1);
    liquidWavePath.setAttribute('d',
      `M 0,${y(0)} C 167,${y(1.05)} 333,${y(2.09)} 500,${y(3.14)} ` +
      `C 667,${y(4.19)} 833,${y(5.24)} 1000,${y(0)} ` +
      `L 1000,80 L 0,80 Z`
    );
    raf = requestAnimationFrame(update);
  }

  return {
    start() { if (!raf) raf = requestAnimationFrame(update); },
    stop()  { if (raf) { cancelAnimationFrame(raf); raf = null; start = null; } },
  };
}
