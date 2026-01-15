<script setup lang="ts">
import { ref } from 'vue'
import { NModal, useMessage } from 'naive-ui'
import RestaurantForm from '@/components/form/RestaurantForm.vue'
import { supabase } from '@/api/supabase'
import type { Restaurant } from '@/types'

const props = defineProps<{
  show: boolean
  restaurant: Restaurant | null
}>()

const emit = defineEmits(['update:show', 'success'])

const message = useMessage()
const loading = ref(false)

async function handleSubmit(formData: any) {
  if (!props.restaurant) return
  
  loading.value = true
  try {
    // 只保留 restaurants 表中实际存在的可更新字段
    // 排除聚合字段 (upvotes, downvotes, user_vote) 和系统字段 (id, created_by, created_at, is_deleted 等)
    const updateData = {
      name: formData.name,
      tier: formData.tier,
      category: formData.category,
      price_per_person: formData.price_per_person,
      address: formData.address,
      city: formData.city,
      district: formData.district,
      latitude: formData.latitude,
      longitude: formData.longitude,
      recommendation: formData.recommendation,
      image_url: formData.image_url,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('restaurants')
      .update(updateData)
      .eq('id', props.restaurant.id)

    if (error) throw error
    
    message.success('修改成功')
    emit('success')
    emit('update:show', false)
  } catch (error: any) {
    message.error('修改失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  emit('update:show', false)
}
</script>

<template>
  <NModal
    :show="show"
    @update:show="(val) => emit('update:show', val)"
    preset="card"
    title="编辑餐厅信息"
    style="max-width: 800px; max-height: 90vh; overflow-y: auto;"
    class="edit-modal"
  >
    <div v-if="restaurant">
      <RestaurantForm 
        :initial-data="restaurant" 
        @submit="handleSubmit" 
        @cancel="handleCancel" 
      />
    </div>
  </NModal>
</template>

<style scoped>
.edit-modal {
  margin: 20px auto;
}
</style>
