import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import CraftBackground from "../components/CraftBackground";
function MainLayout() {
  return (
    <div className="min-h-screen relative">
      <CraftBackground />
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 relative">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;