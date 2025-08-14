export default function StudyBuddies() {
  // Mock data - replace with real API data
  const buddies = [
    {
      id: 1,
      name: "Sarah Miller",
      avatar: "SM",
      status: "online",
      activity: "Studying React",
      timeActive: "2h",
      streak: 5
    },
    {
      id: 2,
      name: "Mike Johnson", 
      avatar: "MJ",
      status: "studying",
      activity: "CS 101 Assignment",
      timeActive: "45m",
      streak: 12
    },
    {
      id: 3,
      name: "Emma Thompson",
      avatar: "ET",
      status: "break",
      activity: "Just finished math",
      timeActive: "10m",
      streak: 3
    },
    {
      id: 4,
      name: "Josh Wilson",
      avatar: "JW", 
      status: "offline",
      activity: "Last seen 1h ago",
      timeActive: null,
      streak: 8
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      online: "bg-green-500",
      studying: "bg-blue-500", 
      break: "bg-yellow-500",
      offline: "bg-gray-400"
    };
    return colors[status] || colors.offline;
  };

  const getStatusIcon = (status) => {
    const icons = {
      online: "🟢",
      studying: "📚",
      break: "☕",
      offline: "⚫"
    };
    return icons[status] || icons.offline;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Study Buddies</h3>
        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
          {buddies.filter(b => b.status !== 'offline').length} online
        </span>
      </div>
      
      <div className="space-y-3">
        {buddies.map((buddy) => (
          <div key={buddy.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            {/* Avatar with status */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">{buddy.avatar}</span>
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(buddy.status)} rounded-full border-2 border-white`}></div>
            </div>
            
            {/* Buddy info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-800 text-sm truncate">{buddy.name}</p>
                {buddy.streak > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs">🔥</span>
                    <span className="text-xs font-medium text-orange-600">{buddy.streak}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs">{getStatusIcon(buddy.status)}</span>
                <p className="text-xs text-gray-500 truncate">{buddy.activity}</p>
              </div>
              {buddy.timeActive && (
                <p className="text-xs text-gray-400">{buddy.timeActive} active</p>
              )}
            </div>
            
           
          </div>
        ))}
      </div>
      
      {/* Join study session button */}
      <button className="w-full mt-4 bg-purple-50 text-purple-600 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors">
        Join Study Session
      </button>
    </div>
  );
}
