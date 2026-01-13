<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NAutoComplete } from 'naive-ui'
import AMapLoader from '@amap/amap-jsapi-loader'

const emit = defineEmits(['select'])

const options = ref<any[]>([])
const searchValue = ref('')
let autoComplete: any = null
let AMapInstance: any = null

onMounted(async () => {
  try {
    const key = import.meta.env.VITE_AMAP_KEY
    if (!key) {
      console.warn('AMap Key is missing')
      return
    }

    AMapInstance = await AMapLoader.load({
      key,
      version: '2.0',
      plugins: ['AMap.AutoComplete', 'AMap.PlaceSearch']
    })

    autoComplete = new AMapInstance.AutoComplete({
      city: '全国',
      datatype: 'all'
    })
  } catch (e) {
    console.error('AMap load failed', e)
  }
})

async function handleSearch(query: string) {
  if (!query || !autoComplete) {
    options.value = []
    return
  }
  
  // 开发环境调试日志
  if (import.meta.env.DEV) {
    console.log('Searching address:', query)
  }

  autoComplete.search(query, (status: string, result: any) => {
    if (import.meta.env.DEV) {
      console.log('Search result:', status, result)
    }
    
    if (status === 'complete' && result.tips) {
      options.value = result.tips
        .filter((tip: any) => tip.id && tip.location) // 确保有ID和坐标
        .map((tip: any) => ({
          label: `${tip.name} - ${tip.district || ''}${typeof tip.address === 'string' ? tip.address : ''}`,
          value: tip.name, // 使用名称作为value，避免选中后显示ID
          data: tip
        }))
    } else {
      options.value = []
    }
  })
}

function handleSelect(value: string) {
  // 根据 label 或 value 查找选中项
  const selectedOption = options.value.find(opt => opt.value === value)
  const selectedTip = selectedOption?.data
  
  if (selectedTip) {
    emit('select', {
      name: selectedTip.name,
      address: typeof selectedTip.address === 'string' ? selectedTip.address : selectedTip.district,
      city: parseCity(selectedTip.district),
      district: selectedTip.district,
      location: selectedTip.location
    })
    // 选中后保持显示名称
    searchValue.value = selectedTip.name
  }
}

// 简单的城市解析逻辑
function parseCity(district: string): string {
  if (district.includes('市')) {
    const match = district.match(/.*?(省|自治区)?(.*?)市/)
    return match ? match[2] : district
  }
  return district.split(' ')[0] || ''
}
</script>

<template>
  <div class="address-picker">
    <NAutoComplete
      v-model:value="searchValue"
      :options="options"
      placeholder="输入餐厅名称或地址进行搜索"
      clearable
      :menu-props="{ class: 'address-picker-menu' }"
      @search="handleSearch"
      @select="handleSelect"

    />
  </div>
</template>

<style scoped>
.address-picker {
  width: 100%;
}
</style>

<style>
/* 全局样式确保下拉菜单可见 */
.address-picker-menu {
  z-index: 20000 !important;
  max-height: 300px;
}

/* 强制覆盖可能的 overflow 问题 */
.n-auto-complete-menu .n-base-select-menu {
  display: block !important;
}
</style>
