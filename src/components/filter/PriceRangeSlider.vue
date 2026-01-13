<script setup lang="ts">
import { NRadioGroup, NRadio, NSpace } from 'naive-ui'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'

const filterStore = useFilterStore()
const { selectedPriceRange } = storeToRefs(filterStore)

const priceRanges = [
  { label: '全部', value: '' },
  { label: '¥0-50', value: '0-50' },
  { label: '¥50-100', value: '50-100' },
  { label: '¥100-200', value: '100-200' },
  { label: '¥200-500', value: '200-500' },
  { label: '¥500+', value: '500+' }
]
</script>

<template>
  <NRadioGroup v-model:value="selectedPriceRange" name="price-range">
    <NSpace>
      <NRadio
        v-for="range in priceRanges"
        :key="range.value"
        :value="range.value"
      >
        {{ range.label }}
      </NRadio>
    </NSpace>
  </NRadioGroup>
</template>

<style scoped>
:deep(.n-radio) {
  font-size: 14px;
}
</style>
