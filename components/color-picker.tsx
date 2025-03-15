"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

interface ColorPickerProps {
  onColorChange: (color: string) => void
}

const presetColors = [
  "#000000",
  "#ffffff",
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#9e9e9e",
  "#607d8b",
]

export const ColorPicker = ({ onColorChange }: ColorPickerProps) => {
  const [color, setColor] = useState("#000000")
  const [red, setRed] = useState(0)
  const [green, setGreen] = useState(0)
  const [blue, setBlue] = useState(0)

  const handleColorChange = (e) => {
    const newColor = e.target.value
    setColor(newColor)
    onColorChange(newColor)

    // Update RGB sliders
    const r = Number.parseInt(newColor.slice(1, 3), 16)
    const g = Number.parseInt(newColor.slice(3, 5), 16)
    const b = Number.parseInt(newColor.slice(5, 7), 16)
    setRed(r)
    setGreen(g)
    setBlue(b)
  }

  const handleRgbChange = () => {
    const hexColor = `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`
    setColor(hexColor)
    onColorChange(hexColor)
  }

  const handlePresetClick = (presetColor) => {
    setColor(presetColor)
    onColorChange(presetColor)

    // Update RGB sliders
    const r = Number.parseInt(presetColor.slice(1, 3), 16)
    const g = Number.parseInt(presetColor.slice(3, 5), 16)
    const b = Number.parseInt(presetColor.slice(5, 7), 16)
    setRed(r)
    setGreen(g)
    setBlue(b)
  }

  return (
    <Tabs defaultValue="picker">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="picker">Color Picker</TabsTrigger>
        <TabsTrigger value="rgb">RGB</TabsTrigger>
      </TabsList>

      <TabsContent value="picker" className="space-y-4">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border" style={{ backgroundColor: color }} />
        </div>

        <input type="color" value={color} onChange={handleColorChange} className="w-full h-10" />

        <div className="grid grid-cols-7 gap-2 mt-4">
          {presetColors.map((presetColor, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-8 h-8 p-0 rounded-full"
              style={{ backgroundColor: presetColor }}
              onClick={() => handlePresetClick(presetColor)}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="rgb" className="space-y-4">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border" style={{ backgroundColor: color }} />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Red</span>
              <span className="text-sm">{red}</span>
            </div>
            <Slider
              value={[red]}
              max={255}
              step={1}
              onValueChange={(value) => {
                setRed(value[0])
                handleRgbChange()
              }}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Green</span>
              <span className="text-sm">{green}</span>
            </div>
            <Slider
              value={[green]}
              max={255}
              step={1}
              onValueChange={(value) => {
                setGreen(value[0])
                handleRgbChange()
              }}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Blue</span>
              <span className="text-sm">{blue}</span>
            </div>
            <Slider
              value={[blue]}
              max={255}
              step={1}
              onValueChange={(value) => {
                setBlue(value[0])
                handleRgbChange()
              }}
              className="w-full"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

