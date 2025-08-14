import HeroSection from "./HeroSection";
import StatsOverview from "./StatsOverview";
import QuickActions from "./QuickActions";
import GroupsSection from "./GroupSection";

export default function MainContent() {
  return (
    <main className="flex-1 p-6 space-y-6 overflow-y-auto">
      <HeroSection />
      <StatsOverview />
      <QuickActions />
      <GroupsSection />
    </main>
  );
}
