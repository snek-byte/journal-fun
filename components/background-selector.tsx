"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, Upload } from "lucide-react"

interface BackgroundSelectorProps {
  onSelect: (background: string | React.CSSProperties) => void
}

const gradients = [
  { name: "Cool Blues", value: "linear-gradient(to right, #f5f7fa, #c3cfe2)" },
  { name: "Warm Flame", value: "linear-gradient(to right, #ff9a9e, #fad0c4)" },
  { name: "Sunny Morning", value: "linear-gradient(to right, #f6d365, #fda085)" },
  { name: "Rainy Ashville", value: "linear-gradient(to right, #fbc2eb, #a6c1ee)" },
  { name: "Frozen Dreams", value: "linear-gradient(to right, #fdcbf1, #e6dee9)" },
  { name: "Winter Neva", value: "linear-gradient(to right, #a1c4fd, #c2e9fb)" },
  { name: "Dusty Grass", value: "linear-gradient(to right, #d4fc79, #96e6a1)" },
  { name: "Tempting Azure", value: "linear-gradient(to right, #84fab0, #8fd3f4)" },
  { name: "Heavy Rain", value: "linear-gradient(to right, #cfd9df, #e2ebf0)" },
  { name: "Deep Blue", value: "linear-gradient(to right, #e0c3fc, #8ec5fc)" },
  { name: "Cloudy Knoxville", value: "linear-gradient(to right, #fdfbfb, #ebedee)" },
  { name: "Ripe Malinka", value: "linear-gradient(to right, #f5d0fe, #c084fc)" },
  { name: "Sunset", value: "linear-gradient(to right, #ff7e5f, #feb47b)" },
  { name: "Moonlit Asteroid", value: "linear-gradient(to right, #0f2027, #203a43, #2c5364)" },
  { name: "Soft Cherish", value: "linear-gradient(to right, #dbdcd7, #dddcd7, #e2c9cc, #e7627d, #b8235a)" },
  { name: "Flying Lemon", value: "linear-gradient(to right, #64b3f4, #c2e59c)" },
]

const patterns = [
  {
    name: "Dots",
    value: `radial-gradient(#444 1px, transparent 1px)`,
    size: "20px 20px",
    bgColor: "#f8f8f8",
    position: "0 0",
  },
  {
    name: "Grid",
    value: `linear-gradient(#eee 1px, transparent 1px), 
            linear-gradient(to right, #eee 1px, transparent 1px)`,
    size: "20px 20px",
    bgColor: "#f8f8f8",
    position: "0 0",
  },
  {
    name: "Stripes",
    value: `repeating-linear-gradient(45deg, #f8f8f8, #f8f8f8 10px, #eee 10px, #eee 20px)`,
    size: "auto",
    bgColor: "transparent",
    position: "0 0",
  },
  {
    name: "Zigzag",
    value: `linear-gradient(135deg, #f8f8f8 25%, transparent 25%) -10px 0, 
            linear-gradient(225deg, #f8f8f8 25%, transparent 25%) -10px 0, 
            linear-gradient(315deg, #f8f8f8 25%, transparent 25%), 
            linear-gradient(45deg, #f8f8f8 25%, transparent 25%)`,
    size: "20px 20px",
    bgColor: "#eee",
    position: "0 0",
  },
  {
    name: "Checkerboard",
    value: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
            linear-gradient(-45deg, #ccc 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #ccc 75%), 
            linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
    size: "20px 20px",
    bgColor: "#f8f8f8",
    position: "0 0, 0 10px, 10px -10px, -10px 0px",
  },
  {
    name: "Polka Dots",
    value: `radial-gradient(#ccc 3px, transparent 4px), 
            radial-gradient(#ccc 3px, transparent 4px)`,
    size: "30px 30px",
    bgColor: "#f8f8f8",
    position: "0 0, 15px 15px",
  },
  {
    name: "Blueprint",
    value: `linear-gradient(#e6f4ff 2px, transparent 2px), 
            linear-gradient(90deg, #e6f4ff 2px, transparent 2px), 
            linear-gradient(rgba(230, 244, 255, 0.5) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(230, 244, 255, 0.5) 1px, transparent 1px)`,
    size: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
    bgColor: "#f8fbff",
    position: "0 0, 0 0, 0 0, 0 0",
  },
  {
    name: "Diagonal Lines",
    value: `repeating-linear-gradient(45deg, #f5f5f5, #f5f5f5 5px, #fff 5px, #fff 12px)`,
    size: "auto",
    bgColor: "transparent",
    position: "0 0",
  },
  {
    name: "Crosshatch",
    value: `repeating-linear-gradient(45deg, #f5f5f5, #f5f5f5 2px, transparent 2px, transparent 10px),
            repeating-linear-gradient(-45deg, #f5f5f5, #f5f5f5 2px, transparent 2px, transparent 10px)`,
    size: "auto",
    bgColor: "#ffffff",
    position: "0 0",
  },
  {
    name: "Honeycomb",
    value: `radial-gradient(circle at 100% 150%, #f5f5f5 24%, #e0e0e0 25%, #e0e0e0 28%, #f5f5f5 29%, #f5f5f5 36%, #e0e0e0 36%, #e0e0e0 40%, transparent 40%, transparent),
            radial-gradient(circle at 0 150%, #f5f5f5 24%, #e0e0e0 25%, #e0e0e0 28%, #f5f5f5 29%, #f5f5f5 36%, #e0e0e0 36%, #e0e0e0 40%, transparent 40%, transparent),
            radial-gradient(circle at 50% 100%, #e0e0e0 10%, #f5f5f5 11%, #f5f5f5 23%, #e0e0e0 24%, #e0e0e0 30%, #f5f5f5 31%, #f5f5f5 43%, #e0e0e0 44%, #e0e0e0 50%, #f5f5f5 51%, #f5f5f5 63%, #e0e0e0 64%, #e0e0e0 71%, transparent 71%, transparent)`,
    size: "50px 50px",
    bgColor: "#ffffff",
    position: "0 0, 0 0, 0 0",
  },
  {
    name: "Japanese Pattern",
    value: `radial-gradient(circle, #d5d5d5 2px, transparent 2px),
            radial-gradient(circle, #d5d5d5 2px, transparent 2px)`,
    size: "40px 40px",
    bgColor: "#f5f5f5",
    position: "0 0, 20px 20px",
  },
  {
    name: "Herringbone",
    value: `linear-gradient(45deg, #f5f5f5 12%, transparent 0),
            linear-gradient(-45deg, #f5f5f5 12%, transparent 0)`,
    size: "30px 30px",
    bgColor: "#ffffff",
    position: "0 0",
  },
]

// Unsplash collections for different themes
const unsplashCollections = {
  nature: "1319040",
  abstract: "4694315",
  textures: "4694315",
  patterns: "4694315",
  minimal: "4694315",
  gradient: "4694315",
}

const BackgroundSelector = ({ onSelect }: BackgroundSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [unsplashImages, setUnsplashImages] = useState([
    { id: "1", url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071", alt: "Mountain sunset" },
    { id: "2", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", alt: "Beach" },
    { id: "3", url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07", alt: "Forest" },
    { id: "4", url: "https://images.unsplash.com/photo-1513151233558-d860c5398176", alt: "Abstract paint" },
    { id: "5", url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85", alt: "Gradient purple" },
    { id: "6", url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809", alt: "Gradient blue" },
    { id: "7", url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d", alt: "Marble texture" },
    { id: "8", url: "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb", alt: "Paper texture" },
  ])

  const handleGradientSelect = (gradient) => {
    onSelect(gradient)
  }

  const handlePatternSelect = (pattern) => {
    const style = {
      backgroundImage: pattern.value,
      backgroundSize: pattern.size,
      backgroundColor: pattern.bgColor || "transparent",
      backgroundPosition: pattern.position || "0 0",
    }
    onSelect(style)
  }

  const handleImageSelect = (imageUrl) => {
    onSelect(`url(${imageUrl}) center/cover no-repeat`)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        onSelect(`url(${reader.result}) center/cover no-repeat`)
      }
      reader.readAsDataURL(file)
    }
  }

  const searchUnsplash = async () => {
    if (!searchQuery.trim()) return

    try {
      // In a real app, you would make an API call to Unsplash here
      // For this demo, we'll just simulate the response
      const mockResults = [
        {
          id: "u1",
          url: `https://source.unsplash.com/featured/?${encodeURIComponent(searchQuery)}&sig=1`,
          alt: searchQuery,
        },
        {
          id: "u2",
          url: `https://source.unsplash.com/featured/?${encodeURIComponent(searchQuery)}&sig=2`,
          alt: searchQuery,
        },
        {
          id: "u3",
          url: `https://source.unsplash.com/featured/?${encodeURIComponent(searchQuery)}&sig=3`,
          alt: searchQuery,
        },
        {
          id: "u4",
          url: `https://source.unsplash.com/featured/?${encodeURIComponent(searchQuery)}&sig=4`,
          alt: searchQuery,
        },
      ]

      setUnsplashImages(mockResults)
    } catch (error) {
      console.error("Error searching Unsplash:", error)
    }
  }

  return (
    <Tabs defaultValue="gradients">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="gradients">Gradients</TabsTrigger>
        <TabsTrigger value="patterns">Patterns</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
      </TabsList>

      <TabsContent value="gradients">
        <ScrollArea className="h-64">
          <div className="grid grid-cols-2 gap-2">
            {gradients.map((gradient, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-16 p-0 overflow-hidden"
                onClick={() => handleGradientSelect(gradient.value)}
              >
                <div className="w-full h-full flex items-center justify-center" style={{ background: gradient.value }}>
                  <span className="text-xs font-medium text-slate-700 bg-white/70 px-2 py-1 rounded">
                    {gradient.name}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="patterns">
        <ScrollArea className="h-64">
          <div className="grid grid-cols-2 gap-2">
            {patterns.map((pattern, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-16 p-0 overflow-hidden"
                onClick={() => handlePatternSelect(pattern)}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundImage: pattern.value,
                    backgroundSize: pattern.size,
                    backgroundColor: pattern.bgColor || "transparent",
                    backgroundPosition: pattern.position || "0 0",
                  }}
                >
                  <span className="text-xs font-medium text-slate-700 bg-white/70 px-2 py-1 rounded">
                    {pattern.name}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="images">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search Unsplash images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchUnsplash()}
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={searchUnsplash}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 p-2 border rounded-md">
            <Upload className="h-4 w-4 text-slate-500" />
            <span className="text-sm">Upload your own background</span>
            <Input type="file" accept="image/*" className="hidden" id="background-upload" onChange={handleFileUpload} />
            <label htmlFor="background-upload" className="ml-auto">
              <Button variant="outline" size="sm" asChild>
                <span>Browse</span>
              </Button>
            </label>
          </div>

          <ScrollArea className="h-48">
            <div className="grid grid-cols-2 gap-2">
              {unsplashImages.map((image, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-24 p-0 overflow-hidden"
                  onClick={() => handleImageSelect(image.url)}
                >
                  <div
                    className="w-full h-full flex items-center justify-center bg-cover bg-center"
                    style={{ backgroundImage: `url(${image.url})` }}
                  >
                    <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">{image.alt}</span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default BackgroundSelector

