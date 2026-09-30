export type IntroState =
  | "dormant"    // Initial pitch-black / subtle stars
  | "emblem"     // Glowing cap & halo appears
  | "burst"      // Confetti explosion & light flare
  | "revealed"   // Title "Happy Farewell Seniors" in all its gold glory
  | "transition"; // Smooth transition toward the next stage teaser

export interface SequenceConfig {
  initialStage?: IntroState;
  emblemDelayMs: number;
  burstDelayMs: number;
  titleDelayMs: number;
  transitionDelayMs: number;
  sparkleDurationMs: number;
}
