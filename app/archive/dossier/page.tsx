"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

// Interfaces voor type-veiligheid
interface ArchiveModule {
  id: string;
  order_index: number;
  title: string;
  slug: string;
}

interface UserProgress {
  module_id: string;
}

export default function UpsellDossier() {
  const [userName, setUserName] = useState<string>("OPERATOR");
  const [loading, setLoading] = useState<boolean>(true);
  const [modules, setModules] = useState<ArchiveModule[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // SECURITY: Voorkom kopiëren en rechtermuisknop acties
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", preventDefault);
    document.addEventListener("copy", preventDefault);
    return () => {
      document.removeEventListener("contextmenu", preventDefault);
      document.removeEventListener("copy", preventDefault);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) setUserName(user.email.split("@")[0].toUpperCase());

        const { data: modData } = await supabase.from('archive_modules').select('*').order('order_index');
        const { data: progData } = await supabase.from('operator_progress').select('module_id').eq('user_id', user?.id).eq('status', 'purged');
        
        setModules(modData || []);
        setProgress(progData || []);
      } catch (err) {
        console.error("> DOSSIER_FETCH_EXCEPTION:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [supabase]);

  // Secure download functie
  const handleDownload = async () => {
    const { data, error } = await supabase
      .storage
      .from('kernel_archives')
      .createSignedUrl('ROOTOS_KERNEL_FINAL.zip', 60);

    if (error) {
      console.error("DOWNLOAD_FAILED:", error);
      return;
    }
    window.location.href = data.signedUrl;
  };

  const completedCount = progress.length;
  const isComplete = completedCount === 12;

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-red-900 animate-pulse uppercase tracking-[0.5em]">COMPILING_FINAL_DOSSIER...</div>;

  return (
    <main className="min-h-screen bg-black text-zinc-400 p-6 md:p-12 font-mono flex flex-col items-center relative overflow-hidden">
      <div className="max-w-5xl w-full space-y-12 relative z-10">
        
        {/* Header Indicator */}
        <div className="space-y-3 border-b border-red-900/30 pb-6 text-center">
          <p className="text-red-500 font-black text-[10px] tracking-[0.5em] animate-pulse uppercase">
            &gt; SYSTEM_STATUS: {isComplete ? "ALL_NODES_PURGED" : `${completedCount}/12_NODES_CLEARED`}
          </p>
          <h1 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tighter italic">
            DECRYPTED_DOSSIER: {userName}
          </h1>
        </div>

        {/* 12-Stage Progress Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {modules.map((mod: ArchiveModule) => {
            const isPurged = progress.some(p => p.module_id === mod.id);
            return (
              <div key={mod.id} className={`p-2 border text-[8px] text-center ${isPurged ? 'border-green-800 bg-green-900/10 text-green-500' : 'border-zinc-800 bg-zinc-900/20'}`}>
                {mod.order_index}
              </div>
            );
          })}
        </div>

        {/* Download Sectie - Alleen bij voltooiing */}
        {isComplete && (
          <div className="bg-green-950/10 border border-green-900/50 p-6 text-center animate-in fade-in zoom-in duration-700">
            <p className="text-green-500 font-bold text-xs tracking-widest uppercase italic">
              ✓ ARCHIVE_PURGE_SUCCESSFUL: YOUR PERSONALIZED ROOTOS KERNEL IS READY.
            </p>
            <button onClick={handleDownload} className="text-[10px] text-green-700 underline mt-2 hover:text-green-400">
              DOWNLOAD_LOCAL_ENCRYPTED_ARCHIVE
            </button>
          </div>
        )}

        {/* Sales Tiers (The Upsell) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* FSD Tier */}
          <div className="border-2 border-zinc-800 bg-zinc-950/40 p-8 space-y-6">
            <h2 className="text-white text-xl font-black uppercase tracking-tight">Full System Deployment</h2>
            <p className="text-zinc-400 text-xs uppercase tracking-wider">Unlock the expanded runtime engine. Deploy full-scale automated mindset architectures and permanent tracking firewalls.</p>
            <a href="https://thearchitecthacker.lemonsqueezy.com/checkout/buy/abba2528-cfdf-42a4-bc76-67129b1022e0" target="_blank" className="block w-full bg-zinc-900 border border-zinc-700 text-center text-zinc-300 py-4 text-[11px] font-black uppercase hover:bg-red-900 hover:text-white transition-all">INITIALIZE_FSD</a>
          </div>

          {/* AAI Tier */}
          <div className="border-2 border-red-900 bg-red-950/10 p-8 space-y-6 animate-pulse hover:animate-none">
            <h2 className="text-white text-xl font-black uppercase tracking-tight italic">Absolute Architect Integration</h2>
            <p className="text-zinc-300 text-xs uppercase tracking-wider">Complete psychological overwrite. Direct access to the master network and live sub-network audits with the lead architect.</p>
            <a href="https://thearchitecthacker.lemonsqueezy.com/checkout/buy/0e2f4312-9194-48ff-85f3-50748e232ecd" target="_blank" className="block w-full bg-red-900 text-center text-white py-4 text-[11px] font-black uppercase hover:bg-red-700 transition-all">ENGAGE_AAI_PROTOCOL</a>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 pointer-events-none bg-size-[40px_40px] bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] opacity-20" />
    </main>
  );
}