// app/archive/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useParams, useRouter } from "next/navigation";

// CONTROLLED SCARCITY METRICS
const NODES_ACTIVE = 87; 
const NODES_TOTAL = 100;

export default function ArchiveNode() {
  const { slug } = useParams();
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [chapter, setChapter] = useState<any>(null);
  const [input, setInput] = useState("");
  const [isInjectingFounder, setIsInjectingFounder] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNode() {
      setLoading(true);
      
      // 1. Haal de node-content op
      const { data: ch } = await supabase
        .from("chapters")
        .select("*")
        .eq("slug", slug)
        .single();

      // 2. Haal de opgeslagen variabelen van de user op (Dynamic Recall)
      const { data: { user } } = await supabase.auth.getUser();
      const { data: logs } = await supabase
        .from("user_logs")
        .select("variable_key, variable_value")
        .eq("user_id", user?.id);

      if (ch) {
        let parsedContent = ch.content;
        
        // Vervang {{variable_key}} door de echte waarde uit de database
        logs?.forEach((log) => {
          if (log.variable_value) {
            parsedContent = parsedContent.replaceAll(`{{${log.variable_key}}}`, log.variable_value);
          }
        });

        setChapter({ ...ch, content: parsedContent });
      }
      setLoading(false);
    }

    if (slug) loadNode();
  }, [slug, supabase]);

  const handleExecute = async () => {
    setError("");

    // Validatie: Architecten nemen geen shortcuts
    if (input.trim().length < 20 && slug !== "00_compliance") {
      setError("> ERROR: INSUFFICIENT_DATA_STRING. MIN_LENGTH: 20_CHARS.");
      return;
    }

    // Specifieke logica voor Protocol 00: De Founder Node Interstitial
    if (slug === "00_compliance" && input.toUpperCase() === "I_ACCEPT_FULL_ACCOUNTABILITY") {
      setIsInjectingFounder(true);
      return; 
    }

    await proceedToNext();
  };

  const proceedToNext = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setError("> ERROR: SESSION_EXPIRED. RE-AUTHENTICATE.");
      return;
    }

    // Log de data naar de database voor later gebruik (The Mirror Effect)
    if (chapter?.interactive_elements?.command) {
      await supabase.from("user_logs").insert({
        user_id: user.id,
        chapter_slug: slug,
        variable_key: chapter.interactive_elements.command,
        variable_value: input
      });
    }

    // Routeer naar de volgende fase
    if (slug === '07_total_override') {
      router.push('/deploy');
    } else {
      const { data: next } = await supabase
        .from("chapters")
        .select("slug")
        .eq("order_index", chapter.order_index + 1)
        .single();
        
      if (next) {
        router.push(`/archive/${next.slug}`);
      } else {
        router.push('/dashboard');
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-red-900 animate-pulse uppercase tracking-[1em]">Loading_Node...</div>;
  if (!chapter) return <div className="min-h-screen bg-black text-white p-10 font-mono italic uppercase text-xs">Node_Not_Found: 404</div>;

  return (
    <main className="min-h-screen bg-black text-zinc-400 p-6 md:p-12 font-mono relative overflow-hidden">
      
      {/* PERSISTENT FOUNDER COUNTER - SCARCITY ILLUSION */}
      <div className="fixed top-8 right-8 flex flex-col items-end z-50 pointer-events-none">
        <div className="flex items-center gap-3 bg-zinc-950/90 border border-red-900/30 p-4 backdrop-blur-md shadow-[0_0_40px_rgba(153,27,27,0.2)]">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_12px_#dc2626]"></span>
          <p className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.4em]">
            NODES_ACTIVE: <span className="text-white font-mono">{NODES_ACTIVE}/{NODES_TOTAL}</span>
          </p>
        </div>
        <p className="text-[9px] text-red-900 font-black uppercase mt-3 tracking-[0.3em] animate-pulse">
          &gt; SYSTEM_CAPACITY_CRITICAL
        </p>
      </div>

      <div className="max-w-3xl mx-auto pt-24 pb-32 relative z-10">
        
        {/* INTERSTITIAL: FOUNDER STATUS INJECTION */}
        {isInjectingFounder ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="border-2 border-red-900 bg-red-950/10 p-10 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <p className="text-6xl font-black italic">SEC_00</p>
              </div>

              <div className="space-y-2">
                <p className="text-red-600 font-black text-xs tracking-[0.5em] animate-pulse uppercase">&gt; SCANNING NODE STATUS...</p>
                <p className="text-red-700 font-black text-xs tracking-[0.5em] uppercase">&gt; STATUS: NEW_RECRUIT</p>
              </div>
              
              <div className="space-y-6 text-zinc-200 text-sm leading-relaxed uppercase tracking-widest font-bold">
                <p>ATTENTION: Je bent gearriveerd tijdens de <span className="text-red-600 underline">INITIAL_BOOT_PHASE</span> van RootOS.</p>
                <p>Er zijn momenteel <span className="text-white border border-white px-2">[{NODES_ACTIVE}/{NODES_TOTAL}]</span> FOUNDER_NODE slots beschikbaar.</p>
                
                <div className="bg-zinc-900/50 p-6 border-l-4 border-red-900">
                  <p className="text-xs text-zinc-400">
                    Architects die het systeem betreden tijdens deze fase krijgen de permanente status <span className="text-red-600 font-black">[ FOUNDER ]</span>. 
                    Dit geeft je in de toekomst voorrang bij systeem-updates, exclusieve toegang tot legacy-files en een levenslange &apos;Locked-In&apos; rate voor de Full Deployment.
                  </p>
                </div>
                
                <p className="text-zinc-500">Zodra slot #100 is gevuld, wordt het systeem gesloten voor publieke toegang.</p>
              </div>

              <div className="pt-6 border-t border-red-900/40">
                <p className="text-red-600 font-black text-[10px] mb-8 tracking-[0.3em] uppercase animate-pulse">STATUS: FOUNDER_STATUS_PENDING...</p>
                <button 
                  onClick={proceedToNext}
                  className="w-full bg-red-900 text-white py-6 text-xs font-black uppercase tracking-[0.6em] hover:bg-red-700 transition-all shadow-[0_0_30px_rgba(153,27,27,0.3)] active:scale-95"
                >
                  Claim_Founder_Slot_&_Continue
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* STANDARD PROTOCOL INTERFACE */
          <div className="space-y-12">
             <header className="flex items-center gap-6">
                <div className="h-px w-16 bg-red-900"></div>
                <h1 className="text-red-700 text-xs uppercase tracking-[0.6em] font-black italic">{chapter.title}</h1>
             </header>

            <div className="text-zinc-200 text-base md:text-lg leading-relaxed mb-16 whitespace-pre-wrap border-l border-zinc-900 pl-10 py-4 font-medium uppercase tracking-wide">
              {chapter.content}
            </div>

            <div className="space-y-8 bg-zinc-950/40 p-10 border border-zinc-900 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-900/50 to-transparent"></div>
              
              <div className="flex justify-between items-center">
                <p className="text-[11px] text-zinc-600 uppercase font-black tracking-[0.4em] italic">{chapter.interactive_elements.prompt}</p>
                <span className="text-[9px] text-red-950 font-black uppercase tracking-tighter">Secure_Line_Active</span>
              </div>

              <textarea 
                className="w-full bg-black border border-zinc-900 p-6 text-white uppercase text-xs focus:border-red-900 outline-none transition-all placeholder:opacity-20 font-mono"
                rows={5}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="&gt; Awaiting_Architect_Input..."
              />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <button 
                  onClick={handleExecute} 
                  className="bg-red-950/20 text-red-500 border border-red-900 px-12 py-5 text-[11px] font-black hover:bg-red-900 hover:text-white transition-all uppercase tracking-[0.5em] active:scale-95 shadow-xl"
                >
                  Execute_Command
                </button>
                {error && (
                  <p className="text-red-600 text-[10px] font-black animate-pulse tracking-widest uppercase italic">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER DECORATION */}
      <footer className="fixed bottom-8 left-8 pointer-events-none opacity-20">
        <p className="text-[9px] font-black uppercase tracking-[1em] text-zinc-800">RootOS_Terminal_v4.0.1</p>
      </footer>
    </main>
  );
}