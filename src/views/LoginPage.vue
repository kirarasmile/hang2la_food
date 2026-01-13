<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NForm, NFormItem, NInput, NButton, NCheckbox, NSpace, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()

const formRef = ref<any>(null)
const loading = ref(false)

const formData = ref({
  email: '',
  password: '',
  remember: true
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email' as const, message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

async function handleLogin() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  loading.value = true
  try {
    const result = await authStore.signIn(
      formData.value.email,
      formData.value.password
    )

    if (result.success) {
      message.success('登录成功！')
      
      // 跳转到首页或之前的页面
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/')
    } else {
      message.error(result.message)
    }
  } catch (error: any) {
    console.error('Login error:', error)
    message.error(error.message || '登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

function goToRegister() {
  router.push('/register')
}

function goToHome() {
  router.push('/')
}
</script>

<template>
  <div class="page-container">
    <div class="login-wrapper">
      <NCard title="🍜 欢迎回来" class="login-card">
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
              @keyup.enter="handleLogin"
            />
          </NFormItem>

          <NFormItem label="密码" path="password">
            <NInput
              v-model:value="formData.password"
              placeholder="请输入密码"
              type="password"
              show-password-on="click"
              :disabled="loading"
              @keyup.enter="handleLogin"
            />
          </NFormItem>

          <NFormItem :show-label="false">
            <NCheckbox v-model:checked="formData.remember" :disabled="loading">
              记住我
            </NCheckbox>
          </NFormItem>

          <NFormItem :show-label="false">
            <NSpace style="width: 100%; justify-content: space-between">
              <NButton :disabled="loading" @click="goToHome">
                返回首页
              </NButton>
              
              <NSpace>
                <NButton :disabled="loading" @click="goToRegister">
                  注册账号
                </NButton>
                <NButton
                  type="primary"
                  :loading="loading"
                  @click="handleLogin"
                >
                  登录
                </NButton>
              </NSpace>
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

.login-wrapper {
  width: 100%;
  max-width: 450px;
}

.login-card {
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

  .login-card :deep(.n-card__header) {
    font-size: 20px;
  }

  :deep(.n-form) {
    padding: 0 8px;
  }
}
</style>
