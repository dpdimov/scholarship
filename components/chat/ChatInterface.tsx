'use client'

import { useState, useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AssessmentContext {
  assessmentId: string
  assessmentName: string
  style: string
  description: string
  traits: string[]
  coordinates: { x: number; y: number }
  position: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [assessmentContext, setAssessmentContext] = useState<AssessmentContext | null>(null)
  const [initialized, setInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check for assessment results in sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('assessmentResults')
    if (stored) {
      try {
        setAssessmentContext(JSON.parse(stored))
      } catch {
        // ignore parse errors
      }
    }
    setInitialized(true)
  }, [])

  // Auto-trigger welcome message once initialized
  useEffect(() => {
    if (initialized && messages.length === 0) {
      sendToAPI([])
    }
  }, [initialized])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendToAPI = async (conversationMessages: Message[]) => {
    setIsStreaming(true)

    // Add empty assistant message that we'll stream into
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationMessages,
          assessmentContext,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No reader')

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process complete SSE messages
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              if (parsed.error) {
                setMessages(prev => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: `Error: ${parsed.error}`
                  }
                  return updated
                })
                break
              }
              if (parsed.text) {
                setMessages(prev => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: updated[updated.length - 1].content + parsed.text
                  }
                  return updated
                })
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => {
        const updated = [...prev]
        if (updated.length > 0 && updated[updated.length - 1].role === 'assistant' && !updated[updated.length - 1].content) {
          updated[updated.length - 1] = {
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.'
          }
        }
        return updated
      })
    } finally {
      setIsStreaming(false)
    }
  }

  const handleSend = (content: string) => {
    const userMessage: Message = { role: 'user', content }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    sendToAPI(updatedMessages)
  }

  return (
    <div className="flex flex-col h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Scholarship Navigator</h1>
            {assessmentContext && (
              <p className="text-xs text-gray-500">
                Assessment result: {assessmentContext.style}
              </p>
            )}
          </div>
          <a
            href="/"
            className="text-sm text-navy-600 hover:text-navy-700 font-medium"
          >
            Home
          </a>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
          {isStreaming && messages.length > 0 && !messages[messages.length - 1].content && (
            <div className="flex justify-start mb-4">
              <div className="bg-white text-gray-400 rounded-2xl px-5 py-3 shadow-sm border border-gray-100 text-sm">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSend} disabled={isStreaming} />
        </div>
      </div>
    </div>
  )
}
