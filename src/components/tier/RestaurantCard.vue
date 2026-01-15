<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NTag, NSpace, NEllipsis } from 'naive-ui'
import type { Restaurant } from '@/types'
import { TIER_CONFIG, CATEGORY_CONFIG } from '@/types'
import VoteButtons from './VoteButtons.vue'
import NavigateButton from '@/components/common/NavigateButton.vue'
import EditRestaurantModal from '@/components/admin/EditRestaurantModal.vue'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const props = defineProps<{
  restaurant: Restaurant
}>()

const emit = defineEmits(['update'])

const authStore = useAuthStore()
const showEditModal = ref(false)
const canEdit = computed(() => {
  return authStore.user?.id === props.restaurant.created_by || authStore.isAdmin
})

const tierConfig = TIER_CONFIG[props.restaurant.tier]
const categoryConfig = CATEGORY_CONFIG[props.restaurant.category]

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
        <h3 class="card-name">{{ restaurant.name }}</h3>
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
  flex-shrink: 0;
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
  margin: 0;
  color: var(--text-primary);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tier-tag {
  flex-shrink: 0;
  font-weight: 700;
}

.card-details {
  font-size: 13px;
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
  margin-top: 8px;
  padding: 8px 10px;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  position: relative;
  font-style: italic;
  min-height: 46px; /* 确保高度一致，约两行文字的高度 */
  display: flex;
  align-items: center;
}

.recommendation-box :deep(.n-ellipsis) {
  width: 100%;
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
    width: 100%; /* Single column full width */
    height: auto;
  }
  
  .card-image,
  .card-image-placeholder {
    height: 160px; /* Slightly taller on mobile for impact */
  }
}
</style>
