import React from 'react'
import { 
  Pen, 
  Eraser, 
  MousePointer, 
  Square, 
  Circle, 
  Type,
  Undo,
  Redo,
  Save,
  Download,
  Upload
} from 'lucide-react'
import { useBoardStore } from '@/stores/boardStore'
import { HexColorPicker } from 'react-colorful'
import { useState } from 'react'

const Toolbar: React.FC = () => {
  const {
    currentTool,
    currentColor,
    currentStrokeWidth,
    setCurrentTool,
    setCurrentColor,
    setCurrentStrokeWidth,
    undo,
    redo,
    drawingHistory,
    historyIndex,
  } = useBoardStore()

  const [showColorPicker, setShowColorPicker] = useState(false)

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'pen', icon: Pen, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'shape', icon: Square, label: 'Shapes' },
    { id: 'text', icon: Type, label: 'Text' },
  ]

  const handleToolChange = (toolId: string) => {
    setCurrentTool(toolId as any)
  }

  const handleStrokeWidthChange = (width: number) => {
    setCurrentStrokeWidth(width)
  }

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < drawingHistory.length - 1

  return (
    <div className="flex items-center justify-between px-4 py-2">
      {/* Tools */}
      <div className="flex items-center space-x-2">
        {tools.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => handleToolChange(id)}
            className={`toolbar-item ${currentTool === id ? 'active' : ''}`}
            title={label}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>

      {/* Separator */}
      <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

      {/* Color and Stroke */}
      <div className="flex items-center space-x-4">
        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Choose color"
          >
            <div 
              className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {currentColor}
            </span>
          </button>
          
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <HexColorPicker color={currentColor} onChange={setCurrentColor} />
            </div>
          )}
        </div>

        {/* Stroke Width */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={currentStrokeWidth}
            onChange={(e) => handleStrokeWidthChange(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 w-6">
            {currentStrokeWidth}
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="toolbar-item disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo size={20} />
        </button>
        
        <button
          onClick={redo}
          disabled={!canRedo}
          className="toolbar-item disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo size={20} />
        </button>

        <button
          className="toolbar-item"
          title="Save"
        >
          <Save size={20} />
        </button>

        <button
          className="toolbar-item"
          title="Export"
        >
          <Download size={20} />
        </button>

        <button
          className="toolbar-item"
          title="Import"
        >
          <Upload size={20} />
        </button>
      </div>
    </div>
  )
}

export default Toolbar

