'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Spinner } from '@/components/Spinner'
import { Button } from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'
import type { Guest } from '@/types'

export default function EventGuestsPage() {
  useAuth(true)
  const params = useParams()
  const router = useRouter()
  const eventId = (params?.id as string) || ''
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!eventId) return
    setLoading(true)
    api
      .getEventGuests(eventId)
      .then((g: any) => setGuests(Array.isArray(g) ? g : []))
      .catch(() => setGuests([]))
      .finally(() => setLoading(false))
  }, [eventId])

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Guests</h1>
          <div className="flex gap-2">
            <Button onClick={() => router.push(`/photographer/events/${eventId}`)} className="h-10">Back to event</Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : guests.length === 0 ? (
          <div className="text-gray-500">No guests found for this event.</div>
        ) : (
          <div className="bg-white rounded-xl p-4 shadow">
            <ul className="divide-y">
              {guests.map((g) => (
                <li key={g.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/** show reference photo if present, else initials */}
                    {g.referencePhotoUrl || (g as any).reference_photo_url ? (
                      <img
                        src={g.referencePhotoUrl || (g as any).reference_photo_url}
                        alt={g.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-sm font-bold text-blue-700">
                        {g.name?.[0] || ''}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{g.name}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
