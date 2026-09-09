import { GlobalSignalField } from "@/components/globe/GlobalSignalField";
import { FinalCta } from "@/components/home/FinalCta";
import { HomeFrame } from "@/components/home/HomeFrame";
import { MentionXNow } from "@/components/home/MentionXNow";
import { OperatingModel } from "@/components/home/OperatingModel";
import { Positioning } from "@/components/home/Positioning";
import { SelectedProof } from "@/components/home/SelectedProof";
import { SystemMap } from "@/components/home/SystemMap";

export default function HomePage() {
  return (
    <HomeFrame>
      <GlobalSignalField home />
      <section className="cut" id="system">
        <p className="kicker">UNDER THE FIELD</p>
        <h2>The work is the proof.</h2>
        <p className="lede">
          Every company, project and product started with a signal: an opportunity hidden inside fragmented
          execution, unclear demand or changing buyer behaviour.
        </p>
      </section>
      <SystemMap />
      <MentionXNow />
      <OperatingModel />
      <SelectedProof />
      <Positioning />
      <FinalCta />
    </HomeFrame>
  );
}
