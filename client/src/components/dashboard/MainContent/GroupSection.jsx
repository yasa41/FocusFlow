import { FiPlus, FiGrid, FiList } from 'react-icons/fi';
import GroupCard from './GroupCard';

export default function GroupsSection({ groups }) { // ✅ Accept groups prop
  // ✅ Use real API data - combine owned and member groups
  const allGroups = [
    ...(groups?.memberOf || []),
    ...(groups?.owned || [])
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">My Study Groups</h2>
          <p className="text-gray-600 mt-1">
            Track progress with your study buddies • {allGroups.length} active groups
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
        
          
          {/* Create Group Button */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm">
            <FiPlus className="w-4 h-4" />
            <span className="font-medium">Create Group</span>
          </button>
        </div>
      </div>

      {/* Groups Grid - Uses real API data */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allGroups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      {/* Empty State - Show when no groups */}
      {allGroups.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiGrid className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No study groups yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first study group to start collaborating with others.
          </p>
         
        </div>
      )}
    </section>
  );
}
