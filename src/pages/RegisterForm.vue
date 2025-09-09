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
        <h4 style="margin: 10px; color: #1d232d; cursor: default">Register</h4>
        <form class="inputs-div" @submit.prevent="doRegister">
          <input v-model="data.name" type="text" placeholder="Name" required />
          <input v-model="data.email" type="email" placeholder="email" />
          <input v-model="data.password" placeholder="Password" required />

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
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/store/authStore";

const auth = useAuthStore();
const $q = useQuasar();

const router = useRouter();

const data = reactive({
  name: "",
  email: "",
  password: "",
});
console.log(auth);
function doRegister() {
  if (data.password.length < 8) {
    $q.notify({
      message: " the number should be more that 8",
      color: "orange",
      textColor: "black",
    });
    return;
  }

  return;
}

let users = JSON.parse(localStorage.getItem("users")) || [];

users.push({ ...data });
localStorage.setItem("users", JSON.stringify(users));

if (users.length === 0) {
  console.log("هیچ کاربری وجود ندارد، ثبت‌نام کنید.");
}
$q.notify({
  message: "log in was seceed",
  color: "green-3",
  textColor: "black",
});

data.name = "";
data.email = "";
data.password = "";

router.push("/dashboard");
$q.notify({
  message: " sign in secceed.",
  color: "green-3",
});
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
