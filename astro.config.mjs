// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://www.tobysuch.uk",
  integrations: [mdx(), sitemap({ serialize(item) { return { ...item, lastmod: new Date().toISOString() }; } }), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
