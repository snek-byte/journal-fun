"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorPicker } from "@/components/color-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WordArtSelectorProps {
  onSelect: (style: any) => void
  onCancel: () => void
}

const wordArtStyles = [
  {
    name: "Rainbow",
    gradient: "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)",
    fontSize: 36,
    fontFamily: "Arial",
    fontWeight: "bold",
    text: "Rainbow",
  },
  {
    name: "Fire",
    gradient: "linear-gradient(45deg, #ff0000, #ff7700, #ffff00)",
    fontSize: 36,
    fontFamily: "'Bebas Neue', cursive",
    fontWeight: "bold",
    text: "Fire",
  },
  {
    name: "Ocean",
    gradient: "linear-gradient(45deg, #00c3ff, #0077ff, #0044ff)",
    fontSize: 36,
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: "bold",
    text: "Ocean",
  },
  {
    name: "Neon",
    color: "#39ff14",
    textShadow: "0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 15px #39ff14",
    fontSize: 36,
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: "bold",
    text: "Neon",
  },
  {
    name: "Gold",
    gradient: "linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)",
    fontSize: 36,
    fontFamily: "'Playfair Display', serif",
    fontWeight: "bold",
    text: "Gold",
  },
  {
    name: "Silver",
    gradient: "linear-gradient(45deg, #bcc6cc, #eef2f3, #8c9ca9, #eef2f3, #8c9ca9)",
    fontSize: 36,
    fontFamily: "'Raleway', sans-serif",
    fontWeight: "bold",
    text: "Silver",
  },
  {
    name: "Retro",
    color: "#ff6b6b",
    textShadow: "3px 3px 0 #4ecdc4",
    fontSize: 36,
    fontFamily: "'Permanent Marker', cursive",
    fontWeight: "bold",
    text: "Retro",
  },
  {
    name: "Vintage",
    color: "#5c4033",
    textShadow: "1px 1px 0 #d4b483",
    fontSize: 36,
    fontFamily: "'Special Elite', cursive",
    fontWeight: "normal",
    text: "Vintage",
  },
  {
    name: "Graffiti",
    gradient: "linear-gradient(45deg, #ff00cc, #3333ff)",
    textShadow: "2px 2px 0 #000",
    fontSize: 36,
    fontFamily: "'Permanent Marker', cursive",
    fontWeight: "bold",
    text: "Graffiti",
  },
  {
    name: "Cyberpunk",
    color: "#00f3ff",
    textShadow: "0 0 5px #00f3ff, 0 0 10px #ff00c8",
    fontSize: 36,
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: "bold",
    text: "Cyberpunk",
  },
  {
    name: "3D",
    color: "#ffffff",
    textShadow: "1px 1px 0 #ccc, 2px 2px 0 #c9c9c9, 3px 3px 0 #bbb, 4px 4px 0 #b9b9b9, 5px 5px 0 #aaa",
    fontSize: 36,
    fontFamily: "'Roboto', sans-serif",
    fontWeight: "bold",
    text: "3D Text",
  },
  {
    name: "Comic",
    color: "#ffeb3b",
    textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
    fontSize: 36,
    fontFamily: "'Bangers', cursive",
    fontWeight: "normal",
    text: "Comic",
  },
  {
    name: "Outline",
    color: "white",
    textStroke: "2px black",
    fontSize: 36,
    fontFamily: "'Arial', sans-serif",
    fontWeight: "bold",
    text: "Outline",
  },
  {
    name: "Neon Outline",
    color: "white",
    textStroke: "2px #00f3ff",
    textShadow: "0 0 5px #00f3ff",
    fontSize: 36,
    fontFamily: "'Arial', sans-serif",
    fontWeight: "bold",
    text: "Neon Outline",
  },
  {
    name: "Double Outline",
    color: "white",
    textStroke: "4px black",
    textShadow: "0 0 0 2px white",
    fontSize: 36,
    fontFamily: "'Impact', sans-serif",
    fontWeight: "bold",
    text: "Double Outline",
  },
  {
    name: "Emboss",
    color: "#f5f5f5",
    textShadow: "1px 1px 1px #ccc, 0 0 0 #000, 1px 1px 1px #ccc",
    fontSize: 36,
    fontFamily: "'Georgia', serif",
    fontWeight: "bold",
    text: "Emboss",
  },
]

// Font options for the custom tab
const fontOptions = [
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
  { label: "Courier New", value: "Courier New, monospace" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Impact", value: "Impact, sans-serif" },
  { label: "Comic Sans MS", value: "Comic Sans MS, cursive" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Open Sans", value: "'Open Sans', sans-serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Pacifico", value: "'Pacifico', cursive" },
  { label: "Permanent Marker", value: "'Permanent Marker', cursive" },
]

const WordArtSelector = ({ onSelect, onCancel }: WordArtSelectorProps) => {
  const [text, setText] = useState("Word Art")
  const [fontSize, setFontSize] = useState(36)
  const [selectedStyle, setSelectedStyle] = useState(wordArtStyles[0])
  const [customColor, setCustomColor] = useState("#ff0000")
  const [outlineColor, setOutlineColor] = useState("#000000")
  const [outlineWidth, setOutlineWidth] = useState(2)
  const [selectedFont, setSelectedFont] = useState("Arial, sans-serif")
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [textTransform, setTextTransform] = useState("none")
  const [showOutline, setShowOutline] = useState(false)
  const [shadowColor, setShadowColor] = useState("#000000")
  const [shadowBlur, setShadowBlur] = useState(0)
  const [shadowOffsetX, setShadowOffsetX] = useState(0)
  const [shadowOffsetY, setShadowOffsetY] = useState(0)

  const handleStyleSelect = (style) => {
    setSelectedStyle(style)
  }

  const handleApply = () => {
    const finalStyle = {
      ...selectedStyle,
      fontSize,
      text,
      letterSpacing: letterSpacing ? `${letterSpacing}px` : "normal",
      textTransform,
      fontFamily: selectedFont,
    }

    // Add outline if enabled in custom tab
    if (showOutline) {
      finalStyle.textStroke = `${outlineWidth}px ${outlineColor}`
    }

    // Add text shadow if enabled
    if (shadowBlur > 0 || shadowOffsetX !== 0 || shadowOffsetY !== 0) {
      finalStyle.textShadow = `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`
    }

    onSelect(finalStyle)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="presets">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="presets">Preset Styles</TabsTrigger>
          <TabsTrigger value="custom">Custom Style</TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-4">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text for Word Art"
            className="mb-4"
          />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Font Size</span>
              <span className="text-sm">{fontSize}px</span>
            </div>
            <Slider value={[fontSize]} min={12} max={72} step={1} onValueChange={(value) => setFontSize(value[0])} />
          </div>

          <ScrollArea className="h-64">
            <div className="grid grid-cols-2 gap-2">
              {wordArtStyles.map((style, index) => (
                <Button
                  key={index}
                  variant={selectedStyle.name === style.name ? "default" : "outline"}
                  className="h-auto py-4 flex flex-col items-center justify-center"
                  onClick={() => handleStyleSelect(style)}
                >
                  <span
                    style={{
                      fontFamily: style.fontFamily,
                      fontSize: `${Math.min(24, style.fontSize)}px`,
                      fontWeight: style.fontWeight,
                      background: style.gradient || "none",
                      WebkitBackgroundClip: style.gradient ? "text" : "none",
                      WebkitTextFillColor: style.gradient ? "transparent" : style.color || "inherit",
                      color: !style.gradient ? style.color : "inherit",
                      textShadow: style.textShadow || "none",
                      WebkitTextStroke: style.textStroke || "none",
                    }}
                  >
                    {style.text || style.name}
                  </span>
                  <span className="text-xs mt-2">{style.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text for Word Art"
            className="mb-4"
          />

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Font Size</span>
                <span className="text-sm">{fontSize}px</span>
              </div>
              <Slider value={[fontSize]} min={12} max={72} step={1} onValueChange={(value) => setFontSize(value[0])} />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Font Family</span>
              <Select value={selectedFont} onValueChange={setSelectedFont}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Letter Spacing</span>
                <span className="text-sm">{letterSpacing}px</span>
              </div>
              <Slider
                value={[letterSpacing]}
                min={-5}
                max={20}
                step={1}
                onValueChange={(value) => setLetterSpacing(value[0])}
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Text Transform</span>
              <div className="flex gap-2">
                <Button
                  variant={textTransform === "none" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTextTransform("none")}
                >
                  Normal
                </Button>
                <Button
                  variant={textTransform === "uppercase" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTextTransform("uppercase")}
                >
                  UPPERCASE
                </Button>
                <Button
                  variant={textTransform === "lowercase" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTextTransform("lowercase")}
                >
                  lowercase
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Text Color</span>
              <ColorPicker onColorChange={setCustomColor} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm font-medium">Text Outline</span>
                <Button
                  variant={showOutline ? "default" : "outline"}
                  size="sm"
                  className="ml-auto"
                  onClick={() => setShowOutline(!showOutline)}
                >
                  {showOutline ? "Enabled" : "Disabled"}
                </Button>
              </div>

              {showOutline && (
                <div className="space-y-2 pl-4 border-l-2 border-slate-200 mt-2">
                  <div className="space-y-1">
                    <span className="text-sm">Outline Color</span>
                    <ColorPicker onColorChange={setOutlineColor} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Outline Width</span>
                      <span className="text-sm">{outlineWidth}px</span>
                    </div>
                    <Slider
                      value={[outlineWidth]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => setOutlineWidth(value[0])}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm font-medium">Text Shadow</span>
                <Button
                  variant={shadowBlur > 0 ? "default" : "outline"}
                  size="sm"
                  className="ml-auto"
                  onClick={() => setShadowBlur(shadowBlur > 0 ? 0 : 5)}
                >
                  {shadowBlur > 0 ? "Enabled" : "Disabled"}
                </Button>
              </div>

              {shadowBlur > 0 && (
                <div className="space-y-2 pl-4 border-l-2 border-slate-200 mt-2">
                  <div className="space-y-1">
                    <span className="text-sm">Shadow Color</span>
                    <ColorPicker onColorChange={setShadowColor} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Shadow Blur</span>
                      <span className="text-sm">{shadowBlur}px</span>
                    </div>
                    <Slider
                      value={[shadowBlur]}
                      min={0}
                      max={20}
                      step={1}
                      onValueChange={(value) => setShadowBlur(value[0])}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Horizontal Offset</span>
                      <span className="text-sm">{shadowOffsetX}px</span>
                    </div>
                    <Slider
                      value={[shadowOffsetX]}
                      min={-10}
                      max={10}
                      step={1}
                      onValueChange={(value) => setShadowOffsetX(value[0])}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Vertical Offset</span>
                      <span className="text-sm">{shadowOffsetY}px</span>
                    </div>
                    <Slider
                      value={[shadowOffsetY]}
                      min={-10}
                      max={10}
                      step={1}
                      onValueChange={(value) => setShadowOffsetY(value[0])}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="border rounded-md p-4 flex items-center justify-center h-24">
        <span
          style={{
            fontFamily: selectedFont || selectedStyle.fontFamily,
            fontSize: `${fontSize}px`,
            fontWeight: selectedStyle.fontWeight,
            background: selectedStyle.gradient || "none",
            WebkitBackgroundClip: selectedStyle.gradient ? "text" : "none",
            WebkitTextFillColor: selectedStyle.gradient
              ? "transparent"
              : customColor || selectedStyle.color || "inherit",
            color: !selectedStyle.gradient ? customColor || selectedStyle.color : "inherit",
            textShadow:
              shadowBlur > 0
                ? `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`
                : selectedStyle.textShadow || "none",
            letterSpacing: letterSpacing ? `${letterSpacing}px` : "normal",
            textTransform,
            WebkitTextStroke: showOutline ? `${outlineWidth}px ${outlineColor}` : selectedStyle.textStroke || "none",
          }}
        >
          {text || selectedStyle.text || "Word Art"}
        </span>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleApply}>Apply</Button>
      </div>
    </div>
  )
}

export default WordArtSelector

