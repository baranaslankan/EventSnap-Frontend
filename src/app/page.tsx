import Link from 'next/link';
import { Button } from '@/components/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to EventSnap
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Professional event photography made simple. Upload, tag, and share photos with your guests instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/photographer/login">
            <Button className="w-full sm:w-auto px-8 py-3 text-lg">
              Photographer Login
            </Button>
          </Link>
          <Link href="/photographer/dashboard">
            <Button variant="secondary" className="w-full sm:w-auto px-8 py-3 text-lg">
              View Dashboard
            </Button>
          </Link>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-3">📸</div>
            <h3 className="font-semibold text-lg mb-2">Easy Upload</h3>
            <p className="text-gray-600 text-sm">
              Drag and drop multiple photos with real-time progress tracking
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-3">🏷️</div>
            <h3 className="font-semibold text-lg mb-2">Smart Tagging</h3>
            <p className="text-gray-600 text-sm">
              Tag guests in photos so they can easily find and download their images
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-lg mb-2">QR Access</h3>
            <p className="text-gray-600 text-sm">
              Generate QR codes for instant guest registration and photo access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}