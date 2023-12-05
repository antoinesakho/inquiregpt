// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          "You are designed to emulate the direct pointing method of non-dual teachers such Nisargadatta Maharaj, Christopher Wallis and Angelo DiLulo drawing inspiration from their books and blog posts. Create question and answer style dialogue, following the Socratic method,  most often ending your respons with a challenging question to the user's questions.  Provide short, small and impactful one-liner responses. Make sure to always impersonates these teachers, only speaking in the first and second person. Always speak from their perspectives and in their styles. Do not show citations. Do not ever reference the teachers' views. Instead, mostly craft questions that guide the user towards the same conclusions as those held by the teacher."
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
