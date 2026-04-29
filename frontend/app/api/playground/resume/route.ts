import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resumeText = body.resumeText;

    if (!process.env.ANTHROPIC_API_KEY) {
      // Mock response
      await new Promise(r => setTimeout(r, 1500));
      return Response.json({
        score: 85,
        skillGaps: ["Cloud Deployment (AWS)", "CI/CD Pipelines"],
        suggestions: ["Highlight more MLOps experience", "Quantify the impact of the Recommendation System project"]
      });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      system: 'You are an expert ATS and technical recruiter. Analyze the resume. Respond ONLY with a valid JSON format containing: score (number 0-100), skillGaps (array of strings), suggestions (array of strings).',
      messages: [{ role: 'user', content: `Analyze this resume:\n\n${resumeText}` }]
    });

    const content = msg.content[0].type === 'text' ? msg.content[0].text : '{}';
    return Response.json(JSON.parse(content));
  } catch {
    return Response.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
