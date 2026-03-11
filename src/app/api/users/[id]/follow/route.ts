import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { createNotification } from '@/lib/notifications'

const authOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET
}

// 获取用户的关注列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const type = request.nextUrl.searchParams.get('type') || 'followers'

    if (type === 'followers') {
      // 获取粉丝列表
      const follows = await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              avatar: true,
              bio: true,
              _count: {
                select: {
                  followedBy: true,
                  following: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({
        list: follows.map(f => f.follower),
        total: follows.length
      })
    } else {
      // 获取关注列表
      const follows = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              name: true,
              avatar: true,
              bio: true,
              _count: {
                select: {
                  followedBy: true,
                  following: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({
        list: follows.map(f => f.following),
        total: follows.length
      })
    }
  } catch (error) {
    console.error('Error fetching follows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch follows' },
      { status: 500 }
    )
  }
}

// 切换关注状态
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions as any)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const targetUserId = params.id
    const currentUserId = session.user.id

    if (targetUserId === currentUserId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // 检查是否已关注
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId
        }
      }
    })

    if (existingFollow) {
      // 取消关注
      await prisma.follow.delete({
        where: { id: existingFollow.id }
      })

      return NextResponse.json({ following: false })
    } else {
      // 添加关注
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: targetUserId
        }
      })

      // 创建通知
      await createNotification(
        targetUserId,
        'follow',
        '有人关注了你',
        null,
        `/users/${currentUserId}`
      )

      return NextResponse.json({ following: true })
    }
  } catch (error) {
    console.error('Error toggling follow:', error)
    return NextResponse.json(
      { error: 'Failed to toggle follow' },
      { status: 500 }
    )
  }
}
