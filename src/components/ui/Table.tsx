import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export function TableShell({ children }: {children: React.ReactNode;}) {
  return (
    <div className="mha-scroll overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-sm">{children}</table>
    </div>);

}

export function Th({
  children,
  className,
  align = 'left'




}: {children?: React.ReactNode;className?: string;align?: 'left' | 'right' | 'center';}) {
  return (
    <th
      scope="col"
      className={cn(
        'border-b border-line bg-canvas/60 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle',
        align === 'left' && 'text-left',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className
      )}>
      
      {children}
    </th>);

}

export function Td({
  children,
  className,
  align = 'left'




}: {children?: React.ReactNode;className?: string;align?: 'left' | 'right' | 'center';}) {
  return (
    <td
      className={cn(
        'border-b border-line px-5 py-3 align-middle text-body',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className
      )}>
      
      {children}
    </td>);

}

export function SearchInput({
  value,
  onChange,
  placeholder,
  className





}: {value: string;onChange: (v: string) => void;placeholder: string;className?: string;}) {
  return (
    <div className={cn('relative', className)}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-subtle transition-[border-color,box-shadow] duration-150 ease-calm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15" />
      
    </div>);

}

export function Pagination({
  page,
  totalPages,
  from,
  to,
  total,
  onPage,
  unit








}: {page: number;totalPages: number;from: number;to: number;total: number;onPage: (p: number) => void;unit: string;}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
      <p className="text-[12px] text-body">
        Showing <span className="font-medium text-ink">{from}</span>–
        <span className="font-medium text-ink">{to}</span> of{' '}
        <span className="font-medium text-ink">{total}</span> {unit}
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page <= 1}>
          
          <ChevronLeftIcon className="h-3.5 w-3.5" />
          Prev
        </Button>
        <span className="px-1 text-[12px] text-body">
          {page} / {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}>
          
          Next
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>);

}