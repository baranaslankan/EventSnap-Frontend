
"use client"
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { useAuth } from '@/hooks/useAuth'

export default function UploadPhotosPage() {
  useAuth(true)
  const [files, setFiles] = useState<File[] | null>(null)
  const [uploading, setUploading] = useState(false)
  const [eventId, setEventId] = useState('')
  const router = useRouter()

  async function handleUpload() {
    if (!files || files.length === 0 || !eventId) {
      alert('Please select at least one file and enter an event ID.');
      return;
    }
    const file = files[0];
    if (!(file instanceof File) || file.size === 0) {
      alert('No valid file selected.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('eventId', eventId);
    // Log FormData content
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log('FormData:', pair[0], pair[1].name, pair[1].type, pair[1].size);
      } else {
        console.log('FormData:', pair[0], pair[1]);
      }
    }
    console.log('Uploading file:', file);
    setUploading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/photos/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      console.log('Upload response:', data);
      setFiles(null);
      router.push('/photographer/dashboard');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. See console for details.');
    }
    setUploading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-xs mx-auto">
  <div className="text-xl font-bold text-gray-900 mb-6 text-center">Upload Photo</div>
        <input
          value={eventId}
          onChange={e => setEventId(e.target.value)}
          placeholder="Event ID"
          className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          multiple
          onChange={e => {
            const arr = e.target.files ? Array.from(e.target.files) : null;
            console.log('File input onChange:', arr);
            setFiles(arr);
          }}
          onClick={() => console.log('File input clicked')}
          className="w-full mb-4"
        />
        <Button
          onClick={handleUpload}
          loading={uploading}
          className="w-full h-12 text-base rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
        >
          Upload
        </Button>
      </div>
    </div>
  )
}
