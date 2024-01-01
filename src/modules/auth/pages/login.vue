<template>
  <div>
    <div class="row q-pt-xl login-container">
      <div class="col q-pa-xl">
        <div class="text-center q-pt-lg">
          <q-img
            :src="
              model.loginLogo[0]
                ? model.loginLogo[0].srcURL
                : '/images/login-bg.png'
            "
            class="q-ma-xl"
            width="40%"
          />
        </div>
      </div>
      <div class="col q-pa-xl">
        <form class="login-card bg-white q-pa-lg">
          <div class="row">
            <p class="text-h4 q-mx-xl q-mt-lg q-mb-md">
              {{ $t("auth.login") }}
            </p>
          </div>
          <div class="row">
            <q-input
              class="q-mx-md q-mx-xl q-my-md text-box"
              v-model="loginForm.email"
              :label="$t('global.email')"
            />
          </div>
          <div class="row">
            <q-input
              class="q-mx-md q-mx-xl q-my-md text-box"
              v-model="loginForm.password"
              :type="isPwd ? 'password' : 'text'"
              :label="$t('global.password')"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-checkbox
              size="xs"
              class="q-mx-xl q-my-md"
              v-model="remeber"
              val="xs"
              :label="$t('auth.rememberMe')"
            />
          </div>
          <div class="row">
            <q-btn
              color="primary"
              no-caps
              class="q-mx-xl q-my-md text-subtitle1 text-box lgom-submit"
              :label="$t('auth.login')"
              @click="submit"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useAuthStore } from "../store/index";
import { loginModel } from "../models/authModels";
import { storeToRefs } from "pinia";
import { useCardStore } from "../../../stores/card";
const store = useAuthStore();
const { login } = store;

const cardStore = useCardStore();
const { model } = storeToRefs(cardStore);

const loginForm = ref(loginModel());

const resetForm = () => {
  loginForm.value = loginModel();
};
function submit() {
  // resetForm();
  login(loginForm.value);
}
const isPwd = ref(true);
const remeber = ref(false);
</script>
<style lang="scss">
@import "src/css/login.scss";
</style>
