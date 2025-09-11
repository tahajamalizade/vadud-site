<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <q-img src="../assets/black-community-team-icon-like-group-flat-minimal-trend-teamwork-logotype-graphic-design-element-isolated-yellow-concept-people-connect-organization-sign-human-head-body-silhouette_775815-809.jpg">
        <div class="text-subtitle2 absolute-top text-center">{{ team.name }}</div>
      </q-img>
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
