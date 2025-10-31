"use client"
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { api } from '@/lib/api'
import { Button } from '@/components/Button'


export default function GuestRegisterPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const [name, setName] = useState('')
  const [selfie, setSelfie] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    let referencePhotoUrl
    if (selfie) {
      // Resize/compress selfie before base64 encoding
      referencePhotoUrl = await resizeAndConvertToBase64(selfie, 400, 400, 0.7);
    }
// Helper to resize and convert image file to base64
async function resizeAndConvertToBase64(file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
    const guest = await api.registerGuest(eventId, { name, reference_photo_url: referencePhotoUrl })
    // guestId may be guest.id or guest.guest_id depending on backend
    const guestId = guest.id || guest.guest_id
    if (guestId) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('guest_id', guestId.toString())
      }
      router.push(`/guest/${eventId}/album?guestId=${guestId}`)
    } else {
      // fallback: go to album without guestId
      router.push(`/guest/${eventId}/album`)
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-xs mx-auto">
  <div className="text-xl font-bold text-gray-900 mb-6 text-center">Register</div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Full name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <label className="block">
            <span className="block text-sm text-gray-700 mb-1">Selfie (optional)</span>
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={e => setSelfie(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              className="w-full"
            />
            <span className="block text-xs text-gray-400 mt-1">You can take a photo or select from gallery</span>
          </label>
          <Button type="submit" loading={submitting} className="w-full h-12 text-base rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800">
            Register
          </Button>
        </form>
      </div>
    </div>
  )
}