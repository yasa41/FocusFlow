import HeroSection from "./HeroSection";
import GroupsSection from "./GroupSection";

export default function MainContent({ user, tasks, groups, activity }) {
  return (
    <main className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Pass user and tasks data to HeroSection */}
      <HeroSection user={user} tasks={tasks} />
           
      {/* Pass groups data to GroupsSection */}
      <GroupsSection groups={groups} />
    </main>
  );
}
