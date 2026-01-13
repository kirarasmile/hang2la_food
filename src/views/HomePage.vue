<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NButton, NSpace, NTag, NAvatar, NDropdown, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import FilterBar from '@/components/filter/FilterBar.vue'
import TierBoard from '@/components/tier/TierBoard.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import { useFilter } from '@/composables/useFilter'
import { useFilterStore } from '@/stores/filter'
import { supabase } from '@/api/supabase'
import type { Restaurant } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const loading = ref(true)
const filterStore = useFilterStore()
const restaurants = ref<Restaurant[]>([])

// 初始化认证和数据
onMounted(async () => {
  if (!authStore.initialized) {
    await authStore.initialize()
  }
  await fetchRestaurants()
})

// 从数据库获取餐厅数据
async function fetchRestaurants() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    if (data && data.length > 0) {
      restaurants.value = data as Restaurant[]
      console.log('[HomePage] Loaded', data.length, 'restaurants from database')
    } else {
      console.log('[HomePage] No restaurants in database')
      restaurants.value = []
    }
  } catch (error: any) {
    console.error('[HomePage] Failed to fetch restaurants:', error.message)
    message.error('加载数据失败，请稍后重试')
    restaurants.value = []
  } finally {
    loading.value = false
  }
}

// 用户菜单
const userMenuOptions = [
  {
    label: '个人设置',
    key: 'profile'
  },
  {
    label: '退出登录',
    key: 'logout'
  }
]

// 管理员菜单
const adminMenuOptions = [
  {
    label: '管理后台',
    key: 'admin'
  },
  {
    type: 'divider',
    key: 'd1'
  },
  ...userMenuOptions
]

async function handleUserMenuSelect(key: string) {
  switch (key) {
    case 'logout':
      const result = await authStore.signOut()
      if (result.success) {
        message.success('已退出登录')
        router.push('/login')
      } else {
        message.error(result.message)
      }
      break
    case 'admin':
      router.push('/admin')
      break
    case 'profile':
      // TODO: 个人设置页面
      message.info('个人设置功能即将上线')
      break
  }
}

// 应用筛选逻辑
const { filteredRestaurants, filteredCount, totalCount } = useFilter(restaurants)
</script>

<template>
  <div class="home-page">
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-emoji">🍜</span>
          美食从夯到拉排行榜
        </h1>
        
      <NSpace>
        <!-- 未登录状态 -->
        <template v-if="!authStore.isAuthenticated">
          <NButton @click="router.push('/login')">
            登录
          </NButton>
          <NButton type="primary" @click="router.push('/register')">
            注册
          </NButton>
        </template>

        <!-- 已登录状态 -->
        <template v-else>
          <NButton type="primary" @click="router.push('/submit')">
            ✏️ 录入美食
          </NButton>
          <NButton @click="router.push('/map')">
            🗺️ 地图模式
          </NButton>

          <!-- 用户头像菜单 -->
          <NDropdown
            :options="authStore.isAdmin ? adminMenuOptions : userMenuOptions"
            @select="handleUserMenuSelect"
          >
            <div class="user-avatar-wrapper">
              <NAvatar
                round
                size="medium"
                :src="authStore.profile?.avatar_url"
                :fallback-src="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + authStore.user?.email"
              >
                {{ authStore.profile?.nickname?.charAt(0) || authStore.user?.email?.charAt(0) }}
              </NAvatar>
              <span class="user-nickname">
                {{ authStore.profile?.nickname || authStore.user?.email?.split('@')[0] }}
              </span>
            </div>
          </NDropdown>
        </template>
      </NSpace>
      </div>
    </header>
    
    <!-- 筛选栏 -->
    <div class="filter-sticky-wrapper">
      <FilterBar />
      
      <!-- 筛选结果统计 (Keep inside sticky wrapper or below? Below is better layout-wise but maybe inside looks integrated. Requirement says "Header sticky + filter collapse". Stats can move.) -->
      <!-- Putting stats below filter bar, scrolling with page -->
    </div>

    <!-- 筛选结果统计 -->
    <div class="filter-stats" v-if="filterStore.hasActiveFilters()">
      <NSpace align="center">
        <NTag type="info" size="medium">
          已筛选: {{ filteredCount }} / {{ totalCount }} 家
        </NTag>
        <NButton 
          size="small" 
          secondary 
          @click="filterStore.resetFilters()"
        >
          🔄 清空筛选
        </NButton>
      </NSpace>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <LoadingSkeleton v-if="loading" />
      <TierBoard v-else :restaurants="filteredRestaurants" />
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 0 20px 20px; /* Remove top padding, handle in header */
  background-color: var(--bg-primary);
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin: 0 -20px 0; /* Full width background */
  padding: 16px 20px;
  transition: all 0.3s ease;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.title-emoji {
  font-size: 32px;
}

.user-avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 20px;
  transition: background-color 0.2s;
}

.user-avatar-wrapper:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-nickname {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-stats {
  max-width: 1400px;
  margin: 0 auto 16px;
  padding: 0 4px;
}

.content {
  width: 100%;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .home-page {
    padding: 0 12px 12px;
  }
  
  .page-header {
    margin: 0 -12px 0;
    padding: 12px;
    position: relative; /* Not sticky on mobile to save space */
    top: 0;
  }
  
  .header-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .title-emoji {
    font-size: 24px;
  }

  .filter-sticky-wrapper {
    top: 0; /* Sticky to top of viewport since header is not sticky */
    margin: 0 -12px 16px;
    padding: 8px 12px;
    background: var(--bg-primary); /* Ensure solid background when sticky */
    border-bottom: 1px solid rgba(255, 255, 255, 0.05); /* Add border for separation */
  }
}
</style>
