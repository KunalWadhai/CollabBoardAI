import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  overlay?: boolean
  message?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  overlay = false,
  message = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} border-3 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin`}
        />
        {/* Inner spinning ring for better visibility */}
        <div 
          className={`absolute inset-0 ${sizeClasses[size]} border-2 border-transparent border-r-blue-300 rounded-full animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div className={`fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          {spinnerElement}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      {spinnerElement}
    </div>
  )
}

export default LoadingSpinner

