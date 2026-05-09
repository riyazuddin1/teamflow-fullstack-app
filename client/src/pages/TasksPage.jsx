import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit3, List, Plus, Rows3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";

const statusTone = { Todo: "default", "In Progress": "info", Review: "warning", Completed: "success", Overdue: "danger" };
const emptyForm = { title: "", description: "", project: "", assignedTo: "", priority: "Medium", status: "Todo", dueDate: "" };

export default function TasksPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("table");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState({ search: "", status: "", priority: "", page: 1 });

  const query = useMemo(() => ({ ...filters, limit: 100 }), [filters]);

  const load = async () => {
    try {
      setLoading(true);
      const [taskRes, projRes] = await Promise.all([api.get("/tasks", { params: query }), api.get("/projects", { params: { limit: 100 } })]);
      setTasks(taskRes.data.items);
      setProjects(projRes.data.items);

      if (isAdmin) {
        const userRes = await api.get("/users");
        setMembers(userRes.data.filter((u) => u.role === "member"));
      } else {
        setMembers([]);
      }
    } catch {
      toast.error("Failed to load tasks data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [query.search, query.status, query.priority, query.page, isAdmin]);

  const openCreate = () => { setEditingTask(null); setForm(emptyForm); setShowModal(true); };

  const openEdit = (task) => {
    if (!isAdmin) return;
    setEditingTask(task);
    setForm({ title: task.title || "", description: task.description || "", project: task.project?._id || "", assignedTo: task.assignedTo?._id || "", priority: task.priority || "Medium", status: task.status || "Todo", dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "" });
    setShowModal(true);
  };

  const saveTask = async () => {
    if (!form.title.trim() || !form.project || !form.assignedTo) return toast.error("Title, project and assignee are required");
    try {
      const payload = { ...form, title: form.title.trim(), dueDate: form.dueDate || null };
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, payload);
        toast.success("Task updated");
      } else {
        await api.post("/tasks", payload);
        toast.success("Task created");
      }
      setShowModal(false);
      setForm(emptyForm);
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save task");
    }
  };

  const deleteTask = async (task) => {
    const ok = window.confirm(`Delete task \"${task.title}\"?`);
    if (!ok) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success("Task deleted");
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Status update failed");
    }
  };

  const kanbanColumns = ["Todo", "In Progress", "Review", "Completed"];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-border/70 bg-card/90 p-4 lg:grid-cols-[1fr_170px_170px_auto_auto]">
        <Input placeholder="Search tasks" value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))} />
        <select className="h-11 rounded-lg border border-border bg-input px-3 text-sm" value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value, page: 1 }))}><option value="">All statuses</option><option>Todo</option><option>In Progress</option><option>Review</option><option>Completed</option><option>Overdue</option></select>
        <select className="h-11 rounded-lg border border-border bg-input px-3 text-sm" value={filters.priority} onChange={(e) => setFilters((p) => ({ ...p, priority: e.target.value, page: 1 }))}><option value="">All priorities</option><option>Low</option><option>Medium</option><option>High</option></select>
        <div className="flex gap-2"><Button variant={view === "table" ? "default" : "outline"} className="h-11 px-3" onClick={() => setView("table")}><List size={15} /></Button><Button variant={view === "kanban" ? "default" : "outline"} className="h-11 px-3" onClick={() => setView("kanban")}><Rows3 size={15} /></Button></div>
        {isAdmin && <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Create Task</Button>}
      </div>

      {view === "table" ? (
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-4 py-3">Task</th><th className="px-4 py-3">Project</th><th className="px-4 py-3">Assignee</th><th className="px-4 py-3">Priority</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Due</th>{isAdmin && <th className="px-4 py-3">Actions</th>}</tr>
            </thead>
            <tbody>
              {loading && [...Array(5)].map((_, i) => <tr key={i} className="border-t border-border/60"><td className="px-4 py-4" colSpan={isAdmin ? 7 : 6}><div className="h-4 animate-pulse rounded bg-muted" /></td></tr>)}
              {!loading && tasks.length === 0 && <tr className="border-t border-border/60"><td className="px-4 py-6 text-muted-foreground" colSpan={isAdmin ? 7 : 6}>No tasks found.</td></tr>}
              {tasks.map((task) => {
                const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed";
                return (
                  <motion.tr key={task._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border/60 hover:bg-muted/10">
                    <td className="px-4 py-3"><p className="font-medium">{task.title}</p><p className="text-xs text-muted-foreground line-clamp-1">{task.description || "No description"}</p></td>
                    <td className="px-4 py-3">{task.project?.title}</td>
                    <td className="px-4 py-3">{task.assignedTo?.name}</td>
                    <td className="px-4 py-3"><Badge tone={task.priority === "High" ? "danger" : task.priority === "Medium" ? "warning" : "info"}>{task.priority}</Badge></td>
                    <td className="px-4 py-3"><select className="h-9 rounded-lg border border-border bg-input px-2 text-sm" value={task.status} onChange={(e) => updateStatus(task._id, e.target.value)}><option>Todo</option><option>In Progress</option><option>Review</option><option>Completed</option><option>Overdue</option></select></td>
                    <td className={`px-4 py-3 text-xs ${overdue ? "text-rose-400" : "text-muted-foreground"}`}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}</td>
                    {isAdmin && <td className="px-4 py-3"><div className="flex gap-2"><Button variant="outline" className="h-8 px-2" onClick={() => openEdit(task)}><Edit3 size={14} /></Button><Button variant="outline" className="h-8 px-2" onClick={() => deleteTask(task)}><Trash2 size={14} /></Button></div></td>}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-4">
          {kanbanColumns.map((status) => (
            <Card key={status}>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">{status}</h3>
              <div className="space-y-2">
                {tasks.filter((task) => task.status === status).map((task) => (
                  <div key={task._id} className="rounded-xl border border-border/70 bg-muted/20 p-3 text-sm">
                    <p className="font-medium">{task.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{task.assignedTo?.name}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge tone={task.priority === "High" ? "danger" : task.priority === "Medium" ? "warning" : "info"}>{task.priority}</Badge>
                      {isAdmin && <button className="text-xs text-indigo-300 hover:text-indigo-200" onClick={() => openEdit(task)}>Edit</button>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && isAdmin && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <Card className="w-full max-w-2xl">
            <h3 className="text-xl font-semibold">{editingTask ? "Edit task" : "Create task"}</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2"><label className="mb-1 block text-xs text-muted-foreground">Title</label><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></div>
              <div className="md:col-span-2"><label className="mb-1 block text-xs text-muted-foreground">Description</label><textarea className="min-h-24 w-full rounded-lg border border-border bg-input p-3 text-sm" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></div>
              <div><label className="mb-1 block text-xs text-muted-foreground">Project</label><select className="h-11 w-full rounded-lg border border-border bg-input px-3 text-sm" value={form.project} onChange={(e) => setForm((p) => ({ ...p, project: e.target.value }))}><option value="">Select project</option>{projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}</select></div>
              <div><label className="mb-1 block text-xs text-muted-foreground">Assignee</label><select className="h-11 w-full rounded-lg border border-border bg-input px-3 text-sm" value={form.assignedTo} onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value }))}><option value="">Select assignee</option>{members.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}</select></div>
              <div><label className="mb-1 block text-xs text-muted-foreground">Priority</label><select className="h-11 w-full rounded-lg border border-border bg-input px-3 text-sm" value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}><option>Low</option><option>Medium</option><option>High</option></select></div>
              <div><label className="mb-1 block text-xs text-muted-foreground">Status</label><select className="h-11 w-full rounded-lg border border-border bg-input px-3 text-sm" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}><option>Todo</option><option>In Progress</option><option>Review</option><option>Completed</option></select></div>
              <div><label className="mb-1 block text-xs text-muted-foreground">Due Date</label><Input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} /></div>
            </div>
            <div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={saveTask}>{editingTask ? "Save changes" : "Create task"}</Button></div>
          </Card>
        </div>
      )}
    </div>
  );
}
