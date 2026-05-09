import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Avatar from "../components/common/Avatar";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", jobTitle: "", department: "", bio: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ name: user?.name || "", phone: user?.phone || "", jobTitle: user?.jobTitle || "", department: user?.department || "", bio: user?.bio || "" });
  }, [user]);

  const saveProfile = async () => {
    try {
      setSaving(true);
      await api.put("/users/me/update", form);
      toast.success("Profile updated. Please refresh to see latest profile context.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const deleteMyAccount = async () => {
    const ok = window.confirm("Delete your account permanently? This action cannot be undone.");
    if (!ok) return;

    try {
      await api.delete("/users/me/delete");
      toast.success("Account deleted");
      logout();
      window.location.href = "/login";
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <div className="flex flex-col items-center text-center">
          <Avatar name={user?.name || "User"} size="lg" />
          <h2 className="mt-3 text-xl font-semibold">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <h3 className="text-lg font-semibold">My Profile</h3>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div><label className="mb-1 block text-xs text-muted-foreground">Name</label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
          <div><label className="mb-1 block text-xs text-muted-foreground">Phone</label><Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></div>
          <div><label className="mb-1 block text-xs text-muted-foreground">Job title</label><Input value={form.jobTitle} onChange={(e) => setForm((p) => ({ ...p, jobTitle: e.target.value }))} /></div>
          <div><label className="mb-1 block text-xs text-muted-foreground">Department</label><Input value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} /></div>
          <div className="md:col-span-2"><label className="mb-1 block text-xs text-muted-foreground">Bio</label><textarea className="min-h-20 w-full rounded-lg border border-border bg-input p-3 text-sm" value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} /></div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2"><Button onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save profile"}</Button><Button variant="outline" onClick={deleteMyAccount}>Delete my account</Button></div>
      </Card>
    </div>
  );
}
