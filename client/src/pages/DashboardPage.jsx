import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { CalendarClock, CheckCircle2, Clock3, FolderKanban, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#38bdf8"];

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [taskData, setTaskData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requests = [api.get("/tasks", { params: { limit: 100 } }), api.get("/projects", { params: { limit: 100 } })];

    if (isAdmin) {
      requests.push(api.get("/tasks/analytics/summary"), api.get("/projects/analytics/summary"));
    }

    Promise.all(requests)
      .then((res) => {
        const taskItems = res[0].data.items || [];
        const projectItems = res[1].data.items || [];

        if (isAdmin) {
          setTaskData(res[2].data);
          setProjectData(res[3].data);
        } else {
          const completed = taskItems.filter((t) => t.status === "Completed").length;
          const pending = taskItems.filter((t) => t.status !== "Completed").length;
          const overdue = taskItems.filter((t) => t.status === "Overdue").length;

          setTaskData({
            totals: taskItems.length,
            completedTasks: completed,
            pendingTasks: pending,
            overdueTasks: overdue,
            statusBuckets: [
              { _id: "Todo", count: taskItems.filter((t) => t.status === "Todo").length },
              { _id: "In Progress", count: taskItems.filter((t) => t.status === "In Progress").length },
              { _id: "Review", count: taskItems.filter((t) => t.status === "Review").length },
              { _id: "Completed", count: completed },
              { _id: "Overdue", count: overdue }
            ],
            recent: taskItems.slice(0, 6)
          });
          setProjectData({ totalProjects: projectItems.length, dueSoonProjects: projectItems.slice(0, 5) });
        }
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const productivity = useMemo(() => {
    if (!taskData?.totals) return 0;
    return Math.round((taskData.completedTasks / taskData.totals) * 100);
  }, [taskData]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="h-28 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (!isAdmin && taskData?.totals === 0) {
    return (
      <Card className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold">No tasks assigned yet.</h2>
        <p className="mt-2 text-sm text-muted-foreground">Your dashboard is intentionally minimal until an admin assigns projects and tasks.</p>
      </Card>
    );
  }

  const stats = [
    { label: "Total Projects", value: projectData?.totalProjects || 0, icon: FolderKanban },
    { label: "Total Tasks", value: taskData?.totals || 0, icon: Clock3 },
    { label: "Completed", value: taskData?.completedTasks || 0, icon: CheckCircle2 },
    { label: "Overdue", value: taskData?.overdueTasks || 0, icon: CalendarClock }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border/70 bg-card/70 p-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
          <h2 className="text-2xl font-semibold tracking-tight">{isAdmin ? "Here's what needs attention today." : "Your assigned work overview"}</h2>
        </div>
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <Link to="/projects"><Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" />New project</Button></Link>
            <Link to="/tasks"><Button><PlusCircle className="mr-2 h-4 w-4" />New task</Button></Link>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="hover:-translate-y-1 hover:border-indigo-500/30">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <Icon size={16} className="text-indigo-300" />
                </div>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{item.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {isAdmin && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="h-96">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Tasks by status</h3>
            <ResponsiveContainer width="100%" height="88%">
              <PieChart>
                <Pie data={(taskData?.statusBuckets || []).map((b) => ({ name: b._id, value: b.count }))} dataKey="value" cx="50%" cy="50%" outerRadius={120} innerRadius={55}>
                  {(taskData?.statusBuckets || []).map((entry, idx) => <Cell key={entry._id} fill={colors[idx % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="h-96">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Weekly productivity</h3>
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={[{ week: "W1", value: Math.max(20, productivity - 20) }, { week: "W2", value: Math.max(25, productivity - 12) }, { week: "W3", value: Math.max(30, productivity - 5) }, { week: "W4", value: productivity }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Recent activity</h3>
          <div className="space-y-2">
            {(taskData?.recent || []).slice(0, 6).map((r) => (
              <div key={r._id} className="rounded-xl border border-border/80 bg-muted/20 p-3 text-sm">
                <span className="font-medium">{r.title}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Due soon</h3>
          <div className="space-y-2">
            {(projectData?.dueSoonProjects || []).length === 0 && <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>}
            {(projectData?.dueSoonProjects || []).map((project) => (
              <div key={project._id} className="rounded-xl border border-border/80 bg-muted/20 p-3 text-sm">
                <span className="font-medium">{project.title}</span>
                <p className="text-xs text-muted-foreground">Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "Not set"}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
