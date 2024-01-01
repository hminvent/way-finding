export default [
  {
    path: "/app/organization",
    component: () => import("../layouts/main.vue"),
    meta: {
      breadCrumb: "app.organization.buildings.title",
    },
    children: [
      {
        path: "",
        name: "organization",
        redirect: "/app/organization/buildings",
      },
      {
        path: "buildings",
        name: "buildings",
        component: () => import("../pages/buildings/index.vue"),
        meta: {
          breadCrumb: "app.organization.buildings.title",
        },
      },
      {
        path: "buildings/:buildingId/floors",
        name: "floors",
        props: true,
        component: () => import("../pages/floors/index.vue"),
        meta: {
          breadCrumb: "app.organization.floors.title",
        },
      },
      {
        path: "buildings/:buildingId/floors/:floorId/rooms",
        name: "rooms",
        component: () => import("../pages/rooms/index.vue"),
        meta: {
          breadCrumb: "app.organization.rooms.title",
        },
        props: true,
      },
    ],
  },
];
