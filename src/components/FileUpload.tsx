'use client';

import React, { useCallback, useState } from 'react';
import { ProgressBar } from './ProgressBar';
import { UploadProgress } from '@/types';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept = 'image/*',
  multiple = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await handleFiles(files);
      }
    },
    []
  );

  const handleFiles = async (files: File[]) => {
    console.log('FileUpload handleFiles files:', files);
    files.forEach((file, idx) => {
      console.log('FileUpload file:', idx, file, file instanceof File, file?.name, file?.size);
    });
    setUploading(true);
    const initialUploads: UploadProgress[] = files.map((file) => ({
      fileName: file.name,
      progress: 0,
      status: 'uploading',
    }));
    setUploads(initialUploads);

    // --- DIRECT UPLOAD LOGIC (MATCHES POSTMAN) ---
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('photo', file);
    });
    // eventId'yi props veya context ile alman gerekebilir, örnek olarak 2 yazıyorum:
    formData.append('eventId', '2');
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log('FormData:', pair[0], pair[1].name, pair[1].type, pair[1].size);
      } else {
        console.log('FormData:', pair[0], pair[1]);
      }
    }
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('eventsnap_token') : '';
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/photos/upload', {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      const data = await res.json();
      console.log('Upload response:', data);
      setUploads((prev) =>
        prev.map((upload) => ({ ...upload, progress: 100, status: 'success' }))
      );
      setTimeout(() => setUploads([]), 2000);
    } catch (error) {
      setUploads((prev) =>
        prev.map((upload) => ({ ...upload, status: 'error' }))
      );
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      await handleFiles(files);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={uploading}
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer flex flex-col items-center"
        >
          <svg
            className="w-12 h-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-gray-700 font-medium mb-1">
            {isDragging
              ? 'Drop files here'
              : 'Drag and drop files here, or click to select'}
          </p>
          <p className="text-gray-500 text-sm">
            {multiple ? 'Multiple files supported' : 'Single file only'}
          </p>
        </label>
      </div>

      {uploads.length > 0 && (
        <div className="mt-4 space-y-3">
          {uploads.map((upload, index) => (
            <ProgressBar
              key={index}
              fileName={upload.fileName}
              progress={upload.progress}
              status={upload.status}
            />
          ))}
        </div>
      )}
    </div>
  );
};