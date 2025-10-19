import React from 'react'
import DarkModeToggle from '@/components/UI/DarkModeToggle'
import { useTheme } from '@/contexts/ThemeContext'

const DarkModeDemo: React.FC = () => {
  const { theme, isDark } = useTheme()

  return (
    <div className="p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Dark Mode Toggle Demo
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Current theme: <span className="font-semibold capitalize">{theme}</span>
        </p>
        
        <div className="flex justify-center space-x-4">
          <DarkModeToggle size="sm" />
          <DarkModeToggle size="md" />
          <DarkModeToggle size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Light Mode Features
          </h3>
          <ul className="text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Sun icon with rotation animation</li>
            <li>• Warm gradient background</li>
            <li>• Yellow/orange glow effects</li>
            <li>• Bright, clean interface</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Dark Mode Features
          </h3>
          <ul className="text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Moon icon with rotation animation</li>
            <li>• Cool gradient background</li>
            <li>• Animated twinkling stars</li>
            <li>• Blue/purple glow effects</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Theme preference is saved in localStorage and syncs with system preference
        </p>
      </div>
    </div>
  )
}

export default DarkModeDemo

