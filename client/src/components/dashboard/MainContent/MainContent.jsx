import HeroSection from "./HeroSection";
import GroupsSection from "./GroupSection";

export default function MainContent() {
  return (
    <main className="flex-1 p-6 space-y-6 overflow-y-auto">
      <HeroSection />
      <GroupsSection />
    </main>
  );
}
