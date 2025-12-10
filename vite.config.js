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
        threedText: "10-3d-text.html",
        lights: "11-lights.html",
        shadows: "12-shadows.html",
        hauntedHouse: "13-haunted-house.html",
        particles: "14-particles.html",
        galaxyGenerator: "15-galaxy-generator.html",
        scrollBasedAnimations: "16-scroll-based-animations.html",
        physics: "17-physics.html",
        importedModels: "18-imported-models.html",
        raycasterAndMouseEvents: "19-raycaster-and-mouse-events.html",
        love: "love.html",
      },
    },
  },
});
