/* ═══════════════════════════════════════════════════════════════════
   CHAPTER REGISTRY
   The ordered list of chapters that make up the scrollytelling page.
   Reorder or add chapters here — the engine assembles whatever it finds.
═══════════════════════════════════════════════════════════════════ */
import intro         from './chapters/01-intro/chapter.js';
import scale         from './chapters/02-the-scale/chapter.js';
import diePeriode    from './chapters/03-every-month/chapter.js';
import dieKosten     from './chapters/05-die-kosten/chapter.js';
import periodenarmut from './chapters/06-periodenarmut/chapter.js';

export const chapters = [intro, scale, diePeriode, dieKosten, periodenarmut];
