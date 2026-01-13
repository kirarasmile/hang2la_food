# 🍜 美食从夯到拉排行榜

一个使用网络热梗"从夯到拉"评分体系的美食分享应用

## 评分体系

| 等级 | 含义 |
|------|------|
| 🏆 夯 | 非常好/强大 |
| 💎 顶级 | 很好 |
| ⭐ 人上人 | 不错 |
| 😐 NPC | 中规中矩 |
| 💩 拉 | 拉胯/差劲 |

## 技术栈

- Vue 3 + Vite + TypeScript
- Naive UI (深色主题)
- Supabase (PostgreSQL + Auth + Storage)
- 高德地图 JS API 2.0
- GitHub Pages 部署

## 开发

```bash
# 安装依赖
npm install

# 开发环境
npm run dev

# 构建生产
npm run build

# 预览构建
npm run preview
```

## 环境变量

复制 `.env.example` 为 `.env` 并填写：

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_AMAP_KEY=your-amap-key
VITE_AMAP_SECRET=your-amap-secret
```

## 项目状态

- ✅ Phase 1: 项目初始化完成
- ⏳ Phase 2: Tier List UI (进行中)
- ⏳ Phase 3-8: 待开发

详见 `.sisyphus/plans/food-hang2la-list.md`
