// src/api/inviteCode.ts
import { supabase } from './supabase'

export interface InviteCodeValidation {
  valid: boolean
  message: string
  codeData?: {
    id: string
    code: string
    max_uses: number
    current_uses: number
    expires_at: string | null
  }
}

/**
 * 验证邀请码
 */
export async function validateInviteCode(code: string): Promise<InviteCodeValidation> {
  try {
    // 1. 查询邀请码
    const { data, error } = await supabase
      .from('invite_codes')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return {
        valid: false,
        message: '邀请码不存在或已失效'
      }
    }

    // 2. 检查是否过期
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at)
      if (expiresAt < new Date()) {
        return {
          valid: false,
          message: '邀请码已过期'
        }
      }
    }

    // 3. 检查使用次数
    if (data.current_uses >= data.max_uses) {
      return {
        valid: false,
        message: '邀请码使用次数已达上限'
      }
    }

    return {
      valid: true,
      message: '邀请码有效',
      codeData: data as any
    }
  } catch (error: any) {
    console.error('Invite code validation error:', error)
    return {
      valid: false,
      message: error.message || '验证失败，请稍后重试'
    }
  }
}

/**
 * 使用邀请码（注册时调用）
 */
export async function useInviteCode(code: string, userId: string): Promise<{ success: boolean; message: string }> {
  try {
    // 1. 验证邀请码
    const validation = await validateInviteCode(code)
    if (!validation.valid || !validation.codeData) {
      return {
        success: false,
        message: validation.message
      }
    }

    // 2. 更新邀请码使用次数
    const { error: updateError } = await supabase
      .from('invite_codes')
      .update({
        current_uses: validation.codeData.current_uses + 1,
        used_by: userId,
        used_at: new Date().toISOString()
      })
      .eq('id', validation.codeData.id)

    if (updateError) throw updateError

    return {
      success: true,
      message: '邀请码使用成功'
    }
  } catch (error: any) {
    console.error('Use invite code error:', error)
    return {
      success: false,
      message: error.message || '使用邀请码失败'
    }
  }
}

/**
 * 创建邀请码（管理员功能）
 */
export async function createInviteCode(maxUses: number = 1, expiresInDays: number = 7): Promise<{ success: boolean; code?: string; message: string }> {
  try {
    // 生成随机邀请码
    const code = generateRandomCode()
    
    // 计算过期时间
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    const { error } = await supabase
      .from('invite_codes')
      .insert({
        code,
        max_uses: maxUses,
        expires_at: expiresAt.toISOString(),
        is_active: true
      })

    if (error) throw error

    return {
      success: true,
      code,
      message: '邀请码创建成功'
    }
  } catch (error: any) {
    console.error('Create invite code error:', error)
    return {
      success: false,
      message: error.message || '创建邀请码失败'
    }
  }
}

/**
 * 获取所有邀请码 (管理员)
 */
export async function getInviteCodes() {
  try {
    const { data, error } = await supabase
      .from('invite_codes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    console.error('Get invite codes error:', error)
    return { success: false, message: error.message }
  }
}

/**
 * 撤销邀请码 (管理员)
 */
export async function revokeInviteCode(id: string) {
  try {
    const { error } = await supabase
      .from('invite_codes')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error('Revoke invite code error:', error)
    return { success: false, message: error.message }
  }
}

/**
 * 生成随机邀请码 (8位大写字母+数字)
 */
function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 去除易混淆字符
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}
