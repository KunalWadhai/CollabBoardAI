import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface DrawingAction {
  id: string
  type: 'draw' | 'erase' | 'shape' | 'text' | 'image'
  data: any
  timestamp: number
  userId: string
}

export interface User {
  id: string
  username: string
  avatar?: string
  cursor: {
    x: number
    y: number
  }
  color: string
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

interface BoardState {
  // Current board
  currentBoard: Board | null
  boardId: string | null
  
  // Drawing state
  isDrawing: boolean
  currentTool: 'pen' | 'eraser' | 'select' | 'shape' | 'text'
  currentColor: string
  currentStrokeWidth: number
  drawingHistory: DrawingAction[]
  historyIndex: number
  
  // Collaboration
  users: User[]
  connectedUsers: Set<string>
  
  // Canvas state
  canvasSize: {
    width: number
    height: number
  }
  zoom: number
  pan: {
    x: number
    y: number
  }
  
  // Loading states
  isLoading: boolean
  isSaving: boolean
  
  // Actions
  setCurrentBoard: (board: Board | null) => void
  setBoardId: (id: string | null) => void
  setDrawingState: (isDrawing: boolean) => void
  setCurrentTool: (tool: BoardState['currentTool']) => void
  setCurrentColor: (color: string) => void
  setCurrentStrokeWidth: (width: number) => void
  
  // Drawing actions
  addDrawingAction: (action: Omit<DrawingAction, 'id' | 'timestamp' | 'userId'>) => void
  undo: () => void
  redo: () => void
  clearCanvas: () => void
  
  // Collaboration
  addUser: (user: User) => void
  removeUser: (userId: string) => void
  updateUserCursor: (userId: string, cursor: { x: number; y: number }) => void
  setConnectedUsers: (users: Set<string>) => void
  
  // Canvas
  setCanvasSize: (size: { width: number; height: number }) => void
  setZoom: (zoom: number) => void
  setPan: (pan: { x: number; y: number }) => void
  
  // Loading
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
}

export const useBoardStore = create<BoardState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentBoard: null,
    boardId: null,
    isDrawing: false,
    currentTool: 'pen',
    currentColor: '#000000',
    currentStrokeWidth: 2,
    drawingHistory: [],
    historyIndex: -1,
    users: [],
    connectedUsers: new Set(),
    canvasSize: { width: 1200, height: 800 },
    zoom: 1,
    pan: { x: 0, y: 0 },
    isLoading: false,
    isSaving: false,

    // Actions
    setCurrentBoard: (board) => set({ currentBoard: board }),
    setBoardId: (id) => set({ boardId: id }),
    setDrawingState: (isDrawing) => set({ isDrawing }),
    setCurrentTool: (tool) => set({ currentTool: tool }),
    setCurrentColor: (color) => set({ currentColor: color }),
    setCurrentStrokeWidth: (width) => set({ currentStrokeWidth: width }),

    addDrawingAction: (actionData) => {
      const { drawingHistory, historyIndex } = get()
      const newAction: DrawingAction = {
        ...actionData,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        userId: 'current-user', // This should come from auth store
      }

      // Remove any actions after current history index (for redo functionality)
      const newHistory = drawingHistory.slice(0, historyIndex + 1)
      newHistory.push(newAction)

      set({
        drawingHistory: newHistory,
        historyIndex: newHistory.length - 1,
      })
    },

    undo: () => {
      const { historyIndex } = get()
      if (historyIndex > 0) {
        set({ historyIndex: historyIndex - 1 })
      }
    },

    redo: () => {
      const { drawingHistory, historyIndex } = get()
      if (historyIndex < drawingHistory.length - 1) {
        set({ historyIndex: historyIndex + 1 })
      }
    },

    clearCanvas: () => {
      set({
        drawingHistory: [],
        historyIndex: -1,
      })
    },

    addUser: (user) => {
      const { users } = get()
      const existingUserIndex = users.findIndex(u => u.id === user.id)
      
      if (existingUserIndex >= 0) {
        const newUsers = [...users]
        newUsers[existingUserIndex] = user
        set({ users: newUsers })
      } else {
        set({ users: [...users, user] })
      }
    },

    removeUser: (userId) => {
      const { users } = get()
      set({ users: users.filter(u => u.id !== userId) })
    },

    updateUserCursor: (userId, cursor) => {
      const { users } = get()
      const newUsers = users.map(user =>
        user.id === userId ? { ...user, cursor } : user
      )
      set({ users: newUsers })
    },

    setConnectedUsers: (users) => set({ connectedUsers: users }),

    setCanvasSize: (size) => set({ canvasSize: size }),
    setZoom: (zoom) => set({ zoom }),
    setPan: (pan) => set({ pan }),

    setLoading: (loading) => set({ isLoading: loading }),
    setSaving: (saving) => set({ isSaving: saving }),
  }))
)

// Subscribe to changes for real-time sync
useBoardStore.subscribe(
  (state) => state.drawingHistory,
  (drawingHistory, previousDrawingHistory) => {
    // Emit drawing changes to socket
    if (drawingHistory.length !== previousDrawingHistory.length) {
      const lastAction = drawingHistory[drawingHistory.length - 1]
      if (lastAction) {
        // This would be handled by socket service
        console.log('New drawing action:', lastAction)
      }
    }
  }
)

