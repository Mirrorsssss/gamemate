'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  name?: string | null
  avatar?: string | null
  bio?: string | null
  createdAt: string
  games: {
    game: {
      id: string
      name: string
      tags: string[]
    }
  }[]
  _count: {
    posts: number
    followedBy: number
    following: number
  }
}

interface Post {
  id: string
  title?: string
  content: string
  images: string[]
  tags: string[]
  createdAt: string
  game?: {
    id: string
    name: string
  }
  _count: {
    comments: number
    likes: number
  }
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.id as string
  
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts')

  useEffect(() => {
    fetchUser()
    fetchPosts()
  }, [userId])

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${userId}`)
      const data = await res.json()
      setUser(data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/posts`)
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST'
      })
      const data = await res.json()
      setFollowing(data.following)
      fetchUser()
    } catch (error) {
      console.error('Failed to follow:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-purple-600 hover:underline">
            ← 返回首页
          </Link>
        </div>
      </header>

      {/* 用户信息 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name || ''} className="w-full h-full rounded-full object-cover" />
              ) : (
                user.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name || '匿名用户'}</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    加入时间 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    following
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                  }`}
                >
                  {following ? '已关注' : '关注'}
                </button>
              </div>

              {user.bio && (
                <p className="text-gray-700 mt-4">{user.bio}</p>
              )}

              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user._count.posts}</div>
                  <div className="text-sm text-gray-500">动态</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user._count.followers || user._count.followedBy}</div>
                  <div className="text-sm text-gray-500">粉丝</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{user._count.following}</div>
                  <div className="text-sm text-gray-500">关注</div>
                </div>
              </div>

              {user.games.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-2">擅长游戏</div>
                  <div className="flex flex-wrap gap-2">
                    {user.games.slice(0, 5).map(({ game }) => (
                      <span
                        key={game.id}
                        className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                      >
                        {game.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'posts'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            动态 ({user._count.posts})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'about'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            关于
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'posts' ? (
          loading ? (
            <div className="text-center py-10 text-gray-500">加载中...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">暂无动态</div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">关于我</h3>
            <p className="text-gray-700">{user.bio || '这个人很懒，什么都没写~'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="bg-white rounded-xl shadow-sm p-4">
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
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>❤️ {post._count.likes}</span>
        <span>💬 {post._count.comments}</span>
        <span className="ml-auto">{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
      </div>
    </article>
  )
}
