<script setup lang="ts">
import { NInput } from 'naive-ui'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const filterStore = useFilterStore()
const { searchKeyword } = storeToRefs(filterStore)

// 本地输入值，用于即时显示
const localInput = ref(searchKeyword.value)

// 防抖定时器
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// 防抖更新到 store (300ms)
watch(localInput, (newValue) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    searchKeyword.value = newValue
  }, 300)
})
</script>

<template>
  <NInput
    v-model:value="localInput"
    placeholder="🔍 搜索餐厅名称、地址..."
    clearable
    size="large"
    style="width: 100%; max-width: 600px"
  />
</template>
