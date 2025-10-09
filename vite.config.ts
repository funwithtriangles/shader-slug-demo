import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

// __dirname shim for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      // remap to new threejs version
      "three/addons": "three/examples/jsm",
      "three/webgpu": path.resolve(
        __dirname,
        "node_modules/three/build/three.webgpu.js"
      ),
      "three/tsl": path.resolve(
        __dirname,
        "node_modules/three/build/three.tsl.js"
      ),
    },
  },
  assetsInclude: ["**/*.glb", "**/*.gltf", "**/*.hdr", "**/*.mp3"],
});
