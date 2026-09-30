import { OpeningExperience } from "@/components/intro/OpeningExperience";
import { SeniorPhotoCollageSection } from "@/components/gallery/SeniorPhotoCollageSection";
import { FinalFarewellSection } from "@/components/farewell/FinalFarewellSection";
import { IntroState } from "@/types/intro";

interface PageProps {
  searchParams: Promise<{ stage?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const stage = resolvedParams?.stage;

  const initialStage = (
    stage &&
    ["dormant", "emblem", "burst", "revealed", "transition"].includes(stage)
      ? stage
      : undefined
  ) as IntroState | undefined;

  return (
    <main className="relative w-full min-h-screen bg-[#02040a] text-white">
      {/* Phase 1: Opening Cinematic Experience */}
      <OpeningExperience initialStage={initialStage} />

      {/* Phase 2: Scroll-Driven Senior Photo Animation */}
      <SeniorPhotoCollageSection id="senior-memories" />

      {/* Phase 3: Final Farewell Experience & Tribute */}
      <FinalFarewellSection id="final-farewell" />
    </main>
  );
}
