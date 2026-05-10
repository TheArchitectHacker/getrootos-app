"use client";
import React from "react";

export default function OfferPage() {
  // Config
  const FSD_CHECKOUT_URL = "https://jouwstore.lemonsqueezy.com/checkout/buy/fsd";
  const FESD_APPLICATION_URL = "/contact/elite"; // Of een Typeform link

  return (
    <main className="min-h-screen bg-black text-zinc-400 font-mono p-6 md:p-12 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#450a0a_0%,transparent_70%)] opacity-20"></div>

      <div className="max-w-6xl mx-auto relative z-10 py-10">
        {/* Header Warning */}
        <div className="border border-red-900 bg-red-950/10 p-4 mb-12 animate-pulse text-center">
          <p className="text-red-600 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">
            ⚠️ WARNING: MANUAL_OVERRIDE_UNSTABLE // SYSTEM_RESTORE_IMMINENT ⚠️
          </p>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none mb-4">
            SYSTEM_SELECTION
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-[0.3em] font-bold">
            Choose your level of reality integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* TIER 1: FSD (Monthly Subscription) */}
          <div className="bg-zinc-950 border border-zinc-900 p-8 flex flex-col justify-between hover:border-red-900/50 transition-all group">
            <div>
              <h2 className="text-white text-3xl font-black uppercase italic mb-2 tracking-tighter">Full_System_Deployment</h2>
              <p className="text-red-700 text-[10px] font-black uppercase tracking-[0.3em] mb-8 italic">Tier_01 // Standard_Access</p>
              
              <ul className="space-y-6 mb-12">
                <li className="border-l border-zinc-800 pl-4">
                  <p className="text-white text-xs font-black uppercase tracking-widest mb-1">[01] Quantum Audio Logs</p>
                  <p className="text-[9px] text-zinc-600 uppercase">Access to the frequency-shifting soundscapes.</p>
                </li>
                <li className="border-l border-zinc-800 pl-4">
                  <p className="text-white text-xs font-black uppercase tracking-widest mb-1">[02] Automated Ghost-Chat</p>
                  <p className="text-[9px] text-zinc-600 uppercase">24/7 AI-Architect to analyze your reality glitches.</p>
                </li>
                <li className="border-l border-zinc-800 pl-4">
                  <p className="text-white text-xs font-black uppercase tracking-widest mb-1">[03] The Dossier Archive</p>
                  <p className="text-[9px] text-zinc-600 uppercase">Permanent logging of your timeline jumps.</p>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-white text-2xl font-black mb-6 tracking-tighter">$49 <span className="text-zinc-600 text-xs uppercase tracking-widest">/ Monthly</span></p>
              <a href={FSD_CHECKOUT_URL} className="block w-full bg-zinc-900 text-white text-center py-5 text-xs font-black uppercase tracking-widest hover:bg-red-900 transition-all">
                Initialize_FSD
              </a>
            </div>
          </div>

          {/* TIER 2: FESD (High Ticket - High Impact) */}
          <div className="bg-zinc-950 border-2 border-red-900 p-8 flex flex-col justify-between relative shadow-[0_0_50px_rgba(153,27,27,0.2)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-900 text-white text-[8px] font-black px-4 py-1 uppercase tracking-widest">
              Most_Powerful
            </div>
            
            <div>
              <h2 className="text-white text-3xl font-black uppercase italic mb-2 tracking-tighter">Full_Elite_Deployment</h2>
              <p className="text-red-700 text-[10px] font-black uppercase tracking-[0.3em] mb-8 italic">Tier_02 // Direct_Architect_Access</p>
              
              <ul className="space-y-6 mb-12">
                <li className="border-l border-red-900 pl-4">
                  <p className="text-white text-xs font-black uppercase tracking-widest mb-1">[01] 1-on-1 Reality Audits</p>
                  <p className="text-[9px] text-zinc-500 uppercase">Direct communication with Silvano (The Operator).</p>
                </li>
                <li className="border-l border-red-900 pl-4">
                  <p className="text-white text-xs font-black uppercase tracking-widest mb-1">[02] Portugal Relocation Blueprint</p>
                  <p className="text-[9px] text-zinc-500 uppercase">The exact steps to move off-grid and buy land.</p>
                </li>
                <li className="border-l border-red-900 pl-4">
                  <p className="text-white text-xs font-black uppercase tracking-widest mb-1">[03] Custom Wealth-Code</p>
                  <p className="text-[9px] text-zinc-500 uppercase">Personalized strategy for the €2.4M target.</p>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-white text-xs font-black mb-6 uppercase tracking-widest italic opacity-60">Application Required // Limited Slots</p>
              <a href={FESD_APPLICATION_URL} className="block w-full bg-red-900 text-white text-center py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(153,27,27,0.4)]">
                Request_Elite_Access
              </a>
            </div>
          </div>

        </div>

        <footer className="mt-20 text-center opacity-30">
          <p className="text-[9px] text-zinc-600 uppercase tracking-[0.5em] font-black">
            Executing_Final_Handshake... Status: Awaiting_Choice
          </p>
        </footer>
      </div>
    </main>
  );
}