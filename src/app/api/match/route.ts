import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

const authOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET
}

// 创建匹配请求
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { gameId, title, description, requiredRole, minLevel } = body

    if (!gameId || !title) {
      return NextResponse.json(
        { error: 'Game and title are required' },
        { status: 400 }
      )
    }

    const matchRequest = await prisma.post.create({
      data: {
        userId: session.user.id,
        gameId,
        title,
        content: description || '',
        tags: ['找队友', requiredRole || '不限'].filter(Boolean)
      },
      include: {
        game: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(matchRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating match request:', error)
    return NextResponse.json(
      { error: 'Failed to create match request' },
      { status: 500 }
    )
  }
}
