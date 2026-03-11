'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Post {
  id: string
  title?: string
  content: string
  images: string[]
  tags: string[]
  createdAt: string
  user: {
    id: string
    name?: string | null
    avatar?: string | null
  }
  game?: {
    id: string
    name: string
  }
  _count: {
    comments: number
    likes: number
  }
}

export default function Home() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [selectedTag])

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({ limit: '20' })
      if (selectedTag) {
        params.set('tag', selectedTag)
      }
      
      const res = await fetch(`/api/posts?${params}`)
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const commonTags = ['王者荣耀', '原神', '英雄联盟', '和平精英', '崩坏星穹铁道']

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* 头部 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              GameMate
            </h1>
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">欢迎，{session.user?.name || '用户'}</span>
              </div>
            ) : (
              <a
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition"
              >
                登录
              </a>
            )}
          </div>

          {/* 标签栏 */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                selectedTag === null
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {commonTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                  selectedTag === tag
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 内容区 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">暂无动态，快来发布第一条吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      {post.images.length > 0 && (
        <div className="aspect-video bg-gray-100">
          <img
            src={post.images[0]}
            alt={post.title || 'Post image'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {post.game && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
              {post.game.name}
            </span>
          )}
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.title || post.content.slice(0, 50)}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{post.content}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            {post.user.avatar ? (
              <img src={post.user.avatar} alt={post.user.name || ''} className="w-6 h-6 rounded-full" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
            )}
            <span>{post.user.name || '匿名用户'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>❤️ {post._count.likes}</span>
            <span>💬 {post._count.comments}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
