<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { 
  NCard, NTabs, NTabPane, NDataTable, NButton, 
  NSpace, NTag, NPopconfirm, useMessage, NModal,
  NForm, NFormItem, NInputNumber
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { ArrowBackOutline, AddOutline } from '@vicons/ionicons5'
import { supabase } from '@/api/supabase'
import { getInviteCodes, createInviteCode, revokeInviteCode } from '@/api/inviteCode'
import { TIER_CONFIG } from '@/types'

const router = useRouter()
const message = useMessage()
const restaurants = ref<any[]>([])
const inviteCodes = ref<any[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const createLoading = ref(false)

const createForm = ref({
  maxUses: 1,
  expiresInDays: 7
})

onMounted(() => {
  fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    await Promise.all([
      fetchRestaurants(),
      fetchInviteCodes()
    ])
  } finally {
    loading.value = false
  }
}

async function fetchRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
  
  if (error) {
    message.error('获取餐厅列表失败')
  } else {
    restaurants.value = data || []
  }
}

async function fetchInviteCodes() {
  const result = await getInviteCodes()
  if (result.success) {
    inviteCodes.value = result.data || []
  } else {
    message.error('获取邀请码失败')
  }
}

async function handleDeleteRestaurant(id: string) {
  const { error } = await supabase
    .from('restaurants')
    .update({ is_deleted: true })
    .eq('id', id)

  if (error) {
    message.error('删除失败')
  } else {
    message.success('已删除')
    fetchRestaurants()
  }
}

async function handleRevokeInvite(id: string) {
  const result = await revokeInviteCode(id)
  if (result.success) {
    message.success('已撤销')
    fetchInviteCodes()
  } else {
    message.error('撤销失败')
  }
}

async function handleCreateInvite() {
  createLoading.value = true
  try {
    const result = await createInviteCode(createForm.value.maxUses, createForm.value.expiresInDays)
    if (result.success) {
      message.success(`创建成功: ${result.code}`)
      showCreateModal.value = false
      fetchInviteCodes()
    } else {
      message.error(result.message)
    }
  } finally {
    createLoading.value = false
  }
}

// 餐厅列表列定义
const restaurantColumns = [
  { title: '名称', key: 'name' },
  { 
    title: '评级', 
    key: 'tier',
    render(row: any) {
      const config = TIER_CONFIG[row.tier as keyof typeof TIER_CONFIG]
      return h(NTag, { type: 'info', bordered: false, style: { backgroundColor: config?.color, color: '#fff' } }, { default: () => config?.label })
    }
  },
  { title: '城市', key: 'city' },
  { title: '创建时间', key: 'created_at', render(row: any) { return new Date(row.created_at).toLocaleDateString() } },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      return h(
        NPopconfirm,
        {
          onPositiveClick: () => handleDeleteRestaurant(row.id)
        },
        {
          trigger: () => h(NButton, { size: 'small', type: 'error', quaternary: true }, { default: () => '删除' }),
          default: () => '确定要删除这家餐厅吗？'
        }
      )
    }
  }
]

// 邀请码列表列定义
const inviteColumns = [
  { title: '邀请码', key: 'code', render(row: any) { return h('code', { style: { fontWeight: 'bold', fontSize: '1.1em' } }, row.code) } },
  { title: '可用次数', key: 'max_uses' },
  { title: '已使用', key: 'current_uses' },
  { 
    title: '状态', 
    key: 'is_active',
    render(row: any) {
      const active = row.is_active && (!row.expires_at || new Date(row.expires_at) > new Date())
      return h(NTag, { type: active ? 'success' : 'default', bordered: false }, { default: () => active ? '有效' : '失效' })
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row: any) {
      return h(
        NButton,
        {
          size: 'small',
          disabled: !row.is_active,
          onClick: () => handleRevokeInvite(row.id)
        },
        { default: () => '撤销' }
      )
    }
  }
]

function handleBack() {
  router.push('/')
}
</script>

<template>
  <div class="admin-page">
    <header class="page-header">
      <NSpace align="center">
        <NButton quaternary circle @click="handleBack">
          <template #icon><ArrowBackOutline /></template>
        </NButton>
        <h1 class="page-title">管理后台</h1>
      </NSpace>
    </header>

    <main class="content-wrapper">
      <NCard :bordered="false" class="admin-card">
        <NTabs type="line" animated>
          <NTabPane name="restaurants" tab="餐厅管理">
            <NDataTable
              :columns="restaurantColumns"
              :data="restaurants"
              :loading="loading"
              :pagination="{ pageSize: 10 }"
            />
          </NTabPane>
          <NTabPane name="invites" tab="邀请码管理">
            <NSpace vertical :size="16">
              <NSpace justify="end">
                <NButton type="primary" @click="showCreateModal = true">
                  <template #icon><AddOutline /></template>
                  生成邀请码
                </NButton>
              </NSpace>
              <NDataTable
                :columns="inviteColumns"
                :data="inviteCodes"
                :loading="loading"
                :pagination="{ pageSize: 10 }"
              />
            </NSpace>
          </NTabPane>
        </NTabs>
      </NCard>
    </main>

    <!-- 创建邀请码弹窗 -->
    <NModal
      v-model:show="showCreateModal"
      preset="card"
      title="生成邀请码"
      style="max-width: 400px"
    >
      <NForm :model="createForm" label-placement="left" label-width="100">
        <NFormItem label="使用次数限制">
          <NInputNumber v-model:value="createForm.maxUses" :min="1" :max="100" style="width: 100%" />
        </NFormItem>
        <NFormItem label="有效期(天)">
          <NInputNumber v-model:value="createForm.expiresInDays" :min="1" :max="365" style="width: 100%" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showCreateModal = false">取消</NButton>
          <NButton type="primary" :loading="createLoading" @click="handleCreateInvite">确定生成</NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 20px;
  background-color: var(--bg-primary);
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 24px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-card {
  background-color: var(--bg-secondary);
  border-radius: 12px;
}

@media (max-width: 768px) {
  .admin-page {
    padding: 12px;
  }
}
</style>
