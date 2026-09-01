import { Bell, LogOut, Menu, Moon, Sun, Settings, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/authSlice";

function AppTopbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    // Keep isDark state synchronized with document class changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const user = useSelector((state) => state.auth.user);

  const displayName = user?.name || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        className="rounded-md p-2 hover:bg-muted md:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden md:block">
        <p className="text-sm font-medium text-muted-foreground">
          InterviewIQ Practice Portal
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-md p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle Theme"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          type="button"
          className="relative rounded-md p-2 hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-foreground" />
        </button>

        <div className="relative ml-2">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium hover:bg-muted"
            aria-label="Open account menu"
          >
            {initial}
          </button>

          {open && (
            <div className="absolute right-0 top-11 z-50 w-48 rounded-xl border bg-background p-1.5 shadow-lg">
              <div className="border-b px-3 py-2.5">
                <p className="truncate text-sm font-medium">
                  {displayName}
                </p>

                {user?.email && (
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <User className="h-4 w-4" />
                Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppTopbar;