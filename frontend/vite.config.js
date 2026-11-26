import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Saat `npm run dev`, panggilan ke /api diteruskan ke Express lokal (port 3000).
// Kalau VITE_API_URL diisi, proxy ini tidak dipakai.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: { "/api": { target: "http://localhost:3000", changeOrigin: true } },
  },
});
