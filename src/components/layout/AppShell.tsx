import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MobileNav, Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const META: Record<string, { eyebrow: string; title: string }> = {
  '/dashboard': { eyebrow: 'Overview', title: 'Executive dashboard' },
  '/topics': { eyebrow: 'Content', title: 'Topics & Resource Webpages' },
  '/topics/new': { eyebrow: 'Builder', title: 'Create Topic & Resource' },
  '/privacy': { eyebrow: 'Compliance', title: 'Privacy Policy & Zero-Retention Architecture' },
  '/terms': { eyebrow: 'Legal & Clinical', title: 'Terms of Service & Boundary Agreement' },
  '/faq': { eyebrow: 'Help Center', title: 'Frequently Asked Questions (FAQ)' },
  '/settings': { eyebrow: 'Account', title: 'Settings & Emergency Hotlines' },
};

export function AppShell() {
  const { pathname } = useLocation();
  const meta = META[pathname] ?? META['/dashboard'];

  return (
    <div className="flex h-full w-full bg-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar eyebrow={meta.eyebrow} title={meta.title} />
        <MobileNav />
        <main className="mha-scroll flex-1 overflow-y-auto px-5 py-6 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>
    </div>);

}