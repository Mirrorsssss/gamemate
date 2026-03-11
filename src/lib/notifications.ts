import { prisma } from './prisma'

/**
 * 创建通知
 */
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  content?: string,
  link?: string
) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        content,
        link
      }
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

/**
 * 批量创建通知（用于@提及等场景）
 */
export async function createNotifications(
  notifications: Array<{
    userId: string
    type: string
    title: string
    content?: string
    link?: string
  }>
) {
  try {
    await prisma.notification.createMany({
      data: notifications
    })
  } catch (error) {
    console.error('Failed to create notifications:', error)
  }
}
