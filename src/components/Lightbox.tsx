'use client';

import React, { useEffect } from 'react';
import { Photo } from '@/types';
import { getPhotoUrl } from '@/lib/utils';

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photo,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose, onNext, onPrev]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300 z-10"
        onClick={onClose}
      >
        ×
      </button>

      {onPrev && (
        <button
          className="absolute left-4 text-white text-4xl font-bold hover:text-gray-300 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
        >
          ‹
        </button>
      )}

      {onNext && (
        <button
          className="absolute right-4 text-white text-4xl font-bold hover:text-gray-300 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          ›
        </button>
      )}

      <div
        className="max-w-7xl max-h-screen p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={getPhotoUrl(photo.url || '')}
          alt="Full size"
          className="max-w-full max-h-screen object-contain"
        />
        {photo.tags && photo.tags.length > 0 && (
          <div className="mt-4 text-white text-center">
            <p className="font-medium mb-2">Tagged guests:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {photo.tags.map((guest) => (
                <span
                  key={guest.id}
                  className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm"
                >
                  {guest.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};