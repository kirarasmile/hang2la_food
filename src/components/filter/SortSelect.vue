<script setup lang="ts">
import { NSelect } from 'naive-ui'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'

const filterStore = useFilterStore()
const { sortBy } = storeToRefs(filterStore)

const sortOptions = [
  { label: '🔥 热度优先', value: 'popular' },
  { label: '🕐 最新优先', value: 'newest' },
  { label: '💰 价格升序', value: 'price-asc' },
  { label: '💸 价格降序', value: 'price-desc' }
]
</script>

<template>
  <NSelect 
    v-model:value="sortBy" 
    :options="sortOptions" 
    placeholder="排序方式"
    :consistent-menu-width="false"
    style="min-width: 140px"
  />
</template>
