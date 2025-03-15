"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

const prompts = [
  "What made you smile today?",
  "What's something you're looking forward to this week?",
  "Describe a challenge you overcame recently.",
  "What's something you're grateful for today?",
  "Write about a person who inspires you and why.",
  "What's a goal you're working towards right now?",
  "Describe your ideal day from start to finish.",
  "What's something new you learned recently?",
  "Write about a place you'd like to visit someday.",
  "What's a memory that always makes you happy?",
  "Describe a book, movie, or show that impacted you recently.",
  "What's something you wish you could tell your younger self?",
  "Write about a skill you'd like to develop or improve.",
  "What's something that brought you peace today?",
  "Describe a time when you felt proud of yourself.",
  "What's a small joy you experienced today?",
  "Write about something beautiful you noticed recently.",
  "What's a habit you'd like to build or break?",
  "Describe your perfect morning routine.",
  "What's something you're curious about right now?",
  "Write about a time when you felt completely alive.",
  "What's a quote that resonates with you and why?",
  "Describe a recent dream you remember.",
  "What's something you've been putting off that you could do today?",
  "Write about someone who changed your life for the better.",
  "What's something you love about yourself?",
  "Describe a small act of kindness you witnessed or performed.",
  "What's a fear you'd like to overcome?",
  "Write about a time when you felt completely at peace.",
  "What's something you're excited to create or contribute to the world?",
]

const DailyPrompt = () => {
  const [prompt, setPrompt] = useState("")

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length)
    setPrompt(prompts[randomIndex])
  }

  useEffect(() => {
    getRandomPrompt()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Today's Writing Prompt</h3>
        <Button variant="ghost" size="icon" onClick={getRandomPrompt}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Card className="p-4 bg-slate-50 dark:bg-slate-800">
        <p className="text-sm italic">{prompt}</p>
      </Card>

      <Button variant="outline" className="w-full" onClick={getRandomPrompt}>
        Get Another Prompt
      </Button>
    </div>
  )
}

export default DailyPrompt

