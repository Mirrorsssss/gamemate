import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

const authOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET
}

// 获取帖子列表（带缓存优化）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50) // 最大 50 条
    const cursor = searchParams.get('cursor')
    const gameId = searchParams.get('gameId')
    const tag = searchParams.get('tag')

    const where: { gameId?: string; tags?: { has: string } } = {}
    
    if (gameId) {
      where.gameId = gameId
    }
    
    if (tag) {
      where.tags = { has: tag }
    }

    const posts = await prisma.post.findMany({
      where,
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

    // 返回分页游标
    const lastPost = posts[posts.length - 1]
    const nextCursor = lastPost ? lastPost.id : null

    return NextResponse.json({ 
      posts,
      nextCursor,
      hasMore: posts.length === limit
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// 创建新帖子
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, images = [], tags = [], gameId, title } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        content,
        images,
        tags,
        gameId: gameId || null,
        title: title || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        game: true
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
