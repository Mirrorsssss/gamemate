# GameMate - 游戏社交平台

游戏版小红书/抖音 + 找队友/陪玩服务

## 🌐 线上地址

**https://gamemate-zeta.vercel.app**

## ✨ 功能特性

### ✅ 已上线功能

| 模块 | 功能 | 说明 |
|------|------|------|
| **用户系统** | 注册/登录 | 邮箱密码认证 |
| **动态系统** | 发布/浏览/筛选 | 支持文字 + 图片 + 标签 |
| **互动功能** | 点赞/评论 | 完整评论系统 |
| **社交功能** | 关注系统 | 关注/取消关注 |
| **个人主页** | 资料页 | 展示用户动态和游戏 |
| **群组聊天** | 多人聊天 | 5 秒轮询更新 |
| **陪玩服务** | 服务发布/浏览 | 按游戏筛选 |
| **找队友** | 匹配请求 | 发布组队需求 |
| **图片上传** | 配图功能 | 支持 JPEG/PNG/GIF |

### 🎮 支持游戏

- 王者荣耀
- 原神
- 英雄联盟
- 和平精英
- 崩坏星穹铁道

## 🏗️ 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL (Supabase)
- **ORM**: Prisma v5
- **认证**: NextAuth.js
- **部署**: Vercel (自动部署)

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Mirrorsssss/gamemate.git
cd gamemate
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env` 文件：

```bash
# 数据库连接（Supabase）
DATABASE_URL="postgresql://postgres:密码@db.项目 ID.supabase.co:5432/postgres"

# NextAuth 配置
NEXTAUTH_SECRET="你的密钥"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. 初始化数据库

```bash
# 推送表结构
npm run db:push

# 初始化示例数据（可选）
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📁 项目结构

```
gamemate/
├── prisma/
│   ├── schema.prisma      # 数据库模型
│   └── seed.ts            # 示例数据
├── src/
│   ├── app/
│   │   ├── api/           # API 路由
│   │   │   ├── auth/      # 认证相关
│   │   │   ├── posts/     # 动态相关
│   │   │   ├── users/     # 用户相关
│   │   │   ├── groups/    # 群组相关
│   │   │   ├── services/  # 陪玩服务
│   │   │   └── upload/    # 图片上传
│   │   ├── login/         # 登录页
│   │   ├── register/      # 注册页
│   │   ├── users/[id]/    # 个人主页
│   │   ├── groups/        # 群组聊天
│   │   └── services/      # 陪玩服务
│   ├── components/        # React 组件
│   ├── lib/               # 工具库
│   └── types/             # TypeScript 类型
└── .env                   # 环境变量
```

## 🔧 开发命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start

# 数据库操作
npm run db:push      # 推送表结构
npm run db:seed      # 初始化示例数据
npm run db:studio    # Prisma Studio
```

## 📝 API 接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/[...nextauth]` - 登录/登出

### 动态
- `GET /api/posts` - 获取动态列表
- `POST /api/posts` - 发布动态
- `POST /api/posts/[id]/like` - 点赞
- `GET/POST /api/posts/[id]/comments` - 评论

### 用户
- `GET /api/users/[id]` - 获取用户资料
- `GET /api/users/[id]/posts` - 用户动态
- `POST /api/users/[id]/follow` - 关注/取消关注

### 群组
- `GET/POST /api/groups` - 群组列表/创建
- `GET/POST /api/groups/[id]/messages` - 群消息

### 陪玩
- `GET/POST /api/services` - 服务列表/发布

### 工具
- `POST /api/upload` - 图片上传

## ⚠️ 注意事项

1. **数据库**: 需要有效的 Supabase 连接
2. **图片上传**: 当前使用 base64 存储，生产环境建议用云存储（阿里云 OSS/腾讯云 COS）
3. **实时聊天**: 使用轮询（5 秒），可升级为 WebSocket

## 📄 License

MIT

---

**开发团队**: GameMate  
**联系方式**: 通过 GitHub Issues
