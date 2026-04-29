import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  try {
    const { prompt, tone = "Technical" } = await req.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      // Mock streaming response
      const encoder = new TextEncoder();
      const text = `[Simulated ${tone} Response] The AI system requires an ANTHROPIC_API_KEY to generate real responses. To integrate the Claude model properly, set the environment variable. In a real scenario, this text generator would stream contextual insights based on your prompt: "${prompt}".`;
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

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      messages: [{ role: 'user', content: `Respond in a ${tone} tone to the following: ${prompt}` }],
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
    return new Response(JSON.stringify({ error: 'Generation failed' }), { status: 500 });
  }
}
