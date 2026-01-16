<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NTag, NSpace, NEllipsis, NButton } from 'naive-ui'
import type { Restaurant } from '@/types'
import { TIER_CONFIG, CATEGORY_CONFIG } from '@/types'
import VoteButtons from './VoteButtons.vue'
import NavigateButton from '@/components/common/NavigateButton.vue'
import EditRestaurantModal from '@/components/admin/EditRestaurantModal.vue'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { getDistance, estimateWalkTime } from '@/utils/geo'

const props = defineProps<{
  restaurant: Restaurant
  userLocation?: { lat: number, lng: number } | null
}>()

const emit = defineEmits(['update'])

const authStore = useAuthStore()
const showEditModal = ref(false)
const canEdit = computed(() => {
  return authStore.user?.id === props.restaurant.created_by || authStore.isAdmin
})

const tierConfig = TIER_CONFIG[props.restaurant.tier]
const categoryConfig = CATEGORY_CONFIG[props.restaurant.category]

const distanceInfo = computed(() => {
  if (!props.userLocation || !props.restaurant.latitude || !props.restaurant.longitude) return null
  const dist = getDistance(
    props.userLocation.lat,
    props.userLocation.lng,
    props.restaurant.latitude,
    props.restaurant.longitude
  )
  return {
    meters: Math.round(dist),
    text: dist > 1000 ? `${(dist / 1000).toFixed(1)}km` : `${Math.round(dist)}m`,
    walkTime: estimateWalkTime(dist)
  }
})

const placeholderStyle = computed(() => ({
  background: `linear-gradient(135deg, ${tierConfig.color}1a 0%, ${tierConfig.color}33 100%)`,
  borderBottom: `2px solid ${tierConfig.color}`
}))
</script>

<template>
  <NCard class="restaurant-card" hoverable :bordered="false">
    <template #cover>
      <div v-if="restaurant.image_url" class="card-image">
        <img :src="restaurant.image_url" :alt="restaurant.name" loading="lazy" />
        <div class="image-overlay"></div>
      </div>
      <div v-else class="card-image-placeholder" :style="placeholderStyle">
        <span class="placeholder-emoji">{{ categoryConfig.emoji }}</span>
      </div>
    </template>
    
    <div class="card-content-wrapper">
      <div class="card-header">
        <NEllipsis :line-clamp="2" :tooltip="{ width: 280 }" class="card-name">
          {{ restaurant.name }}
        </NEllipsis>
        <NSpace :size="4" align="center">
          <VoteButtons 
            :restaurant-id="restaurant.id" 
            :upvotes="restaurant.upvotes" 
            :downvotes="restaurant.downvotes"
            :user-vote="restaurant.user_vote"
          />
          <NTag
            :color="{ color: tierConfig.color + '1a', textColor: tierConfig.color, borderColor: tierConfig.color }"
            :bordered="true"
            round
            size="small"
            class="tier-tag"
          >
            {{ tierConfig.emoji }} {{ tierConfig.label }}
          </NTag>
        </NSpace>
      </div>
      
      <NSpace vertical :size="6" class="card-details">
        <div class="info-row">
          <span class="info-item">
            <span class="info-icon">{{ categoryConfig.emoji }}</span>
            {{ categoryConfig.label }}
          </span>
          <span class="separator">•</span>
          <span class="info-item price">
            ¥{{ restaurant.price_per_person }}/人
          </span>
          <template v-if="distanceInfo">
            <span class="separator">•</span>
            <span class="info-item distance" :title="'步行约 ' + distanceInfo.walkTime + ' 分钟'">
              <span class="info-icon">🚶</span>
              {{ distanceInfo.text }}
            </span>
          </template>
        </div>
        
        <div class="info-row location">
          <span class="info-icon">📍</span>
          <span class="address-text">{{ restaurant.address }}</span>
          <NSpace :size="4">
            <NavigateButton 
              :address="restaurant.address" 
              :latitude="restaurant.latitude" 
              :longitude="restaurant.longitude"
              quaternary
              size="tiny"
            />
            <NButton 
              v-if="canEdit" 
              quaternary 
              size="tiny" 
              @click.stop="showEditModal = true"
            >
              编辑
            </NButton>
          </NSpace>
        </div>
        
        <div class="recommendation-box">
          <span class="quote-icon">❝</span>
          <NEllipsis :line-clamp="2" :tooltip="{}">
            {{ restaurant.recommendation || '暂无评价' }}
          </NEllipsis>
        </div>
      </NSpace>
    </div>
    
    <EditRestaurantModal 
      v-model:show="showEditModal" 
      :restaurant="restaurant"
      @success="$emit('update')"
    />
  </NCard>
</template>

<style scoped>
.restaurant-card {
  width: 280px;
  height: 340px; /* 固定高度确保卡片大小一致 */
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}

.restaurant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.card-image,
.card-image-placeholder {
  width: 100%;
  height: 140px;
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.restaurant-card:hover .card-image img {
  transform: scale(1.05);
}

.card-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-emoji {
  font-size: 56px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  transform: scale(1);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.restaurant-card:hover .placeholder-emoji {
  transform: scale(1.1) rotate(5deg);
}

.card-content-wrapper {
  padding: 4px 0 0;
  /* 防止内容溢出容器 */
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.card-name {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--text-primary);
  flex: 1;
  min-width: 0; /* 允许 NEllipsis 正常工作 */
}

.tier-tag {
  flex-shrink: 0;
  font-weight: 700;
}

.card-details {
  font-size: 13px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  line-height: 1.4;
}

.info-icon {
  margin-right: 4px;
  font-size: 14px;
}

.separator {
  margin: 0 6px;
  opacity: 0.3;
}

.price {
  color: var(--text-primary);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.distance {
  color: var(--text-secondary);
  font-weight: 400;
}

.address-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.8;
}

.card-nav-btn {
  margin-left: 4px;
}

.recommendation-box {
  margin-top: auto; /* 推到底部 */
  padding: 8px 10px;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  position: relative;
  font-style: italic;
  height: 46px; /* 固定高度，约两行文字 */
  display: flex;
  align-items: center;
  /* 防止文本溢出 */
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.recommendation-box :deep(.n-ellipsis) {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.recommendation-box:not(:has(.quote-icon)) {
  /* 当没有评价内容时稍微降低透明度 */
  opacity: 0.6;
}

.quote-icon {
  position: absolute;
  top: 4px;
  left: 4px;
  opacity: 0.1;
  font-size: 20px;
  line-height: 1;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .restaurant-card {
    width: 100%;
    max-width: 340px; /* 限制最大宽度，防止拉伸过长 */
    height: 380px; /* 移动端稍微高一点 */
    margin: 0 auto; /* 居中显示 */
  }
  
  .card-image,
  .card-image-placeholder {
    height: 180px; /* 移动端稍微高一点 */
  }

  .recommendation-box {
    /* 移动端额外确保文字不溢出 */
    word-break: break-all;
  }
}
</style>
