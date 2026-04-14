"use client";

import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";

export function AnimatedGlowingSearchBar({
  onSubmit,
  disabled
}: {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [val, setVal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (val.trim() && !disabled) {
      onSubmit(val);
      setVal("");
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
      className="relative w-full max-w-2xl mx-auto"
    >
      {/* Outer focus glow */}
      <motion.div 
        className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl blur-lg transition duration-500 pointer-events-none"
        animate={{ opacity: isFocused ? 0.6 : 0.1 }}
      />
      
      {/* Search Input Container */}
      <div className="relative flex items-center bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-2 transition-all">
        <Search className="text-slate-400 ml-4 w-6 h-6" />
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder="Ask any DSA question..."
          className="w-full bg-transparent border-none outline-none text-slate-100 text-lg px-4 py-3 placeholder:text-slate-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!val.trim() || disabled}
          className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 text-white p-3 rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:shadow-none"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.form>
  );
}
