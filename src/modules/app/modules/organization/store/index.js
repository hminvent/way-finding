import { defineStore } from "pinia";
import organizationsServices from "../services/organizationsServices";
import { ref } from "vue";
import { notify } from "src/boot/plugins/notify";

export const organizationStore = defineStore("organization", () => {
  const roomTypes = ref([]);
  const roomFacilities = ref([]);

  async function getBuildings(pageNum) {
    try {
      let response = await organizationsServices.getBuildings(pageNum);
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function getfloors(buildingId) {
    try {
      let response = await organizationsServices.getFloorsByBuildingId(
        buildingId
      );
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function getRooms(floorId, pageNum) {
    try {
      let response = await organizationsServices.getRoomsByFloorId(
        floorId,
        pageNum
      );
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function addBuilding(data) {
    try {
      let response = await organizationsServices.addBuilding(data);
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function addFloor(data) {
    try {
      let response = await organizationsServices.addFloor(data);
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function editFloorById(data) {
    try {
      let response = await organizationsServices.editFloor(data);
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function getRoomsFacilities() {
    try {
      const response = await organizationsServices.getRoomFacilities();
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function editRoom(data) {
    try {
      let response = await organizationsServices.editRoom(data);
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function getRoomByRoomId(id) {
    try {
      const response = await organizationsServices.getRoomByRoomId(id);
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function getRoomsType() {
    try {
      const response = await organizationsServices.getRoomTypes();
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function setRoomUnderMaintenance(id) {
    try {
      let response = await organizationsServices.setRoomUnderMaintenance(id);
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function changeRoomToActive(id) {
    try {
      let response = await organizationsServices.changeRoomToActive(id);
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function createRoom(data) {
    try {
      console.log(data);
      let response = await organizationsServices.addRoom(data);
      console.log(data);
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function createRoom(data) {
    try {
      console.log(data);
      let response = await organizationsServices.addRoom(data);
      console.log(data);
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  async function editFloorByName(floorID, data) {
    try {
      let response = await organizationsServices.editFloor(floorID, data);
      return response;
    } catch {
      notify("error", "Data Error");
      return null;
    }
  }

  return {
    getBuildings,
    getfloors,
    getRooms,
    addBuilding,
    addFloor,
    editFloorById,
    getRoomsFacilities,
    getRoomsType,
    editRoom,
    getRoomByRoomId,
    createRoom,
    setRoomUnderMaintenance,
    changeRoomToActive,
    editFloorByName
  };
});
