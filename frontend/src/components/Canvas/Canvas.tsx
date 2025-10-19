import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Stage, Layer, Line, Rect, Circle, Text, Image } from 'react-konva'
import { useBoardStore } from '@/stores/boardStore'
import { useSocket } from '@/hooks/useSocket'
import Konva from 'konva'

interface CanvasProps {
  width?: number
  height?: number
}

const Canvas: React.FC<CanvasProps> = ({ 
  width = 1200, 
  height = 800 
}) => {
  const stageRef = useRef<Konva.Stage>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lines, setLines] = useState<any[]>([])
  const [shapes, setShapes] = useState<any[]>([])
  const [texts, setTexts] = useState<any[]>([])
  
  const {
    currentTool,
    currentColor,
    currentStrokeWidth,
    drawingHistory,
    historyIndex,
    users,
    zoom,
    pan,
    canvasSize,
    setCanvasSize,
    setZoom,
    setPan,
    addDrawingAction,
  } = useBoardStore()

  const { socket } = useSocket()

  // Initialize canvas size
  useEffect(() => {
    setCanvasSize({ width, height })
  }, [width, height, setCanvasSize])

  // Handle drawing start
  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (currentTool === 'pen') {
      setIsDrawing(true)
      const pos = e.target.getStage()?.getPointerPosition()
      if (pos) {
        const newLine = {
          id: crypto.randomUUID(),
          tool: 'pen',
          points: [pos.x, pos.y],
          stroke: currentColor,
          strokeWidth: currentStrokeWidth,
          lineCap: 'round',
          lineJoin: 'round',
        }
        setLines(prev => [...prev, newLine])
      }
    } else if (currentTool === 'eraser') {
      setIsDrawing(true)
      const pos = e.target.getStage()?.getPointerPosition()
      if (pos) {
        // Eraser logic - remove objects at position
        const stage = e.target.getStage()
        if (stage) {
          const shapes = stage.find('.erasable')
          shapes.forEach(shape => {
            const box = shape.getClientRect()
            if (pos.x >= box.x && pos.x <= box.x + box.width &&
                pos.y >= box.y && pos.y <= box.y + box.height) {
              shape.destroy()
            }
          })
        }
      }
    }
  }, [currentTool, currentColor, currentStrokeWidth])

  // Handle drawing move
  const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || currentTool !== 'pen') return

    const stage = e.target.getStage()
    const point = stage?.getPointerPosition()
    if (point) {
      setLines(prev => {
        const lastLine = prev[prev.length - 1]
        const newPoints = [...lastLine.points, point.x, point.y]
        const newLine = { ...lastLine, points: newPoints }
        return [...prev.slice(0, -1), newLine]
      })
    }
  }, [isDrawing, currentTool])

  // Handle drawing end
  const handleMouseUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false)
      // Add drawing action to history
      const lastLine = lines[lines.length - 1]
      if (lastLine && currentTool === 'pen') {
        addDrawingAction({
          type: 'draw',
          data: lastLine,
        })
      }
    }
  }, [isDrawing, lines, currentTool, addDrawingAction])

  // Handle zoom
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    const stage = e.target.getStage()
    if (!stage) return

    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    if (!pointer) return

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    const newScale = e.evt.deltaY > 0 ? oldScale * 0.95 : oldScale * 1.05
    const clampedScale = Math.max(0.1, Math.min(5, newScale))

    setZoom(clampedScale)
    setPan({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    })
  }, [setZoom, setPan])

  // Render current drawing state based on history
  const currentLines = drawingHistory
    .slice(0, historyIndex + 1)
    .filter(action => action.type === 'draw')
    .map(action => action.data)

  const currentShapes = drawingHistory
    .slice(0, historyIndex + 1)
    .filter(action => action.type === 'shape')
    .map(action => action.data)

  const currentTexts = drawingHistory
    .slice(0, historyIndex + 1)
    .filter(action => action.type === 'text')
    .map(action => action.data)

  return (
    <div className="canvas-container w-full h-full relative">
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        scaleX={zoom}
        scaleY={zoom}
        x={pan.x}
        y={pan.y}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onWheel={handleWheel}
        draggable={currentTool === 'select'}
        className={`${currentTool === 'pen' ? 'cursor-pen' : ''} ${currentTool === 'eraser' ? 'cursor-eraser' : ''} ${currentTool === 'select' ? 'cursor-select' : ''}`}
      >
        <Layer>
          {/* Render drawing history */}
          {currentLines.map((line, index) => (
            <Line
              key={`line-${index}`}
              points={line.points}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              lineCap={line.lineCap}
              lineJoin={line.lineJoin}
              className="erasable"
            />
          ))}

          {/* Render shapes */}
          {currentShapes.map((shape, index) => {
            if (shape.type === 'rectangle') {
              return (
                <Rect
                  key={`rect-${index}`}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  fill={shape.fill}
                  className="erasable"
                />
              )
            } else if (shape.type === 'circle') {
              return (
                <Circle
                  key={`circle-${index}`}
                  x={shape.x}
                  y={shape.y}
                  radius={shape.radius}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  fill={shape.fill}
                  className="erasable"
                />
              )
            }
            return null
          })}

          {/* Render texts */}
          {currentTexts.map((text, index) => (
            <Text
              key={`text-${index}`}
              x={text.x}
              y={text.y}
              text={text.text}
              fontSize={text.fontSize}
              fill={text.fill}
              className="erasable"
            />
          ))}

          {/* Render current drawing line */}
          {lines.map((line, index) => (
            <Line
              key={`current-line-${index}`}
              points={line.points}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth}
              lineCap={line.lineCap}
              lineJoin={line.lineJoin}
            />
          ))}
        </Layer>

        {/* Render user cursors */}
        <Layer>
          {users.map(user => (
            <Circle
              key={`cursor-${user.id}`}
              x={user.cursor.x}
              y={user.cursor.y}
              radius={8}
              fill={user.color}
              opacity={0.7}
              listening={false}
            />
          ))}
        </Layer>
      </Stage>

      {/* Canvas controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex flex-col gap-1">
          <button
            onClick={() => setZoom(zoom * 0.9)}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Zoom Out
          </button>
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(zoom * 1.1)}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Zoom In
          </button>
          <button
            onClick={() => {
              setZoom(1)
              setPan({ x: 0, y: 0 })
            }}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default Canvas