<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NForm, NFormItem, NInput, NButton, NSpace, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { validateInviteCode, useInviteCode } from '@/api/inviteCode'

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()

const formRef = ref<any>(null)
const loading = ref(false)
const validatingCode = ref(false)

const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  inviteCode: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email' as const, message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: ['blur', 'change'] }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string) => {
        return value === formData.value.password
      },
      message: '两次输入的密码不一致',
      trigger: ['blur', 'change']
    }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度为 2-20 个字符', trigger: ['blur', 'change'] }
  ],
  inviteCode: [
    { required: true, message: '请输入邀请码', trigger: 'blur' },
    { len: 8, message: '邀请码为 8 位', trigger: ['blur', 'change'] }
  ]
}

async function handleValidateCode() {
  if (!formData.value.inviteCode || formData.value.inviteCode.length !== 8) {
    message.warning('请输入 8 位邀请码')
    return
  }

  validatingCode.value = true
  try {
    const result = await validateInviteCode(formData.value.inviteCode)
    if (result.valid) {
      message.success('邀请码有效！')
    } else {
      message.error(result.message)
    }
  } finally {
    validatingCode.value = false
  }
}

async function handleRegister() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    // 1. 验证邀请码
    const codeValidation = await validateInviteCode(formData.value.inviteCode)
    if (!codeValidation.valid) {
      message.error(codeValidation.message)
      return
    }

    // 2. 注册用户
    const result = await authStore.signUp(
      formData.value.email,
      formData.value.password,
      formData.value.nickname,
      formData.value.inviteCode
    )

    if (result.success) {
      // 3. 使用邀请码
      if (authStore.user) {
        await useInviteCode(formData.value.inviteCode, authStore.user.id)
      }

      message.success('注册成功！请查收邮箱验证邮件')
      
      // 延迟跳转到登录页
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      message.error(result.message)
    }
  } catch (error: any) {
    console.error('Register error:', error)
    message.error(error.message || '注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="page-container">
    <div class="register-wrapper">
      <NCard title="🍜 注册账号" class="register-card">
        <NForm
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-placement="left"
          label-width="80"
          require-mark-placement="right-hanging"
        >
          <NFormItem label="邮箱" path="email">
            <NInput
              v-model:value="formData.email"
              placeholder="请输入邮箱"
              :disabled="loading"
            />
          </NFormItem>

          <NFormItem label="密码" path="password">
            <NInput
              v-model:value="formData.password"
              placeholder="至少 6 位"
              type="password"
              show-password-on="click"
              :disabled="loading"
            />
          </NFormItem>

          <NFormItem label="确认密码" path="confirmPassword">
            <NInput
              v-model:value="formData.confirmPassword"
              placeholder="再次输入密码"
              type="password"
              show-password-on="click"
              :disabled="loading"
            />
          </NFormItem>

          <NFormItem label="昵称" path="nickname">
            <NInput
              v-model:value="formData.nickname"
              placeholder="2-20 个字符"
              :disabled="loading"
            />
          </NFormItem>

          <NFormItem label="邀请码" path="inviteCode">
            <NSpace style="width: 100%">
              <NInput
                v-model:value="formData.inviteCode"
                placeholder="8 位邀请码"
                :disabled="loading"
                style="flex: 1"
                @input="formData.inviteCode = formData.inviteCode.toUpperCase()"
              />
              <NButton
                secondary
                :loading="validatingCode"
                :disabled="loading || formData.inviteCode.length !== 8"
                @click="handleValidateCode"
              >
                验证
              </NButton>
            </NSpace>
          </NFormItem>

          <NFormItem>
            <NSpace style="width: 100%; justify-content: flex-end">
              <NButton :disabled="loading" @click="goToLogin">
                已有账号？去登录
              </NButton>
              <NButton
                type="primary"
                :loading="loading"
                @click="handleRegister"
              >
                注册
              </NButton>
            </NSpace>
          </NFormItem>
        </NForm>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.register-wrapper {
  width: 100%;
  max-width: 500px;
}

.register-card {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

:deep(.n-card__header) {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
}

:deep(.n-form-item-label) {
  color: var(--text-secondary);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-container {
    padding: 12px;
  }

  .register-card :deep(.n-card__header) {
    font-size: 20px;
  }

  :deep(.n-form) {
    padding: 0 8px;
  }
}
</style>
