// vite.config.js

import { defineConfig } from 'vite';

export default defineConfig({
  // CRITICAL FIX: This tells Vite that your main entry file (index.html) 
  // and source code are located inside the 'src' subdirectory.
  root: 'src', 

  // FIX: This resolves the 'localhost refused to connect' error 
  server: {
    host: true, 
  },
  
  // Base path for the application, usually '/'
  base: '/',
  
  // Build configuration (for production deployment)
  build: {
    // Output directory for production build
    outDir: 'dist',
  }
});
