<template>
  <!-- <main class="w-screen h-screen"> -->

  <head>
    <meta charset="utf-8" />
    <title>Mapbox Example : Directions</title>
    <meta name="robots" content="noindex, nofollow" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <div class="w-screen h-screen">
    <div class="zIndex">Hello</div>
    <div class="">
      <v-map
        class="w-full h-full zIndex"
        :options="state.map"
        @loaded="getMapData"
      >
      </v-map>
    </div>
  </div>
  <!-- </main> -->
</template>

<script setup lang="ts">
import VMap from "v-mapbox";
import mapboxgl from "mapbox-gl";
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import MapboxDraw from "@mapbox/mapbox-gl-draw";
// import MapboxDirection from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

const state = reactive({
  map: {
    accessToken:
      "pk.eyJ1Ijoic2F0eWEtYXV0aSIsImEiOiJjbDdwdnFqMWIwMWF3M3BxZ3dvaTZlNW5yIn0.wrAe-_808WZm-CBKVTwfIw",
    style: "mapbox://styles/mapbox/streets-v11?optimize=true",
    // center: [444.04931277036667, 26.266912177018096] as number[], //uses longitude, latitude
    center: [74.04931277036667, 18.266912177018096] as number[],
    zoom: 7,
    maxZoom: 22,
    // container: "map",
  } as mapboxgl.MapboxOptions,
});

async function getMapData(map: mapboxgl.Map) {
  console.log("load ", map);

  //   Mapbox fullscreen view
  map.addControl(new mapboxgl.FullscreenControl());

  // MapBox Draw Tool start
  //   var Draw = new MapboxDraw();

  // Map#addControl takes an optional second argument to set the position of the control.
  // If no position is specified the control defaults to `top-right`. See the docs
  // for more details: https://docs.mapbox.com/mapbox-gl-js/api/#map#addcontrol

  //   map.addControl(Draw, "top-right");
  // MapBox Draw Tool end
}
</script>

<style>
html,
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.w-screen {
  width: 100vw;
}
.h-screen {
  height: 100vh;
}
.h-full {
  height: 100%;
}
.w-full {
  width: 100%;
}
.zIndex {
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 1;
}
/* .zIndex1 {
      position: relative;
      left: 300px;
      top: 0px;
      z-index: 1;
    } */
.zIndex2 {
  position: relative;
  left: 400px;
  top: 0px;
  z-index: 1;
}
</style>
