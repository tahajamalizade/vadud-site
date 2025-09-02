<template>
  <q-page>

    <!-- Header -->
    <div class="flex items-center justify-between" style="border: 3px solid #e0e0e0; border-radius: 30px; height: 120px; padding: 0 16px;">
      <h4 class="q-ma-none">Dashboard</h4>
      <p class="q-ma-none">{{ formatDate }}</p>
      <q-icon @click="profileDialog = true" name="account_circle" size="lg" style="cursor:pointer" />
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <q-page padding>
        <q-tabs
          v-model="tab"
          dense
          class="text-black"
          active-color="purple-8"
          indicator-color="purple-8"
          align="justify"
          style="border-radius:30px;"
        >
          <q-tab name="one" label="Dashboard" />
          <q-tab name="two" label="Projects" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" style="border-radius:30px;">

          <!-- Tab 1: Dashboard -->
          <q-tab-panel name="one">
            <div class="flex flex-wrap justify-evenly">
              <info-data />
              <info-data />
              <info-data />
              <info-data />
            </div>

            <q-separator class="q-my-md" />

            <div class="flex row q-ma-lg items-start">
              <!-- Monthly chart -->
              <div class="column q-mr-xl">
                <p>Monthly productivity activity</p>
                <line-chart />
              </div>

              <!-- Task distribution -->
              <div class="flex column q-pa-sm" style="width:50%;">
                <p class="text-h6 flex-center">Tasks Distribution</p>
                <div class="flex row justify-around q-mt-sm">
                  <li v-for="d in distributions" :key="d.priority" class="text-h6 list-none">
                    <span class="text-grey">{{ d.priority }}</span>: {{ d.value }}
                  </li>
                </div>
              </div>
            </div>

            <h6 class="q-ma-sm">People</h6>
            <q-table
              :rows="tasks"
              :columns="columns"
              row-key="id"
              flat
              dense
              bordered
              separator="horizontal"
              class="shadow-1"
            >
              <template v-slot:body-cell-status="props">
                <q-select
                  v-model="props.row.status"
                  :options="statusOptions"
                  dense
                  outlined
                  hide-dropdown-icon
                  style="min-width:120px;"
                />
              </template>
            </q-table>
          </q-tab-panel>

          <!-- Tab 2: Projects -->
          <q-tab-panel name="two">
            <h6>Projects</h6>

            <q-btn
              label="New Project"
              color="purple-8"
              class="q-ma-md"
              rounded
              unelevated
              @click="dialogOpen = true"
            />

            <!-- New Project Dialog -->
            <q-dialog v-model="dialogOpen" persistent>
              <q-card style="min-width:400px; border-radius:20px;">
                <q-card-section>
                  <div class="text-h6">Create New Project</div>
                </q-card-section>

                <q-card-section>
                  <q-input v-model="newProject.project" label="Project Name" outlined dense class="q-mb-sm" />
                  <q-input v-model="newProject.info" label="Project Info" type="textarea" outlined dense />
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="Cancel" color="grey" v-close-popup />
                  <q-btn flat label="Save" color="purple-8" @click="saveProject" />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <!-- User boards -->
            <div class="flex flex-start q-ma-md">
              <q-icon name="person" size="md" />
              <h6 style="padding-left:10px">Your Boards</h6>
            </div>

            <div class="q-pa-md flex" style="justify-content: space-evenly;">
              <card-project
                v-for="proj in projects"
                :key="proj.id"
                :project="proj"
                @click="() => router.push(`/project/${proj.id}`)"
              />
            </div>

            <!-- Team boards -->
            <div class="flex flex-start q-ma-md">
              <q-icon name="people" size="md" />
              <h6 style="padding-left:10px">Team Boards</h6>
            </div>
          </q-tab-panel>

        </q-tab-panels>

        <q-separator />
      </q-page>
    </div>

    <!-- Profile Dialog -->
    <q-dialog v-model="profileDialog" persistent>
      <q-card style="min-width:400px; border-radius:20px;">
        <q-card-section>
          <div class="text-h6">Profile Info</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="currentUserEditable.name" label="User Name" outlined dense class="q-mb-sm" />
          <q-input v-model="currentUserEditable.phone" label="Phone Number" outlined dense class="q-mb-sm" />
          <q-input v-model="currentUserEditable.password" label="Password" type="password" outlined dense />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="grey" v-close-popup />
          <q-btn flat label="Save" color="purple-8" @click="saveProfile" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useDateFormat, useNow } from "@vueuse/core";
import InfoData from "src/components/InfoData.vue";
import LineChart from "src/components/LineChart.vue";
import CardProject from "src/components/CardProject.vue";

const router = useRouter();
const formatDate = useDateFormat(useNow(), "dddd MMMM D YYYY");


const tab = ref("one");
const dialogOpen = ref(false);
const profileDialog = ref(false);

import { useRouter } from "vue-router";
const users = JSON.parse(localStorage.getItem("users")) || [];
const currentUser = ref(users[users.length - 1] || {});
const currentUserEditable = reactive({ ...currentUser.value });

const distributions = ref([
  { priority: "high", value: 22 },
  { priority: "medium", value: 232 },
  { priority: "low", value: 212 }
]);

const statusOptions = ["Bad", "Good", "Excellent"];

const tasks = [
  { id: 1, name: "taha", assigned: 22, compeleted: "finished", department: "company", status: "Bad" },
  { id: 2, name: "mamd", assigned: 22, compeleted: "finished", department: "company", status: "Good" },
  { id: 3, name: "reza", assigned: 22, compeleted: "finished", department: "company", status: "Excellent" }
];

const storedProjects = localStorage.getItem("projects");
const projects = ref(
  storedProjects ? JSON.parse(storedProjects) : [
    { project: "project one", id: 132, info: "Lorem messi" },
    { project: "project two", id: 345, info: "roooooooo" },
    { project: "project three", id: 12345678, info: "calling cause you're better now" }
  ]
);

watch(projects, val => localStorage.setItem("projects", JSON.stringify(val)), { deep: true });

const newProject = ref({ project: "", info: "" });

const saveProject = () => {
  if (newProject.value.project.trim() !== "") {
    projects.value.push({ id: Date.now(), project: newProject.value.project, info: newProject.value.info });
    newProject.value.project = "";
    newProject.value.info = "";
    dialogOpen.value = false;
  }
};

const saveProfile = () => {
  const index = users.findIndex(u => u.phone === currentUser.value.phone);
  if (index !== -1) {
    users[index] = { ...currentUserEditable };
    localStorage.setItem("users", JSON.stringify(users));
    currentUser.value = { ...currentUserEditable };
  }
  profileDialog.value = false;
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  overflow-x: hidden;
}
.tabs { width: 100vw; height: 600px; z-index: 1; }
li { list-style-type: none; }
.q-table { background:#fff; border-radius:8px; }
.q-table .q-tr { transition: background 0.2s; }
.q-table .q-tr:hover { background:#f5f5f5; }
h6 { margin:0; padding:10px; }
</style>
