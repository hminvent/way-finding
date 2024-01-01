<template>
  <!-- <q-card flat bordered class="q-ma-md">
    <q-img class="floor-map" :src="floorMap" height="220px" fill="cover">
      <div class="floor-avatar absolute-bottom">
        <q-avatar v-if="floorPic" size="70px" font-size="100px" round>
          <q-img :src="floorPic" />
        </q-avatar>
        <q-avatar
          v-else
          text-color="red-2"
          color="deep-purple-4"
          class="avatar-fallback"
          size="60px"
          font-size="90px"
          icon="mdi-floor-plan"
          round
        />
      </div>
    </q-img>
    <q-card-section>
      <div class="text-h5">
        {{ title }}
      </div>
      <div class="q-mt-md">
        <div class="text-caption text-deep-purple-4">
          {{ $t("global.number") }}
        </div>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-body1">{{ code }}</span>
        <span class="flex items-center justify-end q-col-gutter-x-md">
          <q-btn
            size="10px"
            color="primary"
            icon="mdi-pencil"
            class="flex flex-center q-pa-none"
            flat
            @click="$emit('edit')"
          />
          <q-btn
            size="10px"
            color="primary"
            icon="mdi-arrow-right"
            class="flex flex-center q-pa-none"
            flat
            :to="{
              path: `floors/${props.floorID}/rooms`,
              props: props.floorID,
            }"
          >
            <q-tooltip> Go to Rooms </q-tooltip>
          </q-btn>
        </span>
      </div>
    </q-card-section>
  </q-card> -->
  <div class="floors-card card">
    <q-card flat bordered class="q-ma-md">
      <q-img
        height="232px"
        width="480px"
        v-if="props.floorMap"
        :src="`http://localhost:8010/${props.floorMap}`"
        placeholder-src=""
      >
        <div class="row absolute-full img-content">
          <div class="self-start row justify-between full-width">
            <div class="column col-8">
              <p class="text-h6">
                {{ $t("app.organization.floors.id") }} #{{ props.code }}
              </p>
            </div>
            <div class="item-end self-end">
              <q-btn
                class="col q-mb-md"
                flat
                size="sm"
                @click="$emit('edit', props.floor)"
              >
                {{ $t("app.organization.floors.edit") }}
                <q-icon name="mdi-pencil" />
              </q-btn>
            </div>
          </div>
          <div class="self-end row justify-between full-width">
            <div class="column col-8">
              <p class="text-h4">{{ props.title }}</p>
            </div>
            <div class="item-end self-end">
              <q-btn
                :to="{ path: `/app/maps` }"
                class="text-subtitle1 col q-mb-md"
                flat
                size="md"
              >
                {{ $t("app.organization.floors.showMore") }}
                <q-icon name="mdi-arrow-right" class="mdi-arrow-right" />
              </q-btn>
            </div>
          </div>
        </div>
      </q-img>
      <q-img
        height="232px"
        width="467px"
        v-if="!props.floorMap"
        src="~src/assets/images/building.jpeg"
      >
        <div class="row absolute-full img-content">
          <div class="self-start row justify-between full-width">
            <div class="column col-8">
              <p class="text-h6">
                {{ $t("app.organization.floors.id") }} #{{ props.code }}
              </p>
            </div>
            <div class="item-end self-end">
              <q-btn class="col q-mb-md" flat size="sm" @click="$emit('edit')">
                Edit Floor <q-icon name="mdi-pencil" />
              </q-btn>
            </div>
          </div>
          <div class="self-end row justify-between full-width">
            <div class="column col-8">
              <p class="text-h4">{{ props.title }}</p>
            </div>
            <div class="item-end self-end">
              <q-btn
                :to="{ path: `/app/maps` }"
                class="text-subtitle1 col q-mb-md"
                flat
                size="md"
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
  title: {
    type: String,
    default: "",
  },
  code: {
    type: [Number, String],
    default: 0,
  },
  floorPic: {
    type: String,
  },
  floorMap: {
    type: String,
  },
  floorID: {
    type: Number,
    default: 0,
  },
  buildingID: {
    type: Number,
    default: 0,
  },
  floor: {
    type: Object,
  },
});
</script>

<style lang="scss">
.floors-card .q-ma-md {
  border-radius: 36px;
}
@import "src/css/floorsCard.scss";
@import "src/css/organizationCard.scss";
</style>
