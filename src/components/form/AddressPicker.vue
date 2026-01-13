<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NInput, NCard, NScrollbar } from 'naive-ui'
import AMapLoader from '@amap/amap-jsapi-loader'

const emit = defineEmits(['select'])

const options = ref<any[]>([])
const searchValue = ref('')
const showDropdown = ref(false)
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
  searchValue.value = query
  if (!query || !autoComplete) {
    options.value = []
    showDropdown.value = false
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
      // 只有真正有结果时才显示下拉框
      showDropdown.value = options.value.length > 0
    } else {
      options.value = []
      showDropdown.value = false
    }
  })
}

function handleSelect(option: any) {
  const selectedTip = option.data
  
  if (selectedTip) {
    // 高德地图 location 是 LngLat 对象，需要用 getLng()/getLat() 方法获取
    const loc = selectedTip.location
    emit('select', {
      name: selectedTip.name,
      address: typeof selectedTip.address === 'string' ? selectedTip.address : selectedTip.district,
      city: parseCity(selectedTip.district),
      district: selectedTip.district,
      // 转换为普通对象，确保 lat/lng 属性可访问
      location: {
        lng: typeof loc.getLng === 'function' ? loc.getLng() : loc.lng,
        lat: typeof loc.getLat === 'function' ? loc.getLat() : loc.lat
      }
    })
    // 选中后保持显示名称
    searchValue.value = selectedTip.name
    showDropdown.value = false
  }
}

function handleFocus() {
  if (searchValue.value && options.value.length > 0) {
    showDropdown.value = true
  }
}

function handleBlur() {
  // 延时关闭，以便点击事件能被触发
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
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
    <NInput
      v-model:value="searchValue"
      placeholder="输入餐厅名称或地址进行搜索"
      clearable
      @input="handleSearch"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    
    <div v-show="showDropdown && options.length > 0" class="picker-dropdown">
      <NCard content-style="padding: 0;" :bordered="true">
        <NScrollbar style="max-height: 300px">
          <ul class="options-list">
            <li
              v-for="option in options"
              :key="option.data.id"
              class="option-item"
              @mousedown="handleSelect(option)"
            >
              <div class="option-name">{{ option.data.name }}</div>
              <div class="option-address">
                {{ option.data.district }}{{ typeof option.data.address === 'string' ? option.data.address : '' }}
              </div>
            </li>
          </ul>
        </NScrollbar>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.address-picker {
  position: relative;
  width: 100%;
}

.picker-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 4px;
  z-index: 20000;
}

.loading-state {
  padding: 12px;
  display: flex;
  justify-content: center;
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.option-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.option-item:hover {
  background-color: rgba(255, 255, 255, 0.09);
}

.option-name {
  font-size: 14px;
  color: var(--n-text-color);
  font-weight: 500;
}

.option-address {
  font-size: 12px;
  color: var(--n-text-color-3);
  margin-top: 2px;
}
</style>
