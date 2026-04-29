import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { interests } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      await new Promise(r => setTimeout(r, 1200));
      return Response.json({
        recommendation: `Based on your interest in ${interests.join(', ')}, we recommend focusing on 'Building End-to-End RAG Applications with Pinecone'.`,
        matchPercentage: 92,
        resources: ["DeepLearning.AI: Vector Databases", "HuggingFace Transformers Documentation"]
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `System: You are an AI learning path advisor. Return ONLY valid JSON: recommendation (string), matchPercentage (number), resources (array of strings).\n\nUser: Suggest a learning path for interests: ${interests.join(', ')}`;
    const result = await model.generateContent(prompt);
    
    const content = result.response.text();
    // Clean potential markdown blocks
    const cleanContent = content.replace(/```json\n|\n```/g, '');
    return Response.json(JSON.parse(cleanContent));
  } catch {
    return Response.json({ error: 'Recommendation failed' }, { status: 500 });
  }
}
