<template>
  <q-page class="flex" style="height: 100vh; width: 100vw">
    <div class="background">
      <div class="icon">
        <!-- همون آیکن -->
      </div>

      <div class="log">
        <h4 style="margin: 10px; color: #1d232d; cursor: default">Register</h4>
        <form class="inputs-div" @submit.prevent="doRegister">
          <input v-model="data.name" type="text" placeholder="Name" required />
          <input
            v-model="data.email"
            type="email"
            placeholder="Email"
            required
          />
          <input
            v-model="data.password"
            type="password"
            placeholder="Password"
            required
          />

          <button class="submit-button" type="submit">REGISTER</button>
        </form>
      </div>

      <div class="createAccount">
        <router-link to="/" class="create-account">
          <h6>Already have an account?</h6>
        </router-link>
      </div>

      <img
        src="../assets/wp12412873-minimalist-4k-pc-wallpapers.jpg"
        alt="wallpaper"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { reactive } from "vue";
import { useRouter } from "vue-router";

// for state managment PINIA
import { useAuthStore } from "src/store/authStore";
const auth = useAuthStore();

const $q = useQuasar();
const router = useRouter();

const data = reactive({
  name: "",
  email: "",
  password: "",
});

async function doRegister() {
  if (data.password.length < 8) {
    $q.notify({
      message: "Password should be at least 8 characters long.",
      color: "orange",
      textColor: "black",
    });
    return;
  }

  try {
    await auth.register({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    $q.notify({
      message: "Registration was great boyy!",
      color: "green-4",
      textColor: "green-4",
    });
    router.push("/dashboard");
  } catch (err) {
    $q.notify({
      message: err.message || "failed man  damn!",
      color: "red",
      textColor: "red",
    });
  }
}
</script>

<style lang="scss">
input {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  height: 40px;
  width: 30vh;
  transition: 0.5s;
}
input:hover {
  border-radius: 16px;
}
input:focus {
  outline: none;
  box-shadow: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.submit-button {
  padding: 0.6em 2em;
  border: none;
  outline: none;
  color: rgb(255, 255, 255);
  background: navy;
  cursor: pointer;
  position: relative;
  z-index: 0;
  border-radius: 10px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.submit-button:before {
  content: "";
  background: linear-gradient(
    45deg,
    #ff0000,
    #ff7300,
    #fffb00,
    #48ff00,
    #00ffd5,
    #002bff,
    #7a00ff,
    #ff00c8,
    #ff0000
  );
  position: absolute;
  top: -2px;
  left: -2px;
  background-size: 400%;
  z-index: -1;
  filter: blur(5px);
  -webkit-filter: blur(5px);
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  animation: glowing-submit-button 20s linear infinite;
  transition: opacity 0.3s ease-in-out;
  border-radius: 10px;
}

@keyframes glowing-submit-button {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}

.submit-button:after {
  z-index: -1;
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgb(1, 1, 83);
  left: 0;
  top: 0;
  border-radius: 10px;
}
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.background {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(3px);
  position: relative;
  opacity: 0.95;
}
.log {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  justify-content: space-evenly;
  width: 30vw;
  min-width: fit-content;
  padding: 25px;
  height: 40vh;
  position: absolute;
  z-index: 1;
  top: 25%;
  left: 35%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.inputs-div {
  display: flex;
  height: 20vh;
  align-items: center;
  flex-direction: column;
  text-align: center;
  justify-content: space-between;
}
.icon {
  position: absolute;
  z-index: 1;
  top: 17%;
  left: 48%;
}
.createAccount {
  position: absolute;
  z-index: 1;
  top: 60%;
  left: 36%;
  color: rgb(136, 136, 138);
  max-height: 30px;
}

.create-account {
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
  margin-top: 0%;
}

.create-account:hover {
  color: #0056b3;
  text-decoration: none;
}
h6 {
  margin: 0%;
}
</style>
