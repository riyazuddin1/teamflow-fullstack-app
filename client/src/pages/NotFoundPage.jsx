import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Page not found.</p>
        <Link to="/dashboard" className="mt-4 inline-block"><Button>Go to dashboard</Button></Link>
      </div>
    </div>
  );
}
