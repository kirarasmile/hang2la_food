<script setup lang="ts">
import { NCard, NTag, NSpace, NEllipsis } from 'naive-ui'
import type { Restaurant } from '@/types'
import { TIER_CONFIG, CATEGORY_CONFIG } from '@/types'

const props = defineProps<{
  restaurant: Restaurant
}>()

const tierConfig = TIER_CONFIG[props.restaurant.tier]
const categoryConfig = CATEGORY_CONFIG[props.restaurant.category]
</script>

<template>
  <NCard class="restaurant-card card-hover" hoverable>
    <template #cover>
      <div v-if="restaurant.image_url" class="card-image">
        <img :src="restaurant.image_url" :alt="restaurant.name" />
      </div>
      <div v-else class="card-image-placeholder">
        <span class="placeholder-emoji">{{ categoryConfig.emoji }}</span>
      </div>
    </template>
    
    <template #header>
      <div class="card-header">
        <span class="card-name">{{ restaurant.name }}</span>
        <NTag
          :color="{ color: tierConfig.color, textColor: '#fff', borderColor: tierConfig.color }"
          :bordered="false"
          round
          size="small"
        >
          {{ tierConfig.emoji }} {{ tierConfig.label }}
        </NTag>
      </div>
    </template>
    
    <NSpace vertical :size="8">
      <div class="card-info">
        <span class="info-emoji">{{ categoryConfig.emoji }}</span>
        <span>{{ categoryConfig.label }}</span>
      </div>
      
      <div class="card-info">
        <span class="info-emoji">📍</span>
        <NEllipsis style="max-width: 200px">
          {{ restaurant.address }}
        </NEllipsis>
      </div>
      
      <div class="card-info">
        <span class="info-emoji">💰</span>
        <span>人均 ¥{{ restaurant.price_per_person }}</span>
      </div>
      
      <NEllipsis v-if="restaurant.recommendation" :line-clamp="2" class="card-recommendation">
        💡 {{ restaurant.recommendation }}
      </NEllipsis>
    </NSpace>
  </NCard>
</template>

<style scoped>
.restaurant-card {
  width: 280px;
  flex-shrink: 0;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.card-image,
.card-image-placeholder {
  width: 100%;
  height: 160px;
  overflow: hidden;
  background-color: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-image-placeholder {
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
}

.placeholder-emoji {
  font-size: 48px;
  opacity: 0.3;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-name {
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-secondary);
}

.info-emoji {
  font-size: 14px;
  flex-shrink: 0;
}

.card-recommendation {
  font-size: 13px;
  color: var(--text-secondary);
  font-style: italic;
  margin-top: 4px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .restaurant-card {
    width: calc(50% - 6px);
    min-width: 0;
  }
}
</style>
