import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      await new Promise(r => setTimeout(r, 1500));
      return Response.json({
        insights: ["Revenue shows a 15% upward trend in Q3.", "Anomaly detected in user engagement on weekends."],
        anomalies: ["High drop-off rate on checkout page"],
        chartData: [{ name: 'Q1', value: 400 }, { name: 'Q2', value: 300 }, { name: 'Q3', value: 600 }]
      });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      system: 'You are an expert Data Analyst. Analyze the short summary/data. Return ONLY valid JSON: insights (array of strings), anomalies (array of strings), chartData (array of objects with "name" and "value" properties).',
      messages: [{ role: 'user', content: `Analyze this data: ${data}` }]
    });

    const content = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
    return Response.json(JSON.parse(content));
  } catch {
    return Response.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
