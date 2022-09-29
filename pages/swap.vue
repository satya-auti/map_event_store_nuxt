<template>
  <!-- container contain to map and list -->
  <div>
    <!-- list define div -->
    <div id="list" class="w-1/5 h-full float-left bottom-1 border-red-600">
      <h3>Layers</h3>
      <ul>
        <li v-for="(item, index) in data.layears" :key="item.id">
          <input type="checkbox" @change="toggle($event, index)" />
          {{ item.name }}
        </li>
      </ul>
    </div>
    <!-- map box div -->
    <!-- <div id="mapbox" class="h-full w-5/5"> -->
    <div class="w-4/5 h-screen border-2 border-slate-900 float-left">
      <v-map class="w-5/5 h-full" :options="data.options" @loaded="onMapLoaded">
      </v-map>
    </div>
  </div>
  <!-- </div> -->
</template>
<script setup lang="ts">
import "mapbox-gl/dist/mapbox-gl.css";
import "v-mapbox/dist/v-mapbox.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import Mapbox from "mapbox-gl";
import { VMap } from "v-mapbox";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { anyTypeAnnotation } from "@babel/types";
const data = reactive({
  options: {
    accessToken:
      "pk.eyJ1IjoibWF5dXJ3YWtpa2FyIiwiYSI6ImNsNmdjdGxwbjBiNGMzY282bWh0dng2c2kifQ.y-m4-zQKOeOOnDG5I1u6ng",
    style: "mapbox://styles/mapbox/outdoors-v11",
    center: [-284.8618412017822, 20.253581321936355],
    zoom: 11,
    maxZoom: 22,
    crossSourceCollisions: false,
    failIfMajorPerformanceCaveat: false,
    attributionControl: false,
    preserveDrawingBuffer: true,
    hash: false,
    minPitch: 0,
    maxPitch: 60,
    container: "map",
  } as mapboxgl.MapboxOptions,
  map: {} as mapboxgl.Map,
  layears: [],
  layearName: 0,
});
async function onMapLoaded(tempMap: mapboxgl.Map) {
  data.map = tempMap;
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWF5dXJ3YWtpa2FyIiwiYSI6ImNsNmdjdGxwbjBiNGMzY282bWh0dng2c2kifQ.y-m4-zQKOeOOnDG5I1u6ng";
  // map.addControl(
  //   new MapboxGeocoder({
  //     accessToken: mapboxgl.accessToken,
  //     mapboxgl: mapboxgl,
  //   })
  // );
  data.map.addControl(new mapboxgl.NavigationControl());
  var Draw = new MapboxDraw();
  data.map.addControl(Draw, "top-left");
  data.map.on("draw.create", updateArea);
  // data.map.on("draw.delete", updateArea);
  // data.map.on("draw.update", updateArea);
  function updateArea(e) {
    console.log(e);
    console.log(e.features[0].id);
    console.log(e.features[0].geometry);
    // create object
    let name = prompt("Enter the name ");
    // let coordinates = e.features[0].geometry.coordinates;
    // let geometry = e.features[0].geometry;
    // let type1 = e.features[0].geometry.type;
    // let data1 = {
    //   id: `${e.features[0].id}`,
    //   name: `${name}`,
    //   type: `${type1}`,
    //   coordinates: `${coordinates}`,
    //   geometry: `${geometry}`,
    // };
    let data1: any = e.features[0];
    data.layears.push(data1);
    // console.log(coordinates);
    // console.log(type1);
  }
}
//////////////////////////////////////// Togale function  this function is used to show and hide layears
function toggle(e, index) {
  console.log(e.target.checked);
  // console.log(data.layears[index].id);
  let id = `${data.layears[index].id}`;
  // console.log(data.layears[index].coordinates);
  console.log(data.layears);
  const sourceId = `barshi-source-${Math.random()}`;
  const layerId = `barshi-layer-${Math.random()}`;
  if (e.target.checked == true) {
    // data.map.addSource(data.layears[0].id, {
    //   type: "geojson",
    //   data: data.layears[0],
    // });
    data.map.addLayer({
      id: data.layears[0].id,
      source: data.layears[0].id,
      type: "fill",
      layout: {},
      paint: { "fill-color": "pink", "fill-opacity": 0.5 },
    });
  } else {
    // data.map.removeSource(data.layears[0].id);
    data.map.removeLayer(data.layears[0].id);
  }
  // console.log(data.layears[index].geometry.coordinates);
}
</script>
