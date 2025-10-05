// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";

import tomorrowNight from "./src/blog/Tomorrow_Night.tmTheme.json";

import react from "@astrojs/react";

export default defineConfig({
  site: "https://lynn.zone",

  integrations: [sitemap(), react()],

  markdown: {
    shikiConfig: {
      theme: tomorrowNight,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});
