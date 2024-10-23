import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        basicScene: "1-basic-scene.html",
        transformObjects: "2-transform-objects.html",
        animations: "3-animations.html",
        cameras: "4-cameras.html",
        fullscreenResize: "5-fullscreen-resize.html",
        geometries: "6-geometries.html",
        debugUi: "7-debug-ui.html",
        textures: "8-textures.html",
        materials: "9-materials.html",
      },
    },
  },
});
