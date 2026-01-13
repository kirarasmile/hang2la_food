<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef, watch } from 'vue'
import { NButton, NIcon, NSpace, useMessage, NSpin } from 'naive-ui'
import { useRouter } from 'vue-router'
import { ArrowBackOutline, RefreshOutline, LocateOutline } from '@vicons/ionicons5'
import AMapLoader from '@amap/amap-jsapi-loader'
import FilterBar from '@/components/filter/FilterBar.vue'
import { useFilter } from '@/composables/useFilter'
import { TIER_CONFIG } from '@/types'
import type { Restaurant } from '@/types'
import { supabase } from '@/api/supabase'

const router = useRouter()
const message = useMessage()

// 地图实例
const map = shallowRef<any>(null)
const AMap = shallowRef<any>(null)
const markers = ref<any[]>([])
const mapReady = ref(false)

// 视野联动筛选
const viewportFilterEnabled = ref(true)
const visibleRestaurants = ref<Restaurant[]>([])

// 餐厅数据
const restaurants = ref<Restaurant[]>([])
const loading = ref(false)

// 模拟数据 (用于手动配置完成前的预览)
const mockData: Restaurant[] = [
  {
    id: '1',
    name: '海底捞火锅',
    tier: 'hang',
    category: 'hotpot',
    price_per_person: 120,
    address: '上海市黄浦区南京东路123号',
    city: '上海',
    latitude: 31.235929,
    longitude: 121.485708,
    created_by: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false
  },
  {
    id: '5',
    name: '星巴克',
    tier: 'elite',
    category: 'drinks',
    price_per_person: 40,
    address: '北京市朝阳区建国门外大街1号',
    city: '北京',
    latitude: 39.908718,
    longitude: 116.453472,
    created_by: 'demo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false
  }
]

// 应用筛选
const { filteredRestaurants } = useFilter(restaurants)

// 初始化地图
onMounted(async () => {
  await fetchRestaurants()
  await initMap()
})

onUnmounted(() => {
  if (map.value) {
    map.value.destroy()
  }
})

// 监听筛选结果变化
watch(filteredRestaurants, () => {
  filterByViewport()
}, { deep: true })

// 监听可见餐厅变化来更新标记
watch(visibleRestaurants, () => {
  updateMarkers()
}, { deep: true })

async function fetchRestaurants() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_deleted', false)
    
    if (error) throw error
    
    if (data && data.length > 0) {
      restaurants.value = data as any
    } else {
      restaurants.value = mockData
    }
  } catch (error: any) {
    console.warn('Fetch from Supabase failed, using mock data:', error.message)
    restaurants.value = mockData
  } finally {
    loading.value = false
  }
}

async function initMap() {
  try {
    const key = import.meta.env.VITE_AMAP_KEY
    const securityJsCode = import.meta.env.VITE_AMAP_SECRET
    
    if (!key) {
      message.error('未配置高德地图 Key')
      return
    }

    // 设置安全密钥 (高德地图 2.0 必须)
    if (securityJsCode) {
      (window as any)._AMapSecurityConfig = {
        securityJsCode,
      }
    }

    AMap.value = await AMapLoader.load({
      key,
      version: '2.0',
      plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation']
    })

    // 获取当前位置
    const geolocation = new AMap.value.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      offset: [10, 20],
      zoomToAccuracy: true,
      position: 'RB'
    })

    // 使用 Promise 封装定位
    const getCurrentPosition = () => {
      return new Promise<{ lng: number, lat: number } | null>((resolve) => {
        geolocation.getCurrentPosition((status: string, result: any) => {
          if (status === 'complete') {
            resolve({ lng: result.position.lng, lat: result.position.lat })
          } else {
            resolve(null)
          }
        })
      })
    }

    // 等待定位结果
    const position = await getCurrentPosition()
    
    // 初始化地图，如果定位成功使用定位坐标，否则使用默认上海坐标
    const center = position ? [position.lng, position.lat] : [121.4737, 31.2304]
    
    map.value = new AMap.value.Map('map-container', {
      viewMode: '3D',
      zoom: position ? 15 : 11,
      center: center,
      theme: 'amap://styles/dark'
    })

    map.value.addControl(new AMap.value.ToolBar())
    map.value.addControl(new AMap.value.Scale())
    map.value.addControl(geolocation)
    
    // 监听地图移动结束事件，实现视野联动筛选
    map.value.on('moveend', () => {
      filterByViewport()
    })
    map.value.on('zoomend', () => {
      filterByViewport()
    })
    
    mapReady.value = true
    filterByViewport()
  } catch (e) {
    console.error('Map init failed', e)
    // 即使失败，也至少显示地图（虽然可能为空）
    mapReady.value = true 
  }
}

// 根据当前视野筛选餐厅
function filterByViewport() {
  if (!map.value || !viewportFilterEnabled.value) {
    visibleRestaurants.value = filteredRestaurants.value
    return
  }

  const bounds = map.value.getBounds()
  if (!bounds) {
    visibleRestaurants.value = filteredRestaurants.value
    return
  }

  const ne = bounds.getNorthEast() // 东北角
  const sw = bounds.getSouthWest() // 西南角

  visibleRestaurants.value = filteredRestaurants.value.filter(res => {
    if (!res.longitude || !res.latitude) return false
    return (
      res.longitude >= sw.lng &&
      res.longitude <= ne.lng &&
      res.latitude >= sw.lat &&
      res.latitude <= ne.lat
    )
  })
}

// 切换视野联动
function toggleViewportFilter() {
  viewportFilterEnabled.value = !viewportFilterEnabled.value
  if (viewportFilterEnabled.value) {
    filterByViewport()
  } else {
    visibleRestaurants.value = filteredRestaurants.value
  }
}

// 更新标记点
function updateMarkers() {
  if (!map.value || !AMap.value) return

  // 清除旧标记
  markers.value.forEach(m => m.setMap(null))
  markers.value = []

  // 添加新标记 (使用视野筛选后的餐厅)
  visibleRestaurants.value.forEach(res => {
    if (res.longitude && res.latitude) {
      const tierConfig = TIER_CONFIG[res.tier]
      
      const marker = new AMap.value.Marker({
        position: [res.longitude, res.latitude],
        title: res.name,
        content: createMarkerContent(tierConfig.emoji, tierConfig.color),
        offset: new AMap.value.Pixel(-15, -15)
      })

      marker.on('click', () => {
        showInfoWindow(res)
      })

      marker.setMap(map.value)
      markers.value.push(marker)
    }
  })
}

function createMarkerContent(emoji: string, color: string) {
  return `<div class="custom-marker" style="background-color: ${color}">
    <span class="marker-emoji">${emoji}</span>
  </div>`
}

function showInfoWindow(res: Restaurant) {
  const content = `
    <div class="info-window">
      <h4>${res.name}</h4>
      <p>评级: ${TIER_CONFIG[res.tier].emoji} ${TIER_CONFIG[res.tier].label}</p>
      <p>价格: ¥${res.price_per_person}/人</p>
      <p>地址: ${res.address}</p>
    </div>
  `
  
  const infoWindow = new AMap.value.InfoWindow({
    content,
    offset: new AMap.value.Pixel(0, -30)
  })

  infoWindow.open(map.value, [res.longitude, res.latitude])
}

function handleBack() {
  router.push('/')
}
</script>

<template>
  <div class="map-page">
    <header class="page-header">
      <NSpace align="center">
        <NButton quaternary circle @click="handleBack">
          <template #icon><NIcon><ArrowBackOutline /></NIcon></template>
        </NButton>
        <h1 class="page-title">美食地图</h1>
      </NSpace>
      
      <NSpace>
        <NButton 
          :type="viewportFilterEnabled ? 'primary' : 'default'"
          secondary 
          @click="toggleViewportFilter"
        >
          <template #icon><NIcon><LocateOutline /></NIcon></template>
          {{ viewportFilterEnabled ? '视野联动开' : '视野联动关' }}
        </NButton>
        <NButton secondary @click="fetchRestaurants">
          <template #icon><NIcon><RefreshOutline /></NIcon></template>
          刷新数据
        </NButton>
      </NSpace>
    </header>

    <div class="filter-wrapper">
      <FilterBar />
      <div class="viewport-info">
        当前视野: {{ visibleRestaurants.length }} / {{ filteredRestaurants.length }} 家餐厅
      </div>
    </div>

    <div class="map-wrapper">
      <div v-if="!mapReady" class="map-loading">
        <NSpin size="large" description="正在定位中..." />
      </div>
      <div v-show="mapReady" id="map-container" class="map-container"></div>
    </div>
  </div>
</template>

<style scoped>
.map-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
}

.page-header {
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(10px);
  z-index: 100;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.filter-wrapper {
  padding: 0 20px 12px;
  background-color: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(10px);
  z-index: 90;
}

.viewport-info {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  text-align: right;
}

.map-wrapper {
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.map-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  color: #fff;
}

.map-container {
  flex: 1;
  width: 100%;
  height: 100%;
}

:deep(.custom-marker) {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

:deep(.marker-emoji) {
  transform: rotate(45deg);
  font-size: 16px;
}

:deep(.info-window) {
  color: #333;
  padding: 10px;
  min-width: 200px;
}

:deep(.info-window h4) {
  margin: 0 0 8px;
  font-size: 16px;
}

:deep(.info-window p) {
  margin: 4px 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .page-header {
    padding: 10px 12px;
  }
  
  .filter-wrapper {
    padding: 0 12px 8px;
  }
}
</style>
