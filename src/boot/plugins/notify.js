import { Notify } from "quasar";

export function notify(type, msg) {
  Notify.create({
    message: msg,
    type: type === "success" ? "positive" : "negative",
  });
}
