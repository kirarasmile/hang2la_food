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
      city: '全国'
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

  autoComplete.search(query, (status: string, result: any) => {
    if (status === 'complete' && result.tips) {
      options.value = result.tips
        .filter((tip: any) => tip.adcode) // 过滤掉没有行政区划代码的结果
        .map((tip: any) => ({
          label: `${tip.name} (${tip.district}${tip.address})`,
          value: tip.id,
          data: tip
        }))
    }
  })
}

function handleSelect(value: string) {
  const selectedTip = options.value.find(opt => opt.value === value)?.data
  if (selectedTip) {
    emit('select', {
      name: selectedTip.name,
      address: selectedTip.address || selectedTip.name,
      city: parseCity(selectedTip.district),
      district: selectedTip.district,
      location: selectedTip.location
    })
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
      :menu-props="{ style: { zIndex: 9999 } }"
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
