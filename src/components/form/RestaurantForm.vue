<script setup lang="ts">
import { ref, reactive } from 'vue'
import { 
  NForm, NFormItem, NInput, NInputNumber, 
  NSelect, NButton, NSpace, NDivider, useMessage 
} from 'naive-ui'
import { TIER_CONFIG, CATEGORY_CONFIG } from '@/types'
import type { TierRating, FoodCategory } from '@/types'
import ImageUploader from './ImageUploader.vue'
import AddressPicker from './AddressPicker.vue'

const emit = defineEmits(['submit', 'cancel'])
const message = useMessage()
const formRef = ref<any>(null)
const loading = ref(false)

const formModel = reactive({
  name: '',
  tier: 'npc' as TierRating,
  category: 'chinese' as FoodCategory,
  price_per_person: 50,
  address: '',
  city: '',
  district: '',
  latitude: null as number | null,
  longitude: null as number | null,
  recommendation: '',
  image_url: ''
})

const rules = {
  name: { required: true, message: '请输入餐厅名称', trigger: 'blur' },
  tier: { required: true, message: '请选择评级', trigger: 'change' },
  category: { required: true, message: '请选择类别', trigger: 'change' },
  address: { required: true, message: '请选择地址', trigger: 'change' }
}

const tierOptions = Object.entries(TIER_CONFIG).map(([key, value]) => ({
  label: `${value.emoji} ${value.label}`,
  value: key as TierRating
}))

const categoryOptions = Object.entries(CATEGORY_CONFIG).map(([key, value]) => ({
  label: `${value.emoji} ${value.label}`,
  value: key as FoodCategory
}))

function handleAddressSelect(addressData: any) {
  formModel.address = addressData.address
  formModel.city = addressData.city
  formModel.district = addressData.district
  formModel.latitude = addressData.location.lat
  formModel.longitude = addressData.location.lng
  if (!formModel.name) {
    formModel.name = addressData.name
  }
}

function handleImageUpload(url: string) {
  formModel.image_url = url
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    loading.value = true
    emit('submit', { ...formModel })
  } catch (errors) {
    message.error('请填写完整信息')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NForm
    ref="formRef"
    :model="formModel"
    :rules="rules"
    label-placement="top"
    class="restaurant-form"
  >
    <div class="form-section">
      <h3 class="section-title">📍 位置信息</h3>
      <NFormItem label="搜索地址" path="address">
        <AddressPicker @select="handleAddressSelect" />
      </NFormItem>
      
      <NFormItem label="餐厅名称" path="name">
        <NInput v-model:value="formModel.name" placeholder="请输入或从地址搜索" />
      </NFormItem>
    </div>

    <NDivider />

    <div class="form-section">
      <h3 class="section-title">⭐ 评价信息</h3>
      <NSpace vertical :size="16">
        <div class="form-row">
          <NFormItem label="等级" path="tier" class="flex-1">
            <NSelect v-model:value="formModel.tier" :options="tierOptions" />
          </NFormItem>
          
          <NFormItem label="类别" path="category" class="flex-1">
            <NSelect v-model:value="formModel.category" :options="categoryOptions" />
          </NFormItem>
        </div>

        <NFormItem label="人均价格 (元)" path="price_per_person">
          <NInputNumber v-model:value="formModel.price_per_person" :min="0" :step="10" class="w-full" />
        </NFormItem>
      </NSpace>
    </div>

    <NDivider />

    <div class="form-section">
      <h3 class="section-title">🖼️ 展示与推荐</h3>
      <NFormItem label="餐厅图片" path="image_url">
        <ImageUploader @success="handleImageUpload" />
      </NFormItem>

      <NFormItem label="一句话推荐 (避雷建议)" path="recommendation">
        <NInput
          v-model:value="formModel.recommendation"
          type="textarea"
          placeholder="分享你的用餐体验，或者必点菜品..."
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </NFormItem>
    </div>

    <div class="form-actions">
      <NSpace justify="end">
        <NButton @click="emit('cancel')">取消</NButton>
        <NButton type="primary" :loading="loading" @click="handleSubmit">提交发布</NButton>
      </NSpace>
    </div>
  </NForm>
</template>

<style scoped>
.restaurant-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.form-row {
  display: flex;
  gap: 16px;
}

.flex-1 {
  flex: 1;
}

.w-full {
  width: 100%;
}

.form-actions {
  margin-top: 32px;
  padding-bottom: 40px;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>
