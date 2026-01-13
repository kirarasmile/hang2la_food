// src/stores/filter.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TierRating, FoodCategory } from '@/types'

export const useFilterStore = defineStore('filter', () => {
  // 搜索关键词
  const searchKeyword = ref('')
  
  // 城市筛选
  const selectedCity = ref('')
  
  // 分类筛选 (多选)
  const selectedCategories = ref<FoodCategory[]>([])
  
  // 评级筛选 (多选)
  const selectedTiers = ref<TierRating[]>([])
  
  // 价格区间筛选
  const selectedPriceRange = ref('')
  
  // 排序方式
  const sortBy = ref<'popular' | 'newest' | 'price-asc' | 'price-desc'>('popular')

  // UI 状态：筛选栏是否折叠
  const isFilterCollapsed = ref(false)

  // 切换筛选栏折叠状态
  function toggleFilterCollapse() {
    isFilterCollapsed.value = !isFilterCollapsed.value
  }

  // 重置所有筛选条件
  function resetFilters() {
    searchKeyword.value = ''
    selectedCity.value = ''
    selectedCategories.value = []
    selectedTiers.value = []
    selectedPriceRange.value = ''
    sortBy.value = 'popular'
  }

  // 检查是否有任何筛选条件激活
  function hasActiveFilters(): boolean {
    return !!(
      searchKeyword.value ||
      selectedCity.value ||
      selectedCategories.value.length > 0 ||
      selectedTiers.value.length > 0 ||
      selectedPriceRange.value ||
      sortBy.value !== 'popular'
    )
  }

  return {
    searchKeyword,
    selectedCity,
    selectedCategories,
    selectedTiers,
    selectedPriceRange,
    sortBy,
    isFilterCollapsed,
    toggleFilterCollapse,
    resetFilters,
    hasActiveFilters
  }
})
