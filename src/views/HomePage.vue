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
import type { Restaurant } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const loading = ref(false)
const filterStore = useFilterStore()

// 初始化认证
onMounted(async () => {
  if (!authStore.initialized) {
    await authStore.initialize()
  }
})

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

// 模拟静态数据（Phase 4 将连接 Supabase）
const mockRestaurants = ref<Restaurant[]>([
  {
    id: '1',
    name: '海底捞火锅',
    tier: 'hang',
    category: 'hotpot',
    price_per_person: 120,
    address: '上海市黄浦区南京东路123号',
    city: '上海',
    district: '黄浦区',
    recommendation: '服务超级好！番茄锅底绝了，必点毛肚和虾滑',
    created_by: 'demo',
    created_at: new Date('2025-01-10').toISOString(),
    updated_at: new Date('2025-01-10').toISOString(),
    is_deleted: false
  },
  {
    id: '2',
    name: '鼎泰丰',
    tier: 'top',
    category: 'chinese',
    price_per_person: 150,
    address: '上海市静安区南京西路1376号',
    city: '上海',
    district: '静安区',
    recommendation: '小笼包皮薄汁多，18个褶子真不是吹的',
    created_by: 'demo',
    created_at: new Date('2025-01-11').toISOString(),
    updated_at: new Date('2025-01-11').toISOString(),
    is_deleted: false
  },
  {
    id: '3',
    name: '麦当劳',
    tier: 'npc',
    category: 'fastfood',
    price_per_person: 35,
    address: '上海市浦东新区世纪大道8号',
    city: '上海',
    recommendation: '板烧鸡腿堡永远的神，早餐麦满分也不错',
    created_by: 'demo',
    created_at: new Date('2025-01-09').toISOString(),
    updated_at: new Date('2025-01-09').toISOString(),
    is_deleted: false
  },
  {
    id: '4',
    name: '某黑暗料理店',
    tier: 'la',
    category: 'other',
    price_per_person: 200,
    address: '上海市徐汇区衡山路99号',
    city: '上海',
    recommendation: '千万别去！又贵又难吃，服务态度还差，纯纯智商税',
    created_by: 'demo',
    created_at: new Date('2025-01-08').toISOString(),
    updated_at: new Date('2025-01-08').toISOString(),
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
    recommendation: '咖啡稳定，环境不错，适合办公和闲聊',
    created_by: 'demo',
    created_at: new Date('2025-01-12').toISOString(),
    updated_at: new Date('2025-01-12').toISOString(),
    is_deleted: false
  },
  {
    id: '6',
    name: '喜茶',
    tier: 'top',
    category: 'drinks',
    price_per_person: 28,
    address: '广州市天河区天河路208号',
    city: '广州',
    recommendation: '芝芝莓莓真的好喝！多肉葡萄也推荐',
    created_by: 'demo',
    created_at: new Date('2025-01-13').toISOString(),
    updated_at: new Date('2025-01-13').toISOString(),
    is_deleted: false
  },
  {
    id: '7',
    name: '九毛九山西面馆',
    tier: 'elite',
    category: 'chinese',
    price_per_person: 65,
    address: '深圳市福田区福华三路118号',
    city: '深圳',
    recommendation: '油泼面绝了，分量足价格实惠',
    created_by: 'demo',
    created_at: new Date('2025-01-07').toISOString(),
    updated_at: new Date('2025-01-07').toISOString(),
    is_deleted: false
  },
  {
    id: '8',
    name: '胖哥俩肉蟹煲',
    tier: 'hang',
    category: 'chinese',
    price_per_person: 180,
    address: '杭州市西湖区文三路218号',
    city: '杭州',
    recommendation: '肉蟹煲超级香！配米饭简直无敌',
    created_by: 'demo',
    created_at: new Date('2025-01-06').toISOString(),
    updated_at: new Date('2025-01-06').toISOString(),
    is_deleted: false
  },
  {
    id: '9',
    name: '权金城',
    tier: 'top',
    category: 'korean',
    price_per_person: 90,
    address: '北京市海淀区中关村大街1号',
    city: '北京',
    recommendation: '烤五花肉很好吃，石锅拌饭也不错',
    created_by: 'demo',
    created_at: new Date('2025-01-05').toISOString(),
    updated_at: new Date('2025-01-05').toISOString(),
    is_deleted: false
  },
  {
    id: '10',
    name: '蛙小侠',
    tier: 'elite',
    category: 'hotpot',
    price_per_person: 75,
    address: '成都市武侯区天府三街99号',
    city: '成都',
    recommendation: '牛蛙火锅很新鲜，辣度刚好',
    created_by: 'demo',
    created_at: new Date('2025-01-04').toISOString(),
    updated_at: new Date('2025-01-04').toISOString(),
    is_deleted: false
  },
  {
    id: '11',
    name: 'Lady M',
    tier: 'hang',
    category: 'dessert',
    price_per_person: 88,
    address: '上海市黄浦区淮海中路999号',
    city: '上海',
    recommendation: '千层蛋糕一绝，入口即化',
    created_by: 'demo',
    created_at: new Date('2025-01-03').toISOString(),
    updated_at: new Date('2025-01-03').toISOString(),
    is_deleted: false
  },
  {
    id: '12',
    name: 'KFC肯德基',
    tier: 'npc',
    category: 'fastfood',
    price_per_person: 38,
    address: '武汉市江汉区解放大道688号',
    city: '武汉',
    recommendation: '疯四就是稳，吮指原味鸡永远OK',
    created_by: 'demo',
    created_at: new Date('2025-01-02').toISOString(),
    updated_at: new Date('2025-01-02').toISOString(),
    is_deleted: false
  }
])

// 应用筛选逻辑
const { filteredRestaurants, filteredCount, totalCount } = useFilter(mockRestaurants)
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
