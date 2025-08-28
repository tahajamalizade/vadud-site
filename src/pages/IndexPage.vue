<template>
  <q-page class="flex" style="height: 100vh; width: 100vw">
    <div class="background">
      <div class="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path
            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"
          ></path>
        </svg>
      </div>

      <div class="log">
        <h4 style="margin: 10px; color: #1d232d; cursor: default">Login</h4>
        <form class="inputs-div" @submit.prevent="doLog">
          <input
            v-model="loginData.phone"
            type="tel"
            placeholder="Phone Number"
            required
            pattern="[0-9]*"
          />
          <input
            v-model="loginData.password"
            type="password"
            placeholder="Password"
            required
          />
          <button class="submit-button" type="submit">LOGIN</button>
        </form>
      </div>

      <div class="createAccount">
        <router-link to="/register" class="create-account">
          <h6>Don't have an account?</h6>
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
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const router = useRouter();
const $q = useQuasar();

const loginData = reactive({
  phone: "",
  password: "",
});

function doLog() {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (u) => u.phone === loginData.phone && u.password === loginData.password
  );

  if (user) {
    $q.notify({
      message: "Login succeded boyy",
      color: "green-3",
      textColor: "black",
    });
    router.push("/dashboard");
  } else {
    $q.notify({
      message: "number or pass is wrong",
      color: "red",
      textColor: "white",
    });
  }

  loginData.phone = "";
  loginData.password = "";
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
}

.create-account {
  display: inline-block;
  color: #007bff;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.create-account:hover {
  color: #0056b3;
  text-decoration: none;
}
</style>
