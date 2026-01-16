-- ============================================
-- food-hang2la-list 数据库结构
-- ============================================

-- 1. 启用扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. 枚举类型
CREATE TYPE tier_level AS ENUM ('hang', 'top', 'elite', 'npc', 'la');
CREATE TYPE food_category AS ENUM (
  'chinese', 'japanese', 'korean', 'western', 
  'hotpot', 'bbq', 'dessert', 'drinks', 'fastfood', 'other'
);

-- 3. 用户资料表（扩展 auth.users）
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  invited_by UUID REFERENCES auth.users(id),
  invite_code_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 邀请码表
CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 餐厅数据表
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 基本信息
  name TEXT NOT NULL,
  tier tier_level NOT NULL DEFAULT 'npc',
  category food_category NOT NULL DEFAULT 'other',
  price_per_person INTEGER NOT NULL CHECK (price_per_person > 0),
  
  -- 地址信息
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '深圳',
  district TEXT,
  
  -- 坐标（录入时通过高德 API 获取）
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- 内容
  recommendation TEXT,
  image_url TEXT,
  
  -- 元数据
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 软删除
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- 6. 审计日志表
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 索引
CREATE INDEX idx_restaurants_tier ON restaurants(tier);
CREATE INDEX idx_restaurants_category ON restaurants(category);
CREATE INDEX idx_restaurants_city ON restaurants(city);
CREATE INDEX idx_restaurants_price ON restaurants(price_per_person);
CREATE INDEX idx_restaurants_created_at ON restaurants(created_at DESC);
CREATE INDEX idx_restaurants_not_deleted ON restaurants(is_deleted) WHERE is_deleted = FALSE;

-- 8. 自动更新 updated_at 触发器
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_restaurants_modtime
BEFORE UPDATE ON restaurants
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 9. 速率限制触发器
CREATE OR REPLACE FUNCTION check_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*) FROM restaurants 
    WHERE created_by = auth.uid() 
    AND created_at > NOW() - INTERVAL '1 hour'
    AND is_deleted = FALSE
  ) >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded: max 10 submissions per hour';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_rate_limit
BEFORE INSERT ON restaurants
FOR EACH ROW EXECUTE FUNCTION check_rate_limit();

-- 10. RLS 策略
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 餐厅：所有人可读（未删除的）
CREATE POLICY "Public read restaurants" ON restaurants
FOR SELECT USING (is_deleted = FALSE);

-- 餐厅：登录用户可插入
CREATE POLICY "Authenticated insert restaurants" ON restaurants
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = created_by);

-- 餐厅：创建者或管理员可更新（包括软删除）
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

-- 邀请码：管理员可管理
CREATE POLICY "Admin manage invite_codes" ON invite_codes
FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- 邀请码：所有人可验证（只读 code 和 is_active）
CREATE POLICY "Public verify invite_codes" ON invite_codes
FOR SELECT USING (TRUE);

-- 用户资料：本人可读写
CREATE POLICY "Users manage own profile" ON user_profiles
FOR ALL TO authenticated
USING (auth.uid() = id);
