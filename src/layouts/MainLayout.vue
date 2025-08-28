<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header elevated class="bg-blue-9">
      <q-toolbar>
        <q-toolbar-title style="cursor: default" class="flex flex-center text-blue-3">
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

<style>
</style>
