import React from 'react'
import { 
  Home, 
  Plus, 
  FolderOpen, 
  Star, 
  Settings, 
  LogOut,
  Users,
  MessageSquare
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const Sidebar: React.FC = () => {
  const { logout } = useAuthStore()

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Plus, label: 'New Board', href: '/board/new' },
    { icon: FolderOpen, label: 'My Boards', href: '/boards' },
    { icon: Star, label: 'Starred', href: '/starred' },
    { icon: Users, label: 'Collaborators', href: '/collaborators' },
    { icon: MessageSquare, label: 'Chat', href: '/chat' },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          CollabBoard AI
        </h2>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map(({ icon: Icon, label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Icon size={20} />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3 py-2 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full mt-2"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar

