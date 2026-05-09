import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen bg-transparent lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-border/60 p-10 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.25),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.2),transparent_40%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <Link to="/" className="text-2xl font-semibold tracking-tight text-indigo-300">TeamFlow</Link>
            <p className="mt-2 text-sm text-muted-foreground">Collaborate. Track. Deliver.</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
            <p className="text-xl font-semibold">Build momentum with your team every day.</p>
            <p className="mt-2 text-sm text-muted-foreground">Plan projects, assign ownership, and track performance across your organization from one elegant workspace.</p>
          </motion.div>

          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">Built for modern teams that value velocity, clarity, and accountability across the full delivery lifecycle.</div>
        </div>
      </div>

      <div className="grid place-items-center px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full max-w-md rounded-2xl border border-border/70 bg-card/85 p-6 shadow-2xl shadow-indigo-950/20 backdrop-blur">
          <Link to="/" className="mb-6 block text-center text-2xl font-semibold text-indigo-300 lg:hidden">TeamFlow</Link>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-5">{children}</div>
          <p className="mt-6 text-center text-xs text-muted-foreground">By continuing, you agree to TeamFlow Terms and Privacy Policy.</p>
        </motion.div>
      </div>
    </div>
  );
}
