"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Voor nu sturen we iedereen direct naar de login
    // Later kunnen we hier een vette 'Initialize' knop maken
    router.push("/login");
  }, [router]);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center font-mono">
      <div className="text-zinc-500 animate-pulse uppercase tracking-[0.5em] text-xs">
        Initializing_Root_OS...
      </div>
    </main>
  );
}