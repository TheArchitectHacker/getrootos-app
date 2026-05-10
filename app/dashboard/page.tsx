// app/dashboard/page.tsx

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

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

  // 1. AUTH CHECK
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. DATA FETCHING (Parallel)
  const [profileReq, chaptersReq, logsReq] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("chapters").select("*").order("order_index", { ascending: true }),
    supabase.from("user_logs").select("chapter_slug").eq("user_id", user.id)
  ]);

  const profile = profileReq.data;
  const chapters = chaptersReq.data || [];
  const completedSlugs = logsReq.data?.map(l => l.chapter_slug) || [];

  // 3. LOGIC: Bepaal waar de gebruiker is gebleven
  const lastCompletedChapter = chapters
    .filter(c => completedSlugs.includes(c.slug))
    .sort((a, b) => b.order_index - a.order_index)[0];
  
  const maxIndex = lastCompletedChapter ? lastCompletedChapter.order_index + 1 : 0;
  const targetSlug = chapters.find(c => c.order_index === maxIndex)?.slug || "00-compliance";
  const isAllChaptersDone = completedSlugs.length >= 8;

  return (
    <main className="min-h-screen bg-black text-zinc-500 p-6 md:p-12 font-mono relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER SECTION */}
        <header className="grid grid-cols-1 xl:grid-cols-12 gap-12 border-b border-zinc-900 pb-12 mb-16 items-center">
          <div className="xl:col-span-8 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
            <div className="relative shrink-0 w-32 h-32 md:w-40 md:h-40">
              <div className="absolute inset-0 bg-red-600 blur-3xl opacity-10"></div>
              <Image src="/rootos-logo.png" alt="RootOS" fill className="relative object-contain drop-shadow-[0_0_20px_rgba(153,27,27,0.4)]" priority />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-700"></span>
                </span>
                <p className="text-red-700 text-[10px] tracking-[0.6em] uppercase font-black italic">System_Uptime: Stable</p>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
                Command<br/>Center
              </h1>
              <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.4em]">
                <span className="text-red-900 font-black">ARCHITECT_ID:</span> {user.email}
              </p>
            </div>
          </div>

          {/* STATS & FOMO SECTOR */}
          <div className="xl:col-span-4 grid grid-cols-3 gap-8 border-l border-zinc-900 pl-8 h-fit py-4">
            <div>
              <p className="text-[9px] uppercase tracking-widest mb-2 text-zinc-700 font-black italic">Clearance</p>
              <p className="text-red-700 font-black text-xl md:text-2xl tracking-tighter italic uppercase">{profile?.role || "RECRUIT"}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest mb-2 text-zinc-700 font-black italic">Nodes_Active</p>
              <p className="text-white font-black text-xl md:text-2xl tracking-tighter">
                87<span className="text-zinc-800">/100</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest mb-2 text-zinc-700 font-black italic">Capacity</p>
              <p className="text-red-600 font-black text-xs animate-pulse tracking-tighter uppercase">Critical</p>
            </div>
          </div>
        </header>

        {/* INTERFACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* THE ARCHIVE - Main content */}
          <section className="lg:col-span-8 space-y-12">
            <div className="border border-zinc-900 bg-zinc-950/70 p-10 md:p-14 hover:border-red-900/50 transition-all group relative overflow-hidden backdrop-blur-xl">
              <div className="absolute -top-12 -right-12 p-12 opacity-[0.03] group-hover:opacity-05 transition-opacity">
                <p className="text-[180px] font-black italic uppercase select-none">ROOT</p>
              </div>
              
              <div className="flex items-center gap-6 mb-10">
                <div className="h-1 w-16 bg-red-900"></div>
                <h2 className="text-white text-3xl font-black uppercase italic tracking-tighter group-hover:text-red-500 transition-colors">The_Archive</h2>
              </div>

              <p className="text-sm md:text-base leading-relaxed mb-14 text-zinc-400 max-w-2xl uppercase tracking-[0.2em] font-bold">
                Access the reality source code. Identify malware. Initiate the Paradox Shift. 
                The external world is merely a low-resolution render of your internal code.
              </p>

              <div className="flex flex-col gap-10">
                <div className="flex flex-wrap items-center gap-8">
                  <Link
                    href={isAllChaptersDone ? "/deploy" : `/archive/${targetSlug}`}
                    className="bg-red-950/40 text-red-500 border-2 border-red-900 px-10 md:px-14 py-5 md:py-6 text-xs font-black uppercase tracking-[0.6em] hover:bg-red-700 hover:text-white transition-all active:scale-95 shadow-lg"
                  >
                    {isAllChaptersDone ? "Final_Deployment >" : maxIndex === 0 ? "Enter_Node_Sequence" : "Resume_Protocol"}
                  </Link>
                  <div className="space-y-1">
                    <p className="text-[9px] text-zinc-700 uppercase tracking-widest font-black italic">Status_Update</p>
                    <p className="text-[10px] text-green-800 font-black uppercase animate-pulse tracking-tighter">Connection_Stable</p>
                  </div>
                </div>

                {/* SUBTLE REVIEW SECTION (History) */}
                {completedSlugs.length > 0 && (
                  <div className="pt-8 border-t border-zinc-900/50">
                    <p className="text-[9px] text-zinc-700 uppercase font-black tracking-[0.3em] mb-4">Review_Unlocked_Nodes:</p>
                    <div className="flex flex-wrap gap-3">
                      {chapters.map((cap) => (
                        completedSlugs.includes(cap.slug) ? (
                          <Link 
                            key={cap.id} 
                            href={`/archive/${cap.slug}`}
                            className="text-[10px] font-black text-zinc-500 hover:text-red-600 transition-colors border border-zinc-900 px-3 py-1 hover:border-red-900"
                          >
                            ID_0{cap.order_index}
                          </Link>
                        ) : null
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* FULL SYSTEM DEPLOYMENT - The $49/mo Sidebar */}
          <aside className="lg:col-span-4">
            <div className={`border-2 p-10 relative overflow-hidden group backdrop-blur-2xl transition-all ${profile?.role === 'OPERATOR' ? 'border-green-900/50 bg-green-950/05' : 'border-red-900/40 bg-red-950/10'}`}>
              <div className={`absolute top-0 left-0 w-full h-1 ${profile?.role === 'OPERATOR' ? 'bg-green-600' : 'bg-red-600'}`}></div>
              <h3 className="text-white text-md font-black uppercase tracking-[0.3em] italic mb-8">Full_System_Deployment</h3>

              <p className="text-[11px] text-zinc-500 font-black uppercase mb-10 tracking-widest leading-relaxed">
                {profile?.role === 'OPERATOR' 
                  ? "Your autonomous operating system is active. All advanced modules are being injected into your stream."
                  : "Automate your rebellion. Transition from manual hacking to an autonomous operating system."}
              </p>

              <ul className="space-y-6 text-[11px] uppercase tracking-widest font-black mb-12">
                {[
                  { id: "01", name: "Quantum_Collapsing_Audio" },
                  { id: "02", name: "The_Void_Protocol" },
                  { id: "03", name: "DNA_Scripting_Exploit" },
                  { id: "04", name: "Architect_Circle_Access" }
                ].map((item) => (
                  <li key={item.id} className={`flex items-start gap-4 ${profile?.role === 'OPERATOR' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    <span className={profile?.role === 'OPERATOR' ? 'text-green-600' : 'text-red-900'}>#{item.id}</span> {item.name}
                  </li>
                ))}
              </ul>

              {profile?.role === 'OPERATOR' ? (
                <button className="w-full bg-green-900/20 text-green-500 border border-green-900 py-6 text-xs font-black uppercase tracking-[0.4em] cursor-default">
                  SYSTEM_ACTIVE
                </button>
              ) : (
                <Link 
  href="/deploy" 
  className="block text-center w-full bg-red-900 text-white py-6 px-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl leading-tight border border-red-500/20"
>
  Initialize_Deployment<br/>
  <span className="text-[9px] opacity-70 tracking-widest">($49 / MO)</span>
</Link>
              )}
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}