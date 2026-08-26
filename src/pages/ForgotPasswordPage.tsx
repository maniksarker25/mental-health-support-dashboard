import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartIcon,
  MailIcon,
  LockIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  KeyRoundIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Field';

type Step = 'request' | 'sent' | 'reset' | 'completed';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { sendResetEmail, resetPassword } = useAuth();

  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('admin@mentalhealth.org');
  const [code, setCode] = useState('988-247');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ok = await sendResetEmail(email);
      if (ok) {
        setStep('sent');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const ok = await resetPassword(code, newPassword);
      if (ok) {
        setStep('completed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4 sm:p-6 lg:p-8">
      {/* Background ambient light */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden">
        <div className="h-[480px] w-[480px] rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-fg shadow-md shadow-primary/20">
            <KeyRoundIcon className="h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Account Recovery</h1>
          <p className="text-xs text-subtle">
            Secure password reset for the Mental Health Admin Console
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-xl space-y-6">
          {/* STEP 1: REQUEST EMAIL */}
          {step === 'request' && (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <h2 className="font-display text-base font-bold text-ink">Reset Your Password</h2>
                <p className="text-[11.5px] text-subtle mt-0.5">
                  Enter your registered administrator email to receive a secure recovery code.
                </p>
              </div>

              <div>
                <Label htmlFor="recovery-email">Administrator Email</Label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                  <Input
                    id="recovery-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mentalhealth.org"
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full justify-center py-2.5">
                <span>{loading ? 'Sending link…' : 'Send Recovery Code'}</span>
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-body hover:text-ink transition-colors"
                >
                  <ArrowLeftIcon className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: LINK DISPATCHED */}
          {step === 'sent' && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2Icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-ink">Check Your Inbox</h2>
                <p className="text-xs text-body mt-1">
                  We sent recovery instructions and a 6-digit verification code to{' '}
                  <span className="font-semibold text-ink">{email}</span>.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-canvas/80 p-3.5 space-y-2 text-center">
                <p className="text-[11px] text-subtle">
                  Simulated Code: <span className="font-mono font-bold text-ink">988-247</span>
                </p>
                <button
                  type="button"
                  onClick={() => setStep('reset')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <SparklesIcon className="h-3.5 w-3.5" />
                  Proceed to Enter New Password
                </button>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-body hover:text-ink transition-colors"
                >
                  <ArrowLeftIcon className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

          {/* STEP 3: SET NEW PASSWORD */}
          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <h2 className="font-display text-base font-bold text-ink">Set New Password</h2>
                <p className="text-[11.5px] text-subtle mt-0.5">
                  Create a strong password for your administrator account.
                </p>
              </div>

              {error && (
                <div className="rounded-xl bg-danger-bg p-3 text-xs text-danger border border-danger/20">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="reset-code">Verification Code</Label>
                <Input
                  id="reset-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="988-247"
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <Label htmlFor="reset-new-pass">New Password</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                  <Input
                    id="reset-new-pass"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="pl-9 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reset-confirm-pass">Confirm New Password</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                  <Input
                    id="reset-confirm-pass"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="pl-9 text-xs font-mono"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full justify-center py-2.5">
                <span>{loading ? 'Updating password…' : 'Update Password & Sign In'}</span>
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-body hover:text-ink transition-colors"
                >
                  <ArrowLeftIcon className="h-3.5 w-3.5" />
                  Cancel and Return to Sign In
                </Link>
              </div>
            </form>
          )}

          {/* STEP 4: COMPLETED */}
          {step === 'completed' && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2Icon className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Password Reset Successfully!</h2>
                <p className="text-xs text-body mt-1">
                  Your administrator credentials have been updated securely.
                </p>
              </div>

              <Button onClick={() => navigate('/login')} className="w-full justify-center py-2.5">
                Sign In With New Password
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
