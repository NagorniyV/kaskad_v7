import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      minify: true, // Минификация HTML
      inject: {
        data: {
          title: "Мой сайт",
        },
      },
    }),
  ],
  server: {
    watch: {
      // Edge/browser profile locks DB files → EBUSY crash for Vite watcher
      ignored: ["**/_edge_profile/**", "**/_diag_out/**"],
    },
  },
});