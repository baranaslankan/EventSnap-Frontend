import React from 'react';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export const Badge = ({ children, className = '' }: BadgeProps) => {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 ${className}`.trim()}
    >
      {children}
    </span>
  );
};
