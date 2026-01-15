<script setup lang="ts">
import { NButton, NIcon, useMessage, NTooltip } from 'naive-ui'
import { NavigateOutline } from '@vicons/ionicons5'
import { openAmap, isMobile, copyToClipboard } from '@/utils/navigation'

const props = defineProps<{
  address: string
  latitude?: number
  longitude?: number
  size?: 'small' | 'medium' | 'large' | 'tiny'
  quaternary?: boolean
  secondary?: boolean
  circle?: boolean
}>()

const message = useMessage()

async function handleClick() {
  if (isMobile()) {
    openAmap(props.address, props.latitude, props.longitude)
  } else {
    const success = await copyToClipboard(props.address)
    if (success) {
      message.success('地址已复制，请在地图应用中粘贴搜索')
    } else {
      message.error('复制失败，请手动选择复制')
    }
  }
}
</script>

<template>
  <div class="navigate-button">
    <NTooltip trigger="hover" v-if="!isMobile()">
      <template #trigger>
        <NButton 
          :size="size || 'small'" 
          :quaternary="quaternary" 
          :secondary="secondary"
          :circle="circle"
          type="primary"
          @click.stop="handleClick"
        >
          <template #icon>
            <NIcon><NavigateOutline /></NIcon>
          </template>
          <slot v-if="!circle">去这里</slot>
        </NButton>
      </template>
      PC端点击复制地址，请打开高德地图粘贴搜索
    </NTooltip>
    
    <NButton 
      v-else
      :size="size || 'small'" 
      :quaternary="quaternary" 
      :secondary="secondary"
      :circle="circle"
      type="primary"
      @click.stop="handleClick"
    >
      <template #icon>
        <NIcon><NavigateOutline /></NIcon>
      </template>
      <slot v-if="!circle">导航</slot>
    </NButton>
  </div>
</template>

<style scoped>
.navigate-button {
  display: inline-block;
}
</style>
