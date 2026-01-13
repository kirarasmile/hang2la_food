<script setup lang="ts">
import { computed } from 'vue'
import type { TierRating } from '@/types'
import { TIER_CONFIG } from '@/types'

const props = defineProps<{
  tier: TierRating
}>()

const config = computed(() => TIER_CONFIG[props.tier])
</script>

<template>
  <div class="tier-label" :class="`tier-label-${tier}`">
    <span class="tier-emoji">{{ config.emoji }}</span>
    <span class="tier-text">{{ config.label }}</span>
  </div>
</template>

<style scoped>
.tier-label {
  min-width: 120px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-weight: 900;
  color: #000;
  border-radius: 8px 0 0 8px;
  flex-shrink: 0;
}

.tier-emoji {
  font-size: 32px;
  line-height: 1;
}

.tier-text {
  font-size: 24px;
  font-family: 'Impact', 'Arial Black', sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* 各 Tier 的背景色 */
.tier-label-hang {
  background-color: var(--tier-hang);
}

.tier-label-top {
  background-color: var(--tier-top);
  color: #fff;
}

.tier-label-elite {
  background-color: var(--tier-elite);
  color: #fff;
}

.tier-label-npc {
  background-color: var(--tier-npc);
}

.tier-label-la {
  background-color: var(--tier-la);
  color: #fff;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .tier-label {
    min-width: 100%;
    height: 50px;
    flex-direction: row;
    border-radius: 8px 8px 0 0;
    gap: 12px;
  }
  
  .tier-emoji {
    font-size: 24px;
  }
  
  .tier-text {
    font-size: 18px;
  }
}
</style>
