import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  GaugeIcon,
  LibraryIcon,
  ScaleIcon,
  SettingsIcon,
  ShieldCheckIcon,
  HelpCircleIcon,
  HeartIcon,
  LogOutIcon,
  UsersIcon,
  MessageSquareIcon,
  ShieldAlertIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: GaugeIcon, hint: 'Overview' },
  { to: '/users', label: 'User Management', icon: UsersIcon, hint: 'Users' },
  { to: '/messages', label: 'All Messages', icon: MessageSquareIcon, hint: 'Messages' },
  { to: '/reports', label: 'Reports', icon: ShieldAlertIcon, hint: 'Reports' },
  { to: '/topics', label: 'Topics & Resources', icon: LibraryIcon, hint: 'Content' },
  { to: '/privacy', label: 'Privacy Policy', icon: ShieldCheckIcon, hint: 'Privacy' },
  { to: '/terms', label: 'Terms of Service', icon: ScaleIcon, hint: 'Terms' },
  { to: '/faq', label: 'FAQ & Help', icon: HelpCircleIcon, hint: 'FAQs' },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, hint: 'Settings' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden w-[248px] shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary text-primary-fg shadow-xs">
          <HeartIcon className="h-[18px] w-[18px]" />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-[15px] font-bold text-ink">
            Mental Health
          </span>
          <span className="block text-[11px] uppercase tracking-[0.1em] text-subtle font-medium">
            Admin Console
          </span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-2" aria-label="Primary">
        <ul className="space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors duration-150 ease-calm',
                    isActive
                      ? 'bg-primary-tint text-primary font-semibold'
                      : 'text-body hover:bg-canvas hover:text-ink'
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button in sidebar footer */}
      <div className="px-3 pb-1">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-subtle transition-colors duration-150 ease-calm hover:bg-danger-bg hover:text-danger"
        >
          <LogOutIcon className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="m-3 rounded-xl border border-line bg-canvas p-3.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <p className="text-[12px] font-semibold text-ink">Zero retention active</p>
        </div>
        <p className="mt-1.5 text-[11.5px] leading-snug text-body">
          0 bytes of recipient data stored on disk. Buffer purged after delivery.
        </p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-line bg-surface px-3 py-2 lg:hidden"
      aria-label="Primary"
    >
      {NAV.map(({ to, label, icon: Icon, hint }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition-colors duration-150 ease-calm',
              isActive ? 'bg-primary-tint text-primary font-semibold' : 'text-body hover:text-ink'
            )
          }
        >
          <Icon className="h-3.5 w-3.5" />
          <span>{hint}</span>
          <span className="sr-only">{label}</span>
        </NavLink>
      ))}

      <button
        type="button"
        onClick={() => {
          logout();
          navigate('/login');
        }}
        className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium text-danger hover:bg-danger-bg"
      >
        <LogOutIcon className="h-3.5 w-3.5" />
        <span>Out</span>
      </button>
    </nav>
  );
}