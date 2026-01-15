<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { NModal, NForm, NFormItem, NInputNumber, NDatePicker, NSwitch, NSpace, NButton, useMessage } from 'naive-ui'
import { supabase } from '@/api/supabase'
import type { InviteCode } from '@/types'

const props = defineProps<{
  show: boolean
  inviteCode: InviteCode | null
}>()

const emit = defineEmits(['update:show', 'success'])

const message = useMessage()
const loading = ref(false)

const formModel = reactive({
  max_uses: 1,
  expires_at: null as number | null,
  is_active: true
})

watch(() => props.inviteCode, (newVal) => {
  if (newVal) {
    formModel.max_uses = newVal.max_uses
    formModel.expires_at = newVal.expires_at ? new Date(newVal.expires_at).getTime() : null
    formModel.is_active = newVal.is_active
  }
}, { immediate: true })

async function handleSubmit() {
  if (!props.inviteCode) return
  
  loading.value = true
  try {
    const { error } = await supabase
      .from('invite_codes')
      .update({
        max_uses: formModel.max_uses,
        expires_at: formModel.expires_at ? new Date(formModel.expires_at).toISOString() : null,
        is_active: formModel.is_active
      })
      .eq('id', props.inviteCode.id)

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
</script>

<template>
  <NModal
    :show="show"
    @update:show="(val) => emit('update:show', val)"
    preset="card"
    title="编辑邀请码"
    style="max-width: 400px"
  >
    <NForm :model="formModel" label-placement="left" label-width="100">
      <NFormItem label="使用次数限制">
        <NInputNumber v-model:value="formModel.max_uses" :min="1" :max="1000" style="width: 100%" />
      </NFormItem>
      <NFormItem label="过期时间">
        <NDatePicker v-model:value="formModel.expires_at" type="datetime" style="width: 100%" clearable />
      </NFormItem>
      <NFormItem label="是否激活">
        <NSwitch v-model:value="formModel.is_active" />
      </NFormItem>
    </NForm>
    <template #footer>
      <NSpace justify="end">
        <NButton @click="emit('update:show', false)">取消</NButton>
        <NButton type="primary" :loading="loading" @click="handleSubmit">保存</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
