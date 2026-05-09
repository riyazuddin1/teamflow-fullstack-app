import { useEffect, useState } from "react";
import { Edit3, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Avatar from "../components/common/Avatar";
import { useAuth } from "../context/AuthContext";

const emptyForm = { name: "", role: "member", phone: "", jobTitle: "", department: "", bio: "" };

export default function TeamPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const isAdmin = user?.role === "admin";

  const loadUsers = async () => {
    if (!isAdmin) return;
    const res = await api.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, [isAdmin]);

  const openEdit = (member) => {
    setEditingUser(member);
    setForm({
      name: member.name || "",
      role: member.role || "member",
      phone: member.phone || "",
      jobTitle: member.jobTitle || "",
      department: member.department || "",
      bio: member.bio || ""
    });
    setShowModal(true);
  };

  const saveMember = async () => {
    try {
      await api.put(`/users/${editingUser._id}`, form);
      toast.success("Team member updated");
      setShowModal(false);
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update member");
    }
  };

  const deleteMember = async (member) => {
    const ok = window.confirm(`Delete team member \"${member.name}\"?`);
    if (!ok) return;

    try {
      await api.delete(`/users/${member._id}`);
      toast.success("Team member deleted");
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete member");
    }
  };

  if (!isAdmin) {
    return <Card className="text-center text-sm text-muted-foreground">Team management is available for admins only.</Card>;
  }

  return (
    <div className="space-y-4">
      <Card className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Team members</h2>
          <p className="text-sm text-muted-foreground">Manage member accounts, roles, and profile details.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users size={14} /> {users.length} people</div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {users.filter((u) => u.role === "member").map((u) => (
          <Card key={u._id} className="hover:-translate-y-1 hover:border-indigo-500/40">
            <div className="flex items-center gap-3">
              <Avatar name={u.name} />
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
            </div>
            <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{u.role}</p>
            <p className="mt-2 text-xs text-muted-foreground">{u.jobTitle || "No role title"}</p>

            <div className="mt-3 flex gap-2">
              <Button variant="outline" className="h-8 px-2" onClick={() => openEdit(u)}><Edit3 size={14} /></Button>
              <Button variant="outline" className="h-8 px-2" onClick={() => deleteMember(u)}><Trash2 size={14} /></Button>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <Card className="w-full max-w-2xl">
            <h3 className="text-xl font-semibold">Edit team member</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div><label className="mb-1 block text-xs text-muted-foreground">Name</label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
              <div><label className="mb-1 block text-xs text-muted-foreground">Role</label><select className="h-11 w-full rounded-lg border border-border bg-input px-3 text-sm" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}><option value="member">Member</option><option value="admin">Admin</option></select></div>
              <div><label className="mb-1 block text-xs text-muted-foreground">Phone</label><Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></div>
              <div><label className="mb-1 block text-xs text-muted-foreground">Job title</label><Input value={form.jobTitle} onChange={(e) => setForm((p) => ({ ...p, jobTitle: e.target.value }))} /></div>
              <div><label className="mb-1 block text-xs text-muted-foreground">Department</label><Input value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} /></div>
              <div className="md:col-span-2"><label className="mb-1 block text-xs text-muted-foreground">Bio</label><textarea className="min-h-20 w-full rounded-lg border border-border bg-input p-3 text-sm" value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} /></div>
            </div>

            <div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button><Button onClick={saveMember}>Save changes</Button></div>
          </Card>
        </div>
      )}
    </div>
  );
}
