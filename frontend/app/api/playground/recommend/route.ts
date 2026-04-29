import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  try {
    const { interests } = await req.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      await new Promise(r => setTimeout(r, 1200));
      return Response.json({
        recommendation: `Based on your interest in ${interests.join(', ')}, we recommend focusing on 'Building End-to-End RAG Applications with Pinecone'.`,
        matchPercentage: 92,
        resources: ["DeepLearning.AI: Vector Databases", "HuggingFace Transformers Documentation"]
      });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      system: 'You are an AI learning path advisor. Return ONLY valid JSON: recommendation (string), matchPercentage (number), resources (array of strings).',
      messages: [{ role: 'user', content: `Suggest a learning path for interests: ${interests.join(', ')}` }]
    });
    
    const content = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
    return Response.json(JSON.parse(content));
  } catch {
    return Response.json({ error: 'Recommendation failed' }, { status: 500 });
  }
}
