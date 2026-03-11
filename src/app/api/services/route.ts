import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

const authOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET
}

// 获取匹配列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const gameId = request.nextUrl.searchParams.get('gameId')
    const role = request.nextUrl.searchParams.get('role')

    const where: any = {
      available: true,
      userId: {
        not: session.user.id
      }
    }

    if (gameId) {
      where.gameId = gameId
    }

    const services = await prisma.companionService.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true
          }
        },
        game: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// 发布陪玩服务
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
    const { gameId, title, description, pricePerHour } = body

    if (!title || !pricePerHour) {
      return NextResponse.json(
        { error: 'Title and price are required' },
        { status: 400 }
      )
    }

    const service = await prisma.companionService.create({
      data: {
        userId: session.user.id,
        gameId: gameId || null,
        title,
        description: description || null,
        pricePerHour: parseFloat(pricePerHour)
      },
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
        }
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
