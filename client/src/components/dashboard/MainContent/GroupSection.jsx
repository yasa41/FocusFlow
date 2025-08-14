import { FiPlus, FiGrid, FiList } from 'react-icons/fi';
import GroupCard from './GroupCard';

export default function GroupsSection() {
  // Mock data - replace with real data from API later
  const groups = [
    {
      id: 1,
      name: "CS 101 Study Group",
      subject: "Computer Science",
      progress: 90,
      daysLeft: 3,
      members: [
        { id: 1, name: "Alex", avatar: "AK" },
        { id: 2, name: "Sarah", avatar: "SM" },
        { id: 3, name: "Mike", avatar: "MJ" },
      ],
      color: "purple",
      type: "study"
    },
    {
      id: 2,
      name: "Fitness Challenge",
      subject: "Health & Wellness",
      progress: 30,
      daysLeft: 25,
      members: [
        { id: 1, name: "Alex", avatar: "AK" },
        { id: 4, name: "Emma", avatar: "ET" },
        { id: 5, name: "Josh", avatar: "JW" },
        { id: 6, name: "Lisa", avatar: "LH" },
      ],
      color: "green",
      type: "fitness"
    },
    {
      id: 3,
      name: "React Mastery",
      subject: "Web Development",
      progress: 75,
      daysLeft: 7,
      members: [
        { id: 1, name: "Alex", avatar: "AK" },
        { id: 7, name: "Dev", avatar: "DP" },
      ],
      color: "blue",
      type: "coding"
    }
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">My Study Groups</h2>
          <p className="text-gray-600 mt-1">
            Track progress with your study buddies • {groups.length} active groups
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Toggle - Optional */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
            <button className="p-2 bg-white rounded-md shadow-sm">
              <FiGrid className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <FiList className="w-4 h-4" />
            </button>
          </div>
          
          {/* Create Group Button */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm">
            <FiPlus className="w-4 h-4" />
            <span className="font-medium">Create Group</span>
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      {/* Empty State - Show when no groups */}
      {groups.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiGrid className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No study groups yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first study group to start collaborating with others.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
            Create Your First Group
          </button>
        </div>
      )}
    </section>
  );
}
