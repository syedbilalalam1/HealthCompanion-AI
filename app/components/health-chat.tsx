"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User } from "lucide-react"
import { getAIResponse } from "@/lib/ai-service"
import LoadingOverlay from "./loading-overlay"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function HealthChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your health assistant. How can I help you today? You can ask me questions about health, fitness, posture, or general wellness."
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await getAIResponse({
        messages: [...messages, userMessage],
        context: "You are a knowledgeable health assistant. Provide accurate, helpful advice about health, fitness, posture, and wellness. Always encourage users to seek professional medical advice for serious concerns."
      })

      const assistantMessage: Message = {
        role: "assistant",
        content: response.content
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble processing your request. Please try again."
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 flex items-center">
        <Bot className="w-5 h-5 text-white mr-2" />
        <h2 className="text-lg font-semibold text-white">Health Assistant</h2>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-gradient-to-b from-green-50 to-white overflow-hidden flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-2 ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="bg-green-100 rounded-full p-1.5 flex-shrink-0">
                    <Bot className="w-4 h-4 text-green-600" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-sm ${
                    message.role === "assistant"
                      ? "bg-white text-gray-800"
                      : "bg-green-600 text-white"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <div className="bg-green-700 rounded-full p-1.5 flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed above bottom nav */}
        <div className="bg-white border-t shadow-lg p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your health question..."
                className="flex-1 bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-green-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-green-600 hover:bg-green-700 px-4 shadow-sm"
                size="default"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isLoading && <LoadingOverlay message="Thinking..." />}
    </div>
  )
} 