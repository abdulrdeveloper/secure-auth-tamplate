import { GetStartedCta } from "./get-started-cta";
import { LandingFooter } from "./footer";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";
import { Integrate } from "./integrate";
import { LandingNav } from "./nav";
import { Security } from "./security";
import { WorksWith } from "./works-with";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050506] text-zinc-50">
      <LandingNav />
      <main>
        <Hero />
        <WorksWith />
        <HowItWorks />
        <Security />
        <Integrate />
        <GetStartedCta />
      </main>
      <LandingFooter />
    </div>
  );
}
