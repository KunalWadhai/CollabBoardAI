import React from 'react'
import { Sun, Moon, Star } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface DarkModeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { theme, toggleTheme, isDark } = useTheme()

  const sizeClasses = {
    sm: 'w-12 h-6',
    md: 'w-16 h-8',
    lg: 'w-20 h-10'
  }

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  }

  const iconSize = iconSizes[size]

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        ${sizeClasses[size]}
        rounded-full transition-all duration-500 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
        ${isDark 
          ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 shadow-lg shadow-blue-500/25' 
          : 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 shadow-lg shadow-yellow-500/25'
        }
        hover:scale-105 active:scale-95
        group
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background stars for dark mode */}
      {isDark && (
        <>
          <Star 
            className="absolute top-1 left-2 text-yellow-300 opacity-70 animate-pulse" 
            size={8} 
          />
          <Star 
            className="absolute top-2 right-3 text-blue-300 opacity-50 animate-pulse" 
            size={6}
            style={{ animationDelay: '0.5s' }}
          />
          <Star 
            className="absolute bottom-1 left-3 text-white opacity-40 animate-pulse" 
            size={4}
            style={{ animationDelay: '1s' }}
          />
        </>
      )}

      {/* Toggle circle */}
      <div
        className={`
          absolute top-0.5 left-0.5 w-7 h-7 rounded-full
          transition-all duration-500 ease-in-out
          flex items-center justify-center
          ${isDark 
            ? 'translate-x-8 bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg' 
            : 'translate-x-0 bg-gradient-to-br from-white to-yellow-50 shadow-lg'
          }
          group-hover:shadow-xl
        `}
      >
        {/* Light mode icon */}
        {!isDark && (
          <Sun 
            className="text-yellow-600 transition-all duration-300 group-hover:rotate-180" 
            size={iconSize} 
          />
        )}

        {/* Dark mode icon */}
        {isDark && (
          <Moon 
            className="text-blue-300 transition-all duration-300 group-hover:rotate-12" 
            size={iconSize} 
          />
        )}
      </div>

      {/* Glow effect */}
      <div
        className={`
          absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          ${isDark 
            ? 'bg-gradient-to-r from-blue-400/20 to-purple-400/20' 
            : 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20'
          }
        `}
      />

      {/* Ripple effect on click */}
      <div
        className={`
          absolute inset-0 rounded-full
          ${isDark ? 'bg-blue-400' : 'bg-yellow-400'}
          opacity-0 scale-0 group-active:opacity-20 group-active:scale-110
          transition-all duration-200
        `}
      />
    </button>
  )
}

export default DarkModeToggle

