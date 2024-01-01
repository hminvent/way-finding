import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import messages from "src/i18n";
import Storage from "src/services/storage";

export default boot(({ app }) => {
  let profile = Storage.getProfile();
  let lang = Storage.getLang();

  const i18n = createI18n({
    // locale: profile.prefferdLang === "English" ? "en-US" : "ar-AR",
    locale: lang === "AR" ? "ar-AR" : "en-US",
    globalInjection: true,
    messages,
  });

  // Set i18n instance on app
  app.use(i18n);
});
