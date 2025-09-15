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
  // <-- The 'store' object is passed in here
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
    // You must get the store instance correctly here
    const authStore = useAuthStore(store);

    // Check for a token first, as `authStore.token` will be null on initial load
    const token = localStorage.getItem("token");

    if (token && !authStore.user) {
      try {
        // Fetch the user data if a token exists but the user state is empty
        await authStore.fetchMe();
      } catch (error) {
        // If the fetch fails, clear the invalid token and redirect to login
        authStore.token = null;
        localStorage.removeItem("token");
        return next("/auth");
      }
    }

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isLoggedIn = !!authStore.token;
    const userRole = authStore.user?.role;

    if (requiresAuth && !isLoggedIn) {
      // If the route requires authentication and the user is not logged in, redirect to auth page
      return next("/auth?redirect=" + to.fullPath);
    }

    if (isLoggedIn) {
      // Redirect logic for logged-in users based on their role
      if (userRole === "MEMBER" && to.path !== "/my-tasks") {
        return next("/my-tasks");
      } else if (
        (userRole === "ADMIN" || userRole === "MANAGER") &&
        to.path === "/my-tasks"
      ) {
        // Prevent Admins/Managers from accessing the member-only page
        return next("/dashboard");
      }
    }

    // Continue to the intended route if no redirection is needed
    next();
  });

  return Router;
});
