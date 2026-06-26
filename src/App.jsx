import { Routes, Route } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RoleSelection from "./pages/RoleSelection";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import AddProduct from "./pages/AddProduct";
import Opportunities from "./pages/Opportunities";
import PostOpportunity from "./pages/PostOpportunity";
import OpportunityDetail from "./pages/OpportunityDetail";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/post-opportunity" element={<PostOpportunity />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={ <Chat /> } />
        <Route path="/chat/:conversationId" element={<Chat />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;