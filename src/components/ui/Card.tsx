import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-card border border-line bg-surface shadow-card', className)}
      {...props} />);


}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4',
        className
      )}>
      
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold leading-tight text-ink">{title}</h3>
        {description ? <p className="mt-1 text-[13px] leading-snug text-body">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>);

}

export function SectionTitle({
  title,
  description,
  action




}: {title: string;description?: string;action?: React.ReactNode;}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-[22px] font-medium leading-tight text-ink">{title}</h2>
        {description ? <p className="mt-1 max-w-2xl text-sm text-body">{description}</p> : null}
      </div>
      {action}
    </div>);

}