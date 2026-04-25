// app/dashboard/page.tsx

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Image from "next/image";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, 
      },
    }
  );

  // =====================================================================
  // ⚠️ GOD MODE ACTIVE: LOCAL DEVELOPMENT BYPASS ⚠️
  // =====================================================================
  const user = { email: "the_architect@rootos.local" };
  // =====================================================================

  return (
    <main className="min-h-screen bg-black text-zinc-500 p-6 md:p-12 font-mono relative overflow-hidden">
      
      {/* Background Grid - Reality Interface */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none"></div>
      
      {/* MASSIVE BACKGROUND LOGO */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none select-none blur-sm">
        <Image src="/rootos-logo.png" alt="RootOS Watermark" width={1000} height={1000} priority />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER SECTION - Fixed Grid to prevent overlap */}
        <header className="grid grid-cols-1 xl:grid-cols-12 gap-12 border-b border-zinc-900 pb-12 mb-16 items-center">
          
          <div className="xl:col-span-8 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
            {/* PRIMARY LOGO - Aspect ratio fixed */}
            <div className="relative shrink-0 w-40 h-40 md:w-52 md:h-52">
               <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20"></div>
               <Image 
                src="/rootos-logo.png" 
                alt="RootOS Identity" 
                fill
                className="relative object-contain opacity-100 drop-shadow-[0_0_35px_rgba(153,27,27,0.6)]" 
                priority
               />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-700"></span>
                </span>
                <p className="text-red-700 text-xs tracking-[0.6em] uppercase font-black italic">System_Uptime: Stable</p>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
                Command<br/>Center
              </h1>
              <p className="text-zinc-600 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">
                <span className="text-red-900 font-black">OPERATOR_ID:</span> {user.email}
              </p>
            </div>
          </div>

          {/* STATS SECTOR - Prevented collision */}
          <div className="xl:col-span-4 grid grid-cols-3 gap-8 border-l border-zinc-900 pl-8 h-fit py-4">
            <div className="whitespace-nowrap">
              <p className="text-[10px] uppercase tracking-widest mb-2 text-zinc-700 font-black">Integrity</p>
              <p className="text-white font-black text-2xl md:text-3xl tracking-tighter">88%</p>
            </div>
            <div className="whitespace-nowrap text-center">
              <p className="text-[10px] uppercase tracking-widest mb-2 text-zinc-700 font-black">Clearance</p>
              <p className="text-red-700 font-black text-2xl md:text-3xl tracking-tighter italic">RECRUIT</p>
            </div>
            <div className="whitespace-nowrap text-right">
              <p className="text-[10px] uppercase tracking-widest mb-2 text-zinc-700 font-black">Latency</p>
              <p className="text-white font-black text-2xl md:text-3xl tracking-tighter">12ms</p>
            </div>
          </div>
        </header>

        {/* INTERFACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* THE ARCHIVE */}
          <section className="lg:col-span-8 space-y-12">
            <div className="border border-zinc-900 bg-zinc-950/70 p-10 md:p-14 hover:border-red-900/50 transition-all group relative overflow-hidden backdrop-blur-xl">
              <div className="absolute -top-12 -right-12 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <p className="text-[200px] font-black italic uppercase select-none">READ</p>
              </div>
              
              <div className="flex items-center gap-6 mb-10">
                <div className="h-1 w-16 bg-red-900"></div>
                <h2 className="text-white text-3xl font-black uppercase italic tracking-tighter group-hover:text-red-500 transition-colors">The_Archive</h2>
              </div>

              <p className="text-base md:text-lg leading-relaxed mb-14 text-zinc-400 max-w-2xl uppercase tracking-widest font-bold">
                Manual override initiated. Access the reality source code to identify legacy malware and initiate the Paradox Shift. The external world is merely a low-resolution render of your internal code.
              </p>
              
              <div className="flex flex-wrap items-center gap-8 md:gap-12">
                <a 
                  href="/archive/00_compliance" 
                  className="bg-red-950/40 text-red-500 border-2 border-red-900 px-10 md:px-14 py-5 md:py-6 text-xs font-black uppercase tracking-[0.6em] hover:bg-red-700 hover:text-white transition-all active:scale-95 shadow-lg"
                >
                  Enter_Node_Sequence
                </a>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-black italic">Status_Update</p>
                  <p className="text-xs text-green-800 font-black uppercase animate-pulse tracking-tighter">Handshake_Verified</p>
                </div>
              </div>
            </div>
          </section>

          {/* FULL SYSTEM DEPLOYMENT */}
          <aside className="lg:col-span-4">
            <div className="border-2 border-red-900/40 bg-red-950/10 p-10 relative overflow-hidden group backdrop-blur-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-transparent via-red-600 to-transparent"></div>
              
              <h3 className="text-white text-md font-black uppercase tracking-[0.3em] italic mb-8">Full_System_Deployment</h3>

              <p className="text-[11px] text-zinc-500 font-black uppercase mb-10 tracking-widest leading-relaxed">
                Automate your rebellion. Transition from manual hacking to an autonomous operating system.
              </p>

              <ul className="space-y-6 text-[11px] uppercase tracking-widest font-black mb-12">
                <li className="flex items-start gap-4 text-zinc-700">
                  <span className="text-red-900">#01</span> Quantum_Collapsing_Audio
                </li>
                <li className="flex items-start gap-4 text-zinc-700">
                  <span className="text-red-900">#02</span> The_Void_Protocol
                </li>
                <li className="flex items-start gap-4 text-zinc-700">
                  <span className="text-red-900">#03</span> DNA_Scripting_Exploit
                </li>
                <li className="flex items-start gap-4 text-zinc-700">
                  <span className="text-red-900">#04</span> Architect_Circle_Access
                </li>
              </ul>

              <button className="w-full bg-red-900 text-white py-6 text-sm font-black uppercase tracking-[0.6em] hover:bg-red-600 transition-all shadow-xl">
                Initialize_Deployment<br/>
                <span className="text-[9px] opacity-70">($49 / MO)</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}