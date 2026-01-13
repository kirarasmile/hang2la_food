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
  <div class="tier-label-container" :class="`tier-${tier}`">
    <div class="label-content">
      <span class="tier-emoji">{{ config.emoji }}</span>
      <span class="tier-text">{{ config.label }}</span>
    </div>
    <!-- 装饰性光效 -->
    <div v-if="tier === 'hang'" class="shine-effect"></div>
  </div>
</template>

<style scoped>
.tier-label-container {
  width: 120px;
  min-width: 120px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  /* 确保背景色覆盖整个区域 */
  background-color: var(--tier-color); 
}

.label-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  z-index: 2;
  /* 防止emoji溢出被裁剪，增加一点内边距 */
  padding: 8px 0;
}

.tier-emoji {
  font-size: 36px; /* 稍微调大一点，增加视觉冲击 */
  line-height: 1.2; /* 增加行高防止顶部被切 */
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  transform: translateY(-2px); /* 微调垂直位置 */
}

.tier-text {
  font-size: 20px;
  font-weight: 900;
  font-family: 'Impact', system-ui, -apple-system, sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  color: #fff; /* 默认白色文字 */
}

/* --- Tier Specific Styles --- */

/* 1. 夯 Hang (Gold) */
.tier-hang {
  --tier-color: #FFD700;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-right: 1px solid rgba(255,255,255,0.3);
}
.tier-hang .tier-text {
  color: #5c3a00; /* 深金色文字增加对比 */
  text-shadow: 0 1px 0 rgba(255,255,255,0.4);
}

/* 2. 顶级 Top (Purple) */
.tier-top {
  --tier-color: #B026FF;
  background: linear-gradient(135deg, #D500F9 0%, #651FFF 100%);
}

/* 3. 人上人 Elite (Blue) */
.tier-elite {
  --tier-color: #1E90FF;
  background: linear-gradient(135deg, #00B0FF 0%, #2962FF 100%);
}

/* 4. NPC (Grey) */
.tier-npc {
  --tier-color: #A9A9A9;
  background: linear-gradient(135deg, #CFD8DC 0%, #78909C 100%);
}
.tier-npc .tier-text {
  color: #37474F;
}

/* 5. 拉 La (Red) */
.tier-la {
  --tier-color: #FF4500;
  background: linear-gradient(135deg, #FF3D00 0%, #BF360C 100%);
}

/* --- Shine Animation for Hang --- */
.shine-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  transform: skewX(-20deg) translateX(-150%);
  animation: shine 3s infinite;
  z-index: 1;
}

@keyframes shine {
  0% { transform: skewX(-20deg) translateX(-150%); }
  20% { transform: skewX(-20deg) translateX(150%); } /* 快速划过 */
  100% { transform: skewX(-20deg) translateX(150%); } /* 停顿 */
}

/* --- Mobile Adaptation --- */
@media (max-width: 768px) {
  .tier-label-container {
    width: 100%;
    min-width: 100%;
    height: 56px; /* 固定高度 */
    flex-direction: row;
    justify-content: flex-start;
    padding: 0 16px;
  }

  .label-content {
    flex-direction: row;
    gap: 12px;
  }

  .tier-emoji {
    font-size: 28px;
    transform: none;
  }

  .tier-text {
    font-size: 18px;
  }
  
  .shine-effect {
     /* 移动端减弱动画或调整方向 */
     transform: skewX(-20deg) translateX(-150%);
  }
}
</style>
