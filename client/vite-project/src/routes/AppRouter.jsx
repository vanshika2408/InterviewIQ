import { BrowserRouter, Route, Routes } from "react-router-dom";

import PublicLayout from "@/components/layouts/PublicLayout";
import AppLayout from "@/components/layouts/AppLayout";

import Landing from "@/features/auth/pages/Landing";
import Features from "@/features/auth/pages/Features";
import Pricing from "@/features/auth/pages/Pricing";
import About from "@/features/auth/pages/About";
import Contact from "@/features/auth/pages/Contact";
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import VerifyEmail from "@/features/auth/pages/VerifyEmail";

import Dashboard from "@/features/dashboard/pages/Dashboard";
import Interviews from "@/features/interview/pages/Interviews";
import SelectInterview from "@/features/interview/pages/SelectInterview";
import InterviewLobby from "@/features/interview/pages/InterviewLobby";
import LiveInterview from "@/features/interview/pages/LiveInterview";
import InterviewResults from "@/features/interview/pages/InterviewResults";
import Performance from "@/features/analytics/pages/Performance";
import Resume from "@/features/resume/pages/Resume";
import Profile from "@/features/profile/pages/Profile";
import Settings from "@/features/settings/pages/Settings";
import Leaderboard from "@/features/leaderboard/pages/Leaderboard";

import ProtectedRoute from "@/components/common/ProtectedRoute";
import CodingInterview from "@/features/interview/pages/CodingInterview";
import VoiceInterview from "@/features/interview/pages/VoiceInterview";
import Certificates from "@/features/certificates/pages/Certificates";
import Gamification from "@/features/gamification/pages/Gamification";
import Admin from "@/features/admin/pages/Admin";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>

        {/* Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/select-interview" element={<SelectInterview />} />
          <Route path="/interview/lobby" element={<InterviewLobby />} />
          <Route path="/interview/live" element={<LiveInterview />} />
          <Route path="/interview/results" element={<InterviewResults />} />
          <Route path="/analytics/performance" element={<Performance />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/interview/coding" element={<CodingInterview />} />
          <Route path="/interview/voice" element={<VoiceInterview />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/achievements" element={<Gamification />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        </Route>
      
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;