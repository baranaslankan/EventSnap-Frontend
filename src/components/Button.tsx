import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 focus:ring-blue-500',
  secondary: 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-500',
  danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 focus:ring-red-500',
};

export const Button = ({ children, className = '', variant = 'primary', loading = false, disabled, ...props }: ButtonProps) => {
  return (
    <button
      className={`px-5 py-2.5 rounded-xl font-medium shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border ${variantClasses[variant]} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2 text-inherit" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};