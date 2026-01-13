<script setup lang="ts">
import { NCheckboxGroup, NCheckbox, NSpace } from 'naive-ui'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import { TIER_CONFIG, type TierRating } from '@/types'

const filterStore = useFilterStore()
const { selectedTiers } = storeToRefs(filterStore)

const tierOptions = Object.entries(TIER_CONFIG).map(([value, config]) => ({
  value: value as TierRating,
  label: `${config.emoji} ${config.label}`,
  color: config.color
}))
</script>

<template>
  <NCheckboxGroup v-model:value="selectedTiers">
    <NSpace>
      <NCheckbox 
        v-for="tier in tierOptions" 
        :key="tier.value" 
        :value="tier.value"
        :style="{ '--tier-color': tier.color }"
      >
        <span class="tier-checkbox-label">{{ tier.label }}</span>
      </NCheckbox>
    </NSpace>
  </NCheckboxGroup>
</template>

<style scoped>
.tier-checkbox-label {
  font-size: 14px;
  font-weight: 500;
}

:deep(.n-checkbox.n-checkbox--checked .n-checkbox__box) {
  background-color: var(--tier-color);
  border-color: var(--tier-color);
}
</style>
