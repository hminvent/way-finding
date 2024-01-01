<template>
  <div @click="launchFilePicker()">
    <q-avatar
      v-if="!imageSrc"
      :size="size"
      font-size="25px"
      text-color="black"
      icon="mdi-camera-outline"
      class="c-avatar mb-3 floor-map"
      :square="square || squared"
      :class="{ 'file-map': square, 'buildings-uploader': squared }"
    />
    <q-avatar
      v-else
      :size="size"
      font-size="25px"
      text-color="white"
      class="mb-3 floor-map"
      :square="square"
      :class="{ 'file-map': square, 'buildings-uploader': squared }"
    >
      <img
        :src="imageSrc"
        alt="avatar"
        :class="{ 'file-map': square, 'buildings-uploader': squared }"
      />
    </q-avatar>
  </div>
  <input
    type="file"
    ref="file"
    accept=".jpg, image/*"
    name="avatar-file-input"
    @change="onFileChange(name, $event.target.files)"
    class="file-input"
  />
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  size: {
    type: [Number, String],
    default: "80px",
  },
  square: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: null,
  },
  squared: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["change", "update:value"]);
const file = ref(null);
const imageSrc = ref(props.image);

const launchFilePicker = () => {
  file.value.click();
};
const onFileChange = (fieldName, file) => {
  const imageFile = file[0];
  if (imageFile?.type.includes("image")) {
    const imageURL = URL.createObjectURL(imageFile);
    imageSrc.value = imageURL;
    emit("change", { imageURL, imageFile });
  }
};
</script>

<style lang="scss">
@import "src/css/avatar.scss";
</style>
