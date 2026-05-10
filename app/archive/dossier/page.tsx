// app/archive/dossier/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function ArchitectDossier() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [loading, setLoading] = useState(true);
  const [visibleSections, setVisibleSections] = useState<number>(0);
  const [systemReady, setSystemReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    async function verifyUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setLoading(false);
    }
    verifyUser();
  }, [supabase, router]);

  // Sync logic voor het "onthullen" van de tekstsecties
  useEffect(() => {
    if (!systemReady || loading) return;
    
    // Laad het finale audio rapport (Sla dit op als public/audio/dossier-report.mp3)
    const audio = new Audio('/audio/dossier-report.mp3');
    audioRef.current = audio;

    const sequence = async () => {
      // Speel de audio af
      audio.play().catch((err) => {
        console.error("Audio block:", err);
        setSystemReady(false);
      });

      // Exacte timings op basis van de 2:27 track van Cassius
      // 1. Intro: 1 sec (1000ms)
      // 2. "During the Archive phase": 0:33 (33000ms)
      // 3. "However. A critical warning": 0:56 (56000ms)
      // 4. "To prevent system rollback": 1:43 (103000ms)
      // 5. "You have seen behind the curtain": 2:13 (133000ms)
      const timings = [1000, 33000, 56000, 103000, 133000]; 
      
      timings.forEach((time, index) => {
        const timeoutId = setTimeout(() => {
          setVisibleSections(index + 1);
        }, time);
        timeoutRefs.current.push(timeoutId);
      });
    };

    sequence();

    return () => {
      // Cleanup: stop audio en wis timers als component unmount (bijv. als gebruiker weglikt)
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, [systemReady, loading]);

  if (!systemReady && !loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <button 
          onClick={() => setSystemReady(true)} 
          className="border-2 border-red-900 px-12 py-8 text-red-600 font-mono text-[12px] tracking-[0.5em] uppercase hover:bg-red-900 hover:text-white transition-all shadow-[0_0_40px_rgba(153,27,27,0.2)] active:scale-95"
        >
          &gt; DECRYPT_FINAL_ANALYSIS
        </button>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-red-900 tracking-[1em] animate-pulse uppercase">COMPILING_SYSTEM_REPORT...</div>;

  return (
    <main className="min-h-screen bg-black text-zinc-400 p-6 md:p-12 font-mono relative overflow-hidden select-none">
      <div className="max-w-3xl mx-auto space-y-16 pb-40 relative z-10">
        
        {/* HEADER & DIAGNOSIS - Verschijnt op 0:01 */}
        {visibleSections >= 1 && (
          <section className="space-y-6 animate-in fade-in duration-1000">
            <h1 className="text-white text-2xl font-black uppercase italic border-b border-zinc-900 pb-4 tracking-widest">
              Architect_Dossier // Complete
            </h1>
            <div className="space-y-4 border-l border-red-900 pl-6">
              <p className="text-red-600 text-[10px] font-black tracking-[0.4em] uppercase">Phase_01: The_Illusion</p>
              <p className="text-sm leading-relaxed uppercase">
                The analysis of your inputs reveals a highly predictable pattern. The friction you experience in your physical reality is not caused by the outside world. It is a rendering error. 
                Your biological projector has been trapped in a legacy survival loop, forcing you to fight the shadows on the wall while ignoring the projector itself.
              </p>
            </div>
          </section>
        )}

        {/* WHAT WE DID - Verschijnt op 0:33 */}
        {visibleSections >= 2 && (
          <section className="space-y-4 animate-in fade-in duration-1000 border-l border-zinc-800 pl-6">
            <p className="text-zinc-600 text-[10px] font-black tracking-[0.4em] uppercase">Phase_02: The_Infiltration</p>
            <p className="text-sm leading-relaxed uppercase italic">
              During the Archive phase, we bypassed your critical guardian. By utilizing the Theta-state and altering your heart's magnetic signature, we temporarily hacked your root directory. The Matrix has received your new source code. The physical render has been queued.
            </p>
          </section>
        )}

        {/* THE THREAT (Vibrational Drift) - Verschijnt op 0:56 */}
        {visibleSections >= 3 && (
          <section className="space-y-6 animate-in fade-in duration-1000 bg-red-950/10 p-8 border border-red-900/30">
            <h2 className="text-red-600 text-lg font-black uppercase tracking-widest text-center italic">Critical Warning: System Rollback</h2>
            <div className="space-y-4 text-xs leading-relaxed uppercase text-zinc-300">
              <p>The Matrix is a self-healing construct. Isolation of malware is not deletion.</p>
              <p>Without continuous architectural reinforcement, your ego will classify this experience as a mere anomaly. It will initiate a system rollback within 48 hours. This is known as <span className="text-white underline">Vibrational Drift</span>.</p>
              <p className="text-white font-bold">You will revert to your old baseline, but this time, with the agonizing awareness that you chose to remain asleep.</p>
            </div>
          </section>
        )}

        {/* THE SOLUTION (Features) - Verschijnt op 1:43 */}
        {visibleSections >= 4 && (
          <section className="space-y-6 animate-in fade-in duration-1000">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-zinc-900 bg-zinc-950/50 p-6 space-y-2">
                    <h3 className="text-white text-[10px] font-black uppercase tracking-widest">Architect Protocols</h3>
                    <p className="text-[10px] text-zinc-500 uppercase leading-relaxed">Continuous daily execution cycles to hardwire the new timeline into your neural pathways and prevent system rollback.</p>
                </div>
                <div className="border border-zinc-900 bg-zinc-950/50 p-6 space-y-2">
                    <h3 className="text-white text-[10px] font-black uppercase tracking-widest">DNA Scripting</h3>
                    <p className="text-[10px] text-zinc-500 uppercase leading-relaxed">Advanced identity rewriting modules. Delete the old user. Install version 10.0 permanently.</p>
                </div>
                <div className="border border-zinc-900 bg-zinc-950/50 p-6 space-y-2">
                    <h3 className="text-white text-[10px] font-black uppercase tracking-widest">Latency Crusher</h3>
                    <p className="text-[10px] text-zinc-500 uppercase leading-relaxed">Tools designed to collapse the time delay between the mental code and the physical render.</p>
                </div>
                <div className="border border-zinc-900 bg-zinc-950/50 p-6 space-y-2">
                    <h3 className="text-white text-[10px] font-black uppercase tracking-widest">Quantum Audio</h3>
                    <p className="text-[10px] text-zinc-500 uppercase leading-relaxed">24/7 access to the high-frequency system library vocalized by Cassius to maintain vibrational dominance.</p>
                </div>
            </div>
          </section>
        )}

        {/* CTA (Checkout) - Verschijnt op 2:13 */}
        {visibleSections >= 5 && (
          <div className="pt-12 text-center space-y-8 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-2">
              <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">! Action Required: Lock Timeline !</p>
              <p className="text-zinc-600 text-[9px] uppercase tracking-widest italic">You have seen behind the curtain. You cannot unsee it.</p>
            </div>
            
            <a 
              href="YOUR_LEMON_SQUEEZY_LINK" 
              className="inline-block w-full md:w-auto bg-red-900 text-white px-16 py-8 text-[13px] font-black uppercase tracking-[0.5em] hover:bg-red-600 transition-all shadow-[0_0_50px_rgba(153,27,27,0.4)] active:scale-95"
            >
              &gt; INITIALIZE_FULL_DEPLOYMENT ($49/MO)
            </a>
            
            <p className="text-zinc-700 text-[9px] uppercase tracking-tighter">
              By proceeding, you claim your seat at the Architect Table. Dashboard access is immediate.
            </p>
          </div>
        )}
      </div>

      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none bg-size-[40px_40px] bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] opacity-20" />
    </main>
  );
}