// app/components/RootInput.tsx
"use client";
import { useState } from "react";

export const RootInput = () => {
  const [cmd, setCmd] = useState("");
  const [response, setResponse] = useState("");

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (cmd === "whoami") setResponse("You are an Architect, but you are currently asleep. Wake up.");
    else if (cmd === "exit_matrix") setResponse("Access denied. You must build your way out.");
    else setResponse("Unknown command. Type 'help' for available nodes.");
    setCmd("");
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/80 border-t border-zinc-900 p-2 font-mono text-[10px] z-40">
      <form onSubmit={handleCommand} className="flex gap-2">
        <span className="text-red-600">root@os:~#</span>
        <input 
          value={cmd} 
          onChange={(e) => setCmd(e.target.value)}
          className="bg-transparent border-none outline-none text-zinc-400 w-full uppercase"
          autoFocus
        />
      </form>
      {response && <p className="text-zinc-600 mt-1 italic animate-pulse">{response}</p>}
    </div>
  );
};