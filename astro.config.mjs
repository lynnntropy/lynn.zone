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

  experimental: {
    clientPrerender: true,
  },

  build: {
    format: "file",
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
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
