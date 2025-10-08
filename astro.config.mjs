// @ts-check
import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";

import tailwindcss from "@tailwindcss/vite";

import tomorrowNight from "./src/blog/Tomorrow_Night.tmTheme.json";

export default defineConfig({
  site: "https://lynn.zone",

  integrations: [sitemap(), svelte()],

  build: {
    format: "file",
  },

  markdown: {
    shikiConfig: {
      theme: tomorrowNight,
    },
  },

  trailingSlash: "never",

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});
