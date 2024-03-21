import {ConfigEnv, defineConfig, UserConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
// Vite+Jekyll setup derived from https://github.com/FabricMC/fabricmc.net/blob/b88f4f058064087405e351849a04931b27c89925/scripts/vite.config.js
export default defineConfig(({ mode }: ConfigEnv) => ({
  // Web build
  plugins: [svelte()],
  build: {
    sourcemap: mode === "development",
    // Build directly into the Jekyll output directory
    outDir: "../_site/scripts/sprinkles",
    emptyOutDir: true,
    rollupOptions: {
      input: {
          'blabber-parlour': './src/sprinkles/parlour/main.ts'
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].[hash].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  }
}) as UserConfig);
