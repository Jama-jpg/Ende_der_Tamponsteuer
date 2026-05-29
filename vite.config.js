import { defineConfig } from 'vite';

// Relative base so the production build can be hosted from any sub-path.
export default defineConfig({
  base: './',
  server: {
    open: true,
  },
});
