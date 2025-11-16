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
      <h6>{{ project.description }}</h6>
      <h6>Team: {{ project.team.name }}</h6>
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


<style>
h6{
  margin: 0px;
  padding: 0%;
}
</style>
