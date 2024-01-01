<template>
  <div class="media" :class="{'media--has-bg': file}">
    <div class="media__content">
      <template v-if="file">
        <video
          v-if="mimeType === 'video'" class="fit" :muted="isMuted" autoplay :loop="hasToPlayback">
          <source :src="file">
        </video>
        <div v-if="mimeType === 'application'" class="q-video fit">
          <iframe :src="file" class="display-3 fill-height" width="100%" height="100%" name="frame" sandbox="allow-same-origin allow-scripts allow-scripts" />
        </div>
        <q-img v-if="mimeType === 'image'" width="100%" height="100%" ratio="1" :src="file" />
      </template>
      <template v-else>
        <div class="defaultMedia">
          <q-icon size="md" color="grey-8" name="add_photo_alternate" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  file: String,
  isMuted: Boolean,
  hasToPlayback: Boolean,
  mimeType: String,
})
</script>

<style lang="scss">
.media {
  position: relative;
  overflow: hidden;

  &--has-bg {
    background-color: #000;
  }

  &__content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
.defaultMedia {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
