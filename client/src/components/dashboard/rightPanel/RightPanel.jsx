import CalendarWidget from './CalendarWidget';
import FocusTimer from './FocusTimer';
import UserGreeting from './UserGreeting';

export default function RightPanel({user,tasks,groups}) {
  return (
    <aside className="w-80 bg-white shadow-lg h-full flex flex-col overflow-y-auto">
      <div className="p-6 space-y-6">
        <UserGreeting  user={user}/>
        <CalendarWidget tasks={tasks}/> 
        <FocusTimer/>     
      </div>
    </aside>
  );
}
