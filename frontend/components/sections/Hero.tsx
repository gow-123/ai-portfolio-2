"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import NeuralNetworkBackground from "./NeuralNetworkBackground";

const subtitles = ["Data Scientist", "AI Engineer", "GenAI Builder"];

export default function Hero() {
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % subtitles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <NeuralNetworkBackground />
      
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.h1 
          className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          I Build <span className="text-primary">Intelligence</span>,<br />
          Not Just Code
        </motion.h1>

        <motion.div 
          className="h-12 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-xl md:text-3xl text-gray-300 font-light">
            {subtitles[subtitleIndex]}
            <motion.span 
              className="inline-block w-[3px] h-6 bg-accent ml-1 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </span>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button className="neon-border bg-white/10 px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-white/20 transition-colors">
            Explore AI Systems <ChevronRight size={18} />
          </button>
          <button className="px-8 py-3 rounded-full font-medium border border-white/20 hover:bg-white/10 transition-colors">
            Chat with My AI
          </button>
        </motion.div>
      </div>
    </section>
  );
}
