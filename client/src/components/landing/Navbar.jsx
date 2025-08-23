import { FiBook, FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { scrollToSection } from "../../hooks/smoothScroll";

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <nav className="fixed z-50 w-full bg-white/90 backdrop-blur-lg border-b border-gray-200 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FiBook className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">StudySync</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, "how-it-works")}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              How it Works
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={handleLogin}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/90 backdrop-blur-lg">
            <div className="flex flex-col space-y-3">
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, "features")}
                className="text-gray-600 hover:text-gray-900 font-medium py-2 px-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, "how-it-works")}
                className="text-gray-600 hover:text-gray-900 font-medium py-2 px-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                How it Works
              </a>

              {/* Action Buttons */}
              <div className="pt-3 mt-2 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => {
                    handleLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 text-gray-700 font-medium border border-gray-300 bg-white hover:bg-gray-50 rounded-lg transition-colors text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    handleGetStarted();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg text-center hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
