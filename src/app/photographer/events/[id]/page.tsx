
'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Button } from '@/components/Button'
import { Spinner } from '@/components/Spinner'
import { FileUpload } from '@/components/FileUpload'
import { useAuth } from '@/hooks/useAuth'
import type { Event, Photo, Guest } from '@/types'
import { ImageGrid } from '@/components/ImageGrid'
import { TagSelector } from '@/components/TagSelector'
import { QRGenerator } from '@/components/QRGenerator'
import { extractS3Key } from '@/lib/utils'


  export default function EventDetailPage() {
    useAuth(true)
    const params = useParams()
    const eventId = params.id as string
    const [event, setEvent] = useState<Event | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [photoUrls, setPhotoUrls] = useState<{ [key: string]: string }>({})
  const [guests, setGuests] = useState<Guest[]>([])
  const [tagPhoto, setTagPhoto] = useState<Photo | null>(null)
  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null)
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([])
  const [tagLoading, setTagLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
      api.getEvent(eventId).then(setEvent)
      api.getEventGuests(eventId).then(setGuests)
      api.getEventPhotos(eventId).then(async (photos) => {
        // Her foto için tags dizisini backend'den gelen tagged_guests ile doldur
        const normalizedPhotos = photos.map((photo: any) => ({
          ...photo,
          tags: Array.isArray(photo.tagged_guests)
            ? photo.tagged_guests.map((tg: any) => tg.guest)
            : [],
        }))
        setPhotos(normalizedPhotos)
        // fetch presigned urls for all photos
        const urlMap: { [key: string]: string } = {}
        await Promise.all(
          normalizedPhotos.map(async (photo: Photo) => {
            const fileUrl = photo.file_url || ''
            if (fileUrl && fileUrl.startsWith('http')) {
              // If DB stores a full S3 URL we must NOT use it directly when it's private;
              // instead extract the S3 key and request a presigned URL. If it's not an S3
              // host (for example a public CDN URL), use it directly.
              try {
                const u = new URL(fileUrl)
                const host = u.hostname
                const isS3 = host.includes('s3.amazonaws.com') || host.includes('.s3.') || host.endsWith('amazonaws.com')
                if (isS3) {
                  const key = extractS3Key(fileUrl)
                  urlMap[photo.id] = key ? await api.getPhotoUrl(key) : ''
                } else {
                  urlMap[photo.id] = encodeURI(fileUrl)
                }
              } catch (e) {
                // On parse failure, fallback to using the raw URL encoded
                urlMap[photo.id] = encodeURI(fileUrl)
              }
            } else {
              const key = extractS3Key(fileUrl)
              urlMap[photo.id] = key ? await api.getPhotoUrl(key) : ''
            }
          })
        )
        setPhotoUrls(urlMap)
        setLoading(false)
      })
    }, [eventId])


    async function handleUpload(files: File[]) {
      await api.uploadPhotos(files, eventId)
      const updated = await api.getEventPhotos(eventId)
      setPhotos(updated)
    }

    function handleTagClick(photo: Photo) {
      setTagPhoto(photo)
      setSelectedGuestIds([])
    }

    function handlePhotoClick(photo: Photo) {
      setViewPhoto(photo)
    }

    function handleToggleGuest(guestId: string) {
      if (!tagPhoto) return;
      // Prevent adding already-tagged guests
      if (tagPhoto.tags?.some(g => g.id === guestId)) return;
      setSelectedGuestIds(ids =>
        ids.includes(guestId) ? ids.filter(id => id !== guestId) : [...ids, guestId]
      )
    }

    async function handleSaveTags() {
      if (!tagPhoto) return
      setTagLoading(true)
      // Only tag guests who are not already tagged
      const alreadyTaggedIds = tagPhoto.tags?.map(g => g.id) || [];
      for (const guestId of selectedGuestIds) {
        if (!alreadyTaggedIds.includes(guestId)) {
          await api.tagPhoto(tagPhoto.id, guestId)
        }
      }
      // Refresh photos and normalize tags
      const updated = await api.getEventPhotos(eventId)
      const normalizedPhotos = updated.map((photo: any) => ({
        ...photo,
        tags: Array.isArray(photo.tagged_guests)
          ? photo.tagged_guests.map((tg: any) => tg.guest)
          : [],
      }))
      setPhotos(normalizedPhotos)
      setTagPhoto(null)
      setTagLoading(false)
    }

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )
    }

    if (!event) {
      return (
        <div className="min-h-screen flex items-center justify-center text-gray-500 text-base">Event not found</div>
      )
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-xs mx-auto">
          <div className="text-xl font-bold text-gray-900 mb-2 text-center">{event.title}</div>
          <div className="text-gray-600 text-sm mb-6 text-center">{event.date} • {event.location} • {event.type}</div>
          <div className="mb-6 space-y-4">
            <FileUpload onUpload={handleUpload} multiple accept="image/*" />
            <QRGenerator eventId={event.id} eventTitle={event.title} />
            <Button onClick={() => router.push(`/photographer/events/${event.id}/guests`)} variant="primary" className="w-full h-12 text-base rounded-xl mt-2">
              Guest List
            </Button>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="text-base font-semibold mb-3">Photos</div>
            {photos.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No photos yet</div>
            ) : (
              <ImageGrid
                photos={photos}
                onPhotoClick={handlePhotoClick}
                onTagClick={handleTagClick}
                photoUrls={photoUrls}
              />
            )}
          </div>
          <Button onClick={() => router.push('/photographer/dashboard')} className="w-full h-12 mt-8 text-base rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800">My Events</Button>
        </div>
        {viewPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-xl p-4 w-full max-w-xs flex flex-col items-center">
              <img
                src={photoUrls[viewPhoto.id] || viewPhoto.file_url || viewPhoto.url || ''}
                alt="Event photo"
                className="w-full h-64 object-cover rounded mb-4"
              />
              <div className="text-base font-semibold mb-2">Tagged Guests</div>
              {viewPhoto.tags && viewPhoto.tags.length > 0 ? (
                <div className="flex flex-col gap-2 mb-4 w-full items-center">
                  {viewPhoto.tags.map(tag => (
                    <div key={tag.id} className="flex items-center gap-2 w-full">
                      {tag.referencePhotoUrl ? (
                        <img src={tag.referencePhotoUrl} alt={tag.name} className="w-10 h-10 rounded-full object-cover border-2 border-blue-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-base font-bold text-blue-700 border-2 border-blue-200">
                          {tag.name[0]}
                        </div>
                      )}
                      <span className="text-gray-900 font-medium text-base">{tag.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 mb-4">No guests tagged</div>
              )}
              <Button onClick={() => setViewPhoto(null)} className="w-full">Close</Button>
            </div>
          </div>
        )}
        {tagPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-xl p-6 w-full max-w-xs">
              <div className="text-lg font-semibold mb-4">Tag guests in photo</div>
              <TagSelector
                guests={guests}
                selectedGuestIds={selectedGuestIds}
                onToggleGuest={handleToggleGuest}
                onSave={handleSaveTags}
                onCancel={() => setTagPhoto(null)}
                loading={tagLoading}
                alreadyTaggedIds={tagPhoto?.tags?.map(g => g.id) || []}
              />
            </div>
          </div>
        )}
      </div>
    )
  }