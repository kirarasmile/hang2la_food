// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/api/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { UserProfile } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const initialized = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.is_admin || false)

  // 初始化：恢复会话
  async function initialize() {
    if (initialized.value) return

    loading.value = true
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (currentSession) {
        session.value = currentSession
        user.value = currentSession.user
        await fetchProfile()
      }

      // 监听认证状态变化
      supabase.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession
        user.value = newSession?.user || null
        
        if (newSession) {
          fetchProfile()
        } else {
          profile.value = null
        }
      })

      initialized.value = true
    } catch (error) {
      console.error('Failed to initialize auth:', error)
    } finally {
      loading.value = false
    }
  }

  // 获取用户 Profile
  async function fetchProfile() {
    if (!user.value) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (error) throw error
      profile.value = data as unknown as UserProfile
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  // 注册
  async function signUp(email: string, password: string, nickname: string, inviteCode: string) {
    loading.value = true
    try {
      // 1. 注册用户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname,
            invite_code: inviteCode
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('注册失败')

      // 2. 创建用户 Profile（触发器会自动创建，但我们需要确保）
      user.value = authData.user
      session.value = authData.session

      return { success: true, message: '注册成功！' }
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { success: false, message: error.message || '注册失败' }
    } finally {
      loading.value = false
    }
  }

  // 登录
  async function signIn(email: string, password: string) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      user.value = data.user
      session.value = data.session
      await fetchProfile()

      return { success: true, message: '登录成功！' }
    } catch (error: any) {
      console.error('Sign in error:', error)
      let message = error.message || '登录失败'
      if (message === 'Email not confirmed') {
        message = '邮箱尚未确认，请点击邮件中的链接完成验证。如果没有收到邮件，请检查垃圾箱，或联系管理员关闭邮箱验证功能。'
      }
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  // 登出
  async function signOut() {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      user.value = null
      session.value = null
      profile.value = null

      return { success: true, message: '已退出登录' }
    } catch (error: any) {
      console.error('Sign out error:', error)
      return { success: false, message: error.message || '退出登录失败' }
    } finally {
      loading.value = false
    }
  }

  // 更新 Profile
  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user.value) return { success: false, message: '未登录' }

    loading.value = true
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.value.id)

      if (error) throw error

      await fetchProfile()
      return { success: true, message: '更新成功' }
    } catch (error: any) {
      console.error('Update profile error:', error)
      return { success: false, message: error.message || '更新失败' }
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    user,
    session,
    profile,
    loading,
    initialized,
    
    // 计算属性
    isAuthenticated,
    isAdmin,
    
    // 方法
    initialize,
    fetchProfile,
    signUp,
    signIn,
    signOut,
    updateProfile
  }
})
