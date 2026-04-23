"use client";

import React, { useState } from 'react';

const ebookContent = [
  {
    chapter: "01",
    title: "The Simulation Blueprint",
    content: "De meeste mensen denken dat ze vrij zijn, maar ze draaien op scripts die zijn geschreven door media, onderwijs en overheid. Dit is de architectuur van je gevangenis..."
  },
  {
    chapter: "02",
    title: "Identifying Malware",
    content: "Dopamine-loops via algoritmes zijn de moderne malware voor je brein. Ze fragmenteren je focus zodat je nooit de diepte in kunt gaan om echt iets op te bouwen."
  },
  {
    chapter: "03",
    title: "Timeline Switching",
    content: "Je bevindt je nu op tijdlijn A. Tijdlijn B (6ha in Portugal) bestaat al, je hebt alleen de juiste frequentie en acties nodig om daarop in te pluggen."
  }
];

export default function RealityOSReader() {
  const [activeChapter, setActiveChapter] = useState(0);

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono p-4 md:p-10">
      <div className="max-w-6xl mx-auto border border-red-900/30 bg-zinc-950 shadow-2xl">
        
        {/* HEADER */}
        <div className="border-b border-red-900/30 p-4 flex justify-between items-center bg-black">
          <div className="text-red-600 font-bold text-xs tracking-widest uppercase">
            RealityOS // Knowledge_Base_v1.0
          </div>
          <div className="text-[10px] text-zinc-600">
            SECURE_ACCESS: GRANTED
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-[70vh]">
          
          {/* SIDEBAR - INDEX */}
          <div className="w-full md:w-64 border-r border-red-900/30 bg-black/50 overflow-y-auto">
            {ebookContent.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveChapter(index)}
                className={`w-full text-left p-4 border-b border-zinc-900 transition-all ${
                  activeChapter === index 
                  ? "bg-red-950/20 text-red-600 border-l-4 border-l-red-600" 
                  : "hover:bg-zinc-900"
                }`}
              >
                <div className="text-[10px] opacity-50 mb-1">CHAPTER_{item.chapter}</div>
                <div className="text-xs font-bold uppercase tracking-tighter">{item.title}</div>
              </button>
            ))}
          </div>

          {/* MAIN CONTENT - THE READER */}
          <div className="flex-1 p-6 md:p-12 overflow-y-auto relative bg-[radial-gradient(circle_at_50%_50%,rgba(20,0,0,0.2),transparent)]">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-red-600 text-3xl font-black uppercase tracking-tighter mb-8 italic">
                {ebookContent[activeChapter].title}
              </h2>
              <div className="prose prose-invert prose-red">
                <p className="text-zinc-400 leading-relaxed text-lg italic mb-6">
                  {ebookContent[activeChapter].content}
                </p>
                {/* Hier komt de rest van je tekst uit de PDF */}
                <div className="h-px w-20 bg-red-900/50 mb-6"></div>
                <p className="text-sm text-zinc-500 font-mono">
                  [ DATA_STREAM_CONTINUES... ]
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}