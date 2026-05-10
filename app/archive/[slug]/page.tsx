"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useParams, useRouter } from "next/navigation";

export default function ArchiveNode() {
  const { slug } = useParams();
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [chapter, setChapter] = useState<any>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [input, setInput] = useState("");
  const [isInjectingFounder, setIsInjectingFounder] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [systemReady, setSystemReady] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // SECURITY: Voorkom kopiëren en rechtermuisklik
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("copy", preventDefault);
    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("copy", preventDefault);
    };
  }, []);

  const loadNode = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const [chaptersReq, logsReq] = await Promise.all([
      supabase.from("chapters").select("*").order("order_index", { ascending: true }),
      supabase.from("user_logs").select("chapter_slug").eq("user_id", user.id)
    ]);

    const allChapters = chaptersReq.data || [];
    const completedSlugs = logsReq.data?.map(l => l.chapter_slug) || [];
    const currentChapter = allChapters.find(c => c.slug === slug);

    if (!currentChapter) { setLoading(false); return; }

    const currentIndex = currentChapter.order_index;
    if (currentIndex > 0) {
      const prev = allChapters.find(c => c.order_index === currentIndex - 1);
      if (prev && !completedSlugs.includes(prev.slug)) {
        router.push(`/archive/${prev.slug}`);
        return;
      }
    }

    const { data: fullLogs } = await supabase.from("user_logs").select("variable_key, variable_value").eq("user_id", user.id);
    let content = currentChapter.content;
    fullLogs?.forEach((log) => {
      if (log.variable_value) {
        content = content.replaceAll(`{{${log.variable_key}}}`, log.variable_value);
      }
    });

    setChapter({ ...currentChapter, content });
    setDisplayedText(""); 
    setIsTypingComplete(false);
    setLoading(false);
  }, [slug, supabase, router]);

  useEffect(() => { loadNode(); }, [loadNode]);

  useEffect(() => {
    if (!chapter || loading || !systemReady || isInjectingFounder) return;

    const audio = new Audio(`/audio/${slug}.mp3`);
    audioRef.current = audio;

    const startSequence = () => {
      audio.onloadedmetadata = () => {
        const audioDurationMs = audio.duration * 1000;
        const totalChars = chapter.content.length;
        const safetyBuffer = 3000; 
        const typingSpeed = Math.max((audioDurationMs - safetyBuffer) / totalChars, 30);

        let index = 0;
        const fullText = chapter.content;
        
        typingIntervalRef.current = setInterval(() => {
          setDisplayedText(fullText.slice(0, index + 1));
          index++;
          if (index >= fullText.length) {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
            setIsTypingComplete(true);
          }
        }, typingSpeed);

        audio.play().catch(() => setIsTypingComplete(true));
      };
      audio.onerror = () => setIsTypingComplete(true);
    };

    startSequence();

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [chapter, loading, slug, isInjectingFounder, systemReady]);

  const proceedToNext = async () => {
    if (isNavigating) return;
    setIsNavigating(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("user_logs").upsert({
      user_id: user.id,
      chapter_slug: slug,
      variable_key: chapter?.interactive_elements?.command || 'status',
      variable_value: input || "ACCEPTED"
    });

    if (slug === '07-1-integration') {
      router.push('/archive/dossier');
    } else if (slug === '09-1-final-activation') {
      router.push('/deploy');
    } else {
      const { data: next } = await supabase.from("chapters")
        .select("slug")
        .gt("order_index", chapter.order_index)
        .order("order_index", { ascending: true })
        .limit(1)
        .single();
        
      if (next) {
        setChapter(null);
        setIsInjectingFounder(false);
        setDisplayedText("");
        setInput("");
        setIsTypingComplete(false);
        router.push(`/archive/${next.slug}`);
        setTimeout(() => setIsNavigating(false), 800);
      } else {
        router.push('/dashboard');
      }
    }
  };

  const handleExecute = async () => {
    setError("");
    const interaction = chapter?.interactive_elements;
    if (!interaction) { await proceedToNext(); return; }
    
    const cleanInput = input.trim().toUpperCase();

    if (interaction.type === "required_input") {
      const expected = interaction.expected_response.toUpperCase();
      if (cleanInput !== expected && cleanInput !== expected.replaceAll("_", " ")) {
        setError(`> ERROR: INVALID_COMMAND.`);
        return;
      }
      if (slug === "00-compliance") {
        setIsInjectingFounder(true);
        return;
      }
    }

    if (interaction.type === "data_collection" && input.trim().length < 2) {
      setError("> ERROR: DATA_STREAM_TOO_WEAK.");
      return;
    }

    await proceedToNext();
  };

  if (!systemReady && !loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <button onClick={() => setSystemReady(true)} className="border-2 border-red-900 px-12 py-8 text-red-600 font-mono text-[11px] tracking-[0.5em] uppercase hover:bg-red-900 hover:text-white transition-all shadow-[0_0_30px_rgba(153,27,27,0.2)]">
          &gt; INITIALIZE_SYSTEM_INTERFACE
        </button>
      </div>
    );
  }

  if (loading && !isInjectingFounder) {
    return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-red-900 uppercase tracking-[0.5em] animate-pulse">Accessing_Archive...</div>;
  }

  return (
    <main className="min-h-screen bg-black text-zinc-400 p-6 md:p-12 font-mono relative overflow-hidden select-none">
      <div className="max-w-3xl mx-auto pt-20 pb-40 relative z-10">
        {isInjectingFounder ? (
          <div className="border-2 border-red-900 bg-red-950/10 p-10 space-y-8 animate-in zoom-in-95 duration-700 shadow-[0_0_50px_rgba(153,27,27,0.2)]">
             <div className="space-y-2">
                <p className="text-red-600 font-black text-[10px] tracking-[0.5em] animate-pulse uppercase">&gt; STATUS: IDENTITY_VERIFIED</p>
                <h2 className="text-white text-3xl font-black uppercase tracking-tighter italic">Founder_Node_Detected</h2>
             </div>
             <div className="space-y-6 text-zinc-300 text-sm uppercase leading-relaxed tracking-widest font-bold border-y border-red-900/30 py-8">
                <p>You have obtained access to the <span className="text-red-600 underline">INITIAL_BOOT_PHASE</span> of RootOS.</p>
                <p>By proceeding, you claim one of the few remaining slots. Your identity will be permanently flagged as <span className="text-white bg-red-900 px-2 ml-1">FOUNDER</span>.</p>
             </div>
             <button onClick={proceedToNext} className="w-full bg-red-900 text-white py-6 text-[11px] font-black uppercase tracking-[0.6em] hover:bg-red-700 transition-all">
               C O N F I R M _ S T A T U S
             </button>
          </div>
        ) : (
          <div className="space-y-12">
            <header className="flex items-center gap-6">
              <div className="h-px w-16 bg-red-900"></div>
              <h1 className="text-red-700 text-[10px] uppercase tracking-[0.6em] font-black italic">{chapter?.title}</h1>
            </header>
            <div className="border-l border-zinc-900 pl-8 py-2">
              <div className="text-zinc-200 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-medium uppercase tracking-wide">
                {displayedText}
                {!isTypingComplete && <span className="inline-block w-2 h-5 bg-red-600 animate-pulse ml-2"></span>}
              </div>
              {isTypingComplete && (
                <div className="mt-12 space-y-8 animate-in fade-in duration-1000">
                  <div className="space-y-4">
                    <p className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.4em] italic">{chapter?.interactive_elements?.prompt}</p>
                    <textarea 
                      className="w-full bg-transparent border-none p-0 text-white uppercase text-base md:text-lg focus:ring-0 outline-none transition-all font-mono resize-none placeholder:text-zinc-800 tracking-wide"
                      rows={3}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="> Awaiting_Architect_Response..."
                      autoFocus
                    />
                  </div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <button onClick={handleExecute} className="bg-red-950/20 text-red-500 border border-red-900 px-12 py-5 text-[11px] font-black hover:bg-red-900 hover:text-white transition-all uppercase tracking-[0.5em]">
                      Execute_Command
                    </button>
                    {error && <p className="text-red-600 text-[10px] font-black animate-pulse tracking-widest uppercase italic">{error}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="fixed inset-0 pointer-events-none bg-size-[40px_40px] bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] opacity-20" />
    </main>
  );
}