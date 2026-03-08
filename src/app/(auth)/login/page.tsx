"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signInWithGoogle, resetPassword } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign in";
      if (message.includes("user-not-found") || message.includes("wrong-password") || message.includes("invalid-credential")) {
        setError("Invalid email or password");
      } else if (message.includes("too-many-requests")) {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (!message.includes("popup-closed-by-user")) {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email address first");
      return;
    }
    setError("");

    try {
      await resetPassword(email);
      setResetSent(true);
    } catch {
      setError("Could not send reset email. Check the address and try again.");
    }
  }

  const isFormDisabled = loading || googleLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Subtle grid background */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(0,229,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(rgba(45,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,255,0.03)_1px,transparent_1px)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lynq-accent shadow-lg shadow-lynq-accent/20">
            <Zap className="h-5 w-5 text-lynq-accent-foreground" />
          </div>
          <div>
            <h1 className="text-center text-xl font-semibold tracking-tight text-foreground">
              Lyn
              <span className="relative">
                q
                <span className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full bg-lynq-accent" />
              </span>
            </h1>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Sign in to your backoffice
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="mb-4 w-full gap-2"
            disabled={isFormDisabled}
            onClick={handleGoogleSignIn}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isFormDisabled}
                className="pl-9"
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isFormDisabled}
                className="pl-9 pr-9"
                autoComplete="current-password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-danger"
              >
                {error}
              </motion.p>
            )}

            {resetSent && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-success"
              >
                Password reset email sent. Check your inbox.
              </motion.p>
            )}

            <Button type="submit" className="w-full" disabled={isFormDisabled}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </Button>
          </form>

          <button
            type="button"
            className="mt-3 w-full text-center text-xs text-muted-foreground transition hover:text-lynq-accent"
            onClick={handleForgotPassword}
            disabled={isFormDisabled}
          >
            Forgot password?
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span className="text-lynq-accent">Contact your admin</span>
        </p>
      </motion.div>
    </div>
  );
}
