// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    ssr:false,
    css:[
        '~/assets/css/tailwind.css',
       "mapbox-gl/dist/mapbox-gl.css",
     "v-mapbox/dist/v-mapbox.css", 
     "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css",
    // "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css",
    ],
    build: {
        postcss: {
          postcssOptions: require('./postcss.config.js'),
        },
      },
})
