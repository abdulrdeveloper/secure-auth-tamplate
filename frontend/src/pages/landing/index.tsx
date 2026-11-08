import { LandingFooter } from "./footer";
import { Hero } from "./hero";
import { LandingNav } from "./nav";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050506] text-zinc-50">
      <LandingNav />
      <main>
        <Hero />
      </main>
      <LandingFooter />
    </div>
  );
}
