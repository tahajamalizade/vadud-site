<template>
  <q-page class="q-pa-md">
    <div class="flex justify-between items-center q-mb-md">
      <h5>My Projects</h5>
      <q-icon
        name="account_circle"
        size="lg"
        color="pink-3"
        style="cursor: pointer"
        @click="openProfileDialog"
      />
    </div>

    <!-- Profile Dialog -->
    <q-dialog v-model="profileDialog" persistent>
      <q-card style="min-width: 400px; border-radius: 20px">
        <q-card-section>
          <div class="text-h6">Profile Info</div>
        </q-card-section>

        <q-card-section>
          <div v-if="authStore.user">
            <p><strong>Name:</strong> {{ authStore.user.name }}</p>
            <p><strong>Email:</strong> {{ authStore.user.email }}</p>
          </div>
          <div v-else>No user info available.</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Logout" color="red" @click="logout" />
          <q-btn flat label="Close" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-card flat bordered class="q-pa-md bg-white rounded-borders shadow-2">
      <q-card-section>
        <div v-if="loading" class="text-center text-grey q-my-md">
          <q-spinner color="primary" size="2em" />
          <div>Loading your projects...</div>
        </div>

        <div v-else-if="projects.length">
          <q-list bordered separator>
            <q-item
              v-for="project in projects"
              :key="project.id"
              clickable
              @click="goToProjectKanban(project.id)"
            >
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ project.name }}
                </q-item-label>
                <q-item-label caption>
                  Created:
                  {{ new Date(Number(project.createdAt)).toLocaleDateString() }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="folder_open" color="primary" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div v-else class="text-center text-grey q-my-lg">
          No projects found for your account.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "src/store/authStore";
import { useProjectStore } from "src/store/projectStore";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const projectStore = useProjectStore();

const $q = useQuasar();
const router = useRouter();

const profileDialog = ref(false);
const projects = ref([]);
const loading = ref(false);

const openProfileDialog = () => (profileDialog.value = true);

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    router.push("/login");
    return;
  }

  loading.value = true;
  try {
    await projectStore.fetchMyProjects();
    projects.value = projectStore.projects;
  } catch (err) {
    console.error("Error fetching projects:", err);
    $q.notify({
      color: "negative",
      position: "top",
      message: "Failed to load your projects.",
    });
  } finally {
    loading.value = false;
  }
});

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


const goToProjectKanban = (projectId) => {
  router.push(`/project/${projectId}/kanban`);
};
</script>
