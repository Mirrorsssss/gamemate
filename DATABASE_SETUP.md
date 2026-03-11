# GameMate 数据库配置指南

## ⚠️ 注册失败原因

网站无法注册是因为**数据库环境变量未配置**。

## 🔧 解决步骤

### 步骤 1：登录 Vercel

访问：https://vercel.com/jeremymirror7-3547s-projects/gamemate/settings/environment-variables

### 步骤 2：添加环境变量

点击 "Add New" 添加以下变量：

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://postgres:Openclaw123.@db.kwhywnfjxnktimfclzte.supabase.co:5432/postgres` |

### 步骤 3：重新部署

添加完成后，点击 "Redeploy" 或者等待自动部署。

### 步骤 4：推送数据库结构

部署完成后，在本地执行：

```bash
cd gamemate
npm run db:push
```

或者在 Vercel 的 Deployments 页面查看最新部署，点击 "View Build Logs" 确认数据库连接成功。

## 📝 测试注册

配置完成后：

1. 访问 https://gamemate-zeta.vercel.app
2. 点击 "登录" → "立即注册"
3. 填写邮箱和密码
4. 注册成功！

## 🔍 验证数据库连接

如果还是无法注册，检查：

1. **数据库 URL 格式** - 确保密码正确
2. **Supabase 防火墙** - 确保允许外部连接
3. **连接池** - 可能需要使用 pgbouncer

### Supabase 连接字符串格式

```
# 直连（推荐）
postgresql://postgres:[密码]@db.[项目 ID].supabase.co:5432/postgres

# 连接池
postgresql://postgres.[项目 ID]:[密码]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## 💡 快速测试

你可以用这个测试连接：

```bash
# 本地测试数据库连接
npx prisma db pull
```

如果成功，会显示数据库表结构。

---

**配置完成后告诉我，我可以帮你验证！**
