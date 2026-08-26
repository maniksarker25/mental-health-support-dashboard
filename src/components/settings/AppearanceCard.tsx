import React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardHeader } from '../ui/Card';
import { cn } from '../../utils/cn';

const OPTIONS = [
{
  value: 'light' as const,
  label: 'Porcelain',
  detail: 'Warm daylight canvas, forest green accents.',
  icon: SunIcon,
  swatches: ['#f5f6f2', '#ffffff', '#2e5e52', '#e1e6e2']
},
{
  value: 'dark' as const,
  label: 'Botanical night',
  detail: 'Deep charcoal for late-shift support work.',
  icon: MoonIcon,
  swatches: ['#121816', '#1a2320', '#63a08d', '#2b3733']
}];


export function AppearanceCard() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader
        title="Appearance"
        description="Applies to this console only. The mobile app follows the device setting." />
      
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const active = theme === option.value;
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              aria-pressed={active}
              className={cn(
                'rounded-card border p-4 text-left transition-[border-color,background-color] duration-150 ease-calm',
                active ?
                'border-primary/40 bg-primary-tint' :
                'border-line bg-surface hover:border-primary/25'
              )}>
              
              <div className="flex items-center gap-2">
                <Icon className={cn('h-4 w-4', active ? 'text-primary' : 'text-body')} />
                <p className={cn('text-[13.5px] font-semibold', active ? 'text-primary' : 'text-ink')}>
                  {option.label}
                </p>
                {active ?
                <span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
                    Active
                  </span> :
                null}
              </div>
              <p className="mt-1.5 text-[12px] leading-snug text-body">{option.detail}</p>
              <div className="mt-3 flex gap-1.5">
                {option.swatches.map((color) =>
                <span
                  key={color}
                  className="h-6 w-full rounded-md border border-black/10"
                  style={{ backgroundColor: color }} />

                )}
              </div>
            </button>);

        })}
      </div>
    </Card>);

}