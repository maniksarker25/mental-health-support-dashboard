import React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAdminStore } from '../../contexts/AdminStore';
import { Tooltip } from '../ui/Tooltip';

export function Topbar({ eyebrow, title }: {eyebrow: string;title: string;}) {
  const { theme, toggle } = useTheme();
  const { profile } = useAdminStore();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-surface px-5 py-3.5 lg:px-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-subtle">{eyebrow}</p>
        <h1 className="font-display text-[19px] font-medium leading-tight text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Tooltip label={theme === 'light' ? 'Switch to dark' : 'Switch to light'}>
          <button
            onClick={toggle}
            aria-label="Toggle color theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-body transition-colors duration-150 ease-calm hover:bg-primary-tint hover:text-primary">
            
            {theme === 'light' ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
          </button>
        </Tooltip>

        <div className="flex items-center gap-2.5 border-l border-line pl-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-tint text-[12px] font-semibold text-primary">
            {profile.initials}
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-[13px] font-medium text-ink">{profile.name}</span>
            <span className="block text-[11.5px] text-subtle">{profile.role}</span>
          </span>
        </div>
      </div>
    </header>);

}