// components/BiosBoot.tsx

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const BOOT_LOGS = [
  "INITIALIZING_SYSTEM_KERNEL...",
  "LOADING_NEURAL_PATHWAYS... [OK]",
  "DECRYPTING_ARCHITECT_IDENTITY... [OK]",
  "SCANNING_FOR_COGNITIVE_MALWARE... [CLEAN]",
  "ESTABLISHING_ENCRYPTED_NODE_CONNECTION... [OK]",
  "SYSTEM_READY_FOR_RESTRUCTURING."
];

export const BiosBoot = ({ onComplete }: { onComplete: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LOGS.length) {
        setLogs(prev => [...prev, BOOT_LOGS[i]]);
        i++;
      } else {
        clearInterval(interval);
        // Wacht 1.5 seconden na de laatste log voordat de sequence voltooid is
        setTimeout(onComplete, 1500);
      }
    }, 450); // Snelheid van de regels

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 p-10 font-mono text-emerald-500 flex flex-col justify-end overflow-hidden">
      {/* CENTRAAL PULSEREND LOGO */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0.05, 0.15, 0.05], scale: [0.8, 0.85, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <Image src="/rootos-logo.png" alt="RootOS Background" width={400} height={400} />
      </motion.div>

      {/* TERMINAL LOGS */}
      <div className="space-y-2 relative z-10">
        {logs.map((log, index) => (
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            key={index} 
            className="text-xs md:text-sm tracking-[0.2em] uppercase font-bold"
          >
            <span className="text-emerald-900 mr-4">
              [{new Date().toLocaleTimeString()}]
            </span>
            {index === logs.length - 1 ? "> " : "  "} {log}
          </motion.p>
        ))}
        {/* KNIPPERENDE CURSOR */}
        <motion.span 
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2 h-4 bg-emerald-500 ml-2 align-middle" 
        />
      </div>
    </div>
  );
};