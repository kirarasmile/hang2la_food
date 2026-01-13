<script setup lang="ts">
import { darkTheme, NConfigProvider, NGlobalStyle } from 'naive-ui'
import { RouterView } from 'vue-router'
</script>

<template>
  <NConfigProvider :theme="darkTheme">
    <NGlobalStyle />
    <RouterView />
  </NConfigProvider>
</template>

<style>
#app {
  min-height: 100vh;
}
</style>
