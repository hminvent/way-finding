export default [
  {
    path: "auth",
    component: () => import("../layouts/main.vue"),
    children: [
      {
        path: "",
        redirect: "/auth/login",
      },
      {
        path: "login",
        component: () => import("../pages/login.vue"),
      },
    ],
  },
];
