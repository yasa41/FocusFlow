
export default function GroupCard({ group }) {
  
  
  // Use props data directly with fallbacks
  const progress = group?.progress || Math.floor(Math.random() * 100); // temp until API has progress
  const memberCount = group?.memberCount || 0;
  const groupName = group?.name || 'Study Group';
  const description = group?.description || 'Study group';
  const groupType = group?.type || 'study';
  const isOwner = group?.isOwner || false;
  const createdAt = group?.createdAt;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 transition-all duration-300 cursor-pointer group hover:shadow-md hover:-translate-y-0.5 hover:bg-blue-100">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          {/*  Direct icon usage */}
        
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
              {groupName}
            </h3>
            <p className="text-gray-600 text-sm truncate">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium capitalize">
            {groupType}
          </span>
          {/* Direct boolean check */}
          {isOwner && (
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
              Owner
            </span>
          )}
          <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/50 transition-all duration-200">
            <FiMoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Weekly Progress</span>
          <span className={`text-sm font-semibold ${
            progress >= 80 ? 'text-green-600' : 
            progress >= 60 ? 'text-blue-600' : 
            progress >= 40 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>This week</span>
          <span>{Math.round((progress / 100) * 10)}/10 goals</span>
        </div>
      </div>

      {/* Members and Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-gray-600">
            <FiUsers className="w-4 h-4" />
            <span className="text-sm font-medium">
              {memberCount} member{memberCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {/* ✅ Direct conditional rendering */}
        {createdAt && (
          <div className="flex items-center space-x-1 text-gray-500">
            <FiCalendar className="w-4 h-4" />
            <span className="text-xs">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
