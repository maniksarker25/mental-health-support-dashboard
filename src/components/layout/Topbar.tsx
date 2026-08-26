import React from 'react';
import { MoonIcon, SunIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAdminStore } from '../../contexts/AdminStore';
import { useAuth } from '../../contexts/AuthContext';
import { Tooltip } from '../ui/Tooltip';

export function Topbar({ eyebrow, title }: { eyebrow: string; title: string }) {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { profile } = useAdminStore();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.name || profile.name;
  const displayRole = user?.role || profile.role;
  const displayInitials = user?.initials || profile.initials;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-surface px-5 py-3.5 lg:px-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-subtle">{eyebrow}</p>
        <h1 className="font-display text-[19px] font-medium leading-tight text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark/Light Mode Switcher */}
        <Tooltip label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          <button
            onClick={toggle}
            aria-label="Toggle color theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-body transition-colors duration-150 ease-calm hover:bg-primary-tint hover:text-primary"
          >
            {theme === 'light' ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
          </button>
        </Tooltip>

        {/* User Info Profile Pill */}
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-2.5 py-1.5 hover:bg-canvas transition-colors text-left"
          title="Account Settings"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-[11px] font-bold text-primary font-mono">
            {displayInitials}
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-[12.5px] font-semibold text-ink truncate max-w-[120px]">
              {displayName}
            </span>
            <span className="block text-[10.5px] text-subtle truncate max-w-[120px]">
              {displayRole}
            </span>
          </span>
        </button>

        {/* Dedicated Sign Out Button */}
        <Tooltip label="Sign Out / Logout">
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out from dashboard"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-xs font-medium text-body transition-colors duration-150 ease-calm hover:bg-danger-bg hover:text-danger hover:border-danger/30"
          >
            <LogOutIcon className="h-4 w-4" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </Tooltip>
      </div>
    </header>
  );
}