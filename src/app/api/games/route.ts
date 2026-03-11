import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取游戏列表
export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: {
        _count: {
          select: {
            users: true,
            posts: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ games })
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}

// 创建游戏（管理员功能）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, coverImage, tags = [] } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Game name is required' },
        { status: 400 }
      )
    }

    const game = await prisma.game.create({
      data: {
        name,
        description: description || null,
        coverImage: coverImage || null,
        tags
      }
    })

    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    )
  }
}
