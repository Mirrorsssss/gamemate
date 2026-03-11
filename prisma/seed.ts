import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始初始化示例数据...')

  // 创建示例用户
  const hashedPassword = await bcrypt.hash('123456', 12)
  
  const user1 = await prisma.user.upsert({
    where: { email: 'demo@gamemate.com' },
    update: {},
    create: {
      email: 'demo@gamemate.com',
      name: '游戏达人',
      password: hashedPassword,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      bio: '热爱游戏的玩家，欢迎一起开黑！'
    }
  })

  // 创建示例游戏
  const games = await Promise.all([
    prisma.game.upsert({
      where: { name: '王者荣耀' },
      update: {},
      create: {
        name: '王者荣耀',
        description: '5v5 团队竞技手游',
        tags: ['MOBA', '竞技', '团队']
      }
    }),
    prisma.game.upsert({
      where: { name: '原神' },
      update: {},
      create: {
        name: '原神',
        description: '开放世界冒险 RPG',
        tags: ['RPG', '开放世界', '冒险']
      }
    }),
    prisma.game.upsert({
      where: { name: '英雄联盟' },
      update: {},
      create: {
        name: '英雄联盟',
        description: '5v5 MOBA 端游',
        tags: ['MOBA', '竞技', '端游']
      }
    }),
    prisma.game.upsert({
      where: { name: '和平精英' },
      update: {},
      create: {
        name: '和平精英',
        description: '战术竞技手游',
        tags: ['射击', '生存', '竞技']
      }
    }),
    prisma.game.upsert({
      where: { name: '崩坏星穹铁道' },
      update: {},
      create: {
        name: '崩坏星穹铁道',
        description: '太空喜剧冒险 RPG',
        tags: ['RPG', '回合制', '冒险']
      }
    })
  ])

  console.log('✅ 游戏数据初始化完成')

  // 创建示例帖子
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        userId: user1.id,
        gameId: games[0].id,
        title: '王者荣耀上分车队来人！',
        content: '当前段位星耀，想找几个靠谱队友一起上分，最好是晚上 8 点后在线的，有意私聊！',
        tags: ['王者荣耀', '组队', '上分'],
        images: []
      }
    }),
    prisma.post.create({
      data: {
        userId: user1.id,
        gameId: games[1].id,
        title: '原神 5.0 版本大家抽了吗？',
        content: '新角色强度怎么样？值不值得抽？纠结中...',
        tags: ['原神', '抽卡', '讨论'],
        images: []
      }
    }),
    prisma.post.create({
      data: {
        userId: user1.id,
        gameId: games[2].id,
        title: '英雄联盟新赛季冲分',
        content: '新赛季开始了，大家一起冲分啊！我主玩中路，可以 Carry。',
        tags: ['英雄联盟', '新赛季', '冲分'],
        images: []
      }
    })
  ])

  console.log('✅ 示例帖子创建完成')

  // 创建示例评论
  await prisma.comment.create({
    data: {
      postId: posts[0].id,
      userId: user1.id,
      content: '我来晚了，还来得及吗？'
    }
  })

  console.log('✅ 示例评论创建完成')

  console.log('🎉 示例数据初始化完成！')
  console.log('\n测试账号:')
  console.log('邮箱：demo@gamemate.com')
  console.log('密码：123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
