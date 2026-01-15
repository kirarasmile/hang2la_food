-- 11. 餐厅投票表
CREATE TABLE restaurant_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- 可为空（游客投票）
  vote_type INTEGER NOT NULL CHECK (vote_type IN (1, -1)), -- 1 为赞，-1 为踩
  fingerprint TEXT, -- 游客指纹 (localStorage)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 唯一性约束：登录用户每个餐厅只能投一票
CREATE UNIQUE INDEX idx_votes_user_restaurant ON restaurant_votes(restaurant_id, user_id) WHERE user_id IS NOT NULL;
-- 唯一性约束：游客通过指纹每个餐厅只能投一票
CREATE UNIQUE INDEX idx_votes_fingerprint_restaurant ON restaurant_votes(restaurant_id, fingerprint) WHERE user_id IS NULL;

-- 索引
CREATE INDEX idx_votes_restaurant_id ON restaurant_votes(restaurant_id);

-- RLS 策略
ALTER TABLE restaurant_votes ENABLE ROW LEVEL SECURITY;

-- 所有人可读投票数据
CREATE POLICY "Public read votes" ON restaurant_votes
FOR SELECT USING (TRUE);

-- 所有人可插入投票（登录用户或游客）
CREATE POLICY "Public insert votes" ON restaurant_votes
FOR INSERT WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (auth.uid() IS NULL AND fingerprint IS NOT NULL)
);

-- 所有人可更新自己的投票
CREATE POLICY "Public update own votes" ON restaurant_votes
FOR UPDATE USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (auth.uid() IS NULL AND fingerprint IS NOT NULL)
);

-- 所有人可删除自己的投票 (新增)
CREATE POLICY "Public delete own votes" ON restaurant_votes
FOR DELETE USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (auth.uid() IS NULL AND fingerprint IS NOT NULL)
);

-- 自动更新 updated_at
CREATE TRIGGER update_votes_modtime
BEFORE UPDATE ON restaurant_votes
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 为了方便查询，给 restaurants 表增加聚合字段（可选，或者使用视图）
-- 这里我们先用视图或实时计算，如果性能有问题再加触发器同步到 restaurants 表
CREATE OR REPLACE VIEW restaurant_stats AS
SELECT 
  restaurant_id,
  COUNT(*) FILTER (WHERE vote_type = 1) as upvotes,
  COUNT(*) FILTER (WHERE vote_type = -1) as downvotes
FROM restaurant_votes
GROUP BY restaurant_id;

-- RPC 获取包含投票信息的餐厅列表 (修正版：明确字段列表，避免 r.* 顺序问题)
CREATE OR REPLACE FUNCTION get_restaurants_with_votes(user_uuid UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  name TEXT,
  tier tier_level,
  category food_category,
  price_per_person INTEGER,
  address TEXT,
  city TEXT,
  district TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  recommendation TEXT,
  image_url TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  is_deleted BOOLEAN,
  upvotes BIGINT,
  downvotes BIGINT,
  user_vote INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id, r.name, r.tier, r.category, r.price_per_person, 
    r.address, r.city, r.district, r.latitude, r.longitude, 
    r.recommendation, r.image_url, r.created_by, r.created_at, 
    r.updated_at, r.is_deleted,
    COALESCE(s.upvotes, 0)::BIGINT as upvotes,
    COALESCE(s.downvotes, 0)::BIGINT as downvotes,
    (SELECT v.vote_type FROM restaurant_votes v 
     WHERE v.restaurant_id = r.id AND (
       (user_uuid IS NOT NULL AND v.user_id = user_uuid)
     ) LIMIT 1) as user_vote
  FROM restaurants r
  LEFT JOIN (
    SELECT 
      restaurant_id,
      COUNT(*) FILTER (WHERE vote_type = 1) as upvotes,
      COUNT(*) FILTER (WHERE vote_type = -1) as downvotes
    FROM restaurant_votes
    GROUP BY restaurant_id
  ) s ON r.id = s.restaurant_id
  WHERE r.is_deleted = FALSE
  ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql;
