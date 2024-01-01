import { api } from "src/boot/axios";

export default {
  login: (payload) => api.post(`Account/token`, payload),
  logOut: () => api.delete("/Account/Logout"),
  profile: () => api.get("/Account/Profile"),
  changeLang: (lang) =>
    api.put("/Account/UpdateUserPreferredLanguage?prefferdLang=" + lang),
  refreshToken: (refreshToken) =>
    api.post(`Account/refresh-token`, refreshToken),
};
