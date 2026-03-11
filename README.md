# GameMate - 游戏社交平台

游戏版小红书/抖音 + 找队友/陪玩服务

## 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **认证**: NextAuth.js
- **部署**: Vercel

## 功能

### 已完成
- ✅ 用户注册/登录
- ✅ 动态发布（图文 + 标签）
- ✅ 信息流展示（瀑布流）
- ✅ 游戏标签筛选
- ✅ 点赞功能
- ✅ 评论系统

### 开发中
- 🚧 关注系统
- 🚧 个人主页
- 🚧 群组聊天
- 🚧 陪玩服务
- 🚧 找队友匹配

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并填写正确的配置：

```bash
cp .env.example .env
```

### 3. 推送数据库结构

```bash
npm run db:push
```

### 4. 初始化示例数据

```bash
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 测试账号

- 邮箱：demo@gamemate.com
- 密码：123456

## 部署

项目已配置 Vercel 部署，推送到 GitHub 后自动部署。

## 项目结构

```
gamemate/
├── prisma/
│   ├── schema.prisma      # 数据库模型
│   └── seed.ts            # 示例数据
├── src/
│   ├── app/
│   │   ├── api/           # API 路由
│   │   ├── login/         # 登录页面
│   │   ├── register/      # 注册页面
│   │   └── page.tsx       # 首页
│   ├── components/        # React 组件
│   ├── lib/               # 工具库
│   └── types/             # TypeScript 类型
└── .env                   # 环境变量
```

## License

MIT
