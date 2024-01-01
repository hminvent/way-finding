import authModuleRoutes from "src/modules/auth/router";
import appModuleRoutes from "src/modules/app/router";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        redirect: "/app/organization",
      },
      {
        path: "/maps",
        component: () => import("../pages/HomePage.vue"),
      },
      ...authModuleRoutes,
      ...appModuleRoutes,
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
