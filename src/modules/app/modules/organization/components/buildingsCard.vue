<template>
  <div class="building-card card">
    <q-card flat bordered class="q-ma-md">
      <q-img
        height="232px"
        width="467px"
        v-if="props.imgSrc != null"
        :src="`http://localhost:8010/${props.imgSrc}`"
      >
        <div class="row absolute-full img-content">
          <div class="self-end row justify-between full-width">
            <div class="column col-8">
              <p class="text-h5">{{ props.name }}</p>
              <p class="bg-white floors-number text-primary q-px-md">
                {{ props.numOfFloors }}
                {{ $t("app.organization.floors.title") }}
              </p>
            </div>
            <div class="item-end self-end">
              <q-btn
                :to="{
                  path: `buildings/${props.id}/floors`,
                  props: props.id,
                }"
                class="text-subtitle1 col q-mb-md"
                flat
                size="sm"
              >
                {{ $t("app.organization.floors.showMore") }}
                <q-icon name="mdi-arrow-right" />
              </q-btn>
            </div>
          </div>
        </div>
      </q-img>
      <q-img
        height="232px"
        width="467px"
        v-if="props.imgSrc == null"
        src="~src/assets/images/building.jpeg"
      >
        <div class="row absolute-full img-content">
          <div class="self-end row justify-between full-width">
            <div class="column col-8">
              <p class="text-h5">{{ props.name }}</p>
              <p class="bg-white floors-number text-primary q-px-md">
                {{ props.numOfFloors }} floors
              </p>
            </div>
            <div class="item-end self-end">
              <q-btn
                :to="{ path: `buildings/${props.id}/floors`, props: props.id }"
                class="text-subtitle1 col q-mb-md"
                flat
                size="sm"
              >
                show more <q-icon name="mdi-arrow-right" />
              </q-btn>
            </div>
          </div>
        </div>
      </q-img>
    </q-card>
  </div>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
  },
  numOfFloors: {
    type: Number,
  },
  imgSrc: {
    type: String,
    default: null,
  },
  id: {
    type: Number,
  },
});
</script>

<style lang="scss">
.building-card .q-ma-md {
  border-radius: 36px;
}

.column .floors-number {
  width: 30%;
  border-radius: 55px;
}

@import "src/css/buildingsCard.scss";
</style>
