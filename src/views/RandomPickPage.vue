<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { 
  NButton, NSpace, NCard, NSlider, 
  NCheckboxGroup, NCheckbox, NGrid, NGi, useMessage,
  NCollapse, NCollapseItem
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { ArrowBackOutline, DiceOutline, RefreshOutline } from '@vicons/ionicons5'
import { supabase } from '@/api/supabase'
import { CATEGORY_CONFIG, TIER_CONFIG } from '@/types'
import type { Restaurant, FoodCategory, TierRating } from '@/types'
import { getDistance } from '@/utils/geo'
import RestaurantCard from '@/components/tier/RestaurantCard.vue'
import AMapLoader from '@amap/amap-jsapi-loader'


const router = useRouter()
const message = useMessage()

const loading = ref(true)
const allRestaurants = ref<Restaurant[]>([])
const userLocation = ref<{ lat: number, lng: number } | null>(null)

// 筛选状态
const filters = reactive({
  maxDistance: 2000, // 米
  categories: Object.keys(CATEGORY_CONFIG) as FoodCategory[],
  tiers: Object.keys(TIER_CONFIG) as TierRating[],
  maxPrice: 200
})

// 老虎机状态
const isSpinning = ref(false)
const resultRestaurant = ref<Restaurant | null>(null)

onMounted(async () => {
  await fetchAll()
  await getCurrentLocation()
})

async function fetchAll() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_deleted', false)
    
    if (error) throw error
    allRestaurants.value = data as Restaurant[]
  } catch (error: any) {
    message.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

async function getCurrentLocation() {
  try {
    const key = import.meta.env.VITE_AMAP_KEY
    const securityJsCode = import.meta.env.VITE_AMAP_SECRET
    
    if (securityJsCode && !(window as any)._AMapSecurityConfig) {
      (window as any)._AMapSecurityConfig = { securityJsCode }
    }

    const AMap = await AMapLoader.load({
      key,
      version: '2.0',
      plugins: ['AMap.Geolocation']
    })

    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
    })

    geolocation.getCurrentPosition((status: string, result: any) => {
      if (status === 'complete') {
        userLocation.value = {
          lat: result.position.lat,
          lng: result.position.lng
        }
        console.log('[RandomPick] AMap location success:', userLocation.value)
      } else {
        console.warn('[RandomPick] AMap location failed, falling back to browser:', result)
        fallbackToBrowserLocation()
      }
    })
  } catch (error) {
    console.error('[RandomPick] AMap load failed:', error)
    fallbackToBrowserLocation()
  }
}

function fallbackToBrowserLocation() {
  if (!navigator.geolocation) {
    message.warning('浏览器不支持获取位置')
    return
  }
  
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLocation.value = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      }
      message.info('已使用浏览器定位 (可能存在偏差)')
    },
    (err) => {
      console.error('Geolocation error:', err)
      message.warning('定位失败，将无法使用距离筛选')
    }
  )
}

// 符合筛选条件的餐厅
const filteredPool = computed(() => {
  return allRestaurants.value.filter(res => {
    // 菜系筛选
    if (!filters.categories.includes(res.category)) return false
    
    // 评分筛选
    if (!filters.tiers.includes(res.tier)) return false

    // 价格筛选
    if (res.price_per_person > filters.maxPrice) return false

    // 距离筛选 (如果有定位)
    if (userLocation.value && res.latitude && res.longitude) {
      const dist = getDistance(userLocation.value.lat, userLocation.value.lng, res.latitude, res.longitude)
      // 只要距离超过最大距离就过滤掉
      if (dist > filters.maxDistance) return false
    }
    
    return true
  })
})

function startSpin() {
  if (filteredPool.value.length === 0) {
    message.warning('没有符合条件的餐厅，请放宽筛选条件')
    return
  }
  
  if (isSpinning.value) return
  
  isSpinning.value = true
  resultRestaurant.value = null
  
  // 构造滚动列表：随机打乱池子，并重复几次以产生滚动效果
  const pool = [...filteredPool.value].sort(() => Math.random() - 0.5)
  // 我们需要足够长的列表来产生视觉上的“无限”滚动
  // 目标索引在列表末尾附近
  const target = pool[Math.floor(Math.random() * pool.length)]
  
  // 模拟动画：
  // 实际上我们会定格在 target。这里简单处理逻辑：
  // 1. 设置动画状态
  // 2. 延迟几秒后显示结果
  
  setTimeout(() => {
    isSpinning.value = false
    resultRestaurant.value = target
  }, 3000)
}

function handleBack() {
  router.push('/')
}
</script>

<template>
  <div class="random-pick-page">
    <header class="page-header">
      <NSpace align="center">
        <NButton quaternary circle @click="handleBack">
          <template #icon><ArrowBackOutline /></template>
        </NButton>
        <h1 class="page-title">今天吃什么？</h1>
      </NSpace>
    </header>

    <main class="content-wrapper">
      <NGrid :cols="24" :x-gap="24" :y-gap="24" responsive="screen">
        <!-- 筛选面板 -->
        <NGi span="24 m:8">
          <NCard title="⚙️ 筛选偏好" :bordered="false" class="filter-card">
            <NCollapse :default-expanded-names="['filters']" arrow-placement="right">
              <NCollapseItem title="点击修改偏好" name="filters">
                <template #header-extra>
                  <span class="filter-summary">距离/价格/评分</span>
                </template>
                <NSpace vertical :size="16" class="filter-items-container">
                  <div class="filter-item">
                    <div class="filter-label">最大距离: {{ filters.maxDistance }}m</div>
                    <NSlider v-model:value="filters.maxDistance" :min="500" :max="5000" :step="100" />
                  </div>

                  <div class="filter-item">
                    <div class="filter-label">最高人均: ¥{{ filters.maxPrice }}</div>
                    <NSlider v-model:value="filters.maxPrice" :min="0" :max="500" :step="10" />
                  </div>

                  <div class="filter-item">
                    <div class="filter-label">评分偏好:</div>
                    <NCheckboxGroup v-model:value="filters.tiers">
                      <NGrid :cols="3">
                        <NGi v-for="(config, key) in TIER_CONFIG" :key="key">
                          <NCheckbox :value="key" :label="config.emoji + ' ' + config.label" />
                        </NGi>
                      </NGrid>
                    </NCheckboxGroup>
                  </div>

                  <div class="filter-item">
                    <div class="filter-label">菜系偏好:</div>
                    <NCheckboxGroup v-model:value="filters.categories">
                      <NGrid :cols="2">
                        <NGi v-for="(config, key) in CATEGORY_CONFIG" :key="key">
                          <NCheckbox :value="key" :label="config.emoji + ' ' + config.label" />
                        </NGi>
                      </NGrid>
                    </NCheckboxGroup>
                  </div>
                </NSpace>
              </NCollapseItem>
            </NCollapse>
            
            <NButton 
              type="primary" 
              block 
              size="large" 
              @click="startSpin" 
              :loading="isSpinning"
              class="spin-button"
            >
              <template #icon><DiceOutline /></template>
              开始随机挑选
            </NButton>
          </NCard>
        </NGi>

        <!-- 展示面板 -->
        <NGi span="24 m:16">
          <div class="display-container">
            <!-- 初始状态 -->
            <div v-if="!isSpinning && !resultRestaurant" class="placeholder-state">
              <div class="dice-animation">🎲</div>
              <h2>点击按钮，帮您做决定！</h2>
              <p>我们将从符合条件的 {{ filteredPool.length }} 家餐厅中随机挑选</p>
            </div>

            <!-- 动画状态 (老虎机) -->
            <div v-if="isSpinning" class="slot-machine">
              <div class="slot-track">
                <div v-for="i in 10" :key="i" class="slot-item">
                  <div class="mock-card">
                    <span class="mock-emoji">🍜</span>
                    <span class="mock-text">挑选搜索中...</span>
                  </div>
                </div>
              </div>
              <div class="slot-overlay"></div>
            </div>

            <!-- 结果状态 -->
            <div v-if="resultRestaurant" class="result-state">
              <div class="congrats-text">就是它了！🎉</div>
              <div class="result-card-wrapper">
                <RestaurantCard :restaurant="resultRestaurant" :user-location="userLocation" />
              </div>
              <NButton quaternary @click="startSpin" class="retry-btn">
                <template #icon><RefreshOutline /></template>
                不满意？再抽一次
              </NButton>
            </div>
          </div>
        </NGi>
      </NGrid>
    </main>
  </div>
</template>

<style scoped>
.random-pick-page {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding: 20px;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 24px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-card {
  background-color: var(--bg-secondary);
  border-radius: 16px;
}

.filter-label {
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

.spin-button {
  height: 56px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 12px;
  margin-top: 20px;
  background: linear-gradient(135deg, #18a058 0%, #0c7a43 100%);
  box-shadow: 0 4px 12px rgba(24, 160, 88, 0.3);
}

.filter-summary {
  font-size: 12px;
  color: var(--text-tertiary);
  opacity: 0.6;
}

.filter-items-container {
  padding: 8px 0;
}

.display-container {
  height: 500px;
  background-color: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.placeholder-state {
  text-align: center;
  color: var(--text-secondary);
}

.dice-animation {
  font-size: 80px;
  animation: rotate 2s infinite linear;
  margin-bottom: 20px;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 老虎机动画效果 */
.slot-machine {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.slot-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slot-scroll 0.5s infinite linear;
}

@keyframes slot-scroll {
  0% { transform: translateY(0); }
  100% { transform: translateY(-300px); }
}

.slot-item {
  height: 150px;
  width: 100%;
  max-width: 400px;
  padding: 10px;
}

.mock-card {
  height: 100%;
  width: 100%;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  filter: blur(2px);
}

.slot-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    var(--bg-primary) 0%,
    transparent 20%,
    transparent 80%,
    var(--bg-primary) 100%
  );
  pointer-events: none;
}

/* 结果展示 */
.result-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: scale-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scale-up {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.congrats-text {
  font-size: 24px;
  font-weight: 800;
  color: #18a058;
  margin-bottom: 24px;
  text-shadow: 0 0 20px rgba(24, 160, 88, 0.4);
}

.result-card-wrapper {
  transform: scale(1.1);
  margin-bottom: 40px;
}

.retry-btn {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .random-pick-page {
    padding: 12px;
  }
  .page-header {
    margin-bottom: 12px;
  }
  .display-container {
    height: 380px;
    margin-top: 12px;
    border-radius: 16px;
  }
  .result-card-wrapper {
    transform: scale(0.95);
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .spin-button {
    height: 48px;
    font-size: 16px;
    margin-top: 12px;
  }
}
</style>
