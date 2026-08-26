import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

const CONTROL =
'w-full rounded-lg border border-line bg-surface text-sm text-ink placeholder:text-subtle transition-[border-color,box-shadow] duration-150 ease-calm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15';

export function Label({
  children,
  htmlFor,
  hint




}: {children: React.ReactNode;htmlFor?: string;hint?: string;}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-ink">
      {children}
      {hint ? <span className="ml-2 font-normal text-subtle">{hint}</span> : null}
    </label>);

}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL, 'h-10 px-3', className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(CONTROL, 'px-3 py-2.5 leading-relaxed', className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative w-full min-w-0">
      <select className={cn(CONTROL, 'h-10 appearance-none pl-3 pr-9', className)} {...props}>
        {children}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
        aria-hidden="true" />
      
    </div>);

}

export function Switch({
  checked,
  onChange,
  label,
  description,
  id






}: {checked: boolean;onChange: (next: boolean) => void;label: string;description?: string;id?: string;}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-ink">{label}</p>
        {description ? <p className="mt-0.5 text-[12px] leading-snug text-body">{description}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 ease-calm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
          checked ? 'border-primary bg-primary' : 'border-line bg-canvas'
        )}>
        
        <span
          className={cn(
            'absolute top-[2px] block h-[18px] w-[18px] rounded-full bg-surface shadow-sm transition-transform duration-200 ease-calm',
            checked ? 'translate-x-[23px]' : 'translate-x-[3px]'
          )} />
        
      </button>
    </div>);

}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel





}: {value: T;options: {value: T;label: string;}[];onChange: (next: T) => void;ariaLabel: string;}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-0.5 rounded-lg border border-line bg-canvas p-0.5">
      
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-[6px] px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ease-calm',
              active ? 'bg-surface text-ink shadow-sm' : 'text-body hover:text-ink'
            )}>
            
            {option.label}
          </button>);

      })}
    </div>);

}