"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eraser, Pencil, Square, Circle, Undo, Redo, Save, X } from "lucide-react"

interface DrawingToolProps {
  onSave: (dataUrl: string) => void
  onCancel: () => void
}

const DrawingTool = ({ onSave, onCancel }: DrawingToolProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState("pencil")
  const [color, setColor] = useState("#000000")
  const [lineWidth, setLineWidth] = useState(5)
  const [history, setHistory] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const ctx = canvas.getContext("2d")
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      setContext(ctx)

      // Save initial state
      saveState()
    }
  }, [])

  useEffect(() => {
    if (context) {
      context.strokeStyle = color
      context.lineWidth = lineWidth
    }
  }, [color, lineWidth, context])

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e)

    context.beginPath()
    context.moveTo(offsetX, offsetY)
    setIsDrawing(true)

    if (tool === "rectangle") {
      context.rect(offsetX, offsetY, 0, 0)
      context.lastX = offsetX
      context.lastY = offsetY
    } else if (tool === "circle") {
      context.arc(offsetX, offsetY, 0, 0, Math.PI * 2)
      context.lastX = offsetX
      context.lastY = offsetY
    }
  }

  const draw = (e) => {
    if (!isDrawing) return

    const { offsetX, offsetY } = getCoordinates(e)

    if (tool === "pencil") {
      context.lineTo(offsetX, offsetY)
      context.stroke()
    } else if (tool === "eraser") {
      const savedColor = context.strokeStyle
      context.strokeStyle = "#ffffff"
      context.lineTo(offsetX, offsetY)
      context.stroke()
      context.strokeStyle = savedColor
    } else if (tool === "rectangle") {
      // Clear canvas and redraw from history
      redrawFromHistory()

      // Draw new rectangle
      context.beginPath()
      const width = offsetX - context.lastX
      const height = offsetY - context.lastY
      context.rect(context.lastX, context.lastY, width, height)
      context.stroke()
    } else if (tool === "circle") {
      // Clear canvas and redraw from history
      redrawFromHistory()

      // Draw new circle
      context.beginPath()
      const radius = Math.sqrt(Math.pow(offsetX - context.lastX, 2) + Math.pow(offsetY - context.lastY, 2))
      context.arc(context.lastX, context.lastY, radius, 0, Math.PI * 2)
      context.stroke()
    }
  }

  const stopDrawing = () => {
    if (isDrawing) {
      context.closePath()
      setIsDrawing(false)
      saveState()
    }
  }

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { offsetX: 0, offsetY: 0 }

    const rect = canvas.getBoundingClientRect()

    // For touch events
    if ("touches" in e && e.touches && e.touches[0]) {
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top,
      }
    }

    // For mouse events
    if ("nativeEvent" in e) {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY,
      }
    }

    return { offsetX: 0, offsetY: 0 }
  }

  const saveState = () => {
    const canvas = canvasRef.current
    setHistory([...history, canvas.toDataURL()])
    setRedoStack([])
  }

  const redrawFromHistory = () => {
    if (history.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Redraw from last history state
    const img = new Image()
    img.src = history[history.length - 1]
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
    }
  }

  const handleUndo = () => {
    if (history.length <= 1) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Remove current state and get previous state
    const currentState = history.pop()
    setHistory([...history])
    setRedoStack([currentState, ...redoStack])

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // If there's still history, draw the previous state
    if (history.length > 0) {
      const img = new Image()
      img.src = history[history.length - 1]
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
    }
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Get state to redo
    const stateToRedo = redoStack.shift()
    setRedoStack([...redoStack])
    setHistory([...history, stateToRedo])

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw the redo state
    const img = new Image()
    img.src = stateToRedo
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
    }
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL("image/png")
    onSave(dataUrl)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="color">Color</TabsTrigger>
            <TabsTrigger value="size">Size</TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="flex flex-wrap gap-2">
            <Button variant={tool === "pencil" ? "default" : "outline"} size="icon" onClick={() => setTool("pencil")}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant={tool === "eraser" ? "default" : "outline"} size="icon" onClick={() => setTool("eraser")}>
              <Eraser className="h-4 w-4" />
            </Button>
            <Button
              variant={tool === "rectangle" ? "default" : "outline"}
              size="icon"
              onClick={() => setTool("rectangle")}
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button variant={tool === "circle" ? "default" : "outline"} size="icon" onClick={() => setTool("circle")}>
              <Circle className="h-4 w-4" />
            </Button>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="icon" onClick={handleUndo} disabled={history.length <= 1}>
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleRedo} disabled={redoStack.length === 0}>
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="color">
            <div className="grid grid-cols-8 gap-2">
              {[
                "#000000",
                "#ffffff",
                "#ff0000",
                "#ff9900",
                "#ffff00",
                "#00ff00",
                "#0000ff",
                "#9900ff",
                "#ff00ff",
                "#999999",
                "#cccccc",
                "#ffcccc",
                "#ffcc99",
                "#ffff99",
                "#99ff99",
                "#99ffff",
              ].map((c, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-8 h-8 p-0 rounded-full"
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 mt-2" />
          </TabsContent>

          <TabsContent value="size">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Brush Size</span>
                <span className="text-sm">{lineWidth}px</span>
              </div>
              <Slider value={[lineWidth]} min={1} max={50} step={1} onValueChange={(value) => setLineWidth(value[0])} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="border rounded-md overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-[400px] touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  )
}

export default DrawingTool

