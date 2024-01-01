<template>
  <div class="c">
    <div v-if="mapLoaded" class="q-pa-md bg-grey-2">
      <q-btn color="negative" label="Delete Map" />
      <q-btn
        color="primary"
        label="Update Map"
        class="q-mx-md"
        @click="uploadFloorMap"
      />
    </div>
    <div id="container"></div>
    <d-map v-if="store.mapVisibilty" />
  </div>
  <div v-if="!isMapExsist" class="q-px-lg row justify-center upload-section">
    <div class="column q-mt-xl">
      <div class="col text-h4">There is no map for this floor</div>
      <div class="col">
        <q-file
          color="primary"
          filled
          v-model="uploadedMap"
          label="Please choose a map or drag it here"
          accept=".zip "
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
      </div>
      <div class="col q-mt-xl row justify-center">
        <q-btn color="primary" label="upload map" @click="uploadFloorMap" />
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { InteractionManager } from "src/boot/plugins/three.interactive";
import { useMapStore } from "../store/index";
import { showLoading, hideLoader } from "src/boot/plugins/loading";
import DMap from "./2DMap.vue";

export default {
  components: { DMap },
  data() {
    return {
      uploadedMap: null,
      isMapExsist: true,
      store: useMapStore(),
      builingID: null,
      floorID: null,
      mapLoaded: false,
      mapDesks: [],
    };
  },

  methods: {
    uploadFloorMap() {
      const formData = new FormData();

      formData.append("mapFile", this.uploadedMap);
      formData.append("floorId", this.floorID);
      formData.append("buildingId", this.builingID);
      this.store.uploadMap(formData).then((res) => {
        if (res.status === 200) {
          this.init(this.builingID, this.floorID);
        }
      });
    },

    init(builingId, floorId) {
      this.mapLoaded = false;
      showLoading();
      this.floorID = floorId;
      this.builingID = builingId;
      const container = document.getElementById("container")
        ? document.getElementById("container")
        : null;
      const containerDimensions = container.getBoundingClientRect();
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(containerDimensions.width, containerDimensions.height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.outputEncoding = THREE.sRGBEncoding;

      if (container.children.length === 0) {
        container.appendChild(renderer.domElement);
      } else {
        container.children[0].replaceWith(renderer.domElement);
      }

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        45,
        containerDimensions.width / containerDimensions.height,
        1,
        1000
      );
      camera.position.set(0, -200, 200);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.12;
      controls.minDistance = 0.1;
      controls.maxDistance = 10000;
      controls.target.set(0, 0, 0);
      controls.update();

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();

      const interactionManager = new InteractionManager(
        renderer,
        camera,
        renderer.domElement
      );

      const loader = new GLTFLoader();

      const url = `https://104.248.127.148:8081/map/getmap/${builingId}/${floorId}/gltf`;

      loader.load(
        url,
        (res) => {
          console.log(res);
          this.isMapExsist = true;
          const model = res.scene;
          const modelScale = res.scene.children[0].scale;
          modelScale.set(0.004, 0.004, 0.004);
          scene.add(model);
          model.traverse((child) => {
            if (child.children.length === 0) {
              if (child.material) {
                child.material = child.material.clone();
                child.userData.initialEmissive =
                  child.material.emissive?.clone();
                child.material.emissiveIntensity = 0.5;
                if (child.material.name.includes("Glass")) {
                  child.material.colorWrite = false;
                  child.material.transparent = true;
                  console.log(child.material.colorWrite);
                }
              }

              interactionManager.add(child);

              if (child.name.includes("Mesh_405")) {
                child.userData.materialEmissiveHex =
                  child.material.emissive.getHex();
                child.material.emissive.setHex(0xff0000);
                child.material.emissiveIntensity = 0.5;
              }
              if (child.name.includes("Desk")) {
                child.material.colorWrite = false;
                child.material.transparent = true;
                let name = child.name;
                let nameA = name.split("Desk_");
                let deskNumber = nameA[1].slice(0, -1);
                if (!this.mapDesks.includes(`desk${deskNumber}`)) {
                  this.mapDesks.push(`desk${deskNumber}`);
                }
                console.log(child.material.colorWrite);
                console.log("desk:", child);
              }
              this.store.setDesks(this.mapDesks);
              child.addEventListener("click", (event) => {
                console.log("log:", child);
                event.stopPropagation();
                if (child.name.includes("Room")) {
                  let name = child.name;
                  let nameA = name.split("Room");
                  let roomNumber = nameA[1].slice(0, -1);
                  let roomName = `Room${roomNumber}`;
                  console.log(`Room${roomNumber}`);
                  this.store.showMap(builingId, floorId, roomName);
                }
              });
            }
          });
          hideLoader();
          this.store.setDesks(this.mapDesks);
          console.log("done", this.mapDesks);
          this.mapLoaded = true;
        },
        undefined,
        (err) => {
          this.isMapExsist = false;
          hideLoader();
        }
      );

      function animate() {
        requestAnimationFrame(animate);

        controls.update();
        interactionManager.update();
        renderer.render(scene, camera);
      }

      animate();

      window.addEventListener("resize", handleWindowResize, false);
      function handleWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    },
  },
};
</script>

<style scoped>
html,
body {
  margin: 0;
  height: 100%;
}
#container {
  width: 100%;
  height: 80vh;
}
.c {
  position: relative;
}
.upload-section {
  position: absolute;
  width: 83.3333%;
  top: 20vh;
}
</style>
