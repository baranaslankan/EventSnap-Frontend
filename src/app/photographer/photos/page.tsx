
"use client"

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/Button'
import { Spinner } from '@/components/Spinner'
import { useAuth } from '@/hooks/useAuth'
import { Event, Photo } from '@/types'


export default function AllPhotosPage() {
  useAuth(true)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [photoUrls, setPhotoUrls] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAllPhotos() {
      setLoading(true)
      const events: Event[] = await api.getEvents()
      let allPhotos: Photo[] = []
      for (const event of events) {
        const eventPhotos = await api.getEventPhotos(event.id)
        allPhotos = allPhotos.concat(eventPhotos || [])
      }
      setPhotos(allPhotos)
      // fetch presigned urls for all photos
      const urlMap: { [key: string]: string } = {}
      await Promise.all(
        allPhotos.map(async (photo) => {
          const key = photo.file_url && photo.file_url.includes('amazonaws.com/')
            ? photo.file_url.split('amazonaws.com/')[1]
            : photo.file_url || ''
          urlMap[photo.id] = key ? await api.getPhotoUrl(key) : ''
        })
      )
      setPhotoUrls(urlMap)
      setLoading(false)
    }
    fetchAllPhotos()
  }, [])


  async function handleDelete(photoId: string) {
    await api.deletePhoto(photoId)
    setPhotos(photos => photos.filter(p => p.id !== photoId))
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-xs mx-auto">
        <div className="text-xl font-bold text-gray-900 mb-6 text-center">All Photos</div>
        <div className="bg-white rounded-xl p-4 mb-8">
          {photos.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No photos yet</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {photos.map(photo => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photoUrls[photo.id] || ''}
                    alt="photo"
                    className="rounded-lg w-full aspect-square object-cover"
                  />
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2 py-1 text-xs opacity-80 hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
  <Button onClick={() => window.history.back()} className="w-full h-12 text-base rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800">Back</Button>
      </div>
    </div>
  )
}
