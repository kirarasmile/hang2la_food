<script setup lang="ts">
import { darkTheme, NConfigProvider, NGlobalStyle, NMessageProvider, NDialogProvider, NNotificationProvider, NLoadingBarProvider } from 'naive-ui'
import { RouterView } from 'vue-router'
</script>

<template>
  <NConfigProvider :theme="darkTheme">
    <NGlobalStyle />
    <NLoadingBarProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <NDialogProvider>
            <RouterView />
          </NDialogProvider>
        </NMessageProvider>
      </NNotificationProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>

<style>
#app {
  min-height: 100vh;
}
</style>
