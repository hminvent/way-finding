<template>
  <div>
    <div class="header bg-primary q-px-xl row">
      <div class="col-2 q-mx-xl">
        <q-img src="/public/images/Logo-header.png" class="q-mt-md" />
      </div>

      <div class="col-6 row justify-center">
        <div
          class="route q-px-md q-py-lg"
          @click="navigateTo('/app/organization/buildings')"
        >
          <q-icon
            to="/organizations"
            name="mdi-office-building-outline"
            v-if="active == 'buildings'"
            class="bg-white route-icon q-mb-sm q-pa-xs"
            style="font-size: 38px"
            color="primary"
          />
          <q-icon
            to="/organizations"
            v-else
            name="mdi-office-building-outline"
            class="bg-primary route-icon q-mb-sm q-pa-xs"
            style="font-size: 38px"
            color="white"
          />
          <p class="text-white">buildings</p>
        </div>
        <div class="route q-px-md q-py-lg" @click="navigateTo('/app/maps')">
          <q-icon
            to="/organizations"
            name="mdi-map"
            v-if="active == 'maps'"
            class="bg-white route-icon q-mb-sm q-pa-xs"
            style="font-size: 38px"
            color="primary"
          />
          <q-icon
            to="/organizations"
            v-else
            name="mdi-map"
            class="bg-primary route-icon q-mb-sm q-pa-xs"
            style="font-size: 38px"
            color="white"
          />
          <p class="text-white q-pl-xs">maps</p>
        </div>
      </div>
      <div class="col-3 row">
        <div class="q-pt-lg">
          <!-- <p class="text-white text-h6">{{ account }}</p> -->
          <q-item v-ripple clickable unelevated>
            <q-avatar size="24px" class="q-ml-sm">
              <img v-if="viewProp.lang === 'AR'" src="/images/ar-flag.png" />
              <img v-else src="/images/en-flag.png" />
            </q-avatar>
            <p class="q-px-md text-white">{{ viewProp.lang }}</p>

            <q-menu anchor="top right" self="top left" :offset="[-40, 10]">
              <q-list style="min-width: 120px" class="text-center">
                <q-item clickable v-close-popup @click="changeLang('AR')">
                  <q-item-section>
                    <div class="row">
                      <q-avatar size="25px">
                        <img src="/images/ar-flag.png" />
                      </q-avatar>
                      <p class="q-mx-md q-mt-xs">AR</p>
                    </div></q-item-section
                  >
                </q-item>
                <q-item clickable v-close-popup @click="changeLang('EN')">
                  <q-item-section>
                    <div class="row">
                      <q-avatar size="25px">
                        <img src="/images/en-flag.png" />
                      </q-avatar>

                      <p class="q-mx-md q-mt-xs">EN</p>
                    </div></q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-item>
          <!-- <q-btn
            flat
            color="white"
            label="log out"
            icon-right="mdi-logout"
            @click="logOut()"
          /> -->
        </div>
        <q-avatar size="100px" class="q-ma-md">
          <q-img src="/src/assets/images/Ellipse 25.png" />
        </q-avatar>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "src/modules/auth/store/index";
import { RolesEnum } from "src/services/static-lookups";
import { storeToRefs } from "pinia";
import storage from "src/services/storage";
import ArLang from "quasar/lang/ar";
import EnLang from "quasar/lang/en-US";
import { useQuasar } from "quasar";
import { useCardStore } from "../../../stores/card";
//import { useRouter } from "vue-router";

//const active = "buildings"; // Change this with your own logic
const router = useRouter();
const navigateTo = (route) => {
  router.replace({ path: route });
};
const HOME = "home";
const drawer = ref(false);
const route = useRoute();
const { t } = useI18n();
const $q = useQuasar();
const store = useAuthStore();
const { logOut } = store;
const { authorities } = storeToRefs(store);
const { locale } = useI18n({ useScope: "global" });
const drawerToggle = () => {
  drawer.value = !drawer.value;
};
const active = computed(() => {
  return route.fullPath.toLowerCase().includes("organization")
    ? "buildings"
    : "maps";
});

const activeIcon = ref(
  active.value == "buildings"
    ? "bg-white route-icon q-mb-sm q-pa-xs"
    : "bg-primary route-icon q-mb-sm q-pa-xs"
);

const buildingIconColor = ref();

console.log(active.value);
const cardStore = useCardStore();
const { model } = storeToRefs(cardStore);

const account = ref(storage.getProfile().fullName);

const toolbarTitle = computed(() => {
  return route.meta.breadCrumb === undefined
    ? route.name
    : t(route.meta.breadCrumb);
});

const authorized = (role) => {
  for (const auth in role) {
    if (role[auth] === authorities.value[0]) {
      return true;
    }
  }
  return false;
};

const routsList = ref([
  {
    title: t("global.organization"),
    icon: "mdi-domain",
    to: "/app/organization",
    roles: [RolesEnum[1]],
  },
]);

const crumbs = computed(() => {
  const crumbs = [];
  for (let i = 0; i < route.matched.length; i++) {
    if (route.matched[i].meta && route.matched[i].meta.breadCrumb) {
      crumbs.push({
        text: t(route.matched[i].meta.breadCrumb),
        to: route.matched[i].path,
      });
    }
  }
  crumbs[0].id = "home";
  crumbs[crumbs.length - 1].disabled = true;
  return crumbs;
});

const crumbText = (crumb) => {
  return crumb.text.charAt(0).toUpperCase() + crumb.text.slice(1);
};
const setLang = (lang) => {
  storage.setLang(lang);
  setViewProp();
  window.location.reload();
};

const viewProp = ref({
  lang: "AR",
});

const setViewProp = () => {
  let lang = storage.getLang();
  //console.log(lang);
  if (!lang) {
    changeLang("AR");
  }
  if (lang) {
    if (lang === "EN") {
      viewProp.value.lang = "EN";
      $q.lang.set(EnLang);
      //locale = "en-US";
    } else if (lang === "AR") {
      viewProp.value.lang = "AR";
      $q.lang.set(ArLang);
      //locale = "ar-AR";
    } else {
      viewProp.value.lang = "AR";
      $q.lang.set(ArLang);
      setLang("AR");
    }
  }
  return;
};
onMounted(() => {
  setViewProp();
});
const changeLang = (lang) => {
  if (lang !== viewProp.value.lang) {
    storage.setLang(lang);
    setViewProp();
    window.location.reload();
  }
};
</script>

<style lang="scss">
@import "src/css/layout.scss";
</style>
