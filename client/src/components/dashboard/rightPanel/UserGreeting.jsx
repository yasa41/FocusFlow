export default function UserGreeting() {
  const user = {
    name: "Alex Kim",
    role: "UX/UI Designer", 
    avatar: "AK",
    level: "Level 12",
    xp: 2450,
    nextLevelXp: 3000
  };

  const xpProgress = (user.xp / user.nextLevelXp) * 100;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">{user.avatar}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.role}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-purple-600 font-semibold">{user.level}</div>
        </div>
      </div>
      
      {/* XP Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>XP Progress</span>
          <span>{user.xp}/{user.nextLevelXp}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>
      
      <div className="text-xs text-center text-purple-600 font-medium">
        {user.nextLevelXp - user.xp} XP to next level
      </div>
    </div>
  );
}
