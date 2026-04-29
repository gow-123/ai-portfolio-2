import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Playground from "@/components/sections/Playground";
import Chatbot from "@/components/sections/Chatbot";

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <About />
      <Playground />
      <Chatbot />
    </main>
  );
}
