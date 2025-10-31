'use client';

import React from 'react';
import Image from 'next/image';
import { Photo } from '@/types';
import { getPhotoUrl } from '@/lib/utils';

interface ImageGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  onTagClick?: (photo: Photo) => void;
  onDeleteClick?: (photo: Photo) => void;
  photoUrls?: { [key: string]: string };
}


export const ImageGrid: React.FC<ImageGridProps> = ({
  photos,
  onPhotoClick,
  onTagClick,
  onDeleteClick,
  photoUrls = {},
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden cursor-pointer group flex flex-col justify-end"
        >
          <img
            src={photoUrls[photo.id] || getPhotoUrl(photo.url || '')}
            alt="Event photo"
            className="w-full h-full object-cover"
            onClick={() => onPhotoClick(photo)}
          />
          {onTagClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTagClick(photo);
              }}
              className="absolute top-2 right-2 bg-white/90 hover:bg-blue-600 hover:text-white text-blue-600 rounded-full shadow p-2 transition-colors z-20 flex items-center justify-center"
              title="Tag guests"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </button>
          )}
          {photo.tags && photo.tags.length > 0 && (
            <div className="w-full px-2 py-1 bg-white/90 flex items-center gap-2 rounded-b-xl border-t border-gray-100 min-h-[38px]">
              <div className="flex -space-x-2">
                {photo.tags.slice(0, 5).map((tag: any) => (
                  <div key={tag.id} className="relative group">
                    {tag.referencePhotoUrl ? (
                      <img src={tag.referencePhotoUrl} alt={tag.name} className="w-7 h-7 rounded-full border-2 border-white shadow object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center text-sm font-bold text-blue-700 border-2 border-white shadow">
                        {tag.name[0]}
                      </div>
                    )}
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-9 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">
                      {tag.name}
                    </span>
                  </div>
                ))}
                {photo.tags.length > 5 && (
                  <span className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold border-2 border-white shadow">+{photo.tags.length - 5}</span>
                )}
              </div>
              <div className="flex-1 flex flex-wrap gap-1 ml-2">
                {photo.tags.slice(0, 2).map((tag: any) => (
                  <span key={tag.id} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium max-w-[80px] truncate">{tag.name}</span>
                ))}
                {photo.tags.length > 2 && (
                  <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">+{photo.tags.length - 2} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};