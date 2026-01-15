<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NButton, NSpace, useMessage } from 'naive-ui'
import { ThumbsUpOutline, ThumbsUp, ThumbsDownOutline, ThumbsDown } from '@vicons/ionicons5'
import { toggleVote, getRestaurantVotes, getUserVote } from '@/api/votes'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  restaurantId: string
  upvotes?: number
  downvotes?: number
  userVote?: number
}>()

const emit = defineEmits(['update'])

const authStore = useAuthStore()
const message = useMessage()

const currentUpvotes = ref(props.upvotes || 0)
const currentDownvotes = ref(props.downvotes || 0)
const currentUserVote = ref<number | null>(props.userVote || null)
const loading = ref(false)

onMounted(async () => {
  // 如果没有传入初始数据，则拉取
  if (props.upvotes === undefined) {
    fetchVotes()
  }
  if (props.userVote === undefined) {
    fetchUserVote()
  }
})

async function fetchVotes() {
  const { upvotes, downvotes } = await getRestaurantVotes(props.restaurantId)
  currentUpvotes.value = upvotes
  currentDownvotes.value = downvotes
}

async function fetchUserVote() {
  const vote = await getUserVote(props.restaurantId, authStore.user?.id)
  currentUserVote.value = vote
}

async function handleVote(type: 1 | -1) {
  if (loading.value) return
  loading.value = true
  
  try {
    const result = await toggleVote(props.restaurantId, type, authStore.user?.id)
    
    if (result.error) {
      message.error(result.error)
    } else {
      // 刷新数据
      await fetchVotes()
      await fetchUserVote()
      emit('update', { 
        upvotes: currentUpvotes.value, 
        downvotes: currentDownvotes.value, 
        userVote: currentUserVote.value 
      })
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="vote-buttons">
    <NSpace :size="8">
      <NButton
        size="tiny"
        secondary
        round
        :type="currentUserVote === 1 ? 'primary' : 'default'"
        @click.stop="handleVote(1)"
        :loading="loading"
      >
        <template #icon>
          <component :is="currentUserVote === 1 ? ThumbsUp : ThumbsUpOutline" />
        </template>
        {{ currentUpvotes }}
      </NButton>
      
      <NButton
        size="tiny"
        secondary
        round
        :type="currentUserVote === -1 ? 'error' : 'default'"
        @click.stop="handleVote(-1)"
        :loading="loading"
      >
        <template #icon>
          <component :is="currentUserVote === -1 ? ThumbsDown : ThumbsDownOutline" />
        </template>
        {{ currentDownvotes }}
      </NButton>
    </NSpace>
  </div>
</template>

<style scoped>
.vote-buttons {
  display: inline-block;
}
</style>
