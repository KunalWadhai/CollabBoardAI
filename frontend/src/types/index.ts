// Common types used throughout the application

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt?: string
}

export interface Board {
  id: string
  name: string
  description?: string
  thumbnail?: string
  isPublic: boolean
  ownerId: string
  collaborators: string[]
  createdAt: string
  updatedAt: string
}

export interface DrawingAction {
  id: string
  type: 'draw' | 'erase' | 'shape' | 'text' | 'image'
  data: any
  timestamp: number
  userId: string
}

export interface CursorPosition {
  x: number
  y: number
}

export interface DrawingTool {
  type: 'pen' | 'eraser' | 'select' | 'shape' | 'text'
  color: string
  strokeWidth: number
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  message: string
  timestamp: number
  boardId: string
}

export interface Notification {
  id: string
  type: 'user_joined' | 'user_left' | 'board_shared' | 'drawing_action'
  message: string
  timestamp: number
  read: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

