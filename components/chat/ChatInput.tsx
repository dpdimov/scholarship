'use client'

import { useState, useRef, useEffect } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed && !disabled) {
      onSend(trimmed)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`
    }
  }, [input])

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent disabled:opacity-50 bg-white"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="bg-navy-600 hover:bg-navy-700 text-white rounded-xl px-5 py-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
      >
        Send
      </button>
    </form>
  )
}
