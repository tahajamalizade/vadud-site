import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";

const app = createApp(App);

const pinia = createPinia();

// ابتدا Pinia را use کنید
app.use(pinia);

// سپس router را use کنید
app.use(router);

// بعد mount کنید
app.mount("#app");
