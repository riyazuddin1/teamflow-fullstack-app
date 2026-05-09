import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle2, Layers3, Lock, Sparkles, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const features = [
  { icon: Users, title: "Role-based Management", text: "Control access for admins and contributors with strict enterprise permissions." },
  { icon: BarChart3, title: "Analytics Dashboard", text: "Track velocity, overdue work, and productivity from executive-ready insights." },
  { icon: Layers3, title: "Task Tracking", text: "Manage priorities, statuses, assignees, and deadlines with full transparency." },
  { icon: Lock, title: "Secure Authentication", text: "JWT-protected APIs with robust backend authorization and validation." },
  { icon: Sparkles, title: "Premium UX", text: "Fast, responsive interface crafted for high-performing teams." },
  { icon: CheckCircle2, title: "Delivery Workflow", text: "Move work from idea to completion with structured execution stages." }
];

const workflow = ["Create project", "Assign tasks", "Track progress", "Deliver faster"];

export default function LandingPage() {
  return (
    <div className="text-foreground">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.32),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.26),transparent_38%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 md:px-6 lg:pt-14">
          <div className="mb-12 flex items-center justify-between">
            <Link to="/" className="text-2xl font-semibold tracking-tight text-indigo-300">TeamFlow</Link>
            <div className="flex gap-2">
              <Link to="/login"><Button variant="outline">Sign in</Button></Link>
              <Link to="/signup"><Button>Get started</Button></Link>
            </div>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Enterprise Team Collaboration Simplified</h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">Manage projects, assign tasks, and track team productivity with secure role-based workflows.</p>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">TeamFlow is built for organizations that need strict access controls without sacrificing speed and usability. It helps leadership maintain visibility while enabling teams to execute with clarity.</p>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">From project planning to delivery metrics, every workflow is structured to reduce confusion, prevent data leakage, and keep teams aligned on outcomes.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/signup"><Button className="px-6">Get Started</Button></Link>
                <Link to="/login"><Button variant="outline" className="px-6">Enter Workspace</Button></Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-3xl border border-border/70 bg-card/70 p-4 shadow-2xl shadow-indigo-950/30 backdrop-blur">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop" alt="Dashboard preview" className="h-[360px] w-full rounded-2xl object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="text-3xl font-semibold tracking-tight">Everything your team needs</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => {
            const Icon = item.icon;
            return <Card key={item.title} className="hover:-translate-y-1 hover:border-indigo-500/40"><Icon size={20} className="text-indigo-300" /><p className="mt-3 font-medium">{item.title}</p><p className="mt-1 text-sm text-muted-foreground">{item.text}</p></Card>;
          })}
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/20"><div className="mx-auto max-w-7xl px-4 py-16 md:px-6"><h2 className="text-3xl font-semibold tracking-tight">Workflow that keeps teams aligned</h2><div className="mt-8 grid gap-4 md:grid-cols-4">{workflow.map((step, idx) => <Card key={step}><p className="text-xs uppercase tracking-wide text-indigo-300">Step {idx + 1}</p><p className="mt-2 font-medium">{step}</p></Card>)}</div></div></section>

      <footer className="border-t border-border/60 bg-card/20"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6"><p>© {new Date().getFullYear()} TeamFlow. Built for modern teams.</p><div className="flex gap-4"><Link to="/signup" className="hover:text-indigo-300">Get started</Link><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-300">GitHub</a></div></div></footer>
    </div>
  );
}
