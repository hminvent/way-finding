import storage from "src/services/storage";

import organizationRoutes from "../modules/organization/router";
import mapsRoutes from "../modules/maps/router"


export default [
  {
    path: "/app",
    component: () => import("../layouts/main.vue"),
    meta: {
      breadCrumb: "global.home",
    },

    children: [
      {
        path: "",
        redirect: "/app/dashboard",
      },

      ...mapsRoutes,
      ...organizationRoutes,
      // ...profileRoutes,
      // ...usersRoutes,
    ],

    // Authorized users validation
    // beforeEnter: (to, from, next) => {
    //   const isAuthenticated = true;

    //   if (!to.path.includes("/auth") && !isAuthenticated) {
    //     next({ path: "/auth" });
    //   } else {
    //     next();
    //   }
    // },
  },
];
