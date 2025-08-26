const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/login", component: () => import("pages/IndexPage.vue") },
      {
        path: "/register",
        component: () => import("pages/RegisterForm.vue"),
      },
      {
        path: "/dashboard",
        component: () => import("pages/dashboardPage.vue"),
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
