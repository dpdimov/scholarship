import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from '@/lib/systemPrompt'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
  const { messages, assessmentContext } = await req.json()

  // Build system prompt, optionally appending assessment results
  let systemPrompt = SYSTEM_PROMPT
  if (assessmentContext) {
    systemPrompt += `\n\n---\n\n# ASSESSMENT CONTEXT\n\nThe user has just completed the ${assessmentContext.assessmentName}. Here are their results:\n\n- **Style**: ${assessmentContext.style}\n- **Description**: ${assessmentContext.description}\n- **Key Traits**: ${assessmentContext.traits.join(', ')}\n- **Coordinates**: X=${assessmentContext.coordinates.x.toFixed(2)}, Y=${assessmentContext.coordinates.y.toFixed(2)}\n- **Position**: ${assessmentContext.position}\n\nUse these results to personalise the conversation. Reference the user's identified style where relevant, but treat the assessment as a starting point for reflection — not a definitive classification. Invite the user to explore what resonates and what surprises them.`
  }

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  })

  // Convert to SSE stream
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const data = JSON.stringify({ text: event.delta.text })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error'
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
