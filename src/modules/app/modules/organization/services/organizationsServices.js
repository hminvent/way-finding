import { api } from "src/boot/axios";

export default {
  getBuildings: () =>
    api.get(`building`),

  getFloorsByBuildingId: (buildingId) =>
    api.get(`building/${buildingId}/floors`),

  getRoomsByFloorId: (floorId, pageNum) =>
    api.get(
      `Organization/ListRoomsByFloor?floorId=${floorId}&pageNumber=${pageNum}`
    ),

  addBuilding: (data) => api.post(`building`, data),

  addFloor: (data) => api.post(`floor`, data),
  editFloor: (floorID, data) => api.put(`/floor/${floorID}`, data),

};
