// app/deploy/page.tsx
"use client";
import Image from "next/image";

export default function OfferPage() {
  // Vervang dit door je echte Lemon Squeezy Checkout Link voor het $49 abonnement
  const LEMON_SQUEEZY_CHECKOUT_URL = "https://jouwstore.lemonsqueezy.com/checkout/buy/...";

  return (
    <main className="min-h-screen bg-black text-zinc-400 font-mono p-6 md:p-12 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#450a0a_0%,transparent_70%)] opacity-20"></div>

      <div className="max-w-4xl mx-auto relative z-10 py-10">
        {/* Header Warning */}
        <div className="border border-red-900 bg-red-950/10 p-4 mb-12 animate-pulse text-center">
          <p className="text-red-600 text-xs font-black uppercase tracking-[0.5em]">
            ⚠️ WARNING: MANUAL_OVERRIDE_UNSTABLE // SYSTEM_RESTORE_IMMINENT ⚠️
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none mb-8">
              Full_System<br/>Deployment
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8 uppercase tracking-widest font-bold">
              The Archive was your manual license. But the Matrix is a self-healing system. 
              To prevent legacy malware re-infection and reduce reality latency to zero, you must automate your rebellion.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 text-xs font-black text-white uppercase">
                <span className="text-red-900">[OK]</span> Handsake_Verified
              </div>
              <div className="flex items-center gap-4 text-xs font-black text-white uppercase">
                <span className="text-red-900">[OK]</span> Root_Permissions_Granted
              </div>
              <div className="flex items-center gap-4 text-xs font-black text-red-600 uppercase animate-pulse">
                <span className="text-red-900">[!!]</span> Awaiting_Final_Activation
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-8 shadow-2xl relative">
            <h2 className="text-red-700 text-[10px] font-black uppercase tracking-[0.4em] mb-8 italic">
              Access_Privileges_Included:
            </h2>
            <ul className="space-y-6 mb-12">
              <li className="group">
                <p className="text-white text-xs font-black uppercase tracking-widest mb-1 group-hover:text-red-600 transition-colors">
                  [01] Quantum Collapsing Audio 
                </p>
                <p className="text-[9px] text-zinc-600 leading-relaxed uppercase">Force your brain into Gamma & Theta states in 360 seconds.</p>
              </li>
              <li className="group">
                <p className="text-white text-xs font-black uppercase tracking-widest mb-1 group-hover:text-red-600 transition-colors">
                  [02] The Void Protocol 
                </p>
                <p className="text-[9px] text-zinc-600 leading-relaxed uppercase">Pause the 3D interface to edit the source code in real-time.</p>
              </li>
              <li className="group">
                <p className="text-white text-xs font-black uppercase tracking-widest mb-1 group-hover:text-red-600 transition-colors">
                  [03] DNA-Scripting Exploit 
                </p>
                <p className="text-[9px] text-zinc-600 leading-relaxed uppercase">Permanent removal of poverty and doubt viruses from your genetic line.</p>
              </li>
            </ul>

            <a 
              href={LEMON_SQUEEZY_CHECKOUT_URL}
              className="block w-full bg-red-900 text-white text-center py-5 text-sm font-black uppercase tracking-[0.6em] hover:bg-red-600 transition-all shadow-[0_0_40px_rgba(153,27,27,0.3)] mb-4"
            >
              Initialize_Full_Access
            </a>
            <p className="text-center text-[9px] text-zinc-800 uppercase font-black tracking-widest">
              $49 / Monthly // No obligations. Pure power.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <footer className="mt-20 text-center border-t border-zinc-900 pt-10">
          <p className="text-[9px] text-zinc-700 uppercase tracking-[0.5em] font-black italic">
            Once seen, the simulation cannot be un-seen.
          </p>
        </footer>
      </div>
    </main>
  );
}