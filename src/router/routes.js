const routes = [
  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        meta: { requiresGuest: true },
      },
      {
        path: "/register",
        component: () => import("pages/RegisterForm.vue"),
        meta: { requiresGuest: true },
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
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
      // {
      //   path: "/my-tasks",
      //   component: () => import("pages/memberPage.vue"),
      //   meta: { requiresAuth: true },
      // },
      {
        path: "/project/:id/kanban",
        name: "/ProjectKanban",
        component: () => import("pages/memberPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/manager",
        component: () => import("pages/managerPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/member",
        component: () => import("pages/memberLanding.vue"),
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
