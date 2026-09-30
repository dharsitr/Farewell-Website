export type EntryDirection =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type PhotoCategory =
  | "group/friends"
  | "classroom/college"
  | "selfie"
  | "celebration"
  | "outdoor/travel"
  | "candid"
  | "food/hangout"
  | "event"
  | "individual portrait"
  | "large group/batch"
  | "miscellaneous memory";

export interface TransformState {
  x: number; // in vw offset
  y: number; // in vh offset
  rotate: number; // in degrees (-35 to +35)
  scale: number; // scale multiplier
  opacity: number;
}

export interface SeniorPhotoItem {
  id: string;
  src: string;
  filename?: string;
  original?: string;
  alt?: string;
  caption: string;
  category: PhotoCategory | string;
  year?: string;
  index?: number;
  aspectRatio?: number;
  direction?: EntryDirection;
  zIndex: number;
  scrollRange: [number, number]; // [scrollStart, scrollEnd]
  rotation?: number;
  scale?: number;
  initialPosition: TransformState;
  finalPosition: TransformState;
  mobileFinalPosition?: TransformState;
  // Aliases for component convenience:
  start?: TransformState;
  target?: TransformState;
  mobileTarget?: TransformState;
  mobileVisible?: boolean;
}
