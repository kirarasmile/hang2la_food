<script setup lang="ts">
import { ref } from 'vue'
import { NUpload, NUploadDragger, NIcon, NText, NP, useMessage } from 'naive-ui'
import { CloudUploadOutline } from '@vicons/ionicons5'
import imageCompression from 'browser-image-compression'
import { supabase } from '@/api/supabase'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['success', 'error'])
const message = useMessage()
const authStore = useAuthStore()

const fileList = ref<any[]>([])
const loading = ref(false)

async function customRequest({ file, onFinish, onError, onProgress }: any) {
  if (!authStore.user) {
    message.error('请先登录')
    onError()
    return
  }

  loading.value = true
  try {
    const rawFile = file.file as File
    
    // 1. 图片压缩配置
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    
    onProgress({ percent: 20 })
    const compressedFile = await imageCompression(rawFile, options)
    onProgress({ percent: 50 })

    // 2. 生成文件名
    const fileExt = rawFile.name.split('.').pop()
    const fileName = `${authStore.user.id}/${Date.now()}.${fileExt}`
    const filePath = `restaurant-images/${fileName}`

    // 3. 上传到 Supabase Storage
    const { error } = await supabase.storage
      .from('food-images') // 确保存储桶名称正确
      .upload(filePath, compressedFile, {
        upsert: true
      })

    if (error) throw error

    // 4. 获取公开 URL
    const { data: { publicUrl } } = supabase.storage
      .from('food-images')
      .getPublicUrl(filePath)

    onProgress({ percent: 100 })
    onFinish()
    
    emit('success', publicUrl)
    message.success('图片上传成功')
  } catch (error: any) {
    console.error('Upload error:', error)
    message.error('图片上传失败: ' + error.message)
    onError()
    emit('error', error)
  } finally {
    loading.value = false
  }
}

function handleRemove() {
  emit('success', '')
}
</script>

<template>
  <NUpload
    v-model:file-list="fileList"
    directory-dnd
    :max="1"
    accept="image/*"
    list-type="image-card"
    :custom-request="customRequest"
    @remove="handleRemove"
  >
    <NUploadDragger v-if="fileList.length === 0">
      <div class="dragger-content">
        <NIcon size="48" :depth="3">
          <CloudUploadOutline />
        </NIcon>
        <NText style="font-size: 14px; margin-top: 8px">
          点击或拖拽图片到此处上传
        </NText>
        <NP depth="3" style="margin: 4px 0 0 0; font-size: 12px">
          支持 JPG, PNG, WebP (压缩后不超过 1MB)
        </NP>
      </div>
    </NUploadDragger>
  </NUpload>
</template>

<style scoped>
:deep(.n-upload-trigger) {
  width: 100%;
}

.dragger-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}
</style>
