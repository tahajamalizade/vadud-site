<template>
  <q-page>
    <div class="header">
      <p class="flex flex-center q-ma-md">{{ formatDate }}</p>
      <h4 class="flex flex-start q-ma-md">dashboard</h4>
    </div>
    <div class="tabs">
      <div>
        <q-page padding>
          <q-tabs
            v-model="tab"
            dense
            class="text-black"
            active-color="purple-8"
            indicator-color="purple-8"
            align="justify"
            style="border-radius: 30px"
          >
            <q-tab name="one" label="Dashboard" />
            <q-tab name="two" label="projects" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" style="border-radius: 30px">
            <!-- TODO:this is the tab 1 -->
            <q-tab-panel name="one">
              <div
                style="
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: space-evenly;
                "
              >
                <info-data />
                <info-data />
                <info-data />
                <info-data />
              </div>
              <br />
              <q-separator />
              <div class="flex row q-ma-lg items-start">
                <div class="column q-mr-xl">
                  <p style="height: fit-content">
                    Monthly productivity activity
                  </p>
                  <line-chart />
                </div>
                <div
                  class="flex column q-pa-sm"
                  style="height: fit-content; width: 50%"
                >
                  <p class="text-h6 flex-center">tasks distribution</p>

                  <div class="flex row justify-around q-mt-sm">
                    <li
                      v-for="distribution in distributions"
                      :key="distribution"
                      class="text-h6 list-none"
                    >
                      <span class="text-grey">{{ distribution.priority }}</span
                      >: {{ distribution.value }}
                    </li>
                  </div>
                </div>
              </div>
              <h6 class="q-ma-sm">poeple</h6>
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
                    style="min-width: 120px"
                  />
                </template>
              </q-table>
            </q-tab-panel>
            <!-- TODO:this is the tab 2 -->
            <q-tab-panel name="two">
              <h6 class="q-ma-md">procjects</h6>
              <div class="flex flex-start">
                <q-icon name="person" size="md"></q-icon>
                <h6 style="height: fit-content; margin: 0; padding-left: 10px">
                  Your Boards
                </h6>
              </div>
              <div class="q-pa-md flex" style="justify-content: space-evenly">
                <card-project
                  v-for="proj in projects"
                  :key="proj.id"
                  :project="proj"
                  @open="openId"
                />
              </div>
              <div class="flex flex-start q-ma-md">
                <q-icon name="people" size="md"></q-icon>
                <h6 style="height: fit-content; margin: 0; padding-left: 10px">
                  Your Boards
                </h6>
              </div>
            </q-tab-panel>
          </q-tab-panels>
          <q-separator />
        </q-page>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref } from "vue";
import { useDateFormat, useNow } from "@vueuse/core";
import { useRouter } from "vue-router";
import InfoData from "src/components/InfoData.vue";
import LineChart from "src/components/LineChart.vue";
import CardProject from "src/components/CardProject.vue";

const formatDate = useDateFormat(useNow(), "dddd MMMM D YYYY");

const tab = ref("one");

const router = useRouter();

const distributions = ref([
  { priority: "high", value: "22" },
  { priority: "medium", value: 232 },
  { priority: "low", value: 212 },
]);

const statusOptions = ["Bad", "Good", "Excellent"];

const tasks = [
  {
    id: 1,
    name: "taha",
    assigned: "22",
    compeleted: "finished",
    department: "company",
    status: "Bad",
  },
  {
    id: 2,
    name: "mamd",
    assigned: "22",
    compeleted: "finished",
    department: "company",
    status: "Good",
  },
  {
    id: 3,
    name: "reza",
    assigned: "22",
    compeleted: "finished",
    department: "company",
    status: "Excellent",
  },
];

const projects = [
  { project: "project one", id: 132, info: "Lorem messi" },
  { project: "project tow", id: 345, info: "roooooooo" },
  {
    project: "project three",
    id: 12345678,
    info: "calling cuase youre better now",
  },
];
const openId = (id) => {
  router.push(`/project/${id}`);
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  background-color: rgb(240, 240, 240);
  overflow-x: hidden;
}
.header {
  display: block;
  border: 3px solid rgb(224, 224, 224);
  border-radius: 30px;
  height: 120px;
  margin: 0%;
}
h4 {
  margin-top: 20px;
}
.tabs {
  display: block;
  width: 100vw;
  height: 600px;
  z-index: 1;
}
li {
  list-style-type: none;
}
.q-table {
  background: #fff;
  border-radius: 8px;
}
.q-table .q-tr {
  transition: background 0.2s;
}
.q-table .q-tr:hover {
  background: #f5f5f5;
}
</style>
