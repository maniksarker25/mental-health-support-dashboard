import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  HeartIcon,
  ShieldCheckIcon,
  LockIcon,
  MailIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  SparklesIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Field';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();

  const [email, setEmail] = useState('admin@mentalhealth.org');
  const [password, setPassword] = useState('Anonymous2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard or prior requested page
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@mentalhealth.org');
    setPassword('Anonymous2026!');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4 sm:p-6 lg:p-8">
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden">
        <div className="h-[480px] w-[480px] rounded-full bg-primary/8 blur-3xl" />
        <div className="h-[360px] w-[360px] -translate-y-24 translate-x-32 rounded-full bg-accent/8 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-fg shadow-md shadow-primary/20">
            <HeartIcon className="h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Mental Health Anonymous</h1>
          <p className="text-xs text-subtle">
            Admin console for crisis dispatch, topic authoring, and telemetry
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-line pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Sign In</h2>
              <p className="text-[11.5px] text-subtle">Access your administrative account</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheckIcon className="h-3 w-3" /> Zero Retention
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email Address</Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                <Input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mentalhealth.org"
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="login-pass">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                <Input
                  id="login-pass"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="pl-9 pr-10 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-body select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-line text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full justify-center py-2.5 shadow-sm"
            >
              <span>{submitting ? 'Authenticating…' : 'Sign In to Console'}</span>
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div className="rounded-xl border border-line bg-canvas/80 p-3.5 space-y-2 text-center">
            <p className="text-[11px] text-subtle">
              Demo Credentials: <span className="font-mono text-ink font-semibold">admin@mentalhealth.org</span> / <span className="font-mono text-ink font-semibold">Anonymous2026!</span>
            </p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <SparklesIcon className="h-3 w-3" />
              Fill Demo Credentials
            </button>
          </div>
        </div>

        {/* Footer Security Notice */}
        <p className="text-center text-[11px] text-subtle">
          Protected by end-to-end ephemeral session authentication.
        </p>
      </div>
    </div>
  );
}
