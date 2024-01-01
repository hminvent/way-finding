import { secondApi } from "src/boot/axios";
import { api } from "src/boot/axios";

export default {
  uploadMap: (buildingId, floorId, data) => api.put(`map/${buildingId}/floor/${floorId}/add-map`, data),
  // getMap: (buildingId, floorId) =>
  //   secondApi.get(`/map/getmap/${buildingId}/${floorId}`),
  getMapFake: () =>
    secondApi.get(
      `/map/getmap/7760b2fd-7d51-435d-b191-e0f204a2b21e/63391e5a13cfc65c48e77218/Button%20option%201.3%20,%20desk%20name.gltf`
    ),
  getBinFile: () =>
    secondApi.get(
      "/map/getmap/7760b2fd-7d51-435d-b191-e0f204a2b21e/63391e5a13cfc65c48e77218/Button%20option%201.3%20,%20desk%20name.bin"
    ),
  //checkDeskAvailability: (data) => secondApi.post("/desk/check", data),
  //bookDesk: (data) => secondApi.post("/desk", data),
  // getRoom: (buildingId, floorId, roomName) =>
  //   secondApi.get(`/room-desk/${buildingId}/${floorId}/${roomName}`),
  // getDeskById: (deskId) => secondApi.get(`/desk/${deskId}`),
  // getRoomImg: (buildingId, floorId, roomName) =>
  //   secondApi.get(`/room-image/${buildingId}/${floorId}/${roomName}`),
  // postRoom: (data) => secondApi.post("/room-image", data),
  // postRoomDesks: (data) => secondApi.post("/room-desk", data),
  getFloors: () => api.get("building/buildingsWithFloors"),
  // postMap: (data) => secondApi.post("/map", data),
  getMap: (buildingId, floorId) =>
    api.get(`map/${buildingId}/floor/${floorId}/map`),
  deleteMap: (buildingId, floorId) =>
    api.delete(`map/${buildingId}/floor/${floorId}/map`),
  updateMap: (buildingId, floorId, map) =>
    api.put(`map/${buildingId}/${floorId}`, map),
};
