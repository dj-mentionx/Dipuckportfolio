import { GlobalSignalField } from "@/components/globe/GlobalSignalField";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { MentionXNow } from "@/components/home/MentionXNow";
import { OperatingModel } from "@/components/home/OperatingModel";
import { Positioning } from "@/components/home/Positioning";
import { SelectedProof } from "@/components/home/SelectedProof";
import { SystemMap } from "@/components/home/SystemMap";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SystemMap />
      <GlobalSignalField />
      <MentionXNow />
      <OperatingModel />
      <SelectedProof />
      <Positioning />
      <FinalCta />
    </>
  );
}
