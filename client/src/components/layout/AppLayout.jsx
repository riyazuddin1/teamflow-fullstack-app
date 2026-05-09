import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import Avatar from "../common/Avatar";

const allLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "member"] },
  { to: "/projects", label: "Projects", icon: FolderKanban, roles: ["admin", "member"] },
  { to: "/tasks", label: "Tasks", icon: ListChecks, roles: ["admin", "member"] },
  { to: "/team", label: "Team", icon: Users, roles: ["admin"] },
  { to: "/analytics", label: "Analytics", icon: BarChart3, roles: ["admin"] },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["admin", "member"] }
];

const pageTitleMap = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/team": "Team",
  "/analytics": "Analytics",
  "/settings": "Settings",
  "/profile": "Profile"
};

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = allLinks.filter((link) => link.roles.includes(user?.role));
  const pageTitle = pageTitleMap[location.pathname] || "TeamFlow";

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      {open && <button className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setOpen(false)} aria-label="Close menu" />}
      <div className="flex">
        <aside
          className={`fixed left-0 top-0 z-30 h-full border-r border-border/70 bg-card/95 p-4 backdrop-blur-xl transition-all duration-300 md:sticky md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          } ${collapsed ? "w-[92px]" : "w-72"}`}
        >
          <div className="mb-6 flex items-center justify-between">
            <Link to="/dashboard" className="text-xl font-semibold tracking-tight text-indigo-300">
              {collapsed ? "TF" : "TeamFlow"}
            </Link>
            <div className="flex items-center gap-1">
              <Button variant="ghost" className="hidden md:inline-flex" onClick={() => setCollapsed((v) => !v)}>
                <ChevronRight size={16} className={collapsed ? "rotate-180" : ""} />
              </Button>
              <Button variant="ghost" className="md:hidden" onClick={() => setOpen(false)}>
                <X size={16} />
              </Button>
            </div>
          </div>

          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                      isActive ? "bg-primary text-white" : "text-foreground/90 hover:bg-muted"
                    }`
                  }
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={16} />
                    {!collapsed && link.label}
                  </span>
                  {!collapsed && <ChevronRight size={14} className="opacity-40 group-hover:opacity-90" />}
                </NavLink>
              );
            })}
          </nav>

          <button
            onClick={() => navigate("/profile")}
            className="mt-6 flex w-full items-center gap-3 rounded-xl border border-border/80 bg-muted/30 p-3 text-left text-sm hover:border-indigo-500/40"
          >
            <Avatar name={user?.name || "User"} size="sm" />
            {!collapsed && (
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs capitalize text-muted-foreground">{user?.role}</p>
              </div>
            )}
          </button>

          <Button variant="outline" className="mt-3 w-full" onClick={doLogout}>
            <LogOut className="mr-2 h-4 w-4" /> {!collapsed && "Logout"}
          </Button>
        </aside>

        <div className="w-full">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-xl md:px-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="md:hidden" onClick={() => setOpen((p) => !p)}>
                <Menu size={18} />
              </Button>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">TeamFlow Workspace</p>
                <p className="text-lg font-semibold tracking-tight text-indigo-200">{pageTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="hidden items-center gap-2 rounded-lg border border-border bg-input px-3 py-2 text-sm text-muted-foreground md:flex">
                <Search size={14} />
                <input placeholder="Search..." className="w-48 bg-transparent outline-none" />
              </label>
              <div className="relative">
                <Button variant="ghost" onClick={() => setShowNotifications((v) => !v)}>
                  <Bell size={16} />
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-card p-3 text-sm shadow-2xl">
                    <p className="font-medium">Notifications</p>
                    <p className="mt-2 text-muted-foreground">No new notifications. You are all caught up.</p>
                  </div>
                )}
              </div>
              <Avatar name={user?.name || "User"} size="sm" />
            </div>
          </header>

          <main className="fade-in p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
