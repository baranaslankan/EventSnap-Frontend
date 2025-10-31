"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Button } from '@/components/Button'
import { isAuthenticated } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/photographer/dashboard')
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.login(email, password)
      api.setToken(response.access_token)
      router.push('/photographer/dashboard')
    } catch {
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xs mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mb-4">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#2563eb"/><path d="M7 17l5-5 5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12V7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-xl font-bold text-gray-900">EventSnap</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full bg-red-500 px-4 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" loading={loading} className="w-full h-12 text-base rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800">
            Log In
          </Button>
        </form>
      </div>
    </div>
  )
}