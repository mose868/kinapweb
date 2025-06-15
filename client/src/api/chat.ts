import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
})

const systemPrompt = `You are a helpful assistant for the Ajira Digital KiNaP Club website. You can help users with:

1. Information about Ajira Digital and the KiNaP club
2. How to sign up and use the marketplace
3. Tips for creating good gig listings
4. Best practices for freelancing
5. Technical support for video uploads
6. General questions about digital skills and online work

Please be friendly, professional, and concise in your responses. If you don't know something, say so and suggest where they might find the information.`

type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export const generateChatResponse = async (messages: Message[]) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return {
      message: response.choices[0].message?.content || 'Sorry, I could not generate a response.',
    }
  } catch (error) {
    console.error('Error generating chat response:', error)
    throw error
  }
} 