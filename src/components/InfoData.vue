<template>
  <q-card
    class="my-card text-black shadow-20 rounded-borders"
    style="background-color: azure; width: 14vw; border-radius: 30px"
  >
    <q-card-section class="card">
      <div class="flex flex-center">
        <q-icon color="blue-5" name="circle" />
        All Tasks:
      </div>
      <div class="text-h6 flex flex-center">
        {{ completedTasksCount }} Tasks
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  completedTasksCount: {
    type: Number,
    required: true,
  },
});
</script>

<style>
.card {
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}
</style>
