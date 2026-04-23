// app/components/BiosBoot.tsx
"use client";
import { useState, useEffect } from "react";

const BOOT_LOGS = [
  "INITIALIZING_SYSTEM_KERNEL...",
  "MOUNTING_NEURAL_PATHWAYS... [OK]",
  "DECRYPTING_ARCHITECT_IDENTITY... [OK]",
  "ESTABLISHING_SECURE_NODE_CONNECTION... [OK]",
  "BYPASSING_SOCIAL_MALWARE_FIREWALLS... [DONE]",
  "SYSTEM_READY_FOR_RESTRUCTURING."
];

export const BiosBoot = ({ onComplete }: { onComplete: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev, BOOT_LOGS[i]]);
      i++;
      if (i >= BOOT_LOGS.length) {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[100] p-10 font-mono text-green-500 flex flex-col justify-end">
      <div className="space-y-2">
        {logs.map((log, index) => (
          <p key={index} className="text-sm tracking-widest">
            {index === logs.length - 1 ? "> " : "  "} {log}
          </p>
        ))}
        <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-2" />
      </div>
    </div>
  );
};