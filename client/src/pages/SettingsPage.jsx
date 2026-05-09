import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-semibold">Workspace settings</h2>
        <p className="mt-2 text-sm text-muted-foreground">Manage deployment URLs and workspace defaults.</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-medium">Theme</h3>
          <p className="mt-1 text-sm text-muted-foreground">Dark premium theme is enabled by default.</p>
          <Button variant="outline" className="mt-4">Theme options</Button>
        </Card>
        <Card>
          <h3 className="font-medium">Integrations</h3>
          <p className="mt-1 text-sm text-muted-foreground">Connect Railway and Vercel deployment environments.</p>
          <Button variant="outline" className="mt-4">Configure</Button>
        </Card>
      </div>
    </div>
  );
}
