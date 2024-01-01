<template>
  <div class="row">
    <div class="col-md-2 bg-grey-1 q-pt-xl">
      <epxandItems @get-id="getIds" />
    </div>

    <div class="col-md-10">
      <h3 v-if="!buildingId && !floorId" class="text-center text-h5 q-pt-xl">
        {{ $t("app.maps.chooseMap") }}
      </h3>
      <!-- <div v-if="frameUrl && buildingId && floorId" class="q-pa-md bg-grey-2">
        <q-btn
          color="negative"
          :label="$t('app.maps.deleteMap')"
          @click="deleteMapHandler"
        />
        <q-btn
          color="primary"
          :label="$t('app.maps.updateMap')"
          class="q-mx-md"
          @click="updateHandler"
        />
      </div> -->
      <div class="row justify-center q-pt-xl">
        <div class="col-12 row justify-center">
          <iframe
            v-if="buildingId && floorId && frameUrl"
            :src="`http://localhost:8010/${frameUrl}`"
            class="map-frame q-mx-sm"
          ></iframe>
        </div>
        <div
          class="row justify-end q-pt-xl"
          v-if="buildingId && floorId && frameUrl"
        >
          <q-btn
            size="lg"
            rounded
            color="negative"
            class="q-px-xl"
            :label="$t('app.maps.deleteMap')"
            @click="deleteMapHandler"
          />
          <q-btn
            rounded
            size="lg"
            color="primary"
            :label="$t('app.maps.updateMap')"
            class="q-mx-md q-px-xl"
            @click="updateHandler"
          />
        </div>
      </div>
      <q-dialog v-model="updateDialog">
        <q-card class="column q-ma-xl">
          <q-card-section>
            <h5>{{ $t("app.maps.uploadNewMap") }}</h5>
          </q-card-section>
          <q-card-section class="col q-mx-xl">
            <q-file
              color="primary"
              filled
              v-model="updatedMap"
              :label="$t('app.maps.dropMap')"
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" />
              </template>
            </q-file>
          </q-card-section>
          <q-card-section class="col q-mt-xl row justify-center">
            <q-btn
              color="primary"
              :label="$t('app.maps.updateMap')"
              @click="updateMapHandler"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
      <div
        v-if="!frameUrl && buildingId && floorId"
        class="q-px-lg row justify-center upload-section"
      >
        <div class="column q-mt-xl">
          <div class="col text-h4">{{ $t("app.maps.noMap") }}</div>
          <div class="col">
            <q-file
              v-if="isFacility"
              color="primary"
              filled
              v-model="uploadedMap"
              :label="$t('app.maps.dropMap')"
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" />
              </template>
            </q-file>
          </div>
          <div class="col q-mt-xl row justify-center">
            <q-btn
              v-if="isFacility"
              color="primary"
              :label="$t('app.maps.uploadMap')"
              @click="postMaps"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import epxandItems from "../../components/epxandItems.vue";
import { useMapStore } from "../../store/index";

const isFacility = ref(true);

const store = useMapStore();
const { postMap, getMap, updateMap, deleteMap } = store;
const uploadedMap = ref(null);
const buildingId = ref();
const floorId = ref();
const frameUrl = ref();
const updateDialog = ref(false);
const updatedMap = ref();
const dialog = ref(false);
const maximizedToggle = ref(true);
function getIds(building, floor) {
  console.log(floor);
  buildingId.value = building;
  floorId.value = floor;
  getMap(buildingId.value, floorId.value)
    .then((res) => {
      frameUrl.value = res.data.mapFileID;
      updatedMap.value = null;
      uploadedMap.value = null;
      if (frameUrl.value) {
        dialog.value = true;
      }
      // setTimeout(() => {
      //   const iFrame = document.getElementsByClassName("map-frame")[0];
      //   const iFrameWindow = iFrame.contentWindow;
      //   const token = Storage.getToken();
      //   const refreshToken = Storage.getRefreshToken();

      //   iFrameWindow.postMessage(
      //     {
      //       token,
      //       refreshToken,
      //       buildingId: buildingId.value,
      //       floorId: floorId.value,
      //     },
      //     "*"
      //   );

      //   window.addEventListener("message", ({ data }) => {
      //     console.log("DATAfrontend: ", data);
      //   });
      // }, 1500);
    })
    .catch((err) => {
      frameUrl.value = "";
    });
}

function postMaps() {
  const formData = new FormData();
  // formData.append("buildingID", buildingId.value);
  // formData.append("floorID", floorId.value);
  formData.append("file", uploadedMap.value);
  console.log(113);
  postMap(buildingId.value, floorId.value, formData).then((res) => {
    if (res) {
      setTimeout(() => {
        getMap(buildingId.value, floorId.value).then((res) => {
          frameUrl.value = res.data.mapFileID;
        });
      }, 1000);
    }
  });
}

function deleteMapHandler() {
  deleteMap(buildingId.value, floorId.value).then((res) => {
    if (res) {
      frameUrl.value = "";
    }
  });
}

function updateMapHandler() {
  const formData = new FormData();
  formData.append("file", updatedMap.value);

  updateMap(buildingId.value, floorId.value, formData).then((res) => {
    if (res) {
      updateDialog.value = false;
      getIds(buildingId.value, floorId.value);
    }
  });
}

function updateHandler() {
  updateDialog.value = true;
}
</script>

<style lang="scss">
.map-frame {
  width: 1000px;
  height: 650px;
}
</style>
