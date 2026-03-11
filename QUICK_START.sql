-- GameMate 快速初始化脚本（简化版）
-- 直接复制到 Supabase SQL 编辑器执行

-- 用户表
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT,
    "email" TEXT UNIQUE,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)
);

-- 会话表
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "sessionToken" TEXT UNIQUE,
    "userId" TEXT,
    "expires" TIMESTAMP(3)
);

-- 账户表
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" TEXT,
    "type" TEXT,
    "provider" TEXT,
    "providerAccountId" TEXT,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT
);

-- 动态表
CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" TEXT,
    "gameId" TEXT,
    "content" TEXT,
    "images" TEXT[] DEFAULT '{}',
    "tags" TEXT[] DEFAULT '{}',
    "title" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)
);

-- 评论表
CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "postId" TEXT,
    "userId" TEXT,
    "content" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)
);

-- 点赞表
CREATE TABLE IF NOT EXISTS "Like" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "postId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 创建唯一约束
CREATE UNIQUE INDEX IF NOT EXISTS "Like_postId_userId_key" ON "Like"("postId", "userId");

-- 游戏表
CREATE TABLE IF NOT EXISTS "Game" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT,
    "description" TEXT,
    "coverImage" TEXT,
    "tags" TEXT[] DEFAULT '{}',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)
);

-- 关注表
CREATE TABLE IF NOT EXISTS "Follow" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "followerId" TEXT,
    "followingId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 群组表
CREATE TABLE IF NOT EXISTS "Group" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT,
    "description" TEXT,
    "avatar" TEXT,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)
);

-- 群组成员表
CREATE TABLE IF NOT EXISTS "GroupMember" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "groupId" TEXT,
    "userId" TEXT,
    "role" TEXT DEFAULT 'member',
    "joinedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 群组消息表
CREATE TABLE IF NOT EXISTS "GroupMessage" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "groupId" TEXT,
    "userId" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 私聊消息表
CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "senderId" TEXT,
    "receiverId" TEXT,
    "content" TEXT,
    "read" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 陪玩服务表
CREATE TABLE IF NOT EXISTS "CompanionService" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" TEXT,
    "gameId" TEXT,
    "title" TEXT,
    "description" TEXT,
    "pricePerHour" DECIMAL(10,2),
    "available" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)
);

-- 陪玩订单表
CREATE TABLE IF NOT EXISTS "CompanionOrder" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "serviceId" TEXT,
    "clientId" TEXT,
    "companionId" TEXT,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "totalPrice" DECIMAL(10,2),
    "status" TEXT DEFAULT 'pending',
    "rating" INTEGER,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)
);

-- 通知表
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" TEXT,
    "type" TEXT,
    "title" TEXT,
    "content" TEXT,
    "read" BOOLEAN DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 验证令牌表
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT,
    "token" TEXT UNIQUE,
    "expires" TIMESTAMP(3)
);

-- 用户游戏关联表
CREATE TABLE IF NOT EXISTS "UserGame" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" TEXT,
    "gameId" TEXT,
    "level" INTEGER,
    "rank" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例游戏
INSERT INTO "Game" ("name", "description", "tags") VALUES 
('王者荣耀', '5v5 团队竞技手游', ARRAY['MOBA', '竞技', '团队']),
('原神', '开放世界冒险 RPG', ARRAY['RPG', '开放世界', '冒险']),
('英雄联盟', '5v5 MOBA 端游', ARRAY['MOBA', '竞技', '端游']),
('和平精英', '战术竞技手游', ARRAY['射击', '生存', '竞技']),
('崩坏星穹铁道', '太空喜剧冒险 RPG', ARRAY['RPG', '回合制', '冒险']);

-- 完成
SELECT '✅ 数据库初始化完成！现在可以注册了。' as status;
