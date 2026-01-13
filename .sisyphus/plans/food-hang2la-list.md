# Food-Hang2La-List 完整实施计划

> 美食从夯到拉排行榜 Web 应用
> 创建时间: 2026-01-12 | 状态: 待实施

## 项目概述
使用"从夯到拉"评分体系的美食分享应用，小圈子朋友共同维护。

## 技术栈
- Vue 3 + Vite + TypeScript + Naive UI
- Supabase (PostgreSQL + Auth + Storage)
- 高德地图 JS API 2.0
- GitHub Pages 部署

## 评分体系
| 等级 | 颜色 | 含义 |
|------|------|------|
| 夯 | #FFD700 金色 | 非常好 |
| 顶级 | #B026FF 紫色 | 很好 |
| 人上人 | #1E90FF 蓝色 | 不错 |
| NPC | #A9A9A9 灰色 | 中规中矩 |
| 拉 | #FF4500 红色 | 拉胯 |

## UI设计
- 深色主题默认
- 左侧大色块标签 + 右侧横向滚动卡片
- 卡片悬停: scale(1.05) rotate(2deg)
- "夯"行流光特效
- 顶部筛选栏: 城市/类别/评级/价格/搜索/排序

## 分阶段实施 (10-15天)

### Phase 1: 项目初始化 (1-2天)
- [ ] 创建 GitHub 仓库
- [ ] 初始化 Vite + Vue 3 + TS
- [ ] 配置 Naive UI 深色主题
- [ ] 创建 Supabase 项目
- [ ] 执行数据库 Schema

### Phase 2: Tier List UI (2-3天)
- [ ] TierBoard/TierRow/TierLabel 组件
- [ ] RestaurantCard 卡片组件
- [ ] 悬停动效 + 流光特效
- [ ] 骨架屏加载

### Phase 3: 筛选与搜索 (2-3天)
- [ ] FilterBar 筛选栏
- [ ] 城市/类别/评级/价格筛选
- [ ] 搜索框 + 排序选择
- [ ] useFilter 组合式函数

### Phase 4: 认证系统 (1-2天)
- [ ] 登录/注册页面
- [ ] 邀请码验证逻辑
- [ ] 路由守卫

### Phase 5: 录入功能 (1-2天)
- [ ] RestaurantForm 表单
- [ ] ImageUploader 图片压缩上传
- [ ] AddressPicker 地址选择

### Phase 6: 地图集成 (1-2天)
- [ ] 高德地图容器
- [ ] 自定义标记点
- [ ] 额度保护逻辑

### Phase 7: 管理功能 (1天)
- [ ] 邀请码管理
- [ ] 内容删除

### Phase 8: 部署 (1天)
- [ ] 响应式适配
- [ ] GitHub Actions 配置
- [ ] 上线

## 安全架构
1. 邀请码验证 (7天过期, 限次使用)
2. Supabase Auth
3. RLS (速率限制: 10条/小时)
4. 前端防护 (蜜罐, 限流)

## GitHub Actions
- deploy.yml: 自动部署
- heartbeat.yml: 每3天心跳
- backup.yml: 每周备份

## 下一步
运行 /start-work 开始实施!
