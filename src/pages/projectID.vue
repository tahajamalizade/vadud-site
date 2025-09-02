<template>
  <q-page class="q-pa-md bg-grey-2">
    <div>
      <h4 class="flex flex-center">project management</h4>
      <div class="text-h5"></div>
      <q-space />
    </div>

    <q-card class="q-pa-md q-mb-md">
      <div class="flex row flex-center q-gutter-sm">
        <q-input
          v-model="newColumnTitle"
          label="New column title"
          dense
          outlined
          class="col-12 col-sm-4"
        />
        <q-btn
          color="purple-3"
          icon="add"
          label="Add Column"
          @click="addColumn"
        />
      </div>
    </q-card>

    <div class="row q-col-gutter-md no-wrap scroll" style="overflow-x: auto">
      <div
        v-for="col in columns"
        :key="col.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        style="min-width: 320px"
      >
        <q-card class="column-card q-pa-sm">
          <div class="row items-center q-gutter-sm q-mb-sm">
            <q-input
              v-model="col.title"
              dense
              standout="bg-grey-3"
              class="col"
              @blur="persist"
            />
            <q-btn dense round flat icon="more_vert">
              <q-menu>
                <q-list style="min-width: 180px">
                  <q-item clickable v-close-popup @click="renameColumn(col)">
                    <q-item-section avatar
                      ><q-icon name="edit"
                    /></q-item-section>
                    <q-item-section>Rename</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="removeColumn(col.id)">
                    <q-item-section avatar
                      ><q-icon name="delete"
                    /></q-item-section>
                    <q-item-section class="text-negative"
                      >Delete column</q-item-section
                    >
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <!-- Add task -->
          <q-form @submit.prevent="addTask(col.id)">
            <div class="row items-center q-gutter-sm q-mb-sm">
              <q-input
                v-model="newTaskTitle[col.id]"
                dense
                outlined
                placeholder="Task title"
                class="col"
              />
              <q-btn type="submit" color="purple-4" dense icon="add" />
            </div>
          </q-form>

          <q-separator class="q-my-sm" />

          <draggable
            v-model="col.tasks"
            group="kanban"
            item-key="id"
            class="column-tasks q-gutter-sm"
            @end="persist"
          >
            <template #item="{ element: task }">
              <q-card
                style="cursor: pointer"
                class="q-pa-sm"
                @click="openTask(task)"
              >
                <div class="row items-center">
                  <div class="col">
                    <div class="text-subtitle2">{{ task.title }}</div>
                  </div>
                  <div class="row items-center q-gutter-xs">
                    <q-btn
                      dense
                      round
                      flat
                      icon="delete"
                      color="red-4"
                      @click.stop="removeTask(col.id, task.id)"
                    />
                  </div>
                </div>
              </q-card>
            </template>
          </draggable>
        </q-card>
      </div>
    </div>
  </q-page>
  <q-dialog v-model="taskopen">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">task:{{ selecttass?.title }}</div>
      </q-card-section>
      <div class="felx flex-center row" style="justify-content: space-evenly">
        <q-input
          rounded
          standout
          dense
          v-model="ronaldo"
          label="description"
          color="purple-4"
          bg-color="white"
          class="q-mt-md"
          input-class="text-black"
        />
        <q-btn color="purple-4" @click="saveDes">+</q-btn>
      </div>

      <q-card-section>
        <p>{{ messi || "No description" }}</p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Close"
          color="primary"
          v-close-popup
          @click="taskopen = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { uid, useQuasar } from "quasar";
import draggable from "vuedraggable";
import { useRoute } from "vue-router";

const $q = useQuasar();
const route = useRoute();
const projectId = route.params.id;

const taskopen = ref(false);
const selecttass = ref(null);

const openTask = (task) => {
  selecttass.value = task;
  taskopen.value = true;
  console.log("Task opened:", task.title);
};
const STORAGE_KEY = `kanban_board_project_${projectId}`;

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch (e) {
    return null;
  }
}

const ronaldo = ref("");
const messi = ref("");

onMounted(() => {
  const saved = localStorage.getItem("messi");
  if (saved) {
    messi.value = saved;
    ronaldo.value = saved;
  }
});

const saveDes = () => {
  messi.value = ronaldo.value;
  localStorage.setItem("messi", ronaldo.value);
};
const columns = ref(
  load() || [
    { id: uid(), title: "Backlog", tasks: [] },
    { id: uid(), title: "In Progress", tasks: [] },
    { id: uid(), title: "Done", tasks: [] },
  ]
);

const newColumnTitle = ref("");
const newTaskTitle = reactive({});

watch(
  columns,
  () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns.value));
  },
  { deep: true }
);

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(columns.value));
  $q.notify({
    message: "Saved",
    timeout: 800,
    icon: "check_circle",
    color: "positive",
  });
}

function clearAll() {
  $q.dialog({
    title: "Clear board",
    message: "Remove all columns and tasks?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    columns.value = [];
    persist();
  });
}

function addColumn() {
  const title = (newColumnTitle.value || "").trim();
  if (!title)
    return $q.notify({ type: "warning", message: "Column title is required" });
  columns.value.push({ id: uid(), title, tasks: [] });
  newColumnTitle.value = "";
}

function removeColumn(id) {
  columns.value = columns.value.filter((c) => c.id !== id);
}

function renameColumn(col) {
  $q.dialog({
    title: "Rename column",
    prompt: { model: col.title, type: "text" },
    cancel: true,
  }).onOk((val) => {
    col.title = val;
  });
}

function addTask(columnId) {
  const title = (newTaskTitle[columnId] || "").trim();
  if (!title) return;
  const col = columns.value.find((c) => c.id === columnId);
  if (!col) return;
  col.tasks.push({ id: uid(), title, description: "" });
  newTaskTitle[columnId] = "";
}

function removeTask(columnId, taskId) {
  const col = columns.value.find((c) => c.id === columnId);
  if (!col) return;
  col.tasks = col.tasks.filter((t) => t.id !== taskId);
}
</script>

<style scoped>
.column-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.column-tasks {
  min-height: 40px;
}
.ellipsis-2-lines {
  display: -webkit-box;

  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
