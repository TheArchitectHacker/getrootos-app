// app/dashboard/page.tsx

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // Lezen is genoeg hier
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // De Gatekeeper: Als je niet bent ingelogd, word je eruit gegooid
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black text-zinc-400 p-8 font-mono relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-10 opacity-10">
        <Image src="/rootos-logo.png" alt="RootOS" width={300} height={300} />
      </div>

      <div className="max-w-4xl mx-auto mt-20 relative z-10">
        <div className="border-l-2 border-red-900 pl-6 mb-12">
          <p className="text-red-700 text-xs tracking-[0.4em] uppercase mb-2">Authenticated_Session</p>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Command_Center</h1>
          <p className="text-zinc-600 text-sm mt-2 font-bold uppercase tracking-widest">Identify: {user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-zinc-900 p-8 bg-zinc-950/50 hover:border-red-900 transition-colors group">
            <h2 className="text-white text-lg font-bold mb-4 uppercase tracking-tighter italic">Secure_Archive</h2>
            <p className="text-xs leading-relaxed mb-6 text-zinc-500">Toegang tot alle gedecrypteerde hoofdstukken en malware analyses.</p>
            <a href="/archive/01-malware-detection" className="inline-block text-[10px] text-red-600 border border-red-900 px-4 py-2 hover:bg-red-950 hover:text-white transition-all uppercase tracking-widest">
              Enter_Node
            </a>
          </div>

          <div className="border border-zinc-900 p-8 bg-zinc-950/50 opacity-50">
            <h2 className="text-white text-lg font-bold mb-4 uppercase tracking-tighter italic">System_Logs</h2>
            <p className="text-xs leading-relaxed text-zinc-600 uppercase tracking-widest">Access_Denied: Level_4_Clearance_Required</p>
          </div>
        </div>
      </div>
    </main>
  );
}