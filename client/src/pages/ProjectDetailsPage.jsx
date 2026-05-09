import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { Card } from "../components/ui/card";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    api.get(`/projects/${id}`).then((res) => setProject(res.data));
  }, [id]);

  if (!project) return <Card className="h-20 animate-pulse bg-muted" />;

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-semibold">{project.title}</h2>
        <p className="mt-2 text-muted-foreground">{project.description || "No description"}</p>
      </Card>
      <Card>
        <h3 className="mb-2 text-sm text-muted-foreground">Members</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {project.members?.map((m) => (
            <div key={m._id} className="rounded-md border border-border p-3">
              <p>{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.email} - {m.role}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
