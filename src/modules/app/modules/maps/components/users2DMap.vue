<template>
  <div class="row justify-center">
    <q-dialog full-width v-model="isDialogOpen" :maximized="true">
      <q-card class="rb-card--width q-pa-none">
        <q-card-section class="row items-center q-pb-none bg-grey-2">
          <div class="text-h6">room desks</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="row" v-if="url">
          <div class="col">
            <h4 class="">Select Desk Area</h4>
            <div v-if="mapDialogShow" class="map" ref="mapSpace" id="mapSpace">
              <q-img :src="url" alt="Workplace" usemap="#desks" />
            </div>
          </div>
          <div class="col">
            <bookingForm v-if="showBooking" :desk-obj="deskObj" />
            <div v-else>
              <h4 class="font-weight-medium my-4">
                choose desk from the map to book
              </h4>
            </div>
          </div>
          <template>
            <div class="row justify-center"></div>
          </template>
        </q-card-section>
        <q-card-section v-else>
          <div class="text-h3 text-center">there is no map for this floor</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import bookingForm from "./bookingForm.vue";
import { useMapStore } from "../store/index";

const props = defineProps({
  showMap: {
    type: Boolean,
    default: false,
  },
  floorID: {
    type: String,
  },
  buildingID: {
    type: String,
  },
});

const store = useMapStore();

const desks = ref();

const { getRoom, getDesk } = store;

const deskObj = reactive({
  deskId: null,
  deviceId: null,
});

const isDialogOpen = ref(true);
const showBooking = ref(false);
const selectionDialog = ref(false);
const mapVisible = ref(props.showMap);
const currentDesk = ref("");
const currentDevice = ref("");
const roomData = reactive({
  buildingID: props.buildingID ? props.buildingID : 14,
  floorID: props.floorID ? props.floorID : 14,
  roomName: "room-14",
});

const selectedDesks = ref([]);
const selectedDevices = ref([]);
const url = ref("https://i.imgur.com/pTIE5Dd.jpg");
const aploadedImage = ref();

const mapDialogShow = ref(true);

function hideMapDialogShow() {
  mapVisible.value = false;
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
  getRoom(roomData.buildingID, roomData.floorID, roomData.roomName).then(
    (res) => {
      desks.value = res.data.data.desksArr;
      for (let i = 0; i < desks.value.length; i++) {
        putDevices(desks.value[i]);
      }
    }
  );
}

const mapSpace = ref();
onMounted(() => {
  getRoomDesks();
  let body = document.getElementsByTagName("body")[0];

  body.addEventListener("mousedown", (event) => {
    if (event.path[0]?.className === "selectedAria") {
      getDesk(event.path[0].id).then((res) => {
        deskObj.deskId = event.path[0].id;
        deskObj.deviceId = res.data.data.device.deviceId;
        showBooking.value = true;
      });
      return;
    }
  });
});
</script>

<style lang="scss">
@import "src/css/2dmap.scss";
</style>
