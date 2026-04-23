import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Typewriter } from "@/components/Typewriter"; 

// DEZE REGEL IS CRUCIAAL: Het moet 'export default' zijn
export default async function ArchivePage({ params }: { params: Promise<{ slug: string }> }) {
  
  // In Next.js 16 moet je params altijd awaiten
  const { slug } = await params;
  
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: chapter, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("slug", slug)
    .single();

  // Als er geen data is of de slug bestaat niet: toon 404
  if (!chapter || error) {
    console.error("Database error of chapter niet gevonden:", error);
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-zinc-300 p-8 md:p-24 font-mono max-w-4xl mx-auto">
      <div className="mb-12 border-b border-zinc-900 pb-4 flex justify-between items-end">
        <div>
          <p className="text-red-600 text-[10px] tracking-widest uppercase italic font-bold">
            Node: Archive_Access
          </p>
          <h1 className="text-2xl font-black uppercase italic text-white">
            {chapter.title}
          </h1>
        </div>
        <p className="text-zinc-600 text-xs tabular-nums">
          ORDER_INDEX: {chapter.order_index.toString().padStart(2, '0')}
        </p>
      </div>

      <div className="text-lg leading-relaxed space-y-8">
        {/* Hier roepen we je Typewriter component aan */}
        <Typewriter text={chapter.content} speed={25} />
      </div>

      <div className="mt-12 p-6 border border-zinc-900 bg-zinc-950/30 backdrop-blur-sm shadow-2xl relative group">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>
        <p className="text-[10px] text-zinc-500 uppercase mb-4 tracking-widest">
          {chapter.interactive_elements?.placeholder || "> TYPE_COMMAND_HERE"}
        </p>
        <input 
          className="bg-transparent border-b border-zinc-800 focus:border-red-600 w-full outline-none py-2 text-red-600 transition-colors uppercase tracking-widest text-sm"
          placeholder="..."
        />
      </div>
    </main>
  );
}