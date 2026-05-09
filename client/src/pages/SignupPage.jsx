import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import AuthShell from "../components/layout/AuthShell";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "member"]),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().optional()
});

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", role: "member", phone: "", jobTitle: "", department: "", bio: "" }
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values) => {
    try {
      const data = await signup(values);
      toast.success(data.message || "Signup successful. Verify OTP.");
      navigate("/verify-otp", { state: { email: data.email || values.email } });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <AuthShell title="Create account" subtitle="Create your secure TeamFlow workspace.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Full name</label><Input autoComplete="name" placeholder="Your full name" {...register("name")} />{errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}</div>
        <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Email</label><Input autoComplete="email" placeholder="example@gmail.com" {...register("email")} />{errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}</div>
        <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Password</label><div className="relative"><Input autoComplete="new-password" type={showPassword ? "text" : "password"} placeholder="Create a secure password" {...register("password")} /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle password">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>{errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}</div>
        <div className="grid gap-2 md:grid-cols-2"><div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Role</label><select className="h-11 w-full rounded-lg border border-border bg-input px-3 text-sm" {...register("role")}><option value="member">Member</option><option value="admin">Admin</option></select></div><div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Phone</label><Input placeholder="+91 9876543210" {...register("phone")} /></div><div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Job title</label><Input placeholder="Software Engineer" {...register("jobTitle")} /></div><div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Department</label><Input placeholder="Engineering" {...register("department")} /></div></div>
        <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Bio</label><textarea className="min-h-20 w-full rounded-lg border border-border bg-input p-3 text-sm" placeholder="Tell us about your role..." {...register("bio")} /></div>
        <Button className="w-full" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</Button>
        <p className="text-sm text-muted-foreground">Already have an account? <Link className="text-indigo-300 hover:text-indigo-200" to="/login">Login</Link></p>
      </form>
    </AuthShell>
  );
}
