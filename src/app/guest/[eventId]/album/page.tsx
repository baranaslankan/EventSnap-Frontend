"use client"
import { useEffect, useState } from 'react'
import { useParams, useSearchParams, type ReadonlyURLSearchParams } from 'next/navigation'
import { extractS3Key } from '@/lib/utils'
import { Button } from '@/components/Button'
import { Spinner } from '@/components/Spinner'
import { ImageGrid } from '@/components/ImageGrid'
import { api } from '@/lib/api'



function getGuestIdFromUrlOrStorage(searchParams: ReadonlyURLSearchParams) {
  if (typeof window !== 'undefined') {
    const urlGuestId = searchParams.get('guestId')
    if (urlGuestId && urlGuestId.trim() !== '') {
      localStorage.setItem('guest_id', urlGuestId)
      return urlGuestId
    }
    const stored = localStorage.getItem('guest_id')
    if (stored && stored.trim() !== '') return stored
    return ''
  }
  return ''
}

export default function GuestAlbumPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalPhoto, setModalPhoto] = useState<any | null>(null)
  const [photoUrls, setPhotoUrls] = useState<{ [key: string]: string }>({})
  const searchParams = useSearchParams()
  const [guestId, setGuestId] = useState('')

  useEffect(() => {
    setGuestId(getGuestIdFromUrlOrStorage(searchParams))
  }, [searchParams])

  useEffect(() => {
    if (photos.length > 0) {
      console.log('Current guestId:', guestId)
      photos.forEach(photo => {
        console.log('Photo', photo.id, 'tagged_guests:', photo.tagged_guests)
      })
    }
  }, [photos, guestId])

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true)
      // Use central api client so requests go through the same-origin proxy
      // and avoid mixed-content when frontend is served over HTTPS.
      const allPhotos = (await api.getEventPhotos(eventId)) || []
      setPhotos(allPhotos)
      const tagged = allPhotos.filter((photo: any) =>
        Array.isArray(photo.tagged_guests) &&
        photo.tagged_guests.some((tg: any) => tg.guest_id?.toString() === guestId)
      )
      const urlMap: { [key: string]: string } = {}
      await Promise.all(
        tagged.map(async (photo: any) => {
          const fileUrl = photo.file_url || ''
          if (fileUrl && fileUrl.startsWith('http')) {
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
    }
    if (guestId) fetchPhotos()
  }, [eventId, guestId])


  const taggedPhotos = photos.filter(photo =>
    Array.isArray(photo.tagged_guests) &&
    photo.tagged_guests.some((tg: any) => tg.guest_id?.toString() === guestId)
  )

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  }

  if (!guestId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl p-6 shadow text-center">
          <div className="text-lg font-semibold mb-2">Guest not identified</div>
          <div className="text-gray-500 mb-4">Please access your album from your registration link or QR code.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-xs mx-auto">
        <div className="text-xl font-bold text-gray-900 mb-6 text-center">My Album</div>
        <div className="bg-white rounded-xl p-4 mb-8">
          {taggedPhotos.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No tagged photos yet</div>
          ) : (
            <ImageGrid
              photos={taggedPhotos}
              onPhotoClick={setModalPhoto}
              photoUrls={photoUrls}
            />
          )}
        </div>
        {modalPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-white rounded-xl p-4 flex flex-col items-center max-w-xs w-full">
              <img
                src={photoUrls[modalPhoto.id] || modalPhoto.file_url || modalPhoto.url || '/placeholder.jpg'}
                alt={modalPhoto.alt || 'photo'}
                className="w-full h-64 object-contain rounded mb-4 bg-gray-100"
                onError={e => {
                  const img = e.target as HTMLImageElement;
                  if (!img.src.endsWith('/placeholder.jpg')) {
                    img.src = '/placeholder.jpg';
                  }
                }}
              />
              <Button
                onClick={async () => {
                  const url = photoUrls[modalPhoto.id] || modalPhoto.file_url || modalPhoto.url || '/placeholder.jpg';
                  try {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const blobUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = 'photo.jpg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                  } catch (err) {
                    // Fallback: open in new tab so user can save manually
                    window.open(url, '_blank');
                  }
                }}
                className="w-full mb-2"
              >
                Download
              </Button>
              <Button onClick={() => setModalPhoto(null)} variant="secondary" className="w-full">Close</Button>
            </div>
          </div>
        )}
        <Button onClick={() => window.history.back()} className="w-full h-12 text-base rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800">Back</Button>
      </div>
    </div>
  )
}