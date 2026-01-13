<script setup lang="ts">
import { NSkeleton, NSpace } from 'naive-ui'
</script>

<template>
  <div class="loading-skeleton">
    <div v-for="i in 5" :key="i" class="skeleton-tier-row">
      <NSkeleton height="200px" width="120px" />
      <NSpace class="skeleton-cards">
        <NSkeleton
          v-for="j in 3"
          :key="j"
          height="200px"
          width="280px"
        />
      </NSpace>
    </div>
  </div>
</template>

<style scoped>
.loading-skeleton {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.skeleton-tier-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  padding: 16px;
  background-color: var(--bg-tier-row);
  border-radius: var(--border-radius);
}

.skeleton-cards {
  display: flex;
  gap: 16px;
  flex: 1;
}
</style>
