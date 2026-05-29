/* ═══════════════════════════════════════════════════════════════════
   GLITCH COUNTER CONTROLLER
   RAF-driven scramble of the VAT % and year labels. Runs from the
   intro transition (Scene 3) until Scene 13 locks the final values.
═══════════════════════════════════════════════════════════════════ */
const GLITCH_INTERVAL = 90; // ms between scrambles

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* deps: { vatBigNum, vatNum, yearLbl } DOM elements from the stage. */
export function createGlitch({ vatBigNum, vatNum, yearLbl }) {
  let raf = null;
  let last = 0;

  function tick(ts) {
    if (ts - last > GLITCH_INTERVAL) {
      vatBigNum.textContent = randomInt(0, 20);
      yearLbl.textContent   = randomInt(1973, 2026);
      last = ts;
    }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (raf) return;
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  /* Lock to the final state: 0% MwSt., year 2026. */
  function setFinal() {
    stop();
    vatBigNum.textContent = 0;
    vatNum.textContent    = 0;
    yearLbl.textContent   = 2026;
  }

  return { start, stop, setFinal };
}
