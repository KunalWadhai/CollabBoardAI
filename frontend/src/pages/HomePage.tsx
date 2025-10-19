import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Palette, 
  Users, 
  Zap, 
  Brain,
  ArrowRight,
  Play
} from 'lucide-react'
import DarkModeToggle from '@/components/UI/DarkModeToggle'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Draw together with multiple users in real-time with live cursor tracking and instant synchronization.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Assistance',
      description: 'Get smart suggestions, shape recognition, and auto-completion powered by advanced AI.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for performance with smooth 60fps drawing experience and instant updates.'
    },
    {
      icon: Palette,
      title: 'Rich Drawing Tools',
      description: 'Comprehensive set of drawing tools including shapes, text, images, and custom brushes.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              CollabBoard AI
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <DarkModeToggle size="md" />
            <Link
              to="/login"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Collaborate & Create with{' '}
            <span className="text-blue-600">AI-Powered</span>{' '}
            Whiteboards
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience the future of collaborative design with real-time drawing, 
            AI assistance, and seamless team collaboration in one powerful platform.
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Start Creating
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="inline-flex items-center px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-lg font-medium">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Demo Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              See It In Action
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Experience the power of collaborative AI-driven whiteboarding
            </p>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Interactive demo coming soon...
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 CollabBoard AI. Built with React & Node.js</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

