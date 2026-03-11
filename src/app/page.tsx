'use client'

import { SessionProvider } from 'next-auth/react'
import PostFeed from '@/components/PostFeed'

export default function Home() {
  return (
    <SessionProvider>
      <PostFeed />
    </SessionProvider>
  )
}
