<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="text-center q-mb-md">
      <h4 class="q-mt-none q-mb-sm">Project Management</h4>
    </div>

    <q-card flat bordered class="q-pa-md q-mb-md rounded-borders shadow-20">
      <div class="flex flex-center row items-center q-gutter-sm q-ma-md"></div>
    </q-card>
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
            <q-input
              v-model="col.title"
              dense
              borderless
              class="col text-bold"
              @blur="persist"
            />
            <q-btn dense flat round color="purple-6" icon="more_vert" size="sm">
              <q-menu>
                <q-list style="min-width: 160px">
                  <q-item clickable v-close-popup @click="renameColumn(col)">
                    <q-item-section avatar>
                      <q-icon name="edit" />
                    </q-item-section>
                    <q-item-section>Rename</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="removeColumn(col.id)">
                    <q-item-section avatar>
                      <q-icon name="delete" />
                    </q-item-section>
                    <q-item-section class="text-negative"
                      >Delete</q-item-section
                    >
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <q-form @submit.prevent="addTask(col.id)">
            <div class="row items-center q-gutter-sm q-mb-sm q-my-lg">
              <q-input
                v-model="newTaskTitle[col.id]"
                dense
                outlined
                placeholder="New task..."
                class="col"
              />
              <q-btn type="submit" flat dense icon="add" color="purple-4" />
            </div>
          </q-form>

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
                <div class="row items-center justify-between">
                  <div class="text-body2">{{ task.title }}</div>
                  <q-btn
                    dense
                    flat
                    round
                    icon="delete"
                    color="negative"
                    size="sm"
                    @click.stop="removeTask(col.id, task.id)"
                  />
                </div>
              </q-card>
            </template>
          </draggable>
        </q-card>
      </div>
    </div>

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
            :options="teamMembers"
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
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveTask" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import draggable from "vuedraggable";
import { useRoute } from "vue-router";
import { useTaskStore } from "../store/tasksStore";
import { useAuthStore } from "../store/authStore";
import { useTeamStore } from "../store/teamStore";

const $q = useQuasar();
const route = useRoute();
const projectId = route.params.id;

const taskopen = ref(false);
const selecttass = ref(null);

const taskStore = useTaskStore();
const authStore = useAuthStore();
const teamStore = useTeamStore();

const columns = ref([
  { id: "TODO", title: "TODO", tasks: [] },
  { id: "IN_PROGRESS", title: "IN_PROGRESS", tasks: [] },
  { id: "DONE", title: "DONE", tasks: [] },
]);

const newTaskTitle = reactive({});

const projectTeamId = ref(null);
const teamMembers = ref([]);

onMounted(async () => {
  if (projectId) {
    try {
      await teamStore.fetchTeams();

      let projectFound = false;
      let projectTeamId = null;

      for (const team of teamStore.teams) {
        if (team.projects) {
          const project = team.projects.find((p) => p.id === projectId);
          if (project) {
            projectTeamId = team.id;
            projectFound = true;
            break;
          }
        }
      }

      if (projectFound) {
        const team = teamStore.teams.find((t) => t.id === projectTeamId);
        if (team) {
          teamMembers.value = team.members;
        }

        await taskStore.fetchTasks(projectId);
        groupTasksByStatus();
      } else {
        $q.notify({
          type: "negative",
          message: "Project not found or you don't have access.",
        });
      }
    } catch (error) {
      $q.notify({
        type: "negative",
        message: "Failed to load project data. Please try again.",
      });
    }
  }
});

watch(
  () => taskStore.tasks,
  () => {
    groupTasksByStatus();
  },
  { deep: true }
);

function groupTasksByStatus() {
  columns.value.forEach((col) => (col.tasks = []));

  taskStore.tasks.forEach((task) => {
    const col = columns.value.find((c) => c.id === task.status);
    if (col) {
      col.tasks.push(task);
    }
  });
}

async function addTask(columnId) {
  const title = newTaskTitle[columnId]?.trim();
  if (!title) return;
  const col = columns.value.find((c) => c.id === columnId);
  if (!col) return;

  try {
    const newTask = await taskStore.createTask({
      projectId,
      input: {
        title,
        status: col.id,
      },
    });
    newTaskTitle[columnId] = "";

    $q.notify({
      type: "positive",
      message: `Task **'${newTask.title}'** created successfully.`,
      html: true,
    });
  } catch (error) {
    $q.notify({ type: "negative", message: "Failed to create task." });
  }
}

async function removeTask(columnId, taskId) {
  try {
    await taskStore.deleteTask(taskId);
    $q.notify({ type: "positive", message: "Task deleted successfully." });
  } catch (error) {
    $q.notify({ type: "#bbdefb", message: "Failed to delete task." });
  }
}

async function openTask(task) {
  try {
    const fullTask = await taskStore.fetchTask(task.id);

    selecttass.value = {
      ...fullTask,
      assigneeId: fullTask.assignee ? fullTask.assignee.id : null,
      dueDate: fullTask.dueDate
        ? new Date(Number(fullTask.dueDate)).toISOString().split("T")[0]
        : null,
    };
    taskopen.value = true;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Failed to load full task details.",
    });
  }
}

async function saveTask() {
  if (!selecttass.value || !selecttass.value.id) return;

  try {
    await taskStore.updateTask({
      taskId: selecttass.value.id,
      input: {
        title: selecttass.value.title,
        description: selecttass.value.description,
        status: selecttass.value.status,
        assigneeId: selecttass.value.assigneeId,
        dueDate: selecttass.value.dueDate
          ? new Date(selecttass.value.dueDate).toISOString()
          : null,
      },
    });

    taskopen.value = false;
    $q.notify({ type: "positive", message: "Task updated successfully." });
    console.log(selecttass.value.dueDate);
  } catch (error) {
    $q.notify({ type: "negative", message: "Failed to save changes." });
  }
}

function onTaskChange(event) {
  if (event.added || event.moved) {
    const movedTask = event.added?.element || event.moved?.element;
    if (movedTask) {
      const newColumn = columns.value.find((col) =>
        col.tasks.some((task) => task.id === movedTask.id)
      );

      if (newColumn && newColumn.id !== movedTask.status) {
        updateTaskStatus(movedTask.id, newColumn.id);
      }
    }
  }
}

async function updateTaskStatus(taskId, newStatus) {
  let taskTitle = "Unknown Task";

  for (const col of columns.value) {
    const task = col.tasks.find((t) => t.id === taskId);
    if (task) {
      taskTitle = task.title;
      break;
    }
  }

  const newColumn = columns.value.find((col) => col.id === newStatus);
  const newColumnTitle = newColumn ? newColumn.title : "an unknown status";

  try {
    await taskStore.updateTask({
      taskId,
      input: { status: newStatus },
    });

    $q.notify({
      type: "positive",
      message: `Task **'${taskTitle}'** moved to **'${newColumnTitle}'**.`,
      html: true,
    });
  } catch (error) {
    $q.notify({ type: "negative", message: "Failed to update task status." });
  }
}

const columnColors = ["#ffe0b2", "#c8e6c9", "#bbdefb", "#f8bbd0", "#d1c4e9"];
</script>

<style scoped>
.q-page {
  background-color: #f7f9fc;
}

.q-card.shadow-20 {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
h4 {
  color: #6a1b9a;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.scroll {
  padding-bottom: 20px;
}

.column-card {
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.column-card:hover {
  transform: translateY(-4px);
}

.column-card .q-input.text-bold {
  font-size: 1.25rem;
  color: #4a148c;
  padding-left: 0;
}

.q-form .q-input {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.q-form .q-btn {
  transition: color 0.2s;
}

.column-tasks {
  min-height: 40px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
}

.column-tasks .q-card {
  border: 1px solid #d1c4e9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.column-tasks .q-card:hover {
  box-shadow: 0 4px 12px rgba(179, 157, 219, 0.5);
  border-color: #9575cd;
}

.q-btn {
  border-radius: 8px;
}

.q-dialog .q-card {
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
.q-dialog .text-h6 {
  padding: 8px 16px;
  border-bottom: 2px solid #e1bee7;
  margin-bottom: 15px;
}
</style>
