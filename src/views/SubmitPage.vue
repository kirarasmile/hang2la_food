<script setup lang="ts">
import { NCard, NButton, NIcon, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { ArrowBackOutline } from '@vicons/ionicons5'
import RestaurantForm from '@/components/form/RestaurantForm.vue'
import { supabase } from '@/api/supabase'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

async function handleSubmit(formData: any) {
  if (!authStore.user) {
    message.error('请先登录')
    router.push('/login')
    return
  }

  try {
    const { error } = await supabase
      .from('restaurants')
      .insert({
        ...formData,
        created_by: authStore.user.id
      })

    if (error) throw error

    message.success('美食录入成功！')
    router.push('/')
  } catch (error: any) {
    console.error('Submit error:', error)
    message.error('录入失败: ' + error.message)
  }
}

function handleCancel() {
  router.back()
}
</script>

<template>
  <div class="submit-page">
    <header class="page-header">
      <NButton quaternary circle @click="handleCancel">
        <template #icon>
          <NIcon><ArrowBackOutline /></NIcon>
        </template>
      </NButton>
      <h1 class="page-title">录入美食</h1>
    </header>

    <div class="content-wrapper">
      <NCard :bordered="false" class="form-card">
        <RestaurantForm @submit="handleSubmit" @cancel="handleCancel" />
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.submit-page {
  min-height: 100vh;
  padding: 20px;
  background-color: var(--bg-primary);
}

.page-header {
  max-width: 800px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.form-card {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .submit-page {
    padding: 12px;
  }
  
  .page-title {
    font-size: 20px;
  }
}
</style>
