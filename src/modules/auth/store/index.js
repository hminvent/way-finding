import { defineStore } from "pinia";
import { ref } from "vue";

import authServices from "../services/authServices";
import { RolesEnum } from "src/services/static-lookups";
import storage from "src/services/storage";
import { notify } from "src/boot/plugins/notify";
import { DEFAULT_ROUTE } from "src/configs/router";
import { timeOutLoader } from "src/boot/plugins/loading";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  // const token = ref(null);
  const router = useRouter();
  async function login(payload) {
    try {
      let res = await authServices.login(payload);
      storage.setToken(res.data.jwtToken);
      storage.setRefreshToken(res.data.refreshToken);
      let profile = await authServices.profile();
      storage.setProfile(profile.data);
      notify("success", "Logged in");
      router.push("/app/organization");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch {
      notify("error", "user name or password is wrong");
    }
  }
  async function logOut() {
    timeOutLoader();
    storage.removeUser();
    router.push("/auth/login");
  }

  async function setLang(lang) {
    try {
      let res = await authServices.changeLang(lang === "EN" ? 1 : 0);
      let userProfile = storage.getProfile();
      userProfile.prefferdLang = res.data.prefferdLang;
      storage.setProfile(userProfile);
      this.router.go(0);
      notify(
        "success",
        userProfile.prefferdLang === "English"
          ? "Language Changed Successfully"
          : "تم تغيير اللغة بنجاح"
      );
    } catch {
      notify(
        "error",
        userProfile.prefferdLang !== "English"
          ? "Something went wrong please try again"
          : "حدث خطأ ما. أعد المحاولة من فضلك"
      );
    }
  }

  async function refreshToken() {
    const refreshToken = storage.getRefreshToken();
    try {
      await authServices.refreshToken({ refreshToken }).then((response) => {
        storage.setToken(response.data.jwtToken);
        storage.setRefreshToken(response.data.refreshToken);
        window.location.reload();
      });
    } catch (err) {
      if (err) {
        timeOutLoader();
        logOut();
      }
    }
  }

  const authorities = ref(storage.getProfile().authorities || ["empty"]);
  const isAdmin = ref(authorities.value[0] === RolesEnum[1]);
  const isManager = ref(authorities.value[0] === RolesEnum[2]);
  const isEmployee = ref(authorities.value[0] === RolesEnum[3]);
  return {
    login,
    logOut,
    setLang,
    refreshToken,
    authorities,
    isAdmin,
    isManager,
    isEmployee,
  };
});
