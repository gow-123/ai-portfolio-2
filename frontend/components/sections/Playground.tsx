"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Compass, PenTool, BarChart3, Loader2, AlertCircle, ArrowRight } from "lucide-react";

const tabs = [
  { id: "resume", label: "Resume Analyzer", icon: FileText },
  { id: "recommend", label: "Recommendation Engine", icon: Compass },
  { id: "generate", label: "Text Generator", icon: PenTool },
  { id: "insights", label: "Data Insights", icon: BarChart3 },
];

export default function Playground() {
  const [activeTab, setActiveTab] = useState("resume");

  return (
    <section className="relative min-h-screen py-24 bg-background overflow-hidden" id="playground">
      <div className="container mx-auto px-4 relative z-10 w-full max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">AI Playground</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Interact with live AI models powered by Claude 3.5 Sonnet. Choose a tool below to see Generative AI in action.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-1/4 flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full text-left px-5 py-4 rounded-xl transition-all ${
                    isActive ? "bg-primary/20 text-primary border border-primary/50 shadow-[0_0_15px_rgba(124,58,237,0.3)]" : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Icon size={20} className={isActive ? "text-primary" : "text-gray-400"} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4 glass-card p-6 md:p-8 min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                {activeTab === "resume" && <ResumeAnalyzer />}
                {activeTab === "recommend" && <RecommendationEngine />}
                {activeTab === "generate" && <TextGenerator />}
                {activeTab === "insights" && <DataInsights />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// =======================
// SUBCOMPONENTS
// =======================

function ResumeAnalyzer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    if (!text.trim()) return setError("Please enter some resume text.");
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/playground/resume", {
        method: "POST", body: JSON.stringify({ resumeText: text })
      });
      if (!res.ok) throw new Error("Failed to analyze");
      setResult(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Resume Analyzer</h3>
        <p className="text-gray-400 text-sm">Paste your resume layout or text to get an AI ATS score and suggestions.</p>
      </div>
      <textarea 
        className="w-full h-40 bg-black/50 border border-white/10 rounded-lg p-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
        placeholder="Paste your resume content here..."
        value={text} onChange={(e) => setText(e.target.value)}
      />
      <button onClick={analyze} disabled={loading} className="neon-border bg-white/10 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-colors w-full md:w-auto self-start">
        {loading ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />} Analyze Resume
      </button>

      {error && <div className="text-red-400 flex items-center gap-2 mt-4"><AlertCircle size={16}/> {error}</div>}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 rounded-xl border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center text-xl font-bold text-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]">
               {result.score}
            </div>
            <div>
              <h4 className="text-lg font-bold">ATS Match Score</h4>
              <p className="text-gray-400 text-sm">Based on standard technical roles.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-accent mb-2">Skill Gaps</h5>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                {result.skillGaps.map((g: string, i: number) => <li key={i}>{g}</li>)}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-accent mb-2">Improvement Suggestions</h5>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                {result.suggestions.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function RecommendationEngine() {
  const [val, setVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  const getRecs = async () => {
    if (!val.trim()) return setError("Please enter some interests.");
    setLoading(true); setError(""); setResult(null);
    try {
      const interests = val.split(",").map(i => i.trim());
      const res = await fetch("/api/playground/recommend", {
        method: "POST", body: JSON.stringify({ interests })
      });
      if (!res.ok) throw new Error("Failed to fetch recommendation");
      setResult(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Recommendation Engine</h3>
        <p className="text-gray-400 text-sm">Enter technical interests separated by commas to get a curated learning path.</p>
      </div>
      <input 
        type="text"
        className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        placeholder="e.g. LLMs, Vector Databases, Next.js"
        value={val} onChange={(e) => setVal(e.target.value)}
      />
      <button onClick={getRecs} disabled={loading} className="neon-border bg-white/10 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-colors self-start w-full md:w-auto">
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Compass size={18} />} Get Path
      </button>

      {error && <div className="text-red-400 flex items-center gap-2 mt-4"><AlertCircle size={16}/> {error}</div>}

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-6 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] -z-10 rounded-full" />
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Recommended Path</h4>
            <span className="text-xs font-bold bg-accent/20 text-accent px-3 py-1 rounded-full">{result.matchPercentage}% Match</span>
          </div>
          <p className="text-gray-300 mb-6 leading-relaxed">{result.recommendation}</p>
          <div className="space-y-2">
            <h5 className="text-sm font-semibold text-gray-400">Target Resources:</h5>
            {result.resources.map((r: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-200 bg-black/30 p-3 rounded-lg border border-white/5 hover:border-primary/50 transition-colors">
                <ArrowRight size={14} className="text-primary" /> {r}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function TextGenerator() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Technical");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setOutput("");
    try {
      const res = await fetch("/api/playground/generate", {
        method: "POST", body: JSON.stringify({ prompt, tone })
      });
      if (!res.body) throw new Error("No body returned");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        setOutput((prev) => prev + chunkValue);
      }
    } catch (e) {
      setOutput("Error generating text: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Streaming Text Generator</h3>
        <p className="text-gray-400 text-sm">Give a topic and tone, and watch the AI stream the response naturally.</p>
      </div>
      <div className="flex gap-4 items-center">
        <input 
          type="text" className="flex-1 bg-black/50 border border-white/10 rounded-lg p-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          placeholder="Topic (e.g. Transformers architecture)"
          value={prompt} onChange={(e) => setPrompt(e.target.value)}
        />
        <select 
          className="bg-black/50 border border-white/10 rounded-lg p-4 text-sm focus:border-primary focus:outline-none text-white w-32"
          value={tone} onChange={(e) => setTone(e.target.value)}
        >
          <option value="Technical">Technical</option>
          <option value="Creative">Creative</option>
          <option value="Academic">Academic</option>
        </select>
      </div>
      <button onClick={generate} disabled={loading} className="neon-border bg-white/10 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-colors self-start w-full md:w-auto">
        {loading && !output ? <Loader2 className="animate-spin" size={18} /> : <PenTool size={18} />} Generate Stream
      </button>

      {output && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex-1">
          <div className="w-full h-full min-h-[150px] bg-black/30 border border-white/10 rounded-lg p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap relative">
             {output}
             {loading && <motion.span animate={{ opacity: [1,0] }} transition={{ repeat: Infinity }} className="inline-block w-2 h-4 bg-primary ml-1 align-middle" />}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function DataInsights() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  const getInsights = async () => {
    if (!data.trim()) return;
    setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/playground/insights", {
        method: "POST", body: JSON.stringify({ data })
      });
      setResult(await res.json());
    } catch {
      // hide error for simplicity
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Data Insights Generator</h3>
        <p className="text-gray-400 text-sm">Paste CSV or describe a dataset to extract anomalies and insights.</p>
      </div>
      <textarea 
        className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
        placeholder="Dataset summary or CSV snippet..."
        value={data} onChange={(e) => setData(e.target.value)}
      />
      <button onClick={getInsights} disabled={loading} className="neon-border bg-white/10 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-colors self-start w-full md:w-auto">
        {loading ? <Loader2 className="animate-spin" size={18} /> : <BarChart3 size={18} />} Extract Insights
      </button>

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[50px] -z-10 rounded-full" />
            <h5 className="font-semibold text-accent mb-3 flex items-center gap-2"><ArrowRight size={14}/> Key Insights</h5>
            <ul className="space-y-2">
              {result.insights.map((ins: string, i: number) => (
                <li key={i} className="text-sm text-gray-300 p-2 bg-black/40 rounded border border-white/5">{ins}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] -z-10 rounded-full" />
            <h5 className="font-semibold text-red-400 mb-3 flex items-center gap-2"><AlertCircle size={14}/> Found Anomalies</h5>
            <ul className="space-y-2">
              {result.anomalies.map((ano: string, i: number) => (
                <li key={i} className="text-sm text-red-200/80 p-2 bg-red-900/20 rounded border border-red-500/20">{ano}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
