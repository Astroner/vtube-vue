const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true, 
  lintOnSave: false,
  pwa: {
    name: "VTube - video player",
    themeColor: "#ffffff",
    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      skipWaiting: true,
    },
    manifestOptions: {
      short_name: "VTube",
      icons: [
        {
          src: "/favicon.ico",
          type: "image/x-icon",
          sized: "64x64 32x32 24x24 16x16",
        },
        {
          src: "logo192.png",
          type: "image/png",
          sizes: "192x192",
        },
        {
          src: "logo512.png",
          type: "image/png",
          sizes: "512x512",
        },
      ],
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
    },
  },
});
