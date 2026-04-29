"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, User, Bot, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "What is Gowri's experience with Generative AI?",
  "Tell me about the AI Recommendation System project.",
  "Which tech stack was used to build this portfolio?",
  "How can I contact Gowri?"
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm GowriLekshmi's AI assistant. I know all about her projects, skills, and data science journey. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages })
      });
      
      if (!res.body) throw new Error("No response body");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let currentAssistantMessage = "";
      
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        currentAssistantMessage += chunkValue;
        
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = currentAssistantMessage;
          return updated;
        });
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: " + errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen py-24 flex items-center justify-center bg-background overflow-hidden" id="chatbot">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10 w-full max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-primary" size={32} />
            <h2 className="text-4xl md:text-5xl font-heading font-bold">Chat with My AI</h2>
          </div>
          <p className="text-gray-400">Powered by Claude 3.5 Sonnet. Ask anything about my skills or experience.</p>
        </motion.div>

        <div className="glass-card flex flex-col h-[600px] border border-white/10 overflow-hidden relative shadow-[0_0_30px_rgba(124,58,237,0.15)] bg-black/40 backdrop-blur-xl">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/50 [&::-webkit-scrollbar-thumb]:rounded-full">
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-accent text-white" : "bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_rgba(124,58,237,0.5)]"}`}>
                  {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-accent/20 border border-accent/20 rounded-tr-none text-white" : "bg-white/5 border border-white/10 rounded-tl-none text-gray-200 whitespace-pre-wrap"}`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {loading && !messages[messages.length - 1]?.content && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex gap-4 max-w-[85%] mr-auto"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary border border-primary/50 flex flex-shrink-0 items-center justify-center shadow-[0_0_10px_rgba(124,58,237,0.5)]">
                  <Bot size={20} />
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-none flex gap-1 items-center">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-black/60 border-t border-white/10">
            {/* Suggested Chips */}
            <div className="flex overflow-x-auto gap-2 mb-4 pb-2 [&::-webkit-scrollbar]:hidden">
              {suggestedQuestions.map((q, i) => (
                <button 
                  key={i}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="whitespace-nowrap px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-gray-300 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} 
              className="flex gap-3 items-center bg-black/40 border border-white/10 rounded-full p-2 pl-6 focus-within:border-primary/50 transition-colors"
            >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask my AI anything..." 
                className="flex-1 bg-transparent outline-none text-sm text-white"
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary/80 flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
