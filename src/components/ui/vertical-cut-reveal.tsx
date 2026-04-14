"use client";

import { motion } from "framer-motion";

export function VerticalCutReveal({ 
  words, 
  delayStart = 0 
}: { 
  words: string[]; 
  delayStart?: number 
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {words.map((word, idx) => (
        <div key={idx} className="overflow-hidden py-1">
          <motion.div
            initial={{ y: "120%", opacity: 0, rotateZ: 3 }}
            animate={{ y: "0%", opacity: 1, rotateZ: 0 }}
            transition={{
              duration: 0.8,
              delay: delayStart + idx * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`font-black tracking-tight text-3xl md:text-5xl text-center ${
              idx === 0 ? "neon-text pb-2" : "text-slate-100"
            }`}
          >
            {word}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
