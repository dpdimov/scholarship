'use client'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3 ${
          isUser
            ? 'bg-navy-600 text-white'
            : 'bg-white text-gray-800 shadow-sm border border-gray-100'
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed prose-content">
          {content}
        </div>
      </div>
    </div>
  )
}
