import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { prompt, tone = "Technical" } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      // Mock streaming response
      const encoder = new TextEncoder();
      const text = `[Simulated ${tone} Response] The AI system requires an GEMINI_API_KEY to generate real responses. To integrate the Gemini model properly, set the environment variable. In a real scenario, this text generator would stream contextual insights based on your prompt: "${prompt}".`;
      const stream = new ReadableStream({
        async start(controller) {
          const words = text.split(' ');
          for (const word of words) {
            controller.enqueue(encoder.encode(word + ' '));
            await new Promise(r => setTimeout(r, 50));
          }
          controller.close();
        }
      });
      return new Response(stream);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const formattedPrompt = `Respond in a ${tone} tone to the following: ${prompt}`;
    const result = await model.generateContentStream(formattedPrompt);

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
    return new Response(JSON.stringify({ error: 'Generation failed' }), { status: 500 });
  }
}
