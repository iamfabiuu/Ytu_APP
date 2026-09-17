import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "YTU Recife",
        short_name: "YTU",
        theme_color: "#ffc629",
        background_color: "#0b1b2b",
        display: "standalone",
        start_url: "/",
      },
    }),
  ],
});
