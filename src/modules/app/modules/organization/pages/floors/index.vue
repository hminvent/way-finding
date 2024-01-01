<template>
  <div class="flex q-my-none q-py-none">
    <q-img
      :src="
        props.floorMap == null
          ? '/src/assets/images/Rectangle 45.png'
          : props.floorMap
      "
      style="height: 170px"
    >
      <div class="flex justify-center fit">
        <div class="column">
          <p class="text-h5">building 1</p>
          <p
            class="bg-white floors-number flex justify-center text-h6 text-primary q-px-md"
          >
            {{ floors.length }} floors
          </p>
        </div>
      </div>
    </q-img>
    <!-- <q-btn
      class="add-btn q-px-lg"
      size="lg"
      color="primary"
      label="add floor"
      @click="showForm(null)"
      no-caps
    /> -->
  </div>
  <div class="row q-gutter-x-md q-pl-lg justify-center">
    <FloorsCard
      class="col-4"
      v-for="floor in floors"
      :code="floor.code"
      :title="floor.name"
      :floor="floor"
      :key="floor.id"
      :floorID="floor.id"
      :buildingID="buildingId"
      :floorMap="floor.image"
      @edit="editFloor(floor)"
    />
    <p
      v-if="numberOfFloors === 0"
      class="text-h3 text-center full-width q-mt-xl"
    >
      {{ $t("app.organization.floors.noFloors") }}
    </p>
  </div>
  <div class="q-pa-lg flex flex-center">
    <q-btn
      class="add-btn q-px-lg"
      size="lg"
      color="primary"
      label="add floor"
      @click="showForm(null)"
      no-caps
    />
  </div>
  <q-dialog v-model="isFormShown" class="organizationCard">
    <q-card class="rb-card--width q-pa-md">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ $t("app.organization.floors.add") }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <div class="row">
            <div class="col-4">
              <div class="file-picker">
                <Avatar
                  squared
                  @change="handleChange"
                  :image="formData.floorPic"
                  class="buildings-picker"
                />
              </div>
            </div>
            <div class="col">
              <q-input
                v-model="formData.floorName"
                :label="$t('app.organization.floors.floorName')"
                :hint="$t('app.organization.hint')"
                lazy-rules
                :rules="[rules]"
                class="col-10"
              />

              <q-input
                v-model="formData.floorCode"
                :label="$t('app.organization.floors.id')"
                :hint="$t('app.organization.hint')"
                lazy-rules
                :rules="[rules]"
              />
              <div class="row justify-around">
                <div class="text-center">
                  <div class="flex items-center justify-between">
                    <span class="q-pr-md">{{
                      $t("app.organization.buildings.floorsNum")
                    }}</span>
                    <div>
                      <q-btn
                        @click="handleNoOfRoomsIncrease"
                        color="blue-9"
                        text-color="black"
                        round
                        icon="mdi-plus"
                      />
                    </div>
                    <div class="flex items-center justify-center q-ma-md">
                      {{ formData.noOfRooms }}
                    </div>
                    <div>
                      <q-btn
                        @click="handleNoOfRoomsDecrease"
                        color="blue-9"
                        text-color="black"
                        round
                        icon="mdi-minus"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <q-btn :label="$t('global.submit')" type="submit" color="primary" />
            <q-btn
              :label="$t('global.reset')"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import FloorsCard from "../../components/FloorsCard.vue";
import Avatar from "../../components/Avatar.vue";
import { floorsModel } from "../../models/organivationModels";
import { organizationStore } from "../../store";

const store = organizationStore();
const floors = ref();
const numberOfFloors = ref();

const props = defineProps({
  buildingId: {
    type: Number,
  },
});

const editMode = ref(false);

const { getfloors, addFloor, editFloorById, editFloorByName } = store;

const buildingId = ref(props.buildingId);
const isFormShown = ref(false);

const formData = reactive(floorsModel);
const blankForm = reactive(floorsModel);
const showForm = (...id) => {
  if (id[0]) {
    isFormShown.value = true;
  } else if (!id[0]) {
    onReset();
    isFormShown.value = true;
    editMode.value = false;
  }
};

const handleNoOfRoomsIncrease = () => {
  formData.noOfRooms++;
};
const handleNoOfRoomsDecrease = () => {
  formData.noOfRooms > 0 && formData.noOfRooms--;
};

const handleChange = ({ imageURL, imageFile }) => {
  formData.floorPic = imageFile;
};
function addMap({ imageFile }) {
  formData.floorMap = imageFile;
}

const onReset = () => {
  formData.floorId = 0;
  formData.floorName = "";
  formData.floorCode = "";
  formData.floorMap = "";
  formData.floorPic = "";
};

function getData() {
  getfloors(buildingId.value).then((res) => {
    floors.value = res.data.floors;
    numberOfFloors.value = res.data.totalItems;
  });
}

const onSubmit = () => {
  const formDataObj = new FormData();
  if (!editMode.value) {
    formDataObj.append("floorName", formData.floorName);
    formDataObj.append("file", formData.floorPic);
    formDataObj.append("floorCode", formData.floorCode);
    formDataObj.append("buildingID", buildingId.value);
    //formDataObj.append("floorsCount", formData.noOfFloors);
    formDataObj.append("roomsCount", formData.noOfRooms);

    addFloor(formDataObj).then((res) => {
      if (res) {
        isFormShown.value = false;
        getData();
      }
    });
  } else if (editMode.value) {
    console.log(formData.floorId);
    formDataObj.append("floorName", formData.floorName);
    formDataObj.append("file", formData.floorPic);
    formDataObj.append("floorMap", formData.floorMap);
    formDataObj.append("floorCode", formData.floorCode);
    formDataObj.append("buildingId", buildingId.value);
    formDataObj.append("roomsCount", formData.noOfRooms);

    //console.log(formDataObj);
    editFloorByName(formData.floorId, formDataObj).then((res) => {
      if (res) {
        isFormShown.value = false;
        getData();
      }
    });
  }
};

const rules = (val) => (val && val.length > 0) || "Please type something";

function editFloor(floor) {
  editMode.value = true;
  formData.floorId = floor._id;
  formData.floorName = floor.name;
  formData.floorCode = floor.code;
  formData.file = floor.image;
  formData.buildingID = floor.buildingName;
  formData.noOfRooms = floor.roomsCount;
  showForm(floor.code);
}

function handleFloorEdit(floor) {
  editMode.value = true;
  formData.floorId = floor._id;
  formData.floorName = floor.name;
  formData.floorCode = floor.code;
  formData.file = floor.image;
  formData.buildingID = floor.buildingName;
  formData.noOfRooms = floor.roomsCount;
  console.log(formData);
  showForm(floor.code);
}

onMounted(() => {
  getData();
});
</script>

<style>
@import "src/css/addBtn.scss";
@import "src/css/formCard.scss";
</style>
