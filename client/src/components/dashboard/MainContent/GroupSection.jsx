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
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Study Groups</h2>
          <p className="text-gray-600 mt-1">Track progress with your study buddies</p>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2">
          <span>➕</span>
          <span>Create Group</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </section>
  );
}
