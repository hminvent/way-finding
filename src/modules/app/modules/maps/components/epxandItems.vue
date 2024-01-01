<template>
  <div class="text-bold">
    <q-expansion-item
      v-for="building in buildings"
      :key="building.building.name"
      icon="apartment"
      :label="building.building.name"
      group="headGroup"
    >
      <q-expansion-item
        v-for="floor in building.floors"
        :key="floor.id"
        icon="apartment"
        :label="floor.name"
        :header-inset-level="1"
        group="floorGroup"
        @show="showFloorMap(building.building.id, floor._id)"
      >
      </q-expansion-item>
    </q-expansion-item>
    <!-- <q-expansion-item icon="apartment" label="Building 2" group="headGroup">
      <q-expansion-item
        icon="layers"
        label="First Floor"
        :header-inset-level="1"
        group="floorGroup"
        @show="showFloorMap(2, 7)"
      >
      </q-expansion-item>
    </q-expansion-item>
    <q-expansion-item icon="apartment" label="Building 145" group="headGroup">
      <q-expansion-item
        icon="layers"
        label="First Floor"
        :header-inset-level="1"
        group="floorGroup"
        @show="showFloorMap(145, 145)"
      >
      </q-expansion-item>
    </q-expansion-item>
    <q-expansion-item icon="apartment" label="Building 143" group="headGroup">
      <q-expansion-item
        icon="layers"
        label="First Floor"
        :header-inset-level="1"
        group="floorGroup"
        @show="showFloorMap(143, 143)"
      >
      </q-expansion-item>
    </q-expansion-item>
    <q-expansion-item icon="apartment" label="Building 146" group="headGroup">
      <q-expansion-item
        icon="layers"
        label="First Floor"
        :header-inset-level="1"
        group="floorGroup"
        @show="showFloorMap(146, 146)"
      >
      </q-expansion-item>
    </q-expansion-item>
    <q-expansion-item icon="apartment" label="Building 99" group="headGroup">
      <q-expansion-item
        icon="layers"
        label="First Floor"
        :header-inset-level="1"
        group="floorGroup"
        @show="showFloorMap(99, 99)"
      >
      </q-expansion-item>
    </q-expansion-item> -->
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useMapStore } from "../store/index";

const store = useMapStore();
const emit = defineEmits(["get-id"]);

const { getFloors } = store;

const buildings = ref();

const currentBuilding = ref(null);
const currentFloor = ref(null);
const showFloorMap = (buildingId, floorId) => {
  if (
    buildingId !== currentBuilding.value ||
    (buildingId === currentBuilding.value && floorId !== currentFloor.value)
  ) {
    currentBuilding.value = buildingId;
    currentFloor.value = floorId;
    emit("get-id", buildingId, floorId);
  }
};

function getBuildings() {
  getFloors().then((res) => {
    buildings.value = res.data.buildingsWithFloors;
  });
}

onMounted(() => {
  getBuildings();
});
</script>
