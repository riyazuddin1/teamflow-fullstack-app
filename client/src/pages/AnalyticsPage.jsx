import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../lib/api";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    if (user?.role !== "admin") return;
    Promise.all([api.get("/tasks/analytics/summary"), api.get("/projects/analytics/summary")]).then(([t, p]) => {
      setTasks(t.data);
      setProjects(p.data);
    });
  }, [user?.role]);

  if (user?.role !== "admin") {
    return <Card className="text-center text-sm text-muted-foreground">Analytics is available for admins only.</Card>;
  }

  if (!tasks || !projects) {
    return <div className="grid gap-4 md:grid-cols-2">{[...Array(4)].map((_, i) => <Card key={i} className="h-56 animate-pulse bg-muted" />)}</div>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="h-96"><h3 className="mb-4 text-sm text-muted-foreground">Task Distribution</h3><ResponsiveContainer width="100%" height="88%"><PieChart><Pie data={tasks.statusBuckets.map((b) => ({ name: b._id, value: b.count }))} dataKey="value" outerRadius={120} /><Tooltip /></PieChart></ResponsiveContainer></Card>
      <Card className="h-96"><h3 className="mb-4 text-sm text-muted-foreground">Priority Breakdown</h3><ResponsiveContainer width="100%" height="88%"><BarChart data={tasks.priorityBuckets.map((b) => ({ name: b._id, value: b.count }))}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip /><Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></Card>
      <Card><h3 className="mb-4 text-sm text-muted-foreground">Project Status</h3><div className="space-y-2">{projects.statusBuckets.map((s) => <div key={s._id} className="flex items-center justify-between rounded-lg border border-border/70 p-3"><p>{s._id}</p><p className="font-semibold">{s.count}</p></div>)}</div></Card>
      <Card><h3 className="mb-4 text-sm text-muted-foreground">Summary</h3><div className="space-y-2 text-sm"><p>Total Projects: <span className="font-semibold">{projects.totalProjects}</span></p><p>Total Tasks: <span className="font-semibold">{tasks.totals}</span></p><p>Completed Tasks: <span className="font-semibold">{tasks.completedTasks}</span></p><p>Pending Tasks: <span className="font-semibold">{tasks.pendingTasks}</span></p><p>Overdue Tasks: <span className="font-semibold">{tasks.overdueTasks}</span></p></div></Card>
    </div>
  );
}
