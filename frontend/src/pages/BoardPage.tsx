import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBoardStore } from '@/stores/boardStore'
import { useSocket } from '@/hooks/useSocket'
import Canvas from '@/components/Canvas/Canvas'
import Toolbar from '@/components/Toolbar/Toolbar'
import Sidebar from '@/components/Sidebar/Sidebar'
import UserList from '@/components/UserList/UserList'
import LoadingSpinner from '@/components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const BoardPage: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  
  const { 
    currentBoard, 
    setCurrentBoard, 
    setBoardId,
    isLoading: boardLoading 
  } = useBoardStore()
  
  const { socket, isConnected, joinBoard } = useSocket()

  useEffect(() => {
    if (boardId) {
      setBoardId(boardId)
      loadBoard(boardId)
    }
  }, [boardId, setBoardId])

  useEffect(() => {
    if (isConnected && boardId) {
      joinBoard(boardId)
    }
  }, [isConnected, boardId, joinBoard])

  const loadBoard = async (id: string) => {
    try {
      setIsLoading(true)
      
      // In a real app, this would fetch from your API
      const mockBoard = {
        id,
        name: 'My Collaborative Board',
        description: 'A collaborative whiteboard for team brainstorming',
        isPublic: false,
        ownerId: 'current-user',
        collaborators: ['user1', 'user2'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      setCurrentBoard(mockBoard)
      setIsLoading(false)
      
    } catch (error) {
      console.error('Failed to load board:', error)
      toast.error('Failed to load board')
      navigate('/dashboard')
    }
  }

  if (isLoading || boardLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Board not found
          </h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentBoard.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentBoard.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <Sidebar />
          <div className="flex-1 p-4">
            <UserList />
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <Toolbar />
          </div>
          
          {/* Canvas */}
          <div className="flex-1 relative">
            <Canvas />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardPage

