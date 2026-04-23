// app/archive/[slug]/page.tsx

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Typewriter } from "@/components/Typewriter";

export default async function ArchivePage({ params }: { params: Promise<{ slug: string }> }) {
  // In Next.js 15+ moet je params awaiten
  const { slug } = await params;
  const cookieStore = await cookies();

  // De veilige SSR server connectie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => 
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Middleware handelt dit af in een later stadium
          }
        },
      },
    }
  );

  const { data: chapter } = await supabase
    .from("chapters")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!chapter) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-zinc-400 p-8 md:p-24 font-mono max-w-4xl mx-auto relative overflow-hidden">
      {/* Watermerk logo */}
      <div className="absolute top-8 left-8 opacity-10 hover:opacity-40 transition-opacity pointer-events-none">
        <Image src="/rootos-logo.png" alt="RootOS" width={40} height={40} />
      </div>

      <div className="mb-16 border-b border-zinc-900 pb-6 flex justify-between items-end">
        <div>
          <p className="text-red-700 text-[10px] tracking-[0.5em] uppercase font-bold mb-2">
            Secure_Archive_Node
          </p>
          <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter">
            {chapter.title}
          </h1>
        </div>
        <p className="text-zinc-700 text-xs font-bold">
          INDEX: {chapter.order_index.toString().padStart(2, '0')}
        </p>
      </div>

      <div className="text-lg leading-relaxed space-y-10 mb-20 text-zinc-300">
        <Typewriter text={chapter.content} speed={25} />
      </div>

      {/* Interactie Module (Onderkant) */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xl px-6">
        <div className="p-6 border border-zinc-900 bg-black/80 backdrop-blur-md relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-900"></div>
          <p className="text-[10px] text-zinc-600 uppercase mb-3 tracking-[0.3em]">
            {chapter.interactive_elements?.placeholder || "> AWAITING_INPUT"}
          </p>
          <input 
            className="bg-transparent border-b border-zinc-800 focus:border-red-900 w-full outline-none py-2 text-red-600 transition-colors uppercase tracking-widest text-sm font-bold" 
            placeholder="..." 
            autoFocus 
          />
        </div>
      </div>
    </main>
  );
}