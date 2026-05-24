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

  const [moduleData, setModuleData] = useState<any>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [input, setInput] = useState("");
  const [isInjectingFounder, setIsInjectingFounder] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [systemReady, setSystemReady] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedTypewriter = useRef(false);

  // SECURITY: Prevent copy, cut, paste, and right-click
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("copy", preventDefault);
    document.addEventListener("cut", preventDefault);
    document.addEventListener("paste", preventDefault);
    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("copy", preventDefault);
      document.removeEventListener("cut", preventDefault);
      document.removeEventListener("paste", preventDefault);
    };
  }, []);

  const loadNode = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError("");

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) { router.push("/login"); return; }

      const [modulesReq, progressReq] = await Promise.all([
        supabase.from("archive_modules").select("*").eq("is_active", true).order("order_index", { ascending: true }),
        supabase.from("operator_archive_progress").select("module_id, status").eq("user_id", user.id)
      ]);

      const allModules = modulesReq.data || [];
      const progressList = progressReq.data || [];
      const currentModule = allModules.find(m => m.slug === slug);

      if (!currentModule) { setLoading(false); return; }

      // Check integriteit vorige node
      const currentIndex = currentModule.order_index;
      if (currentIndex > 1) {
        const prevModule = allModules.find(m => m.order_index === currentIndex - 1);
        const prevProgress = progressList.find(p => p.module_id === prevModule?.id);
        if (!prevProgress || prevProgress.status !== "PURGED") {
          if (prevModule) { router.push(`/archive/${prevModule.slug}`); return; }
        }
      }

      const currentProgress = progressList.find(p => p.module_id === currentModule.id);
      if (!currentProgress || currentProgress.status === "LOCKED") {
        await supabase.from("operator_archive_progress").upsert({
          user_id: user.id,
          module_id: currentModule.id,
          status: "UNLOCKED",
          unlocked_at: new Date().toISOString()
        }, { onConflict: "user_id,module_id" });
      }

      setModuleData(currentModule);
    } catch (err) {
      setError("> SYSTEM ERROR: FAILED_TO_STABILIZE_DATA_STREAM.");
    } finally {
      setLoading(false);
    }
  }, [slug, supabase, router]);

  useEffect(() => {
    loadNode();
    return () => { hasStartedTypewriter.current = false; };
  }, [loadNode]);

  // UNBREAKABLE TYPEWRITER ENGINE
  useEffect(() => {
    if (!moduleData || loading || !systemReady || isInjectingFounder || hasStartedTypewriter.current) return;
    
    hasStartedTypewriter.current = true;
    const textToType = moduleData.prompt || "NO_DATA_STREAM_FOUND";
    
    let index = 0;
    setDisplayedText("");
    typingIntervalRef.current = setInterval(() => {
      setDisplayedText((prev) => prev + textToType.charAt(index));
      index++;
      if (index >= textToType.length) {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        setIsTypingComplete(true);
      }
    }, 20);

    return () => { if (typingIntervalRef.current) clearInterval(typingIntervalRef.current); };
  }, [moduleData, loading, systemReady, isInjectingFounder]);

  const proceedToNext = async () => {
    if (isNavigating) return;
    setIsNavigating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("operator_archive_progress").upsert({
        user_id: user.id,
        module_id: moduleData.id,
        status: "PURGED",
        purged_at: new Date().toISOString()
      }, { onConflict: "user_id,module_id" });

      const { data: nextModule } = await supabase
        .from("archive_modules")
        .select("slug")
        .eq("order_index", moduleData.order_index + 1)
        .eq("is_active", true)
        .maybeSingle();

      if (nextModule) {
        hasStartedTypewriter.current = false;
        setModuleData(null);
        setIsInjectingFounder(false);
        setDisplayedText("");
        setInput("");
        setIsTypingComplete(false);
        router.push(`/archive/${nextModule.slug}`);
        setTimeout(() => setIsNavigating(false), 800);
      } else {
        router.push('/archive/dossier');
      }
    } catch (err) {
      setIsNavigating(false);
    }
  };

  const handleExecute = async () => {
    if (isProcessingAI || !input.trim()) return;
    setError("");
    const cleanInput = input.trim();

    if (cleanInput.length < 15) {
      setError("> ERROR: DATA_STREAM_TOO_WEAK. ENTER DEEPER REFLECTION.");
      return;
    }

    setIsProcessingAI(true);
    setError("> CRUNCHING_DATA_FOR_EGO_MALWARE...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const response = await fetch("https://iszwpqsgnividdcxvrce.supabase.co/functions/v1/bullshit-filter", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ input: cleanInput, slug, userId: user?.id, moduleId: moduleData.id })
      });

      const data = await response.json();
      if (!data.approved) {
        setError(`> CASSIUS_REJECTION: ${data.reason}`);
        setIsProcessingAI(false);
        return;
      }

      setIsProcessingAI(false);
      if (slug === "01-the-9-5-loop" && !isInjectingFounder) {
        setIsInjectingFounder(true);
      } else {
        await proceedToNext();
      }
    } catch (err) {
      setError("> ERROR: FIREWALL_TIMEOUT. CONNECTION TO CASSIUS LOST.");
      setIsProcessingAI(false);
    }
  };

  // INTERFACE RENDER COMPONENT
  if (!systemReady && !loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <button
          onClick={() => setSystemReady(true)}
          className="border-2 border-red-900 px-12 py-8 text-red-600 font-mono text-[11px] tracking-[0.5em] uppercase hover:bg-red-900 hover:text-white transition-all shadow-[0_0_30px_rgba(153,27,27,0.2)]"
        >
          &gt; INITIALIZE_SYSTEM_INTERFACE
        </button>
      </div>
    );
  }

  if (loading && !isInjectingFounder) {
    return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-red-900 uppercase tracking-[0.5em] animate-pulse">Accessing_Archive_Sector...</div>;
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
            <button
              onClick={proceedToNext}
              className="w-full bg-red-900 text-white py-6 text-[11px] font-black uppercase tracking-[0.6em] hover:bg-red-700 transition-all active:scale-95"
            >
              C O N F I R M _ S T A T U S _ & _ P R O C E E D
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <header className="flex items-center gap-6">
              <div className="h-px w-16 bg-red-900"></div>
              <h1 className="text-red-700 text-[10px] uppercase tracking-[0.6em] font-black italic">
                {moduleData?.title || "LOADING_PROTOCOL..."}
              </h1>
            </header>

            <div className="border-l border-zinc-900 pl-8 md:pl-10 py-2">
              <div className="text-zinc-200 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-medium uppercase tracking-wide">
                {displayedText || "> AWAITING_DATA_STREAM..."}
                {!isTypingComplete && (
                  <span className="inline-block w-2 h-5 bg-red-600 animate-pulse ml-2 align-middle"></span>
                )}
              </div>

              {isTypingComplete && (
                <div className="mt-12 space-y-8 animate-in fade-in duration-1000">
                  <div className="space-y-4">
                    <p className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.4em] italic">
                      &gt; UPLOAD_REFLECTIVE_DATA_STREAM:
                    </p>
                    <textarea
                      className="w-full bg-transparent border-none p-0 text-white uppercase text-base md:text-lg focus:ring-0 outline-none transition-all font-mono resize-none placeholder:text-zinc-800 tracking-wide leading-relaxed"
                      rows={3}
                      value={input}
                      disabled={isProcessingAI}
                      onChange={(e) => setInput(e.target.value)}
                      onPaste={(e) => e.preventDefault()}
                      placeholder="> Awaiting_Architect_Response..."
                      autoFocus
                    />
                  </div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <button
                      onClick={handleExecute}
                      disabled={isProcessingAI}
                      className="bg-red-950/20 text-red-500 border border-red-900 px-12 py-5 text-[11px] font-black hover:bg-red-900 hover:text-white transition-all uppercase tracking-[0.5em] active:scale-95 disabled:opacity-50"
                    >
                      {isProcessingAI ? "Scanning..." : "Execute_Command"}
                    </button>
                    {error && (
                      <p className="text-red-600 text-[10px] font-black animate-pulse tracking-widest uppercase italic max-w-md leading-relaxed">
                        {error}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="fixed inset-0 pointer-events-none bg-size-[40px_40px] bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] opacity-20" />
      <footer className="fixed bottom-8 left-8 pointer-events-none opacity-20 text-[9px] font-black uppercase tracking-[1em] text-zinc-800 italic">
        Node_Ref_ID: {slug}
      </footer>
    </main>
  );
}