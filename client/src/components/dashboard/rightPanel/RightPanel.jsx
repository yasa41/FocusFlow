import CalendarWidget from './CalendarWidget';
import StudyBuddies from './StudyBuddies';
import AssignmentsList from './AssignmentsList';
import UserGreeting from './UserGreeting';

export default function RightPanel() {
  return (
    <aside className="w-80 bg-white shadow-lg h-full flex flex-col overflow-y-auto">
      <div className="p-6 space-y-6">
        <UserGreeting />
        <CalendarWidget />
        <StudyBuddies />
        <AssignmentsList />
      </div>
    </aside>
  );
}
