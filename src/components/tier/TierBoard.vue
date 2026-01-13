<script setup lang="ts">
import { computed } from 'vue'
import TierRow from './TierRow.vue'
import type { Restaurant, TierRating } from '@/types'

const props = defineProps<{
  restaurants: Restaurant[]
}>()

// 按 Tier 分组
const groupedByTier = computed(() => {
  const groups: Record<TierRating, Restaurant[]> = {
    hang: [],
    top: [],
    elite: [],
    npc: [],
    la: []
  }
  
  props.restaurants.forEach(restaurant => {
    if (!restaurant.is_deleted) {
      groups[restaurant.tier].push(restaurant)
    }
  })
  
  return groups
})

// 按 Tier 顺序排列
const tiers: TierRating[] = ['hang', 'top', 'elite', 'npc', 'la']

// 检查是否有任何餐厅数据
const hasAnyRestaurants = computed(() => {
  return props.restaurants.length > 0 && props.restaurants.some(r => !r.is_deleted)
})
</script>

<template>
  <div class="tier-board">
    <template v-if="hasAnyRestaurants">
      <template v-for="tier in tiers" :key="tier">
        <TierRow
          v-if="groupedByTier[tier].length > 0"
          :tier="tier"
          :restaurants="groupedByTier[tier]"
        />
      </template>
    </template>
    
    <div v-else class="global-empty-state">
      <div class="empty-content">
        <span class="empty-emoji">🍽️</span>
        <h3>暂无符合条件的餐厅</h3>
        <p>换个筛选条件试试？</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tier-board {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.global-empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: var(--text-secondary);
  text-align: center;
  background: var(--bg-tier-row);
  border-radius: var(--border-radius);
  margin-top: 20px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-emoji {
  font-size: 48px;
}

h3 {
  font-size: 20px;
  margin: 0;
  color: var(--text-primary);
}

p {
  margin: 0;
  opacity: 0.8;
}
</style>
