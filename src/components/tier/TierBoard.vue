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
</script>

<template>
  <div class="tier-board">
    <TierRow
      v-for="tier in tiers"
      :key="tier"
      :tier="tier"
      :restaurants="groupedByTier[tier]"
    />
  </div>
</template>

<style scoped>
.tier-board {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
