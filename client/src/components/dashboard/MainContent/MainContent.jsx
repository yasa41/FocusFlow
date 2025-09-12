import HeroSection from "./HeroSection";
import GroupsSection from "./GroupSection";

export default function MainContent({ user, tasks, groups, activity }) {
  return (
    <main className="flex-1 p-6 space-y-6 overflow-y-auto">
      <HeroSection user={user} tasks={tasks} />
      <GroupsSection groups={groups} />
    </main>
  );
}
