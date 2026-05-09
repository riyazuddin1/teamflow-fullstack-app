import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import AuthShell from "../components/layout/AuthShell";
import { useAuth } from "../context/AuthContext";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp, isAuthenticated } = useAuth();

  const prefilledEmail = useMemo(() => location.state?.email || "", [location.state]);

  const [email, setEmail] = useState(prefilledEmail);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  const onVerify = async (e) => {
    e.preventDefault();
    if (!email || otp.length !== 6) {
      toast.error("Enter valid email and 6-digit OTP");
      return;
    }

    try {
      setIsSubmitting(true);
      await verifyOtp({ email, otp });
      toast.success("Account verified successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResend = async () => {
    if (!email) return toast.error("Enter email first");
    try {
      setIsResending(true);
      const data = await resendOtp(email);
      toast.success(data.message || "OTP resent");
      setCountdown(30);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell title="Verify your account" subtitle="Enter the 6-digit OTP sent to your email.">
      <form onSubmit={onVerify} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">OTP</label>
          <Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter 6-digit code" maxLength={6} />
        </div>

        <Button className="w-full" disabled={isSubmitting}>{isSubmitting ? "Verifying..." : "Verify OTP"}</Button>

        <Button type="button" variant="outline" className="w-full" onClick={onResend} disabled={isResending || countdown > 0}>
          {isResending ? "Resending..." : countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
        </Button>
      </form>
    </AuthShell>
  );
}
