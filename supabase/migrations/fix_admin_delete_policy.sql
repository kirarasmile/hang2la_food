-- ============================================
-- 修复管理员删除餐厅权限问题
-- 问题: 两个 UPDATE 策略的 WITH CHECK 冲突导致 403 错误
-- 解决方案: 合并两个 UPDATE 策略为一个，统一处理创建者和管理员权限
-- ============================================

-- 删除旧的 UPDATE 策略
DROP POLICY IF EXISTS "Creator update restaurants" ON restaurants;
DROP POLICY IF EXISTS "Creator or admin delete restaurants" ON restaurants;

-- 创建新的统一 UPDATE 策略：创建者或管理员可更新
-- 这样管理员可以更新任何餐厅（包括软删除操作）
CREATE POLICY "Creator or admin update restaurants" ON restaurants
FOR UPDATE TO authenticated
USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = TRUE)
)
WITH CHECK (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 注意：执行此迁移后，请在 Supabase Dashboard 的 SQL Editor 中运行此脚本
-- 或使用 supabase db push 命令
