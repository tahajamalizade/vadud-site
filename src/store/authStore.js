import { defineStore } from "pinia";

export const useAuthStore = defineStore("useAuthStore", {
  state: () => ({
    users:[]
  }),
});
