import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));

// Resolve Tailwind config from this file, not the current working directory.
export default {
  plugins: {
    tailwindcss: { config: path.resolve(here, "tailwind.config.js") },
    autoprefixer: {},
  },
};
