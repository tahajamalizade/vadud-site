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
        console.error("Invalid token:", error);
        authStore.token = null;
        localStorage.removeItem("token");
        return next("/");
      }
    }

    const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
    const requiresGuest = to.matched.some((r) => r.meta.requiresGuest);
    const isLoggedIn = !!authStore.token;
    const userRole = authStore.user?.role;

    if (requiresAuth && !isLoggedIn) {
      return next("/?redirect=" + to.fullPath);
    }

    if (requiresGuest && isLoggedIn) {
      if (userRole === "ADMIN") return next("/dashboard");
      if (userRole === "MANAGER") return next("/manager");
      if (userRole === "MEMBER") return next("/my-tasks");
    }

    if (isLoggedIn) {
      if (userRole === "MEMBER" && to.path === "/dashboard") {
        return next("/my-tasks");
      }
      if (userRole === "MANAGER" && to.path === "/dashboard") {
        return next("/manager");
      }
    }

    next();
  });

  return Router;
});
