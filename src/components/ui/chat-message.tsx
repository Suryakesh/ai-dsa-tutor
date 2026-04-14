"use client";

import { motion } from "framer-motion";
import { User, Copy, Check, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

export function ChatMessage({
  role,
  content,
  isTyping = false,
}: {
  role: "user" | "model";
  content: string;
  isTyping?: boolean;
}) {
  const isUser = role === "user";

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 w-full ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div 
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
          isUser 
            ? "bg-gradient-to-br from-violet-500 to-fuchsia-500" 
            : "bg-gradient-to-br from-blue-500 to-cyan-500"
        }`}
      >
        {isUser ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
      </div>

      {/* Bubble */}
      <div 
        className={`relative flex flex-col gap-2 max-w-[85%] rounded-2xl px-5 py-4 shadow-xl ${
          isUser 
            ? "bg-violet-600/20 text-white border border-violet-500/30 rounded-tr-none" 
            : "bg-slate-800/60 backdrop-blur-md text-slate-100 border border-slate-700/50 rounded-tl-none"
        }`}
      >
        {isTyping ? (
          <div className="flex items-center gap-1.5 h-6">
            <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
            <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
            <motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
          </div>
        ) : (
          <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900/80 prose-pre:border prose-pre:border-slate-700 max-w-none text-sm md:text-base">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  
                  if (!inline && match) {
                    return (
                      <div className="relative group rounded-md overflow-hidden my-4">
                        <div className="flex justify-between items-center bg-slate-800/80 px-4 py-1.5 border-b border-slate-700 text-xs text-slate-400">
                          <span className="uppercase">{match[1]}</span>
                          <button
                            onClick={() => handleCopy(codeString)}
                            className="hover:text-white transition-colors flex items-center gap-1"
                          >
                            {copiedText === codeString ? (
                              <><Check className="w-3 h-3" /> Copied!</>
                            ) : (
                              <><Copy className="w-3 h-3" /> Copy</>
                            )}
                          </button>
                        </div>
                        <pre className="m-0 p-4 overflow-x-auto text-sm bg-slate-950/50">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <code className={`${className} bg-slate-800 rounded px-1.5 py-0.5 text-violet-300 font-mono text-sm`} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}
