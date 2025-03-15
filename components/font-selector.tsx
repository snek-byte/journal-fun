"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Upload } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FontSelectorProps {
  onSelect: (font: string) => void
}

// System fonts
const systemFonts = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { name: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
  { name: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
  { name: "Impact", value: "Impact, Charcoal, sans-serif" },
  { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
]

// Expanded Google Fonts list
const googleFonts = [
  { name: "Roboto", value: "'Roboto', sans-serif" },
  { name: "Open Sans", value: "'Open Sans', sans-serif" },
  { name: "Lato", value: "'Lato', sans-serif" },
  { name: "Montserrat", value: "'Montserrat', sans-serif" },
  { name: "Raleway", value: "'Raleway', sans-serif" },
  { name: "Poppins", value: "'Poppins', sans-serif" },
  { name: "Playfair Display", value: "'Playfair Display', serif" },
  { name: "Merriweather", value: "'Merriweather', serif" },
  { name: "Source Sans Pro", value: "'Source Sans Pro', sans-serif" },
  { name: "PT Sans", value: "'PT Sans', sans-serif" },
  { name: "Nunito", value: "'Nunito', sans-serif" },
  { name: "Oswald", value: "'Oswald', sans-serif" },
  { name: "Quicksand", value: "'Quicksand', sans-serif" },
  { name: "Ubuntu", value: "'Ubuntu', sans-serif" },
  { name: "Dancing Script", value: "'Dancing Script', cursive" },
  { name: "Pacifico", value: "'Pacifico', cursive" },
  { name: "Shadows Into Light", value: "'Shadows Into Light', cursive" },
  { name: "Caveat", value: "'Caveat', cursive" },
  { name: "Indie Flower", value: "'Indie Flower', cursive" },
  { name: "Architects Daughter", value: "'Architects Daughter', cursive" },
  { name: "Abril Fatface", value: "'Abril Fatface', cursive" },
  { name: "Amatic SC", value: "'Amatic SC', cursive" },
  { name: "Bebas Neue", value: "'Bebas Neue', cursive" },
  { name: "Comfortaa", value: "'Comfortaa', cursive" },
  { name: "Crimson Text", value: "'Crimson Text', serif" },
  { name: "Fira Sans", value: "'Fira Sans', sans-serif" },
  { name: "Josefin Sans", value: "'Josefin Sans', sans-serif" },
  { name: "Lobster", value: "'Lobster', cursive" },
  { name: "Mukta", value: "'Mukta', sans-serif" },
  { name: "Noto Sans", value: "'Noto Sans', sans-serif" },
  { name: "Oxygen", value: "'Oxygen', sans-serif" },
  { name: "Permanent Marker", value: "'Permanent Marker', cursive" },
  { name: "Roboto Condensed", value: "'Roboto Condensed', sans-serif" },
  { name: "Roboto Mono", value: "'Roboto Mono', monospace" },
  { name: "Rubik", value: "'Rubik', sans-serif" },
  { name: "Sacramento", value: "'Sacramento', cursive" },
  { name: "Space Mono", value: "'Space Mono', monospace" },
  { name: "Special Elite", value: "'Special Elite', cursive" },
  { name: "Titillium Web", value: "'Titillium Web', sans-serif" },
  { name: "Work Sans", value: "'Work Sans', sans-serif" },
]

// English text transformations
const textTransformations = [
  {
    name: "Bold",
    example: "Bold Text",
    transform: (text: string) =>
      text
        .split("")
        .map((c) => {
          if (c >= "A" && c <= "Z") return String.fromCodePoint(c.charCodeAt(0) + 120211)
          if (c >= "a" && c <= "z") return String.fromCodePoint(c.charCodeAt(0) + 120205)
          return c
        })
        .join(""),
  },
  {
    name: "Italic",
    example: "Italic Text",
    transform: (text: string) =>
      text
        .split("")
        .map((c) => {
          if (c >= "A" && c <= "Z") return String.fromCodePoint(c.charCodeAt(0) + 120263)
          if (c >= "a" && c <= "z") return String.fromCodePoint(c.charCodeAt(0) + 120257)
          return c
        })
        .join(""),
  },
  {
    name: "Bold Italic",
    example: "Bold Italic",
    transform: (text: string) =>
      text
        .split("")
        .map((c) => {
          if (c >= "A" && c <= "Z") return String.fromCodePoint(c.charCodeAt(0) + 120315)
          if (c >= "a" && c <= "z") return String.fromCodePoint(c.charCodeAt(0) + 120309)
          return c
        })
        .join(""),
  },
  {
    name: "Script",
    example: "Script Text",
    transform: (text: string) =>
      text
        .split("")
        .map((c) => {
          if (c >= "A" && c <= "Z") return String.fromCodePoint(c.charCodeAt(0) + 119951)
          if (c >= "a" && c <= "z") return String.fromCodePoint(c.charCodeAt(0) + 119945)
          return c
        })
        .join(""),
  },
  {
    name: "Double-struck",
    example: "Double-struck",
    transform: (text: string) =>
      text
        .split("")
        .map((c) => {
          if (c >= "A" && c <= "Z") return String.fromCodePoint(c.charCodeAt(0) + 120055)
          if (c >= "a" && c <= "z") return String.fromCodePoint(c.charCodeAt(0) + 120049)
          return c
        })
        .join(""),
  },
  {
    name: "Monospace",
    example: "Monospace",
    transform: (text: string) =>
      text
        .split("")
        .map((c) => {
          if (c >= "A" && c <= "Z") return String.fromCodePoint(c.charCodeAt(0) + 120367)
          if (c >= "a" && c <= "z") return String.fromCodePoint(c.charCodeAt(0) + 120361)
          return c
        })
        .join(""),
  },
  {
    name: "Small Caps",
    example: "Small Caps",
    transform: (text: string) => text.toUpperCase(),
  },
  {
    name: "Circled",
    example: "Circled Text",
    transform: (text: string) =>
      text
        .split("")
        .map((c) => {
          if (c >= "A" && c <= "Z") return String.fromCodePoint(c.charCodeAt(0) + 9333)
          if (c >= "a" && c <= "z") return String.fromCodePoint(c.charCodeAt(0) + 9327)
          return c
        })
        .join(""),
  },
  {
    name: "Superscript",
    example: "Superscript",
    transform: (text: string) =>
      text
        .split("")
        .map((c) => {
          if (c === "1") return "¹"
          if (c === "2") return "²"
          if (c === "3") return "³"
          if (c >= "0" && c <= "9") return ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"][Number.parseInt(c)]
          if (c >= "a" && c <= "z") return "ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻ"[c.charCodeAt(0) - 97]
          return c
        })
        .join(""),
  },
  {
    name: "Subscript",
    example: "Subscript",
    transform: (text: string) =>
      text
        .split("")
        .map((c) => {
          if (c >= "0" && c <= "9") return ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"][Number.parseInt(c)]
          if (c >= "a" && c <= "z") return "ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓ"["aehijklmnoprstuvx".indexOf(c)] || c
          return c
        })
        .join(""),
  },
  {
    name: "Inverted",
    example: "Inverted Text",
    transform: (text: string) =>
      text
        .split("")
        .map((c) => {
          const inverted = "zʎxʍʌnʇsɹbdouɯlʞɾᴉɥƃɟǝpɔqɐZʎXMΛ∩┴SɹQԀONW˥ʞſIHפℲƎpƆq∀"[
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c)
          ]
          return inverted || c
        })
        .join("")
        .split("")
        .reverse()
        .join(""),
  },
  {
    name: "Fullwidth",
    example: "Fullwidth",
    transform: (text: string) =>
      text
        .split("")
        .map((c) => {
          if ((c >= "A" && c <= "Z") || (c >= "a" && c <= "z")) {
            return String.fromCodePoint(c.charCodeAt(0) + 65248)
          }
          return c
        })
        .join(""),
  },
]

const FontSelector = ({ onSelect }: FontSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [previewText, setPreviewText] = useState("The quick brown fox jumps over the lazy dog")
  const [activeTab, setActiveTab] = useState("google")
  const [customFonts, setCustomFonts] = useState<Array<{ name: string; value: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load Google Fonts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fontFamilies = googleFonts.map((font) => font.name.replace(/\s+/g, "+")).join("|")
      const link = document.createElement("link")
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`
      link.rel = "stylesheet"
      document.head.appendChild(link)
    }
  }, [])

  const filteredFonts = (() => {
    const query = searchQuery.toLowerCase()
    if (activeTab === "google") {
      return googleFonts.filter((font) => font.name.toLowerCase().includes(query))
    } else if (activeTab === "system") {
      return systemFonts.filter((font) => font.name.toLowerCase().includes(query))
    } else {
      return customFonts.filter((font) => font.name.toLowerCase().includes(query))
    }
  })()

  const handleFontUpload = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFontFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Create a font face from the uploaded file
      const fontName = file.name.replace(/\.[^/.]+$/, "") // Remove extension
      const fontUrl = URL.createObjectURL(file)

      // Create and add the @font-face rule
      const fontFace = new FontFace(fontName, `url(${fontUrl})`)
      const loadedFace = await fontFace.load()
      document.fonts.add(loadedFace)

      // Add to custom fonts list
      setCustomFonts((prev) => [
        ...prev,
        {
          name: fontName,
          value: `'${fontName}', sans-serif`,
        },
      ])

      // Switch to custom fonts tab
      setActiveTab("custom")
    } catch (error) {
      console.error("Error loading font:", error)
      alert("Failed to load font. Please try another file.")
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Preview Text:</h4>
        <Input
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          placeholder="Enter preview text..."
        />
      </div>

      <Tabs defaultValue="fonts" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="fonts">Font Families</TabsTrigger>
          <TabsTrigger value="styles">Text Styles</TabsTrigger>
        </TabsList>

        <TabsContent value="styles" className="space-y-4">
          <ScrollArea className="h-64">
            <div className="grid grid-cols-2 gap-2">
              {textTransformations.map((style, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto py-2 justify-start"
                  onClick={() => onSelect(style.transform(previewText))}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{style.name}</span>
                    <span className="text-xs text-muted-foreground">{style.transform(style.example)}</span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="fonts" className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search fonts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <Tabs defaultValue="google" onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="google">Google</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {activeTab === "custom" && (
            <div className="flex items-center gap-2 p-2 border rounded-md mb-2">
              <Upload className="h-4 w-4 text-slate-500" />
              <span className="text-sm">Upload your own font</span>
              <input
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFontFileChange}
              />
              <Button variant="outline" size="sm" onClick={handleFontUpload} className="ml-auto">
                Browse
              </Button>
            </div>
          )}

          <ScrollArea className="h-48">
            <div className="space-y-2">
              {filteredFonts.map((font, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto py-2"
                  onClick={() => onSelect(font.value)}
                >
                  <span style={{ fontFamily: font.value }} className="truncate">
                    {previewText || font.name}
                  </span>
                </Button>
              ))}
              {filteredFonts.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  {activeTab === "custom"
                    ? "No custom fonts uploaded yet. Click 'Browse' to upload a font."
                    : "No fonts match your search."}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FontSelector

