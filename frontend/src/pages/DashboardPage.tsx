import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  Star,
  Share2,
  MoreVertical,
  Calendar,
  Users
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - in real app this would come from API
  const boards = [
    {
      id: '1',
      name: 'Project Brainstorm',
      description: 'Initial ideas for the new product launch',
      thumbnail: '',
      isPublic: false,
      collaborators: 3,
      lastModified: '2024-01-15T10:30:00Z',
      isStarred: true,
    },
    {
      id: '2',
      name: 'Design System',
      description: 'UI components and design guidelines',
      thumbnail: '',
      isPublic: true,
      collaborators: 5,
      lastModified: '2024-01-14T16:45:00Z',
      isStarred: false,
    },
    {
      id: '3',
      name: 'Team Meeting Notes',
      description: 'Weekly team sync and action items',
      thumbnail: '',
      isPublic: false,
      collaborators: 8,
      lastModified: '2024-01-13T14:20:00Z',
      isStarred: true,
    },
  ]

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return `Updated ${Math.floor(diffInHours)}h ago`
    } else {
      return `Updated ${Math.floor(diffInHours / 24)}d ago`
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Continue collaborating on your whiteboards
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white w-64"
            />
          </div>

          {/* Filter */}
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Create New Board */}
          <Link
            to="/board/new"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Board</span>
          </Link>
        </div>
      </div>

      {/* Boards Grid/List */}
      {filteredBoards.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery ? 'No boards found' : 'No boards yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first collaborative whiteboard'}
          </p>
          {!searchQuery && (
            <Link
              to="/board/new"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Board</span>
            </Link>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredBoards.map((board) => (
            <div
              key={board.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${viewMode === 'list' ? 'flex items-center p-4' : 'p-6'}`}
            >
              <Link to={`/board/${board.id}`} className="block">
                <div className={viewMode === 'list' ? 'flex items-center space-x-4 w-full' : ''}>
                  {/* Thumbnail */}
                  <div className={`${viewMode === 'list' ? 'w-16 h-12' : 'w-full h-32'} bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center`}>
                    <Grid className="w-8 h-8 text-gray-400" />
                  </div>

                  {/* Content */}
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {board.name}
                      </h3>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {board.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{board.collaborators}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(board.lastModified)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {board.isStarred && (
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        )}
                        {board.isPublic && (
                          <Share2 className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardPage

