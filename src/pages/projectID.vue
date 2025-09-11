<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header -->
    <div class="text-center q-mb-md">
      <h4 class="q-mt-none q-mb-sm">Project Management</h4>
    </div>

    <q-card flat bordered class="q-pa-md q-mb-md rounded-borders shadow-20">
      <div class="flex flex-center row items-center q-gutter-sm q-ma-md">
        <q-input
          v-model="newColumnTitle"
          label="New column"
          dense
          outlined
          class="col-12 col-sm-4 shadow-20 rounded-borders"
        />
        <q-btn
          color="purple-5"
          class="shadow-20 rounded-borders"
          flat
          icon="add"
          label="Add"
          @click="addColumn"
        />
      </div>
    </q-card>

    <!-- Kanban Board -->
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
            <div class="row items-center q-gutter-sm q-mb-sm">
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

          <!-- Tasks -->
          <draggable
            v-model="col.tasks"
            group="kanban"
            item-key="id"
            class="column-tasks q-gutter-sm q-pa-md"
            @end="persist"
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
  </q-page>
  <q-dialog v-model="taskopen">
    <q-card flat bordered style="min-width: 400px" class="rounded-borders">
      <q-card-section class="q-pa-lg">
        <div class="text-h6 text-purple-6 q-pa-md">
          <p>task:{{ selecttass.title }}</p>
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

        <div class="row q-col-gutter-md q-mb-sm">
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
            v-model="selecttass.priority"
            :options="['Low', 'Medium', 'High']"
            label="Priority"
            class="col-6"
          />
        </div>

        <q-input
          dense
          outlined
          v-model="selecttass.assignee"
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

        <q-input
          dense
          outlined
          v-model="selecttass.comments"
          label="Comments"
          autogrow
          type="textarea"
          class="q-mb-sm"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" v-close-popup />
        <q-btn flat label="Save" color="primary" @click="saveTask" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { uid, useQuasar } from "quasar";
import draggable from "vuedraggable";
import { useRoute } from "vue-router";
import { useTaskStore } from "../store/tasksStore"; // Adjust the path as needed

const $q = useQuasar();
const route = useRoute();
const projectId = route.params.id;

const taskopen = ref(false);
const selecttass = ref(null);

// 1. Initialize the Pinia store
const taskStore = useTaskStore();

// Reactive reference for columns, will be populated from the store
const columns = ref([
  { id: "TODO", title: "TODO", tasks: [] },
  { id: "IN_PROGRESS", title: "IN_PROGRESS", tasks: [] },
  { id: "DONE", title: "DONE", tasks: [] },
]);

const newColumnTitle = ref("");
const newTaskTitle = reactive({});

// 2. Fetch tasks when the component is mounted
onMounted(async () => {
  if (projectId) {
    try {
      // Use the fetchTasks action from the store
      await taskStore.fetchTasks(projectId);
      // Group the fetched tasks into columns
      groupTasksByStatus();
    } catch (error) {
      $q.notify({
        type: "negative",
        message: "Failed to load tasks.",
      });
    }
  }
});

// Watch for changes in the store's tasks and re-group them
watch(
  () => taskStore.tasks,
  () => {
    groupTasksByStatus();
  },
  { deep: true }
);

// Helper function to group tasks by their status
function groupTasksByStatus() {
  // Clear existing tasks from local columns
  columns.value.forEach((col) => (col.tasks = []));

  // Group tasks from the store into the appropriate column
  taskStore.tasks.forEach((task) => {
    const col = columns.value.find(
      (c) =>
        c.title.toLowerCase().replace(" ", "-") ===
        task.status.toLowerCase().replace(" ", "-")
    );
    if (col) {
      col.tasks.push(task);
    }
  });
}

function persist() {
  // The 'persist' function is no longer needed in its old form because
  // changes are now persisted via GraphQL mutations.
  // We can use it to notify the user.
  $q.notify({ message: "Saved", color: "positive", icon: "check_circle" });
}

async function addColumn() {
  const title = newColumnTitle.value.trim();
  if (!title)
    return $q.notify({ type: "warning", message: "Column title is required" });

  // Note: Your GraphQL schema doesn't seem to have a mutation for adding columns.
  // This logic will still rely on local state for now.
  columns.value.push({ id: uid(), title, tasks: [] });
  newColumnTitle.value = "";
}

function removeColumn(id) {
  // Similarly, no GraphQL mutation for this.
  columns.value = columns.value.filter((c) => c.id !== id);
}

function renameColumn(col) {
  // No GraphQL mutation for this either.
  $q.dialog({
    title: "Rename column",
    prompt: { model: col.title, type: "text" },
    cancel: true,
  }).onOk((val) => (col.title = val));
}

async function addTask(columnId) {
  const title = newTaskTitle[columnId]?.trim();
  if (!title) return;
  const col = columns.value.find((c) => c.id === columnId);
  if (!col) return;

  try {
    // 3. Call the createTask action from the store
    const newTask = await taskStore.createTask({
      projectId,
      input: {
        title,
        status: col.title,
      },
    });
    // The task will be automatically added to the store and the watcher will update the view.
    newTaskTitle[columnId] = "";
    $q.notify({ type: "positive", message: "Task created successfully." });
  } catch (error) {
    $q.notify({ type: "negative", message: "Failed to create task." });
  }
}

async function removeTask(columnId, taskId) {
  try {
    // 4. Call the deleteTask action from the store
    await taskStore.deleteTask(taskId);
    $q.notify({ type: "positive", message: "Task deleted successfully." });
  } catch (error) {
    $q.notify({ type: "negative", message: "Failed to delete task." });
  }
}

function openTask(task) {
  selecttass.value = { ...task }; // Use a copy to avoid immediate mutation
  taskopen.value = true;
}

async function saveTask() {
  if (!selecttass.value || !selecttass.value.id) return;
  try {
    // 5. Call the updateTask action from the store
    await taskStore.updateTask({
      taskId: selecttass.value.id,
      input: {
        title: selecttass.value.title,
        description: selecttass.value.description,
        status: selecttass.value.status,
      },
    });
    taskopen.value = false;
    $q.notify({ type: "positive", message: "Task updated successfully." });
  } catch (error) {
    $q.notify({ type: "negative", message: "Failed to save changes." });
  }
}

// 6. Handle drag-and-drop
async function onDragEnd(event) {
  // This event is from the draggable component.
  // It provides the new list, the old index, and the new index.
  // We need to find the moved task and update its status.
  const updatedColumns = columns.value;
  const movedTask = updatedColumns
    .map((col) => col.tasks)
    .flat()
    .find((task) => task.id === event.item.dataset.taskId);
  const newColumn = updatedColumns.find((col) => col.tasks.includes(movedTask));

  if (movedTask && newColumn) {
    try {
      await taskStore.updateTask({
        taskId: movedTask.id,
        input: { status: newColumn.title },
      });
      $q.notify({ type: "positive", message: "Task status updated." });
    } catch (error) {
      $q.notify({ type: "negative", message: "Failed to update task status." });
    }
  }
}

const columnColors = ["#ffe0b2", "#c8e6c9", "#bbdefb", "#f8bbd0", "#d1c4e9"];
</script>

<style scoped>
.column-card {
  border-radius: 12px;
  padding: 12px;
}

.column-tasks {
  min-height: 40px;
}

.q-btn {
  border-radius: 10px;
}
</style>
