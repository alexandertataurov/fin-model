import { mergeConfig } from './vite.config.base';

export default mergeConfig({
  optimizeDeps: {
    force: false,
  },
  
  build: {
    sourcemap: false,
    minify: 'esbuild',
    cssTarget: 'chrome80',
    cssMinify: 'esbuild',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: false,
      },
    },
  },
  
  esbuild: {
    legalComments: 'none',
    drop: ['console', 'debugger'],
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
  },
});
