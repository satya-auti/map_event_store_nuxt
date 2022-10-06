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
        <button @click="getData" class="rounded-xl p-2 bg-black text-white">
          Refresh
        </button>
      </div>
      <br />
      <div class="">
        <h1 class="font-bold ml-2">Stored Events</h1>
        <br />
        <table class="text-sm">
          <tr>
            <th>Name</th>
            <th>Desc</th>
            <th>Toggle</th>
            <th>Color</th>
            <th>Delete</th>
          </tr>

          <tr v-for="(val, index) in info.mapEventData" :key="val.id">
            <td>{{ index + 1 }} ) {{ val.name }}</td>
            <td>{{ val.desc }}</td>
            <td>
              <!--   v-model="info.checkedInfo"
                          :value="data.coordinates" -->
              <!-- id="{{index}}"  v-bind:value="data.coordinates"  v-model="info.checkedInfo" -->
              <input
                type="checkbox"
                name="dataEvent"
                id="checkedData"
                @click="showDataOnMap($event, val.id)"
              />
            </td>
            <td>
              {{ val.properties }}
              <!-- v-model="info.opacity" -->
              <!-- <input
                type="range"
                @change="changeColorOpacity(val.id)"
                min="1"
                max="10"
                v-model="info.opacity"
              /> -->
            </td>
            <td>
              <a @click="deleteLayer(val.id)"
                ><img
                  class="rounded"
                  src="../assets/img/trash_2_2.png"
                  alt="delete"
              /></a>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!-- Map  -->
    <div class="right1">
      <v-map class="w-full h-full" :options="state.map" @loaded="getMapData">
        <div class="zIndex1 bg-slate-500 rounded-lg w-5/12" v-show="info.show">
          <div class="p-2">
            <table class="p-2">
              <tr class="p-1">
                <td class="p-1">
                  <label for="name">Name</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="name"
                    v-model="info.name"
                    placeholder="Name"
                  />
                </td>
              </tr>
              <tr class="p-1">
                <td class="p-1">
                  <label for="desc">Description</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="desc"
                    v-model="info.desc"
                    placeholder="Description"
                  />
                </td>
              </tr>
              <tr class="p-1">
                <td class="p-1">
                  <label for="color">Select Color</label>
                </td>
                <td>
                  <input type="color" id="color" v-model="info.color" />
                </td>
              </tr>
              <tr class="p-1">
                <td class="p-1">
                  <button
                    @click="submit"
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
        </div>
      </v-map>
    </div>
  </div>
  <!-- </main> -->
</template>

<script setup lang="ts">
import VMap from "v-mapbox";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import * as turf from "@turf/turf";
import turf from "@turf/turf";
// import { centroid, point, distance, polygon, lineString } from "@turf/turf";

const data: any = reactive({
  map: {} as mapboxgl.Map,
  mapEvent: [],
  draw: {},
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
  data1: {
    name: "",
    desc: "",
    color: "",
    geom: {},
  },
  opacity: 1,
  show: false,
  name: "",
  desc: "",
  color: "",
  geom: {},
  changer: false,
  marker: null,
  deleteIndex: null,
  mapEventData: [],
  selectedId: {},
});

let db = reactive({
  dbObject: {
    name: "",
    desc: "",
    properties: "",
    geom: {},
  },
});

async function getMapData(tempMap: mapboxgl.Map) {
  data.map = tempMap;
  mapboxgl.accessToken =
    "pk.eyJ1Ijoic2F0eWEtYXV0aSIsImEiOiJjbDdwdnFqMWIwMWF3M3BxZ3dvaTZlNW5yIn0.wrAe-_808WZm-CBKVTwfIw";

  info.mapEventData = await $fetch("http://localhost:3050/map");
  console.log("all database data", info.mapEventData);

  if (info.changer == true) {
    let i = info.deleteIndex;
    // data.map.removeLayer(data.mapEvent[i].geom.id);
    // data.map.removeSource(data.mapEvent[i].geom.id);
    info.changer = false;
  }
  info.changer = false;

  //   Geo Coder search start

  // Add the control to the map.
  data.map.addControl(
    new MapboxGeocoder({
      accessToken:
        "pk.eyJ1Ijoic2F0eWEtYXV0aSIsImEiOiJjbDdwdnFqMWIwMWF3M3BxZ3dvaTZlNW5yIn0.wrAe-_808WZm-CBKVTwfIw",
      mapboxgl: mapboxgl,
    })
  );
  // Geo Coder Ends

  //   data.map.addControl(new mapboxgl.NavigationControl());
  var Draw = new MapboxDraw({
    displayControlsDefault: true,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
      polygon: true,
      //   trash: true,
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    defaultMode: "draw_polygon",
  });
  data.draw = Draw;
  data.map.addControl(Draw, "top-right");
  data.map.on("draw.create", updateData);

  async function updateData(e) {
    info.show = true;
    console.log("1", e);
    console.log("2", e.features[0].id);
    console.log("3 Geometric", e.features[0].geometry);
    // info.geom = e.features[0];
    info.geom = e.features[0].geometry;
  }
  //   info.changer = false;
}

// get Latest Data from DB
async function getData() {
  // http://localhost:3050/map
  info.mapEventData = await $fetch("http://localhost:3050/map");
  console.log("all database data", info.mapEventData);
}

// Added layer  & saved in DB
async function submit() {
  db.dbObject = {
    name: info.name,
    desc: info.desc,
    properties: info.color,
    geom: info.geom,
  };

  let response = await $fetch("http://localhost:3050/map", {
    method: "POST",
    // body: payload,
    body: db.dbObject,
  });

  console.log("res", response);
  info.name = "";
  info.desc = "";
  info.color = "";
  info.geom = {};

  db.dbObject = {
    name: "",
    desc: "",
    properties: "",
    geom: {},
  };
  info.show = false;
  data.draw.deleteAll();
  getData();
}

// Shows specific layer on map
function showDataOnMap(e, index) {
  info.show = false;
  console.log("index", index);
  console.log(e.target.checked);

  console.log("data.layers 1", info.mapEventData);
  //   let selectedId;
  let ID1: string;
  if (e.target.checked == true) {
    info.changer = false;

    let type;
    let type1;
    let colorPick;
    let selectedObj: any;
    let flyToLocation;
    let flyToLocation1;

    // get selected layers color and type and flying coordinates
    let colorSelect = info.mapEventData.filter((ele) => {
      if (ele.id == index) {
        // info.selectedId = ele;
        selectedObj = ele;
        console.log("selectedID ", info.selectedId);

        console.log("ele", ele);
        type = ele.geom.type;
        type1 = ele.geom.type;

        flyToLocation = ele.geom.coordinates;
        colorPick = ele.properties;
        return ele.properties;
      }
    });

    console.log("flyloc", flyToLocation);
    // let type = info.selectedId.geom.type;
    console.log("type", type);

    let latlngArr = [];
    // checks If the type is LineString
    if (type == "LineString") {
      console.log("It is LineString");
      latlngArr = flyToLocation[0];

      let coordinates = flyToLocation;
      console.log("coordinates->1 ", coordinates);

      // Create a 'LngLatBounds' with both corners at the first coordinate.
      // const bounds = new mapboxgl.LngLatBounds(coordinates[0]);
      const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);
      // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
      for (const coord of coordinates) {
        bounds.extend(coord);
      }
      data.map.fitBounds(bounds, {
        padding: 40,
      });
    }

    // checks If the type is Polygon
    if (type == "Polygon") {
      console.log("It is Polygon");
      latlngArr = flyToLocation[0][0];

      // Fit to Bounds starts
      let coordinates = flyToLocation;
      console.log("coordinates->1 ", coordinates);
      console.log("dmo", coordinates[0][0], coordinates[0][1]);

      //   coordinates[0].map((el) => {
      //     console.log("ele -> el ", el[0], el[1], coordinates[0]);
      //   });
      //   // Create a 'LngLatBounds' with both corners at the first coordinate.
      //   // const bounds = new mapboxgl.LngLatBounds(coordinates[0]);
      //   const bounds = new mapboxgl.LngLatBounds(coordinates[0]);
      //   // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
      //   for (const coord of coordinates) {
      //     bounds.extend(coord);
      //   }
      //   console.log("bounds", bounds);

      //   data.map.fitBounds(bounds, {
      //     padding: 200,
      //   });
      //   console.log("single ", coordinates[0][0]);
      //   let try3 = [
      //     coordinates[0][1],
      //     coordinates[0][3],
      //     // coordinates[0][0],
      //     // coordinates[0][4],
      //   ];
      //   data.map.fitBounds(try3, {
      //     padding: 200,
      //   });

      var bounds = new mapboxgl.LngLatBounds();

      //   data.map.features.forEach(function (feature) {
      bounds.extend(coordinates[0]);
      //   });

      data.map.fitBounds(bounds, {
        padding: 200,
      });
    }

    // checks If the type is Point
    if (type == "Point") {
      console.log("It is Point");
      console.log("point data", flyToLocation);

      latlngArr = [flyToLocation[0], flyToLocation[1]];
      info.mapEventData.forEach((ele) => {
        if (ele.id === index) {
          ele.mapMarker = new mapboxgl.Marker({
            draggable: true,
            color: colorPick,
            // color: "#" + (Math.random().toString(16) + "000000").substring(2, 8),
          })
            .setLngLat([latlngArr[0], latlngArr[1]])
            //   .setLngLat([74.04931277036667, 19.266912177018096])
            .addTo(data.map);

          // // Fly to a layers point location
          data.map.flyTo({
            center: [latlngArr[0], latlngArr[1]],
            zoom: 5,
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
            padding: 20,
          });
          //   info.marker = ele.mapMarker;
        }
      });
    }

    let latlng = flyToLocation[0];
    console.log("latlng", latlng);
    // console.log("exact value", latlng[0], latlng[1]);
    console.log("exact value latlng array ", latlngArr);

    // // Fly to a random location
    // data.map.flyTo({
    //   center: [latlngArr[0], latlngArr[1]],
    //   zoom: 6,
    //   essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    // });

    // // Fit to Bounds starts
    // let coordinates = flyToLocation;
    // console.log("coordinates->1 ", coordinates);
    // console.log("dmo", coordinates[0][0], coordinates[0][1]);

    // // Create a 'LngLatBounds' with both corners at the first coordinate.
    // // const bounds = new mapboxgl.LngLatBounds(coordinates[0]);
    // const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[1]);
    // // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
    // for (const coord of coordinates) {
    //   bounds.extend(coord);
    // }

    // data.map.fitBounds(bounds, {
    //   padding: 40,
    // });
    // // Fit to Bounds ends

    console.log("selected color", colorSelect);
    console.log("Pick color", colorPick);
    console.log("checked", selectedObj.id);
    const geometry: any = selectedObj.geom;
    console.log("geometry", geometry);
    console.log("geom co -> ", geometry.coordinates);

    // let sId: string = selectedId.id;
    // let randonNo = Math.round(Math.random() * 1e9);
    // console.log("randonNo", randonNo);

    // data.map.addSource(selectedObj.id, {
    //   type: "geojson",
    //   data: geometry,
    // });

    //   //   Polygon Starts
    let pointsData = [];
    selectedObj.geom.coordinates.map((ele) => {
      console.log("inbuilt data", ele);
      //   let arrFormat = [ele[0], ele[1]];
      let arrFormat = ele;
      //   let arrFormat = [ele];
      pointsData.push(arrFormat);
    });
    console.log("coordinates points", pointsData);

    // ID1 = selectedObj.id.toString();
    ID1 = type + selectedObj.id.toString();
    console.log("ID1", ID1);

    let dataPoints = data.map.addSource(ID1, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: geometry,
            // {
            //   type: type,
            //   coordinates: [
            //     // pointsData[0],
            //     // [
            //     //   [72.783081122, 20.592679666],
            //     //   [76.18884284, 20.592679666],
            //     //   [76.089965887, 17.634598313],
            //     //   [74.43103034, 17.110341763],
            //     //   [71.025268622, 18.084244361],
            //     //   [71.277954168, 20.438336532],
            //     //   [72.783081122, 20.592679666],
            //     // ],
            //   ],
            // },
          },
        ],
      },
    });

    // var bbox = turf.polygon(dataPoints);
    // data.map.fitBounds(bbox, { padding: 20 });

    data.map.addLayer({
      id: ID1,
      source: ID1,
      type: "fill",
      layout: {},
      paint: { "fill-color": colorPick, "fill-opacity": 0.5 },
    });
  } else {
    console.log("id", info.selectedId);
    console.log("index in else ", index);
    let layerId;
    info.mapEventData.filter((ele) => {
      if (ele.id == index) {
        // checks object property available or not if available then remove marker
        ele?.mapMarker?.remove();
        let getType = ele.geom.type;
        layerId = getType + index;
      }
    });
    data.map.removeLayer(layerId);
    data.map.removeSource(layerId);
  }
}
// Delete Map Event Data/ Layer
async function deleteLayer(id) {
  info.show = false;
  console.log("delete", id);
  let layerId;
  let markerData;
  let mapMarker;

  //   to get selected or unselected layers id
  info.mapEventData.filter((ele) => {
    if (ele.id == id) {
      //   ele.mapMarker = ele.mapMarker = new mapboxgl.Marker({
      //     draggable: true,
      //     color: none,
      //     // color: "#" + (Math.random().toString(16) + "000000").substring(2, 8),
      //   })
      //     .setLngLat([latlngArr[0], latlngArr[1]])
      //     //   .setLngLat([74.04931277036667, 19.266912177018096])
      //     .addTo(data.map);
      //   mapMarker = info.marker;
      let getType = ele.geom.type;
      layerId = getType + id;
    }
  });
  //   after confirmation delete layer
  var confirmation = confirm(" Click OK to delete data !!!");
  if (confirmation == true) {
    let deleteMapData = await $fetch("http://localhost:3050/map/remove/" + id, {
      method: "DELETE",
    });
    console.log("deleted Data", deleteMapData);
    info.changer = true;
    // mapMarker.remove();
    // info.marker.remove();
    data.map.removeLayer(layerId);
    data.map.removeSource(layerId);
    getData();
    // data.map.removeLayer(data.mapEvent[i].geom.id);
    // data.map.removeSource(data.mapEvent[i].geom.id);
  } else {
    alert("Something goes wrong!!!");
  }
}
// Function Cancel // hide popup after cancel hit
function Cancel() {
  info.show = false;
  getData();
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
  width: 30vw;
  float: left;
}
.right1 {
  height: 100vh;
  width: 70vw;
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
</style>
