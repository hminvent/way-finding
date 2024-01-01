<template>
  <div class="flex justify-end q-my-lg q-mr-sm"></div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { organizationStore } from "../../store";
import Avatar from "../../components/Avatar.vue";
import RoomsCard from "../../components/RoomsCard.vue";
const props = defineProps({
  floorId: {
    type: Number,
  },
  buildingId: {
    type: [String, Number],
  },
});
function handlePagination() {
  getData(current.value);
}
const store = organizationStore();
const rooms = ref();
const roomNumbers = ref();
const current = ref(1);
function getData() {
  getRooms(props.floorId, current.value).then((res) => {
    rooms.value = res.data.rooms;
    roomNumbers.value = res.data.totalItems;
  });
}

const isFormShown = ref(false);
const roomTypes = ref([]);
const roomFacilities = ref([]);

const rules = (val) => (val && val.length > 0) || "Please type something";
const selectionRules = (val) => val || "Please choose something";

const {
  createRoom,
  getRoomByRoomId,
  editRoom,
  getRoomsType,
  getRoomsFacilities,
  getRooms,
} = store;
const editMode = ref(false);

const formData = reactive({
  id: null,
  imageAvatar: null,
  roomEmail: "",
  roomName: "",
  roomType: 0,
  roomCapacity: 0,
  roomNumber: 0,
  roomFacilities: [],
  roOMZone: [
    {
      zoneNumber: 0,
      capacity: 0,
    },
  ],
});

const showForm = (...id) => {
  if (!id[0]) {
    editMode.value = false;
    onReset();
    isFormShown.value = true;
  } else if (id[0]) {
    getRoomByRoomId(id).then((res) => {
      console.log(res.data);
      formData.id = id;
      if (res.data.mapAttachment) {
        formData.imageAvatar = res.data.mapAttachment.filePath;
      } else {
        formData.imageAvatar = "";
      }
      formData.roomCapacity = res.data.capacity;
      formData.roomName = res.data.name;
      formData.roomNumber = res.data.roomNumber;
      formData.roomEmail = res.data.email;
      formData.roomType = res.data.type.id;
      editMode.value = true;
      isFormShown.value = true;
    });
  }
};
const handleChange = ({ imageURL, imageFile }) => {
  formData.imageAvatar = imageFile;
};

const onSubmit = () => {
  if (!editMode.value) {
    const formDataObj = new FormData();
    formDataObj.append("roomNumber", formData.roomNumber);
    formDataObj.append("name", formData.roomName);
    formDataObj.append("email", formData.roomEmail);
    formDataObj.append("capacity", formData.roomCapacity);
    formDataObj.append("typeId", formData.roomType);
    formDataObj.append("thumbnial", formData.imageAvatar);
    formDataObj.append("buildingId", props.buildingId);
    formDataObj.append("floorId", props.floorId);
    for (let i = 0; i < formData.roomFacilities.length; ++i) {
      formDataObj.append("roomFacilities[]", formData.roomFacilities[i]);
    }

    // formDataObj.RoomFacilities.push(...formData.roomFacilities);
    createRoom(formDataObj).then((res) => {
      if (res) {
        getData();
      }
    });
  } else if (editMode.value) {
    const formDataObj = new FormData();
    formDataObj.append("Id", formData.id);
    formDataObj.append("RoomNumber", formData.roomNumber);
    formDataObj.append("Name", formData.roomName);
    formDataObj.append("Email", formData.roomEmail);
    formDataObj.append("Capacity", formData.roomCapacity);
    formDataObj.append("typeId", formData.roomType);
    formDataObj.append("Thumbnial", formData.imageAvatar);
    formDataObj.append("BuildingId", props.buildingId);
    formDataObj.append("FloorId", props.floorId);

    for (let i = 0; i < formData.roomFacilities.length; ++i) {
      formDataObj.append("RoomFacilities[]", formData.roomFacilities[i]);
    }

    editRoom(formDataObj).then(() => {
      getData();
    });
  }
  isFormShown.value = false;
};
const onReset = () => {
  formData.imageAvatar = null;
  formData.roomName = "";
  formData.roomEmail = "";
  formData.roomType = 0;
  formData.roomCapacity = 0;
  formData.roomNumber = 0;
  formData.roomFacilities = [];
};

onMounted(() => {
  getData();

  getRoomsType().then((res) => {
    roomTypes.value = res.data;
  });

  getRoomsFacilities().then((res) => {
    roomFacilities.value = res.data;
  });
});
</script>

<style lang="scss">
@import "src/css/addBtn.scss";
@import "src/css/formCard.scss";
</style>
