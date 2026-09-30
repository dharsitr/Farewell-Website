import confetti from "canvas-confetti";

// Curated festive palette: warm gold, champagne, royal violet, rose gold, starlight white
const CELEBRATION_COLORS = [
  "#FFD700", // Bright Gold
  "#F59E0B", // Amber Gold
  "#FEF08A", // Champagne Yellow
  "#8B5CF6", // Royal Violet
  "#C084FC", // Soft Purple
  "#FFFFFF", // Pure White
  "#F472B6", // Rose Gold
];

/**
 * Triggers a multi-stage celebratory confetti explosion
 * with cannons shooting from bottom left, bottom right, and center burst.
 */
export function triggerCelebrationBurst(): void {
  if (typeof window === "undefined") return;

  // Center primary blast
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.55, x: 0.5 },
    colors: CELEBRATION_COLORS,
    startVelocity: 42,
    gravity: 0.9,
    scalar: 1.15,
    ticks: 280,
    shapes: ["circle", "square"],
    disableForReducedMotion: true,
  });

  // Left angled cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 65,
      origin: { x: 0.1, y: 0.75 },
      colors: CELEBRATION_COLORS,
      startVelocity: 55,
      gravity: 0.95,
      scalar: 1.0,
      ticks: 240,
      disableForReducedMotion: true,
    });
  }, 120);

  // Right angled cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 65,
      origin: { x: 0.9, y: 0.75 },
      colors: CELEBRATION_COLORS,
      startVelocity: 55,
      gravity: 0.95,
      scalar: 1.0,
      ticks: 240,
      disableForReducedMotion: true,
    });
  }, 200);

  // High altitude star shower
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 120,
      origin: { y: 0.35, x: 0.5 },
      colors: ["#FFE066", "#FFFFFF", "#FDE047"],
      startVelocity: 28,
      gravity: 0.6,
      scalar: 0.85,
      ticks: 300,
      disableForReducedMotion: true,
    });
  }, 350);
}

/**
 * Triggers continuous floating sparkles that drift gently down the viewport for a few seconds.
 */
export function startContinuousSparkles(durationMs = 4500): () => void {
  if (typeof window === "undefined") return () => {};

  const animationEnd = Date.now() + durationMs;
  let intervalId: NodeJS.Timeout | null = null;

  intervalId = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      if (intervalId) clearInterval(intervalId);
      return;
    }

    const particleCount = 2;
    // Drop subtle sparkles from random horizontal locations across the top
    confetti({
      particleCount,
      angle: 90,
      spread: 45,
      origin: { x: Math.random(), y: -0.05 },
      colors: ["#FFD700", "#FDE68A", "#FFFFFF", "#E9D5FF"],
      startVelocity: 10 + Math.random() * 8,
      gravity: 0.45,
      scalar: 0.7 + Math.random() * 0.4,
      drift: (Math.random() - 0.5) * 0.5,
      ticks: 200,
      disableForReducedMotion: true,
    });
  }, 180);

  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}
