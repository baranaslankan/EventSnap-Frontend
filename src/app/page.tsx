"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('eventsnap_token') : null
    if (token) {
      router.replace('/photographer/dashboard')
    } else {
      router.replace('/photographer/login')
    }
  }, [router])

  return null
}