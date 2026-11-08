import { LandingFooter } from "./footer";
import { LandingNav } from "./nav";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050506] text-zinc-50">
      <LandingNav />
      <main />
      <LandingFooter />
    </div>
  );
}
