import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

const authOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET
}

// 简单的图片上传（ base64 存储，生产环境建议用云存储）
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }

    // 验证文件大小（最大 5MB）
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Max 5MB' },
        { status: 400 }
      )
    }

    // 转换为 base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const imageUrl = `data:${file.type};base64,${base64}`

    return NextResponse.json({
      url: imageUrl,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
