import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      await new Promise(r => setTimeout(r, 1500));
      return Response.json({
        insights: ["Revenue shows a 15% upward trend in Q3.", "Anomaly detected in user engagement on weekends."],
        anomalies: ["High drop-off rate on checkout page"],
        chartData: [{ name: 'Q1', value: 400 }, { name: 'Q2', value: 300 }, { name: 'Q3', value: 600 }]
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `System: You are an expert Data Analyst. Analyze the short summary/data. Return ONLY valid JSON: insights (array of strings), anomalies (array of strings), chartData (array of objects with "name" and "value" properties).\n\nUser: Analyze this data: ${data}`;
    const result = await model.generateContent(prompt);
    
    const content = result.response.text();
    // Sometimes Gemini wraps JSON in markdown block, so we clean it
    const cleanContent = content.replace(/```json\n|\n```/g, '');
    return Response.json(JSON.parse(cleanContent));
  } catch {
    return Response.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
