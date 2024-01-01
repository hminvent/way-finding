<template>
  <q-card flat bordered>
    <q-card-section horizontal>
      <q-card-section class="flex flex-center q-pa-sm">
        <q-img
          height="125px"
          width="140px"
          class="rounded-borders"
          :src="props.imageSrc"
        />
      </q-card-section>
      <q-card-section class="q-pt-xs flex column">
        <div class="text-h5 q-mt-sm q-mb-xs">
          {{ props.title }}
        </div>
        <div class="text-h4 q-mt-sm q-mb-xs text-grey-6">
          {{ props.capacity }}
          <small class="text-caption"> persons </small>
        </div>
        <div class="text-caption text-green q-mt-auto">
          {{
            isUnderMaintenance
              ? $t("app.organization.rooms.inMaintenance")
              : $t("app.organization.rooms.active")
          }}
        </div>
      </q-card-section>
    </q-card-section>

    <q-separator />

    <q-card-actions class="flex justify-between">
      <q-btn
        outline
        no-caps
        :color="isUnderMaintenance ? 'green' : 'red'"
        @click="changeMaintenanceMode"
      >
        {{
          isUnderMaintenance
            ? $t("app.organization.rooms.cancelMaintenanceMode")
            : $t("app.organization.rooms.activateMaintenanceMode")
        }}
      </q-btn>
      <q-btn
        flat
        color="primary"
        icon="mdi-pencil"
        @click="$emit('editRoom', props.roomId)"
      >
        <q-tooltip> {{ $t("app.organizations.rooms.edit") }} </q-tooltip>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { organizationStore } from "../store";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  capacity: {
    type: [String, Number],
    default: 0,
  },
  imageSrc: {
    type: String,
    default: "https://i.imgur.com/qtypnfh.jpeg",
  },
  roomId: {
    type: Number,
  },
  status: {
    type: Object,
  },
});

const isUnderMaintenance = ref(
  props.status.name === "InMaintenance" ? true : false
);

const store = organizationStore();

const { setRoomUnderMaintenance, changeRoomToActive } = store;

const changeMaintenanceMode = () => {
  if (isUnderMaintenance.value) {
    changeRoomToActive(props.roomId);
    isUnderMaintenance.value = false;
  } else if (!isUnderMaintenance.value) {
    setRoomUnderMaintenance(props.roomId);
    isUnderMaintenance.value = true;
  }
};
</script>
