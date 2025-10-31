import React from 'react';

interface ProgressBarProps {
  progress: number;
  fileName?: string;
  status?: 'uploading' | 'success' | 'error';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  fileName,
  status = 'uploading',
}) => {
  const statusColors = {
    uploading: 'bg-blue-600',
    success: 'bg-green-600',
    error: 'bg-red-600',
  };

  const statusIcons = {
    uploading: '⏳',
    success: '✓',
    error: '✗',
  };

  return (
    <div className="w-full">
      {fileName && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-700 truncate">{fileName}</span>
          <span className="text-sm text-gray-600 ml-2">
            {statusIcons[status]} {progress}%
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${statusColors[status]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};