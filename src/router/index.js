import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useAuthStore } from "src/store/authStore";

export default route(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore(store);

    const token = localStorage.getItem("token");

    if (token && !authStore.user) {
      try {
        await authStore.fetchMe();
      } catch (error) {
        authStore.token = null;
        localStorage.removeItem("token");
        return next("/auth");
      }
    }

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isLoggedIn = !!authStore.token;
    const userRole = authStore.user?.role;

    if (requiresAuth && !isLoggedIn) {
      return next("/auth?redirect=" + to.fullPath);
    }

    if (isLoggedIn) {
      if (userRole === "MEMBER" && to.path !== "/my-tasks") {
        return next("/my-tasks");
      } else if (userRole === "ADMIN") {
        if (to.path === "/my-tasks" || to.path === "/manager") {
          return next("/dashboard");
        }
      } else if (userRole === "MANAGER") {
        if (to.path === "/my-tasks" || to.path === "/dashboard") {
          return next("/manager");
        }
      }
    }

    next();
  });

  return Router;
});
