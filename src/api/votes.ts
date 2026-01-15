import { supabase } from './supabase'
import { getFingerprint } from '@/utils/fingerprint'

/**
 * 提交或更新投票
 */
export async function toggleVote(restaurantId: string, voteType: 1 | -1, userId?: string) {
  const fingerprint = !userId ? getFingerprint() : null

  try {
    // 检查是否已有投票
    let query = supabase
      .from('restaurant_votes')
      .select('id, vote_type')
      .eq('restaurant_id', restaurantId)

    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      query = query.eq('fingerprint', fingerprint)
    }

    const { data: existingVotes, error: fetchError } = await query

    if (fetchError) throw fetchError

    if (existingVotes && existingVotes.length > 0) {
      const existingVote = existingVotes[0]
      
      // 如果点击的是相同的投票类型，则取消投票（这里根据需求决定是取消还是保持）
      // 用户要求是“可以改变投票”，没说可以取消，但通常点一下已选的会取消。
      // 为了简单，我们实现：如果点击已选的 -> 删除记录；如果点击不同的 -> 更新类型。
      if (existingVote.vote_type === voteType) {
        const { error: deleteError } = await supabase
          .from('restaurant_votes')
          .delete()
          .eq('id', existingVote.id)
        
        if (deleteError) throw deleteError
        return { action: 'deleted' }
      } else {
        const { error: updateError } = await supabase
          .from('restaurant_votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id)
        
        if (updateError) throw updateError
        return { action: 'updated' }
      }
    } else {
      // 创建新投票
      const { error: insertError } = await supabase
        .from('restaurant_votes')
        .insert({
          restaurant_id: restaurantId,
          user_id: userId || null,
          fingerprint: userId ? null : fingerprint,
          vote_type: voteType
        })
      
      if (insertError) throw insertError
      return { action: 'inserted' }
    }
  } catch (error: any) {
    console.error('Toggle vote error:', error)
    return { error: error.message }
  }
}

/**
 * 获取餐厅投票统计
 */
export async function getRestaurantVotes(restaurantId: string) {
  try {
    const { data, error } = await supabase
      .from('restaurant_votes')
      .select('vote_type')
      .eq('restaurant_id', restaurantId)
    
    if (error) throw error

    const upvotes = data.filter(v => v.vote_type === 1).length
    const downvotes = data.filter(v => v.vote_type === -1).length

    return { upvotes, downvotes }
  } catch (error: any) {
    console.error('Get votes error:', error)
    return { upvotes: 0, downvotes: 0 }
  }
}

/**
 * 获取当前用户/游客对特定餐厅的投票状态
 */
export async function getUserVote(restaurantId: string, userId?: string) {
  const fingerprint = !userId ? getFingerprint() : null

  try {
    let query = supabase
      .from('restaurant_votes')
      .select('vote_type')
      .eq('restaurant_id', restaurantId)

    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      query = query.eq('fingerprint', fingerprint)
    }

    const { data, error } = await query.single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw error
    }

    return data ? data.vote_type : null
  } catch (error: any) {
    console.error('Get user vote error:', error)
    return null
  }
}
