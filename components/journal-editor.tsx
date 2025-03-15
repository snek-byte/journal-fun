"use client"

import type React from "react"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { createEditor, type Descendant, Editor, Transforms, Element as SlateElement } from "slate"
import { Slate, Editable, withReact, useSlate } from "slate-react"
import { withHistory } from "slate-history"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Image,
  FileText,
  Download,
  Type,
  Palette,
  Sticker,
  Pencil,
  Sliders,
  Quote,
  Undo,
  Redo,
  Printer,
  Eye,
} from "lucide-react"
import BackgroundSelector from "@/components/background-selector"
import FontSelector from "@/components/font-selector"
import { ColorPicker } from "@/components/color-picker"
import DrawingTool from "@/components/drawing-tool"
import DailyPrompt from "@/components/daily-prompt"
import WordArtSelector from "@/components/word-art-selector"
import { jsPDF } from "jspdf"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Define types for Slate elements
type CustomElement = {
  type: string
  children: CustomText[]
  [key: string]: any
}

type CustomText = {
  text: string
  [key: string]: any
}

// Custom element types
const CustomElementComponent = ({
  attributes,
  children,
  element,
}: {
  attributes: any
  children: React.ReactNode
  element: CustomElement
}) => {
  switch (element.type) {
    case "heading-one":
      return (
        <h1 {...attributes} className="text-3xl font-bold my-3">
          {children}
        </h1>
      )
    case "heading-two":
      return (
        <h2 {...attributes} className="text-2xl font-bold my-2">
          {children}
        </h2>
      )
    case "block-quote":
      return (
        <blockquote {...attributes} className="border-l-4 border-slate-300 pl-4 my-3 italic">
          {children}
        </blockquote>
      )
    case "bulleted-list":
      return (
        <ul {...attributes} className="list-disc ml-6 my-3">
          {children}
        </ul>
      )
    case "numbered-list":
      return (
        <ol {...attributes} className="list-decimal ml-6 my-3">
          {children}
        </ol>
      )
    case "list-item":
      return <li {...attributes}>{children}</li>
    case "image":
      return (
        <div {...attributes} contentEditable={false} className="relative my-3 cursor-move" draggable="true">
          <div className="absolute -top-6 right-0 flex space-x-1">
            <Button variant="outline" size="icon" className="h-6 w-6">
              <Sliders className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="icon" className="h-6 w-6">
              <Palette className="h-3 w-3" />
            </Button>
          </div>
          <img
            src={element.url || "/placeholder.svg"}
            alt={element.alt || ""}
            className="max-w-full rounded-md"
            style={{
              width: element.width || "auto",
              filter: element.filter || "none",
            }}
          />
          {children}
        </div>
      )
    case "sticker":
      return (
        <div {...attributes} contentEditable={false} className="relative inline-block cursor-move" draggable="true">
          <span className="text-4xl" style={{ fontSize: `${element.size || 32}px` }}>
            {element.emoji}
          </span>
          {children}
        </div>
      )
    case "drawing":
      return (
        <div {...attributes} contentEditable={false} className="relative my-3 cursor-move" draggable="true">
          <img
            src={element.dataUrl || "/placeholder.svg"}
            alt="Drawing"
            className="max-w-full rounded-md border border-slate-200"
          />
          {children}
        </div>
      )
    case "word-art":
      return (
        <div
          {...attributes}
          className="relative my-3 cursor-move text-center"
          draggable="true"
          style={{
            background: element.background || "none",
            transform: element.transform || "none",
            padding: "10px",
          }}
        >
          <span
            style={{
              fontFamily: element.fontFamily || "inherit",
              fontSize: `${element.fontSize || 32}px`,
              fontWeight: element.fontWeight || "bold",
              background: element.gradient || "none",
              WebkitBackgroundClip: element.gradient ? "text" : "none",
              WebkitTextFillColor: element.gradient ? "transparent" : element.color || "inherit",
              color: !element.gradient ? element.color : "inherit",
              textShadow: element.textShadow || "none",
              letterSpacing: element.letterSpacing || "normal",
              textTransform: element.textTransform || "none",
              textStroke: element.textStroke || "none",
              WebkitTextStroke: element.textStroke || "none",
            }}
          >
            {children}
          </span>
        </div>
      )
    default:
      return (
        <p {...attributes} className="my-2">
          {children}
        </p>
      )
  }
}

// Add proper TypeScript typing for the Leaf component
const Leaf = ({
  attributes,
  children,
  leaf,
}: {
  attributes: any
  children: React.ReactNode
  leaf: CustomText
}) => {
  const style: React.CSSProperties = {}

  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.code) {
    children = <code className="bg-slate-100 dark:bg-slate-800 rounded px-1">{children}</code>
  }

  if (leaf.color) {
    style.color = leaf.color
  }

  if (leaf.fontSize) {
    style.fontSize = `${leaf.fontSize}px`
  }

  if (leaf.fontFamily) {
    style.fontFamily = leaf.fontFamily
  }

  if (leaf.unicodeStyle) {
    children = <span className="font-unicode">{leaf.unicodeStyle}</span>
  }

  if (leaf.textStroke) {
    style.WebkitTextStroke = leaf.textStroke
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  )
}

// Add proper TypeScript typing for the FormatButton component
const FormatButton = ({
  format,
  icon,
  isBlock = false,
}: {
  format: string
  icon: React.ComponentType<any>
  isBlock?: boolean
}) => {
  const editor = useSlate()

  const isBlockActive = (editor: Editor, format: string) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
    return !!match
  }

  const isMarkActive = (editor: Editor, format: string) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
  }

  const toggleBlock = (editor: Editor, format: string) => {
    const isActive = isBlockActive(editor, format)
    const isList = format === "bulleted-list" || format === "numbered-list"

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && ["bulleted-list", "numbered-list"].includes(n.type),
      split: true,
    })

    const newProperties: Partial<SlateElement> = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    }

    Transforms.setNodes(editor, newProperties)

    if (!isActive && isList) {
      const block = { type: format, children: [] }
      Transforms.wrapNodes(editor, block)
    }
  }

  const toggleMark = (editor: Editor, format: string) => {
    const isActive = isMarkActive(editor, format)
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }

  const Icon = icon
  const isActive = isBlock ? isBlockActive(editor, format) : isMarkActive(editor, format)

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      onClick={(e) => {
        e.preventDefault()
        if (isBlock) {
          toggleBlock(editor, format)
        } else {
          toggleMark(editor, format)
        }
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}

// Initial value for the editor - define it as a constant outside the component
const INITIAL_VALUE: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "Start writing your journal entry here..." }],
  },
]

const JournalEditor = () => {
  // Add a custom isInline function to the editor to properly handle inline elements
  // Add this right after creating the editor object in the JournalEditor component

  // Create a Slate editor object that won't change across renders
  const editor = useMemo(() => {
    const e = withHistory(withReact(createEditor()))

    // Define which elements should be treated as inline
    const { isInline } = e
    e.isInline = (element) => element.type === "sticker" || isInline(element)

    return e
  }, [])

  // Explicitly type the state with Descendant[] and ensure it's initialized with INITIAL_VALUE
  const [value, setValue] = useState<Descendant[]>(() => INITIAL_VALUE)
  const [background, setBackground] = useState("linear-gradient(to right, #f5f7fa, #c3cfe2)")
  const [fontSize, setFontSize] = useState(16)
  const [showDrawing, setShowDrawing] = useState(false)
  const [showWordArtSelector, setShowWordArtSelector] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [showPrintPreview, setShowPrintPreview] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const editorRef = useRef(null)
  const journalRef = useRef(null)
  const contentRef = useRef(null)
  const printFrameRef = useRef<HTMLIFrameElement>(null)

  // Define a rendering function for custom elements
  const renderElement = useCallback((props: any) => <CustomElementComponent {...props} />, [])

  // Define a rendering function for custom text
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

  // Handle image insertion
  const insertImage = (editor: Editor, url: string, alt = "Image") => {
    // First, ensure we're not inside another node by moving to the end of the current block
    Transforms.select(editor, Editor.end(editor, []))

    const image = { type: "image", url, alt, children: [{ text: "" }] }
    Transforms.insertNodes(editor, image)

    // Move selection after the image
    Transforms.move(editor)
  }

  // Handle sticker insertion
  const insertSticker = (editor: Editor, emoji: string) => {
    // First, ensure we're not inside another node by moving to the end of the current block
    Transforms.select(editor, Editor.end(editor, []))

    // Then insert the sticker as a new node
    const sticker = { type: "sticker", emoji, children: [{ text: "" }] }
    Transforms.insertNodes(editor, sticker)

    // Move selection after the sticker
    Transforms.move(editor)
  }

  // Handle drawing insertion
  const insertDrawing = (editor: Editor, dataUrl: string) => {
    // First, ensure we're not inside another node by moving to the end of the current block
    Transforms.select(editor, Editor.end(editor, []))

    const drawing = { type: "drawing", dataUrl, children: [{ text: "" }] }
    Transforms.insertNodes(editor, drawing)

    // Move selection after the drawing
    Transforms.move(editor)
    setShowDrawing(false)
  }

  // Handle word art insertion
  const insertWordArt = (editor: Editor, style: any) => {
    // First, ensure we're not inside another node by moving to the end of the current block
    Transforms.select(editor, Editor.end(editor, []))

    const wordArt = {
      type: "word-art",
      ...style,
      children: [{ text: style.text || "Word Art" }],
    }
    Transforms.insertNodes(editor, wordArt)

    // Move selection after the word art
    Transforms.move(editor)
    setShowWordArtSelector(false)
  }

  // Generate preview image for print preview
  const generatePreview = async () => {
    if (!contentRef.current) return

    try {
      setIsPrinting(true)

      // Wait for state update to apply printing class
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Use html2canvas directly
      const { default: html2canvas } = await import("html2canvas")

      const canvas = await html2canvas(contentRef.current, {
        allowTaint: true,
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        logging: false,
        onclone: (clonedDoc) => {
          // Apply background to the cloned element
          const clonedContent = clonedDoc.querySelector("[data-content-ref]")
          if (clonedContent) {
            clonedContent.style.background = background
            clonedContent.style.padding = "20px"
          }
        },
      })

      const imgData = canvas.toDataURL("image/png")
      setPreviewImage(imgData)
      setShowPrintPreview(true)
    } catch (error) {
      console.error("Error generating preview:", error)
    } finally {
      setIsPrinting(false)
    }
  }

  // Print the journal directly
  const printJournal = () => {
    if (!contentRef.current) return

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow popups to print your journal")
      return
    }

    // Get the content HTML
    const contentHtml = contentRef.current.innerHTML

    // Create the print document
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Journal Print</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: ${background};
            }
            .content {
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            @media print {
              body {
                background: ${background};
              }
              .print-button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="content">
            ${contentHtml}
          </div>
          <div style="text-align: center; margin-top: 20px;" class="print-button">
            <button onclick="window.print(); window.close();" style="padding: 10px 20px; background: #4F46E5; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Journal
            </button>
          </div>
          <script>
            // Auto-print if needed
            // window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  // Export to PDF
  const exportToPDF = async () => {
    if (!contentRef.current) return

    try {
      setIsPrinting(true)

      // Wait for state update to apply printing class
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Use html2canvas directly
      const { default: html2canvas } = await import("html2canvas")

      const canvas = await html2canvas(contentRef.current, {
        allowTaint: true,
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        logging: false,
        onclone: (clonedDoc) => {
          // Apply background to the cloned element
          const clonedContent = clonedDoc.querySelector("[data-content-ref]")
          if (clonedContent) {
            clonedContent.style.background = background
            clonedContent.style.padding = "20px"
          }
        },
      })

      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Calculate dimensions to fit the content properly
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm

      // Calculate the height based on the aspect ratio
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Add the image to the PDF, fitting it to the page width
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight))

      // If the content is taller than one page, add additional pages
      if (imgHeight > pageHeight) {
        let heightLeft = imgHeight - pageHeight
        let position = -pageHeight // Start position for next page

        while (heightLeft > 0) {
          pdf.addPage()
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
          position -= pageHeight
        }
      }

      pdf.save("my-journal.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsPrinting(false)
    }
  }

  // Handle font size change
  const changeFontSize = (newSize: number[]) => {
    setFontSize(newSize[0])
    Editor.addMark(editor, "fontSize", newSize[0])
  }

  // Reset value if it becomes undefined
  useEffect(() => {
    if (!value) {
      setValue(INITIAL_VALUE)
    }
  }, [value])

  // Ensure we have a valid value before rendering Slate
  if (!value) {
    return <div>Loading editor...</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-9">
        <Card className="p-4 shadow-lg">
          <div
            ref={journalRef}
            className={`min-h-[70vh] p-6 rounded-lg transition-all duration-300 ${isPrinting ? "print-mode" : ""}`}
            style={{ background }}
          >
            <Slate
              editor={editor}
              initialValue={INITIAL_VALUE}
              value={value}
              onChange={(newValue) => {
                if (newValue && Array.isArray(newValue)) {
                  setValue(newValue)
                }
              }}
            >
              {!isPrinting && (
                <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 rounded-lg shadow-sm mb-4 p-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    <FormatButton format="bold" icon={Bold} />
                    <FormatButton format="italic" icon={Italic} />
                    <FormatButton format="underline" icon={Underline} />
                    <Separator orientation="vertical" className="mx-1 h-8" />
                    <FormatButton format="heading-one" icon={Type} isBlock />
                    <FormatButton format="heading-two" icon={Type} isBlock />
                    <FormatButton format="block-quote" icon={Quote} isBlock />
                    <Separator orientation="vertical" className="mx-1 h-8" />
                    <FormatButton format="bulleted-list" icon={List} isBlock />
                    <FormatButton format="numbered-list" icon={ListOrdered} isBlock />
                    <Separator orientation="vertical" className="mx-1 h-8" />

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Palette className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <ColorPicker
                          onColorChange={(color) => {
                            Editor.addMark(editor, "color", color)
                          }}
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Image className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72">
                        <div className="space-y-2">
                          <h3 className="font-medium">Insert Image</h3>
                          <div className="grid gap-2">
                            <input
                              type="text"
                              placeholder="Image URL"
                              className="border rounded p-2"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  insertImage(editor, e.currentTarget.value)
                                  e.currentTarget.value = ""
                                }
                              }}
                            />
                            <div className="text-center">or</div>
                            <input
                              type="file"
                              accept="image/*"
                              className="text-sm"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onload = () => {
                                    insertImage(editor, reader.result as string)
                                  }
                                  reader.readAsDataURL(file)
                                }
                              }}
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Sticker className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72">
                        <ScrollArea className="h-48">
                          <div className="grid grid-cols-6 gap-2 p-2">
                            {[
                              "😀",
                              "😂",
                              "😍",
                              "🥰",
                              "😎",
                              "🤩",
                              "🥳",
                              "😇",
                              "🤔",
                              "🙄",
                              "😴",
                              "🥺",
                              "😭",
                              "😱",
                              "🥵",
                              "🥶",
                              "😈",
                              "👻",
                              "👽",
                              "🤖",
                              "👍",
                              "👎",
                              "👏",
                              "🙌",
                              "🤝",
                              "👋",
                              "✌️",
                              "🤞",
                              "🤟",
                              "🤘",
                              "💪",
                              "🦾",
                              "🧠",
                              "👁️",
                              "👀",
                              "👄",
                              "👅",
                              "❤️",
                              "🧡",
                              "💛",
                              "💚",
                              "💙",
                              "💜",
                              "🖤",
                              "🤍",
                              "🤎",
                              "💔",
                              "❣️",
                              "💕",
                              "💞",
                              "💓",
                              "💗",
                              "💖",
                              "💘",
                              "💝",
                              "💟",
                              "☮️",
                              "✝️",
                              "☪️",
                              "🕉️",
                              "☸️",
                              "✡️",
                              "🔯",
                              "🕎",
                              "☯️",
                              "☦️",
                              "🛐",
                              "⛎",
                              "♈",
                              "♉",
                              "🌟",
                              "⭐",
                              "✨",
                              "💫",
                              "🌈",
                              "☀️",
                              "🌤️",
                              "⛅",
                              "🌥️",
                              "☁️",
                              "🌦️",
                              "🌧️",
                              "⛈️",
                              "🌩️",
                              "🌨️",
                              "❄️",
                              "☃️",
                              "⛄",
                              "🌬️",
                              "💨",
                              "🌪️",
                              "🌫️",
                              "🌊",
                              "💧",
                              "💦",
                              "☔",
                              "🍏",
                              "🍎",
                              "🍐",
                              "🍊",
                              "🍋",
                              "🍌",
                              "🍉",
                              "🍇",
                              "🍓",
                              "🍈",
                              "🍒",
                              "🍑",
                              "🥭",
                              "🍍",
                              "🥥",
                              "🥝",
                              "🍅",
                              "🍆",
                              "🥑",
                              "🥦",
                              "🥬",
                              "🥒",
                              "🌶️",
                              "🌽",
                            ].map((emoji, i) => (
                              <Button
                                key={i}
                                variant="outline"
                                className="h-10 w-10 p-0"
                                onClick={() => insertSticker(editor, emoji)}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>

                    <Button variant="outline" size="icon" onClick={() => setShowDrawing(true)}>
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="icon" onClick={() => setShowWordArtSelector(true)}>
                      <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                        W
                      </span>
                    </Button>

                    <div className="ml-auto flex items-center gap-1">
                      <Button variant="outline" size="icon" onClick={() => editor.undo()}>
                        <Undo className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => editor.redo()}>
                        <Redo className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">Font Size:</span>
                    <Slider
                      defaultValue={[16]}
                      max={72}
                      min={8}
                      step={1}
                      className="w-32"
                      onValueChange={changeFontSize}
                    />
                    <span className="text-sm">{fontSize}px</span>
                  </div>
                </div>
              )}

              <div ref={contentRef} className="prose prose-slate dark:prose-invert max-w-none" data-content-ref>
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  placeholder="Start writing your journal entry here..."
                  spellCheck
                  autoFocus
                  className="min-h-[60vh] outline-none"
                  style={{ fontSize: `${fontSize}px` }}
                />
              </div>
            </Slate>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Tabs defaultValue="prompt" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="prompt" className="space-y-4">
            <Card className="p-4">
              <DailyPrompt />
            </Card>
          </TabsContent>

          <TabsContent value="style" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-medium mb-2">Background</h3>
              <BackgroundSelector onSelect={setBackground} />

              <Separator className="my-4" />

              <h3 className="font-medium mb-2">Fonts</h3>
              <FontSelector
                onSelect={(font) => {
                  Editor.addMark(editor, "fontFamily", font)
                }}
              />
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-medium mb-2">Export Options</h3>
              <div className="space-y-2">
                <Button className="w-full" onClick={generatePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button className="w-full" onClick={printJournal}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button className="w-full" onClick={exportToPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Save as Template
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showDrawing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-3xl p-4">
            <h3 className="font-medium mb-2">Drawing Tool</h3>
            <DrawingTool onSave={(dataUrl) => insertDrawing(editor, dataUrl)} onCancel={() => setShowDrawing(false)} />
          </Card>
        </div>
      )}

      {showWordArtSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-3xl p-4">
            <h3 className="font-medium mb-2">Word Art Styles</h3>
            <WordArtSelector
              onSelect={(style) => insertWordArt(editor, style)}
              onCancel={() => setShowWordArtSelector(false)}
            />
          </Card>
        </div>
      )}

      {/* Print Preview Dialog */}
      <Dialog open={showPrintPreview} onOpenChange={setShowPrintPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogTitle>Print Preview</DialogTitle>
          <DialogDescription>Preview how your journal will look when printed</DialogDescription>

          <div className="mt-4 bg-white rounded-md shadow-md p-4">
            {previewImage && (
              <div className="flex flex-col items-center">
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Print Preview"
                  className="max-w-full border border-gray-200 rounded"
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={printJournal}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button onClick={exportToPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Save as PDF
                  </Button>
                  <Button variant="outline" onClick={() => setShowPrintPreview(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .print-mode .prose * {
          page-break-inside: avoid;
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          .print-mode, .print-mode * {
            visibility: visible;
          }
          .print-mode {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default JournalEditor

