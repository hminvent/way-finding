import { boot } from "quasar/wrappers";
import axios from "axios";
import Storage from "src/services/storage";
import { useAuthStore } from "src/modules/auth/store/index";
import { showLoading, hideLoader } from "src/boot/plugins/loading";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
});
const secondApi = axios.create({
  baseURL: process.env.API_SECOND_URL,
});
export default boot(({ app }) => {
  api.interceptors.request.use((request) => {
    showLoading();
    const token = Storage.getToken();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  });

  api.interceptors.response.use(
    (response) => {
      hideLoader();
      if (response.data.errorMessage) {
        return Promise.reject(response);
      }
      return response;
    },
    (error) => {
      hideLoader();
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        const refreshedToken = {
          refreshToken: `${Storage.getRefreshToken()}`,
        };
        const authStore = useAuthStore();
        const { refreshToken } = authStore;
        refreshToken(refreshedToken);
      }

      return Promise.reject(error);
    }
  );

  // secoind API intercptors
  secondApi.interceptors.request.use((request) => {
    showLoading();
    const token = Storage.getToken();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  });

  secondApi.interceptors.response.use(
    (response) => {
      hideLoader();
      if (response.data.errorMessage) {
        return Promise.reject(response);
      }
      return response;
    },
    (error) => {
      hideLoader();
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        const refreshedToken = {
          refreshToken: `${Storage.getRefreshToken()}`,
        };
        const authStore = useAuthStore();
        const { refreshToken } = authStore;
        refreshToken(refreshedToken);
      }

      return Promise.reject(error);
    }
  );
  // app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  // app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, secondApi };
