import { defineStore } from "pinia";
import { reactive, ref } from "vue";

import mapsServices from "../services/mapsServices";
import { notify } from "src/boot/plugins/notify";

export const useMapStore = defineStore("map", () => {
  const mapRef = ref({
    building: 0,
    floor: 0,
  });

  const roomData = reactive({
    buildingId: null,
    floorId: null,
    roomName: null,
  });

  const mapVisibilty = ref();
  const desksList = ref();
  const roomImg = ref();
  const roomExsists = ref(false);

  async function showMap(buildingId, floorId, roomName) {
    mapVisibilty.value = true;
    roomData.buildingId = buildingId;
    roomData.floorId = floorId;
    roomData.roomName = roomName;
  }

  async function setDesks(desks) {
    desksList.value = desks;
  }

  async function getRoomImg(buildingId, floorId, roomName) {
    try {
      let response = await mapsServices.getRoomImg(
        buildingId,
        floorId,
        roomName
      );
      return response;
    } catch {
      return "400";
    }
  }

  async function getBuildingList() {
    try {
      return [
        {
          building: "New Building",
          buildingId: 1,
          Floors: [
            {
              floorName: "Room 1",
              floorId: 1,
            },
          ],
        },
        {
          building: "Building 2",
          buildingId: 2,
          Floors: [
            {
              floorName: "Room 1",
              floorId: 1,
            },
            {
              floorName: "Room 1",
              floorId: 2,
            },
          ],
        },
      ];
    } catch {
      notify("error", "حدث خطأ ما. أعد المحاولة من فضلك");
    }
  }

  // async function getMap(buildingId, floorId) {
  //   try {
  //     const map = await mapsServices.getMap(buildingId, floorId);
  //     // const map = await mapsServices.getMapFake();
  //     // const bin = await mapsServices.getBinFile();
  //     console.log(map.data);
  //     // console.log(bin.data);
  //     return map.data;
  //   } catch {
  //     // notify("error", "حدث خطأ ما. أعد المحاولة من فضلك");
  //   }
  // }

  async function checkDeskAvailability(data) {
    try {
      let response = await mapsServices.checkDeskAvailability(data);
      return response;
    } catch {
      notify("error", "Somthing went Wrong");
      return "400";
    }
  }

  async function uploadMap(data) {
    try {
      let response = await mapsServices.uploadMap(data);
      return response;
    } catch {
      notify("error", "Somthing went Wrong");
      return "400";
    }
  }

  async function getRoom(buildingId, floorId, roomName) {
    try {
      let response = await mapsServices.getRoom(buildingId, floorId, roomName);
      return response;
    } catch {
      return "400";
    }
  }

  async function bookDesk(data) {
    try {
      let response = await mapsServices.bookDesk(data);
      notify("success", "desk booked successfully ");
      return response;
    } catch {
      notify("error", "Somthing went Wrong");
      return "400";
    }
  }

  async function getDesk(deskId) {
    try {
      let response = await mapsServices.getDeskById(deskId);
      return response;
    } catch {
      notify("error", "Somthing went Wrong");
      return "400";
    }
  }

  async function postRoomImg(data) {
    try {
      let response = await mapsServices.postRoom(data);
      return response;
    } catch {
      notify("error", "Somthing went Wrong");
      return "400";
    }
  }

  async function postRoomDesksList(data) {
    try {
      let response = await mapsServices.postRoomDesks(data);
      return response;
    } catch {
      notify("error", "Somthing went Wrong");
      return "400";
    }
  }

  async function getFloors() {
    try {
      let response = await mapsServices.getFloors();
      return response;
    } catch {
      notify("error", "Somthing went Wrong");
      return "400";
    }
  }

  async function postMap(buildingName, floorName, data) {
    try {
      let response = await mapsServices.uploadMap(buildingName, floorName, data);
      return response;
    } catch {
      notify("error", "Somthing went Wrong");
      return "400";
    }
  }

  async function getMap(buildingId, floorId) {
    try {
      let response = await mapsServices.getMap(buildingId, floorId);
      return response;
    } catch {
      notify("error", "Somthing went Wrong");
      return "400";
    }
  }

  async function deleteMap(buildingId, floorId) {
    try {
      let response = await mapsServices.deleteMap(buildingId, floorId);
      return response;
    } catch {
      notify("error", "Somthing went Wrong");
      return "400";
    }
  }

  async function updateMap(buildingId, floorId, map) {
    try {
      let response = await mapsServices.uploadMap(buildingId, floorId, map);
      return response;
    } catch {
      notify("error", "Somthing went Wrong");
      return "400";
    }
  }

  return {
    getBuildingList,
    getMap,
    mapRef,
    mapVisibilty,
    desksList,
    roomExsists,
    roomImg,
    roomData,
    checkDeskAvailability,
    bookDesk,
    uploadMap,
    showMap,
    getRoom,
    getDesk,
    setDesks,
    postRoomImg,
    postRoomDesksList,
    getRoomImg,
    getFloors,
    postMap,
    deleteMap,
    updateMap,
  };
});
