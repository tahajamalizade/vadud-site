const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/register",
        component: () => import("pages/RegisterForm.vue"),
      },
      {
        path: "/dashboard",
        component: () => import("pages/dashboardPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/project/:id",
        component: () => import("pages/projectID.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
