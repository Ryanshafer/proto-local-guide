import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

const SITE_URL =
  process.env.ASTRO_SITE ?? "https://ryanshafer.github.io/proto-local-guide/";
const BASE_PATH = process.env.ASTRO_BASE ?? "/proto-local-guide/";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
  site: SITE_URL,
  base: BASE_PATH,
  output: "static",
});
