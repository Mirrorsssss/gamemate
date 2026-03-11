import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取用户的帖子列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10')
    const cursor = request.nextUrl.searchParams.get('cursor')

    const posts = await prisma.post.findMany({
      where: { userId },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        game: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching user posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
