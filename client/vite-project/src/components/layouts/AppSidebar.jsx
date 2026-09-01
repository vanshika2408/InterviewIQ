import {
  Award,
  BarChart3,
  BookOpen,
  FileText,
  LayoutDashboard,
  Settings,
  Trophy,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Interviews",
    path: "/interviews",
    icon: BookOpen,
  },
  {
    label: "Performance",
    path: "/analytics/performance",
    icon: BarChart3,
  },
  {
    label: "Resume",
    path: "/resume",
    icon: FileText,
  },
  {
    label: "Leaderboard",
    path: "/leaderboard",
    icon: Trophy,
  },
  {
    label: "Certificates",
    path: "/certificates",
    icon: Award,
  },
  {
    label: "Achievements",
    path: "/achievements",
    icon: Award,
  },
];

const secondaryNavigation = [
  {
    label: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function AppSidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r bg-background md:flex md:flex-col">
      {/* Logo */}
      <div className="flex h-32 items-center border-b px-2 py-4">
        <NavLink to="/dashboard" className="flex items-center justify-center w-full">
          <img
            src="/logo.png"
            alt="InterviewIQ"
            className="h-28 w-full max-h-28 object-contain hover:opacity-90 transition-opacity"
          />
        </NavLink>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <nav className="space-y-1 border-t pt-4">
          {secondaryNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default AppSidebar;