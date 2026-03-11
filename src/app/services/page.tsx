'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Service {
  id: string
  title: string
  description?: string | null
  pricePerHour: number
  available: boolean
  user: {
    id: string
    name?: string | null
    avatar?: string | null
    bio?: string | null
  }
  game?: {
    id: string
    name: string
  } | null
}

export default function ServicesPage() {
  const { data: session } = useSession()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedGame, setSelectedGame] = useState<string>('')

  const games = ['王者荣耀', '原神', '英雄联盟', '和平精英', '崩坏星穹铁道']

  useEffect(() => {
    fetchServices()
  }, [selectedGame])

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedGame) {
        params.set('gameId', selectedGame)
      }
      const res = await fetch(`/api/services?${params}`)
      const data = await res.json()
      setServices(data.services || [])
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            陪玩服务
          </h1>
          <div className="flex gap-3">
            {session && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition text-sm"
              >
                发布服务
              </button>
            )}
            <Link href="/" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              返回首页
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 筛选栏 */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedGame('')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              selectedGame === ''
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            全部
          </button>
          {games.map((game) => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                selectedGame === game
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {game}
            </button>
          ))}
        </div>

        {/* 服务列表 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <p className="text-gray-500 text-lg mb-4">暂无陪玩服务</p>
            {session && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-purple-600 hover:underline"
              >
                成为第一个陪玩师
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateServiceModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchServices()
          }}
        />
      )}
    </div>
  )
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          {service.game && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
              {service.game.name}
            </span>
          )}
          <h3 className="font-semibold text-gray-900 mt-2">{service.title}</h3>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-pink-600">¥{service.pricePerHour}</div>
          <div className="text-xs text-gray-500">/小时</div>
        </div>
      </div>

      {service.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
      )}

      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold">
          {service.user.avatar ? (
            <img src={service.user.avatar} alt="" className="w-full h-full rounded-full" />
          ) : (
            service.user.name?.charAt(0) || 'P'
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">{service.user.name || '陪玩师'}</div>
          {service.user.bio && (
            <div className="text-xs text-gray-500 line-clamp-1">{service.user.bio}</div>
          )}
        </div>
      </div>

      <button className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition text-sm font-medium">
        联系 TA
      </button>
    </div>
  )
}

function CreateServiceModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [selectedGame, setSelectedGame] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const games = ['王者荣耀', '原神', '英雄联盟', '和平精英', '崩坏星穹铁道']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          pricePerHour: price,
          gameId: selectedGame || undefined
        })
      })

      if (res.ok) {
        onSuccess()
      } else {
        alert('发布失败，请稍后重试')
      }
    } catch (error) {
      console.error('Failed to create service:', error)
      alert('发布失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">发布陪玩服务</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">服务标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="例如：王者荣耀技术陪玩，包赢"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">服务描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="介绍你的服务特色、段位等"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">擅长游戏</label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">选择游戏（可选）</option>
              {games.map((game) => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">价格（元/小时）</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="1"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="30"
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
