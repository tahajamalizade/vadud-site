<template>
  <q-page>
    <div
      class="flex items-center justify-between shadow-4 rounded-borders"
      style="
        border: 3px solid #e0e0e0;
        border-radius: 30px;
        height: 120px;
        padding: 0 16px;
        cursor: default;
      "
    >
      <h5 class="q-ma-none text-italic text-weight-medium">Dashboard</h5>
      <p
        class="q-ma-none text-subtitle1 shadow-4 rounded-borders"
        style="
          border: 2px solid #f700ff;
          padding: 5px 10px;
          border-radius: 30px;
          cursor: default;
        "
      >
        {{ formatDate }}
      </p>
      <q-icon
        @click="profileDialog = true"
        name="account_circle"
        size="lg"
        style="cursor: pointer"
        color="pink-3"
      />
    </div>

    <div class="tabs">
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
          <q-tab name="two" label="Projects" />
        </q-tabs>

        <q-separator />

        <q-tab-panels color="grey-2" v-model="tab" style="border-radius: 30px">
          <q-tab-panel name="one">
            <div class="flex flex-wrap justify-evenly">
              <info-data />
            </div>

            <q-separator class="q-my-lg" />

            <div
              class="flex flex-center shadow-8 rounded-borders q-pa-md bg-white"
            >
              <div class="column q-mr-xl">
                <p class="text-subtitle1 text-weight-medium">
                  🗠 Monthly productivity activity
                </p>
                <line-chart />
              </div>

              <div class="flex column q-pa-sm" style="width: 50%">
                <p class="text-h6 flex-center">Tasks Distribution</p>
                <div class="flex row justify-around q-mt-sm">
                  <li
                    v-for="d in distributions"
                    :key="d.priority"
                    class="text-h6 list-none"
                  >
                    <span class="text-grey">{{ d.priority }}</span
                    >: {{ d.value }}
                  </li>
                </div>
              </div>
            </div>

            <table class="people-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <q-select
                      v-model="user.role"
                      :options="['ADMIN', 'MANAGER', 'MEMBER']"
                      label="Role"
                      dense
                      outlined
                      rounded
                      color="purple-4"
                      popup-content-class="selectmenu"
                      class="mySelect"
                    />
                  </td>
                  <td>
                    <q-btn
                      label="update"
                      color="purple-3"
                      rounded=""
                      @click="updateUserRole(user.id, user.role)"
                      v-if="user.role !== originalRoles[user.id]"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </q-tab-panel>

          <q-tab-panel name="two" class="q-pa-lg">
            <div class="row items-center justify-between q-mb-md">
              <q-icon name="person" size="sm" class="q-mr-sm text-purple-8" />
              <div class="text-subtitle1">Your Boards</div>
              <q-btn
                label="New Project"
                color="purple-8"
                rounded
                unelevated
                size="md"
                icon="add"
                @click="dialogOpen = true"
              />
            </div>

            <q-dialog v-model="dialogOpen" persistent>
              <q-card style="min-width: 400px" class="rounded-borders">
                <q-card-section>
                  <div class="text-h6">Create New Project</div>
                </q-card-section>

                <q-card-section>
                  <q-select
                    v-model="selectedTeamId"
                    :options="teamStore.teams"
                    option-value="id"
                    option-label="name"
                    emit-value
                    map-options
                    label="Select Team"
                    outlined
                    dense
                  />
                  <q-input
                    v-model="newProject.name"
                    label="Project Name"
                    outlined
                    dense
                    class="q-mb-sm"
                  />
                  <q-input
                    v-model="newProject.description"
                    label="Project Info"
                    type="textarea"
                    outlined
                    dense
                  />
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="Cancel" color="grey-7" v-close-popup />
                  <!-- <q-btn
                    flat
                    label="Save"
                    color="purple-8"
                    @click="saveProject"
                    :disable="!selectedTeamId"
                  /> -->
                  <q-btn
                    label="save"
                    color="purple-3"
                    rounded
                    @click="saveProject"
                    :disable="!selectedTeamId"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <div class="row items-center q-mt-lg q-mb-sm"></div>

            <div class="q-pa-md flex" style="justify-content: flex-start">
              <card-project
                v-for="proj in projectStore.projects"
                :key="proj.id"
                :project="proj"
                class="col-12 col-sm-6 col-md-4"
                @click="() => router.push(`/project/${proj.id}`)"
              />
            </div>

            <div class="row items-center justify-between q-mb-md">
              <q-icon name="people" size="sm" class="q-mr-sm text-purple-8" />
              <div class="text-subtitle1">Team Boards</div>
              <q-btn
                label="New Team"
                color="purple-8"
                rounded
                unelevated
                size="md"
                icon="add"
                @click="teamDialogOpen = true"
              />
            </div>

            <div
              class="q-pa-md flex"
              style="justify-content: flex-start; flex-wrap: wrap"
            >
              <div
                v-for="team in teamStore.teams"
                :key="team.id"
                class="col-12 col-sm-6 col-md-4 q-pa-sm"
              >
                <q-card
                  class="q-pa-sm cursor-pointer shadow-6"
                  @click="selectedTeamId = team.id"
                >
                  <div class="text-h6">{{ team.name }}</div>
                </q-card>
              </div>
            </div>

            <q-dialog v-model="teamDialogOpen" persistent>
              <q-card style="min-width: 400px" class="rounded-borders">
                <q-card-section>
                  <div class="text-h6">Create New Team</div>
                </q-card-section>

                <q-card-section>
                  <q-input
                    v-model="newTeamName"
                    label="Team Name"
                    outlined
                    dense
                  />
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="Cancel" color="grey-7" v-close-popup />
                  <q-btn flat label="Save" color="purple-8" @click="saveTeam" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-tab-panel>
        </q-tab-panels>

        <q-separator />
      </q-page>
    </div>

    <q-dialog v-model="profileDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 20px">
        <q-card-section>
          <div class="text-h6">Profile Info</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="currentUserEditable.name"
            label="User Name"
            outlined
            dense
            class="q-mb-sm"
          />
          <q-input
            v-model="currentUserEditable.email"
            label="Email"
            outlined
            dense
            class="q-mb-sm"
          />
          <q-input
            v-model="currentUserEditable.password"
            label="Password"
            type="password"
            outlined
            dense
          />
        </q-card-section>

        <q-card-section style="padding-left: 20px">
          <q-btn class="shadow-10 rounded-borders" @click="logout"
            >Logout</q-btn
          >
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
import { ref, reactive, onMounted, computed } from "vue"; // Import 'computed'
import { useDateFormat, useNow } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useProjectStore } from "../store/projectStore";
import { useTeamStore } from "../store/teamStore";
import { useAuthStore } from "../store/authStore";
import { useQuasar } from "quasar";

import InfoData from "src/components/InfoData.vue";
import LineChart from "src/components/LineChart.vue";
import CardProject from "src/components/CardProject.vue";

const authStore = useAuthStore();
const projectStore = useProjectStore();
const teamStore = useTeamStore();
const router = useRouter();
const $q = useQuasar();

const tab = ref("one");
const dialogOpen = ref(false);
const profileDialog = ref(false);
const teamDialogOpen = ref(false);
const selectedTeamId = ref(null);

const newUser = reactive({
  name: "",
  email: "",
  role: "",
});

const newProject = reactive({
  name: "",
  description: "",
});

const newTeamName = ref("");
const currentUserEditable = ref({ name: "", email: "", password: "" });

const formatDate = useDateFormat(useNow(), "dddd MMMM D YYYY");
const distributions = ref([
  { priority: "high", value: 22 },
  { priority: "medium", value: 232 },
  { priority: "low", value: 212 },
]);

// Use a computed property to get the users from the store

const addNewUser = () => {
  // Logic to add a new user to the database goes here.
  // This would be a mutation to your GraphQL API.
};

const resetNewUserForm = () => {
  newUser.name = "";
  newUser.email = "";
  newUser.role = "";
};

const saveProject = async () => {
  if (!newProject.name.trim()) {
    $q.notify({
      color: "warning",
      message: "Project name is required!",
      position: "top",
    });
    return;
  }

  try {
    await projectStore.createProject({
      teamId: selectedTeamId.value,
      name: newProject.name,
      description: newProject.description,
    });

    await projectStore.fetchProjects(selectedTeamId.value);

    dialogOpen.value = false;
    newProject.name = "";
    newProject.description = "";

    $q.notify({
      color: "positive",
      position: "top",
      message: "Project created successfully!",
    });
  } catch (err) {
    console.error("Error saving project:", err);
    $q.notify({
      color: "negative",
      position: "top",
      message: "Failed to create project. Check console for details.",
    });
  }
};

const saveTeam = async () => {
  if (!newTeamName.value.trim()) return;
  try {
    await teamStore.createTeam(newTeamName.value);
    newTeamName.value = "";
    teamDialogOpen.value = false;
    await teamStore.fetchTeams();
    $q.notify({
      color: "positive",
      position: "top",
      message: "Team created successfully!",
    });
  } catch (err) {
    console.error("Error saving team:", err);
    $q.notify({
      color: "negative",
      position: "top",
      message: "Failed to create team. Check console for details.",
    });
  }
};

const saveProfile = async () => {
  profileDialog.value = false;
  $q.notify({
    color: "info",
    position: "top",
    message: "Profile update not yet implemented.",
  });
};

const logout = () => {
  authStore.token = null;
  authStore.user = null;
  localStorage.removeItem("token");
  router.push("/");
  $q.notify({
    color: "positive",
    position: "top",
    message: "Logged out successfully!",
  });
};
const users = computed(() => authStore.getUsers);

// ... (other functions) ...

const originalRoles = ref({});

const updateUserRole = async (userId, newRole) => {
  try {
    await authStore.updateUserRole(userId, newRole);
    $q.notify({
      color: "positive",
      position: "top",
      message: `User role updated to ${newRole}!`,
    });
    // Update the originalRoles map to reflect the new state
    originalRoles.value[userId] = newRole;
  } catch (error) {
    console.error("Failed to update user role:", error);
    $q.notify({
      color: "negative",
      position: "top",
      message: "Failed to update user role.",
    });
  }
};
onMounted(async () => {
  await authStore.fetchMe();

  if (authStore.isLoggedIn && authStore.user.role === "ADMIN") {
    try {
      await authStore.fetchAllUsers();
      users.value.forEach((user) => {
        originalRoles.value[user.id] = user.role;
      });
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      $q.notify({
        color: "negative",
        position: "top",
        message: "Failed to fetch user list. Are you an admin?",
      });
    }
  }

  // Fetch all teams first
  await teamStore.fetchTeams();

  // Check if there are teams and set a default selectedTeamId
  if (teamStore.teams.length > 0) {
    selectedTeamId.value = teamStore.teams[0].id;
  }

  // Only fetch projects if a team has been selected
  if (selectedTeamId.value) {
    await projectStore.fetchProjects(selectedTeamId.value);
  }
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  overflow-x: hidden;
}
.tabs {
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
h6 {
  margin: 0;
  padding: 10px;
}

.people-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.people-table th,
.people-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.people-table thead th {
  background: #f5f7fa;
  font-weight: 600;
  color: #37474f;
  text-transform: uppercase;
}

.people-table tbody tr:nth-child(even) {
  background: #fafafa;
}

.people-table tbody tr:hover {
  background: #e3f2fd;
  transition: background 0.2s ease;
}

.status-select {
  min-width: 160px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M19 9l-7 7-7-7'></path></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 16px;
}

.status-select:hover {
  border-color: #a855f7;
  box-shadow: 0 2px 6px rgba(168, 85, 247, 0.2);
}

.status-select:focus {
  outline: none;
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.3);
}
.status-select option {
  font-weight: 500;
  padding: 6px 12px;
}

.option-bad {
  color: #dc2626;
  background: #fee2e2;
}

.option-good {
  color: #16a34a;
  background: #dcfce7;
}

.option-excellent {
  color: #2563eb;
  background: #dbeafe;
}

.create-account {
  display: inline-block;
  color: #007bff;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0%;
}
.create-account:hover {
  color: #0056b3;
  text-decoration: none;
}
.selectmenu {
  border-radius: 12px;
  background: #ece0f7;
}
.mySelect {
  max-width: 200px;
}
</style>
