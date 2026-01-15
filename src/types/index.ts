// src/types/index.ts

export type TierRating = 'hang' | 'top' | 'elite' | 'npc' | 'la'

export type FoodCategory = 
  | 'chinese' | 'japanese' | 'korean' | 'western' 
  | 'hotpot' | 'bbq' | 'dessert' | 'drinks' | 'fastfood' | 'other'

export const TIER_CONFIG = {
  hang:  { label: '夯',    color: '#FFD700', emoji: '🏆', order: 1 },
  top:   { label: '顶级',  color: '#B026FF', emoji: '💎', order: 2 },
  elite: { label: '人上人', color: '#1E90FF', emoji: '⭐', order: 3 },
  npc:   { label: 'NPC',   color: '#A9A9A9', emoji: '😐', order: 4 },
  la:    { label: '拉',    color: '#FF4500', emoji: '💩', order: 5 }
} as const

export const CATEGORY_CONFIG = {
  chinese:  { label: '中餐', emoji: '🥢' },
  japanese: { label: '日料', emoji: '🍣' },
  korean:   { label: '韩餐', emoji: '🍜' },
  western:  { label: '西餐', emoji: '🍝' },
  hotpot:   { label: '火锅', emoji: '🍲' },
  bbq:      { label: '烧烤', emoji: '🍖' },
  dessert:  { label: '甜品', emoji: '🍰' },
  drinks:   { label: '饮品', emoji: '🧋' },
  fastfood: { label: '快餐', emoji: '🍔' },
  other:    { label: '其他', emoji: '🍴' }
} as const

export interface Restaurant {
  id: string
  name: string
  tier: TierRating
  category: FoodCategory
  price_per_person: number
  address: string
  city: string
  district?: string
  latitude?: number
  longitude?: number
  recommendation?: string
  image_url?: string
  created_by: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  // 聚合字段
  upvotes?: number
  downvotes?: number
  user_vote?: number // 当前用户的投票状态：1, -1 或 undefined
}

export interface RestaurantVote {
  id: string
  restaurant_id: string
  user_id?: string
  vote_type: 1 | -1
  fingerprint?: string
  created_at: string
  updated_at: string
}

export interface InviteCode {
  id: string
  code: string
  created_by?: string
  max_uses: number
  current_uses: number
  used_by?: string
  used_at?: string
  expires_at?: string
  is_active: boolean
  created_at: string
}

export interface UserProfile {
  id: string
  nickname?: string
  avatar_url?: string
  is_admin: boolean
  invited_by?: string
  invite_code_used?: string
  created_at: string
}
