// components/Typewriter.tsx

"use client";
import { useState, useEffect } from "react";

export const Typewriter = ({ text, speed = 30 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const audio = new Audio("/audio/key-tap.wav");
    audio.volume = 0.1;

    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      
      // We vertellen TypeScript hier dat de kloon een Audio element is
      if (i % 2 === 0) {
        (audio.cloneNode(true) as HTMLAudioElement).play().catch(() => {});
      }
      
      i++;
      if (i > text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return <p className="leading-relaxed whitespace-pre-wrap">{displayedText}</p>;
};