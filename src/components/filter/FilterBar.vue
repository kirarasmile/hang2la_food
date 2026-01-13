<script setup lang="ts">
import { NCard, NButton, NCollapseTransition } from 'naive-ui'
import CitySelect from './CitySelect.vue'
import CategorySelect from './CategorySelect.vue'
import TierFilter from './TierFilter.vue'
import PriceRangeSlider from './PriceRangeSlider.vue'
import SearchInput from './SearchInput.vue'
import SortSelect from './SortSelect.vue'
import { useFilterStore } from '@/stores/filter'

const filterStore = useFilterStore()
</script>

<template>
  <div class="filter-bar">
    <div class="filter-container">
      <NCard class="filter-card" :bordered="false" content-style="padding: 16px;">
        <div class="filter-content">
          <!-- 搜索框与折叠按钮行 -->
          <div class="filter-row header-row">
            <div class="search-wrapper">
              <SearchInput />
            </div>
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

          <!-- 可折叠的主要筛选条件 -->
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
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  /* Sticky positioning handled in HomePage or here with calculation */
  width: 100%;
  z-index: 90;
  pointer-events: none; /* Allow clicking through empty space */
}

.filter-container {
  max-width: 1400px;
  margin: 0 auto;
  pointer-events: auto; /* Re-enable clicks */
}

.filter-card {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 0;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .search-wrapper {
    max-width: 100%;
  }
  
  .filter-row {
    gap: 12px;
  }
  
  .main-filters {
    padding-top: 16px;
    margin-top: 12px;
  }

  .filter-item {
    flex: 1 1 100%;
    min-width: 100%;
  }

  .filter-label {
    min-width: 48px;
    font-size: 13px;
  }
}
</style>
