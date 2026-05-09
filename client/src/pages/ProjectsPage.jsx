import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";

const emptyForm = { title: "", description: "", dueDate: "", status: "Planning", members: [] };

export default function ProjectsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const params = useMemo(() => ({ search, status, sortBy: "dueDate", sortOrder, limit: 100 }), [search, status, sortOrder]);

  const load = async () => {
    try {
      setLoading(true);
      const projectRes = await api.get("/projects", { params });
      setProjects(projectRes.data.items);
      if (isAdmin) {
        const usersRes = await api.get("/users");
        setMembers(usersRes.data.filter((u) => u.role === "member"));
      }
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [params.search, params.status, params.sortOrder, isAdmin]);

  const openCreate = () => {
    setEditingProject(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setForm({
      title: project.title || "",
      description: project.description || "",
      dueDate: project.dueDate ? new Date(project.dueDate).toISOString().slice(0, 10) : "",
      status: project.status || "Planning",
      members: (project.members || []).map((m) => m._id)
    });
    setShowModal(true);
  };

  const saveProject = async () => {
    if (!form.title.trim()) return toast.error("Project title is required");
    try {
      const payload = { title: form.title.trim(), description: form.description, dueDate: form.dueDate || null, status: form.status, members: form.members };
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, payload);
        toast.success("Project updated");
      } else {
        await api.post("/projects", payload);
        toast.success("Project created");
      }
      setShowModal(false);
      setForm(emptyForm);
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save project");
    }
  };

  const deleteProject = async (project) => {
    const ok = window.confirm(`Delete project \"${project.title}\"?`);
    if (!ok) return;
    try {
      await api.delete(`/projects/${project._id}`);
      toast.success("Project deleted");
      load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const toggleMember = (id) => {
    setForm((prev) => ({ ...prev, members: prev.members.includes(id) ? prev.members.filter((m) => m !== id) : [...prev.members, id] }));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-border/70 bg-card/90 p-4 lg:grid-cols-[1fr_180px_180px_auto]">
        <Input placeholder="Search projects" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="h-11 rounded-lg border border-border bg-input px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option><option>Planning</option><option>Active</option><option>On Hold</option><option>Completed</option>
        </select>
        <select className="h-11 rounded-lg border border-border bg-input px-3 text-sm" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Due date desc</option><option value="asc">Due date asc</option>
        </select>
        {isAdmin && <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Create Project</Button>}
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="px-4 py-3">Project</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Due date</th><th className="px-4 py-3">Members</th>{isAdmin && <th className="px-4 py-3">Actions</th>}</tr>
          </thead>
          <tbody>
            {loading && [...Array(4)].map((_, i) => <tr key={i} className="border-t border-border/60"><td className="px-4 py-4" colSpan={isAdmin ? 5 : 4}><div className="h-4 animate-pulse rounded bg-muted" /></td></tr>)}
            {!loading && projects.length === 0 && <tr className="border-t border-border/60"><td className="px-4 py-6 text-muted-foreground" colSpan={isAdmin ? 5 : 4}>No projects found.</td></tr>}
            {projects.map((project) => (
              <motion.tr key={project._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border/60 hover:bg-muted/10">
                <td className="px-4 py-3"><p className="font-medium">{project.title}</p><p className="text-xs text-muted-foreground">{project.description || "No description"}</p></td>
                <td className="px-4 py-3"><Badge tone="info">{project.status}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground">{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "Not set"}</td>
                <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{(project.members || []).slice(0, 3).map((m) => <Badge key={m._id} tone="default">{m.name}</Badge>)}</div></td>
                {isAdmin && <td className="px-4 py-3"><div className="flex gap-2"><Button variant="outline" className="h-8 px-2" onClick={() => openEdit(project)}><Edit3 size={14} /></Button><Button variant="outline" className="h-8 px-2" onClick={() => deleteProject(project)}><Trash2 size={14} /></Button></div></td>}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </Card>

      {!isAdmin && projects.length === 0 && <Card className="text-center text-sm text-muted-foreground">No projects assigned yet.</Card>}

      {showModal && isAdmin && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <Card className="w-full max-w-2xl">
            <h3 className="text-xl font-semibold">{editingProject ? "Edit project" : "Create project"}</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2"><label className="mb-1 block text-xs text-muted-foreground">Title</label><Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></div>
              <div className="md:col-span-2"><label className="mb-1 block text-xs text-muted-foreground">Description</label><textarea className="min-h-24 w-full rounded-lg border border-border bg-input p-3 text-sm" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></div>
              <div><label className="mb-1 block text-xs text-muted-foreground">Due Date</label><Input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} /></div>
              <div><label className="mb-1 block text-xs text-muted-foreground">Status</label><select className="h-11 w-full rounded-lg border border-border bg-input px-3 text-sm" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}><option>Planning</option><option>Active</option><option>On Hold</option><option>Completed</option></select></div>
              <div className="md:col-span-2"><label className="mb-1 block text-xs text-muted-foreground">Members</label><div className="grid max-h-40 grid-cols-2 gap-2 overflow-auto rounded-lg border border-border p-2">{members.map((member) => <label key={member._id} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted/20"><input type="checkbox" checked={form.members.includes(member._id)} onChange={() => toggleMember(member._id)} /><span className="text-sm">{member.name}</span></label>)}</div></div>
            </div>
            <div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={saveProject}>{editingProject ? "Save changes" : "Create project"}</Button></div>
          </Card>
        </div>
      )}
    </div>
  );
}
