-- 1. 创建投票表 (如果不存在)
CREATE TABLE IF NOT EXISTS restaurant_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (1, -1)),
  fingerprint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 唯一性约束
DROP INDEX IF EXISTS idx_votes_user_restaurant;
CREATE UNIQUE INDEX idx_votes_user_restaurant ON restaurant_votes(restaurant_id, user_id) WHERE user_id IS NOT NULL;

DROP INDEX IF EXISTS idx_votes_fingerprint_restaurant;
CREATE UNIQUE INDEX idx_votes_fingerprint_restaurant ON restaurant_votes(restaurant_id, fingerprint) WHERE user_id IS NULL;

-- 3. RLS 策略配置
ALTER TABLE restaurant_votes ENABLE ROW LEVEL SECURITY;

-- 删除旧策略以防冲突
DROP POLICY IF EXISTS "Public read votes" ON restaurant_votes;
DROP POLICY IF EXISTS "Public insert votes" ON restaurant_votes;
DROP POLICY IF EXISTS "Public update own votes" ON restaurant_votes;
DROP POLICY IF EXISTS "Public delete own votes" ON restaurant_votes;

CREATE POLICY "Public read votes" ON restaurant_votes FOR SELECT USING (TRUE);
CREATE POLICY "Public insert votes" ON restaurant_votes FOR INSERT WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (auth.uid() IS NULL AND fingerprint IS NOT NULL)
);
CREATE POLICY "Public update own votes" ON restaurant_votes FOR UPDATE USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (auth.uid() IS NULL AND fingerprint IS NOT NULL)
);
CREATE POLICY "Public delete own votes" ON restaurant_votes FOR DELETE USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  (auth.uid() IS NULL AND fingerprint IS NOT NULL)
);

-- 4. 修复首页 RPC 函数 (核心修复)
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
