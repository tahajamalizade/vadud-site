<template>
  <q-card
    class="my-card"
    style="width: 300px; border-radius: 15px; cursor: pointer"
    @click="$emit('open', project.id)"
  >
    <img src="../assets/wp12412873-minimalist-4k-pc-wallpapers.jpg" />

    <q-card-section>
      <div class="text-h6">{{ project.project }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      {{ project.info }}
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
