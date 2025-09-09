// import { defineStore } from "pinia";

// export const useAuthStore = defineStore("useAuthStore", {
//   state: () => ({
//     users:[]
//   }),
// });

import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,

    userName: (state) => (state.user ? state.user.name : "Guest"),
  },

  actions: {
    async register(userData) {
      try {
        console.log("Registering user:", userData);
        const router = useRouter();
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    },

    async login(credentials) {
      try {
        const FAKE_API_RESPONSE = {
          user: { name: "John Doe", email: credentials.email },
          token: "fake-jwt-token-12345",
        };

        this.user = FAKE_API_RESPONSE.user;
        this.token = FAKE_API_RESPONSE.token;

        localStorage.setItem("token", this.token);
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
