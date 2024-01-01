<template>
  <div class="row justify-center">
    <q-dialog full-width v-model="mapVisibilty" :maximized="true">
      <q-card class="rb-card--width q-pa-none">
        <q-card-section class="row items-center bg-grey-2">
          <div class="text-h5">Room Desks</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="row q-py-none" v-if="mapUrl">
          <div class="col">
            <h4 class="text-h5">Select Desk Area</h4>
            <div v-if="mapDialogShow" class="map" ref="mapSpace" id="mapSpace">
              <img :src="mapUrl" alt="Workplace" />
            </div>
          </div>
          <div class="col bg-grey-2 q-px-md list-section">
            <bookingForm v-if="showBooking" />
            <div v-else-if="selectedDesks.length > 0 && !showBooking">
              <h4 class="font-weight-medium my-4 text-h5">
                Selected Desks List
              </h4>
              <div
                class="row q-ma-md q-pa-md text-center bg-white soft-shadow border-r-5 text-subtitle2 text-grey-9"
                v-for="(desk, index) in selectedDesks"
                :key="index"
              >
                <div class="col q-pt-sm">
                  {{ desk }}
                </div>
                <div class="col q-pt-sm">{{ selectedDevices[index] }}</div>
                <div class="col">
                  <q-btn
                    icon="delete"
                    color="red"
                    @click="removeDesk(index)"
                    dense
                  />
                </div>
              </div>
              <div class="q-pa-md save-list">
                <span class="text-grey-6">
                  All selected Devices Status will be active automatically after
                  Saving the changes .
                </span>
                <div class="text-center q-mt-md">
                  <q-btn
                    color="primary"
                    label="Save"
                    class="q-px-lg"
                    @click="postRoomDesks"
                  />
                </div>
              </div>
            </div>
            <h5 v-else style="text-align: center; opacity: 0.7">
              No Selected Desks
            </h5>
          </div>
          <template>
            <div class="row justify-center">
              <q-dialog v-model="selectionDialog" persistent>
                <q-card style="width: 700px; max-width: 80vw">
                  <q-card-section>
                    <div class="row">
                      <div class="col-6 q-pa-md">
                        <span class="text-subtitle1">Select Desk ID</span>
                        <q-select
                          :options="desksLists"
                          label="Desk ID"
                          v-model="currentDesk"
                        />
                      </div>
                      <div class="col-6 q-pa-md">
                        <span class="text-subtitle1">Select Device ID</span>
                        <q-select
                          :options="devicesList"
                          label="Device ID"
                          v-model="currentDevice"
                        />
                      </div>
                      <div class="col-6 q-pa-md">
                        <span class="text-subtitle1"> Device Status</span>
                        <q-select
                          :options="['Disabled']"
                          label="Device Status"
                          v-model="DeviceStatus"
                          disable
                        />
                      </div>
                    </div>

                    <div class="row justify-center q-mx-lg q-mt-lg">
                      <q-btn
                        class=""
                        color="green darken-1"
                        :disabled="!currentDesk || !currentDevice"
                        @click="selectionDone"
                      >
                        Add
                      </q-btn>
                    </div>
                  </q-card-section>
                </q-card>
              </q-dialog>
            </div>
          </template>
        </q-card-section>
        <q-card-section v-else>
          <div class="col row justify-center q-px-lg">
            <div class="col-6 column q-mt-xl">
              <div class="col text-h5">there is no image for this room</div>
              <div class="col">
                <q-file
                  color="primary"
                  filled
                  v-model="uploadedImage"
                  label="please choose an image or drag it here"
                  accept=".jpg, image/*"
                >
                  <template v-slot:prepend>
                    <q-icon name="cloud_upload" />
                  </template>
                </q-file>
              </div>
              <div class="col q-mt-xl row justify-center">
                <q-btn color="primary" label="apload image" @click="postRoom" />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import bookingForm from "./bookingForm.vue";
import { useMapStore } from "../store/index";
import { storeToRefs } from "pinia";

const props = defineProps({
  showMap: {
    type: Boolean,
    default: true,
  },
});
const desks = ref();
const store = useMapStore();
const { mapVisibilty, desksList, roomData } = storeToRefs(store);
const { postRoomImg, showMap, postRoomDesksList, getRoomImg, getRoom } = store;
const showBooking = ref(false);
const selectionDialog = ref(false);
const DeviceStatus = ref("Disabled ");
const currentDesk = ref("");
const currentDevice = ref("");
const currentCoor = reactive({
  coX: "",
  coY: "",
});
const desksLists = desksList;
const addedDesks = reactive([]);
// const desksLists = reactive([
//   "Desk 1",
//   "Desk 2",
//   "Desk 3",
//   "Desk 4",
//   "Desk 5",
//   "Desk 6",
//   "Desk 7",
// ]);
const devicesList = reactive([
  "device 1",
  "device 2",
  "device 3",
  "device 4",
  "device 5",
  "device 6",
  "device 7",
]);
const selectedDesks = ref([]);
const selectedDevices = ref([]);
const mapUrl = ref();
const uploadedImage = ref();

const mapDialogShow = ref(true);

function hideMapDialogShow() {
  mapVisibilty.value = true;
}
function selectionDone() {
  selectionDialog.value = false;
  addedDesks.push({
    roomDeskId: currentDesk.value,
    coX: currentCoor.coX,
    coY: currentCoor.coY,
    device: { deviceId: currentDevice.value, status: "0" },
  });
  let deskIndex = desksLists.value.indexOf(currentDesk.value);
  let deviceIndex = devicesList.indexOf(currentDevice.value);
  selectedDesks.value.push(currentDesk.value);
  selectedDevices.value.push(currentDevice.value);
  currentDesk.value = "";
  currentDevice.value = "";
  currentCoor.coX = "";
  currentCoor.coY = "";
  desksLists.value.splice(deskIndex, 1);
  devicesList.splice(deviceIndex, 1);
  console.log(addedDesks);
}

function removeDesk(index) {
  desksLists.value.push(selectedDesks.value[index]);
  devicesList.push(selectedDevices.value[index]);
  selectedDesks.value.splice(index, 1);
  selectedDevices.value.splice(index, 1);
  document.getElementsByClassName("selectedAria")[index].remove();
}

function postRoom() {
  const formData = new FormData();

  formData.append("floorId", roomData.value.floorId);
  formData.append("buildingId", roomData.value.buildingId);
  formData.append("roomName", roomData.value.roomName);
  formData.append("roomImage", uploadedImage.value);
  postRoomImg(formData).then((res) => {
    getImage();
  });
}

function postRoomDesks() {
  // const formData = new FormData();

  // formData.append("floorId", roomData.value.floorId);
  // formData.append("buildingId", roomData.value.buildingId);
  // formData.append("roomName", roomData.value.roomName);
  // formData.append("desks", addedDesks);
  // console.log(addedDesks);
  const data = {
    floorId: `${roomData.value.floorId}`,
    buildingId: `${roomData.value.buildingId}`,
    roomName: roomData.value.roomName,
    desks: addedDesks,
  };
  console.log(data);
  console.log(addedDesks);
  postRoomDesksList(data);
}

function getImage() {
  getRoomImg(
    roomData.value.buildingId,
    roomData.value.floorId,
    roomData.value.roomName
  ).then((res) => {
    mapUrl.value = res.data.data.loderURL;
    console.log(mapUrl.value);
    getRoomDesks();
  });
}

function putDevices(desk) {
  if (desk) {
    mapSpace.value.innerHTML += `<div class="selectedAria" id="${desk._id}"
    style =" top:${desk.coY}px;
             left:${desk.coX}px;
    background: #ccc; width: 35px; height:35px; border-radius:50%; position:absolute; box-shadow: 3px -1px 5px; cursor: pointer;"></div>`;
  }
}

function getRoomDesks() {
  getRoom(
    roomData.value.buildingId,
    roomData.value.floorId,
    roomData.value.roomName
  ).then((res) => {
    desks.value = res.data.data.desksArr;
    for (let i = 0; i < desks.value.length; i++) {
      putDevices(desks.value[i]);
      //selectedDesks.value.push(desks.value[i].roomDeskId);
      //selectedDevices.value.push(desks.value[i].device.deviceId);
      //console.log(desks.value[i]);
    }
  });
}

const mapSpace = ref();
onMounted(() => {
  getImage();
  let body = document.getElementsByTagName("body")[0];

  body.addEventListener("mousedown", (event) => {
    if (event.path[0]?.className === "selectedAria") {
      showBooking.value = true;
      return;
    } else if (event.path[1]?.id === "mapSpace") {
      showBooking.value = false;
      currentCoor.coX = `${event.pageX - event.path[3].offsetLeft - 20}`;
      currentCoor.coY = `${event.pageY - event.path[3].offsetTop - 85}`;
      mapSpace.value.innerHTML += `<div class="selectedAria"
    style =" top:${event.pageY - event.path[1].offsetTop - 85}px;
             left:${event.pageX - event.path[1].offsetLeft - 20}px;
    background: #ccc; width: 35px; height:35px; border-radius:50%; position:absolute; box-shadow: 3px -1px 5px; cursor: pointer;"></div>`;
      selectionDialog.value = true;
    }
  });
});
</script>

<style lang="scss">
@import "src/css/2dmap.scss";
</style>
