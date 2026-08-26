import React, { useState } from 'react';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon, KeyRoundIcon } from 'lucide-react';
import { useAdminStore } from '../../contexts/AdminStore';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input, Label } from '../ui/Field';
import { relativeTime } from '../../utils/format';
import { cn } from '../../utils/cn';

interface Rule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

const RULES: Rule[] = [
{ id: 'len', label: 'At least 12 characters', test: (v) => v.length >= 12 },
{ id: 'case', label: 'Upper and lowercase letters', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
{ id: 'num', label: 'A number', test: (v) => /\d/.test(v) },
{ id: 'sym', label: 'A symbol', test: (v) => /[^A-Za-z0-9]/.test(v) }];


export function ChangePasswordCard() {
  const { changePassword, passwordUpdatedAt } = useAdminStore();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const passed = RULES.filter((rule) => rule.test(next)).length;
  const strength = next.length === 0 ? 0 : passed;
  const strengthLabel = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][strength];

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!current) {
      setError('Enter your current password.');
      return;
    }
    if (passed < RULES.length) {
      setError('Your new password does not meet all requirements yet.');
      return;
    }
    if (next !== confirm) {
      setError('The confirmation does not match your new password.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const result = changePassword(current, next);
      setSaving(false);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setError(null);
      setCurrent('');
      setNext('');
      setConfirm('');
      toast.success(result.message);
    }, 420);
  };

  return (
    <Card>
      <CardHeader
        title="Change password"
        description={`Last changed ${relativeTime(passwordUpdatedAt)}. Changing it signs out every other session.`} />
      
      <form onSubmit={submit} className="space-y-4 p-5">
        <div>
          <Label htmlFor="pw-current">Current password</Label>
          <div className="relative">
            <Input
              id="pw-current"
              type={reveal ? 'text' : 'password'}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoComplete="current-password"
              className="pr-10" />
            
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              aria-label={reveal ? 'Hide passwords' : 'Show passwords'}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-subtle transition-colors duration-150 ease-calm hover:text-ink">
              
              {reveal ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1 text-[11.5px] text-subtle">
            Demo credential: <span className="font-mono">Anonymous2026!</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="pw-new">New password</Label>
            <Input
              id="pw-new"
              type={reveal ? 'text' : 'password'}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password" />
            
          </div>
          <div>
            <Label htmlFor="pw-confirm">Confirm new password</Label>
            <Input
              id="pw-confirm"
              type={reveal ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              aria-invalid={confirm.length > 0 && confirm !== next} />
            
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-medium text-body">Strength</p>
            <p
              className={cn(
                'text-[12px] font-semibold',
                strength <= 1 && 'text-danger',
                strength === 2 && 'text-warning',
                strength === 3 && 'text-warning',
                strength === 4 && 'text-success'
              )}>
              
              {strengthLabel}
            </p>
          </div>
          <div className="mt-1.5 flex gap-1.5">
            {RULES.map((rule, index) =>
            <span
              key={rule.id}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors duration-150 ease-calm',
                index < strength ?
                strength === 4 ?
                'bg-success' :
                'bg-warning' :
                'bg-line'
              )} />

            )}
          </div>
          <ul className="mt-2.5 grid grid-cols-1 gap-1 sm:grid-cols-2">
            {RULES.map((rule) => {
              const ok = rule.test(next);
              return (
                <li
                  key={rule.id}
                  className={cn('text-[11.5px]', ok ? 'text-success' : 'text-subtle')}>
                  
                  {ok ? '✓' : '•'} {rule.label}
                </li>);

            })}
          </ul>
        </div>

        {error ? <p className="text-[12px] text-danger">{error}</p> : null}

        <div className="flex justify-end border-t border-line pt-4">
          <Button type="submit" disabled={saving}>
            <KeyRoundIcon className="h-4 w-4" />
            {saving ? 'Updating…' : 'Update password'}
          </Button>
        </div>
      </form>
    </Card>);

}