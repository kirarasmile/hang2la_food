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
  border: 1px solid rgba(255, 255, 255, 0.05); /* 微弱边框增加精致感 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tier-content {
  flex: 1;
  overflow: hidden;
  display: flex; /* 确保内容撑满 */
  flex-direction: column;
}

.card-list {
  display: flex;
  gap: 16px;
  padding: 16px;
  min-height: 100%; /* 撑满高度 */
  align-items: center; /* 垂直居中卡片 */
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
    padding-bottom: 16px;
  }
}
</style>
