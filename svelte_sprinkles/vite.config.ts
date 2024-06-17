import {ConfigEnv, defineConfig, UserConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import {inlineSvg} from "@svelte-put/preprocess-inline-svg/vite";

// https://vitejs.dev/config/
// Vite+Jekyll setup derived from https://github.com/FabricMC/fabricmc.net/blob/b88f4f058064087405e351849a04931b27c89925/scripts/vite.config.js
export default defineConfig(() => ({
  // Web build
  plugins: [
    inlineSvg([
      {
        directories: '../public/_includes/svg'
      }
    ], {
      inlineSrcAttributeName: 'inline-src',
    }),
    svelte()
  ],
  publicDir: '../_site',
  base: './',
  build: {
    sourcemap: true,
    // Build directly into the Jekyll output directory
    outDir: "../_site/scripts/sprinkles",
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: {
      preserveEntrySignatures: 'allow-extension',
      input: {
        'blabber-parlour': './src/sprinkles/parlour/main.ts',
        'darkmode-toggle': './src/sprinkles/darkmode/main.ts',
        'better-details': './src/sprinkles/details/main.ts',
        'ladysnake-settings': './src/sprinkles/settings/main.ts',
        'rolodex': './src/sprinkles/rolodex/main.ts',
        'versions': './src/sprinkles/versions/main.ts',
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].[hash].js`,
        assetFileNames: `[name].[ext]`,
      },
    }
  }
}) as UserConfig);
