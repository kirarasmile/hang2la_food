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
    const { error } = await supabase
      .from('restaurants')
      .update({
        ...formData,
        updated_at: new Date().toISOString()
      })
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
