'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Group {
  id: string
  name: string
  description?: string | null
  owner: {
    id: string
    name?: string | null
  }
  _count: {
    members: number
    messages: number
  }
  role: string
  joinedAt: string
}

interface Message {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name?: string | null
    avatar?: string | null
  }
}

export default function GroupsPage() {
  const { data: session } = useSession()
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (session) {
      fetchGroups()
    } else {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    if (selectedGroup) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 5000) // 每 5 秒轮询
      return () => clearInterval(interval)
    }
  }, [selectedGroup])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/groups')
      const data = await res.json()
      setGroups(data.groups || [])
    } catch (error) {
      console.error('Failed to fetch groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    if (!selectedGroup) return
    try {
      const res = await fetch(`/api/groups/${selectedGroup}/messages`)
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !selectedGroup) return

    try {
      const res = await fetch(`/api/groups/${selectedGroup}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageInput })
      })

      if (res.ok) {
        setMessageInput('')
        fetchMessages()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">请先登录</h2>
          <Link href="/login" className="text-purple-600 hover:underline">
            登录
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            群组聊天
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition text-sm"
            >
              创建群组
            </button>
            <Link href="/" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              返回首页
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* 群组列表 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">我的群组</h2>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              {loading ? (
                <div className="p-4 text-center text-gray-500">加载中...</div>
              ) : groups.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  暂无群组
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="block w-full mt-2 text-purple-600 hover:underline"
                  >
                    创建第一个群组
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                        selectedGroup === group.id ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">{group.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {group._count.members} 人 · {group._count.messages} 条消息
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 聊天区域 */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            {selectedGroup ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900">
                    {groups.find(g => g.id === selectedGroup)?.name}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.user.id === session.user?.id ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
                        {msg.user.avatar ? (
                          <img src={msg.user.avatar} alt="" className="w-full h-full rounded-full" />
                        ) : (
                          msg.user.name?.charAt(0) || 'U'
                        )}
                      </div>
                      <div className={`max-w-[70%] ${
                        msg.user.id === session.user?.id ? 'text-right' : ''
                      }`}>
                        <div className={`inline-block px-3 py-2 rounded-lg ${
                          msg.user.id === session.user?.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <div className="text-sm">{msg.content}</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {msg.user.name} · {new Date(msg.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="输入消息..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition"
                    >
                      发送
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                选择一个群组开始聊天
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(group) => {
            setShowCreateModal(false)
            fetchGroups()
            setSelectedGroup(group.id)
          }}
        />
      )}
    </div>
  )
}

function CreateGroupModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (group: any) => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      })

      if (res.ok) {
        const group = await res.json()
        onSuccess(group)
      } else {
        alert('创建失败，请稍后重试')
      }
    } catch (error) {
      console.error('Failed to create group:', error)
      alert('创建失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">创建群组</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">群组名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="例如：王者荣耀开黑群"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">群组描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="可选"
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
              {submitting ? '创建中...' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
