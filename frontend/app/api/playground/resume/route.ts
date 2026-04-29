import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resumeText = body.resumeText;

    if (!process.env.GEMINI_API_KEY) {
      // Mock response
      await new Promise(r => setTimeout(r, 1500));
      return Response.json({
        score: 85,
        skillGaps: ["Cloud Deployment (AWS)", "CI/CD Pipelines"],
        suggestions: ["Highlight more MLOps experience", "Quantify the impact of the Recommendation System project"]
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `System: You are an expert ATS and technical recruiter. Analyze the resume. Respond ONLY with a valid JSON format containing: score (number 0-100), skillGaps (array of strings), suggestions (array of strings).\n\nUser: Analyze this resume:\n\n${resumeText}`;
    const result = await model.generateContent(prompt);

    const content = result.response.text();
    // Clean potential markdown blocks
    const cleanContent = content.replace(/```json\n|\n```/g, '');
    return Response.json(JSON.parse(cleanContent));
  } catch {
    return Response.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
