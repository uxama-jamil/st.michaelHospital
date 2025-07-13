import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'legacy', // ✅ Required for includePaths
        includePaths: ['node_modules'],
        additionalData: ` @use "@assets/scss/utils/variables" as *;
                          @use "@assets/scss/utils/functions" as *;
                          @use "@assets/scss/utils/mixins" as *;
                          @use "@assets/scss/utils/media-queries" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@layouts': path.resolve(__dirname, './src/components/layouts'),
      '@features': path.resolve(__dirname, './src/containers'),
      '@constants': path.resolve(__dirname, './src/constants'),
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    checker({
      typescript: true,
    }),
  ],
});
