<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { NInput, NCard, NScrollbar } from 'naive-ui'
import AMapLoader from '@amap/amap-jsapi-loader'

const emit = defineEmits(['select'])

const options = ref<any[]>([])
const searchValue = ref('')
const showDropdown = ref(false)
let autoComplete: any = null
let AMapInstance: any = null
let searchTimeout: ReturnType<typeof setTimeout> | null = null

onMounted(async () => {
  try {
    const key = import.meta.env.VITE_AMAP_KEY
    const securityJsCode = import.meta.env.VITE_AMAP_SECRET
    
    if (!key) {
      console.warn('[AddressPicker] AMap Key is missing')
      return
    }

    // 高德地图 2.0 需要安全密钥
    if (securityJsCode && !(window as any)._AMapSecurityConfig) {
      (window as any)._AMapSecurityConfig = {
        securityJsCode,
      }
    }

    console.log('[AddressPicker] Loading AMap...')
    AMapInstance = await AMapLoader.load({
      key,
      version: '2.0',
      plugins: ['AMap.AutoComplete', 'AMap.PlaceSearch']
    })

    autoComplete = new AMapInstance.AutoComplete({
      city: '全国',
      datatype: 'all'
    })
    console.log('[AddressPicker] AMap loaded, autoComplete ready')
  } catch (e) {
    console.error('[AddressPicker] AMap load failed', e)
  }
})

// 使用 watch 监听输入变化，带防抖
watch(searchValue, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  if (!newValue || newValue.trim().length === 0) {
    options.value = []
    showDropdown.value = false
    return
  }
  
  // 300ms 防抖
  searchTimeout = setTimeout(() => {
    performSearch(newValue.trim())
  }, 300)
})

function performSearch(query: string) {
  if (!autoComplete) {
    console.warn('[AddressPicker] autoComplete not ready')
    return
  }

  console.log('[AddressPicker] Searching:', query)

  autoComplete.search(query, (status: string, result: any) => {
    console.log('[AddressPicker] Result:', status, result)
    
    if (status === 'complete' && result.tips) {
      options.value = result.tips
        .filter((tip: any) => tip.id && tip.location)
        .map((tip: any) => ({
          label: `${tip.name} - ${tip.district || ''}${typeof tip.address === 'string' ? tip.address : ''}`,
          value: tip.name,
          data: tip
        }))
      showDropdown.value = options.value.length > 0
      console.log('[AddressPicker] Found', options.value.length, 'results')
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
