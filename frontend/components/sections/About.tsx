"use client";

import { motion } from "framer-motion";

export default function About() {
  const stats = [
    { label: "Projects Built", value: "12+" },
    { label: "Technologies", value: "25+" },
    { label: "Research Papers Read", value: "50+" },
  ];

  const skills = [
    "Python", "TensorFlow", "PyTorch", "Next.js", "FastAPI", 
    "PostgreSQL", "React", "Docker", "AWS", "NLP"
  ];

  return (
    <section className="relative min-h-screen py-24 flex items-center justify-center bg-background overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 w-full max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">About Me</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="glass-card p-8 text-center"
            >
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.4 }}
           className="max-w-3xl mx-auto text-center mb-16 text-lg text-gray-300 leading-relaxed"
        >
          I&apos;m a Data Science student passionate about translating complex AI/ML concepts into scalable, intuitive products. My focus lies at the intersection of Generative AI, data engineering, and modern web development, allowing me to build end-to-end intelligent systems.
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {skills.map((skill) => (
            <motion.span
              key={skill}
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(124, 58, 237, 0.5)" }}
              className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium transition-shadow cursor-default"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
