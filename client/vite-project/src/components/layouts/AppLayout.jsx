import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <div className="min-w-0 flex-1">
        <AppTopbar />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;