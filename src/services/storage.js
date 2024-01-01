import { Cookies } from "quasar";
import {
  APP_TOKEN_KEY,
  APP_PROFILE_KEY,
  APP_REFRESH_TOKEN_KEY,
  APP_LANG_KEY,
} from "src/configs/storage";
const coksOptions = {
  expires: 10,
  path: "/",
};
export default {
  setToken(data) {
    const key = APP_TOKEN_KEY;
    if (data) {
      Cookies.set(key, data, coksOptions);
    }
  },
  removeToken() {
    const key = APP_TOKEN_KEY;
    Cookies.remove(key, { path: coksOptions.path });
  },
  getToken() {
    const key = APP_TOKEN_KEY;
    return Cookies.get(key);
  },

  setProfile(data) {
    const key = APP_PROFILE_KEY;
    if (data) {
      Cookies.set(key, data, coksOptions);
    }
  },
  getProfile() {
    const key = APP_PROFILE_KEY;
    return Cookies.get(key) || {};
  },

  setLang(data) {
    const key = APP_LANG_KEY;
    if (data) {
      Cookies.set(key, data, coksOptions);
    }
  },
  getLang() {
    const key = APP_LANG_KEY;
    return Cookies.get(key) || {};
  },

  removeProfile() {
    const key = APP_PROFILE_KEY;
    Cookies.remove(key, { path: coksOptions.path });
  },
  removeUser() {
    this.removeProfile();
    this.removeToken();
    this.removeRefreshToken();
    if (Cookies.has(APP_PROFILE_KEY)) {
      this.setProfile(null);
      this.setToken(null);
      this.setRefreshToken(null);
    }
  },
  updateLang(language) {
    const key = APP_PROFILE_KEY;
    let profile = Cookies.get(key) || {};
    profile.prefferdLang = language;
    this.setProfile(profile);
  },

  setRefreshToken(data) {
    const key = APP_REFRESH_TOKEN_KEY;
    if (data) {
      Cookies.set(key, data, coksOptions);
    }
  },

  getRefreshToken() {
    const key = APP_REFRESH_TOKEN_KEY;
    return Cookies.get(key) || {};
  },

  removeRefreshToken() {
    const key = APP_REFRESH_TOKEN_KEY;
    Cookies.remove(key, { path: coksOptions.path });
  },
};
