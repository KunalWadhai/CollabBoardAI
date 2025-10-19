import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores/authStore'
import { useBoardStore } from '@/stores/boardStore'
import toast from 'react-hot-toast'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { token, user } = useAuthStore()
  const { 
    addUser, 
    removeUser, 
    updateUserCursor, 
    setConnectedUsers,
    boardId 
  } = useBoardStore()

  useEffect(() => {
    if (!token || !user) return

    const newSocket = io(SOCKET_URL, {
      auth: {
        token,
        userId: user.id,
      },
      transports: ['websocket'],
    })

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Connected to server')
      setIsConnected(true)
      
      // Join board room if boardId exists
      if (boardId) {
        newSocket.emit('join-board', boardId)
      }
    })

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server')
      setIsConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      toast.error('Failed to connect to server')
    })

    // Board events
    newSocket.on('board-joined', (data) => {
      console.log('Joined board:', data)
      toast.success(`Joined board: ${data.boardName}`)
    })

    newSocket.on('user-joined', (userData) => {
      console.log('User joined:', userData)
      addUser(userData)
      toast.success(`${userData.username} joined the board`)
    })

    newSocket.on('user-left', (userId) => {
      console.log('User left:', userId)
      removeUser(userId)
      toast.info('A user left the board')
    })

    newSocket.on('user-cursor-update', (data) => {
      updateUserCursor(data.userId, data.cursor)
    })

    newSocket.on('drawing-action', (action) => {
      console.log('Received drawing action:', action)
      // Handle incoming drawing actions
      // This would update the board store with the action
    })

    newSocket.on('board-updated', (boardData) => {
      console.log('Board updated:', boardData)
      // Handle board updates
    })

    // Error handling
    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
      toast.error(error.message || 'An error occurred')
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [token, user, boardId])

  // Join board room
  const joinBoard = (boardId: string) => {
    if (socket && socket.connected) {
      socket.emit('join-board', boardId)
    }
  }

  // Leave board room
  const leaveBoard = (boardId: string) => {
    if (socket && socket.connected) {
      socket.emit('leave-board', boardId)
    }
  }

  // Send drawing action
  const sendDrawingAction = (action: any) => {
    if (socket && socket.connected && boardId) {
      socket.emit('drawing-action', {
        boardId,
        action,
      })
    }
  }

  // Send cursor update
  const sendCursorUpdate = (cursor: { x: number; y: number }) => {
    if (socket && socket.connected && boardId) {
      socket.emit('cursor-update', {
        boardId,
        cursor,
      })
    }
  }

  // Send chat message
  const sendChatMessage = (message: string) => {
    if (socket && socket.connected && boardId) {
      socket.emit('chat-message', {
        boardId,
        message,
      })
    }
  }

  return {
    socket,
    isConnected,
    joinBoard,
    leaveBoard,
    sendDrawingAction,
    sendCursorUpdate,
    sendChatMessage,
  }
}

