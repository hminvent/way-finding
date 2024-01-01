import { boot } from "quasar/wrappers";
import { TroisJSVuePlugin } from "troisjs";
export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(TroisJSVuePlugin);
});
