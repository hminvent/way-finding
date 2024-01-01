// import { useQuasar, QSpinnerFacebook } from "quasar";
import { Loading, QSpinnerFacebook } from "quasar";
export function showLoading() {
  Loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "indigo-5",
    spinnerSize: 140,
    backgroundColor: "grey-7",
    message: "Some important process is in progress. Hang on...",
    messageColor: "white",
  });
}
export function hideLoader() {
  Loading.hide();
}
export function timeOutLoader() {
  // hiding in 3s
  let timer;
  showLoading();
  timer = setTimeout(() => {
    Loading.hide();
    timer = void 0;
  }, 500);
}
