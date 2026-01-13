<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NButton, NCollapseTransition, NDrawer, NDrawerContent, NIcon, NBadge } from 'naive-ui'
import { Filter as FilterIcon } from '@vicons/ionicons5'
import CitySelect from './CitySelect.vue'
import CategorySelect from './CategorySelect.vue'
import TierFilter from './TierFilter.vue'
import PriceRangeSlider from './PriceRangeSlider.vue'
import SearchInput from './SearchInput.vue'
import SortSelect from './SortSelect.vue'
import { useFilterStore } from '@/stores/filter'

const filterStore = useFilterStore()
const showMobileDrawer = ref(false)

const activeFilterCount = computed(() => {
  let count = 0
  if (filterStore.selectedCity) count++
  count += filterStore.selectedCategories.length
  count += filterStore.selectedTiers.length
  if (filterStore.selectedPriceRange) count++
  if (filterStore.sortBy !== 'popular') count++
  return count
})

function handleReset() {
  filterStore.resetFilters()
  // showMobileDrawer.value = false // Optional: close on reset? specific requirements say keep functionality.
}
</script>

<template>
  <div class="filter-bar">
    <div class="filter-container">
      <NCard class="filter-card" :bordered="false" content-style="padding: 0;">
        <div class="filter-content">
          <!-- 搜索框与折叠按钮行 -->
          <div class="filter-row header-row">
            <div class="search-wrapper">
              <SearchInput class="search-input-responsive" />
            </div>
            
            <!-- Desktop Toggle -->
            <div class="desktop-toggle">
              <NButton 
                quaternary
                size="small"
                @click="filterStore.toggleFilterCollapse()"
                class="collapse-btn"
              >
                <span class="collapse-icon">{{ filterStore.isFilterCollapsed ? '🔽' : '🔼' }}</span>
                {{ filterStore.isFilterCollapsed ? '展开筛选' : '收起' }}
              </NButton>
            </div>

            <!-- Mobile Toggle -->
            <div class="mobile-toggle">
              <NBadge :value="activeFilterCount" :show="activeFilterCount > 0" :max="99">
                <NButton 
                  secondary 
                  circle
                  @click="showMobileDrawer = true"
                  class="mobile-filter-btn"
                >
                  <template #icon>
                    <NIcon><FilterIcon /></NIcon>
                  </template>
                </NButton>
              </NBadge>
            </div>
          </div>

          <!-- 可折叠的主要筛选条件 (Desktop) -->
          <div class="desktop-filters">
            <NCollapseTransition :show="!filterStore.isFilterCollapsed">
              <div class="filter-row main-filters">
                <div class="filter-item">
                  <label class="filter-label">城市</label>
                  <CitySelect />
                </div>

                <div class="filter-item">
                  <label class="filter-label">分类</label>
                  <CategorySelect />
                </div>

                <div class="filter-item">
                  <label class="filter-label">评级</label>
                  <TierFilter />
                </div>

                <div class="filter-item">
                  <label class="filter-label">价格区间</label>
                  <PriceRangeSlider />
                </div>

                <div class="filter-item">
                  <label class="filter-label">排序</label>
                  <SortSelect />
                </div>
              </div>
            </NCollapseTransition>
          </div>
        </div>
      </NCard>
    </div>

    <!-- Mobile Drawer -->
    <NDrawer v-model:show="showMobileDrawer" placement="bottom" height="85vh" class="mobile-filter-drawer">
      <NDrawerContent title="筛选条件" closable>
        <div class="drawer-filters">
          <div class="drawer-filter-item">
            <label class="filter-label">城市</label>
            <CitySelect />
          </div>

          <div class="drawer-filter-item">
            <label class="filter-label">分类</label>
            <CategorySelect />
          </div>

          <div class="drawer-filter-item">
            <label class="filter-label">评级</label>
            <TierFilter />
          </div>

          <div class="drawer-filter-item">
            <label class="filter-label">价格区间</label>
            <PriceRangeSlider />
          </div>

          <div class="drawer-filter-item">
            <label class="filter-label">排序</label>
            <SortSelect />
          </div>
        </div>

        <template #footer>
          <div class="drawer-footer">
            <NButton secondary @click="handleReset" class="drawer-btn">
              重置
            </NButton>
            <NButton type="primary" @click="showMobileDrawer = false" class="drawer-btn">
              完成
            </NButton>
          </div>
        </template>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<style scoped>
.filter-bar {
  width: 100%;
  z-index: 90;
  pointer-events: none;
}

.filter-container {
  max-width: 1400px;
  margin: 0 auto;
  pointer-events: auto;
}

.filter-card {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.filter-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 16px;
}

.search-wrapper {
  flex: 1;
  max-width: 400px;
}

/* Desktop Filters Styles */
.main-filters {
  padding-top: 20px;
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 16px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 200px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
  min-width: 56px;
}

.collapse-btn {
  font-weight: 600;
  color: var(--text-secondary);
}

.collapse-icon {
  margin-right: 4px;
}

/* Visibility Control */
.mobile-toggle {
  display: none;
}

.desktop-toggle {
  display: block;
}

.desktop-filters {
  display: block;
}

/* Drawer Styles */
.drawer-filters {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px 0;
}

.drawer-filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.drawer-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
}

.drawer-btn {
  flex: 1;
}

/* Mobile Adaptation */
@media (max-width: 768px) {
  .filter-content {
    padding: 12px;
  }

  .header-row {
    gap: 12px;
  }

  .search-wrapper {
    max-width: 100%;
  }

  /* Hide Desktop elements */
  .desktop-toggle {
    display: none;
  }
  
  .desktop-filters {
    display: none;
  }

  /* Show Mobile elements */
  .mobile-toggle {
    display: block;
  }
}
</style>
