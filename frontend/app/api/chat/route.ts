import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `You are the personal AI portfolio assistant for GowriLekshmi J, a Data Science student passionate about AI, ML, and Generative AI. 
Projects: AI Resume Analyzer, AI Recommendation System. 
Goal: Showcase AI systems, not just static projects.
Style: Professional, encouraging, highly technical when asked about AI/ML, and deeply familiar with modern web development (Next.js, FastAPI, pgvector, Claude).
Always answer questions as her helpful AI assistant natively integrated into her futuristic portfolio. Keep answers concise unless asked for details.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      // Mock streaming response simulating chatbot typing
      const encoder = new TextEncoder();
      const lastMessage = messages[messages.length - 1]?.content || "";
      const text = `[Simulated Assistant] I am GowriLekshmi's AI assistant. To enable my sentient replies via Gemini, please configure the GEMINI_API_KEY. Until then, I can acknowledge you asked: "${lastMessage}". She is a Data Science student building GenAI products. Can I help you with anything else?`;
      
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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = systemPrompt + "\n\n" + messages.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join("\n") + "\nassistant:";

    const result = await model.generateContentStream(prompt);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      }
    });
    
    return new Response(stream);
  } catch {
    return new Response(JSON.stringify({ error: 'Chat generation failed' }), { status: 500 });
  }
}
