<script setup lang="ts">
import { NSelect } from 'naive-ui'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'

const filterStore = useFilterStore()
const { selectedCity } = storeToRefs(filterStore)

const cityOptions = [
  { label: '全国', value: '' },
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' },
  { label: '杭州', value: '杭州' },
  { label: '成都', value: '成都' },
  { label: '武汉', value: '武汉' },
  { label: '西安', value: '西安' },
  { label: '其他', value: 'other' }
]
</script>

<template>
  <NSelect 
    v-model:value="selectedCity" 
    :options="cityOptions" 
    placeholder="选择城市"
    :consistent-menu-width="false"
    style="min-width: 120px"
  />
</template>
