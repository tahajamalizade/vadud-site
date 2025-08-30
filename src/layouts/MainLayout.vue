<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-purple-7">
      <q-toolbar>
        <q-toolbar-title
          style="cursor: default"
          class="flex flex-center text-purple-2"
        >
          Vdud
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
defineOptions({
  name: "MainLayout",
});
</script>

<style></style>
