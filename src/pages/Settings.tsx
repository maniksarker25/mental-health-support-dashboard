import React from 'react';
import { SectionTitle } from '../components/ui/Card';
import { AdminProfileCard } from '../components/settings/AdminProfileCard';
import { ChangePasswordCard } from '../components/settings/ChangePasswordCard';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Settings & Configurations"
        description="Admin account profile and security credentials."
      />

      {/* Admin Profile & Password */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <AdminProfileCard />
        <ChangePasswordCard />
      </div>
    </div>
  );
}