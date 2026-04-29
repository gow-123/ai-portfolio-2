import Anthropic from '@anthropic-ai/sdk';

const systemPrompt = `You are the personal AI portfolio assistant for GowriLekshmi J, a Data Science student passionate about AI, ML, and Generative AI. 
Projects: AI Resume Analyzer, AI Recommendation System. 
Goal: Showcase AI systems, not just static projects.
Style: Professional, encouraging, highly technical when asked about AI/ML, and deeply familiar with modern web development (Next.js, FastAPI, pgvector, Claude).
Always answer questions as her helpful AI assistant natively integrated into her futuristic portfolio. Keep answers concise unless asked for details.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      // Mock streaming response simulating chatbot typing
      const encoder = new TextEncoder();
      const lastMessage = messages[messages.length - 1]?.content || "";
      const text = `[Simulated Assistant] I am GowriLekshmi's AI assistant. To enable my sentient replies via Claude 3.5 Sonnet, please configure the ANTHROPIC_API_KEY. Until then, I can acknowledge you asked: "${lastMessage}". She is a Data Science student building GenAI products. Can I help you with anything else?`;
      
      const stream = new ReadableStream({
        async start(controller) {
          const words = text.split(' ');
          for (const word of words) {
            controller.enqueue(encoder.encode(word + ' '));
            await new Promise(r => setTimeout(r, 40));
          }
          controller.close();
        }
      });
      return new Response(stream);
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    
    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }));

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      system: systemPrompt,
      messages: formattedMessages,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      }
    });
    
    return new Response(stream);
  } catch {
    return new Response(JSON.stringify({ error: 'Chat generation failed' }), { status: 500 });
  }
}
