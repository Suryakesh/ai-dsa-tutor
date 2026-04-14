"use client";

import { useState, useRef, useEffect } from "react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { AnimatedGlowingSearchBar } from "@/components/ui/animated-glowing-search-bar";
import { ChatMessage } from "@/components/ui/chat-message";
import { sendChatMessage, type ChatMessage as ChatMessageType } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    setIsTyping(true);
    
    // Add User message
    const userMsg: ChatMessageType = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    
    try {
      const responseText = await sendChatMessage(text, messages);
      
      // Add Model Response
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: responseText
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: `**Error:** ${err.message || "Something went wrong. Please check API key setup."}`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const isChatStarted = messages.length > 0;

  return (
    <main className="relative h-screen h-[100dvh] flex flex-col text-white font-sans overflow-hidden">
      <DottedSurface />

      {/* Top Left Banner */}
      <header className="absolute top-0 left-0 p-6 z-20 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg md:text-xl font-bold tracking-tight text-white/90 flex items-center gap-2 pointer-events-auto"
        >
          <span className="text-violet-400">DSA</span> Tutor 🚀
        </motion.div>
      </header>

      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full relative z-10 h-full">
        <AnimatePresence mode="wait">
          {!isChatStarted ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col items-center justify-center px-4"
            >
              <VerticalCutReveal words={["Master Algorithms 🧠", "Crack Coding Interviews", "Learn Step-by-Step"]} />
              <div className="w-full mt-12 mb-4">
                <AnimatedGlowingSearchBar onSubmit={handleSendMessage} disabled={isTyping} />
              </div>

              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.8, duration: 0.5 }}
                 className="flex flex-wrap justify-start gap-3 mt-4 w-full max-w-2xl mx-auto"
              >
                  {[
                    { text: "Explain Binary Search", icon: "🔍" },
                    { text: "Help me with Two Sum", icon: "🎯" },
                    { text: "What is Dynamic Programming?", icon: "🧠" },
                    { text: "Explain Graph Traversal", icon: "🕸️" }
                  ].map((prompt, idx) => (
                      <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt.text)}
                          disabled={isTyping}
                          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-violet-500/50 text-sm md:text-base text-slate-300 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group backdrop-blur-sm"
                      >
                         <span className="text-lg group-hover:scale-110 transition-transform duration-300">{prompt.icon}</span>
                         <span className="font-medium">{prompt.text}</span>
                      </button>
                  ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col w-full h-full"
            >
              {/* Chat View */}
              <div 
                className="flex-1 overflow-y-auto hide-scrollbar pt-12 pb-6 px-4 md:px-8"
                ref={scrollRef}
              >
                <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
                  {messages.map((msg) => (
                    <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                  ))}
                  {isTyping && <ChatMessage role="model" content="" isTyping={true} />}
                </div>
              </div>
              
              <div className="w-full pb-8 pt-6 px-4 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent shrink-0">
                 <div className="max-w-3xl mx-auto">
                   <AnimatedGlowingSearchBar onSubmit={handleSendMessage} disabled={isTyping} />
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
