import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// console.log("key:" + process.env.VITE_SSL_KEY_FILE);
// console.log("crt:" + process.env.VITE_SSL_CRT_FILE);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
    },
  },
  server: {
    https: {
      key: fs.readFileSync(
        path.resolve(
          __dirname,
          process.env.VITE_SSL_KEY_FILE || "ssl-localhost/localhost.key",
        ),
      ),
      cert: fs.readFileSync(
        path.resolve(
          __dirname,
          process.env.VITE_SSL_CRT_FILE || "ssl-localhost/localhost.crt",
        ),
      ),
    },
    host: "localhost",
    port: 5173,
  },
});
