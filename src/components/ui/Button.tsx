import React from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
  'bg-primary text-primary-fg border border-transparent hover:bg-primary-hover active:scale-[0.98]',
  secondary:
  'bg-surface text-ink border border-line hover:bg-primary-tint hover:border-primary/30 active:scale-[0.98]',
  ghost: 'bg-transparent text-body border border-transparent hover:bg-primary-tint hover:text-ink',
  danger: 'bg-danger-bg text-danger border border-danger/25 hover:bg-danger hover:text-white'
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  icon: 'h-9 w-9 justify-center'
};

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center rounded-lg font-medium transition-[background-color,border-color,color,transform] duration-150 ease-calm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props} />);


}