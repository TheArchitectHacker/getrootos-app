// lib/drip-logic.ts
export function getUnlockedModule(subscriptionDate: string | null) {
  if (!subscriptionDate) return 1;
  
  const start = new Date(subscriptionDate);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Elke 7 dagen een nieuwe module (max 9)
  const currentModule = Math.min(Math.floor(diffInDays / 7) + 1, 9);
  return currentModule;
}