import React from 'react';
import { cn } from '../../utils/cn';

export function Skeleton({ className, style }: {className?: string;style?: React.CSSProperties;}) {
  return <div style={style} className={cn('animate-pulse rounded-md bg-line/70', className)} />;
}

export function TableSkeleton({ rows = 6, columns = 5 }: {rows?: number;columns?: number;}) {
  return (
    <div className="divide-y divide-line" aria-hidden="true">
      {Array.from({ length: rows }).map((_, r) =>
      <div key={r} className="flex items-center gap-4 px-5 py-3.5">
          {Array.from({ length: columns }).map((_, c) =>
        <Skeleton
          key={c}
          className={cn('h-4', c === 0 ? 'w-44' : c === columns - 1 ? 'ml-auto w-16' : 'w-24')} />

        )}
        </div>
      )}
    </div>);

}

export function ChartSkeleton({ className }: {className?: string;}) {
  return (
    <div className={cn('flex items-end gap-2 px-5 py-6', className)} aria-hidden="true">
      {[42, 68, 55, 80, 48, 72, 60, 88, 52, 76].map((h, i) =>
      <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />
      )}
    </div>);

}

export function EmptyState({
  icon,
  title,
  description,
  action





}: {icon?: React.ReactNode;title: string;description?: string;action?: React.ReactNode;}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      {icon ?
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-canvas text-subtle">
          {icon}
        </div> :
      null}
      <p className="text-sm font-medium text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-[13px] text-body">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>);

}