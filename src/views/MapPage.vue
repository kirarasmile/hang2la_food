<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef, watch } from 'vue'
import { NButton, NIcon, NSpace, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { ArrowBackOutline, RefreshOutline } from '@vicons/ionicons5'
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

    map.value = new AMap.value.Map('map-container', {
      viewMode: '3D',
      zoom: 11,
      center: [121.4737, 31.2304], // 默认上海
      theme: 'amap://styles/dark'
    })

    map.value.addControl(new AMap.value.ToolBar())
    map.value.addControl(new AMap.value.Scale())
    
    // 自动定位
    const geolocation = new AMap.value.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      offset: [10, 20],
      zoomToAccuracy: true,
      position: 'RB'
    })
    map.value.addControl(geolocation)
    geolocation.getCurrentPosition((status: string, result: any) => {
      if (status === 'complete') {
        map.value.setCenter([result.position.lng, result.position.lat])
        map.value.setZoom(15)
      }
    })

    updateMarkers()
  } catch (e) {
    console.error('Map init failed', e)
  }
}

// 更新标记点
function updateMarkers() {
  if (!map.value || !AMap.value) return

  // 清除旧标记
  markers.value.forEach(m => m.setMap(null))
  markers.value = []

  // 添加新标记
  filteredRestaurants.value.forEach(res => {
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

  // 如果有标记，自适应视野
  if (markers.value.length > 0) {
    map.value.setFitView()
  }
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
        <NButton secondary @click="fetchRestaurants">
          <template #icon><NIcon><RefreshOutline /></NIcon></template>
          刷新数据
        </NButton>
      </NSpace>
    </header>

    <div class="filter-wrapper">
      <FilterBar />
    </div>

    <div id="map-container" class="map-container"></div>
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

.map-container {
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
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
