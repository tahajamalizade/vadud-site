const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },

      {
        path: "register",
        component: () => import("pages/RegisterForm.vue"),
      },
      {
        path: "login",
        component: () => import("pages/LoginForm.vue"), // ✅ you need a login page
      },
      {
        path: "dashboard",
        component: () => import("pages/DashboardPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "project/:id",
        component: () => import("pages/ProjectID.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },

  // 404 fallback
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
