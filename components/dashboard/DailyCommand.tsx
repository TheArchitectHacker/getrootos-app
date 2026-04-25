// components/dashboard/DailyCommand.tsx
"use client";
import { useState } from "react";

export default function DailyCommand() {
  const [malware, setMalware] = useState("");
  const [purged, setPurged] = useState(false);

  const handlePurge = () => {
    if (malware.length < 5) return;
    setPurged(true);
    // Na 2 seconden animatie, stuur naar database en reset
    setTimeout(() => {
      console.log("MALWARE_PURGED:", malware);
      setPurged(false);
      setMalware("");
    }, 2000);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 p-6 font-mono">
      <p className="text-[10px] text-zinc-500 mb-4 tracking-[0.2em] uppercase">
        &gt; SCANNING_FOR_MALWARE...
      </p>
      
      {!purged ? (
        <div className="space-y-4">
          <input 
            value={malware}
            onChange={(e) => setMalware(e.target.value)}
            className="w-full bg-black border-b border-zinc-800 p-2 text-red-600 outline-none uppercase text-xs"
            placeholder="Identify_Daily_Infection..."
          />
          <button 
            onClick={handlePurge}
            className="text-[10px] bg-red-950/20 text-red-500 border border-red-900 px-4 py-2 hover:bg-red-900 hover:text-white transition-all font-black"
          >
            [ PURGE ]
          </button>
        </div>
      ) : (
        <div className="text-red-600 text-xs animate-pulse font-black italic">
          &gt; DELETING_CORRUPT_FILES... SUCCESS.
        </div>
      )}
    </div>
  );
}