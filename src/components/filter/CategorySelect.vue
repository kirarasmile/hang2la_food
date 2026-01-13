<script setup lang="ts">
import { NSelect } from 'naive-ui'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import { CATEGORY_CONFIG, type FoodCategory } from '@/types'

const filterStore = useFilterStore()
const { selectedCategories } = storeToRefs(filterStore)

const categoryOptions = Object.entries(CATEGORY_CONFIG).map(([value, config]) => ({
  label: `${config.emoji} ${config.label}`,
  value: value as FoodCategory
}))
</script>

<template>
  <NSelect 
    v-model:value="selectedCategories" 
    :options="categoryOptions" 
    placeholder="选择分类"
    multiple
    :consistent-menu-width="false"
    max-tag-count="responsive"
    style="min-width: 160px"
  />
</template>
