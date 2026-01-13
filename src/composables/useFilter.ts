// src/composables/useFilter.ts
import { computed, type Ref } from 'vue'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'
import type { Restaurant } from '@/types'

export function useFilter(restaurants: Ref<Restaurant[]>) {
  const filterStore = useFilterStore()
  const {
    searchKeyword,
    selectedCity,
    selectedCategories,
    selectedTiers,
    selectedPriceRange,
    sortBy
  } = storeToRefs(filterStore)

  // 应用所有筛选条件
  const filteredRestaurants = computed(() => {
    let result = [...restaurants.value]

    // 1. 搜索关键词筛选
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      result = result.filter(r => 
        r.name.toLowerCase().includes(keyword) ||
        r.address?.toLowerCase().includes(keyword) ||
        r.recommendation?.toLowerCase().includes(keyword)
      )
    }

    // 2. 城市筛选
    if (selectedCity.value) {
      result = result.filter(r => {
        if (selectedCity.value === 'other') {
          return !['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安'].includes(r.city)
        }
        return r.city === selectedCity.value
      })
    }

    // 3. 分类筛选 (多选，任一匹配)
    if (selectedCategories.value.length > 0) {
      result = result.filter(r => selectedCategories.value.includes(r.category))
    }

    // 4. 评级筛选 (多选，任一匹配)
    if (selectedTiers.value.length > 0) {
      result = result.filter(r => selectedTiers.value.includes(r.tier))
    }

    // 5. 价格区间筛选
    if (selectedPriceRange.value) {
      const [min, max] = parsePriceRange(selectedPriceRange.value)
      result = result.filter(r => {
        const price = r.price_per_person
        if (max === Infinity) {
          return price >= min
        }
        return price >= min && price < max
      })
    }

    // 6. 排序
    result = applySorting(result, sortBy.value)

    return result
  })

  // 筛选结果计数
  const filteredCount = computed(() => filteredRestaurants.value.length)
  const totalCount = computed(() => restaurants.value.length)

  return {
    filteredRestaurants,
    filteredCount,
    totalCount
  }
}

// 辅助函数：解析价格区间
function parsePriceRange(range: string): [number, number] {
  if (range === '500+') return [500, Infinity]
  const [min, max] = range.split('-').map(Number)
  return [min, max]
}

// 辅助函数：应用排序
function applySorting(
  restaurants: Restaurant[], 
  sortType: string
): Restaurant[] {
  const sorted = [...restaurants]

  switch (sortType) {
    case 'newest':
      return sorted.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    
    case 'price-asc':
      return sorted.sort((a, b) => a.price_per_person - b.price_per_person)
    
    case 'price-desc':
      return sorted.sort((a, b) => b.price_per_person - a.price_per_person)
    
    case 'popular':
    default:
      // 默认按 tier 优先级排序 (hang > top > elite > npc > la)
      const tierOrder = { hang: 1, top: 2, elite: 3, npc: 4, la: 5 }
      return sorted.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier])
  }
}
