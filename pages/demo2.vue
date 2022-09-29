<template>
  <div>
    <div class="main-div">
      <div class="left-div">
        <h3>Data</h3>
        <ul>
          <li v-for="(item, index) in state.layers" :key="index">
            <input type="checkbox" @click="getdata($event, index)" />
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="right-div">
        <v-map :options="state.options" @loaded="onMapLoaded"> </v-map>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import VMap from "v-mapbox";
import mapboxgl, { Popup } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
const state = reactive({
  options: {
    accessToken:
      "pk.eyJ1Ijoic2F0eWEtYXV0aSIsImEiOiJjbDdwdnFqMWIwMWF3M3BxZ3dvaTZlNW5yIn0.wrAe-_808WZm-CBKVTwfIw",
    style: "mapbox://styles/mapbox/streets-v11?optimize=true",
    center: [74.04931277036667, 18.266912177018096],
    zoom: 8,
    maxZoom: 22,
    crossSourceCollisions: false,
    failIfMajorPerformanceCaveat: false,
    attributionControl: false,
    preserveDrawingBuffer: true,
    hash: false,
    minPitch: 0,
    maxPitch: 60,
  } as mapboxgl.MapboxOptions,
  map: {} as mapboxgl.Map,
  layers: [],
  layersNmae: "",
});
function onMapLoaded(tempMap: mapboxgl.Map) {
  state.map = tempMap;
  (mapboxgl.accessToken =
    "pk.eyJ1IjoibWF5dXJ3YWtpa2FyIiwiYSI6ImNsNmdjdGxwbjBiNGMzY282bWh0dng2c2kifQ.y-m4-zQKOeOOnDG5I1u6ng"),
    state.map.addControl(new mapboxgl.NavigationControl());
  var Draw = new MapboxDraw();
  state.map.addControl(Draw, "top-left");
  state.map.on("draw.create", updateArea);
  function updateArea(e) {
    console.log(e);
    console.log(e.features[0].id);
    console.log(e.features[0].geometry);
    // create object
    let name = prompt("Enter the name ");
    // let coordinates = e.features[0].geometry.coordinates;
    // let type1 = e.features[0].geometry.type;
    // let data1 = {
    //   name: `${name}`,
    //   type: `${type1}`,
    //   coordinates: `${coordinates}`,
    // };
    let data: any = e.features[0];
    state.layers.push(data);
    // state.map.addSource("pune", {
    //   type: "geojson",
    //   data: state.layers[0],
    // });
    // state.layers.push(data1);
    // console.log(coordinates);
    // console.log(type1);
  }
  // console.log(state.layers);
  // function getdata(e) {
  //   console.log(state.layers[e]);
  // }
}
function getdata(e, index) {
  console.log(e.target.checked);
  let id = `${state.layers[index].id}`;
  console.log(state.layers[index].coordinates);
  console.log(state.layers);
  if (e.target.checked == true) {
    const geometry: any = state.layers[index].geom;
    state.map.addSource("pune", {
      type: "geojson",
      data: state.layers[index],
      // {
      //   type: "Feature",
      //   geometry,
      // } as any,
    });
    state.map.addLayer({
      id: "layer",
      source: "pune",
      type: "fill",
      layout: {},
      paint: { "fill-color": "red", "fill-opacity": 0.5 },
    });
  } else {
    // state.map.removeLayer("pune");
  }
  console.log(state.layers[index].geometry.coordinates);
}
</script>
<style>
.left-div {
  height: 100vh;
  width: 20vw;
  background-color: white;
  float: left;
}
.right-div {
  height: 100vh;
  width: 80vw;
  float: right;
}
.main-div {
  height: 100vh;
  width: 100vw;
}
#menu {
  background: #fff;
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 10px;
  border-radius: 3px;
  width: 120px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  font-family: "Open Sans", sans-serif;
}
</style>
