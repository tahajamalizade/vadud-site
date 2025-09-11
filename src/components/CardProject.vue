<template>
  <q-card
    class="shadow-20 rounded-borders q-ma-md"
    style="width: 250px; border-radius: 15px; cursor: pointer"
    @click="$emit('open', project.id)"
  >
    <img src="../assets/wp12412873-minimalist-4k-pc-wallpapers.jpg" />

    <q-card-section>
      <div class="text-h6">{{ project.name }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      {{ project.description }}
    </q-card-section>
  </q-card>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>
