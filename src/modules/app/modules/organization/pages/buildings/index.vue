<template>
  <div class="flex justify-end q-mb-lg q-mr-sm">
    <!-- <q-btn
      class="add-btn q-px-lg q-mt-md"
      size="lg"
      color="primary"
      :label="t('app.organization.buildings.add')"
      no-caps
      @click="addNewBuilding"
    /> -->
  </div>
  <div class="row q-pl-md justify-center">
    <buildingsCardVue
      class="col-12 col-sm-3 col-md-4"
      v-for="building in buildings"
      :key="building.id"
      :name="building.name"
      :numOfFloors="building.floors"
      :imgSrc="building.image ? building.image : null"
      :id="building.id"
      @edit="editBuilding(building)"
    />
  </div>
  <div class="q-pa-lg flex flex-center">
    <q-btn
      class="add-btn q-px-lg q-mt-md"
      size="lg"
      color="primary"
      :label="t('app.organization.buildings.add')"
      no-caps
      @click="addNewBuilding"
    />
    <!-- <q-pagination
      v-model="current"
      color="primary"
      @click="handlePagination"
      :max="
        numberOfBuildings % 10 == 0
          ? Math.floor(numberOfBuildings / 10)
          : numberOfBuildings / 10 + 1
      "
      :max-pages="6"
      :ellipses="false"
      :boundary-numbers="false"
    /> -->
  </div>
  <q-dialog v-model="isFormShown">
    <q-card class="rb-card--width q-pa-md">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          {{ $t("app.organization.buildings.add") }}
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
                  :image="formData.imageAvatar"
                  class="buildings-picker"
                />
              </div>
            </div>
            <div class="col">
              <q-input
                v-model="formData.buildingName"
                :label="$t('app.organization.buildings.buildingName')"
                :hint="$t('app.organization.hint')"
                lazy-rules
                :rules="[rules]"
                class="col-10"
              />

              <q-input
                v-model="formData.buildingAddress"
                :label="$t('app.organization.buildings.address')"
                :hint="$t('app.organization.hint')"
                lazy-rules
                :rules="[rules]"
              />
            </div>
          </div>
          <div class="row justify-around">
            <div class="text-center">
              <div class="flex items-center justify-between">
                <span class="q-pr-md">{{
                  $t("app.organization.buildings.floorsNum")
                }}</span>
                <div>
                  <q-btn
                    @click="handleNoOfFloorsIncrease"
                    color="blue-9"
                    text-color="black"
                    round
                    icon="mdi-plus"
                  />
                </div>
                <div class="flex items-center justify-center q-ma-md">
                  {{ formData.noOfFloors }}
                </div>
                <div>
                  <q-btn
                    @click="handleNoOfFloorsDecrease"
                    color="blue-9"
                    text-color="black"
                    round
                    icon="mdi-minus"
                  />
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
import buildingsCardVue from "../../components/buildingsCard.vue";
import { buildingModel } from "../../models/organivationModels";
import Avatar from "../../components/Avatar.vue";
import { organizationStore } from "../../store";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const isFormShown = ref(false);
const store = organizationStore();

const formData = reactive(buildingModel);
let editMode = ref(false);

const { getBuildings, addBuilding } = store;
const buildings = ref();
const numberOfBuildings = ref();
const current = ref(1);

const selectedFile = ref("/src/assets/images/blank.jpeg");

const clickInput = () => {
  const fileInput = document.querySelector("input[type=file]");
  if (fileInput) {
    fileInput.click();
  }
};

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      selectedFile.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

function handlePagination() {
  getData(current.value);
}

function getData(pgNumber) {
  getBuildings(pgNumber).then((res) => {
    buildings.value = res.data.buildings;
    numberOfBuildings.value = res.data.totalItems;
  });
}

onMounted(() => {
  getData(1);
});

const addNewBuilding = () => {
  editMode.value = false;
  onReset();
  showForm();
};

const handleNoOfFloorsIncrease = () => {
  formData.noOfFloors++;
};

const handleNoOfFloorsDecrease = () => {
  formData.noOfFloors > 0 && formData.noOfFloors--;
};

const handleNoOfRoomsIncrease = () => {
  formData.noOfRooms++;
};
const handleNoOfRoomsDecrease = () => {
  formData.noOfRooms > 0 && formData.noOfRooms--;
};

const onSubmit = () => {
  const formDataObj = new FormData();

  // if (editMode.value) {
  //   formDataObj.append("Id", buildingId.value);
  //   formDataObj.append("Name", formData.buildingName);
  //   formDataObj.append("NoOfFloors", formData.noOfFloors);
  //   formDataObj.append("NoOfRooms", formData.noOfRooms);
  //   formDataObj.append("Address", formData.buildingAddress);
  //   formDataObj.append("StatusId", 0);
  //   formDataObj.append(
  //     "Thumbnial",
  //     typeof formData.imageAvatar === "string" ? "" : formData.imageAvatar
  //   );
  //   api.put("Organization/UpdateBuilding", formDataObj).then(() => {
  //     getData(1);
  //   });
  // } else {
  if (!editMode.value) {
    formDataObj.append("buildingAddress", formData.buildingAddress);
    formDataObj.append("file", formData.imageAvatar);
    formDataObj.append("buildingName", formData.buildingName);
    formDataObj.append("floorsCount", formData.noOfFloors);
    addBuilding(formDataObj).then(() => {
      getData(1);
    });
  }

  isFormShown.value = false;
};
const onReset = () => {
  formData.imageAvatar = null;
  formData.buildingName = null;
  formData.buildingAddress = null;
  formData.noOfFloors = 0;
  formData.noOfRooms = 0;
};
const showForm = () => {
  isFormShown.value = true;
};
const handleChange = ({ imageURL, imageFile }) => {
  formData.imageAvatar = imageFile;
};

const rules = (val) => (val && val.length > 0) || "Please type something";
</script>

<style lang="scss">
.file-picker .buildings-picker {
  width: 149px;
  height: 154px;
  padding-left: 1000px;
}

@import "src/css/addBtn.scss";
@import "src/css/formCard.scss";
</style>
