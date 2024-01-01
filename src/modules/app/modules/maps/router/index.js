export default [
  {
    path: "/app/maps",
    component: () => import("../layouts/main.vue"),
    children: [
      {
        path: "",
        name: "3dMap",
        component: () => import("../pages/3d-map/index.vue"),
        meta: {
          breadCrumb: "app.maps.title",
        },
      },
      {
        path: "form",
        name: "form",
        props: true,
        component: () => import("../components/bookingForm.vue"),
        meta: {
          breadCrumb: "app.maps.title",
        },
      },
      {
        path: "2dmap",
        name: "2dmap",
        props: true,
        component: () => import("../components/2DMap.vue"),
        meta: {
          breadCrumb: "app.maps.title",
        },
      },
      {
        path: "user2dmap",
        name: "user2dmap",
        props: true,
        component: () => import("../components/users2DMap.vue"),
        meta: {
          breadCrumb: "app.maps.title",
        },
      },
      {
        path: "form",
        name: "form",
        props: true,
        component: () => import("../components/bookingForm.vue"),
        meta: {
          breadCrumb: "app.maps.title",
        },
      },
    ],
  },
];
