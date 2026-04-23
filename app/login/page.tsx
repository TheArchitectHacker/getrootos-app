"use client";

import React, { useState } from 'react';

export default function RealityOSLogin() {
  const [email, setEmail] = useState("");
  const [passkey, setPasskey] = useState("");
  const [status, setStatus] = useState("AWAITING_CREDENTIALS");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("VERIFYING_ENCRYPTION...");
    
    // TIJDELIJKE LOGIC - we koppelen dit later aan Supabase
    setTimeout(() => {
      setStatus("ERROR: INVALID_CREDENTIALS_OR_KEY_NOT_ACTIVATED");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono p-6">
      <div className="max-w-md w-full border border-red-600 p-10 bg-zinc-950 shadow-[0_0_50px_rgba(220,38,38,0.1)] relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black px-4 text-red-600 text-[10px] uppercase font-black tracking-widest border border-red-600">
          RealityOS_Gatekeeper
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Initialize_Session</h2>
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest italic">{status}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] text-zinc-500 uppercase mb-2 block tracking-widest">Ident_Email</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-zinc-900 p-4 text-white focus:border-red-600 outline-none transition-all placeholder:text-zinc-800"
              placeholder="architect@network.com"
            />
          </div>

          <div>
            <label className="text-[10px] text-zinc-500 uppercase mb-2 block tracking-widest">Access_Key</label>
            <input 
              type="password"
              required
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="w-full bg-black border border-zinc-900 p-4 text-red-600 focus:border-red-600 outline-none transition-all placeholder:text-zinc-800"
              placeholder="ARCH-XXXX-XXXX"
            />
          </div>

          <button className="w-full bg-red-600 text-black py-4 font-black uppercase tracking-[0.3em] hover:bg-white transition-all duration-300">
            [ BYPASS_FIREWALL ]
          </button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-900 pt-6">
          <p className="text-[9px] text-zinc-600 uppercase tracking-widest leading-relaxed">
            New Architects must acquire a valid payload and key through official channels only.
          </p>
        </div>
      </div>
    </div>
  );
}