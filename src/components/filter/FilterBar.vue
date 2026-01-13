<script setup lang="ts">
import { NCard } from 'naive-ui'
import CitySelect from './CitySelect.vue'
import CategorySelect from './CategorySelect.vue'
import TierFilter from './TierFilter.vue'
import PriceRangeSlider from './PriceRangeSlider.vue'
import SearchInput from './SearchInput.vue'
import SortSelect from './SortSelect.vue'
</script>

<template>
  <div class="filter-bar">
    <NCard class="filter-card" :bordered="false">
      <div class="filter-content">
        <!-- 搜索框 - 独立一行 -->
        <div class="filter-row search-row">
          <SearchInput />
        </div>

        <!-- 主要筛选条件 -->
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
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.filter-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  margin-bottom: 24px;
  background-color: var(--bg-primary);
  padding-top: 4px;
}

.filter-card {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.search-row {
  width: 100%;
}

.main-filters {
  width: 100%;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .filter-bar {
    margin-bottom: 16px;
  }

  .filter-content {
    gap: 12px;
  }

  .filter-row {
    gap: 12px;
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
