import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

const authOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET
}

// 获取用户通知列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')
    const unreadOnly = request.nextUrl.searchParams.get('unreadOnly') === 'true'

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        ...(unreadOnly ? { read: false } : {})
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        read: false
      }
    })

    return NextResponse.json({
      notifications,
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// 标记通知为已读
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notificationId, readAll } = body

    if (readAll) {
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          read: false
        },
        data: { read: true }
      })

      return NextResponse.json({ success: true })
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID required' },
        { status: 400 }
      )
    }

    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id
      },
      data: { read: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}
