import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const authOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET
}

// 使用兼容 S3 的存储（腾讯云 COS 兼容 S3 API）
const s3Client = new S3Client({
  region: process.env.STORAGE_REGION || 'ap-guangzhou',
  endpoint: process.env.STORAGE_ENDPOINT, // 腾讯云 COS 端点
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY!,
    secretAccessKey: process.env.STORAGE_SECRET_KEY!,
  },
})

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
        { error: 'Invalid file type' },
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

    // 生成文件名
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.type.split('/')[1]
    const Key = `gamemate/images/${timestamp}_${randomStr}.${ext}`

    // 上传到对象存储
    const buffer = await file.arrayBuffer()
    
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
      ACL: 'public-read'
    }))

    // 生成访问 URL
    const imageUrl = `${process.env.STORAGE_CDN_URL || process.env.STORAGE_ENDPOINT}/${Key}`

    return NextResponse.json({
      url: imageUrl,
      size: file.size,
      type: file.type,
      key: Key
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
