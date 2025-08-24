// App.js
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SlidingAuth from "./pages/SlidingAuth";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./components/Onboarding";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<SlidingAuth />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Catch-all route for 404 */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
