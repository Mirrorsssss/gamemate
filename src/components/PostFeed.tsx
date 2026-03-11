'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface PostFeedProps {
  onPostCreated?: () => void
}

export default function PostFeed({ onPostCreated }: PostFeedProps) {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

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
    <>
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
                  <Link
                    href="/groups"
                    className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition text-sm"
                  >
                    群组
                  </Link>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition text-sm"
                  >
                    发布动态
                  </button>
                  {session.user?.name && (
                    <Link href={`/users/${session.user.id}`} className="text-sm text-gray-600 hover:underline">
                      {session.user.name}
                    </Link>
                  )}
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

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchPosts()
            onPostCreated?.()
          }}
        />
      )}
    </>
  )
}

function PostCard({ post }: { post: any }) {
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
          <Link href={`/users/${post.user.id}`} className="flex items-center gap-2 hover:underline">
            {post.user.avatar ? (
              <img src={post.user.avatar} alt={post.user.name || ''} className="w-6 h-6 rounded-full" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
            )}
            <span>{post.user.name || '匿名用户'}</span>
          </Link>
          <div className="flex items-center gap-3">
            <span>❤️ {post._count.likes}</span>
            <span>💬 {post._count.comments}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

function CreatePostModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [selectedGame, setSelectedGame] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(/[,,]/).map(t => t.trim()).filter(Boolean),
          gameId: selectedGame || undefined
        })
      })

      if (res.ok) {
        onSuccess()
      } else {
        alert('发布失败，请稍后重试')
      }
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('发布失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  const games = ['王者荣耀', '原神', '英雄联盟', '和平精英', '崩坏星穹铁道']

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">发布动态</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="可选"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="分享你的游戏故事..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">游戏</label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">选择游戏</option>
              {games.map((game) => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="用逗号分隔，如：组队，上分"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? '发布中...' : '发布'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
