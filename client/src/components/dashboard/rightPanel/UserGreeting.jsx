export default function UserGreeting({ user }) {
  // Extract avatar or generate initials just like profile page
  const getAvatarDisplay = () => {
    // If avatar is present and non-empty string, show image
    if (user?.avatar && typeof user.avatar === "string" && user.avatar.trim() !== "") {
      return (
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    // Otherwise, generate initials from name
    if (user?.name) {
      const initials = user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      return (
        <span className="text-white font-bold text-lg">
          {initials}
        </span>
      );
    }
    // Fallback initial
    return (
      <span className="text-white font-bold text-lg">
        U
      </span>
    );
  };

  const xp = user?.xp || 0;
  const nextLevelXp = user?.nextLevelXp || 100;
  const xpProgress = (xp / nextLevelXp) * 100;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center overflow-hidden">
          {getAvatarDisplay()}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white">
            {user?.name || "Unnamed User"}
          </h3>
          <p className="text-blue-200">
            {user?.role || "Member"}
          </p>
        </div>
        <div className="text-white text-sm font-semibold">
          {user?.level || ""}
        </div>
      </div>

      {/* XP Progress */}
      <div className="mb-2">
        <div className="flex justify-between text-blue-200 text-xs mb-1">
          <span>XP Progress</span>
          <span>{xp} / {nextLevelXp}</span>
        </div>
        <div className="w-full bg-blue-300 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      <div className="text-blue-200 text-xs text-center">
        {nextLevelXp - xp} XP to next level
      </div>
    </div>
  );
}
