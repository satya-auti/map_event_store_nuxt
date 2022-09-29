<template>
  <!--  class="w-screen h-screen" -->
  <!-- <main> -->
  <head>
    <meta charset="utf-8" />
    <title>Mapbox Event : Directions</title>
    <meta name="robots" content="noindex, nofollow" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <!-- Full Screen View -->
  <div class="main">
    <!-- Toggle Bar code -->
    <div class="left1 bg-gray">
      <div class="float-right">
        <button class="rounded-xl p-2 bg-black text-white">Refresh</button>
      </div>
      <br />
      <div class="">
        <h1 class="font-bold ml-2">Stored Events</h1>
        <br />
        <table class="">
          <tr>
            <th>Name</th>
            <th>Desc</th>
            <th>Toggle</th>
          </tr>

          <tr v-for="(val, index) in data.layears" :key="val.name">
            <td>{{ index }} ) {{ val.name }}</td>
            <td>{{ val.desc }}</td>
            <td>
              <!--   v-model="info.checkedInfo"
                :value="data.coordinates" -->
              <!-- id="{{index}}"  v-bind:value="data.coordinates"  v-model="info.checkedInfo" -->
              <input
                type="checkbox"
                name="dataEvent"
                id="checkedData"
                @click="showDataOnMap($event, index)"
              />
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!-- Map  -->
    <div class="right1">
      <v-map class="w-full h-full" :options="state.map" @loaded="getMapData">
        <!-- <div class="zIndex1 bg-slate-500 rounded-lg w-5/12" v-show="info.show">
          <div class="p-2">
            <table class="p-2">
              <tr class="p-1">
                <td class="p-1">
                  <label for="name">Name</label>
                </td>
                <td>
                  <input type="text" id="name" placeholder="Name" />
                </td>
              </tr>
              <tr class="p-1">
                <td class="p-1">
                  <label for="desc">Description</label>
                </td>
                <td>
                  <input type="text" id="desc" placeholder="Description" />
                </td>
              </tr>
              <tr class="p-1">
                <td class="p-1">
                  <button
                    class="rounded-xl p-1 text-white bg-blue-500 hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </td>
                <td>
                  <button
                    @click="Cancel"
                    class="rounded-xl p-1 text-white bg-blue-500 hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </div> -->
      </v-map>
    </div>
  </div>
  <!-- </main> -->
</template>

<script setup lang="ts">
import VMap from "v-mapbox";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

const data: any = reactive({
  map: {} as mapboxgl.Map,
  layears: [],
});

const state = reactive({
  map: {
    accessToken:
      "pk.eyJ1Ijoic2F0eWEtYXV0aSIsImEiOiJjbDdwdnFqMWIwMWF3M3BxZ3dvaTZlNW5yIn0.wrAe-_808WZm-CBKVTwfIw",
    style: "mapbox://styles/mapbox/streets-v11?optimize=true",
    // center: [444.04931277036667, 26.266912177018096] as number[], //uses longitude, latitude
    center: [74.04931277036667, 18.266912177018096] as number[],
    zoom: 7,
    maxZoom: 22,
    crossSourceCollisions: false,
    failIfMajorPerformanceCaveat: false,
    attributionControl: false,
    preserveDrawingBuffer: true,
    // container: "map",
  } as mapboxgl.MapboxOptions,
});

let info = reactive({
  allData: [],
  checkedInfo: [],
  dataObject: {
    name: "",
    desc: "",
    coordinates: [],
  },
  pointsData: [],
  arr: [],
  show: false,
});

async function getMapData(tempMap: mapboxgl.Map) {
  data.map = tempMap;
  mapboxgl.accessToken =
    "pk.eyJ1Ijoic2F0eWEtYXV0aSIsImEiOiJjbDdwdnFqMWIwMWF3M3BxZ3dvaTZlNW5yIn0.wrAe-_808WZm-CBKVTwfIw";
  // map.addControl(
  //   new MapboxGeocoder({
  //     accessToken: mapboxgl.accessToken,
  //     mapboxgl: mapboxgl,
  //   })
  // );
  //   data.map.addControl(new mapboxgl.NavigationControl());
  var Draw = new MapboxDraw();
  data.map.addControl(Draw, "top-right");
  data.map.on("draw.create", updateData);
  // data.map.on("draw.delete", updateArea);
  // data.map.on("draw.update", updateArea);
  function updateData(e) {
    console.log(e);
    console.log(e.features[0].id);
    console.log(e.features[0].geometry);
    // create object
    let name = prompt("Enter the Name ");
    let desc = prompt("Enter the Desc ");
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
    // let data1: any = e.features[0];
    let data1 = {
      name: name,
      desc: desc,
      geom: e.features[0],
    };
    // const geometry: any = data.layears[index].geom;
    data.layears.push(data1);

    // data.map.addSource("pune", {
    //   type: "geojson",
    //   data: data.layears[0],
    //   // {
    //   //   type: "Feature",
    //   //   geometry,
    //   // } as any,
    // });
    // console.log(coordinates);
    // console.log(type1);
  }
}
//////////////////////////////////////// Togale function  this function is used to show and hide layears
function showDataOnMap(e, index) {
  console.log(e.target.checked);
  // console.log(data.layears[index].id);
  let id = `${data.layears[index].id}`;
  // console.log(data.layears[index].coordinates);
  console.log("data.layers ", data.layears);
  //   const sourceId = `barshi-source-${Math.random()}`;
  //   const layerId = `barshi-layer-${Math.random()}`;
  if (e.target.checked == true) {
    // data.map.addSource(data.layears[0].id, {
    //   type: "geojson",
    //   data: data.layears[0],
    // });
    console.log("checked", data.layears[index].geom.id);
    const geometry: any = data.layears[index].geom;
    console.log("geometry", geometry);

    // data.layears.push(data1);
    let sId: string = data.layears[index].geom.id;

    data.map.addSource(data.layears[index].geom.id, {
      type: "geojson",
      data: geometry,
      //   data.layears[0],
      // {
      //   type: "Feature",
      //   geometry,
      // } as any,
    });

    data.map.addLayer({
      //   id: data.layears[0].geom.id,
      id: data.layears[index].geom.id,
      //   source: data.layears[0].id,
      //   source: data.layears[0].geom.id,
      source: data.layears[index].geom.id,
      type: "fill",
      layout: {},
      paint: { "fill-color": "red", "fill-opacity": 0.5 },
    });
  } else {
    // data.map.removeSource(data.layears[0].id);
    data.map.removeLayer(data.layears[index].geom.id);
  }
  // console.log(data.layears[index].geometry.coordinates);
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
.main {
  height: 100vh;
  width: 100vw;
}
.left1 {
  height: 100vh;
  width: 25vw;
  float: left;
}
.right1 {
  height: 100vh;
  width: 75vw;
  float: right;
  position: relative;
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
.bg-gray {
  background-color: cadetblue;
}
.zIndex {
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 1;
}
.zIndex1 {
  position: relative;
  left: 300px;
  top: 100px;
  z-index: 1;
}
/* .zIndex2 {
      position: relative;
      left: 400px;
      top: 0px;
      z-index: 1;
    } */
</style>
