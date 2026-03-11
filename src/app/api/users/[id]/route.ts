import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取用户资料
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        createdAt: true,
        games: {
          include: {
            game: {
              select: {
                id: true,
                name: true,
                tags: true
              }
            }
          }
        },
        _count: {
          select: {
            posts: true,
            followedBy: true,
            following: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 不返回敏感信息
    const { email, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
