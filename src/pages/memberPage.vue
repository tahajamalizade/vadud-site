<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="text-center q-mb-md">
      <q-icon
        @click="profileDialog = true"
        name="account_circle"
        size="lg"
        style="cursor: pointer"
        color="pink-3"
      />
      <h4 class="q-mt-none q-mb-sm">My Kanban Board</h4>
      <p class="text-subtitle1">All tasks assigned to you</p>
    </div>

    <div class="row q-col-gutter-md no-wrap scroll" style="overflow-x: auto">
      <div
        v-for="(col, index) in columns"
        :key="col.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        :style="{ minWidth: '280px' }"
      >
        <q-card
          flat
          class="q-pa-sm rounded-borders column-card"
          :style="{
            backgroundColor: columnColors[index % columnColors.length],
          }"
        >
          <div class="row items-center q-mb-sm">
            <div class="col text-bold">{{ col.title }}</div>
          </div>

          <draggable
            v-model="col.tasks"
            group="kanban"
            item-key="id"
            class="column-tasks q-gutter-sm q-pa-md"
            @change="onTaskChange"
          >
            <template #item="{ element: task }">
              <q-card
                flat
                bordered
                class="q-pa-sm rounded-borders cursor-pointer bg-white"
                @click="openTask(task)"
              >
                <div class="text-body2">{{ task.title }}</div>
                <div class="text-caption text-grey-6">
                  Project: {{ task.project?.name }}
                </div>
              </q-card>
            </template>
          </draggable>
        </q-card>
      </div>
    </div>
  </q-page>

  <q-dialog v-model="taskopen">
    <q-card flat bordered style="min-width: 400px" class="rounded-borders">
      <q-card-section class="q-pa-lg">
        <div class="text-h6 text-purple-6 q-pa-md">
          <p>Task: {{ selecttass?.title }}</p>
        </div>

        <q-input
          dense
          outlined
          v-model="selecttass.title"
          label="Title"
          class="q-mb-sm"
        />

        <q-input
          dense
          outlined
          v-model="selecttass.description"
          label="Description"
          autogrow
          type="textarea"
          class="q-mb-sm"
        />

        <q-select
          dense
          outlined
          v-model="selecttass.status"
          :options="['TODO', 'IN_PROGRESS', 'DONE']"
          label="Status"
          class="col-6"
        />

        <q-select
          dense
          outlined
          v-model="selecttass.assigneeId"
          :options="allUsers"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          label="Assignee"
          class="q-mb-sm"
        />

        <q-input
          dense
          outlined
          v-model="selecttass.dueDate"
          label="Due Date"
          mask="####-##-##"
          hint="Format: YYYY-MM-DD"
          class="q-mb-sm"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="selecttass.dueDate" mask="YYYY-MM-DD" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- <q-input
          dense
          outlined
          v-model="selecttass.comments"
          label="Comments"
          autogrow
          type="textarea"
          class="q-mb-sm"
        /> -->
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" v-close-popup />
        <q-btn flat label="Save" color="primary" @click="saveTask" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="profileDialog" persistent>
    <q-card style="min-width: 400px; border-radius: 20px">
      <q-card-section>
        <div class="text-h6">Profile Info</div>
      </q-card-section>

      <q-card-section>
        <h6 v-if="authStore.user">
          name : {{ authStore.user.name }} <br />
          email : {{ authStore.user.email }}
        </h6>
      </q-card-section>

      <q-card-section style="padding-left: 20px">
        <q-btn class="shadow-10 rounded-borders" @click="logout">Logout</q-btn>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="grey" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import draggable from "vuedraggable";
import { useTaskStore } from "../store/tasksStore";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "vue-router";

const $q = useQuasar();
const taskopen = ref(false);
const selecttass = ref(null);
const profileDialog = ref(false);

const taskStore = useTaskStore();
const authStore = useAuthStore();
const router = useRouter();

const currentUserEditable = ref({ name: "", email: "", password: "" });

const allUsers = computed(() => authStore.getUsers);

const columns = ref([
  { id: "TODO", title: "TODO", tasks: [] },
  { id: "IN_PROGRESS", title: "IN_PROGRESS", tasks: [] },
  { id: "DONE", title: "DONE", tasks: [] },
]);

// Note: Removed `newColumnTitle` and `newTaskTitle` as members can't create columns/tasks

onMounted(async () => {
  try {
    await taskStore.fetchMyTasks();

    // Check if the user is an admin or manager before fetching all users
    if (
      authStore.user?.role === "ADMIN" ||
      authStore.user?.role === "MANAGER"
    ) {
      await authStore.fetchAllUsers();
    }

    groupTasksByStatus();
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Failed to load your tasks.",
    });
  }
});

watch(
  () => taskStore.tasks,
  () => {
    groupTasksByStatus();
  },
  { deep: true }
);

function onTaskChange(event) {
  if (event.added || event.moved) {
    const movedTask = event.added?.element || event.moved?.element;
    if (movedTask) {
      // Find the column the task was dropped into
      const newColumn = columns.value.find((col) =>
        col.tasks.some((task) => task.id === movedTask.id)
      );

      // Check if the task's status has actually changed
      if (newColumn && newColumn.id !== movedTask.status) {
        updateTaskStatus(movedTask.id, newColumn.id);
      }
    }
  }
}

async function updateTaskStatus(taskId, newStatus) {
  try {
    await taskStore.updateTask({
      taskId,
      input: { status: newStatus },
    });
    $q.notify({ type: "positive", message: "Task status updated." });
  } catch (error) {
    console.error("Failed to update task status:", error);
    $q.notify({ type: "negative", message: "Failed to update task status." });
  }
}

function groupTasksByStatus() {
  columns.value.forEach((col) => (col.tasks = []));

  taskStore.tasks.forEach((task) => {
    const col = columns.value.find((c) => c.id === task.status);
    if (col) {
      col.tasks.push(task);
    }
  });
}

async function openTask(task) {
  // ... (Your existing openTask logic)
}

async function saveTask() {
  // ... (Your existing saveTask logic)
}

// Remove `addTask`, `removeTask`, `addColumn`, etc. as members should not have these permissions

const columnColors = ["#ffe0b2", "#c8e6c9", "#bbdefb", "#f8bbd0", "#d1c4e9"];

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
</script>

<style scoped>
/* Your existing styles */
</style>
