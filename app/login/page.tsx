// app/login/page.tsx

"use client";
import { useState } from "react";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  // De nieuwe SSR manier om de client in te laden
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("SENDING_MAGIC_LINK...");
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    
    if (error) {
      setMessage(`ERROR: ${error.message}`);
    } else {
      setMessage("CHECK_YOUR_INBOX.");
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center font-mono p-4">
      <Image 
        src="/rootos-logo.png" 
        alt="RootOS" 
        width={80} 
        height={80} 
        className="mb-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-700" 
      />
      <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder="IDENTIFY_EMAIL"
          className="w-full bg-zinc-950 border border-zinc-800 p-4 text-red-600 outline-none focus:border-red-600 uppercase text-xs tracking-widest"
          required
        />
        <button className="w-full bg-zinc-900 text-zinc-400 p-4 text-xs tracking-[0.3em] hover:bg-red-950 hover:text-white transition-all border border-zinc-800">
          EXECUTE_ACCESS
        </button>
      </form>
      {message && (
        <p className="mt-6 text-[10px] text-zinc-500 uppercase tracking-widest animate-pulse">
          {"> "} {message}
        </p>
      )}
    </main>
  );
}