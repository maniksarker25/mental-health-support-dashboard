import React from 'react';
import { cn } from '../../utils/cn';
import { TONE_META } from '../../data/topics';
import type { ToneKey } from '../../types';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'primary';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-canvas border-line text-body',
  primary: 'bg-primary-tint border-primary/20 text-primary',
  success: 'bg-success-bg border-success/20 text-success',
  warning: 'bg-warning-bg border-warning/25 text-warning',
  danger: 'bg-danger-bg border-danger/25 text-danger'
};

export function Badge({
  tone = 'neutral',
  className,
  children




}: {tone?: BadgeTone;className?: string;children: React.ReactNode;}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[12px] font-medium',
        TONES[tone],
        className
      )}>
      
      {children}
    </span>);

}

export function ToneBadge({ tone, className }: {tone: ToneKey;className?: string;}) {
  const meta = TONE_META[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[12px] font-medium',
        meta.chip,
        className
      )}>
      
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {meta.label}
    </span>);

}

export function StatusDot({ status }: {status: 'operational' | 'degraded' | 'down';}) {
  return (
    <span
      className={cn(
        'inline-block h-2 w-2 rounded-full',
        status === 'operational' && 'bg-success',
        status === 'degraded' && 'bg-warning',
        status === 'down' && 'bg-danger'
      )} />);


}