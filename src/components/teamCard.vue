<template>
  <div class="">
    <q-card class="my-card">
      <div class="text-subtitle2 absolute-top text-center">{{ team.name }}</div>
    </q-card>
  </div>
</template>
<script setup>
import { defineProps } from "vue";

const props = defineProps({
  team: { 
    type: Object,
    required: true,
  },
});
</script>
