export default function HeroSection() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-8 translate-x-8"></div>
      <div className="absolute bottom-0 right-20 w-20 h-20 bg-white opacity-5 rounded-full translate-y-4"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {greeting}, Alex! 👋
            </h1>
            <p className="text-purple-100 mb-6 text-lg">
              Ready to crush your study goals today? Let's make progress together!
            </p>
            
            {/* Quick stats */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="text-sm text-purple-100">Goals Today</p>
                  <p className="font-semibold">4 of 6</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-sm text-purple-100">Study Streak</p>
                  <p className="font-semibold">7 days</p>
                </div>
              </div>
            </div>

            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg">
              Join New Study Group
            </button>
          </div>
          
          {/* Hero illustration/avatar */}
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-6xl">📚</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
