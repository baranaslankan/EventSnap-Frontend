'use client';


import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Event } from '@/types'
import Link from 'next/link'

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    api.getEvents().then(setEvents).finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    api.removeToken()
    router.push('/photographer/login')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full z-30 bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto flex items-center justify-between h-14 px-4">
          <span className="text-lg font-bold tracking-tight">Dashboard</span>
          <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 active:bg-gray-300">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"/></svg>
          </button>
        </div>
      </div>
      <div className="max-w-md mx-auto pt-16 pb-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-semibold">Events</span>
          <div className="flex gap-2">
            <Link href="/photographer/photos" className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">All Photos</Link>
            <Link href="/photographer/events/create" className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white text-2xl shadow hover:bg-blue-700 active:bg-blue-800">+</Link>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-400 py-20 text-base">No events yet</div>
        ) : (
          <div className="flex flex-col gap-3">
            {events.map(event => (
              <div key={event.id} className="relative group bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 shadow-sm hover:shadow transition-all flex items-center justify-between">
                <Link href={`/photographer/events/${event.id}`} className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 mb-1 truncate">{event.title}</div>
                  <div className="text-xs text-gray-500 flex gap-2">
                    <span>{event.date && new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.location}</span>
                  </div>
                </Link>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    await api.deleteEvent(event.id);
                    setEvents(events => events.filter(ev => ev.id !== event.id));
                  }}
                  className="ml-3 px-2 py-1 rounded bg-red-600 text-white text-xs font-medium opacity-80 hover:opacity-100"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}