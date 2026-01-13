<script setup lang="ts">
import { NScrollbar } from 'naive-ui'
import TierLabel from './TierLabel.vue'
import RestaurantCard from './RestaurantCard.vue'
import type { TierRating, Restaurant } from '@/types'

defineProps<{
  tier: TierRating
  restaurants: Restaurant[]
}>()
</script>

<template>
  <div class="tier-row" :class="`tier-row-${tier}`">
    <TierLabel :tier="tier" />
    
    <div class="tier-content">
      <NScrollbar x-scrollable>
        <div class="card-list">
          <RestaurantCard
            v-for="restaurant in restaurants"
            :key="restaurant.id"
            :restaurant="restaurant"
            class="stagger-item"
          />
          
          <div v-if="restaurants.length === 0" class="empty-placeholder">
            <span class="empty-text">暂无数据</span>
          </div>
        </div>
      </NScrollbar>
    </div>
  </div>
</template>

<style scoped>
.tier-row {
  display: flex;
  min-height: 200px;
  background-color: var(--bg-tier-row);
  border-radius: var(--border-radius);
  overflow: hidden;
  margin-bottom: 12px;
}

.tier-content {
  flex: 1;
  overflow: hidden;
}

.card-list {
  display: flex;
  gap: 16px;
  padding: 16px;
  min-height: 180px;
}

.empty-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  color: var(--text-secondary);
  font-style: italic;
}

.empty-text {
  opacity: 0.5;
}

/* "夯" 行添加流光特效 */
.tier-row-hang .tier-label {
  animation: shine 3s linear infinite;
  background: linear-gradient(
    90deg,
    var(--tier-hang) 0%,
    #fffacd 50%,
    var(--tier-hang) 100%
  );
  background-size: 200% 100%;
}

@keyframes shine {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .tier-row {
    flex-direction: column;
    min-height: auto;
  }
  
  .card-list {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>
